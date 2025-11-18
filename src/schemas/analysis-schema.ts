import { z } from 'zod';
import { timestampSchema } from './base-schema';

/**
 * Analysis Zod Schemas
 *
 * Schemas for comprehensive conversation analysis including topic segmentation,
 * safety flags, sentiment analysis, and emotion tracking
 * Based on: @api/prompt/analysis/analysis.json
 */

// ============================================================================
// TOPIC SEGMENT SCHEMA
// ============================================================================

/**
 * Individual topic segment with timestamps
 */
export const topicSegmentSchema = z.object({
  topic: z.string(),
  start_time: timestampSchema,
  end_time: timestampSchema,
});

// ============================================================================
// SAFETY FLAGS SCHEMA
// ============================================================================

/**
 * Safety and profanity detection flags
 */
export const safetyFlagsSchema = z.object({
  profanity_detected: z.boolean(),
  flagged_words: z.array(z.string()),
  flagged_categories: z
    .array(
      z.enum([
        'profanity',
        'sexual_content',
        'violence',
        'hate_speech',
        'harassment',
        'self_harm',
        'discrimination',
        'bullying',
        'spam',
      ])
    )
    .optional(),
});

// ============================================================================
// EMOTION ENUM (52 emotions)
// ============================================================================

/**
 * Comprehensive emotion enum covering 52 distinct emotional states
 */
const emotionEnum = z.enum([
  'happy',
  'joyful',
  'excited',
  'enthusiastic',
  'content',
  'satisfied',
  'confident',
  'proud',
  'grateful',
  'hopeful',
  'amused',
  'pleased',
  'cheerful',
  'encouraging',
  'supportive',
  'optimistic',
  'relieved',
  'calm',
  'peaceful',
  'sad',
  'unhappy',
  'disappointed',
  'frustrated',
  'angry',
  'annoyed',
  'irritated',
  'anxious',
  'worried',
  'nervous',
  'fearful',
  'scared',
  'confused',
  'uncertain',
  'doubtful',
  'bored',
  'tired',
  'stressed',
  'overwhelmed',
  'embarrassed',
  'ashamed',
  'guilty',
  'jealous',
  'lonely',
  'hurt',
  'disgusted',
  'neutral',
  'indifferent',
  'curious',
  'inquisitive',
  'interested',
  'thoughtful',
  'focused',
  'attentive',
  'surprised',
  'shocked',
  'skeptical',
  'serious',
  'contemplative',
]);

// ============================================================================
// SPEAKER SENTIMENT SCHEMA
// ============================================================================

/**
 * Overall sentiment analysis for a speaker
 */
export const speakerSentimentSchema = z.object({
  speaker_id: z.string(),
  average_sentiment: z.enum(['positive', 'negative', 'neutral', 'mixed']),
  dominant_emotion: emotionEnum,
  sentiment_score: z.number().optional(),
});

// ============================================================================
// EMOTION EVENT SCHEMA
// ============================================================================

/**
 * Individual emotion event in the timeline
 */
export const emotionEventSchema = z.object({
  speaker: z.string(),
  emotion: z.string(),
  timestamp: timestampSchema,
  intensity: z.enum(['low', 'moderate', 'high', 'very_high']).optional(),
  confidence: z.number().optional(),
});

// ============================================================================
// ANALYSIS SCHEMA
// ============================================================================

/**
 * Complete interaction analysis combining all analysis components
 */
export const analysisSchema = z.object({
  topic_segments: z.array(topicSegmentSchema),
  safety_flags: safetyFlagsSchema,
  overall_sentiment: z.array(speakerSentimentSchema),
  emotion_timeline: z.array(emotionEventSchema),
});

// ============================================================================
// EXPORTED TYPES
// ============================================================================

export type TopicSegment = z.infer<typeof topicSegmentSchema>;
export type SafetyFlags = z.infer<typeof safetyFlagsSchema>;
export type SpeakerSentiment = z.infer<typeof speakerSentimentSchema>;
export type EmotionEvent = z.infer<typeof emotionEventSchema>;
export type Analysis = z.infer<typeof analysisSchema>;
