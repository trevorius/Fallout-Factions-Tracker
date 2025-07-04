"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { OrganizationRole } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

async function hasPermission(userId: string, orgId: string) {
  const member = await prisma.organizationMember.findFirst({
    where: {
      organizationId: orgId,
      userId: userId,
    },
  });
  const allowedRoles: OrganizationRole[] = [
    OrganizationRole.ADMIN,
    OrganizationRole.OWNER,
  ];
  if (!member || !allowedRoles.includes(member.role)) {
    return false;
  }
  return true;
}

type TemplateAccessData = {
  factionIds: string[];
  unitTemplateIds: string[];
  perkIds: string[];
  standardWeaponIds: string[];
  traitIds: string[];
  criticalEffectIds: string[];
  weaponTemplateIds: string[];
};

export async function updateTemplateAccess(
  organizationId: string,
  data: TemplateAccessData
) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/unauthorized");
  }

  const authorized = await hasPermission(session.user.id, organizationId);
  if (!authorized) {
    redirect("/unauthorized");
  }

  try {
    await prisma.$transaction(async (tx) => {
      // Clear existing associations
      await tx.organizationFaction.deleteMany({ where: { organizationId } });
      await tx.organizationUnitTemplate.deleteMany({
        where: { organizationId },
      });
      await tx.organizationPerk.deleteMany({ where: { organizationId } });
      await tx.organizationStandardWeapon.deleteMany({
        where: { organizationId },
      });
      await tx.organizationTrait.deleteMany({ where: { organizationId } });
      await tx.organizationCriticalEffect.deleteMany({
        where: { organizationId },
      });
      await tx.organizationWeaponTemplate.deleteMany({
        where: { organizationId },
      });

      // Create new associations
      await tx.organizationFaction.createMany({
        data: data.factionIds.map((id) => ({ organizationId, factionId: id })),
      });
      await tx.organizationUnitTemplate.createMany({
        data: data.unitTemplateIds.map((id) => ({
          organizationId,
          unitTemplateId: id,
        })),
      });
      await tx.organizationPerk.createMany({
        data: data.perkIds.map((id) => ({ organizationId, perkId: id })),
      });
      await tx.organizationStandardWeapon.createMany({
        data: data.standardWeaponIds.map((id) => ({
          organizationId,
          standardWeaponId: id,
        })),
      });
      await tx.organizationTrait.createMany({
        data: data.traitIds.map((id) => ({ organizationId, traitId: id })),
      });
      await tx.organizationCriticalEffect.createMany({
        data: data.criticalEffectIds.map((id) => ({
          organizationId,
          criticalEffectId: id,
        })),
      });
      await tx.organizationWeaponTemplate.createMany({
        data: data.weaponTemplateIds.map((id) => ({
          organizationId,
          weaponTemplateId: id,
        })),
      });
    });

    revalidatePath(`/organizations/${organizationId}/admin/templates`);
    return { success: true, message: "Template access updated successfully." };
  } catch (error) {
    console.error("Failed to update template access:", error);
    return { success: false, message: "Failed to update template access." };
  }
}
