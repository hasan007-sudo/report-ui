import { useState, useMemo } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { groupSegmentsByTag, sortTags } from "@/lib/segment-utils";
import { SegmentCard } from "./segment-card";

interface BaseSegment {
  timestamp: string;
  content: string;
  suggestion?: string[];
  explanation?: string;
  tags?: string[];
  endTimestamp?: string;
}

interface TaggedSegmentsViewProps<T extends BaseSegment> {
  segments: T[];
  selectedTags: Set<string>;
  initialItemsPerGroup?: number;
  loadMoreIncrement?: number;
  className?: string;
}

export function TaggedSegmentsView<T extends BaseSegment>({
  segments,
  selectedTags,
  initialItemsPerGroup = 10,
  loadMoreIncrement = 5,
  className = "",
}: TaggedSegmentsViewProps<T>) {
  // State for pagination per group
  const [itemsShownPerGroup, setItemsShownPerGroup] = useState<Record<string, number>>({});

  // State for collapsed groups
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(new Set());

  // Group segments by tags
  const { grouped, uncategorized } = useMemo(() => {
    return groupSegmentsByTag(segments);
  }, [segments]);

  // Filter groups based on selected tags
  const filteredGroups = useMemo(() => {
    if (selectedTags.size === 0) {
      return {};
    }

    const filtered: typeof grouped = {};
    Object.entries(grouped).forEach(([tag, tagSegments]) => {
      if (selectedTags.has(tag)) {
        filtered[tag] = tagSegments;
      }
    });

    return filtered;
  }, [grouped, selectedTags]);

  // Sort tag groups for consistent display
  const sortedTags = useMemo(() => {
    return sortTags(Object.keys(filteredGroups));
  }, [filteredGroups]);

  // Handle showing more items for a group
  const handleShowMore = (tag: string) => {
    setItemsShownPerGroup(prev => ({
      ...prev,
      [tag]: (prev[tag] || initialItemsPerGroup) + loadMoreIncrement,
    }));
  };

  // Handle collapsing/expanding groups
  const toggleGroupCollapse = (tag: string) => {
    const newCollapsed = new Set(collapsedGroups);
    if (newCollapsed.has(tag)) {
      newCollapsed.delete(tag);
    } else {
      newCollapsed.add(tag);
    }
    setCollapsedGroups(newCollapsed);
  };

  // If no tags selected, show message
  if (selectedTags.size === 0) {
    return (
      <div className={cn("text-center py-6", className)}>
        <p className="text-xs text-gray-500">
          Select one or more tags above to view segments
        </p>
      </div>
    );
  }

  // If no segments match filters
  if (sortedTags.length === 0 && uncategorized.length === 0) {
    return (
      <div className={cn("text-center py-6", className)}>
        <p className="text-xs text-gray-500">
          No segments found for the selected tags
        </p>
      </div>
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* Render grouped segments */}
      {sortedTags.map(tag => {
        const tagSegments = filteredGroups[tag] || [];
        const itemsToShow = itemsShownPerGroup[tag] || initialItemsPerGroup;
        const visibleSegments = tagSegments.slice(0, itemsToShow);
        const hasMore = tagSegments.length > itemsToShow;
        const isCollapsed = collapsedGroups.has(tag);

        return (
          <div key={tag} className="border rounded-lg p-3">
            {/* Group header */}
            <button
              onClick={() => toggleGroupCollapse(tag)}
              className="flex items-center gap-2 w-full mb-2 text-left hover:text-gray-700 transition-colors"
            >
              {isCollapsed ? (
                <ChevronRight className="w-4 h-4 text-gray-500" />
              ) : (
                <ChevronDown className="w-4 h-4 text-gray-500" />
              )}
              <h4 className="text-sm font-semibold text-gray-900">
                {tag}
              </h4>
              <span className="ml-2 px-1.5 py-0.5 bg-gray-100 text-gray-600 text-[10px] rounded-full">
                {tagSegments.length} segment{tagSegments.length !== 1 ? "s" : ""}
              </span>
              {hasMore && !isCollapsed && (
                <span className="ml-auto text-[10px] text-gray-500">
                  Showing {visibleSegments.length} of {tagSegments.length}
                </span>
              )}
            </button>

            {/* Group content */}
            {!isCollapsed && (
              <>
                <div className="space-y-3">
                  {visibleSegments.map((segment, index) => (
                    <SegmentCard
                      key={`${tag}-${segment.originalIndex}-${index}`}
                      timestamp={segment.timestamp}
                      content={segment.content}
                      suggestion={segment.suggestion}
                      explanation={segment.explanation}
                      tags={segment.tags}
                      endTimestamp={segment.endTimestamp}
                      className="ml-7"
                    />
                  ))}
                </div>

                {/* Show more button */}
                {hasMore && (
                  <div className="mt-3 text-center">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleShowMore(tag)}
                      className="text-xs text-blue-600 hover:text-blue-700 h-7 px-3"
                    >
                      Show {Math.min(loadMoreIncrement, tagSegments.length - itemsToShow)} more
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        );
      })}

      {/* Uncategorized segments (always show at the end) */}
      {uncategorized.length > 0 && (
        <div className="border border-gray-200 rounded-lg p-3 bg-gray-50">
          {/* Uncategorized header */}
          <button
            onClick={() => toggleGroupCollapse("uncategorized")}
            className="flex items-center gap-2 w-full mb-2 text-left hover:text-gray-700 transition-colors"
          >
            {collapsedGroups.has("uncategorized") ? (
              <ChevronRight className="w-4 h-4 text-gray-500" />
            ) : (
              <ChevronDown className="w-4 h-4 text-gray-500" />
            )}
            <h4 className="text-sm font-semibold text-gray-700">
              Uncategorized
            </h4>
            <span className="ml-2 px-1.5 py-0.5 bg-gray-200 text-gray-600 text-[10px] rounded-full">
              {uncategorized.length} segment{uncategorized.length !== 1 ? "s" : ""}
            </span>
          </button>

          {/* Uncategorized content */}
          {!collapsedGroups.has("uncategorized") && (
            <div className="space-y-3">
              {uncategorized.map((segment, index) => (
                <SegmentCard
                  key={`uncategorized-${segment.originalIndex}-${index}`}
                  timestamp={segment.timestamp}
                  content={segment.content}
                  suggestion={segment.suggestion}
                  explanation={segment.explanation}
                  tags={segment.tags}
                  endTimestamp={segment.endTimestamp}
                  className="ml-7"
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}