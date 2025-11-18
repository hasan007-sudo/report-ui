import { z } from 'zod';
import { timestampSchema, baseScoreSchema } from './base-schema';

/**
 * Pronunciation Zod Schemas
 *
 * Schemas for pronunciation assessment including segmental and suprasegmental features
 * Based on: @api/prompt/cefr/pronunciation.json
 */

// ============================================================================
// PRONUNCIATION TAGS ENUM
// ============================================================================

/**
 * Tags for pronunciation-related errors (7 distinct tags)
 */
const pronunciationTagsEnum = z.enum([
  'Segmental Error (Vowel)',
  'Segmental Error (Consonant)',
  'Word Stress Error',
  'Sentence Stress Error',
  'Intonation Error (Meaning)',
  'Rhythm/Syllable Timing',
  'Linking/Elision Issue',
]);

// ============================================================================
// PRONUNCIATION SEGMENT SCHEMA
// ============================================================================

/**
 * Individual pronunciation feedback segment with timestamp and suggestions
 */
export const pronunciationSegmentSchema = z.object({
  timestamp: timestampSchema,
  content: z.string().describe('The specific word or phrase that contained the error.'),
  suggestion: z
    .array(z.string())
    .describe(
      'An array of 1-3 suggested alternative pronunciation strategies (e.g., focus on the /th/ sound, use falling intonation). Must only contain the suggested advice text.'
    ),
  explanation: z
    .string()
    .describe(
      'Detailed explanation of the error (e.g., \'The /th/ was pronounced as /z/, which affected comprehension of the word *them*\'). Must be simple and direct.'
    ),
  tags: z
    .array(pronunciationTagsEnum)
    .describe('List of relevant phonological error tags for the segment.'),
});

// ============================================================================
// PRONUNCIATION METRICS SCHEMA
// ============================================================================

/**
 * Quantitative pronunciation metrics including phoneme analysis
 */
export const pronunciationMetricsSchema = z.object({
  segmental_accuracy: z.object({
    name: z.string().describe('User-facing name of the metric'),
    user_score: z
      .object({
        value: z.number().describe('Average Goodness of Pronunciation (GOP) score'),
        unit: z.literal('score'),
      })
      .describe("User's GOP score"),
    target_score: z
      .object({
        value: z.number().describe('The target GOP score (e.g., 75 for B2)'),
        unit: z.literal('score'),
      })
      .describe('Target benchmark for comparison'),
    error_rate: z
      .number()
      .describe('Number of segmental (individual sound) errors per 100 words'),
    problematic_phonemes: z
      .array(
        z.object({
          phoneme: z
            .string()
            .describe('IPA notation of problematic phoneme (e.g., /θ/, /r/)'),
          accuracy: z
            .number()
            .describe('Average accuracy percentage for this phoneme (0-100)'),
          examples: z
            .array(z.string())
            .describe('Words where this phoneme was most frequently mispronounced'),
        })
      )
      .describe('List of top 3 specific phonemes causing difficulty'),
  }),
  word_stress_accuracy: z.object({
    name: z.string().describe('User-facing name of the metric'),
    user_score: z
      .object({
        value: z.number().describe('Number of word stress errors per 100 words'),
        unit: z.literal('per 100 words'),
      })
      .describe("User's word stress error rate"),
    target_score: z
      .object({
        value: z
          .number()
          .describe(
            'The target threshold for word stress errors per 100 words (e.g., 3.0 for B2)'
          ),
        unit: z.literal('per 100 words'),
      })
      .describe('Target benchmark for comparison'),
  }),
  intonation_control: z.object({
    name: z.string().describe('User-facing name of the metric'),
    deviation_level: z
      .enum(['low', 'medium', 'high'])
      .describe('How much intonation deviates from native-like patterns'),
    meaning_variation: z
      .enum(['limited', 'functional', 'effective'])
      .describe(
        'Ability to use intonation to convey different meanings (e.g., question vs. statement)'
      ),
    sentence_stress_error_rate: z
      .number()
      .describe('Number of incorrect sentence stress placements per 100 words'),
  }),
  intelligibility: z.object({
    name: z.string().describe('User-facing name of the metric'),
    listener_strain: z
      .enum(['none', 'minimal', 'noticeable', 'significant', 'severe'])
      .describe('How much effort the listener must exert to understand the speech'),
    overall_impact: z
      .enum([
        'fully intelligible',
        'clearly intelligible',
        'generally intelligible',
        'often unintelligible',
      ])
      .describe('Overall impact of all errors on communication'),
  }),
});

// ============================================================================
// PRONUNCIATION REPORT SCHEMA
// ============================================================================

/**
 * Complete pronunciation assessment report
 */
export const pronunciationReportSchema = z.object({
  type: z.literal('pronunciation').describe('Type of assessment being performed'),
  segments: z
    .array(pronunciationSegmentSchema)
    .describe(
      'Top 10 segment-by-segment feedback points focusing on high-impact pronunciation errors (segmental or suprasegmental). Must be written in simple, accessible language.'
    ),
  metrics: pronunciationMetricsSchema,
  score: baseScoreSchema,
});

// ============================================================================
// EXPORTED TYPES
// ============================================================================

export type PronunciationSegment = z.infer<typeof pronunciationSegmentSchema>;
export type PronunciationMetrics = z.infer<typeof pronunciationMetricsSchema>;
export type PronunciationReport = z.infer<typeof pronunciationReportSchema>;
