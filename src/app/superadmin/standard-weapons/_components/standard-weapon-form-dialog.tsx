"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useActionState, useEffect, useState } from "react";
import { createStandardWeapon, updateStandardWeapon } from "../actions";
import { SubmitButton } from "./submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  CriticalEffect,
  SPECIAL,
  StandardWeapon,
  Trait,
  WeaponType,
} from "@prisma/client";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

type UpgradeFormData = {
  name: string;
  description?: string;
  costModifier?: number;
  rangeNew?: string;
  testAttributeNew?: SPECIAL;
  testValueModifier?: number;
  notesNew?: string;
  traits: Trait[];
  criticalEffects: CriticalEffect[];
};

interface StandardWeaponFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  weapon?: StandardWeapon & {
    traits: { trait: Trait }[];
    criticalEffects: { criticalEffect: CriticalEffect }[];
  };
  weaponTypes: WeaponType[];
  traits: Trait[];
  criticalEffects: CriticalEffect[];
}

export function StandardWeaponFormDialog({
  isOpen,
  onClose,
  weapon,
  weaponTypes,
  traits,
  criticalEffects,
}: StandardWeaponFormDialogProps) {
  const initialState = { message: null, errors: {} };
  const action = weapon
    ? updateStandardWeapon.bind(null, weapon.id)
    : createStandardWeapon;
  const [state, dispatch] = useActionState(action, initialState);
  const { toast } = useToast();

  const [selectedTraits, setSelectedTraits] = useState<Trait[]>(
    weapon?.traits.map((t) => t.trait) ?? []
  );
  const [selectedCriticalEffects, setSelectedCriticalEffects] = useState<
    CriticalEffect[]
  >(weapon?.criticalEffects.map((c) => c.criticalEffect) ?? []);

  const [upgrades, setUpgrades] = useState<Partial<UpgradeFormData>[]>([]);

  const addUpgrade = () => {
    setUpgrades([
      ...upgrades,
      { costModifier: 0, traits: [], criticalEffects: [] },
    ]);
  };

  const handleUpgradeChange = <K extends keyof UpgradeFormData>(
    index: number,
    field: K,
    value: UpgradeFormData[K]
  ) => {
    const newUpgrades = [...upgrades];
    newUpgrades[index] = { ...newUpgrades[index], [field]: value };
    setUpgrades(newUpgrades);
  };

  useEffect(() => {
    if (state.message) {
      if (state.errors) {
        toast({
          title: "Error",
          description: state.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: state.message,
        });
        onClose();
      }
    }
  }, [state, toast, onClose]);

  const handleFormAction = (formData: FormData) => {
    selectedTraits.forEach((trait) => formData.append("traits", trait.id));
    selectedCriticalEffects.forEach((effect) =>
      formData.append("criticalEffects", effect.id)
    );
    formData.append(
      "upgrades",
      JSON.stringify(
        upgrades.map((u) => ({
          ...u,
          traits: u.traits?.map((t) => t.id),
          criticalEffects: u.criticalEffects?.map((c) => c.id),
        }))
      )
    );
    dispatch(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {weapon ? "Edit Standard Weapon" : "Create Standard Weapon"}
          </DialogTitle>
        </DialogHeader>
        <form action={handleFormAction} className="space-y-4">
          <input type="hidden" name="id" value={weapon?.id} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                defaultValue={weapon?.name}
                required
              />
              {state.errors?.name && (
                <p className="text-red-500 text-xs">{state.errors.name}</p>
              )}
            </div>
            <div>
              <Label htmlFor="range">Range</Label>
              <Input
                id="range"
                name="range"
                defaultValue={weapon?.range}
                required
              />
              {state.errors?.range && (
                <p className="text-red-500 text-xs">{state.errors.range}</p>
              )}
            </div>
            <div>
              <Label htmlFor="testAttribute">Test Attribute</Label>
              <Select name="testAttribute" defaultValue={weapon?.testAttribute}>
                <SelectTrigger>
                  <SelectValue placeholder="Select an attribute" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(SPECIAL).map((attr) => (
                    <SelectItem key={attr} value={attr}>
                      {attr}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {state.errors?.testAttribute && (
                <p className="text-red-500 text-xs">
                  {state.errors.testAttribute}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="testValue">Test Value</Label>
              <Input
                id="testValue"
                name="testValue"
                type="number"
                defaultValue={weapon?.testValue}
                required
              />
              {state.errors?.testValue && (
                <p className="text-red-500 text-xs">{state.errors.testValue}</p>
              )}
            </div>
            <div>
              <Label htmlFor="weaponTypeId">Weapon Type</Label>
              <Select name="weaponTypeId" defaultValue={weapon?.weaponTypeId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a weapon type" />
                </SelectTrigger>
                <SelectContent>
                  {weaponTypes.map((type) => (
                    <SelectItem key={type.id} value={type.id}>
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {state.errors?.weaponTypeId && (
                <p className="text-red-500 text-xs">
                  {state.errors.weaponTypeId}
                </p>
              )}
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                name="notes"
                defaultValue={weapon?.notes ?? ""}
              />
              {state.errors?.notes && (
                <p className="text-red-500 text-xs">{state.errors.notes}</p>
              )}
            </div>
            <div className="md:col-span-2 space-y-2">
              <Label>Traits</Label>
              <div className="flex gap-2">
                <Select
                  value=""
                  onValueChange={(value) => {
                    const trait = traits.find((t) => t.id === value);
                    if (trait) {
                      setSelectedTraits([...selectedTraits, trait]);
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Add a trait" />
                  </SelectTrigger>
                  <SelectContent>
                    {traits.map((trait) => (
                      <SelectItem key={trait.id} value={trait.id}>
                        {trait.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-1 flex-wrap">
                {selectedTraits.map((trait, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-1 bg-secondary text-secondary-foreground rounded-md text-xs px-2 py-1"
                  >
                    <span>{trait.name}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-auto p-0.5"
                      onClick={() => {
                        const newSelection = [...selectedTraits];
                        newSelection.splice(index, 1);
                        setSelectedTraits(newSelection);
                      }}
                    >
                      x
                    </Button>
                  </div>
                ))}
              </div>
            </div>
            <div className="md:col-span-2 space-y-2">
              <Label>Critical Effects</Label>
              <div className="flex gap-2">
                <Select
                  value=""
                  onValueChange={(value) => {
                    const effect = criticalEffects.find((e) => e.id === value);
                    if (effect) {
                      setSelectedCriticalEffects([
                        ...selectedCriticalEffects,
                        effect,
                      ]);
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Add a critical effect" />
                  </SelectTrigger>
                  <SelectContent>
                    {criticalEffects.map((effect) => (
                      <SelectItem key={effect.id} value={effect.id}>
                        {effect.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-1 flex-wrap">
                {selectedCriticalEffects.map((effect, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-1 bg-secondary text-secondary-foreground rounded-md text-xs px-2 py-1"
                  >
                    <span>{effect.name}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-auto p-0.5"
                      onClick={() => {
                        const newSelection = [...selectedCriticalEffects];
                        newSelection.splice(index, 1);
                        setSelectedCriticalEffects(newSelection);
                      }}
                    >
                      x
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Upgrades</h3>
            {upgrades.map((upgrade, index) => (
              <div key={index} className="p-4 border rounded-md space-y-2">
                <div className="flex justify-between items-center">
                  <h4 className="font-semibold">Upgrade {index + 1}</h4>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      const newUpgrades = upgrades.filter(
                        (_, i) => i !== index
                      );
                      setUpgrades(newUpgrades);
                    }}
                  >
                    Remove
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor={`upgrade-name-${index}`}>Name</Label>
                    <Input
                      id={`upgrade-name-${index}`}
                      value={upgrade.name ?? ""}
                      onChange={(e) =>
                        handleUpgradeChange(index, "name", e.target.value)
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor={`upgrade-costModifier-${index}`}>
                      Cost Modifier
                    </Label>
                    <Input
                      id={`upgrade-costModifier-${index}`}
                      type="number"
                      value={upgrade.costModifier ?? ""}
                      onChange={(e) =>
                        handleUpgradeChange(
                          index,
                          "costModifier",
                          parseInt(e.target.value) || undefined
                        )
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor={`upgrade-rangeNew-${index}`}>
                      New Range
                    </Label>
                    <Input
                      id={`upgrade-rangeNew-${index}`}
                      value={upgrade.rangeNew ?? ""}
                      onChange={(e) =>
                        handleUpgradeChange(index, "rangeNew", e.target.value)
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor={`upgrade-testValueModifier-${index}`}>
                      Test Value Modifier
                    </Label>
                    <Input
                      id={`upgrade-testValueModifier-${index}`}
                      type="number"
                      value={upgrade.testValueModifier ?? ""}
                      onChange={(e) =>
                        handleUpgradeChange(
                          index,
                          "testValueModifier",
                          parseInt(e.target.value) || undefined
                        )
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor={`upgrade-testAttributeNew-${index}`}>
                      New Test Attribute
                    </Label>
                    <Select
                      value={upgrade.testAttributeNew ?? ""}
                      onValueChange={(value) =>
                        handleUpgradeChange(
                          index,
                          "testAttributeNew",
                          value as SPECIAL
                        )
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select an attribute" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.values(SPECIAL).map((attr) => (
                          <SelectItem key={attr} value={attr}>
                            {attr}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor={`upgrade-notesNew-${index}`}>
                      New Notes
                    </Label>
                    <Textarea
                      id={`upgrade-notesNew-${index}`}
                      value={upgrade.notesNew ?? ""}
                      onChange={(e) =>
                        handleUpgradeChange(index, "notesNew", e.target.value)
                      }
                    />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <Label>Traits</Label>
                    <Select
                      value=""
                      onValueChange={(value) => {
                        const trait = traits.find((t) => t.id === value);
                        if (trait) {
                          handleUpgradeChange(index, "traits", [
                            ...(upgrade.traits ?? []),
                            trait,
                          ]);
                        }
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Add a trait" />
                      </SelectTrigger>
                      <SelectContent>
                        {traits.map((trait) => (
                          <SelectItem key={trait.id} value={trait.id}>
                            {trait.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <div className="flex gap-1 flex-wrap">
                      {upgrade.traits?.map((trait, tIndex) => (
                        <div
                          key={tIndex}
                          className="flex items-center gap-1 bg-secondary text-secondary-foreground rounded-md text-xs px-2 py-1"
                        >
                          <span>{trait.name}</span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-auto p-0.5"
                            onClick={() => {
                              const newTraits = [...(upgrade.traits ?? [])];
                              newTraits.splice(tIndex, 1);
                              handleUpgradeChange(index, "traits", newTraits);
                            }}
                          >
                            x
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <Label>Critical Effects</Label>
                    <Select
                      value=""
                      onValueChange={(value) => {
                        const effect = criticalEffects.find(
                          (e) => e.id === value
                        );
                        if (effect) {
                          handleUpgradeChange(index, "criticalEffects", [
                            ...(upgrade.criticalEffects ?? []),
                            effect,
                          ]);
                        }
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Add a critical effect" />
                      </SelectTrigger>
                      <SelectContent>
                        {criticalEffects.map((effect) => (
                          <SelectItem key={effect.id} value={effect.id}>
                            {effect.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <div className="flex gap-1 flex-wrap">
                      {upgrade.criticalEffects?.map((effect, cIndex) => (
                        <div
                          key={cIndex}
                          className="flex items-center gap-1 bg-secondary text-secondary-foreground rounded-md text-xs px-2 py-1"
                        >
                          <span>{effect.name}</span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-auto p-0.5"
                            onClick={() => {
                              const newCriticals = [
                                ...(upgrade.criticalEffects ?? []),
                              ];
                              newCriticals.splice(cIndex, 1);
                              handleUpgradeChange(
                                index,
                                "criticalEffects",
                                newCriticals
                              );
                            }}
                          >
                            x
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <Button type="button" variant="outline" onClick={addUpgrade}>
              Add Upgrade
            </Button>
          </div>

          <SubmitButton>
            {weapon ? "Update Weapon" : "Create Weapon"}
          </SubmitButton>
        </form>
      </DialogContent>
    </Dialog>
  );
}
