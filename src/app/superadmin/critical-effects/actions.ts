"use server";

import { prisma as db } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { FormState } from "./types";
import { userIsSuperAdmin } from "@/lib/auth.utils";

async function canManageCriticalEffects() {
  const isSuperAdmin = await userIsSuperAdmin();
  return isSuperAdmin;
}

export async function createCriticalEffect(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  if (!(await canManageCriticalEffects())) {
    return {
      message: "Error: You are not authorized to create critical effects.",
    };
  }
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  try {
    if (!name) {
      return { message: "Error: Name is required." };
    }
    await db.criticalEffect.create({
      data: {
        name,
        description,
      },
    });
    revalidatePath("/superadmin/critical-effects");
    return { message: "Critical effect created successfully." };
  } catch (e) {
    console.error(e);
    return { message: "Error: Could not create critical effect." };
  }
}

export async function updateCriticalEffect(
  id: string,
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  if (!(await canManageCriticalEffects())) {
    return {
      message: "Error: You are not authorized to update critical effects.",
    };
  }
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  try {
    if (!name) {
      return { message: "Error: Name is required." };
    }
    await db.criticalEffect.update({
      where: { id },
      data: {
        name,
        description,
      },
    });
    revalidatePath("/superadmin/critical-effects");
    return { message: "Critical effect updated successfully." };
  } catch (e) {
    console.error(e);
    return { message: "Error: Could not update critical effect." };
  }
}

export async function deleteCriticalEffect(id: string) {
  if (!(await canManageCriticalEffects())) {
    return {
      message: "Error: You are not authorized to delete critical effects.",
    };
  }
  try {
    await db.criticalEffect.delete({
      where: { id },
    });
    revalidatePath("/superadmin/critical-effects");
    return { message: "Critical effect deleted successfully." };
  } catch (e) {
    console.error(e);
    return { message: "Error: Could not delete critical effect." };
  }
}
