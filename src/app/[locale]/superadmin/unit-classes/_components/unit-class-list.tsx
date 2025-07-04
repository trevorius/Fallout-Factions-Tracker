"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { UnitClass } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { UnitClassFormDialog } from "./unit-class-form-dialog";
import { deleteUnitClass } from "../actions";
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

interface UnitClassListProps {
  unitClasses: UnitClass[];
}

export function UnitClassList({ unitClasses }: UnitClassListProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedUnitClass, setSelectedUnitClass] = useState<
    UnitClass | undefined
  >(undefined);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleCreate = () => {
    setSelectedUnitClass(undefined);
    setDialogOpen(true);
  };

  const handleEdit = (unitClass: UnitClass) => {
    setSelectedUnitClass(unitClass);
    setDialogOpen(true);
  };

  const handleDelete = (unitClass: UnitClass) => {
    setSelectedUnitClass(unitClass);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (selectedUnitClass) {
      const result = await deleteUnitClass(selectedUnitClass.id);

      if (result?.message.startsWith("Error")) {
        toast({
          title: result.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: result.message,
        });
        setSelectedUnitClass(undefined);
      }
      setDeleteDialogOpen(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={handleCreate}>Create Unit Class</Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead className="w-[200px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {unitClasses.map((unitClass) => (
            <TableRow key={unitClass.id}>
              <TableCell>{unitClass.name}</TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(unitClass)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(unitClass)}
                  >
                    Delete
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <UnitClassFormDialog
        key={selectedUnitClass?.id || "create"}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        unitClass={selectedUnitClass}
      />
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              unit class.
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
