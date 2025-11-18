import { useState, useRef } from "react";
import type { ReportDataV2 } from "@/types/cefr-report";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { CEFRSubTabs } from "./report/cefr-sub-tabs";
import { OverviewSection } from "./report/overview-section";
import { TranscriptSection } from "./report/transcript-section";
import { GrammarSection } from "./report/grammar-section";
import { FluencySection } from "./report/fluency-section";
import { VocabularySection } from "./report/vocabulary-section";
import { PronunciationSection } from "./report/pronunciation-section";
import { ClaritySection } from "./report/clarity-section";
import { AudioPlayerProvider } from "@/contexts/audio-player-context";
import { StickyAudioPlayer } from "./report/sticky-audio-player";

interface CEFRReportProps {
  reportData: ReportDataV2;
  audioUrl: string | null;
  recordingTitle?: string;
  studentName?: string;
  variant?: "standalone" | "integrated";
}

export function CEFRReport({
  reportData,
  audioUrl,
  recordingTitle = "Audio Recording",
  studentName = "Student",
  // variant = "integrated",
}: CEFRReportProps) {
  const [activeTab, setActiveTab] = useState<
    "overall" | "grammar" | "fluency" | "vocabulary" | "pronunciation" | "clarity"
  >("overall");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Ref for the scroll area viewport
  const scrollViewportRef = useRef<HTMLDivElement>(null);

  // Calculate sticky top class based on variant
  // const stickyTopClass = variant === "standalone"
  //   ? "top-0"                    // Standalone: stick to component top
  //   : "top-[15%] xl:top-[10%]";  // Integrated: original positioning

  // Extract scores from report data
  const scores = {
    clarity: reportData.reports?.cefr?.clarity?.score?.score ?? 0,
    fluency: reportData.reports?.cefr?.fluency?.score?.score ?? 0,
    grammar: reportData.reports?.cefr?.grammar?.score?.score ?? 0,
    vocabulary: reportData.reports?.cefr?.vocabulary?.score?.score ?? 0,
    pronunciation: reportData.reports?.cefr?.pronunciation?.score?.score ?? 0,
  };

  return (
    <AudioPlayerProvider audioUrl={audioUrl}>
      <div className="w-full py-4">
        <div className="flex h-[80vh] w-full flex-col gap-6 xl:grid xl:grid-cols-[auto_1fr]">
          {/* Left Column - Transcript Sidebar */}
          <aside
            className={`bg-card relative h-full min-h-0 rounded-lg border shadow-sm transition-all duration-300 ease-in-out ${isSidebarCollapsed ? "xl:w-[60px]" : "w-full xl:w-[480px]"
              }`}
          >
            {/* Half-Outside Collapse Button */}
            <Button
              variant="outline"
              size="icon"
              className="bg-background hover:bg-accent absolute top-14 right-[-20px] z-4 hidden h-10 w-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full shadow-lg xl:flex"
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            >
              {isSidebarCollapsed ? (
                <ChevronRight className="text-foreground h-5 w-5" />
              ) : (
                <ChevronLeft className="text-foreground h-5 w-5" />
              )}
            </Button>

            {/* Collapsed State - Vertical Tab */}
            {isSidebarCollapsed && (
              <div
                className="hover:bg-accent/50 hidden h-full cursor-pointer flex-col items-center justify-center gap-3 transition-colors xl:flex"
                onClick={() => setIsSidebarCollapsed(false)}
              >
                <span
                  style={{ writingMode: "vertical-rl" }}
                  className="text-muted-foreground rotate-180 text-sm font-medium"
                >
                  Transcript
                </span>
              </div>
            )}

            {/* Expanded State - Full Transcript */}
            {!isSidebarCollapsed && (
              <div className="h-full overflow-hidden">
                <ScrollArea className="h-full">
                  <TranscriptSection reportData={reportData} />
                </ScrollArea>
              </div>
            )}
          </aside>

          {/* Right Column - Tabbed Content */}
          <main className="relative h-full min-h-0 transition-all duration-300 ease-in-out">
            <Tabs
              value={activeTab}
              onValueChange={(value) =>
                setActiveTab(
                  value as
                  | "overall"
                  | "grammar"
                  | "fluency"
                  | "vocabulary"
                  | "pronunciation"
                  | "clarity",
                )
              }
              className="gap-0"
            >
              {/* Sticky Tabs Container */}
              <div className={`bg-card rounded-t-lg border shadow-sm`}>
                <CEFRSubTabs
                  activeTab={activeTab}
                  onTabChange={setActiveTab}
                  scores={scores}
                  scrollContainerRef={scrollViewportRef}
                />
              </div>

              {/* Content Area with Scrolling */}
              <ScrollArea
                className="bg-card h-[76vh] rounded-b-lg border-x border-b shadow-sm"
                viewportRef={scrollViewportRef}
              >
                <TabsContent value="overall" className="mt-0 p-4">
                  <OverviewSection reportData={reportData} />
                </TabsContent>
                <TabsContent value="grammar" className="mt-0 p-4">
                  <GrammarSection reportData={reportData} />
                </TabsContent>
                <TabsContent value="fluency" className="mt-0 p-4">
                  <FluencySection reportData={reportData} />
                </TabsContent>
                <TabsContent value="vocabulary" className="mt-0 p-4">
                  <VocabularySection reportData={reportData} />
                </TabsContent>
                <TabsContent value="pronunciation" className="mt-0 p-4">
                  <PronunciationSection reportData={reportData} />
                </TabsContent>
                <TabsContent value="clarity" className="mt-0 p-4">
                  <ClaritySection reportData={reportData} />
                </TabsContent>
              </ScrollArea>
            </Tabs>
          </main>
        </div>
      </div>

      {/* Sticky Audio Player */}
      <StickyAudioPlayer
        recordingTitle={recordingTitle}
        studentName={studentName}
      />
    </AudioPlayerProvider>
  );
}
