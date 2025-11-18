/**
 * Utility functions for audio playback and time formatting
 */

/**
 * Parse a time string in HH:MM:SS or MM:SS format to total seconds
 * @param timeString - Time string in format "HH:MM:SS" or "MM:SS"
 * @returns Total seconds as a number
 */
export function parseTimeToSeconds(timeString: string): number {
  const parts = timeString.split(":").map(Number);

  if (parts.length === 3) {
    // HH:MM:SS format
    const [hours, minutes, seconds] = parts;
    return (hours ?? 0) * 3600 + (minutes ?? 0) * 60 + (seconds ?? 0);
  } else if (parts.length === 2) {
    // MM:SS format
    const [minutes, seconds] = parts;
    return (minutes ?? 0) * 60 + (seconds ?? 0);
  }

  // Invalid format, return 0
  return 0;
}

/**
 * Format seconds to MM:SS or HH:MM:SS time string
 * @param seconds - Total seconds
 * @returns Formatted time string
 */
export function formatSecondsToTime(seconds: number): string {
  if (!isFinite(seconds) || seconds < 0) {
    return "0:00";
  }

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  }

  return `${minutes}:${secs.toString().padStart(2, "0")}`;
}

/**
 * Check if a given time falls within a segment's time range
 * @param currentTime - Current playback time in seconds
 * @param startTime - Segment start time string (HH:MM:SS or MM:SS)
 * @param endTime - Segment end time string (HH:MM:SS or MM:SS)
 * @returns True if current time is within the segment
 */
export function isTimeInSegment(
  currentTime: number,
  startTime: string,
  endTime: string
): boolean {
  const start = parseTimeToSeconds(startTime);
  const end = parseTimeToSeconds(endTime);
  return currentTime >= start && currentTime <= end;
}

/**
 * Find the index of the active segment based on current playback time
 * @param currentTime - Current playback time in seconds
 * @param segments - Array of segments with start_time and end_time
 * @returns Index of active segment, or -1 if none found
 */
export function findActiveSegmentIndex<
  T extends { start_time: string; end_time: string }
>(currentTime: number, segments: T[]): number {
  return segments.findIndex((segment) =>
    isTimeInSegment(currentTime, segment.start_time, segment.end_time)
  );
}
