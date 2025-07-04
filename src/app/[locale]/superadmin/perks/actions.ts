"use server";

import { prisma as db } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { FormState } from "./types";
import { userIsSuperAdmin } from "@/lib/auth.utils";

async function canManagePerks() {
  const isSuperAdmin = await userIsSuperAdmin();
  return isSuperAdmin;
}

export async function createPerk(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  if (!(await canManagePerks())) {
    return { message: "Error: You are not authorized to create perks." };
  }
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  try {
    if (!name) {
      return { message: "Error: Name is required." };
    }
    await db.perk.create({
      data: {
        name,
        description,
      },
    });
    revalidatePath("/superadmin/perks");
    return { message: "Perk created successfully." };
  } catch (e) {
    console.error(e);
    return { message: "Error: Could not create perk." };
  }
}

export async function updatePerk(
  id: string,
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  if (!(await canManagePerks())) {
    return { message: "Error: You are not authorized to update perks." };
  }
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  try {
    if (!name) {
      return { message: "Error: Name is required." };
    }
    await db.perk.update({
      where: { id },
      data: {
        name,
        description,
      },
    });
    revalidatePath("/superadmin/perks");
    return { message: "Perk updated successfully." };
  } catch (e) {
    console.error(e);
    return { message: "Error: Could not update perk." };
  }
}

export async function deletePerk(id: string) {
  if (!(await canManagePerks())) {
    return { message: "Error: You are not authorized to delete perks." };
  }
  try {
    await db.perk.delete({
      where: { id },
    });
    revalidatePath("/superadmin/perks");
    return { message: "Perk deleted successfully." };
  } catch (e) {
    console.error(e);
    return { message: "Error: Could not delete perk." };
  }
}
