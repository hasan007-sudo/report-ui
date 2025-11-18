import { useState, useEffect, useRef } from "react";
import type { ReportDataV2 } from "@/types/cefr-report";
import { TranscriptFilters } from "./transcript-filters";
import { useAudioPlayer } from "@/contexts/audio-player-context";
import { parseTimeToSeconds, findActiveSegmentIndex } from "@/lib/audio-utils";
import { cn } from "@/lib/utils";

interface TranscriptSectionProps {
  reportData: ReportDataV2;
}

export function TranscriptSection({ reportData }: TranscriptSectionProps) {
  const transcript = reportData.transcript;
  const segments = transcript?.segments ?? [];
  const speakerMap = transcript?.speaker_map ?? [];
  const [showMistakesOnly, setShowMistakesOnly] = useState(false);
  const [followMode, setFollowMode] = useState(true); // Follow mode ON by default
  const { currentTime, seekTo } = useAudioPlayer();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const segmentRefs = useRef<(HTMLDivElement | null)[]>([]);
  const isAutoScrollingRef = useRef(false); // Track if we're auto-scrolling
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Find active segment based on current playback time
  const activeSegmentIndex = findActiveSegmentIndex(currentTime, segments);

  // Auto-scroll to active segment (only if follow mode is ON)
  useEffect(() => {
    if (
      followMode &&
      activeSegmentIndex >= 0 &&
      segmentRefs.current[activeSegmentIndex]
    ) {
      isAutoScrollingRef.current = true; // Mark as auto-scroll
      segmentRefs.current[activeSegmentIndex]?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });

      // Reset auto-scroll flag after animation completes
      setTimeout(() => {
        isAutoScrollingRef.current = false;
      }, 1000); // Smooth scroll typically takes ~500-800ms
    }
  }, [activeSegmentIndex, followMode]);

  // Detect manual scroll and disable follow mode
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    const handleScroll = () => {
      // If we're auto-scrolling, ignore this event
      if (isAutoScrollingRef.current) return;

      // Clear existing timeout
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }

      // Debounce: Only disable follow mode if user has stopped scrolling
      scrollTimeoutRef.current = setTimeout(() => {
        if (followMode) {
          setFollowMode(false); // Auto-disable on manual scroll
        }
      }, 150); // 150ms debounce
    };

    scrollContainer.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      scrollContainer.removeEventListener("scroll", handleScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [followMode]);

  // Helper to get speaker name
  const getSpeakerName = (speakerId: string) => {
    const speaker = speakerMap.find((s) => s.speaker_id === speakerId);
    return speaker?.speaker_name ?? speakerId;
  };

  // Handle timestamp click to seek audio
  const handleTimestampClick = (timeString: string) => {
    const seconds = parseTimeToSeconds(timeString);
    seekTo(seconds);
  };

  return (
    <div className="h-full">
      {/* Transcript Filters */}
      <TranscriptFilters
        showMistakesOnly={showMistakesOnly}
        onShowMistakesOnlyChange={setShowMistakesOnly}
        totalSegments={segments.length}
        followMode={followMode}
        onFollowModeChange={setFollowMode}
      />

      {/* Transcript Messages */}
      <div ref={scrollContainerRef} className="space-y-3 p-6">
        {segments.map((segment, index) => {
          const speakerName = getSpeakerName(segment.speaker);
          const isStudent = segment.speaker === "SPEAKER_02";
          const isActive = index === activeSegmentIndex;

          return (
            <div
              key={index}
              ref={(el) => {
                segmentRefs.current[index] = el;
              }}
              className={cn(
                "flex transition-all duration-200",
                isStudent ? "justify-end" : "justify-start",
                isActive && "scale-[1.02]"
              )}
            >
              <div
                className={cn(
                  "max-w-[70%] flex flex-col",
                  isStudent ? "items-end" : "items-start"
                )}
              >
                {/* Speaker Name & Time */}
                <div
                  className={cn(
                    "flex items-center gap-2 mb-1",
                    isStudent && "flex-row-reverse"
                  )}
                >
                  <span className="text-xs font-semibold text-gray-700">
                    {speakerName}
                  </span>
                  <button
                    onClick={() => handleTimestampClick(segment.start_time)}
                    className={cn(
                      "text-xs font-mono transition-colors hover:text-blue-600 hover:underline cursor-pointer",
                      isActive ? "text-blue-600 font-semibold" : "text-gray-400"
                    )}
                    title="Click to play from here"
                  >
                    {segment.start_time}
                  </button>
                </div>

                {/* Message Bubble */}
                <div
                  className={cn(
                    "rounded-lg px-4 py-2 transition-all",
                    isStudent
                      ? "bg-gray-200 rounded-tr-none"
                      : "bg-blue-100 text-blue-900 rounded-tl-none",
                    isActive && "ring-2 ring-blue-500 ring-offset-2"
                  )}
                >
                  <p className="text-[12px]">{segment.content}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
