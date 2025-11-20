"use client";

import { useState, useEffect, useRef } from "react";
import type { ReportDataV2 } from "@/types/cefr-report";
import { TranscriptFilters } from "./transcript-filters";
import { useAudioPlayer } from "@/contexts/audio-player-context";
import { parseTimeToSeconds, findActiveSegmentIndex } from "@/lib/audio-utils";
import { cn } from "@/lib/utils";
import { User, Bot } from "lucide-react";

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
    <div className="h-full flex flex-col bg-background">
      {/* Transcript Filters */}
      <div className="sticky top-0 z-10">
        <TranscriptFilters
          showMistakesOnly={showMistakesOnly}
          onShowMistakesOnlyChange={setShowMistakesOnly}
          totalSegments={segments.length}
          followMode={followMode}
          onFollowModeChange={setFollowMode}
        />
      </div>

      {/* Transcript Messages */}
      <div ref={scrollContainerRef} className="flex-1 overflow-y-auto space-y-6 p-6">
        {segments.map((segment, index) => {
          const speakerName = getSpeakerName(segment.speaker);
          const isStudent = speakerName?.trim().toLowerCase() === "student";
          const isActive = index === activeSegmentIndex;

          return (
            <div
              key={index}
              ref={(el) => {
                segmentRefs.current[index] = el;
              }}
              className={cn(
                "flex flex-col gap-1 transition-opacity duration-200",
                isActive ? "opacity-100" : "opacity-80 hover:opacity-100"
              )}
            >
              {/* Header: Icon, Name, Time */}
              <div className="flex items-center gap-2">
                {/* Icon */}
                {isStudent ? (
                  <User className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                ) : (
                  <Bot className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                )}

                <span className={cn(
                  "text-sm font-semibold",
                  isStudent ? "text-blue-700 dark:text-blue-400" : "text-emerald-700 dark:text-emerald-400"
                )}>
                  {isStudent ? "You" : speakerName}
                </span>
                <span className="text-xs text-zinc-500 font-medium">, {segment.start_time}</span>
              </div>

              {/* Message Text - Full Width */}
              <div
                onClick={() => handleTimestampClick(segment.start_time)}
                className={cn(
                  "text-base leading-relaxed cursor-pointer transition-colors",
                  isActive
                    ? "text-zinc-900 dark:text-zinc-50 font-medium"
                    : "text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-50"
                )}
              >
                {segment.content}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
