'use server';

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { CrewRosterPDF } from "@/components/crews/crew-roster-pdf";
import { renderToBuffer } from "@react-pdf/renderer";
import React from "react";
import { Theme, ThemeName, getValidTheme } from "@/lib/types/theme";

type PDFGenerationResult = {
  success: true;
  buffer: Buffer;
  filename: string;
} | {
  success: false;
  error: string;
};

/**
 * Generate PDF for crew roster
 * @param crewId - The crew ID to generate PDF for
 * @param theme - Theme preference for PDF styling
 * @returns PDF buffer and filename or error
 */
export async function generateCrewRosterPDF(
  crewId: string,
  theme?: string
): Promise<PDFGenerationResult> {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user?.id) {
      return {
        success: false,
        error: "Authentication required"
      };
    }

    // Fetch crew data with all necessary relations
    const crewData = await prisma.crew.findFirst({
      where: {
        id: crewId,
        userId: session.user.id, // Ensure user owns this crew
      },
      include: {
        faction: { select: { name: true } },
        user: { select: { name: true } },
        units: {
          include: {
            unitClass: { select: { name: true } },
            injuries: {
              include: { injury: { select: { name: true, description: true } } },
            },
            perks: {
              include: { perk: { select: { name: true, description: true } } },
            },
            weapons: {
              include: {
                standardWeapon: {
                  include: {
                    traits: { include: { trait: { select: { name: true } } } },
                    criticalEffects: {
                      include: {
                        criticalEffect: { select: { name: true } },
                      },
                    },
                  },
                },
                appliedUpgrades: {
                  include: {
                    weaponUpgrade: {
                      select: { name: true, description: true },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!crewData) {
      return {
        success: false,
        error: "Crew not found or access denied"
      };
    }

    // Validate and set theme
    const selectedTheme = getValidTheme(theme);

    // Generate PDF
    const pdfDocument = React.createElement(CrewRosterPDF, {
      crew: crewData,
      theme: selectedTheme,
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const buffer = await renderToBuffer(pdfDocument as any);

    // Generate safe filename
    const filename = `${crewData.name.replace(/[^a-zA-Z0-9]/g, "_")}_roster.pdf`;

    return {
      success: true,
      buffer: Buffer.from(buffer),
      filename
    };

  } catch (error) {
    console.error("Error generating PDF:", error);
    return {
      success: false,
      error: "Failed to generate PDF"
    };
  }
}

/**
 * Get current theme from client-side detection
 * This is a helper for when theme needs to be detected on the client
 */
export function detectThemeFromDOM(): ThemeName {
  if (typeof window === 'undefined') {
    return Theme.LIGHT;
  }
  
  const htmlElement = document.documentElement;
  if (htmlElement.classList.contains(Theme.DARK)) {
    return Theme.DARK;
  } else if (htmlElement.classList.contains(Theme.BLUE)) {
    return Theme.BLUE;
  } else {
    return Theme.LIGHT;
  }
}