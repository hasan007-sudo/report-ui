/**
 * Utility functions for segment grouping and tag management
 */

interface BaseSegment {
  timestamp: string;
  content: string;
  suggestion?: string[];
  explanation?: string;
  tags?: string[];
}

/**
 * Groups segments by their tags, duplicating segments that have multiple tags
 * @param segments - Array of segments to group
 * @returns Object with grouped segments by tag and uncategorized segments
 */
export function groupSegmentsByTag<T extends BaseSegment>(segments: T[]) {
  const grouped: Record<string, Array<T & { originalIndex: number }>> = {};
  const uncategorized: Array<T & { originalIndex: number }> = [];

  segments.forEach((segment, originalIndex) => {
    const segmentWithIndex = { ...segment, originalIndex };

    if (!segment.tags || segment.tags.length === 0) {
      uncategorized.push(segmentWithIndex);
    } else {
      segment.tags.forEach(tag => {
        if (!grouped[tag]) {
          grouped[tag] = [];
        }
        // Add the same segment to multiple groups if it has multiple tags
        grouped[tag].push(segmentWithIndex);
      });
    }
  });

  return { grouped, uncategorized };
}

/**
 * Extracts all unique tags from an array of segments
 * @param segments - Array of segments
 * @returns Array of unique tag strings
 */
export function getUniqueTagsFromSegments<T extends { tags?: string[] }>(segments: T[]): string[] {
  const tagSet = new Set<string>();

  segments.forEach(segment => {
    if (segment.tags && segment.tags.length > 0) {
      segment.tags.forEach(tag => tagSet.add(tag));
    }
  });

  return Array.from(tagSet).sort();
}

/**
 * Filters segments based on selected tags
 * @param segments - Array of segments to filter
 * @param selectedTags - Set of selected tag strings
 * @returns Filtered array of segments
 */
export function filterSegmentsByTags<T extends BaseSegment>(
  segments: T[],
  selectedTags: Set<string>
): T[] {
  if (selectedTags.size === 0) {
    return [];
  }

  return segments.filter(segment => {
    if (!segment.tags || segment.tags.length === 0) {
      return false;
    }
    return segment.tags.some(tag => selectedTags.has(tag));
  });
}

/**
 * Get display-friendly name for a tag
 * @param tag - Raw tag string
 * @returns Formatted tag name
 */
export function getTagDisplayName(tag: string): string {
  // Could add custom formatting if needed
  return tag;
}

/**
 * Get color class for a tag based on its type
 * @param tag - Tag string
 * @returns Tailwind color classes
 */
export function getTagColorClass(tag: string): string {
  const tagLower = tag.toLowerCase();

  // Grammar tags
  if (tagLower.includes("verb") || tagLower.includes("tense")) {
    return "bg-orange-100 text-orange-800 border-orange-300 hover:bg-orange-200";
  }
  if (tagLower.includes("subject") || tagLower.includes("agreement")) {
    return "bg-purple-100 text-purple-800 border-purple-300 hover:bg-purple-200";
  }
  if (tagLower.includes("article") || tagLower.includes("preposition")) {
    return "bg-yellow-100 text-yellow-800 border-yellow-300 hover:bg-yellow-200";
  }
  if (tagLower.includes("pronoun") || tagLower.includes("plural") || tagLower.includes("singular")) {
    return "bg-indigo-100 text-indigo-800 border-indigo-300 hover:bg-indigo-200";
  }

  // Fluency tags
  if (tagLower.includes("pause") || tagLower.includes("hesitat")) {
    return "bg-slate-100 text-slate-800 border-slate-300 hover:bg-slate-200";
  }
  if (tagLower.includes("filler") || tagLower.includes("repetition")) {
    return "bg-amber-100 text-amber-800 border-amber-300 hover:bg-amber-200";
  }
  if (tagLower.includes("self-correction") || tagLower.includes("false start")) {
    return "bg-cyan-100 text-cyan-800 border-cyan-300 hover:bg-cyan-200";
  }

  // Vocabulary tags
  if (tagLower.includes("word") || tagLower.includes("choice") || tagLower.includes("lexical")) {
    return "bg-blue-100 text-blue-800 border-blue-300 hover:bg-blue-200";
  }
  if (tagLower.includes("collocation") || tagLower.includes("phrasal")) {
    return "bg-teal-100 text-teal-800 border-teal-300 hover:bg-teal-200";
  }

  // Pronunciation tags
  if (tagLower.includes("stress") || tagLower.includes("intonation")) {
    return "bg-rose-100 text-rose-800 border-rose-300 hover:bg-rose-200";
  }
  if (tagLower.includes("vowel") || tagLower.includes("consonant") || tagLower.includes("segmental")) {
    return "bg-pink-100 text-pink-800 border-pink-300 hover:bg-pink-200";
  }

  // Clarity tags
  if (tagLower.includes("connector") || tagLower.includes("transition")) {
    return "bg-emerald-100 text-emerald-800 border-emerald-300 hover:bg-emerald-200";
  }
  if (tagLower.includes("structure") || tagLower.includes("logical")) {
    return "bg-lime-100 text-lime-800 border-lime-300 hover:bg-lime-200";
  }

  // Error-related tags
  if (tagLower.includes("error") || tagLower.includes("incorrect")) {
    return "bg-red-100 text-red-800 border-red-300 hover:bg-red-200";
  }

  // Default
  return "bg-gray-100 text-gray-800 border-gray-300 hover:bg-gray-200";
}

/**
 * Counts total segments including duplicates across groups
 * @param grouped - Grouped segments object
 * @param uncategorized - Array of uncategorized segments
 * @returns Total count
 */
export function countTotalSegmentsInGroups<T extends BaseSegment>(
  grouped: Record<string, T[]>,
  uncategorized: T[]
): number {
  let total = uncategorized.length;

  Object.values(grouped).forEach(group => {
    total += group.length;
  });

  return total;
}

/**
 * Sort tags by a predefined order for consistency
 * @param tags - Array of tag strings
 * @returns Sorted array of tags
 */
export function sortTags(tags: string[]): string[] {
  // Define priority order for common tags
  const priorityOrder: Record<string, number> = {
    // Grammar priorities
    "Verb Tense": 1,
    "Subject-Verb Agreement": 2,
    "Article Usage": 3,
    "Preposition Error": 4,
    "Word Order": 5,

    // Fluency priorities
    "Long Pause": 1,
    "Filler Cluster": 2,
    "Self-Correction": 3,
    "Repetition": 4,

    // Add more as needed
  };

  return tags.sort((a, b) => {
    const aPriority = priorityOrder[a] ?? 999;
    const bPriority = priorityOrder[b] ?? 999;

    if (aPriority !== bPriority) {
      return aPriority - bPriority;
    }

    // Alphabetical fallback
    return a.localeCompare(b);
  });
}
