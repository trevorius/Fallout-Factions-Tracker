"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Trait } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { TraitFormDialog } from "./trait-form-dialog";
import { deleteTrait } from "../actions";
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

interface TraitListProps {
  traits: Trait[];
}

export function TraitList({ traits }: TraitListProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedTraitId, setSelectedTraitId] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const { toast } = useToast();

  const selectedTrait = traits.find((t) => t.id === selectedTraitId) || null;
  const selectedTraitForDeletion =
    traits.find((t) => t.id === selectedTraitId) || null;

  const handleCreate = () => {
    setSelectedTraitId(null);
    setDialogOpen(true);
  };

  const handleEdit = (trait: Trait) => {
    setSelectedTraitId(trait.id);
    setDialogOpen(true);
  };

  const handleDelete = (trait: Trait) => {
    setSelectedTraitId(trait.id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (selectedTraitForDeletion) {
      const result = await deleteTrait(selectedTraitForDeletion.id);

      if (result?.message?.startsWith("Error")) {
        toast({
          title: result.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: result?.message || "Trait deleted successfully.",
        });
        setSelectedTraitId(null);
      }
      setDeleteDialogOpen(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={handleCreate}>Create Trait</Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead className="w-[200px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {traits.map((trait) => (
            <TableRow key={trait.id}>
              <TableCell>{trait.name}</TableCell>
              <TableCell>{trait.description}</TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(trait)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(trait)}
                  >
                    Delete
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <TraitFormDialog
        key={selectedTrait?.id || "create"}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        trait={selectedTrait || undefined}
      />
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              trait.
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
