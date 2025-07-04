"use server";

import { prisma as db } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { FormState } from "./types";
import { userIsSuperAdmin } from "@/lib/auth.utils";

async function canManageTraits() {
  const isSuperAdmin = await userIsSuperAdmin();
  return isSuperAdmin;
}

export async function createTrait(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  if (!(await canManageTraits())) {
    return { message: "Error: You are not authorized to create traits." };
  }
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  try {
    if (!name) {
      return { message: "Error: Name is required." };
    }
    await db.trait.create({
      data: {
        name,
        description,
      },
    });
    revalidatePath("/superadmin/traits");
    return { message: "Trait created successfully." };
  } catch (e) {
    console.error(e);
    return { message: "Error: Could not create trait." };
  }
}

export async function updateTrait(
  id: string,
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  if (!(await canManageTraits())) {
    return { message: "Error: You are not authorized to update traits." };
  }
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  try {
    if (!name) {
      return { message: "Error: Name is required." };
    }
    await db.trait.update({
      where: { id },
      data: {
        name,
        description,
      },
    });
    revalidatePath("/superadmin/traits");
    return { message: "Trait updated successfully." };
  } catch (e) {
    console.error(e);
    return { message: "Error: Could not update trait." };
  }
}

export async function deleteTrait(id: string) {
  if (!(await canManageTraits())) {
    return { message: "Error: You are not authorized to delete traits." };
  }
  try {
    await db.trait.delete({
      where: { id },
    });
    revalidatePath("/superadmin/traits");
    return { message: "Trait deleted successfully." };
  } catch (e) {
    console.error(e);
    return { message: "Error: Could not delete trait." };
  }
}
