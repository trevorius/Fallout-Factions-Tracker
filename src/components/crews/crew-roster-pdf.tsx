import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";
import { Prisma } from "@prisma/client";

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

// Helper function to format arrays with counts
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

// PDF Styles
const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#ffffff",
    padding: 30,
    fontSize: 10,
    fontFamily: "Helvetica",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#cccccc",
    paddingBottom: 5,
  },
  crewDetails: {
    flexDirection: "row",
    justifyContent: "space-between", 
    marginBottom: 20,
    gap: 15,
  },
  crewDetailsColumn: {
    padding: 10,
    border: "1px solid #cccccc",
    borderRadius: 5,
  },
  crewDetailsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  label: {
    fontWeight: "bold",
  },
  powerSection: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    padding: 10,
    border: "1px solid #cccccc",
    borderRadius: 5,
  },
  powerTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  powerItem: {
    textAlign: "center",
    marginHorizontal: 20,
  },
  powerValue: {
    fontSize: 14,
    fontWeight: "bold",
  },
  powerLabel: {
    fontSize: 8,
    marginTop: 2,
  },
  table: {
    width: "100%",
    marginTop: 10,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f0f0f0",
    borderBottomWidth: 1,
    borderBottomColor: "#cccccc",
    paddingVertical: 5,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 0.5,
    borderBottomColor: "#eeeeee",
    paddingVertical: 3,
    minHeight: 20,
  },
  tableCell: {
    flex: 1,
    paddingHorizontal: 3,
    paddingVertical: 2,
    fontSize: 8,
  },
  tableCellHeader: {
    flex: 1,
    paddingHorizontal: 3,
    paddingVertical: 2,
    fontSize: 8,
    fontWeight: "bold",
  },
  unitName: {
    fontWeight: "bold",
    fontSize: 8,
  },
  unitClass: {
    fontSize: 7,
    color: "#666666",
  },
  narrow: {
    flex: 0.5,
  },
  wide: {
    flex: 1.5,
  },
  extraWide: {
    flex: 2,
  },
});

interface CrewRosterPDFProps {
  crew: CrewForPDF;
}

export function CrewRosterPDF({ crew }: CrewRosterPDFProps) {
  return (
    <Document>
      <Page size="A4" orientation="landscape" style={styles.page}>
        {/* Title */}
        <Text style={styles.title}>{crew.name} - Crew Roster</Text>

        {/* Crew Details Row - Matching HTML: 30% + flex-grow + 50% */}
        <View style={styles.crewDetails}>
          {/* Crew Details Card - 30% */}
          <View style={[styles.crewDetailsColumn, { flex: 0.3 }]}>
            <Text style={styles.sectionTitle}>Crew Details</Text>
            <View style={styles.crewDetailsRow}>
              <Text style={styles.label}>Crew Name:</Text>
              <Text>{crew.name}</Text>
            </View>
            <View style={styles.crewDetailsRow}>
              <Text style={styles.label}>Faction:</Text>
              <Text>{crew.faction.name}</Text>
            </View>
            <View style={styles.crewDetailsRow}>
              <Text style={styles.label}>Player Name:</Text>
              <Text>{crew.user?.name || "N/A"}</Text>
            </View>
          </View>

          {/* Power Section - flex-grow */}
          <View style={[styles.powerSection, { flex: 1, marginHorizontal: 20 }]}>
            <Text style={styles.powerTitle}>POWER</Text>
            <View style={{ flexDirection: "row", justifyContent: "space-around", alignItems: "center" }}>
              <View style={styles.powerItem}>
                <Text style={styles.powerValue}>{crew.tier}</Text>
                <Text style={styles.powerLabel}>Tier</Text>
              </View>
              <View style={styles.powerItem}>
                <Text style={styles.powerValue}>{crew.reputation}</Text>
                <Text style={styles.powerLabel}>Reputation</Text>
              </View>
            </View>
          </View>

          {/* Chems Card - 50% (Including even if "Coming soon...") */}
          <View style={[styles.crewDetailsColumn, { flex: 0.5 }]}>
            <Text style={styles.sectionTitle}>Chems</Text>
            <Text style={[styles.tableCell, { fontStyle: "italic", color: "#666666" }]}>
              Coming soon...
            </Text>
          </View>
        </View>

        {/* Unit Roster Table - Exact HTML Structure */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Unit Roster</Text>
          
          <View style={styles.table}>
            {/* Table Header */}
            <View style={styles.tableHeader}>
              <Text style={[styles.tableCellHeader, styles.wide]}>Name (Class)</Text>
              <Text style={[styles.tableCellHeader, styles.narrow]}>S</Text>
              <Text style={[styles.tableCellHeader, styles.narrow]}>P</Text>
              <Text style={[styles.tableCellHeader, styles.narrow]}>E</Text>
              <Text style={[styles.tableCellHeader, styles.narrow]}>C</Text>
              <Text style={[styles.tableCellHeader, styles.narrow]}>I</Text>
              <Text style={[styles.tableCellHeader, styles.narrow]}>A</Text>
              <Text style={[styles.tableCellHeader, styles.narrow]}>L</Text>
              <Text style={[styles.tableCellHeader, styles.narrow]}>HP</Text>
              <Text style={[styles.tableCellHeader, styles.wide]}>Weapon</Text>
              <Text style={[styles.tableCellHeader, styles.wide]}>Test</Text>
              <Text style={[styles.tableCellHeader, styles.extraWide]}>Traits</Text>
              <Text style={[styles.tableCellHeader, styles.wide]}>Critical</Text>
              <Text style={[styles.tableCellHeader, styles.narrow]}>Rating</Text>
            </View>

            {/* Table Body - Exact HTML rowSpan Logic */}
            {crew.units.map((unit) => 
              unit.weapons.map((weapon, weaponIndex) => (
                <View key={`${unit.id}-${weapon.id}`} style={styles.tableRow}>
                  {/* Unit data only appears on first weapon row (like HTML rowSpan) */}
                  {weaponIndex === 0 && (
                    <>
                      <View style={[styles.tableCell, styles.wide]}>
                        <Text style={styles.unitName}>{unit.name}</Text>
                        <Text style={styles.unitClass}>({unit.unitClass.name})</Text>
                      </View>
                      <Text style={[styles.tableCell, styles.narrow]}>{unit.s}</Text>
                      <Text style={[styles.tableCell, styles.narrow]}>{unit.p}</Text>
                      <Text style={[styles.tableCell, styles.narrow]}>{unit.e}</Text>
                      <Text style={[styles.tableCell, styles.narrow]}>{unit.c}</Text>
                      <Text style={[styles.tableCell, styles.narrow]}>{unit.i}</Text>
                      <Text style={[styles.tableCell, styles.narrow]}>{unit.a}</Text>
                      <Text style={[styles.tableCell, styles.narrow]}>{unit.l}</Text>
                      <Text style={[styles.tableCell, styles.narrow]}>{unit.hp}</Text>
                    </>
                  )}
                  {/* Empty cells for subsequent weapon rows (simulating rowSpan) */}
                  {weaponIndex > 0 && (
                    <>
                      <Text style={[styles.tableCell, styles.wide]}></Text>
                      <Text style={[styles.tableCell, styles.narrow]}></Text>
                      <Text style={[styles.tableCell, styles.narrow]}></Text>
                      <Text style={[styles.tableCell, styles.narrow]}></Text>
                      <Text style={[styles.tableCell, styles.narrow]}></Text>
                      <Text style={[styles.tableCell, styles.narrow]}></Text>
                      <Text style={[styles.tableCell, styles.narrow]}></Text>
                      <Text style={[styles.tableCell, styles.narrow]}></Text>
                      <Text style={[styles.tableCell, styles.narrow]}></Text>
                    </>
                  )}
                  
                  {/* Weapon data appears on every row */}
                  <Text style={[styles.tableCell, styles.wide]}>{weapon.name}</Text>
                  <Text style={[styles.tableCell, styles.wide]}>
                    {weapon.standardWeapon?.testValue} {weapon.standardWeapon?.testAttribute}
                  </Text>
                  <Text style={[styles.tableCell, styles.extraWide]}>
                    {formatWithCount(
                      weapon.standardWeapon?.traits.map((t) => t.trait.name) || []
                    )}
                  </Text>
                  <Text style={[styles.tableCell, styles.wide]}>
                    {formatWithCount(
                      weapon.standardWeapon?.criticalEffects.map(
                        (c) => c.criticalEffect.name
                      ) || []
                    )}
                  </Text>
                  
                  {/* Rating only appears on first weapon row (like HTML rowSpan) */}
                  {weaponIndex === 0 && (
                    <Text style={[styles.tableCell, styles.narrow]}>{unit.rating}</Text>
                  )}
                  {weaponIndex > 0 && (
                    <Text style={[styles.tableCell, styles.narrow]}></Text>
                  )}
                </View>
              ))
            )}
          </View>
        </View>

        {/* Future sections will automatically appear here as they're added to the HTML */}
        {/* Perks & Injuries sections */}
        {crew.units.some(unit => unit.perks.length > 0 || unit.injuries.length > 0) && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Additional Unit Details</Text>
            {crew.units.map((unit) => (
              <View key={`details-${unit.id}`} style={{ marginBottom: 10 }}>
                <Text style={styles.unitName}>{unit.name}</Text>
                {unit.perks.length > 0 && (
                  <View>
                    <Text style={[styles.label, { fontSize: 9 }]}>Perks:</Text>
                    <Text style={{ fontSize: 8 }}>
                      {unit.perks.map(p => p.perk.name).join(", ")}
                    </Text>
                  </View>
                )}
                {unit.injuries.length > 0 && (
                  <View>
                    <Text style={[styles.label, { fontSize: 9 }]}>Injuries:</Text>
                    <Text style={{ fontSize: 8 }}>
                      {unit.injuries.map(i => i.injury.name).join(", ")}
                    </Text>
                  </View>
                )}
              </View>
            ))}
          </View>
        )}
      </Page>
    </Document>
  );
}