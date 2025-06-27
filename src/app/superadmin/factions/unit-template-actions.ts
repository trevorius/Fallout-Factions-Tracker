"use server";

import { prisma as db } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { FormState } from "./types";
import { userIsSuperAdmin } from "../../../lib/auth.utils";

async function canCreateUnitTemplate() {
  const isSuperAdmin = await userIsSuperAdmin();
  return isSuperAdmin;
}

export async function createUnitTemplate(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  if (!(await canCreateUnitTemplate())) {
    return {
      message: "Error: You are not authorized to create unit templates.",
    };
  }
  // Basic validation
  const name = formData.get("name") as string;
  if (!name) return { message: "Error: Name is required" };

  try {
    const s = parseInt(formData.get("s") as string);
    const p = parseInt(formData.get("p") as string);
    const e = parseInt(formData.get("e") as string);
    const c = parseInt(formData.get("c") as string);
    const i = parseInt(formData.get("i") as string);
    const a = parseInt(formData.get("a") as string);
    const l = parseInt(formData.get("l") as string);
    const hp = parseInt(formData.get("hp") as string);
    const factionId = formData.get("factionId") as string;
    const unitClassId = formData.get("unitClassId") as string;
    const perks = JSON.parse(formData.get("perks") as string) as string[];

    await db.unitTemplate.create({
      data: {
        name,
        s,
        p,
        e,
        c,
        i,
        a,
        l,
        hp,
        factionId,
        unitClassId,
        perks: {
          create: perks.map((perkId) => ({
            perk: {
              connect: { id: perkId },
            },
          })),
        },
      },
    });

    revalidatePath(`/superadmin/factions`);
    return { message: "Unit template created successfully." };
  } catch (err) {
    console.error(err);
    return { message: "Error: Could not create unit template." };
  }
}

export async function updateUnitTemplate(
  id: string,
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  if (!(await canCreateUnitTemplate())) {
    return {
      message: "Error: You are not authorized to update unit templates.",
    };
  }
  const name = formData.get("name") as string;
  if (!name) return { message: "Error: Name is required" };

  try {
    const s = parseInt(formData.get("s") as string);
    const p = parseInt(formData.get("p") as string);
    const e = parseInt(formData.get("e") as string);
    const c = parseInt(formData.get("c") as string);
    const i = parseInt(formData.get("i") as string);
    const a = parseInt(formData.get("a") as string);
    const l = parseInt(formData.get("l") as string);
    const hp = parseInt(formData.get("hp") as string);
    const perks = JSON.parse(formData.get("perks") as string) as string[];

    await db.unitTemplate.update({
      where: { id },
      data: {
        name,
        s,
        p,
        e,
        c,
        i,
        a,
        l,
        hp,
        perks: {
          deleteMany: {},
          create: perks.map((perkId) => ({
            perk: {
              connect: { id: perkId },
            },
          })),
        },
      },
    });

    revalidatePath(`/superadmin/factions`);
    return { message: "Unit template updated successfully." };
  } catch (err) {
    console.error(err);
    return { message: "Error: Could not update unit template." };
  }
}

export async function deleteUnitTemplate(id: string): Promise<FormState> {
  if (!(await canCreateUnitTemplate())) {
    return {
      message: "Error: You are not authorized to delete unit templates.",
    };
  }
  try {
    await db.unitTemplate.delete({
      where: { id },
    });

    revalidatePath(`/superadmin/factions`);
    return { message: "Unit template deleted." };
  } catch (err) {
    console.error(err);
    return { message: "Error: Could not delete unit template." };
  }
}
