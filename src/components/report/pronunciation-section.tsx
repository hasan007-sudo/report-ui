import { useState, useMemo } from "react";
import type { ReportDataV2 } from "@/types/cefr-report";
import { ScoreRadialChart } from "./score-radial-chart";
import { MetricCard } from "./metric-card";
import { TagFilterPills } from "./tag-filter-pills";
import { TaggedSegmentsView } from "./tagged-segments-view";
import { getUniqueTagsFromSegments } from "@/lib/segment-utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, AlertTriangle } from "lucide-react";

interface PronunciationSectionProps {
  reportData: ReportDataV2;
}

export function PronunciationSection({ reportData }: PronunciationSectionProps) {
  const pronunciation = reportData.reports?.cefr?.pronunciation;

  // Initialize state for selected tags
  const segments = pronunciation?.segments ?? [];
  const allTags = useMemo(() => getUniqueTagsFromSegments(segments), [segments]);
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set(allTags));

  if (!pronunciation) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
        <h2 className="text-2xl font-bold mb-4">Pronunciation Analysis</h2>
        <p className="text-gray-600">No pronunciation data available.</p>
      </div>
    );
  }

  const score = pronunciation.score?.score ?? 0;
  const strengths = pronunciation.score?.strengths ?? [];
  const limitations = pronunciation.score?.limitations ?? [];
  const metrics = pronunciation.metrics;

  return (
    <div className="space-y-6">
      {/* Header with Score Ring */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
        <div className="grid items-center lg:grid-cols-[1.4fr_minmax(0,1fr)]">
          <div className="space-y-3 text-center lg:text-left">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Pronunciation Analysis</h2>
              <p className="mt-2 text-sm text-gray-600">
                Your pronunciation score is{" "}
                <span className="font-semibold text-gray-900">{score}</span>{" "}
                ({score >= 60 ? "B1" : score >= 40 ? "A2" : "A1"}). Maintain your clear
                articulation while improving the focus areas below.
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
            {metrics.segmental_accuracy && (
              <MetricCard
                name={metrics.segmental_accuracy.name}
                userScore={metrics.segmental_accuracy.user_score}
                targetScore={metrics.segmental_accuracy.target_score}
              />
            )}

            {metrics.word_stress_accuracy && (
              <MetricCard
                name={metrics.word_stress_accuracy.name}
                userScore={metrics.word_stress_accuracy.user_score}
                targetScore={metrics.word_stress_accuracy.target_score}
              />
            )}

            {metrics.intonation_control && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base font-medium">
                    {metrics.intonation_control.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="text-sm">
                      <span className="font-medium text-gray-700">Deviation Level:</span>{" "}
                      <span className="text-gray-900 capitalize">
                        {metrics.intonation_control.deviation_level}
                      </span>
                    </div>
                    <div className="text-sm">
                      <span className="font-medium text-gray-700">Meaning Variation:</span>{" "}
                      <span className="text-gray-900 capitalize">
                        {metrics.intonation_control.meaning_variation}
                      </span>
                    </div>
                    <div className="text-sm">
                      <span className="font-medium text-gray-700">Sentence Stress Errors:</span>{" "}
                      <span className="text-gray-900">
                        {metrics.intonation_control.sentence_stress_error_rate}%
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {metrics.intelligibility && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base font-medium">
                    {metrics.intelligibility.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="text-sm">
                      <span className="font-medium text-gray-700">Listener Strain:</span>{" "}
                      <span className="text-gray-900 capitalize">
                        {metrics.intelligibility.listener_strain}
                      </span>
                    </div>
                    <div className="text-sm">
                      <span className="font-medium text-gray-700">Overall Impact:</span>{" "}
                      <span className="text-gray-900 capitalize">
                        {metrics.intelligibility.overall_impact}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
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
