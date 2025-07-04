"use client";

import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CriticalEffect,
  Faction,
  Perk,
  StandardWeapon,
  UnitTemplate,
  WeaponTemplate,
  Trait,
} from "@prisma/client";
import { useRouter } from "next/navigation";
import { useCallback, useState, useTransition } from "react";
import { updateTemplateAccess } from "../actions";
import { TemplateSection } from "./TemplateSection";

// Types to handle the nested data for cascading selections
type UnitTemplateWithRelations = UnitTemplate & {
  perks: { perk: Perk }[];
  weaponTemplates: {
    weaponTemplate: WeaponTemplateWithRelations;
  }[];
};

type WeaponTemplateWithRelations = WeaponTemplate & {
  standardWeapons: {
    standardWeapon: StandardWeaponWithRelations;
  }[];
};

type StandardWeaponWithRelations = StandardWeapon & {
  traits: { trait: Trait }[];
  criticalEffects: { criticalEffect: CriticalEffect }[];
};

type FactionWithRelations = Faction & {
  unitTemplates: UnitTemplate[];
};

type TemplateData = {
  factions: FactionWithRelations[];
  unitTemplates: UnitTemplateWithRelations[];
  perks: Perk[];
  standardWeapons: StandardWeapon[];
  traits: Trait[];
  criticalEffects: CriticalEffect[];
  weaponTemplates: WeaponTemplate[];
  organization: {
    factions: { factionId: string }[];
    unitTemplates: { unitTemplateId: string }[];
    perks: { perkId: string }[];
    standardWeapons: { standardWeaponId: string }[];
    traits: { traitId: string }[];
    criticalEffects: { criticalEffectId: string }[];
    weaponTemplates: { weaponTemplateId: string }[];
  } | null;
};

type TemplateAccessFormProps = {
  initialData: TemplateData;
  organizationId: string;
};

export default function TemplateAccessForm({
  initialData,
  organizationId,
}: TemplateAccessFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  const [selectedFactionId, setSelectedFactionId] = useState<string>("all");

  // --- STATE MANAGEMENT ---
  const [selectedFactionIds, setSelectedFactionIds] = useState<string[]>(
    initialData.organization?.factions.map((f) => f.factionId) ?? []
  );
  const [selectedUnitTemplateIds, setSelectedUnitTemplateIds] = useState<
    string[]
  >(initialData.organization?.unitTemplates.map((t) => t.unitTemplateId) ?? []);
  const [selectedPerkIds, setSelectedPerkIds] = useState<string[]>(
    initialData.organization?.perks.map((p) => p.perkId) ?? []
  );
  const [selectedStandardWeaponIds, setSelectedStandardWeaponIds] = useState<
    string[]
  >(
    initialData.organization?.standardWeapons.map((w) => w.standardWeaponId) ??
      []
  );
  const [selectedTraitIds, setSelectedTraitIds] = useState<string[]>(
    initialData.organization?.traits.map((t) => t.traitId) ?? []
  );
  const [selectedCriticalEffectIds, setSelectedCriticalEffectIds] = useState<
    string[]
  >(
    initialData.organization?.criticalEffects.map((c) => c.criticalEffectId) ??
      []
  );
  const [selectedWeaponTemplateIds, setSelectedWeaponTemplateIds] = useState<
    string[]
  >(
    initialData.organization?.weaponTemplates.map(
      (wt) => wt.weaponTemplateId
    ) ?? []
  );

  // --- CASCADING LOGIC ---
  const handleFactionsChange = useCallback(
    (newSelectedIds: string[]) => {
      setSelectedFactionIds(newSelectedIds);

      const unitTemplatesToAdd = new Set<string>();
      newSelectedIds.forEach((factionId) => {
        const faction = initialData.factions.find((f) => f.id === factionId);
        faction?.unitTemplates.forEach((ut) => unitTemplatesToAdd.add(ut.id));
      });

      if (unitTemplatesToAdd.size > 0) {
        const newUnitTemplateIds = Array.from(
          new Set([...selectedUnitTemplateIds, ...unitTemplatesToAdd])
        );
        handleUnitTemplatesChange(newUnitTemplateIds);
      }
    },
    [initialData.factions, selectedUnitTemplateIds]
  );

  const handleUnitTemplatesChange = useCallback(
    (newSelectedIds: string[]) => {
      setSelectedUnitTemplateIds(newSelectedIds);

      const perksToAdd = new Set<string>();
      const weaponTemplatesToAdd = new Set<string>();

      newSelectedIds.forEach((utId) => {
        const unitTemplate = initialData.unitTemplates.find(
          (ut) => ut.id === utId
        );
        unitTemplate?.perks.forEach((p) => perksToAdd.add(p.perk.id));
        unitTemplate?.weaponTemplates.forEach((wt) =>
          weaponTemplatesToAdd.add(wt.weaponTemplate.id)
        );
      });

      if (perksToAdd.size > 0) {
        setSelectedPerkIds((prev) =>
          Array.from(new Set([...prev, ...perksToAdd]))
        );
      }
      if (weaponTemplatesToAdd.size > 0) {
        const newWeaponTemplateIds = Array.from(
          new Set([...selectedWeaponTemplateIds, ...weaponTemplatesToAdd])
        );
        handleWeaponTemplatesChange(newWeaponTemplateIds);
      }
    },
    [initialData.unitTemplates, selectedWeaponTemplateIds]
  );

  const handleWeaponTemplatesChange = useCallback(
    (newSelectedIds: string[]) => {
      setSelectedWeaponTemplateIds(newSelectedIds);

      const weaponsToAdd = new Set<string>();
      const traitsToAdd = new Set<string>();
      const critsToAdd = new Set<string>();

      newSelectedIds.forEach((wtId) => {
        const weaponTemplate = initialData.unitTemplates
          .flatMap((ut) => ut.weaponTemplates)
          .find((wt) => wt.weaponTemplate.id === wtId)?.weaponTemplate;

        weaponTemplate?.standardWeapons.forEach((sw) => {
          weaponsToAdd.add(sw.standardWeapon.id);
          sw.standardWeapon.traits.forEach((t) => traitsToAdd.add(t.trait.id));
          sw.standardWeapon.criticalEffects.forEach((c) =>
            critsToAdd.add(c.criticalEffect.id)
          );
        });
      });

      if (weaponsToAdd.size > 0)
        setSelectedStandardWeaponIds((prev) =>
          Array.from(new Set([...prev, ...weaponsToAdd]))
        );
      if (traitsToAdd.size > 0)
        setSelectedTraitIds((prev) =>
          Array.from(new Set([...prev, ...traitsToAdd]))
        );
      if (critsToAdd.size > 0)
        setSelectedCriticalEffectIds((prev) =>
          Array.from(new Set([...prev, ...critsToAdd]))
        );
    },
    [initialData.unitTemplates]
  );

  // --- SUBMIT HANDLER ---
  const handleSubmit = async () => {
    startTransition(async () => {
      const result = await updateTemplateAccess(organizationId, {
        factionIds: selectedFactionIds,
        unitTemplateIds: selectedUnitTemplateIds,
        perkIds: selectedPerkIds,
        standardWeaponIds: selectedStandardWeaponIds,
        traitIds: selectedTraitIds,
        criticalEffectIds: selectedCriticalEffectIds,
        weaponTemplateIds: selectedWeaponTemplateIds,
      });

      if (result.success) {
        toast({ title: "Success!", description: result.message });
      } else {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive",
        });
      }
      router.refresh();
    });
  };

  const filteredUnitTemplates =
    selectedFactionId === "all"
      ? initialData.unitTemplates
      : initialData.unitTemplates.filter(
          (ut) => ut.factionId === selectedFactionId
        );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Filter by Faction (for viewing only)</CardTitle>
        </CardHeader>
        <CardContent>
          <Select
            onValueChange={setSelectedFactionId}
            value={selectedFactionId}
          >
            <SelectTrigger className="w-[280px]">
              <SelectValue placeholder="Select a faction to filter templates" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Factions</SelectItem>
              {initialData.factions.map((faction) => (
                <SelectItem key={faction.id} value={faction.id}>
                  {faction.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <TemplateSection
        title="Factions"
        items={initialData.factions}
        selectedIds={selectedFactionIds}
        onSelectedIdsChange={handleFactionsChange}
      />

      <TemplateSection
        title="Unit Templates"
        items={filteredUnitTemplates}
        selectedIds={selectedUnitTemplateIds}
        onSelectedIdsChange={handleUnitTemplatesChange}
      />

      <TemplateSection
        title="Weapon Templates"
        items={initialData.weaponTemplates}
        selectedIds={selectedWeaponTemplateIds}
        onSelectedIdsChange={handleWeaponTemplatesChange}
      />

      <TemplateSection
        title="Perks"
        items={initialData.perks}
        selectedIds={selectedPerkIds}
        onSelectedIdsChange={setSelectedPerkIds}
      />

      <TemplateSection
        title="Standard Weapons"
        items={initialData.standardWeapons}
        selectedIds={selectedStandardWeaponIds}
        onSelectedIdsChange={setSelectedStandardWeaponIds}
      />

      <TemplateSection
        title="Traits"
        items={initialData.traits}
        selectedIds={selectedTraitIds}
        onSelectedIdsChange={setSelectedTraitIds}
      />

      <TemplateSection
        title="Critical Effects"
        items={initialData.criticalEffects}
        selectedIds={selectedCriticalEffectIds}
        onSelectedIdsChange={setSelectedCriticalEffectIds}
      />

      <Button onClick={handleSubmit} disabled={isPending} className="w-full">
        {isPending ? "Saving..." : "Save Changes"}
      </Button>
    </div>
  );
}
