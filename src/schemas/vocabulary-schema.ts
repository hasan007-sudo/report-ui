import { z } from 'zod';
import { timestampSchema, baseScoreSchema } from './base-schema';

/**
 * Vocabulary Zod Schemas
 *
 * Schemas for vocabulary assessment focusing on lexical range, sophistication, and precision
 * Based on: @api/prompt/cefr/vocabulary.json
 */

// ============================================================================
// VOCABULARY TAGS ENUM
// ============================================================================

/**
 * Tags for vocabulary-related errors (8 distinct tags)
 */
const vocabularyTagsEnum = z.enum([
  'Inaccurate Collocation',
  'Word Choice Error',
  'Lexical Gap (Circumlocution)',
  'Misused Phrasal Verb',
  'Formal/Informal Mismatch',
  'Overuse of Vague Language',
  'Semantic Misuse',
  'False Friend',
]);

// ============================================================================
// VOCABULARY SEGMENT SCHEMA
// ============================================================================

/**
 * Individual vocabulary feedback segment with timestamp and suggestions
 */
export const vocabularySegmentSchema = z.object({
  timestamp: timestampSchema,
  content: z
    .string()
    .describe('The specific erroneous or misused word/phrase that occurred in this segment.'),
  suggestion: z
    .array(z.string())
    .describe(
      'An array of 1-3 suggested alternative words or phrases that improve precision or range. Must only contain the suggested word/phrase text.'
    ),
  explanation: z
    .string()
    .describe(
      "Detailed explanation of why this word/phrase was flagged (e.g., 'Inaccurate collocation: make decision -> take decision'). Must be simple and direct."
    ),
  tags: z
    .array(vocabularyTagsEnum)
    .describe('List of relevant lexical error tags for the segment.'),
});

// ============================================================================
// VOCABULARY METRICS SCHEMA
// ============================================================================

/**
 * Quantitative vocabulary metrics including CEFR level breakdown
 */
export const vocabularyMetricsSchema = z.object({
  lexical_diversity: z.object({
    name: z.string().describe('User-facing name of the metric'),
    user_score: z
      .object({
        value: z.number().describe('Type-token ratio (lexical diversity)'),
        unit: z.literal('ratio'),
      })
      .describe("User's lexical diversity score"),
    target_score: z
      .object({
        value: z.number().describe('The target type-token ratio (e.g., 0.65 for B2)'),
        unit: z.literal('ratio'),
      })
      .describe('Target benchmark for comparison'),
    unique_words_count: z
      .number()
      .describe('Number of unique lexical items used (not including function words)'),
    total_words_count: z.number().describe('Total number of word forms actively used'),
  }),
  lexical_distribution: z.object({
    name: z.string().describe('User-facing name of the metric'),
    average_lexical_level: z
      .number()
      .describe('Average CEFR level of vocabulary as numeric value (e.g., 2.3 for B2)'),
    interpretation: z
      .enum([
        'very basic vocabulary',
        'elementary vocabulary',
        'adequate for general topics',
        'good range for complex topics',
        'sophisticated vocabulary',
        'highly advanced vocabulary',
      ])
      .describe('Qualitative interpretation of lexical distribution'),
    cefr_breakdown: z
      .object({
        A1: z
          .object({
            percentage: z.number().describe('Percentage of A1 level vocabulary'),
            words: z.array(z.string()).describe('List of lemmatized A1 words used'),
          })
          .describe('A1 level vocabulary breakdown'),
        A2: z
          .object({
            percentage: z.number().describe('Percentage of A2 level vocabulary'),
            words: z.array(z.string()).describe('List of lemmatized A2 words used'),
          })
          .describe('A2 level vocabulary breakdown'),
        B1: z
          .object({
            percentage: z.number().describe('Percentage of B1 level vocabulary'),
            words: z.array(z.string()).describe('List of lemmatized B1 words used'),
          })
          .describe('B1 level vocabulary breakdown'),
        B2: z
          .object({
            percentage: z.number().describe('Percentage of B2 level vocabulary'),
            words: z.array(z.string()).describe('List of lemmatized B2 words used'),
          })
          .describe('B2 level vocabulary breakdown'),
        C1: z
          .object({
            percentage: z.number().describe('Percentage of C1 level vocabulary'),
            words: z.array(z.string()).describe('List of lemmatized C1 words used'),
          })
          .describe('C1 level vocabulary breakdown'),
        C2: z
          .object({
            percentage: z.number().describe('Percentage of C2 level vocabulary'),
            words: z.array(z.string()).describe('List of lemmatized C2 words used'),
          })
          .describe('C2 level vocabulary breakdown'),
      })
      .describe('Breakdown of vocabulary by CEFR level with percentages and word lists'),
  }),
  lexical_sophistication: z.object({
    name: z.string().describe('User-facing name of the metric'),
    user_score: z
      .object({
        value: z.number().describe('Percentage of B2+ vocabulary used'),
        unit: z.literal('%'),
      })
      .describe("User's sophistication score"),
    target_score: z
      .object({
        value: z
          .number()
          .describe('The target percentage of B2+ vocabulary (e.g., 30.0 for B2)'),
        unit: z.literal('%'),
      })
      .describe('Target benchmark for comparison'),
    interpretation: z
      .enum([
        'restricted to basic needs',
        'adequate for simple transactions',
        'sufficient for general topics',
        'broad and flexible for general topics',
        'good range for complex topics',
        'extensive and specialized',
      ])
      .describe('Qualitative interpretation of lexical sophistication'),
  }),
  lexical_precision: z.object({
    name: z.string().describe('User-facing name of the metric'),
    user_score: z
      .object({
        value: z.number().describe('Total number of precision errors per 100 words'),
        unit: z.literal('per 100 words'),
      })
      .describe("User's precision error rate"),
    target_score: z
      .object({
        value: z
          .number()
          .describe(
            'The target threshold for precision errors per 100 words (e.g., 3.0 for B2)'
          ),
        unit: z.literal('per 100 words'),
      })
      .describe('Target benchmark for comparison'),
    precision_level: z
      .enum([
        'frequent basic misuse',
        'noticeable misuse of complex terms',
        'generally accurate with minor lapses',
        'accurate with rare slips',
        'highly precise',
      ])
      .describe('Qualitative interpretation of vocabulary precision'),
    error_examples: z
      .array(
        z.object({
          error_type: z
            .string()
            .describe('Type of precision error (e.g., Misused Collocation)'),
          incorrect: z.string().describe('The incorrect word/phrase used in context'),
          correct: z.string().describe('The corrected word/phrase'),
        })
      )
      .describe('List of the top 3 most common precision errors with context and correction'),
  }),
});

// ============================================================================
// VOCABULARY REPORT SCHEMA
// ============================================================================

/**
 * Complete vocabulary assessment report
 */
export const vocabularyReportSchema = z.object({
  type: z.literal('vocabulary').describe('Type of assessment being performed'),
  segments: z
    .array(vocabularySegmentSchema)
    .describe(
      'Top 10 segment-by-segment feedback points focusing on high-impact lexical errors or misuse. Must be written in simple, accessible language.'
    ),
  metrics: vocabularyMetricsSchema,
  score: baseScoreSchema,
});

// ============================================================================
// EXPORTED TYPES
// ============================================================================

export type VocabularySegment = z.infer<typeof vocabularySegmentSchema>;
export type VocabularyMetrics = z.infer<typeof vocabularyMetricsSchema>;
export type VocabularyReport = z.infer<typeof vocabularyReportSchema>;
