// ============================================
// V2.0 CEFR Report Types (Current Standard)
// ============================================
// All V2 types now come from Zod schemas for full type safety

// Re-export Zod-inferred types from schemas
export type {
  // Main evaluation data
  V2EvaluationData,

  // Transcript types
  ProcessedTranscript,
  TranscriptSegment,
  SpeakerMap,
  TalkTimeMetrics,

  // Analysis types
  Analysis,
  TopicSegment,
  SafetyFlags,
  SpeakerSentiment,
  EmotionEvent,

  // CEFR Report types
  CEFRReports,
  Summary,

  // Individual dimension reports
  FluencyReport,
  FluencyMetrics,
  FluencySegment,

  GrammarReport,
  GrammarMetrics,
  GrammarSegment,

  VocabularyReport,
  VocabularyMetrics,
  VocabularySegment,

  PronunciationReport,
  PronunciationMetrics,
  PronunciationSegment,

  ClarityReport,
  ClarityMetrics,
  ClaritySegment,

  // Base types
  BaseScore,
  ConfidenceLevel,
  Timestamp,
  SpeakerId
} from '@/schemas';

// Backward compatibility type aliases (map old names to new schema types)
import type {
  V2EvaluationData,
  ProcessedTranscript,
  Analysis,
  CEFRReports,
  TalkTimeMetrics,
  ConfidenceLevel,
} from '@/schemas';

export type ReportDataV2 = V2EvaluationData;
export type TranscriptV2 = ProcessedTranscript;
export type InteractiveAnalysis = Analysis;
export type CEFRReportsV2 = { cefr: CEFRReports };
export type TalkTime = TalkTimeMetrics;

// Helper type for time metrics extraction
export interface TimeMetrics {
  userTalkTime: number; // in seconds
  aiTalkTime: number; // in seconds
  totalDuration: number; // in seconds
}

// Helper type for flattened scores (used in UI)
export interface FlattenedScore {
  label: string;
  score: number;
}

// Type for recording with report
export interface RecordingWithReportV2 {
  createdAt: Date;
  sessionDate?: Date | null;
  conversationFeedback?: {
    report: ReportDataV2;
  } | null;
}

// ============================================
// Webhook Types
// ============================================

export interface CEFRWebhookPayloadV2 {
  recording_id: string;
  correlation_id: string;
  status: "completed" | "failed";
  data?: ReportDataV2;
  error?: string;
  processing_time_ms: number;
}

// ============================================
// Legacy/Backward Compatibility Types (V1)
// ============================================
// These are kept for backward compatibility but should not be used for new code

export type CEFRLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";
// Note: ConfidenceLevel is now exported from @/schemas

// Legacy V1 types - DO NOT USE FOR NEW CODE
export interface Justification {
  strengths: string[];
  limitations: string[];
  reason: string;
}

export interface CEFRAssessmentBase {
  overall_score: CEFRLevel;
  confidence_level: ConfidenceLevel;
  justification: Justification;
}
