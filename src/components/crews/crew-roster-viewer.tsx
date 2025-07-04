"use client";

import React, { useEffect, useState } from "react";
import { PDFViewer } from "@react-pdf/renderer";
import { CrewRosterPDF } from "./crew-roster-pdf";
import { getCrewForRoster } from "@/lib/actions/crews";
import { Prisma } from "@prisma/client";
import { ThemeName, Theme } from "@/lib/types/theme";

type CrewForPDF = Prisma.CrewGetPayload<{
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

interface CrewRosterViewerProps {
  crewId: string;
  theme?: ThemeName;
}

export function CrewRosterViewer({
  crewId,
  theme = Theme.LIGHT,
}: CrewRosterViewerProps) {
  const [crew, setCrew] = useState<CrewForPDF | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCrew() {
      try {
        const fetchedCrew = await getCrewForRoster(crewId);
        if (fetchedCrew) {
          setCrew(fetchedCrew as CrewForPDF);
        } else {
          setError("Crew not found.");
        }
      } catch (err) {
        setError("Failed to fetch crew data.");
        console.error(err);
      }
    }
    fetchCrew();
  }, [crewId]);

  if (error) {
    return <div className="text-red-500 text-center p-4">{error}</div>;
  }

  if (!crew) {
    return <div className="text-center p-4">Loading crew roster...</div>;
  }

  return (
    <PDFViewer style={{ width: "100%", height: "100vh" }}>
      <CrewRosterPDF crew={crew} theme={theme} />
    </PDFViewer>
  );
}
