// Main Styles
import './index.css';

// ============================================================================
// Main Component
// ============================================================================
export { CEFRReport } from './components/cefr-report';

// ============================================================================
// Context Providers
// ============================================================================
export { AudioPlayerProvider, useAudioPlayer } from './contexts/audio-player-context';

// ============================================================================
// Report Section Components
// ============================================================================
export { OverviewSection } from './components/report/overview-section';
export { GrammarSection } from './components/report/grammar-section';
export { FluencySection } from './components/report/fluency-section';
export { VocabularySection } from './components/report/vocabulary-section';
export { PronunciationSection } from './components/report/pronunciation-section';
export { ClaritySection } from './components/report/clarity-section';
export { TranscriptSection } from './components/report/transcript-section';

// ============================================================================
// Shared UI Components
// ============================================================================
export { CEFRSubTabs } from './components/report/cefr-sub-tabs';
export { ScoreRadialChart } from './components/report/score-radial-chart';
export { TalkTimeChart } from './components/report/talk-time-chart';
export { MetricCard } from './components/report/metric-card';
export { SegmentCard } from './components/report/segment-card';
export { TaggedSegmentsView } from './components/report/tagged-segments-view';
export { TagFilterPills } from './components/report/tag-filter-pills';
export { TranscriptFilters } from './components/report/transcript-filters';
export { StickyAudioPlayer } from './components/report/sticky-audio-player';

// ============================================================================
// Types
// ============================================================================
export type {
  // Main evaluation data
  V2EvaluationData,
  ReportDataV2,

  // Transcript types
  ProcessedTranscript,
  TranscriptSegment,
  SpeakerMap,
  TalkTimeMetrics,
  TranscriptV2,
  TalkTime,

  // Analysis types
  Analysis,
  TopicSegment,
  SafetyFlags,
  SpeakerSentiment,
  EmotionEvent,
  InteractiveAnalysis,

  // CEFR Report types
  CEFRReports,
  CEFRReportsV2,
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
  SpeakerId,

  // Helper types
  TimeMetrics,
  FlattenedScore,
  RecordingWithReportV2,
  CEFRWebhookPayloadV2,
  CEFRLevel,
} from './types/cefr-report';

// ============================================================================
// Zod Schemas (for validation)
// ============================================================================
export {
  // Base schemas
  timestampSchema,
  speakerIdSchema,
  confidenceLevelSchema,
  baseScoreSchema,

  // Transcript schemas
  transcriptSegmentSchema,
  speakerMapSchema,
  processedTranscriptSchema,
  talkTimeMetricsSchema,

  // Analysis schemas
  analysisSchema,
  topicSegmentSchema,
  safetyFlagsSchema,
  speakerSentimentSchema,
  emotionEventSchema,

  // CEFR dimension schemas
  fluencySegmentSchema,
  fluencyMetricsSchema,
  fluencyReportSchema,

  grammarSegmentSchema,
  grammarMetricsSchema,
  grammarReportSchema,

  vocabularySegmentSchema,
  vocabularyMetricsSchema,
  vocabularyReportSchema,

  pronunciationSegmentSchema,
  pronunciationMetricsSchema,
  pronunciationReportSchema,

  claritySegmentSchema,
  clarityMetricsSchema,
  clarityReportSchema,

  // Summary schema
  summarySchema,

  // Webhook schemas
  cefrReportsSchema,
  v2EvaluationDataSchema,
  webhookPayloadSchema,
  webhookPayloadSuccessSchema,
  webhookPayloadErrorSchema,
} from './schemas';

// ============================================================================
// Utility Functions
// ============================================================================
export {
  // Audio utilities
  parseTimeToSeconds,
  formatSecondsToTime,
  isTimeInSegment,
  findActiveSegmentIndex,
} from './lib/audio-utils';

export {
  // Segment utilities
  groupSegmentsByTag,
  getUniqueTagsFromSegments,
  filterSegmentsByTags,
  getTagDisplayName,
  getTagColorClass,
  countTotalSegmentsInGroups,
  sortTags,
} from './lib/segment-utils';

export {
  // General utilities
  cn,
} from './lib/utils';
