import { Badge } from "@/components/ui/badge";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

interface CEFRSubTabsProps {
  activeTab:
    | "overall"
    | "grammar"
    | "fluency"
    | "vocabulary"
    | "pronunciation"
    | "clarity";
  onTabChange: (
    tab:
      | "overall"
      | "grammar"
      | "fluency"
      | "vocabulary"
      | "pronunciation"
      | "clarity"
  ) => void;
  scores: {
    overall: number;
    grammar: number;
    fluency: number;
    vocabulary: number;
    pronunciation: number;
    clarity: number;
  };
  scrollContainerRef?: React.RefObject<HTMLDivElement | null>;
}

function getScoreBadgeClassName(score: number, isActive: boolean): string {
  if (isActive) {
    return "bg-background text-foreground font-bold";
  }

  // Match radial chart color scheme: Green (70+), Yellow (50-69), Red (<50)
  if (score >= 70)
    return "bg-green-600 text-white hover:bg-green-700 border-green-600";
  if (score >= 50)
    return "bg-yellow-500 text-white hover:bg-yellow-600 border-yellow-500";
  return "bg-red-500 text-white hover:bg-red-600 border-red-500";
}

export function CEFRSubTabs({
  activeTab,
  onTabChange,
  scores,
  scrollContainerRef,
}: CEFRSubTabsProps) {
  const handleTabChange = (
    tab: typeof activeTab
  ) => {
    // Smooth scroll to top of tab content container when tab changes
    if (scrollContainerRef?.current) {
      scrollContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
    onTabChange(tab);
  };

  const tabs: Array<{
    id:
      | "overall"
      | "grammar"
      | "fluency"
      | "vocabulary"
      | "pronunciation"
      | "clarity";
    label: string;
    hasScore: boolean;
  }> = [
    { id: "overall", label: "Overall", hasScore: true },
    { id: "grammar", label: "Grammar", hasScore: true },
    { id: "fluency", label: "Fluency", hasScore: true },
    { id: "vocabulary", label: "Vocabulary", hasScore: true },
    { id: "pronunciation", label: "Pronunciation", hasScore: true },
    { id: "clarity", label: "Clarity", hasScore: true },
  ];

  return (
    <TabsList className="w-full justify-start overflow-x-auto bg-muted/50 border-b h-auto p-2 gap-1.5 flex-wrap sm:flex-nowrap rounded-none">
      {tabs.map((tab) => {
        const score = tab.hasScore ? scores[tab.id as keyof typeof scores] : 0;
        const isActive = activeTab === tab.id;

        return (
          <TabsTrigger
            key={tab.id}
            value={tab.id}
            onClick={() => handleTabChange(tab.id)}
            className={cn(
              "gap-2 text-xs font-semibold whitespace-nowrap transition-all duration-200",
              "data-[state=active]:shadow-md data-[state=active]:ring-2 data-[state=active]:ring-primary/50",
              "hover:scale-105 cursor-pointer"
            )}
            aria-label={
              tab.hasScore ? `${tab.label} - Score: ${score}` : tab.label
            }
          >
            <span>{tab.label}</span>
            {tab.hasScore && (
              <Badge
                className={cn(
                  "font-bold text-[10px] px-1.5 py-0 h-5 transition-colors",
                  getScoreBadgeClassName(score, isActive)
                )}
              >
                {score}
              </Badge>
            )}
          </TabsTrigger>
        );
      })}
    </TabsList>
  );
}
