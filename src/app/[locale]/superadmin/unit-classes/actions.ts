"use server";

import { prisma as db } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { FormState } from "./types";
import { userIsSuperAdmin } from "@/lib/auth.utils";

async function canCreateUnitClass() {
  const isSuperAdmin = await userIsSuperAdmin();
  return isSuperAdmin;
}

export async function createUnitClass(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  if (!(await canCreateUnitClass())) {
    return { message: "Error: You are not authorized to create unit classes." };
  }
  const name = formData.get("name") as string;
  try {
    if (!name) {
      return { message: "Error: Name is required." };
    }
    await db.unitClass.create({
      data: {
        name,
      },
    });
    revalidatePath("/superadmin/unit-classes");
    return { message: "Unit Class created successfully." };
  } catch (e) {
    console.error(e);
    return { message: "Error: Could not create unit class." };
  }
}

export async function updateUnitClass(
  id: string,
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  if (!(await canCreateUnitClass())) {
    return { message: "Error: You are not authorized to update unit classes." };
  }
  const name = formData.get("name") as string;
  try {
    if (!name) {
      return { message: "Error: Name is required." };
    }
    await db.unitClass.update({
      where: { id },
      data: {
        name,
      },
    });
    revalidatePath("/superadmin/unit-classes");
    return { message: "Unit Class updated successfully." };
  } catch (e) {
    console.error(e);
    return { message: "Error: Could not update unit class." };
  }
}

export async function deleteUnitClass(id: string) {
  if (!(await canCreateUnitClass())) {
    return { message: "Error: You are not authorized to delete unit classes." };
  }
  try {
    await db.unitClass.delete({
      where: { id },
    });
    revalidatePath("/superadmin/unit-classes");
    return { message: "Unit Class deleted successfully." };
  } catch (e) {
    console.error(e);
    return { message: "Error: Could not delete unit class." };
  }
}
