"use client";

import { useToast } from "../../hooks/use-toast";
import { useMediaQuery } from "../../hooks/use-media-query";
import { updateCrew, deleteUnitFromCrew } from "@/lib/actions/crews";
import { Prisma } from "@prisma/client";
import { useEffect, useActionState, useTransition } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Wrench, Trash2, UserCog, FileDown } from "lucide-react";
import { Separator } from "../ui/separator";

type CrewForEdit = Prisma.CrewGetPayload<{
  include: {
    faction: { select: { name: true } };
    user: { select: { name: true } };
    units: {
      include: {
        unitClass: { select: { name: true } };
        injuries: {
          include: { injury: { select: { name: true; description: true } } };
        };
        perks: {
          include: { perk: { select: { name: true; description: true } } };
        };
        weapons: {
          include: {
            standardWeapon: {
              include: {
                traits: { include: { trait: { select: { name: true } } } };
                criticalEffects: {
                  include: {
                    criticalEffect: { select: { name: true } };
                  };
                };
              };
            };
            appliedUpgrades: {
              include: {
                weaponUpgrade: {
                  select: { name: true; description: true };
                };
              };
            };
          };
        };
      };
    };
  };
}>;

function formatWithCount(items: string[]): string {
  if (!items || items.length === 0) return "";

  const counts = items.reduce((acc, item) => {
    acc[item] = (acc[item] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return Object.entries(counts)
    .map(([item, count]) => (count > 1 ? `${item} (${count})` : item))
    .join(", ");
}

function DeleteUnitButton({
  unitId,
  organizationId,
  className,
}: {
  unitId: string;
  organizationId: string;
  className?: string;
}) {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleDelete = () => {
    startTransition(async () => {
      const result = await deleteUnitFromCrew(unitId, organizationId);
      toast({
        title: result.success ? "Success" : "Error",
        description: result.message,
        variant: result.success ? "default" : "destructive",
      });
    });
  };

  return (
    <Button
      size="icon"
      variant="destructive"
      type="button"
      disabled={isPending}
      onClick={handleDelete}
      className={className}
    >
      <Trash2 className="h-4 w-4" />
    </Button>
  );
}

function CrewDetailsSection({ crew }: { crew: CrewForEdit }) {
  return (
    <div className="flex flex-col gap-4 lg:flex-row">
      <Card className="lg:w-[30%]">
        <CardHeader>
          <CardTitle>Crew Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="name" className="text-muted-foreground">
              Crew Name
            </Label>
            <Input
              id="name"
              name="name"
              defaultValue={crew.name}
              className="w-[60%]"
            />
          </div>
          <div className="flex items-center justify-between">
            <Label className="text-muted-foreground">Faction</Label>
            <p className="text-sm">{crew.faction.name}</p>
          </div>
          <div className="flex items-center justify-between">
            <Label className="text-muted-foreground">Player Name</Label>
            <p className="text-sm">{crew.user?.name || "N/A"}</p>
          </div>
        </CardContent>
      </Card>
      <Card className="flex-grow">
        <CardHeader>
          <CardTitle className="text-center">POWER</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-around">
          <div className="text-center">
            <p className="text-lg font-bold">{crew.tier}</p>
            <Label className="text-muted-foreground">Tier</Label>
          </div>
          <Separator orientation="vertical" className="h-10" />
          <div className="text-center">
            <p className="text-lg font-bold">{crew.reputation}</p>
            <Label className="text-muted-foreground">Reputation</Label>
          </div>
        </CardContent>
      </Card>
      <Card className="lg:w-[50%]">
        <CardHeader>
          <CardTitle>Chems</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
}

function UnitRoster({
  units,
  organizationId,
}: {
  units: CrewForEdit["units"];
  organizationId: string;
}) {
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  if (isDesktop) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Unit Roster</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name (Class)</TableHead>
                <TableHead>S</TableHead>
                <TableHead>P</TableHead>
                <TableHead>E</TableHead>
                <TableHead>C</TableHead>
                <TableHead>I</TableHead>
                <TableHead>A</TableHead>
                <TableHead>L</TableHead>
                <TableHead>HP</TableHead>
                <TableHead>Weapon</TableHead>
                <TableHead>Test</TableHead>
                <TableHead>Traits</TableHead>
                <TableHead>Critical</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {units.map((unit) => (
                <React.Fragment key={unit.id}>
                  {unit.weapons.map((weapon, weaponIndex) => (
                    <TableRow key={weapon.id}>
                      {weaponIndex === 0 && (
                        <>
                          <TableCell
                            rowSpan={unit.weapons.length}
                            className="align-top"
                          >
                            <Input
                              name={`unit-${unit.id}-name`}
                              defaultValue={unit.name}
                              className="font-semibold"
                            />
                            <span className="text-sm text-muted-foreground">
                              ({unit.unitClass.name})
                            </span>
                          </TableCell>
                          <TableCell rowSpan={unit.weapons.length}>
                            {unit.s}
                          </TableCell>
                          <TableCell rowSpan={unit.weapons.length}>
                            {unit.p}
                          </TableCell>
                          <TableCell rowSpan={unit.weapons.length}>
                            {unit.e}
                          </TableCell>
                          <TableCell rowSpan={unit.weapons.length}>
                            {unit.c}
                          </TableCell>
                          <TableCell rowSpan={unit.weapons.length}>
                            {unit.i}
                          </TableCell>
                          <TableCell rowSpan={unit.weapons.length}>
                            {unit.a}
                          </TableCell>
                          <TableCell rowSpan={unit.weapons.length}>
                            {unit.l}
                          </TableCell>
                          <TableCell rowSpan={unit.weapons.length}>
                            {unit.hp}
                          </TableCell>
                        </>
                      )}
                      <TableCell className="py-1 text-sm">
                        <div className="flex items-center gap-2">
                          <span>{weapon.name}</span>
                          <Button
                            disabled
                            size="icon"
                            variant="ghost"
                            className="h-6 w-6"
                          >
                            <Wrench className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell className="py-1 text-sm">
                        {weapon.standardWeapon?.testValue}{" "}
                        {weapon.standardWeapon?.testAttribute}
                      </TableCell>
                      <TableCell className="py-1 text-sm">
                        {formatWithCount(
                          weapon.standardWeapon?.traits.map(
                            (t) => t.trait.name
                          ) || []
                        )}
                      </TableCell>
                      <TableCell className="py-1 text-sm">
                        {formatWithCount(
                          weapon.standardWeapon?.criticalEffects.map(
                            (c) => c.criticalEffect.name
                          ) || []
                        )}
                      </TableCell>
                      {weaponIndex === 0 && (
                        <>
                          <TableCell rowSpan={unit.weapons.length}>
                            {unit.rating}
                          </TableCell>
                          <TableCell
                            rowSpan={unit.weapons.length}
                            className="align-top"
                          >
                            <div className="flex items-center gap-2">
                              <Button disabled size="icon" variant="outline">
                                <UserCog className="h-4 w-4" />
                              </Button>
                              <DeleteUnitButton
                                unitId={unit.id}
                                organizationId={organizationId}
                              />
                            </div>
                          </TableCell>
                        </>
                      )}
                    </TableRow>
                  ))}
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    );
  }

  // Mobile view
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Unit Roster</h2>
      {units.map((unit) => (
        <Card key={unit.id}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>
                <Input
                  name={`unit-${unit.id}-name`}
                  defaultValue={unit.name}
                  className="text-2xl font-bold"
                />
                <span className="text-lg text-muted-foreground">
                  ({unit.unitClass.name})
                </span>
              </CardTitle>
              <div className="flex items-center gap-2">
                <Button disabled size="icon" variant="outline">
                  <UserCog className="h-5 w-5" />
                </Button>
                <DeleteUnitButton
                  unitId={unit.id}
                  organizationId={organizationId}
                />
              </div>
            </div>
            <CardDescription>Rating: {unit.rating}</CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="special">
                <AccordionTrigger>Unit Info & S.P.E.C.I.A.L.</AccordionTrigger>
                <AccordionContent>
                  <div className="grid grid-cols-4 gap-2 text-center">
                    <div>S: {unit.s}</div>
                    <div>P: {unit.p}</div>
                    <div>E: {unit.e}</div>
                    <div>C: {unit.c}</div>
                    <div>I: {unit.i}</div>
                    <div>A: {unit.a}</div>
                    <div>L: {unit.l}</div>
                    <div>HP: {unit.hp}</div>
                  </div>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="weapons">
                <AccordionTrigger>Weapons</AccordionTrigger>
                <AccordionContent className="space-y-4">
                  {unit.weapons.map((weapon) => (
                    <div
                      key={weapon.id}
                      className="space-y-2 rounded-md border p-2"
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold">{weapon.name}</h4>
                        <div className="flex items-center gap-1">
                          <Button
                            disabled
                            size="icon"
                            variant="ghost"
                            className="h-7 w-7"
                          >
                            <Wrench className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-sm">
                        <strong>Test:</strong>{" "}
                        {weapon.standardWeapon?.testValue}{" "}
                        {weapon.standardWeapon?.testAttribute}
                      </p>
                      <p className="text-sm">
                        <strong>Traits:</strong>{" "}
                        {formatWithCount(
                          weapon.standardWeapon?.traits.map(
                            (t) => t.trait.name
                          ) || []
                        )}
                      </p>
                      <p className="text-sm">
                        <strong>Critical:</strong>{" "}
                        {formatWithCount(
                          weapon.standardWeapon?.criticalEffects.map(
                            (c) => c.criticalEffect.name
                          ) || []
                        )}
                      </p>
                    </div>
                  ))}
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="perks">
                <AccordionTrigger>Perks & Notes</AccordionTrigger>
                <AccordionContent>
                  <ul className="list-disc list-inside">
                    {unit.perks.map((p) => (
                      <li key={p.perkId}>{p.perk.name}</li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export function EditCrewForm({
  crew,
  organizationId,
}: {
  crew: CrewForEdit;
  organizationId: string;
}) {
  const [state, formAction] = useActionState(
    (
      prevState: { message: string; success: boolean },
      payload: { crewId: string; organizationId: string; formData: FormData }
    ) => updateCrew(prevState, payload),
    {
      message: "",
      success: false,
    }
  );
  const { toast } = useToast();

  useEffect(() => {
    if (state.message) {
      toast({
        title: state.success ? "Success" : "Error",
        description: state.message,
        variant: state.success ? "default" : "destructive",
      });
    }
  }, [state, toast]);

  const actionWithIds = (formData: FormData) => {
    formAction({ crewId: crew.id, organizationId, formData });
  };

  const handleGeneratePDF = async () => {
    try {
      // Detect current theme
      const isDark = document.documentElement.classList.contains('dark');
      const theme = isDark ? 'dark' : 'light';
      
      const response = await fetch(
        `/api/crews/${crew.id}/pdf?organizationId=${organizationId}&theme=${theme}`
      );
      
      if (!response.ok) {
        throw new Error("Failed to generate PDF");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${crew.name.replace(/[^a-zA-Z0-9]/g, "_")}_roster.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: "Success",
        description: "PDF generated successfully!",
      });
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast({
        title: "Error",
        description: "Failed to generate PDF. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <form action={actionWithIds} className="space-y-8">
      <CrewDetailsSection crew={crew} />
      <UnitRoster units={crew.units} organizationId={organizationId} />
      <div className="flex gap-4">
        <Button type="submit">Save Changes</Button>
        <Button 
          type="button" 
          variant="outline" 
          onClick={handleGeneratePDF}
          className="flex items-center gap-2"
        >
          <FileDown className="h-4 w-4" />
          Generate PDF
        </Button>
      </div>
    </form>
  );
}
