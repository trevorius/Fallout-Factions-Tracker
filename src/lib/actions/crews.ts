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

  const initialPower = roster.reduce((acc, item) => acc + item.cost, 0);

  try {
    await prisma.$transaction(async (tx) => {
      const newCrew = await tx.crew.create({
        data: {
          name,
          factionId,
          organizationId,
          userId: session.user.id,
          power: initialPower,
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
