"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Faction } from "@prisma/client";
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

interface FactionListProps {
  factions: Faction[];
}

export function FactionList({ factions }: FactionListProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedFaction, setSelectedFaction] = useState<Faction | undefined>(
    undefined
  );
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleCreate = () => {
    setSelectedFaction(undefined);
    setDialogOpen(true);
  };

  const handleEdit = (faction: Faction) => {
    setSelectedFaction(faction);
    setDialogOpen(true);
  };

  const handleDelete = (faction: Faction) => {
    setSelectedFaction(faction);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (selectedFaction) {
      const result = await deleteFaction(selectedFaction.id);

      if (result?.message) {
        toast({
          title: result.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Faction deleted successfully.",
        });
        setSelectedFaction(undefined);
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
        faction={selectedFaction}
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
