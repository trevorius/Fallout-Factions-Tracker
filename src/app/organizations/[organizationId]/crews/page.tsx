import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PlusCircle } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { deleteCrew } from "@/lib/actions/crews";

async function getCrewsForUser(organizationId: string, userId: string) {
  const crews = await prisma.crew.findMany({
    where: {
      organizationId,
      userId,
    },
    include: {
      faction: {
        select: { name: true },
      },
      gamesAsCrewOne: {
        select: { id: true },
      },
      gamesAsCrewTwo: {
        select: { id: true },
      },
    },
    orderBy: {
      name: "asc",
    },
  });

  return crews.map((crew) => ({
    ...crew,
    gamesPlayed: crew.gamesAsCrewOne.length + crew.gamesAsCrewTwo.length,
  }));
}

type CrewsWithGamesPlayed = Awaited<ReturnType<typeof getCrewsForUser>>;

interface CrewsListTableProps {
  crews: CrewsWithGamesPlayed;
  organizationId: string;
}

function CrewsListTable({ crews, organizationId }: CrewsListTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Faction</TableHead>
            <TableHead>Games</TableHead>
            <TableHead>Tier</TableHead>
            <TableHead>Reputation</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {crews.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center">
                You haven't created any crews yet.
              </TableCell>
            </TableRow>
          ) : (
            crews.map((crew) => (
              <TableRow key={crew.id}>
                <TableCell className="font-medium">{crew.name}</TableCell>
                <TableCell>{crew.faction.name}</TableCell>
                <TableCell>{crew.gamesPlayed}</TableCell>
                <TableCell>{crew.tier}</TableCell>
                <TableCell>{crew.reputation}</TableCell>
                <TableCell>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link
                        href={`/organizations/${organizationId}/crews/${crew.id}/edit`}
                      >
                        Edit
                      </Link>
                    </Button>
                    <form
                      action={async () => {
                        "use server";
                        await deleteCrew(crew.id, organizationId);
                      }}
                    >
                      <Button variant="destructive" size="sm" type="submit">
                        Delete
                      </Button>
                    </form>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}

export default async function CrewsPage({
  params,
}: {
  params: Promise<{ organizationId: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) {
    return <p>You must be logged in to view this page.</p>;
  }

  const { organizationId } = await params;
  const crews = await getCrewsForUser(organizationId, session.user.id);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">My Crews</h1>
        <Button asChild>
          <Link href={`/organizations/${organizationId}/crews/new`}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Crew
          </Link>
        </Button>
      </div>
      <CrewsListTable crews={crews} organizationId={organizationId} />
    </div>
  );
}
