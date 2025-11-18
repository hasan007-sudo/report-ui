import { z } from 'zod';

/**
 * Summary Zod Schemas
 *
 * Schemas for holistic summary combining all 5 CEFR dimensions
 * Based on: @api/prompt/cefr/summary.json
 */

// ============================================================================
// SUMMARY SCHEMA
// ============================================================================

/**
 * Complete summary aggregating all CEFR dimension scores with action plan
 */
export const summarySchema = z.object({
  type: z.literal('summary').describe('Indicates the holistic nature of the final report.'),
  dimension_scores: z
    .object({
      fluency: z.number().min(0).max(100).describe('Fluency score out of 100'),
      grammar: z.number().min(0).max(100).describe('Grammar accuracy score out of 100'),
      vocabulary: z.number().min(0).max(100).describe('Vocabulary score out of 100'),
      pronunciation: z
        .number()
        .min(0)
        .max(100)
        .describe('Pronunciation score out of 100'),
      clarity: z
        .number()
        .min(0)
        .max(100)
        .describe('Coherence and clarity score out of 100'),
    })
    .describe('Summary of scores from each of the 5 assessed dimensions.'),
  score: z
    .object({
      strengths: z
        .array(z.string())
        .describe(
          'A list of the 3 most significant, cross-dimensional strengths, prioritized for the student.'
        ),
      limitations: z
        .array(z.string())
        .describe(
          'A list of the 3 most critical, cross-dimensional weaknesses that must be addressed first.'
        ),
      score: z
        .number()
        .min(0)
        .max(100)
        .describe('Overall holistic score out of 100 (average of all 5 dimensions)'),
      confidence_level: z
        .enum(['low', 'medium', 'high'])
        .describe('Confidence in the overall assessment'),
      reason: z
        .string()
        .describe(
          'Comprehensive narrative (2-3 paragraphs) explaining the overall score and performance, written in the second person addressing the student.'
        ),
    })
    .describe('Overall summary score with strengths, limitations, and reasoning'),
  action_plan: z
    .array(z.string())
    .describe(
      'A list of 3-5 specific, high-impact activities tailored to address the major limitations and build on strengths.'
    ),
});

// ============================================================================
// EXPORTED TYPES
// ============================================================================

export type Summary = z.infer<typeof summarySchema>;
