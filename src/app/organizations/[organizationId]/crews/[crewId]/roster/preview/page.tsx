import { CrewRosterViewer } from "@/components/crews/crew-roster-viewer";
import { ThemeName, getValidTheme } from "@/lib/types/theme";

interface CrewRosterPreviewPageProps {
  params: {
    crewId: string;
    organizationId: string; // Added to match the new route
  };
  searchParams: {
    theme?: string;
  };
}

export default function CrewRosterPreviewPage({
  params,
  searchParams,
}: CrewRosterPreviewPageProps) {
  const { crewId } = params;

  // Validate theme from search params, default to a sensible value
  const theme: ThemeName = getValidTheme(searchParams.theme);

  return <CrewRosterViewer crewId={crewId} theme={theme} />;
}
