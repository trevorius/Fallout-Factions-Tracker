import { auth } from "@/auth";
import { EditCrewForm } from "@/components/crews/edit-crew-form";
import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";

async function getCrewForEdit(crewId: string, userId: string) {
  const crew = await prisma.crew.findUnique({
    where: {
      id: crewId,
      userId: userId, // Ensure user can only fetch their own crew
    },
    include: {
      faction: {
        select: { name: true },
      },
      user: {
        select: { name: true }, // For Player Name
      },
      units: {
        include: {
          unitClass: {
            select: { name: true },
          },
          injuries: {
            include: {
              injury: {
                select: { name: true, description: true },
              },
            },
          },
          perks: {
            include: {
              perk: {
                select: { name: true, description: true },
              },
            },
          },
          weapons: {
            include: {
              standardWeapon: {
                include: {
                  traits: {
                    include: {
                      trait: {
                        select: { name: true },
                      },
                    },
                  },
                  criticalEffects: {
                    include: {
                      criticalEffect: {
                        select: { name: true },
                      },
                    },
                  },
                },
              },
              appliedUpgrades: {
                include: {
                  weaponUpgrade: {
                    select: { name: true, description: true },
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  if (!crew) {
    notFound();
  }

  return crew;
}

export default async function EditCrewPage({
  params,
}: {
  params: { organizationId: string; crewId: string };
}) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/auth/signin");
  }

  const crew = await getCrewForEdit(params.crewId, session.user.id);

  return <EditCrewForm crew={crew} organizationId={params.organizationId} />;
}
