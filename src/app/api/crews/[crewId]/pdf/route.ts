import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { CrewRosterPDF } from "@/components/crews/crew-roster-pdf";
import { renderToBuffer } from "@react-pdf/renderer";
import { NextRequest, NextResponse } from "next/server";
import React from "react";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ crewId: string }> }
) {
  try {
    const { crewId } = await params;
    const { searchParams } = new URL(request.url);
    const organizationId = searchParams.get("organizationId");

    if (!organizationId) {
      return NextResponse.json(
        { error: "Organization ID is required" },
        { status: 400 }
      );
    }

    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "You must be logged in to generate a PDF." },
        { status: 401 }
      );
    }

    // Get crew data with all necessary relations
    const crewData = await prisma.crew.findUnique({
      where: {
        id: crewId,
        userId: session.user.id, // Ensure user can only access their own crew
        organizationId: organizationId,
      },
      include: {
        faction: {
          select: { name: true },
        },
        user: {
          select: { name: true },
        },
        units: {
          include: {
            unitClass: {
              select: { name: true },
            },
            injuries: {
              include: {
                injury: {
                  select: { name: true, description: true },
                },
              },
            },
            perks: {
              include: {
                perk: {
                  select: { name: true, description: true },
                },
              },
            },
            weapons: {
              include: {
                standardWeapon: {
                  include: {
                    traits: {
                      include: {
                        trait: {
                          select: { name: true },
                        },
                      },
                    },
                    criticalEffects: {
                      include: {
                        criticalEffect: {
                          select: { name: true },
                        },
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
      return NextResponse.json(
        { error: "Crew not found." },
        { status: 404 }
      );
    }

    // Generate PDF
    const pdfDocument = React.createElement(CrewRosterPDF, { crew: crewData });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const buffer = await renderToBuffer(pdfDocument as any);

    // Return PDF response
    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${crewData.name.replace(/[^a-zA-Z0-9]/g, "_")}_roster.pdf"`,
      },
    });
  } catch (error) {
    console.error("Error generating PDF:", error);
    return NextResponse.json(
      { error: "Failed to generate PDF" },
      { status: 500 }
    );
  }
}