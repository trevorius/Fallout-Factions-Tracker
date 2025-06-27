"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { PerkFormDialog } from "./perk-form-dialog";
import { deletePerk } from "../actions";
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

type PerkWithRequisite = Prisma.PerkGetPayload<{
  include: { requisite: true };
}>;

interface PerkListProps {
  perks: PerkWithRequisite[];
}

export function PerkList({ perks }: PerkListProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedPerkId, setSelectedPerkId] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const { toast } = useToast();

  const selectedPerk = perks.find((p) => p.id === selectedPerkId) || null;
  const selectedPerkForDeletion =
    perks.find((p) => p.id === selectedPerkId) || null;

  const handleCreate = () => {
    setSelectedPerkId(null);
    setDialogOpen(true);
  };

  const handleEdit = (perk: PerkWithRequisite) => {
    setSelectedPerkId(perk.id);
    setDialogOpen(true);
  };

  const handleDelete = (perk: PerkWithRequisite) => {
    setSelectedPerkId(perk.id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (selectedPerkForDeletion) {
      const result = await deletePerk(selectedPerkForDeletion.id);

      if (result?.message?.startsWith("Error")) {
        toast({
          title: result.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: result?.message || "Perk deleted successfully.",
        });
        setSelectedPerkId(null);
      }
      setDeleteDialogOpen(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={handleCreate}>Create Perk</Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Requisite</TableHead>
            <TableHead className="w-[200px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {perks.map((perk) => (
            <TableRow key={perk.id}>
              <TableCell>{perk.name}</TableCell>
              <TableCell>{perk.description}</TableCell>
              <TableCell>
                {perk.requisite
                  ? `${perk.requisite.special}: ${perk.requisite.value}`
                  : "N/A"}
              </TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(perk)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(perk)}
                  >
                    Delete
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <PerkFormDialog
        key={selectedPerk?.id || "create"}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        perk={selectedPerk || undefined}
      />
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              perk.
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
