"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { StandardWeaponState } from "./types";
import { auth } from "@/auth";
import { Prisma } from "@prisma/client";

const UpgradeSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  costModifier: z.number().optional(),
  rangeNew: z.string().optional(),
  testAttributeNew: z.enum(["S", "P", "E", "C", "I", "A", "L"]).optional(),
  testValueModifier: z.number().optional(),
  notesNew: z.string().optional(),
  traits: z.array(z.string()).optional(),
  criticalEffects: z.array(z.string()).optional(),
  upgrades: z.string().optional(),
});

const StandardWeaponSchema = z.object({
  name: z.string().min(1, "Name is required."),
  range: z.string().min(1, "Range is required."),
  testAttribute: z.enum(["S", "P", "E", "C", "I", "A", "L"]),
  testValue: z.coerce
    .number()
    .int()
    .positive("Test value must be a positive number."),
  notes: z.string().optional(),
  weaponTypeId: z.string().min(1, "Weapon Type is required."),
  traits: z.array(z.string()).optional(),
  criticalEffects: z.array(z.string()).optional(),
  upgrades: z.string().optional(),
});

const canCreateStandardWeapon = async () => {
  const session = await auth();
  const user = await prisma.user.findUnique({
    where: {
      id: session?.user?.id,
    },
  });
  return user?.isSuperAdmin;
};

async function handleUpgrades(
  tx: Prisma.TransactionClient,
  standardWeaponId: string,
  upgrades: z.infer<typeof UpgradeSchema>[]
) {
  if (upgrades && upgrades.length > 0) {
    // First delete existing available upgrades for this weapon
    await tx.standardWeaponAvailableUpgrade.deleteMany({
      where: { standardWeaponId },
    });

    for (const upgrade of upgrades) {
      const { traits, criticalEffects, ...upgradeData } = upgrade;
      const newUpgrade = await tx.weaponUpgrade.create({
        data: {
          ...upgradeData,
          traits: {
            create: traits?.map((traitId: string) => ({
              trait: { connect: { id: traitId } },
            })),
          },
          criticalEffects: {
            create: criticalEffects?.map((criticalId: string) => ({
              criticalEffect: { connect: { id: criticalId } },
            })),
          },
        },
      });
      await tx.standardWeaponAvailableUpgrade.create({
        data: {
          standardWeaponId: standardWeaponId,
          weaponUpgradeId: newUpgrade.id,
        },
      });
    }
  }
}

export async function createStandardWeapon(
  prevState: StandardWeaponState,
  formData: FormData
): Promise<StandardWeaponState> {
  if (!canCreateStandardWeapon()) {
    return {
      message: "You are not authorized to create standard weapons.",
    };
  }

  const validatedFields = StandardWeaponSchema.safeParse({
    ...Object.fromEntries(formData.entries()),
    traits: formData.getAll("traits"),
    criticalEffects: formData.getAll("criticalEffects"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Create Standard Weapon.",
    };
  }

  const {
    traits,
    criticalEffects,
    upgrades: upgradesJson,
    ...weaponData
  } = validatedFields.data;

  const parsedUpgrades = upgradesJson
    ? z.array(UpgradeSchema).safeParse(JSON.parse(upgradesJson))
    : { success: true, data: [] };

  if (!parsedUpgrades.success) {
    return {
      message: "Invalid upgrade data.",
    };
  }
  const upgrades = parsedUpgrades.data;

  try {
    await prisma.$transaction(async (tx) => {
      const newWeapon = await tx.standardWeapon.create({
        data: {
          ...weaponData,
          traits: {
            create: traits?.map((traitId) => ({
              trait: { connect: { id: traitId } },
            })),
          },
          criticalEffects: {
            create: criticalEffects?.map((effectId) => ({
              criticalEffect: { connect: { id: effectId } },
            })),
          },
        },
      });

      await handleUpgrades(tx, newWeapon.id, upgrades);
    });
  } catch (error) {
    console.error(error);
    return {
      message: "Database Error: Failed to Create Standard Weapon.",
    };
  }

  revalidatePath("/superadmin/standard-weapons");
  return { message: "Standard Weapon created successfully." };
}

export async function updateStandardWeapon(
  id: string,
  prevState: StandardWeaponState,
  formData: FormData
): Promise<StandardWeaponState> {
  if (!canCreateStandardWeapon()) {
    return {
      message: "You are not authorized to update standard weapons.",
    };
  }

  const validatedFields = StandardWeaponSchema.safeParse({
    ...Object.fromEntries(formData.entries()),
    traits: formData.getAll("traits"),
    criticalEffects: formData.getAll("criticalEffects"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Update Standard Weapon.",
    };
  }

  const {
    traits,
    criticalEffects,
    upgrades: upgradesJson,
    ...weaponData
  } = validatedFields.data;

  const parsedUpgrades = upgradesJson
    ? z.array(UpgradeSchema).safeParse(JSON.parse(upgradesJson))
    : { success: true, data: [] };

  if (!parsedUpgrades.success) {
    return {
      message: "Invalid upgrade data.",
    };
  }
  const upgrades = parsedUpgrades.data;

  try {
    await prisma.$transaction(async (tx) => {
      await tx.standardWeapon.update({
        where: { id },
        data: {
          ...weaponData,
          traits: {
            deleteMany: {},
            create: traits?.map((traitId) => ({
              trait: { connect: { id: traitId } },
            })),
          },
          criticalEffects: {
            deleteMany: {},
            create: criticalEffects?.map((effectId) => ({
              criticalEffect: { connect: { id: effectId } },
            })),
          },
        },
      });
      await handleUpgrades(tx, id, upgrades);
    });
  } catch (error) {
    console.error(error);
    return {
      message: "DatabaseError: Failed to Update Standard Weapon.",
    };
  }

  revalidatePath("/superadmin/standard-weapons");
  return { message: "Standard Weapon updated successfully." };
}

export async function deleteStandardWeapon(id: string) {
  if (!canCreateStandardWeapon()) {
    return {
      message: "You are not authorized to delete standard weapons.",
    };
  }

  try {
    await prisma.standardWeapon.delete({
      where: { id },
    });
    revalidatePath("/superadmin/standard-weapons");
    return { message: "Standard Weapon deleted." };
  } catch (error) {
    console.error(error);
    return {
      message: "Database Error: Failed to Delete Standard Weapon.",
    };
  }
}
