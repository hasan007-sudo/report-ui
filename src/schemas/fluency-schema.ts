import { z } from 'zod';
import { timestampSchema, baseScoreSchema } from './base-schema';

/**
 * Fluency Zod Schemas
 *
 * Schemas for fluency assessment focusing on speech rate, pauses, fillers, and hesitations
 * Based on: @api/prompt/cefr/fluency.json
 */

// ============================================================================
// FLUENCY TAGS ENUM
// ============================================================================

/**
 * Tags for fluency-related issues (20 distinct tags)
 */
const fluencyTagsEnum = z.enum([
  'Long Pause',
  'Filler Cluster',
  'Self-Correction',
  'Repetition',
  'Grammatical Error',
  'Accuracy',
  'Structural Error',
  'Clarity',
  'False Start',
  'Meta-Commentary',
  'Tense Error',
  'Retrieval Lag',
  'Redundancy',
  'Structural Breakdown',
  'High Effort',
  'Lexical Choice',
  'Incomplete Phrase',
  'Fragmentation',
  'Awkward Phrasing',
  'Vagueness',
]);

// ============================================================================
// FLUENCY SEGMENT SCHEMA
// ============================================================================

/**
 * Individual fluency feedback segment with timestamp and suggestions
 */
export const fluencySegmentSchema = z.object({
  timestamp: timestampSchema,
  content: z
    .string()
    .describe('The specific phrase or event that occurred in this segment.'),
  suggestion: z
    .array(z.string())
    .describe(
      'An array of 1-3 suggested alternative sentences or phrases for better fluency/delivery. Must only contain the suggested sentence/phrase text.'
    ),
  explanation: z
    .string()
    .describe(
      "Detailed explanation of why this segment was flagged (e.g., '1.8s pause here', 'excessive \"like\" usage', 'grammatical repetition')."
    ),
  tags: z
    .array(fluencyTagsEnum)
    .describe('List of relevant tags for the segment from predefined categories.'),
});

// ============================================================================
// FLUENCY METRICS SCHEMA
// ============================================================================

/**
 * Quantitative fluency metrics
 */
export const fluencyMetricsSchema = z.object({
  speech_rate: z.object({
    name: z.string().describe('User-facing name of the metric'),
    user_score: z
      .object({
        value: z.number().describe("The student's raw score for this metric"),
        unit: z.string().describe("The unit of measurement (e.g., 'WPM')"),
      })
      .describe("User's actual speech rate measurement"),
    target_score: z
      .object({
        value: z
          .number()
          .describe(
            'The target or recommended score/range boundary for this metric (e.g., 150 WPM for B2+)'
          ),
        unit: z.string().describe("The unit of measurement (e.g., 'WPM')"),
      })
      .describe('Target benchmark for comparison'),
    interpretation: z
      .enum(['slow', 'functional', 'near-B2 speed', 'natural', 'fast'])
      .describe('Qualitative interpretation of speech rate'),
  }),
  average_pause_duration: z.object({
    name: z.string().describe('User-facing name of the metric'),
    user_score: z
      .object({
        value: z.number().describe("The student's average pause duration"),
        unit: z.literal('seconds'),
      })
      .describe("User's average pause measurement"),
    target_score: z
      .object({
        value: z
          .number()
          .describe('The threshold value for acceptable pause duration (0.8s)'),
        unit: z.literal('seconds'),
      })
      .describe('Target benchmark for comparison'),
    threshold_exceeded: z
      .boolean()
      .describe('Whether average duration exceeds acceptable threshold'),
  }),
  fillers_per_100_words: z.object({
    name: z.string().describe('User-facing name of the metric'),
    user_score: z
      .object({
        value: z.number().describe('Rate of filler words used per 100 words spoken.'),
        unit: z.literal('per 100 words'),
      })
      .describe("User's filler word rate"),
    target_score: z
      .object({
        value: z
          .number()
          .describe(
            'The target or threshold count for fillers per 100 words (e.g., 3.0)'
          ),
        unit: z.literal('per 100 words'),
      })
      .describe('Target benchmark for comparison'),
    level: z
      .enum(['none', 'minimal', 'low', 'moderate', 'high', 'excessive'])
      .describe('Overall level of filler word usage'),
    breakdown: z
      .array(
        z.object({
          filler: z.string().describe('The filler word or phrase'),
          count: z.number().describe('Number of times this filler was used'),
        })
      )
      .describe('Detailed breakdown of filler words'),
  }),
  hesitation_rate: z.object({
    name: z.string().describe('User-facing name of the metric'),
    user_score: z
      .object({
        value: z
          .number()
          .describe(
            'The total percentage of time spent hesitating (pauses + fillers + self-correction).'
          ),
        unit: z.literal('%'),
      })
      .describe("User's hesitation rate"),
    target_score: z
      .object({
        value: z
          .number()
          .describe('The target or threshold percentage for hesitation rate (e.g., 5.0%)'),
        unit: z.literal('%'),
      })
      .describe('Target benchmark for comparison'),
  }),
});

// ============================================================================
// FLUENCY REPORT SCHEMA
// ============================================================================

/**
 * Complete fluency assessment report
 */
export const fluencyReportSchema = z.object({
  type: z.literal('fluency').describe('Type of assessment being performed'),
  segments: z
    .array(fluencySegmentSchema)
    .describe(
      'Top 10 segment-by-segment feedback points focusing on high-impact moments (pauses, fillers, corrections).'
    ),
  metrics: fluencyMetricsSchema,
  score: baseScoreSchema,
});

// ============================================================================
// EXPORTED TYPES
// ============================================================================

export type FluencySegment = z.infer<typeof fluencySegmentSchema>;
export type FluencyMetrics = z.infer<typeof fluencyMetricsSchema>;
export type FluencyReport = z.infer<typeof fluencyReportSchema>;
