"use client";

import { useToast } from "../../hooks/use-toast";
import { useMediaQuery } from "../../hooks/use-media-query";
import { updateCrew } from "@/lib/actions/crews";
import { Prisma } from "@prisma/client";
import { useEffect, useActionState } from "react";
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

function CrewDetailsSection({ crew }: { crew: CrewForEdit }) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle>Crew Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Crew Name</Label>
            <Input id="name" name="name" defaultValue={crew.name} />
          </div>
          <div className="space-y-2">
            <Label>Faction</Label>
            <p className="text-sm text-muted-foreground">{crew.faction.name}</p>
          </div>
          <div className="space-y-2">
            <Label>Player Name</Label>
            <p className="text-sm text-muted-foreground">
              {crew.user?.name || "N/A"}
            </p>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Crew Stats</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Tier</Label>
              <p className="text-lg font-bold">{crew.tier}</p>
            </div>
            <div className="space-y-2">
              <Label>Reputation</Label>
              <p className="text-lg font-bold">{crew.reputation}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
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

function UnitRoster({ units }: { units: CrewForEdit["units"] }) {
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
                            <div className="flex flex-col gap-2">
                              <Input
                                name={`unit-${unit.id}-name`}
                                defaultValue={unit.name}
                                className="font-semibold"
                              />
                              <span className="text-sm text-muted-foreground">
                                ({unit.unitClass.name})
                              </span>
                              <Button disabled size="sm" variant="outline">
                                Upgrade Unit
                              </Button>
                            </div>
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
                      <TableCell>{weapon.name}</TableCell>
                      <TableCell>
                        {weapon.standardWeapon?.testValue}{" "}
                        {weapon.standardWeapon?.testAttribute}
                      </TableCell>
                      <TableCell>
                        {formatWithCount(
                          weapon.standardWeapon?.traits.map(
                            (t) => t.trait.name
                          ) || []
                        )}
                      </TableCell>
                      <TableCell>
                        {formatWithCount(
                          weapon.standardWeapon?.criticalEffects.map(
                            (c) => c.criticalEffect.name
                          ) || []
                        )}
                      </TableCell>
                      <TableCell>{unit.rating}</TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-2">
                          <Button disabled size="sm" variant="outline">
                            Upgrade Weapon
                          </Button>
                          <Button disabled size="sm" variant="destructive">
                            Delete Weapon
                          </Button>
                        </div>
                      </TableCell>
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
                      <h4 className="font-semibold">{weapon.name}</h4>
                      <p>
                        <strong>Test:</strong>{" "}
                        {weapon.standardWeapon?.testValue}{" "}
                        {weapon.standardWeapon?.testAttribute}
                      </p>
                      <p>
                        <strong>Traits:</strong>{" "}
                        {formatWithCount(
                          weapon.standardWeapon?.traits.map(
                            (t) => t.trait.name
                          ) || []
                        )}
                      </p>
                      <p>
                        <strong>Critical:</strong>{" "}
                        {formatWithCount(
                          weapon.standardWeapon?.criticalEffects.map(
                            (c) => c.criticalEffect.name
                          ) || []
                        )}
                      </p>
                      <div className="flex gap-2 pt-2">
                        <Button disabled size="sm" variant="outline">
                          Upgrade Weapon
                        </Button>
                        <Button disabled size="sm" variant="destructive">
                          Delete Weapon
                        </Button>
                      </div>
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
  const [state, formAction] = useActionState(updateCrew, {
    message: "",
    success: false,
  });
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

  return (
    <form action={actionWithIds} className="space-y-8">
      <CrewDetailsSection crew={crew} />
      <UnitRoster units={crew.units} />
      <Button type="submit">Save Changes</Button>
    </form>
  );
}
