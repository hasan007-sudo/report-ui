"use client";

import { Button } from "@/components/ui/button";
import { Radio } from "lucide-react";
import { cn } from "@/lib/utils";

interface TranscriptFiltersProps {
  showMistakesOnly: boolean;
  onShowMistakesOnlyChange: (checked: boolean) => void;
  totalSegments: number;
  filteredCount?: number;
  followMode: boolean;
  onFollowModeChange: (enabled: boolean) => void;
}

export function TranscriptFilters({
  showMistakesOnly: _showMistakesOnly,
  onShowMistakesOnlyChange: _onShowMistakesOnlyChange,
  totalSegments: _totalSegments,
  filteredCount: _filteredCount,
  followMode,
  onFollowModeChange,
}: TranscriptFiltersProps) {

  return (
    <div className="flex items-center rounded-t-lg justify-between border-b border-border px-4 py-3 sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-10">
      <div className="flex items-center gap-3">
        <div className="flex items-center space-x-2">
          {/* <Checkbox
            id="show-mistakes"
            checked={showMistakesOnly}
            onCheckedChange={onShowMistakesOnlyChange}
          />
          <Label
            htmlFor="show-mistakes"
            className="flex cursor-pointer items-center gap-2 text-sm font-medium"
          >
            <AlertCircle className="h-4 w-4 text-orange-500" />
            Show mistakes only
          </Label> */}
          <p className="flex items-center gap-2 text-sm font-medium text-foreground">
            Transcripts
          </p>
        </div>
      </div>

      {/* Follow Toggle Button - Inline in Header */}
      <Button
        size="sm"
        variant={followMode ? "default" : "outline"}
        onClick={() => onFollowModeChange(!followMode)}
        className={cn(
          "gap-2 transition-all",
          followMode
            ? "bg-primary text-primary-foreground hover:bg-primary/90"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        <Radio
          className={cn(
            "h-4 w-4",
            followMode ? "animate-pulse" : "opacity-60"
          )}
        />
        {followMode ? "Following" : "Follow"}
      </Button>

      {/* <div className="text-sm text-muted-foreground">
        {showMistakesOnly && filteredCount !== undefined ? (
          <span>
            Showing {displayCount} of {totalSegments} segments
          </span>
        ) : (
          <span>{totalSegments} segments</span>
        )}
      </div> */}
    </div>
  );
}
