"use client";

import {
  CriticalEffect,
  StandardWeapon,
  Trait,
  WeaponType,
  WeaponUpgrade,
} from "@prisma/client";
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
import { StandardWeaponFormDialog } from "./standard-weapon-form-dialog";
import { deleteStandardWeapon } from "../actions";
import { useToast } from "@/hooks/use-toast";

type StandardWeaponWithRelations = StandardWeapon & {
  weaponType: WeaponType;
  traits: { trait: Trait }[];
  criticalEffects: { criticalEffect: CriticalEffect }[];
  availableUpgrades: {
    weaponUpgrade: WeaponUpgrade & {
      traits: { trait: Trait }[];
      criticalEffects: { criticalEffect: CriticalEffect }[];
    };
  }[];
};
interface StandardWeaponListProps {
  standardWeapons: StandardWeaponWithRelations[];
  weaponTypes: WeaponType[];
  traits: Trait[];
  criticalEffects: CriticalEffect[];
}

export function StandardWeaponList({
  standardWeapons,
  weaponTypes,
  traits,
  criticalEffects,
}: StandardWeaponListProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedWeapon, setSelectedWeapon] = useState<
    StandardWeaponWithRelations | undefined
  >(undefined);
  const { toast } = useToast();

  const handleEdit = (weapon: StandardWeaponWithRelations) => {
    setSelectedWeapon(weapon);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this weapon?")) {
      const result = await deleteStandardWeapon(id);
      if (result.message) {
        toast({
          title: "Success",
          description: result.message,
        });
      }
    }
  };

  const openCreateForm = () => {
    setSelectedWeapon(undefined);
    setIsFormOpen(true);
  };

  const formatEffects = (
    effects: { trait: Trait }[] | { criticalEffect: CriticalEffect }[]
  ) => {
    const effectCounts = effects.reduce((acc, item) => {
      const name = "trait" in item ? item.trait.name : item.criticalEffect.name;
      acc[name] = (acc[name] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(effectCounts)
      .map(([name, count]) => (count > 1 ? `${name}(${count})` : name))
      .join(", ");
  };

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Button onClick={openCreateForm}>Create Standard Weapon</Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Test</TableHead>
            <TableHead>Traits</TableHead>
            <TableHead>Criticals</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {standardWeapons.map((weapon) => (
            <TableRow key={weapon.id}>
              <TableCell>{weapon.name}</TableCell>
              <TableCell>{weapon.weaponType.name}</TableCell>
              <TableCell>
                {weapon.testValue}
                {weapon.testAttribute}
              </TableCell>
              <TableCell>{formatEffects(weapon.traits)}</TableCell>
              <TableCell>{formatEffects(weapon.criticalEffects)}</TableCell>
              <TableCell>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(weapon)}
                >
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(weapon.id)}
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
        <StandardWeaponFormDialog
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          weapon={selectedWeapon}
          weaponTypes={weaponTypes}
          traits={traits}
          criticalEffects={criticalEffects}
        />
      )}
    </div>
  );
}
