import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  getUniqueTagsFromSegments,
  getTagColorClass,
  sortTags,
} from "@/lib/segment-utils";

interface TagFilterPillsProps<T extends { tags?: string[] }> {
  segments: T[];
  selectedTags: Set<string>;
  onTagsChange: (tags: Set<string>) => void;
  className?: string;
}

export function TagFilterPills<T extends { tags?: string[] }>({
  segments,
  selectedTags,
  onTagsChange,
  className = "",
}: TagFilterPillsProps<T>) {
  // Extract and sort all unique tags
  const availableTags = useMemo(() => {
    const tags = getUniqueTagsFromSegments(segments);
    return sortTags(tags);
  }, [segments]);

  // Count segments per tag
  const tagCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    segments.forEach(segment => {
      if (segment.tags && segment.tags.length > 0) {
        segment.tags.forEach(tag => {
          counts[tag] = (counts[tag] || 0) + 1;
        });
      }
    });
    return counts;
  }, [segments]);

  const handleTagClick = (tag: string) => {
    const newTags = new Set(selectedTags);
    if (newTags.has(tag)) {
      newTags.delete(tag);
    } else {
      newTags.add(tag);
    }
    onTagsChange(newTags);
  };

  const handleSelectAll = () => {
    onTagsChange(new Set(availableTags));
  };

  const handleClearAll = () => {
    onTagsChange(new Set());
  };

  if (availableTags.length === 0) {
    return null;
  }

  const allSelected = selectedTags.size === availableTags.length;
  const noneSelected = selectedTags.size === 0;

  return (
    <div className={cn("mb-4", className)}>
      {/* Control buttons */}
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xs text-gray-600 font-medium">Filter by tags:</span>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleSelectAll}
          disabled={allSelected}
          className="h-6 px-2 text-xs"
        >
          Select All
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleClearAll}
          disabled={noneSelected}
          className="h-6 px-2 text-xs"
        >
          Clear All
        </Button>
        <span className="text-[10px] text-gray-500 ml-auto">
          {selectedTags.size} of {availableTags.length} selected
        </span>
      </div>

      {/* Tag pills */}
      <div className="flex flex-wrap gap-1.5">
        {availableTags.map(tag => {
          const isSelected = selectedTags.has(tag);
          const count = tagCounts[tag] || 0;

          return (
            <button
              key={tag}
              onClick={() => handleTagClick(tag)}
              className={cn(
                "inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium transition-all border",
                isSelected
                  ? getTagColorClass(tag)
                  : "bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100"
              )}
              title={`${isSelected ? "Hide" : "Show"} ${count} segment${
                count !== 1 ? "s" : ""
              } with "${tag}" tag`}
            >
              <span>{tag}</span>
              <span
                className={cn(
                  "text-[10px] px-1 py-0 rounded-full",
                  isSelected
                    ? "bg-white/30 text-inherit"
                    : "bg-gray-200 text-gray-600"
                )}
              >
                {count}
              </span>
              {isSelected && (
                <svg
                  className="w-2.5 h-2.5 ml-0.5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </button>
          );
        })}
      </div>

      {/* Help text when no tags selected */}
      {noneSelected && (
        <div className="mt-2 p-2 bg-amber-50 border border-amber-200 rounded-lg">
          <p className="text-xs text-amber-800">
            Please select at least one tag to view segments
          </p>
        </div>
      )}
    </div>
  );
}