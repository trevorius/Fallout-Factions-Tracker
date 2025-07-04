"use server";

import { prisma } from "../prisma";
import { auth } from "@/auth";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function getUnitTemplatesForFaction(factionId: string) {
  if (!factionId) return [];

  return prisma.unitTemplate.findMany({
    where: { factionId },
    include: {
      unitClass: {
        select: { name: true },
      },
      perks: {
        include: {
          perk: {
            select: { name: true },
          },
        },
      },
      weaponTemplates: {
        include: {
          weaponTemplate: {
            include: {
              standardWeapons: {
                include: {
                  standardWeapon: {
                    select: { name: true },
                  },
                },
              },
            },
          },
        },
      },
    },
    orderBy: {
      name: "asc",
    },
  });
}

const RosterItemSchema = z.object({
  unitTemplateId: z.string(),
  unitTemplateName: z.string(),
  weaponTemplateId: z.string(),
  weaponTemplateName: z.string(),
  cost: z.number(),
});

const CreateCrewSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters."),
  factionId: z.string(),
  organizationId: z.string(),
  roster: z
    .string()
    .transform((val) => JSON.parse(val))
    .pipe(z.array(RosterItemSchema)),
});

export async function createCrew(
  prevState: { message: string },
  formData: FormData
) {
  const session = await auth();
  if (!session?.user?.id) {
    return { message: "You must be logged in to create a crew." };
  }

  const validatedFields = CreateCrewSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!validatedFields.success) {
    return {
      message:
        validatedFields.error.flatten().fieldErrors.roster?.[0] ||
        "Invalid form data.",
    };
  }

  const { name, factionId, organizationId, roster } = validatedFields.data;

  if (roster.length === 0) {
    return { message: "You must add at least one unit to the crew." };
  }

  const initialReputation = roster.reduce((acc, item) => acc + item.cost, 0);

  try {
    await prisma.$transaction(async (tx) => {
      const newCrew = await tx.crew.create({
        data: {
          name,
          factionId,
          organizationId,
          userId: session.user.id,
          reputation: initialReputation,
          tier: 1,
        },
      });

      for (const rosterItem of roster) {
        const unitTemplate = await tx.unitTemplate.findUniqueOrThrow({
          where: { id: rosterItem.unitTemplateId },
        });

        const newUnit = await tx.unit.create({
          data: {
            name: unitTemplate.name,
            s: unitTemplate.s,
            p: unitTemplate.p,
            e: unitTemplate.e,
            c: unitTemplate.c,
            i: unitTemplate.i,
            a: unitTemplate.a,
            l: unitTemplate.l,
            hp: unitTemplate.hp,
            rating: rosterItem.cost,
            crewId: newCrew.id,
            unitClassId: unitTemplate.unitClassId,
            organizationId,
          },
        });

        const weaponTemplate = await tx.weaponTemplate.findUniqueOrThrow({
          where: { id: rosterItem.weaponTemplateId },
          include: {
            standardWeapons: {
              include: {
                standardWeapon: true,
              },
            },
          },
        });

        for (const { standardWeapon } of weaponTemplate.standardWeapons) {
          await tx.unitWeapon.create({
            data: {
              name: standardWeapon.name,
              range: standardWeapon.range,
              cost: weaponTemplate.cost,
              damage: "",
              rateOfFire: "",
              unitId: newUnit.id,
              standardWeaponId: standardWeapon.id,
            },
          });
        }
      }
    });
  } catch (error) {
    console.error("Failed to create crew:", error);
    return { message: "Failed to create crew. Please try again." };
  }

  revalidatePath(`/organizations/${organizationId}/crews`);
  redirect(`/organizations/${organizationId}/crews`);
}

export async function deleteCrew(crewId: string, organizationId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return {
      success: false,
      message: "You must be logged in to delete a crew.",
    };
  }

  const crew = await prisma.crew.findUnique({
    where: { id: crewId },
    select: {
      userId: true,
      gamesAsCrewOne: { select: { id: true } },
      gamesAsCrewTwo: { select: { id: true } },
    },
  });

  if (!crew) {
    return { success: false, message: "Crew not found." };
  }

  if (crew.userId !== session.user.id) {
    return {
      success: false,
      message: "You are not authorized to delete this crew.",
    };
  }

  if (crew.gamesAsCrewOne.length > 0 || crew.gamesAsCrewTwo.length > 0) {
    return {
      success: false,
      message: "Cannot delete a crew that has participated in games.",
    };
  }

  try {
    await prisma.crew.delete({
      where: { id: crewId },
    });
  } catch (error) {
    console.error("Failed to delete crew:", error);
    return {
      success: false,
      message: "Failed to delete crew. Please try again.",
    };
  }

  revalidatePath(`/organizations/${organizationId}/crews`);
  return { success: true, message: "Crew deleted successfully." };
}

export async function updateCrew(
  prevState: { message: string; success: boolean },
  payload: { crewId: string; organizationId: string; formData: FormData }
) {
  const { crewId, organizationId, formData } = payload;
  const session = await auth();
  if (!session?.user?.id) {
    return {
      success: false,
      message: "You must be logged in to update a crew.",
    };
  }

  const crew = await prisma.crew.findUnique({
    where: { id: crewId, userId: session.user.id },
    include: { units: { select: { id: true } } },
  });

  if (!crew) {
    return {
      success: false,
      message: "Crew not found or you are not authorized.",
    };
  }
  const unitIdsInCrew = new Set(crew.units.map((u) => u.id));

  try {
    await prisma.$transaction(async (tx) => {
      for (const [key, value] of formData.entries()) {
        const newName = value as string;

        if (key === "name") {
          if (!newName || newName.length < 3) {
            throw new Error("Crew name must be at least 3 characters.");
          }
          await tx.crew.update({
            where: { id: crewId },
            data: { name: newName },
          });
        } else if (key.startsWith("unit-") && key.endsWith("-name")) {
          const unitId = key.split("-")[1];

          if (!unitIdsInCrew.has(unitId)) {
            throw new Error(`Unauthorized attempt to update unit ${unitId}.`);
          }

          if (!newName || newName.length < 3) {
            throw new Error(
              `Unit name for ${unitId} must be at least 3 characters.`
            );
          }
          await tx.unit.update({
            where: { id: unitId },
            data: { name: newName },
          });
        }
      }
    });
  } catch (error) {
    console.error("Failed to update crew:", error);
    const message =
      error instanceof Error
        ? error.message
        : "Failed to update crew. Please try again.";
    return { success: false, message };
  }

  revalidatePath(`/organizations/${organizationId}/crews`);
  revalidatePath(`/organizations/${organizationId}/crews/${crewId}/edit`);

  return { success: true, message: "Crew updated successfully." };
}

export async function deleteUnitFromCrew(
  unitId: string,
  organizationId: string
) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, message: "You must be logged in." };
  }

  try {
    const unitToDelete = await prisma.unit.findFirst({
      where: {
        id: unitId,
        crew: {
          userId: session.user.id,
        },
      },
      select: {
        id: true,
        rating: true,
        crewId: true,
      },
    });

    if (!unitToDelete || !unitToDelete.crewId) {
      return {
        success: false,
        message: "Unit not found or you are not authorized.",
      };
    }

    await prisma.$transaction(async (tx) => {
      await tx.unit.delete({
        where: { id: unitToDelete.id },
      });

      await tx.crew.update({
        where: { id: unitToDelete.crewId! },
        data: {
          reputation: {
            decrement: unitToDelete.rating,
          },
        },
      });
    });
    revalidatePath(
      `/organizations/${organizationId}/crews/${unitToDelete.crewId}/edit`
    );
    return { success: true, message: "Unit deleted successfully." };
  } catch (error) {
    console.error("Failed to delete unit:", error);
    return { success: false, message: "Failed to delete unit." };
  }
}

export async function getCrewForRoster(crewId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    // Handle unauthorized access; you might throw an error or return null
    // depending on how you want to handle this at the page level.
    console.error("Unauthorized access attempt to getCrewForRoster");
    return null;
  }

  const crew = await prisma.crew.findUnique({
    where: {
      id: crewId,
      // To ensure a user can only view their own crew's roster,
      // you could uncomment the following line:
      // userId: session.user.id,
    },
    include: {
      faction: { select: { name: true } },
      user: { select: { name: true } },
      units: {
        // We no longer sort here, as we'll do a custom sort below
        // orderBy: { name: "asc" },
        include: {
          unitClass: { select: { name: true } },
          injuries: {
            include: { injury: { select: { name: true, description: true } } },
          },
          perks: {
            include: { perk: { select: { name: true, description: true } } },
          },
          weapons: {
            orderBy: { name: "asc" }, // Sort weapons alphabetically
            include: {
              standardWeapon: {
                include: {
                  traits: { include: { trait: { select: { name: true } } } },
                  criticalEffects: {
                    include: {
                      criticalEffect: { select: { name: true } },
                    },
                  },
                },
              },
              appliedUpgrades: {
                include: {
                  weaponUpgrade: {
                    select: { name: true, description: true },
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  if (crew?.units) {
    const classOrder = ["LEADER", "CHAMPION", "GRUNT"];

    crew.units.sort((a, b) => {
      const aIndex = classOrder.indexOf(a.unitClass.name.toUpperCase());
      const bIndex = classOrder.indexOf(b.unitClass.name.toUpperCase());

      const aScore = aIndex === -1 ? classOrder.length : aIndex;
      const bScore = bIndex === -1 ? classOrder.length : bIndex;

      if (aScore !== bScore) {
        return aScore - bScore;
      }

      // If classes are the same, sort by name
      return a.name.localeCompare(b.name);
    });
  }

  return crew;
}
