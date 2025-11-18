import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronUp, Play } from "lucide-react";
import { useAudioPlayer } from "@/contexts/audio-player-context";
import { parseTimeToSeconds, isTimeInSegment } from "@/lib/audio-utils";
import { cn } from "@/lib/utils";

interface SegmentCardProps {
  timestamp: string;
  content: string;
  suggestion?: string[];
  explanation?: string;
  tags?: string[];
  className?: string;
  endTimestamp?: string;
}

function getTagColor(tag: string): string {
  const tagLower = tag.toLowerCase();
  if (tagLower.includes("error") || tagLower.includes("incorrect")) {
    return "bg-red-100 text-red-800 border-red-300";
  }
  if (tagLower.includes("tense") || tagLower.includes("verb")) {
    return "bg-orange-100 text-orange-800 border-orange-300";
  }
  if (tagLower.includes("preposition") || tagLower.includes("article")) {
    return "bg-yellow-100 text-yellow-800 border-yellow-300";
  }
  if (tagLower.includes("word") || tagLower.includes("choice")) {
    return "bg-blue-100 text-blue-800 border-blue-300";
  }
  return "bg-gray-100 text-gray-800 border-gray-300";
}

export function SegmentCard({
  timestamp,
  content,
  suggestion,
  explanation,
  tags,
  className = "",
  endTimestamp,
}: SegmentCardProps) {
  const [showExplanation, setShowExplanation] = useState(false);
  const { currentTime, seekTo } = useAudioPlayer();

  // Check if this segment is currently playing
  const isActive =
    endTimestamp && isTimeInSegment(currentTime, timestamp, endTimestamp);

  // Handle play button click
  const handlePlayClick = () => {
    const seconds = parseTimeToSeconds(timestamp);
    seekTo(seconds);
  };

  return (
    <Card
      className={cn(
        "transition-all duration-200 hover:shadow-md",
        isActive && "ring-2 ring-blue-500 shadow-lg",
        className
      )}
    >
      <CardContent className="p-4">
        {/* Timestamp and Tags */}
        <div className="flex items-start justify-between mb-2">
          <button
            onClick={handlePlayClick}
            className={cn(
              "group flex items-center gap-1.5 text-xs font-mono px-2 py-1 rounded transition-all hover:bg-blue-100",
              isActive
                ? "bg-blue-500 text-white font-semibold"
                : "bg-gray-100 text-gray-500"
            )}
            title="Click to play from this timestamp"
          >
            <Play
              className={cn(
                "w-3 h-3 transition-colors",
                isActive ? "fill-white" : "fill-gray-500 group-hover:fill-blue-600"
              )}
            />
            {timestamp}
          </button>
          {tags && tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {tags.map((tag, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className={`text-xs ${getTagColor(tag)}`}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Original Content */}
        <div className="mb-3">
          <p className="text-sm text-gray-900 italic border-l-4 border-red-400 pl-3 py-1 bg-red-50">
            "{content}"
          </p>
        </div>

        {/* Suggestions - Always Visible */}
        {suggestion && suggestion.length > 0 && (
          <div className="mb-3">
            <h5 className="text-xs font-semibold text-gray-700 mb-1">
              Suggested Correction{suggestion.length > 1 ? "s" : ""}:
            </h5>
            <ul className="space-y-1">
              {suggestion.map((sugg, index) => (
                <li
                  key={index}
                  className="text-sm text-gray-900 border-l-4 border-green-400 pl-3 py-1 bg-green-50"
                >
                  "{sugg}"
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Show Explanation Button - Only if explanation exists */}
        {explanation && (
          <button
            onClick={() => setShowExplanation(!showExplanation)}
            className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
          >
            {showExplanation ? (
              <>
                <ChevronUp className="w-4 h-4" />
                Hide explanation
              </>
            ) : (
              <>
                <ChevronDown className="w-4 h-4" />
                Show explanation
              </>
            )}
          </button>
        )}

        {/* Explanation - Hidden by default */}
        {showExplanation && explanation && (
          <div className="mt-3 pt-3 border-t border-gray-200">
            <h5 className="text-xs font-semibold text-gray-700 mb-1">
              Explanation:
            </h5>
            <p className="text-sm text-gray-700 bg-gray-50 p-2 rounded">
              {explanation}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
