"use server";

import { prisma as db } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { FormState } from "./types";
import { userIsSuperAdmin } from "@/lib/auth.utils";

async function canCreateFaction() {
  const isSuperAdmin = await userIsSuperAdmin();
  return isSuperAdmin;
}

export async function createFaction(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  if (!(await canCreateFaction())) {
    return { message: "Error: You are not authorized to create factions." };
  }
  const name = formData.get("name") as string;
  try {
    if (!name) {
      return { message: "Error: Name is required." };
    }
    await db.faction.create({
      data: {
        name,
      },
    });
    revalidatePath("/superadmin/factions");
    return { message: "Faction created successfully." };
  } catch (e) {
    console.error(e);
    return { message: "Error: Could not create faction." };
  }
}

export async function updateFaction(
  id: string,
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  if (!(await canCreateFaction())) {
    return { message: "Error: You are not authorized to update factions." };
  }
  const name = formData.get("name") as string;
  try {
    if (!name) {
      return { message: "Error: Name is required." };
    }
    await db.faction.update({
      where: { id },
      data: {
        name,
      },
    });
    revalidatePath("/superadmin/factions");
    return { message: "Faction updated successfully." };
  } catch (e) {
    console.error(e);
    return { message: "Error: Could not update faction." };
  }
}

export async function deleteFaction(id: string) {
  if (!(await canCreateFaction())) {
    return { message: "Error: You are not authorized to delete factions." };
  }
  try {
    await db.faction.delete({
      where: { id },
    });
    revalidatePath("/superadmin/factions");
  } catch (e) {
    console.error(e);
    return { message: "Error: Could not delete faction." };
  }
}
