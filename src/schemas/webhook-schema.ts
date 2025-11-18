import { z } from 'zod';
import { processedTranscriptSchema } from './transcript-schema';
import { analysisSchema } from './analysis-schema';
import { fluencyReportSchema } from './fluency-schema';
import { grammarReportSchema } from './grammar-schema';
import { vocabularyReportSchema } from './vocabulary-schema';
import { pronunciationReportSchema } from './pronunciation-schema';
import { clarityReportSchema } from './clarity-schema';
import { summarySchema } from './summary-schema';

/**
 * Webhook Payload Zod Schemas
 *
 * Schemas for the complete V2 evaluation report and webhook payloads
 */

// ============================================================================
// CEFR REPORTS SCHEMA
// ============================================================================

/**
 * All CEFR dimension reports grouped together
 */
export const cefrReportsSchema = z.object({
  summary: summarySchema,
  grammar: grammarReportSchema,
  vocabulary: vocabularyReportSchema,
  fluency: fluencyReportSchema,
  pronunciation: pronunciationReportSchema,
  clarity: clarityReportSchema,
});

// ============================================================================
// COMPLETE V2 EVALUATION DATA SCHEMA
// ============================================================================

/**
 * Complete V2 evaluation data with processed transcript, analysis, and CEFR reports
 */
export const v2EvaluationDataSchema = z.object({
  transcript: processedTranscriptSchema,
  interactive_analysis: analysisSchema,
  reports: z.object({
    cefr: cefrReportsSchema,
  }),
});

// ============================================================================
// WEBHOOK PAYLOAD SCHEMAS
// ============================================================================

/**
 * Successful webhook payload with evaluation results
 */
export const webhookPayloadSuccessSchema = z.object({
  recording_id: z.string(),
  correlation_id: z.string(),
  status: z.literal('completed'),
  data: v2EvaluationDataSchema,
  processing_time_ms: z.number(),
});

/**
 * Failed webhook payload with error information
 */
export const webhookPayloadErrorSchema = z.object({
  recording_id: z.string(),
  correlation_id: z.string(),
  status: z.literal('failed'),
  error: z.string(),
  processing_time_ms: z.number(),
});

/**
 * Discriminated union of success and error webhook payloads
 */
export const webhookPayloadSchema = z.union([
  webhookPayloadSuccessSchema,
  webhookPayloadErrorSchema,
]);

// ============================================================================
// EXPORTED TYPES
// ============================================================================

export type CEFRReports = z.infer<typeof cefrReportsSchema>;
export type V2EvaluationData = z.infer<typeof v2EvaluationDataSchema>;
export type WebhookPayloadSuccess = z.infer<typeof webhookPayloadSuccessSchema>;
export type WebhookPayloadError = z.infer<typeof webhookPayloadErrorSchema>;
export type WebhookPayload = z.infer<typeof webhookPayloadSchema>;
