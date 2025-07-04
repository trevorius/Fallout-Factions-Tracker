"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Perk, UnitClass, StandardWeapon } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { FactionFormDialog } from "./faction-form-dialog";
import { deleteFaction } from "../actions";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Prisma } from "@prisma/client";

type FactionWithTemplates = Prisma.FactionGetPayload<{
  include: {
    unitTemplates: {
      include: {
        perks: true;
        weaponTemplates: {
          include: {
            weaponTemplate: {
              include: {
                standardWeapons: {
                  include: {
                    standardWeapon: true;
                  };
                };
              };
            };
          };
        };
      };
    };
  };
}>;

interface FactionListProps {
  factions: FactionWithTemplates[];
  unitClasses: UnitClass[];
  perks: Perk[];
  standardWeapons: StandardWeapon[];
}

export function FactionList({
  factions,
  unitClasses,
  perks,
  standardWeapons,
}: FactionListProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedFactionId, setSelectedFactionId] = useState<string | null>(
    null
  );
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const { toast } = useToast();

  const selectedFaction =
    factions.find((f) => f.id === selectedFactionId) || null;
  const selectedFactionForDeletion =
    factions.find((f) => f.id === selectedFactionId) || null;

  const handleCreate = () => {
    setSelectedFactionId(null);
    setDialogOpen(true);
  };

  const handleEdit = (faction: FactionWithTemplates) => {
    setSelectedFactionId(faction.id);
    setDialogOpen(true);
  };

  const handleDelete = (faction: FactionWithTemplates) => {
    setSelectedFactionId(faction.id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (selectedFactionForDeletion) {
      const result = await deleteFaction(selectedFactionForDeletion.id);

      if (result?.message?.startsWith("Error")) {
        toast({
          title: result.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: result?.message || "Faction deleted successfully.",
        });
        setSelectedFactionId(null);
      }
      setDeleteDialogOpen(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={handleCreate}>Create Faction</Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead className="w-[200px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {factions.map((faction) => (
            <TableRow key={faction.id}>
              <TableCell>{faction.name}</TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(faction)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(faction)}
                  >
                    Delete
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <FactionFormDialog
        key={selectedFaction?.id || "create"}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        faction={selectedFaction || undefined}
        unitClasses={unitClasses}
        perks={perks}
        standardWeapons={standardWeapons}
      />
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              faction.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
