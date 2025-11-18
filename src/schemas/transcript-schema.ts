import { z } from "zod";
import { timestampSchema, speakerIdSchema } from "./base-schema";

/**
 * Transcript Zod Schemas
 *
 * Schemas for conversation transcription with speaker identification
 * Based on: @api/prompt/transcription/transcript.json
 */

// ============================================================================
// TRANSCRIPT SEGMENT SCHEMA
// ============================================================================

/**
 * Individual segment of the transcript with speaker, timestamps, and content
 */
export const transcriptSegmentSchema = z.object({
  speaker: speakerIdSchema,
  start_time: timestampSchema,
  end_time: timestampSchema,
  content: z.string(),
});

// ============================================================================
// SPEAKER MAP SCHEMA
// ============================================================================

/**
 * Maps speaker IDs (SPEAKER_00, SPEAKER_01) to actual speaker names/roles
 */
export const speakerMapSchema = z.object({
  speaker_id: speakerIdSchema,
  speaker_name: z.string(),
});

// ============================================================================
// TRANSCRIPT SCHEMA
// ============================================================================

/**
 * Gemini's transcript response format with nested wrapper
 * This matches the exact structure returned by Gemini API
 */
export const geminiTranscriptResponseSchema = z.object({
  transcript: z.object({
    segments: z.array(transcriptSegmentSchema),
    speaker_map: z.array(speakerMapSchema),
  }),
});

// ============================================================================
// TALK TIME METRICS SCHEMA
// ============================================================================

/**
 * Talk time metrics calculated by API after transcript processing
 * Includes per-speaker talk time, total duration, idle time, and overlap
 */
export const talkTimeMetricsSchema = z.object({
  duration: timestampSchema,
  speakers: z.record(z.string(), timestampSchema),
  idle: timestampSchema,
  overlap: timestampSchema,
});

// ============================================================================
// PROCESSED TRANSCRIPT SCHEMA
// ============================================================================

/**
 * Processed transcript with calculated talk_time metrics
 * This is the final format used by the API (no nested wrapper)
 */
export const processedTranscriptSchema = z.object({
  segments: z.array(transcriptSegmentSchema),
  speaker_map: z.array(speakerMapSchema),
  talk_time: talkTimeMetricsSchema,
});

// ============================================================================
// EXPORTED TYPES
// ============================================================================

export type TranscriptSegment = z.infer<typeof transcriptSegmentSchema>;
export type SpeakerMap = z.infer<typeof speakerMapSchema>;
export type GeminiTranscriptResponse = z.infer<
  typeof geminiTranscriptResponseSchema
>;
export type TalkTimeMetrics = z.infer<typeof talkTimeMetricsSchema>;
export type ProcessedTranscript = z.infer<typeof processedTranscriptSchema>;
