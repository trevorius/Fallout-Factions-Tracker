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
      _count: {
        select: {
          gamesAsCrewOne: true,
          gamesAsCrewTwo: true,
        },
      },
    },
    orderBy: {
      name: "asc",
    },
  });

  return crews.map((crew) => ({
    ...crew,
    gamesPlayed: crew._count.gamesAsCrewOne + crew._count.gamesAsCrewTwo,
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
            <TableHead>Rating</TableHead>
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
                <TableCell>{crew.power}</TableCell>
                <TableCell className="text-right">
                  <Button asChild variant="outline" size="sm">
                    <Link
                      href={`/organizations/${organizationId}/crews/${crew.id}/edit`}
                    >
                      Edit
                    </Link>
                  </Button>
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
  params: { organizationId: string };
}) {
  const session = await auth();
  if (!session?.user?.id) {
    return <p>You must be logged in to view this page.</p>;
  }

  const crews = await getCrewsForUser(params.organizationId, session.user.id);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">My Crews</h1>
        <Button asChild>
          <Link href={`/organizations/${params.organizationId}/crews/new`}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Crew
          </Link>
        </Button>
      </div>
      <CrewsListTable crews={crews} organizationId={params.organizationId} />
    </div>
  );
}
