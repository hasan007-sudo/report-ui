/**
 * V2 Evaluation Schemas - Central Export
 *
 * Single source of truth for all V2 evaluation schemas and types.
 * These Zod schemas are used for:
 * - TypeScript type inference (via z.infer<>)
 * - Runtime validation of Gemini AI responses
 * - JSON Schema generation for Gemini AI prompts (via zodToJsonSchema)
 */

// ============================================================================
// BASE SCHEMAS
// ============================================================================

export {
  timestampSchema,
  speakerIdSchema,
  confidenceLevelSchema,
  baseScoreSchema,
  type Timestamp,
  type SpeakerId,
  type ConfidenceLevel,
  type BaseScore,
} from './base-schema';

// ============================================================================
// TRANSCRIPT SCHEMAS
// ============================================================================

export {
  transcriptSegmentSchema,
  speakerMapSchema,
  geminiTranscriptResponseSchema,
  talkTimeMetricsSchema,
  processedTranscriptSchema,
  type TranscriptSegment,
  type SpeakerMap,
  type GeminiTranscriptResponse,
  type TalkTimeMetrics,
  type ProcessedTranscript,
} from './transcript-schema';

// ============================================================================
// ANALYSIS SCHEMAS
// ============================================================================

export {
  topicSegmentSchema,
  safetyFlagsSchema,
  speakerSentimentSchema,
  emotionEventSchema,
  analysisSchema,
  type TopicSegment,
  type SafetyFlags,
  type SpeakerSentiment,
  type EmotionEvent,
  type Analysis,
} from './analysis-schema';

// ============================================================================
// CEFR DIMENSION SCHEMAS
// ============================================================================

// Fluency
export {
  fluencySegmentSchema,
  fluencyMetricsSchema,
  fluencyReportSchema,
  type FluencySegment,
  type FluencyMetrics,
  type FluencyReport,
} from './fluency-schema';

// Grammar
export {
  grammarSegmentSchema,
  grammarMetricsSchema,
  grammarReportSchema,
  type GrammarSegment,
  type GrammarMetrics,
  type GrammarReport,
} from './grammar-schema';

// Vocabulary
export {
  vocabularySegmentSchema,
  vocabularyMetricsSchema,
  vocabularyReportSchema,
  type VocabularySegment,
  type VocabularyMetrics,
  type VocabularyReport,
} from './vocabulary-schema';

// Pronunciation
export {
  pronunciationSegmentSchema,
  pronunciationMetricsSchema,
  pronunciationReportSchema,
  type PronunciationSegment,
  type PronunciationMetrics,
  type PronunciationReport,
} from './pronunciation-schema';

// Clarity
export {
  claritySegmentSchema,
  clarityMetricsSchema,
  clarityReportSchema,
  type ClaritySegment,
  type ClarityMetrics,
  type ClarityReport,
} from './clarity-schema';

// ============================================================================
// SUMMARY SCHEMA
// ============================================================================

export { summarySchema, type Summary } from './summary-schema';

// ============================================================================
// WEBHOOK PAYLOAD SCHEMAS
// ============================================================================

export {
  cefrReportsSchema,
  v2EvaluationDataSchema,
  webhookPayloadSuccessSchema,
  webhookPayloadErrorSchema,
  webhookPayloadSchema,
  type CEFRReports,
  type V2EvaluationData,
  type WebhookPayloadSuccess,
  type WebhookPayloadError,
  type WebhookPayload,
} from './webhook-schema';
