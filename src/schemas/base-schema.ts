import { z } from "zod";

/**
 * Base Zod Schemas
 *
 * Shared/reusable schemas used across all assessment types
 */

// ============================================================================
// PATTERN VALIDATION SCHEMAS
// ============================================================================

/**
 * Timestamp validation (HH:MM:SS format)
 * Example: "00:15:30", "01:45:22"
 */
export const timestampSchema = z
  .string()
  .regex(/^([0-9]{2}):([0-5][0-9]):([0-5][0-9])$/)
  .describe("Start time of the segment in HH:MM:SS format.");

/**
 * Speaker ID validation (SPEAKER_XX format where XX is 00-99)
 * Example: "SPEAKER_00", "SPEAKER_01"
 */
export const speakerIdSchema = z.string().regex(/^SPEAKER_\d{2}$/);

// ============================================================================
// ENUM SCHEMAS
// ============================================================================

/**
 * Confidence level enum used in all CEFR assessment scores
 */
export const confidenceLevelSchema = z
  .enum(["low", "medium", "high"])
  .describe("Confidence in the assessment");

// ============================================================================
// COMMON STRUCTURE SCHEMAS
// ============================================================================

/**
 * Base score structure used by all CEFR dimension assessments
 * (fluency, grammar, vocabulary, pronunciation, clarity)
 */
export const baseScoreSchema = z.object({
  strengths: z.array(z.string()).describe("List of observed strengths"),
  limitations: z.array(z.string()).describe("List of observed limitations"),
  score: z.number().min(0).max(100).describe("Overall score out of 100"),
  confidence_level: confidenceLevelSchema,
  reason: z
    .string()
    .describe(
      "Comprehensive justification for the overall score, written in simple, second person language addressing the student",
    ),
});

// ============================================================================
// EXPORTED TYPES
// ============================================================================

export type Timestamp = z.infer<typeof timestampSchema>;
export type SpeakerId = z.infer<typeof speakerIdSchema>;
export type ConfidenceLevel = z.infer<typeof confidenceLevelSchema>;
export type BaseScore = z.infer<typeof baseScoreSchema>;
