import { z } from 'zod';
import { timestampSchema, baseScoreSchema } from './base-schema';

/**
 * Clarity Zod Schemas
 *
 * Schemas for clarity assessment focusing on coherence, cohesive devices, and discourse organization
 * Based on: @api/prompt/cefr/clarity.json
 */

// ============================================================================
// CLARITY TAGS ENUM
// ============================================================================

/**
 * Tags for clarity-related issues (8 distinct tags)
 */
const clarityTagsEnum = z.enum([
  'Missing Connector',
  'Inappropriate Connector',
  'Unclear Reference',
  'Topic Drift',
  'Abrupt Transition',
  'Lack of Structure',
  'Repetitive Linking',
  'Logical Gap',
]);

// ============================================================================
// CLARITY SEGMENT SCHEMA
// ============================================================================

/**
 * Individual clarity feedback segment with timestamp and suggestions
 */
export const claritySegmentSchema = z.object({
  timestamp: timestampSchema,
  content: z
    .string()
    .describe(
      'The specific phrase or segment that demonstrates a coherence/clarity issue.'
    ),
  suggestion: z
    .array(z.string())
    .describe(
      'An array of 1-3 suggested alternative ways to express the idea more clearly or with better cohesion. Must only contain the suggested sentence/phrase text.'
    ),
  explanation: z
    .string()
    .describe(
      "Detailed explanation of the coherence/clarity issue (e.g., 'Missing linking word creates confusion between ideas', 'Topic shift without transition'). Must be simple and direct."
    ),
  tags: z
    .array(clarityTagsEnum)
    .describe('List of relevant coherence/clarity issue tags for the segment.'),
});

// ============================================================================
// CLARITY METRICS SCHEMA
// ============================================================================

/**
 * Quantitative clarity metrics
 */
export const clarityMetricsSchema = z.object({
  cohesive_devices: z.object({
    name: z.string().describe('User-facing name of the metric'),
    user_score: z
      .object({
        value: z
          .number()
          .describe(
            'Number of cohesive devices (linking words, pronouns, synonyms) per 100 words'
          ),
        unit: z.literal('per 100 words'),
      })
      .describe("User's cohesive device usage rate"),
    target_score: z
      .object({
        value: z
          .number()
          .describe(
            'The target number of cohesive devices per 100 words (e.g., 8.0 for B2)'
          ),
        unit: z.literal('per 100 words'),
      })
      .describe('Target benchmark for comparison'),
    variety_level: z
      .enum(['limited', 'functional', 'varied', 'sophisticated'])
      .describe('Qualitative assessment of the variety of cohesive devices used'),
    misuse_rate: z
      .number()
      .describe(
        'Percentage of cohesive devices that are used inappropriately or awkwardly (0-100)'
      ),
  }),
  discourse_organization: z.object({
    name: z.string().describe('User-facing name of the metric'),
    user_score: z
      .object({
        value: z
          .number()
          .describe('Count of explicit discourse markers used to structure speech'),
        unit: z.literal('count'),
      })
      .describe("User's discourse marker count"),
    target_score: z
      .object({
        value: z.number().describe('The target count of discourse markers (e.g., 5 for B2)'),
        unit: z.literal('count'),
      })
      .describe('Target benchmark for comparison'),
    structural_clarity: z
      .enum(['disjointed', 'linear/basic', 'well-structured', 'lucid/articulate'])
      .describe(
        "Assessment of how easy it is to follow the speaker's main points and structure"
      ),
  }),
  thematic_continuity: z.object({
    name: z.string().describe('User-facing name of the metric'),
    topic_drift_count: z
      .number()
      .describe('Number of times the student drifted significantly off the main topic or task'),
    recovery_rate: z
      .number()
      .describe(
        'Percentage of times the student successfully returned to the original topic after a digression (0-100)'
      ),
  }),
});

// ============================================================================
// CLARITY REPORT SCHEMA
// ============================================================================

/**
 * Complete clarity assessment report
 */
export const clarityReportSchema = z.object({
  type: z.literal('clarity').describe('Type of assessment being performed'),
  segments: z
    .array(claritySegmentSchema)
    .describe(
      'Top 10 segment-by-segment feedback points focusing on high-impact coherence and clarity issues. Must be written in simple, accessible language.'
    ),
  metrics: clarityMetricsSchema,
  score: baseScoreSchema,
});

// ============================================================================
// EXPORTED TYPES
// ============================================================================

export type ClaritySegment = z.infer<typeof claritySegmentSchema>;
export type ClarityMetrics = z.infer<typeof clarityMetricsSchema>;
export type ClarityReport = z.infer<typeof clarityReportSchema>;
