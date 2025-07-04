import { NextRequest, NextResponse } from "next/server";
import { generateCrewRosterPDF } from "@/lib/actions/pdf-actions";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ crewId: string }> }
) {
  try {
    const { crewId } = await params;
    const { searchParams } = new URL(request.url);
    const theme = searchParams.get("theme");

    // Use server action to generate PDF
    const result = await generateCrewRosterPDF(crewId, theme || undefined);
    
    if (!result.success) {
      const status = result.error === "Authentication required" ? 401 : 
                    result.error === "Crew not found or access denied" ? 404 : 500;
      
      return NextResponse.json(
        { error: result.error },
        { status }
      );
    }

    // Return PDF response
    return new NextResponse(result.buffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${result.filename}"`,
      },
    });
  } catch (error) {
    console.error("Error in PDF route:", error);
    return NextResponse.json(
      { error: "Failed to generate PDF" },
      { status: 500 }
    );
  }
}