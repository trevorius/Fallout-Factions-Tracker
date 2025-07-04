import { prisma } from "@/lib/prisma";
import { CrewForm } from "@/components/crews/crew-form";

async function getNewCrewPageData(organizationId: string) {
  const factions = await prisma.faction.findMany({
    where: {
      organizations: {
        some: {
          organizationId,
        },
      },
    },
    orderBy: {
      name: "asc",
    },
  });

  return { factions };
}

export default async function NewCrewPage({
  params,
}: {
  params: Promise<{ organizationId: string }>;
}) {
  const { organizationId } = await params;
  const { factions } = await getNewCrewPageData(organizationId);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Create a New Crew</h1>
        <p className="text-muted-foreground">
          Choose a faction and start building your crew by adding units.
        </p>
      </div>
      <CrewForm factions={factions} organizationId={organizationId} />
    </div>
  );
}
