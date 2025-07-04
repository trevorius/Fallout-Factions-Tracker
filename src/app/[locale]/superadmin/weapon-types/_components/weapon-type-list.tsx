"use client";

import { WeaponType } from "@prisma/client";
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
import { WeaponTypeFormDialog } from "./weapon-type-form-dialog";
import { deleteWeaponType } from "../actions";
import { useToast } from "@/hooks/use-toast";

interface WeaponTypeListProps {
  weaponTypes: WeaponType[];
}

export function WeaponTypeList({ weaponTypes }: WeaponTypeListProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedWeaponType, setSelectedWeaponType] = useState<
    WeaponType | undefined
  >(undefined);
  const { toast } = useToast();

  const handleEdit = (weaponType: WeaponType) => {
    setSelectedWeaponType(weaponType);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this weapon type?")) {
      const result = await deleteWeaponType(id);
      if (result.message) {
        toast({
          title: "Success",
          description: result.message,
        });
      }
    }
  };

  const openCreateForm = () => {
    setSelectedWeaponType(undefined);
    setIsFormOpen(true);
  };

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Button onClick={openCreateForm}>Create Weapon Type</Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {weaponTypes.map((weaponType) => (
            <TableRow key={weaponType.id}>
              <TableCell>{weaponType.name}</TableCell>
              <TableCell>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(weaponType)}
                >
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(weaponType.id)}
                  className="ml-2"
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {isFormOpen && (
        <WeaponTypeFormDialog
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          weaponType={selectedWeaponType}
        />
      )}
    </div>
  );
}
