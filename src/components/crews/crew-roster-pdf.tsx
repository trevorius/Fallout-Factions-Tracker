import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";
import { Prisma } from "@prisma/client";
import { getPdfTheme } from "@/lib/theme";

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

/**
 * Generate PDF styles from theme configuration
 * This ensures the PDF automatically matches your app's theme
 */
function createPdfStyles(themeName: 'light' | 'dark' | 'blue' = 'light') {
  const theme = getPdfTheme(themeName);
  
  return StyleSheet.create({
    page: {
      flexDirection: "column",
      backgroundColor: theme.colors.background,
      color: theme.colors.foreground,
      padding: theme.spacing.xl,
      fontSize: theme.typography.fontSize.xs,
      fontFamily: "Helvetica", // PDF-compatible font
    },
    title: {
      fontSize: theme.typography.fontSize['2xl'],
      fontWeight: theme.typography.fontWeight.bold,
      marginBottom: theme.spacing.lg,
      textAlign: "center",
      color: theme.colors.foreground,
    },
    section: {
      marginBottom: theme.spacing.lg,
    },
    sectionTitle: {
      fontSize: theme.typography.fontSize.lg,
      fontWeight: theme.typography.fontWeight.bold,
      marginBottom: theme.spacing.sm,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
      paddingBottom: theme.spacing.xs,
      color: theme.colors.foreground,
    },
    crewDetails: {
      flexDirection: "row",
      justifyContent: "space-between", 
      marginBottom: theme.spacing.lg,
      gap: theme.spacing.md,
    },
    crewDetailsColumn: {
      padding: theme.spacing.sm,
      border: `1px solid ${theme.colors.border}`,
      borderRadius: theme.borderRadius.sm,
      backgroundColor: theme.colors.card,
    },
    crewDetailsRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: theme.spacing.xs,
    },
    label: {
      fontWeight: theme.typography.fontWeight.bold,
      color: theme.colors.mutedForeground,
    },
    powerSection: {
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: theme.colors.muted,
      padding: theme.spacing.sm,
      border: `1px solid ${theme.colors.border}`,
      borderRadius: theme.borderRadius.sm,
    },
    powerTitle: {
      fontSize: theme.typography.fontSize.xl,
      fontWeight: theme.typography.fontWeight.bold,
      marginBottom: theme.spacing.xs,
      color: theme.colors.foreground,
    },
    powerItem: {
      textAlign: "center",
      marginHorizontal: theme.spacing.lg,
    },
    powerValue: {
      fontSize: theme.typography.fontSize.lg,
      fontWeight: theme.typography.fontWeight.bold,
      color: theme.colors.foreground,
    },
    powerLabel: {
      fontSize: theme.typography.fontSize.xs,
      marginTop: 2,
      color: theme.colors.mutedForeground,
    },
    table: {
      width: "100%",
      marginTop: theme.spacing.sm,
      border: `1px solid ${theme.colors.border}`,
      borderRadius: theme.borderRadius.sm,
    },
    tableHeader: {
      flexDirection: "row",
      backgroundColor: theme.colors.muted,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
      paddingVertical: theme.spacing.xs,
    },
    tableRow: {
      flexDirection: "row",
      borderBottomWidth: 0.5,
      borderBottomColor: theme.colors.border,
      paddingVertical: theme.spacing.xs / 2,
      minHeight: 20,
      backgroundColor: theme.colors.card,
    },
    tableCell: {
      flex: 1,
      paddingHorizontal: theme.spacing.xs / 2,
      paddingVertical: 2,
      fontSize: theme.typography.fontSize.xs,
      color: theme.colors.cardForeground,
    },
    tableCellHeader: {
      flex: 1,
      paddingHorizontal: theme.spacing.xs / 2,
      paddingVertical: 2,
      fontSize: theme.typography.fontSize.xs,
      fontWeight: theme.typography.fontWeight.bold,
      color: theme.colors.foreground,
    },
    unitName: {
      fontWeight: theme.typography.fontWeight.bold,
      fontSize: theme.typography.fontSize.sm, // Increased from xs to sm for longer names
      color: theme.colors.foreground,
      lineHeight: 1.2, // Better line spacing for longer names
    },
    unitClass: {
      fontSize: theme.typography.fontSize.xs - 1,
      color: theme.colors.mutedForeground,
    },
    // Layout helpers
    narrow: {
      flex: 0.5,
    },
    wide: {
      flex: 1.5,
    },
    extraWide: {
      flex: 2,
    },
    unitNameColumn: {
      flex: 2, // Larger width for unit names to accommodate longer names
    },
  });
}

interface CrewRosterPDFProps {
  crew: CrewForPDF;
  theme?: 'light' | 'dark' | 'blue'; // Theme preference for PDF styling
}

export function CrewRosterPDF({ crew, theme = 'light' }: CrewRosterPDFProps) {
  // Generate styles from theme - this makes PDF automatically match your app theme
  const styles = createPdfStyles(theme);
  
  return (
    <Document>
      <Page size="A4" orientation="landscape" style={styles.page}>
        {/* Title */}
        <Text style={styles.title}>{crew.name} - Crew Roster</Text>

        {/* Crew Details Row - Fixed proportions: 25% + 25% + 50% */}
        <View style={styles.crewDetails}>
          {/* Crew Details Card - 25% */}
          <View style={[styles.crewDetailsColumn, { flex: 0.25 }]}>
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

          {/* Power Section - 25% */}
          <View style={[styles.powerSection, { flex: 0.25, marginHorizontal: 20 }]}>
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
              <Text style={[styles.tableCellHeader, styles.unitNameColumn]}>Name (Class)</Text>
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

            {/* Table Body - Create rows unit by unit with proper weapon splitting */}
            {(() => {
              const tableRows: React.ReactElement[] = [];
              
              crew.units.forEach((unit) => {
                // Ensure unit has at least one weapon, or create a row with empty weapon data
                const weapons = unit.weapons.length > 0 ? unit.weapons : [null];
                
                weapons.forEach((weapon, weaponIndex) => {
                  const isFirstWeaponOfUnit = weaponIndex === 0;
                  
                  tableRows.push(
                    <View key={`${unit.id}-weapon-${weaponIndex}`} style={styles.tableRow}>
                      {/* Unit data - only show on first weapon row of this unit */}
                      {isFirstWeaponOfUnit ? (
                        <>
                          <View style={[styles.tableCell, styles.unitNameColumn]}>
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
                      ) : (
                        <>
                          {/* Empty cells for subsequent weapon rows of this unit */}
                          <Text style={[styles.tableCell, styles.unitNameColumn]}></Text>
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
                      
                      {/* Weapon data - appears on every row */}
                      <Text style={[styles.tableCell, styles.wide]}>
                        {weapon?.name || "No weapon"}
                      </Text>
                      <Text style={[styles.tableCell, styles.wide]}>
                        {weapon?.standardWeapon?.testValue} {weapon?.standardWeapon?.testAttribute}
                      </Text>
                      <Text style={[styles.tableCell, styles.extraWide]}>
                        {weapon ? formatWithCount(
                          weapon.standardWeapon?.traits.map((t) => t.trait.name) || []
                        ) : ""}
                      </Text>
                      <Text style={[styles.tableCell, styles.wide]}>
                        {weapon ? formatWithCount(
                          weapon.standardWeapon?.criticalEffects.map(
                            (c) => c.criticalEffect.name
                          ) || []
                        ) : ""}
                      </Text>
                      
                      {/* Rating - only show on first weapon row of this unit */}
                      {isFirstWeaponOfUnit ? (
                        <Text style={[styles.tableCell, styles.narrow]}>{unit.rating}</Text>
                      ) : (
                        <Text style={[styles.tableCell, styles.narrow]}></Text>
                      )}
                    </View>
                  );
                });
              });
              
              return tableRows;
            })()}
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