"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { WeaponTypeState } from "./types";
import { auth } from "../../../auth";

const WeaponTypeSchema = z.object({
  name: z.string().min(1, "Name is required."),
});
const canCreateWeaponType = async () => {
  const session = await auth();
  const user = await prisma.user.findUnique({
    where: {
      id: session?.user?.id,
    },
  });
  return user?.isSuperAdmin;
};

export async function createWeaponType(
  prevState: WeaponTypeState,
  formData: FormData
): Promise<WeaponTypeState> {
  if (!canCreateWeaponType()) {
    return {
      message: "You are not authorized to create weapon types.",
    };
  }

  const validatedFields = WeaponTypeSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Create Weapon Type.",
    };
  }

  try {
    await prisma.weaponType.create({
      data: validatedFields.data,
    });
  } catch (error) {
    console.error("Database Error: Failed to Create Weapon Type.", error);
    return {
      message: "Database Error: Failed to Create Weapon Type.",
    };
  }

  revalidatePath("/superadmin/weapon-types");
  return { message: "Weapon Type created successfully." };
}

export async function updateWeaponType(
  id: string,
  prevState: WeaponTypeState,
  formData: FormData
): Promise<WeaponTypeState> {
  if (!canCreateWeaponType()) {
    return {
      message: "You are not authorized to update weapon types.",
    };
  }

  const validatedFields = WeaponTypeSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Update Weapon Type.",
    };
  }

  try {
    await prisma.weaponType.update({
      where: { id },
      data: validatedFields.data,
    });
  } catch (error) {
    console.error("Database Error: Failed to Update Weapon Type.", error);
    return {
      message: "Database Error: Failed to Update Weapon Type.",
    };
  }

  revalidatePath("/superadmin/weapon-types");
  return { message: "Weapon Type updated successfully." };
}

export async function deleteWeaponType(id: string) {
  if (!canCreateWeaponType()) {
    return {
      message: "You are not authorized to delete weapon types.",
    };
  }

  try {
    await prisma.weaponType.delete({
      where: { id },
    });
    revalidatePath("/superadmin/weapon-types");
    return { message: "Weapon Type deleted." };
  } catch (error) {
    console.error("Database Error: Failed to Delete Weapon Type.", error);
    return {
      message: "Database Error: Failed to Delete Weapon Type.",
    };
  }
}
