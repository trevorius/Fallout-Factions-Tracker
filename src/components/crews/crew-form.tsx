"use client";

import { Faction } from "@prisma/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Button } from "../ui/button";
import { useFormState } from "react-dom";
import { createCrew, getUnitTemplatesForFaction } from "@/lib/actions/crews";
import { useEffect, useState, useTransition } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { PlusCircle, Trash2 } from "lucide-react";

type UnitTemplateWithRelations = Awaited<
  ReturnType<typeof getUnitTemplatesForFaction>
>[number];

interface CrewFormProps {
  factions: Faction[];
  organizationId: string;
}

const initialState = {
  message: "",
};

interface RosterItem {
  unitTemplateId: string;
  unitTemplateName: string;
  weaponTemplateId: string;
  weaponTemplateName: string;
  cost: number;
}

// Sorting and Grouping Logic
const CLASS_ORDER = ["LEADER", "CHAMPION", "GRUNT"];

type UnitTemplateGroup = {
  baseName: string;
  unitClass: string;
  templates: UnitTemplateWithRelations[];
};

const groupAndSortTemplates = (
  templates: UnitTemplateWithRelations[]
): UnitTemplateGroup[] => {
  const grouped = templates.reduce((acc, template) => {
    const baseName = template.name.split(" (")[0];
    if (!acc[baseName]) {
      acc[baseName] = {
        baseName: baseName,
        unitClass: template.unitClass.name,
        templates: [],
      };
    }
    acc[baseName].templates.push(template);
    return acc;
  }, {} as Record<string, UnitTemplateGroup>);

  const groupedArray = Object.values(grouped);

  groupedArray.sort((a, b) => {
    const indexA = CLASS_ORDER.indexOf(a.unitClass);
    const indexB = CLASS_ORDER.indexOf(b.unitClass);
    const scoreA = indexA === -1 ? CLASS_ORDER.length : indexA;
    const scoreB = indexB === -1 ? CLASS_ORDER.length : indexB;

    if (scoreA !== scoreB) {
      return scoreA - scoreB;
    }
    return a.baseName.localeCompare(b.baseName);
  });

  return groupedArray;
};

export function CrewForm({ factions, organizationId }: CrewFormProps) {
  const [state, formAction] = useFormState(createCrew, initialState);
  const [selectedFaction, setSelectedFaction] = useState<string | null>(null);
  const [groupedUnitTemplates, setGroupedUnitTemplates] = useState<
    UnitTemplateGroup[]
  >([]);
  const [roster, setRoster] = useState<RosterItem[]>([]);
  const [isPending, startTransition] = useTransition();

  const totalCost = roster.reduce((acc, item) => acc + item.cost, 0);

  useEffect(() => {
    if (selectedFaction) {
      startTransition(async () => {
        const templates = await getUnitTemplatesForFaction(selectedFaction);
        setGroupedUnitTemplates(groupAndSortTemplates(templates));
      });
    } else {
      setGroupedUnitTemplates([]);
    }
  }, [selectedFaction]);

  const handleAddUnit = (
    unitTemplate: UnitTemplateWithRelations,
    weaponTemplateId: string
  ) => {
    const weaponTemplate = unitTemplate.weaponTemplates.find(
      (wt) => wt.weaponTemplate.id === weaponTemplateId
    )?.weaponTemplate;

    if (!weaponTemplate) return;

    const newRosterItem: RosterItem = {
      unitTemplateId: unitTemplate.id,
      unitTemplateName: unitTemplate.name,
      weaponTemplateId: weaponTemplate.id,
      weaponTemplateName: weaponTemplate.name,
      cost: weaponTemplate.cost,
    };
    setRoster([...roster, newRosterItem]);
  };

  const handleRemoveUnit = (index: number) => {
    setRoster(roster.filter((_, i) => i !== index));
  };

  return (
    <form action={formAction}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Unit Selection</CardTitle>
              <CardDescription>
                Choose your faction, then add units to your crew roster.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isPending && <p>Loading units...</p>}
              {!isPending &&
                selectedFaction &&
                groupedUnitTemplates.length === 0 && (
                  <p>No unit templates found for this faction.</p>
                )}
              {groupedUnitTemplates.map((group) => (
                <UnitTemplateGroupCard
                  key={group.baseName}
                  group={group}
                  onAddUnit={handleAddUnit}
                />
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Selected Units</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="w-full flex justify-end mb-4">
                <p className="font-semibold">Total Cost: {totalCost} caps</p>
              </div>
              <RosterTable roster={roster} onRemoveUnit={handleRemoveUnit} />
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Crew Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <input
                type="hidden"
                name="organizationId"
                value={organizationId}
              />
              <input
                type="hidden"
                name="roster"
                value={JSON.stringify(roster)}
              />

              <div className="space-y-2">
                <Label htmlFor="name">Crew Name</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="e.g., The Rust Devils"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="factionId">Faction</Label>
                <Select
                  name="factionId"
                  required
                  onValueChange={setSelectedFaction}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a faction" />
                  </SelectTrigger>
                  <SelectContent>
                    {factions.map((faction) => (
                      <SelectItem key={faction.id} value={faction.id}>
                        {faction.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button type="submit" className="w-full">
                Create Crew
              </Button>
              {state?.message && (
                <p className="text-sm text-red-500">{state.message}</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  );
}

function UnitTemplateGroupCard({
  group,
  onAddUnit,
}: {
  group: UnitTemplateGroup;
  onAddUnit: (
    unitTemplate: UnitTemplateWithRelations,
    weaponTemplateId: string
  ) => void;
}) {
  const [selectedTemplateId, setSelectedTemplateId] = useState<
    string | undefined
  >(group.templates[0]?.id);

  const handleAddClick = () => {
    if (!selectedTemplateId) return;
    const selectedTemplate = group.templates.find(
      (t) => t.id === selectedTemplateId
    );
    if (!selectedTemplate) return;

    const weaponTemplateId =
      selectedTemplate.weaponTemplates[0]?.weaponTemplate.id;
    if (!weaponTemplateId) return;

    onAddUnit(selectedTemplate, weaponTemplateId);
  };

  return (
    <div className="flex items-center justify-between p-4 border rounded-md mb-4">
      <div>
        <p className="font-semibold">{group.baseName}</p>
        <p className="text-sm text-muted-foreground">{group.unitClass}</p>
      </div>
      <div className="flex items-center gap-2">
        <Select
          value={selectedTemplateId}
          onValueChange={setSelectedTemplateId}
        >
          <SelectTrigger className="w-[250px]">
            <SelectValue placeholder="Select loadout" />
          </SelectTrigger>
          <SelectContent>
            {group.templates.map((template) => {
              const weaponTemplate =
                template.weaponTemplates[0]?.weaponTemplate;
              if (!weaponTemplate) return null;
              const weaponName = weaponTemplate.name.replace(
                `${group.baseName} - `,
                ""
              );
              return (
                <SelectItem key={template.id} value={template.id}>
                  {weaponName} ({weaponTemplate.cost} caps)
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
        <Button
          type="button"
          size="icon"
          variant="outline"
          onClick={handleAddClick}
          disabled={!selectedTemplateId}
        >
          <PlusCircle className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

function RosterTable({
  roster,
  onRemoveUnit,
}: {
  roster: RosterItem[];
  onRemoveUnit: (index: number) => void;
}) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Unit</TableHead>
            <TableHead>Loadout</TableHead>
            <TableHead>Cost</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {roster.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center">
                No units added to roster yet.
              </TableCell>
            </TableRow>
          ) : (
            roster.map((item, index) => (
              <TableRow key={`${item.unitTemplateId}-${index}`}>
                <TableCell>{item.unitTemplateName}</TableCell>
                <TableCell>{item.weaponTemplateName}</TableCell>
                <TableCell>{item.cost}</TableCell>
                <TableCell className="text-right">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => onRemoveUnit(index)}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
