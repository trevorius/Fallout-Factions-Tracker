import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { Prisma } from "@prisma/client";
import { getPdfTheme } from "@/lib/theme";
import { Theme, ThemeName } from "@/lib/types/theme";

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
function createPdfStyles(themeName: ThemeName) {
  const theme = getPdfTheme(themeName);
  const baseFontSize = 9; // Base font size for all calculations (like rem)

  // --- Relative Sizing ---
  const rem = (multiplier: number) => baseFontSize * multiplier;

  return StyleSheet.create({
    page: {
      flexDirection: "column",
      backgroundColor: theme.colors.background,
      color: theme.colors.foreground,
      padding: rem(2.2),
      fontSize: baseFontSize,
      fontFamily: "Helvetica", // PDF-compatible font
    },
    title: {
      fontSize: rem(2.6),
      fontWeight: theme.typography.fontWeight.bold,
      marginBottom: rem(1.8),
      textAlign: "center",
      color: theme.colors.foreground,
    },
    section: {
      marginBottom: rem(1.8),
    },
    sectionTitle: {
      fontSize: rem(2),
      fontWeight: theme.typography.fontWeight.bold,
      marginBottom: rem(0.9),
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
      paddingBottom: rem(0.4),
      color: theme.colors.foreground,
    },
    crewDetails: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: rem(1.8),
      gap: rem(1.3),
    },
    crewDetailsColumn: {
      padding: rem(0.9),
      border: `1px solid ${theme.colors.border}`,
      borderRadius: rem(0.5),
      backgroundColor: theme.colors.card,
    },
    crewDetailsRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: rem(0.4),
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
      padding: rem(0.9),
      border: `1px solid ${theme.colors.border}`,
      borderRadius: rem(0.5),
    },
    powerTitle: {
      fontSize: rem(2.2),
      fontWeight: theme.typography.fontWeight.bold,
      marginBottom: rem(0.4),
      color: theme.colors.foreground,
    },
    powerItem: {
      textAlign: "center",
      marginHorizontal: rem(1.8),
    },
    powerValue: {
      fontSize: rem(2),
      fontWeight: theme.typography.fontWeight.bold,
      color: theme.colors.foreground,
    },
    powerLabel: {
      fontSize: baseFontSize,
      marginTop: rem(0.2),
      color: theme.colors.mutedForeground,
    },
    unitName: {
      fontWeight: theme.typography.fontWeight.bold,
      fontSize: rem(1.5),
      color: theme.colors.foreground,
      lineHeight: 1.2,
      textAlign: "center",
    },
    unitClass: {
      fontSize: baseFontSize * 0.9,
      color: theme.colors.mutedForeground,
      textAlign: "center",
      marginBottom: rem(0.4),
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
    // NEW Roster Styles
    unitRosterContainer: {
      border: `1px solid ${theme.colors.border}`,
      borderRadius: rem(0.5),
      marginTop: rem(0.9),
    },
    rosterHeader: {
      flexDirection: "row",
      backgroundColor: theme.colors.muted,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
      padding: rem(0.4),
    },
    rosterHeaderCell: {
      fontWeight: theme.typography.fontWeight.bold,
      fontSize: rem(1.3),
      textAlign: "center",
      color: theme.colors.foreground,
    },
    unitRow: {
      flexDirection: "row",
      borderBottomWidth: 0.5,
      borderBottomColor: theme.colors.border,
      paddingVertical: rem(0.9),
      backgroundColor: theme.colors.card,
    },
    healthTrackerSection: {
      flex: 0.5,
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: rem(0.2),
    },
    healthCheckbox: {
      width: rem(1.3),
      height: rem(1.3),
      border: `0.5px solid ${theme.colors.mutedForeground}`,
      marginBottom: rem(0.2),
    },
    unitSection: {
      paddingHorizontal: rem(0.9),
      flexDirection: "column",
    },
    unitStatsSection: {
      flex: 3.5,
      justifyContent: "center", // Vertical centering
      alignItems: "center",
      borderLeftWidth: 1,
      borderColor: theme.colors.border,
    },
    unitWeaponsSection: {
      flex: 5,
      borderLeftWidth: 1,
      borderRightWidth: 1,
      borderColor: theme.colors.border,
    },
    unitHistorySection: {
      flex: 1.5,
    },
    specialRow: {
      flexDirection: "row",
      justifyContent: "space-around",
      alignItems: "center",
      width: "100%",
      marginVertical: rem(0.4),
    },
    specialItem: {
      alignItems: "center",
    },
    specialValue: {
      fontWeight: theme.typography.fontWeight.bold,
    },
    hpValue: {
      marginTop: rem(0.4),
      fontSize: rem(1),
    },
    weaponItem: {
      marginBottom: rem(0.9),
      paddingBottom: rem(0.9),
      borderBottomWidth: 0.5,
      borderBottomColor: theme.colors.muted,
    },
    weaponName: {
      fontWeight: theme.typography.fontWeight.bold,
      color: theme.colors.foreground,
      fontSize: rem(0.8),
    },
    detailRow: {
      flexDirection: "row",
      marginTop: rem(0.2),
    },
    detailLabel: {
      fontWeight: theme.typography.fontWeight.bold,
      color: theme.colors.mutedForeground,
      width: "20%",
      fontSize: rem(0.8),
    },
    detailValue: {
      flex: 1,
      color: theme.colors.cardForeground,
    },
    weaponDetailValue: {
      fontSize: rem(0.8),
    },
    traitText: {
      fontStyle: "italic",
    },
    criticalEffectText: {
      fontStyle: "italic",
      fontWeight: theme.typography.fontWeight.bold,
    },
    historyItem: {
      marginBottom: rem(0.4),
    },
    historyLabel: {
      fontWeight: theme.typography.fontWeight.bold,
      color: theme.colors.mutedForeground,
      marginBottom: rem(0.2),
    },
  });
}

interface CrewRosterPDFProps {
  crew: CrewForPDF;
  theme?: ThemeName; // Theme preference for PDF styling
}

const baseFontSize = 9; // Base font size for all calculations (like rem)
const rem = (multiplier: number) => baseFontSize * multiplier;

export function CrewRosterPDF({
  crew,
  theme = Theme.LIGHT,
}: CrewRosterPDFProps) {
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
          <View
            style={[
              styles.powerSection,
              { flex: 0.25, marginHorizontal: rem(2.2) },
            ]}
          >
            <Text style={styles.powerTitle}>POWER</Text>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-around",
                alignItems: "center",
              }}
            >
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
            <Text
              style={[
                {
                  fontSize: baseFontSize,
                  fontStyle: "italic",
                  color: "#666666",
                },
              ]}
            >
              Coming soon...
            </Text>
          </View>
        </View>

        {/* Unit Roster Table - NEW 3-COLUMN STRUCTURE */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Unit Roster</Text>
          <View style={styles.unitRosterContainer}>
            {/* Roster Header */}
            <View style={styles.rosterHeader}>
              <Text style={[styles.rosterHeaderCell, { flex: 0.5 }]}></Text>
              <Text style={[styles.rosterHeaderCell, { flex: 3.5 }]}>
                Unit Stats
              </Text>
              <Text style={[styles.rosterHeaderCell, { flex: 5 }]}>
                Weapons
              </Text>
              <Text style={[styles.rosterHeaderCell, { flex: 1.5 }]}>
                Unit History
              </Text>
            </View>

            {/* Roster Body */}
            {crew.units.map((unit) => {
              const allUpgrades =
                unit.weapons.flatMap(
                  (w) =>
                    w.appliedUpgrades?.map((u) => u.weaponUpgrade.name) || []
                ) || [];
              const formattedUpgrades = formatWithCount(allUpgrades);

              return (
                <View key={unit.id} style={styles.unitRow} wrap={false}>
                  <View style={styles.healthTrackerSection}>
                    {Array.from({ length: unit.hp }, (_, i) => (
                      <View key={`hp-box-${i}`} style={styles.healthCheckbox} />
                    ))}
                  </View>
                  {/* Column 1: Unit Stats */}
                  <View style={[styles.unitSection, styles.unitStatsSection]}>
                    <Text style={styles.unitName}>{unit.name}</Text>
                    <Text style={styles.unitClass}>
                      ({unit.unitClass.name})
                    </Text>
                    <View style={styles.specialRow}>
                      {["s", "p", "e", "c", "i", "a", "l"].map((stat) => (
                        <View key={stat} style={styles.specialItem}>
                          <Text style={styles.label}>{stat.toUpperCase()}</Text>
                          <Text style={styles.specialValue}>
                            {String(unit[stat as keyof typeof unit])}
                          </Text>
                        </View>
                      ))}
                      <View style={styles.specialItem}>
                        <Text style={styles.label}>HP</Text>
                        <Text style={styles.specialValue}>{unit.hp}</Text>
                      </View>
                    </View>
                  </View>

                  {/* Column 2: Weapons */}
                  <View style={[styles.unitSection, styles.unitWeaponsSection]}>
                    {unit.weapons.length > 0 ? (
                      unit.weapons.map((weapon, index) => (
                        <View
                          key={weapon.id}
                          style={[
                            styles.weaponItem,
                            {
                              borderBottomWidth:
                                index === unit.weapons.length - 1 ? 0 : 0.5,
                              paddingBottom:
                                index === unit.weapons.length - 1
                                  ? 0
                                  : rem(0.4),
                              marginBottom:
                                index === unit.weapons.length - 1
                                  ? 0
                                  : rem(0.4),
                            },
                          ]}
                        >
                          <Text style={styles.weaponName}>
                            {weapon.name || "N/A"}
                          </Text>
                          <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>Test:</Text>
                            <Text
                              style={[
                                styles.detailValue,
                                styles.weaponDetailValue,
                              ]}
                            >
                              {weapon.standardWeapon?.testValue}{" "}
                              {weapon.standardWeapon?.testAttribute}
                            </Text>
                          </View>
                          <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>Traits:</Text>
                            <Text
                              style={[
                                styles.detailValue,
                                styles.weaponDetailValue,
                                styles.traitText,
                              ]}
                            >
                              {formatWithCount(
                                weapon.standardWeapon?.traits.map(
                                  (t) => t.trait.name
                                ) || []
                              )}
                            </Text>
                          </View>
                          <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>Critical:</Text>
                            <Text
                              style={[
                                styles.detailValue,
                                styles.weaponDetailValue,
                                styles.criticalEffectText,
                              ]}
                            >
                              {formatWithCount(
                                weapon.standardWeapon?.criticalEffects.map(
                                  (c) => c.criticalEffect.name
                                ) || []
                              )}
                            </Text>
                          </View>
                        </View>
                      ))
                    ) : (
                      <Text style={{ fontStyle: "italic" }}>Unarmed</Text>
                    )}
                  </View>

                  {/* Column 3: Unit History */}
                  <View style={[styles.unitSection, styles.unitHistorySection]}>
                    {formattedUpgrades && (
                      <View style={styles.historyItem}>
                        <Text style={styles.historyLabel}>Upgrades:</Text>
                        <Text style={styles.detailValue}>
                          {formattedUpgrades}
                        </Text>
                      </View>
                    )}
                    {unit.perks.length > 0 && (
                      <View style={styles.historyItem}>
                        <Text style={styles.historyLabel}>Perks:</Text>
                        <Text style={styles.detailValue}>
                          {unit.perks.map((p) => p.perk.name).join(", ")}
                        </Text>
                      </View>
                    )}
                    {unit.injuries.length > 0 && (
                      <View style={styles.historyItem}>
                        <Text style={styles.historyLabel}>Injuries:</Text>
                        <Text style={styles.detailValue}>
                          {unit.injuries.map((i) => i.injury.name).join(", ")}
                        </Text>
                      </View>
                    )}
                    <View style={styles.historyItem}>
                      <Text style={styles.historyLabel}>Rating:</Text>
                      <Text style={styles.detailValue}>{unit.rating}</Text>
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
        </View>
      </Page>
    </Document>
  );
}
