import { prisma } from "@/lib/prisma";
import TemplateAccessForm from "./components/TemplateAccessForm";

async function getTemplateData(organizationId: string) {
  const [
    factions,
    unitTemplates,
    perks,
    standardWeapons,
    traits,
    criticalEffects,
    weaponTemplates,
    organization,
  ] = await Promise.all([
    prisma.faction.findMany({
      include: {
        unitTemplates: true,
      },
    }),
    prisma.unitTemplate.findMany({
      include: {
        perks: { include: { perk: true } },
        weaponTemplates: {
          include: {
            weaponTemplate: {
              include: {
                standardWeapons: {
                  include: {
                    standardWeapon: {
                      include: {
                        traits: { include: { trait: true } },
                        criticalEffects: { include: { criticalEffect: true } },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    }),
    prisma.perk.findMany(),
    prisma.standardWeapon.findMany(),
    prisma.trait.findMany(),
    prisma.criticalEffect.findMany(),
    prisma.weaponTemplate.findMany(),
    prisma.organization.findUnique({
      where: { id: organizationId },
      include: {
        factions: { select: { factionId: true } },
        unitTemplates: { select: { unitTemplateId: true } },
        perks: { select: { perkId: true } },
        standardWeapons: { select: { standardWeaponId: true } },
        traits: { select: { traitId: true } },
        criticalEffects: { select: { criticalEffectId: true } },
        weaponTemplates: { select: { weaponTemplateId: true } },
      },
    }),
  ]);

  return {
    factions,
    unitTemplates,
    perks,
    standardWeapons,
    traits,
    criticalEffects,
    weaponTemplates,
    organization,
  };
}

export default async function TemplateAdminPage({
  params,
}: {
  params: { organizationId: string };
}) {
  const { organizationId } = params;
  const templateData = await getTemplateData(organizationId);

  if (!templateData.organization) {
    return <div>Organization not found.</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold">Template Access Management</h1>
      <p className="text-muted-foreground">
        Here you can manage which templates are available for your organization.
      </p>
      <TemplateAccessForm
        initialData={templateData}
        organizationId={organizationId}
      />
    </div>
  );
}
