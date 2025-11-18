import { useState, useMemo } from "react";
import type { ReportDataV2 } from "@/types/cefr-report";
import { ScoreRadialChart } from "./score-radial-chart";
import { MetricCard } from "./metric-card";
import { TagFilterPills } from "./tag-filter-pills";
import { TaggedSegmentsView } from "./tagged-segments-view";
import { getUniqueTagsFromSegments } from "@/lib/segment-utils";
import { Check, AlertTriangle } from "lucide-react";

interface FluencySectionProps {
  reportData: ReportDataV2;
}

export function FluencySection({ reportData }: FluencySectionProps) {
  const fluency = reportData.reports?.cefr?.fluency;

  // Initialize state for selected tags
  const segments = fluency?.segments ?? [];
  const allTags = useMemo(() => getUniqueTagsFromSegments(segments), [segments]);
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set(allTags));

  if (!fluency) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
        <h2 className="text-2xl font-bold mb-4">Fluency Analysis</h2>
        <p className="text-gray-600">No fluency data available.</p>
      </div>
    );
  }

  const score = fluency.score?.score ?? 0;
  const strengths = fluency.score?.strengths ?? [];
  const limitations = fluency.score?.limitations ?? [];
  const metrics = fluency.metrics;

  return (
    <div className="space-y-6">
      {/* Header with Score Ring */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
        <div className="grid items-center lg:grid-cols-[1.4fr_minmax(0,1fr)]">
          <div className="space-y-3 text-center lg:text-left">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Fluency Analysis</h2>
              <p className="mt-2 text-sm text-gray-600">
                Your fluency score is{" "}
                <span className="font-semibold text-gray-900">{score}</span>{" "}
                ({score >= 60 ? "B1" : score >= 40 ? "A2" : "A1"}). Build on your flow and
                pacing while working on the opportunities below.
              </p>
            </div>
          </div>

          <div className="flex justify-center">
            <ScoreRadialChart
              score={score}
              size={160}
              showLabel={false}
              showFraction={true}
            />
          </div>
        </div>

        {(strengths.length > 0 || limitations.length > 0) && (
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {strengths.length > 0 && (
              <div className="rounded-lg border border-green-100 bg-green-50/60 p-4">
                <div className="flex items-center gap-2 text-green-800">
                  <Check className="h-5 w-5" />
                  <h3 className="text-base font-semibold">Strengths</h3>
                </div>
                <ul className="mt-3 list-disc space-y-2 pl-5 text-left text-sm text-green-900">
                  {strengths.map((strength, index) => (
                    <li key={index} className="leading-relaxed marker:text-green-600">
                      {strength}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {limitations.length > 0 && (
              <div className="rounded-lg border border-amber-100 bg-amber-50/60 p-4">
                <div className="flex items-center gap-2 text-amber-800">
                  <AlertTriangle className="h-5 w-5" />
                  <h3 className="text-base font-semibold">Areas to Improve</h3>
                </div>
                <ul className="mt-3 list-disc space-y-2 pl-5 text-left text-sm text-amber-900">
                  {limitations.map((limitation, index) => (
                    <li key={index} className="leading-relaxed marker:text-amber-600">
                      {limitation}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Metrics Grid */}
      {metrics && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Detailed Metrics
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {metrics.speech_rate && (
              <MetricCard
                name={metrics.speech_rate.name}
                userScore={metrics.speech_rate.user_score}
                targetScore={metrics.speech_rate.target_score}
                interpretation={metrics.speech_rate.interpretation}
              />
            )}

            {metrics.average_pause_duration && (
              <MetricCard
                name={metrics.average_pause_duration.name}
                userScore={metrics.average_pause_duration.user_score}
                targetScore={metrics.average_pause_duration.target_score}
              />
            )}

            {metrics.fillers_per_100_words && (
              <MetricCard
                name={metrics.fillers_per_100_words.name}
                userScore={metrics.fillers_per_100_words.user_score}
                targetScore={metrics.fillers_per_100_words.target_score}
                interpretation={metrics.fillers_per_100_words.level}
              />
            )}

            {metrics.hesitation_rate && (
              <MetricCard
                name={metrics.hesitation_rate.name}
                userScore={metrics.hesitation_rate.user_score}
                targetScore={metrics.hesitation_rate.target_score}
              />
            )}
          </div>
        </div>
      )}

      {/* Example Segments with Tag Filtering */}
      {segments.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Specific examples of improvements
          </h3>

          {/* Tag Filter Pills */}
          <TagFilterPills
            segments={segments}
            selectedTags={selectedTags}
            onTagsChange={setSelectedTags}
          />

          {/* Grouped Segments View */}
          <TaggedSegmentsView
            segments={segments}
            selectedTags={selectedTags}
            initialItemsPerGroup={10}
            loadMoreIncrement={5}
          />
        </div>
      )}
    </div>
  );
}
