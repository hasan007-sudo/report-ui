import { useState, useMemo } from "react";
import type { ReportDataV2 } from "@/types/cefr-report";
import { ScoreRadialChart } from "./score-radial-chart";
import { MetricCard } from "./metric-card";
import { TagFilterPills } from "./tag-filter-pills";
import { TaggedSegmentsView } from "./tagged-segments-view";
import { getUniqueTagsFromSegments } from "@/lib/segment-utils";
import { Check, AlertTriangle } from "lucide-react";

interface GrammarSectionProps {
  reportData: ReportDataV2;
}

export function GrammarSection({ reportData }: GrammarSectionProps) {
  const grammar = reportData.reports?.cefr?.grammar;

  // Initialize state for selected tags
  const segments = grammar?.segments ?? [];
  const allTags = useMemo(() => getUniqueTagsFromSegments(segments), [segments]);
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set(allTags));

  if (!grammar) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
        <h2 className="text-2xl font-bold mb-4">Grammar Analysis</h2>
        <p className="text-gray-600">No grammar data available.</p>
      </div>
    );
  }

  const score = grammar.score?.score ?? 0;
  const strengths = grammar.score?.strengths ?? [];
  const limitations = grammar.score?.limitations ?? [];
  const metrics = grammar.metrics;

  return (
    <div className="space-y-6">
      {/* Header with Score Ring */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
        <div className="grid  items-center lg:grid-cols-[1.4fr_minmax(0,1fr)]">
          <div className="space-y-3 text-center lg:text-left">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Grammar Analysis</h2>
              <p className="mt-2 text-sm text-gray-600">
                Your grammar score is{" "}
                <span className="font-semibold text-gray-900">{score}</span>{" "}
                ({score >= 60 ? "B1" : score >= 40 ? "A2" : "A1"}). Keep building on
                your strong patterns while addressing key weaknesses highlighted below.
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
                <ul className="mt-3 space-y-2 text-sm text-green-900 list-disc pl-5 text-left">
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
                <ul className="mt-3 space-y-2 text-sm text-amber-900 list-disc pl-5 text-left">
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
            {metrics.errors_per_100_words && (
              <MetricCard
                name={metrics.errors_per_100_words.name}
                userScore={metrics.errors_per_100_words.user_score}
                targetScore={metrics.errors_per_100_words.target_score}
                interpretation={metrics.errors_per_100_words.interpretation}
              />
            )}

            {/* {metrics.self_correction_rate && (
              <MetricCard
                name={metrics.self_correction_rate.name}
                userScore={metrics.self_correction_rate.user_score}
                targetScore={metrics.self_correction_rate.target_score}
              />
            )} */}

            {/* {metrics.syntactic_complexity && (
              <MetricCard
                name={metrics.syntactic_complexity.name}
                userScore={metrics.syntactic_complexity.user_score}
                targetScore={metrics.syntactic_complexity.target_score}
                interpretation={metrics.syntactic_complexity.interpretation}
              />
            )} */}

            {/* {metrics.error_impact && (
              <Card>
                <CardContent className="p-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">
                    {metrics.error_impact.name}
                  </h4>
                  <div className="space-y-2">
                    <div className="text-xs text-gray-600">
                      <span className="font-medium">Dominant Error Type:</span>{" "}
                      <span className="capitalize">
                        {metrics.error_impact.dominant_error_type}
                      </span>
                    </div>
                    <div className="text-xs text-gray-600">
                      <span className="font-medium">Impact Level:</span>{" "}
                      {metrics.error_impact.impact_level}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )} */}
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
