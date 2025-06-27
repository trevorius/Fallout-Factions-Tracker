"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CriticalEffect } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { CriticalEffectFormDialog } from "./critical-effect-form-dialog";
import { deleteCriticalEffect } from "../actions";
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

interface CriticalEffectListProps {
  criticalEffects: CriticalEffect[];
}

export function CriticalEffectList({
  criticalEffects,
}: CriticalEffectListProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedEffectId, setSelectedEffectId] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const { toast } = useToast();

  const selectedEffect =
    criticalEffects.find((t) => t.id === selectedEffectId) || null;
  const selectedEffectForDeletion =
    criticalEffects.find((t) => t.id === selectedEffectId) || null;

  const handleCreate = () => {
    setSelectedEffectId(null);
    setDialogOpen(true);
  };

  const handleEdit = (effect: CriticalEffect) => {
    setSelectedEffectId(effect.id);
    setDialogOpen(true);
  };

  const handleDelete = (effect: CriticalEffect) => {
    setSelectedEffectId(effect.id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (selectedEffectForDeletion) {
      const result = await deleteCriticalEffect(selectedEffectForDeletion.id);

      if (result?.message?.startsWith("Error")) {
        toast({
          title: result.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: result?.message || "Critical Effect deleted successfully.",
        });
        setSelectedEffectId(null);
      }
      setDeleteDialogOpen(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={handleCreate}>Create Critical Effect</Button>
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
          {criticalEffects.map((effect) => (
            <TableRow key={effect.id}>
              <TableCell>{effect.name}</TableCell>
              <TableCell>{effect.description}</TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(effect)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(effect)}
                  >
                    Delete
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <CriticalEffectFormDialog
        key={selectedEffect?.id || "create"}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        criticalEffect={selectedEffect || undefined}
      />
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              critical effect.
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
