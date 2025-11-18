import { z } from 'zod';
import { timestampSchema, baseScoreSchema } from './base-schema';

/**
 * Grammar Zod Schemas
 *
 * Schemas for grammar assessment focusing on accuracy and syntactic complexity
 * Based on: @api/prompt/cefr/grammar.json
 */

// ============================================================================
// GRAMMAR TAGS ENUM
// ============================================================================

/**
 * Tags for grammar-related errors (12 distinct tags)
 */
const grammarTagsEnum = z.enum([
  'Verb Tense',
  'Subject-Verb Agreement',
  'Article Usage',
  'Preposition Error',
  'Word Order',
  'Singular/Plural',
  'Pronoun Usage',
  'Modal Verb Error',
  'Conditional Structure',
  'Relative Clause',
  'Passive Voice',
  'Mixed Errors',
]);

// ============================================================================
// GRAMMAR SEGMENT SCHEMA
// ============================================================================

/**
 * Individual grammar feedback segment with timestamp and suggestions
 */
export const grammarSegmentSchema = z.object({
  timestamp: timestampSchema,
  content: z
    .string()
    .describe(
      'The specific erroneous phrase or event that occurred in this segment.'
    ),
  suggestion: z
    .array(z.string())
    .describe(
      'An array of 1-3 suggested alternative sentences or phrases with correct grammar. Must only contain the suggested sentence/phrase text.'
    ),
  explanation: z
    .string()
    .describe(
      "Detailed explanation of why this segment was flagged (e.g., 'Incorrect past tense conjugation: buyed -> bought'). Must be simple and direct."
    ),
  tags: z
    .array(grammarTagsEnum)
    .describe('List of relevant grammatical error tags for the segment.'),
});

// ============================================================================
// GRAMMAR METRICS SCHEMA
// ============================================================================

/**
 * Quantitative grammar metrics
 */
export const grammarMetricsSchema = z.object({
  errors_per_100_words: z.object({
    name: z.string().describe('User-facing name of the metric'),
    user_score: z
      .object({
        value: z.number().describe('Error rate normalized per 100 words'),
        unit: z.literal('per 100 words'),
      })
      .describe("User's error rate per 100 words"),
    target_score: z
      .object({
        value: z
          .number()
          .describe(
            'The target or threshold for errors per 100 words (e.g., 5.0 for B2)'
          ),
        unit: z.literal('per 100 words'),
      })
      .describe('Target benchmark for comparison'),
    interpretation: z
      .enum([
        'highly inaccurate',
        'frequent errors',
        'noticeable errors',
        'generally accurate',
        'accurate with minor errors',
        'highly accurate',
      ])
      .describe('Qualitative interpretation of accuracy level'),
  }),
  self_correction_rate: z.object({
    name: z.string().describe('User-facing name of the metric'),
    user_score: z
      .object({
        value: z.number().describe('Percentage of errors self-corrected by student'),
        unit: z.literal('%'),
      })
      .describe("Student's self-correction rate"),
    target_score: z
      .object({
        value: z
          .number()
          .describe('The target percentage for self-correction (e.g., 30.0%)'),
        unit: z.literal('%'),
      })
      .describe('Target benchmark for comparison'),
  }),
  syntactic_complexity: z.object({
    name: z.string().describe('User-facing name of the metric'),
    user_score: z
      .object({
        value: z.number().describe('Score representing grammatical complexity'),
        unit: z.literal('score'),
      })
      .describe("User's syntactic complexity score"),
    target_score: z
      .object({
        value: z
          .number()
          .describe('The target complexity score (e.g., 60 for B2)'),
        unit: z.literal('score'),
      })
      .describe('Target benchmark for comparison'),
    interpretation: z
      .enum([
        'very basic structures',
        'simple structures',
        'predictable patterns',
        'varied structures',
        'complex structures',
        'sophisticated structures',
      ])
      .describe('Qualitative interpretation of syntactic complexity'),
  }),
  error_impact: z.object({
    name: z.string().describe('User-facing name of the metric'),
    dominant_error_type: z
      .enum([
        'verb tense',
        'subject-verb agreement',
        'article usage',
        'preposition errors',
        'word order',
        'plural/singular forms',
        'pronoun usage',
        'modal verbs',
        'conditional structures',
        'relative clauses',
        'passive voice',
        'mixed errors',
      ])
      .describe('Most frequent type of grammatical error'),
    impact_level: z
      .enum([
        'severely impairs meaning',
        'frequently impairs meaning',
        'occasionally impairs meaning',
        'rarely impairs meaning',
        'does not impair meaning',
        'negligible impact',
      ])
      .describe('How errors affect communication'),
    example_errors: z
      .array(
        z.object({
          error_type: z.string().describe('Category of the error'),
          incorrect: z.string().describe('The incorrect form used'),
          correct: z.string().describe('The correct form'),
          context: z.string().describe('Sentence or phrase containing the error'),
        })
      )
      .describe('List of top 3 most common error types with context and correction'),
  }),
});

// ============================================================================
// GRAMMAR REPORT SCHEMA
// ============================================================================

/**
 * Complete grammar assessment report
 */
export const grammarReportSchema = z.object({
  type: z.literal('grammar').describe('Type of assessment being performed'),
  segments: z
    .array(grammarSegmentSchema)
    .describe(
      'Top 10 segment-by-segment feedback points focusing on high-impact grammatical errors. Must be written in simple, accessible language.'
    ),
  metrics: grammarMetricsSchema,
  score: baseScoreSchema,
});

// ============================================================================
// EXPORTED TYPES
// ============================================================================

export type GrammarSegment = z.infer<typeof grammarSegmentSchema>;
export type GrammarMetrics = z.infer<typeof grammarMetricsSchema>;
export type GrammarReport = z.infer<typeof grammarReportSchema>;
