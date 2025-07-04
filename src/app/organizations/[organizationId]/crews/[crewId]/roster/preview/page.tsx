import { CrewRosterViewer } from "@/components/crews/crew-roster-viewer";
import { getValidTheme, ThemeName } from "@/lib/types/theme";

interface CrewRosterPreviewPageProps {
  params: Promise<{
    crewId: string;
    organizationId: string;
  }>;
  searchParams: Promise<{
    theme?: string;
  }>;
}

export default async function CrewRosterPreviewPage({
  params,
  searchParams,
}: CrewRosterPreviewPageProps) {
  const { crewId } = await params;
  const { theme: themeParam } = await searchParams;
  // Validate theme from search params, default to a sensible value
  const theme: ThemeName = getValidTheme(themeParam);

  return <CrewRosterViewer crewId={crewId} theme={theme} />;
}
