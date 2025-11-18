import { useState, useMemo } from "react";
import type { ReportDataV2 } from "@/types/cefr-report";
import { ScoreRadialChart } from "./score-radial-chart";
import { MetricCard } from "./metric-card";
import { TagFilterPills } from "./tag-filter-pills";
import { TaggedSegmentsView } from "./tagged-segments-view";
import { getUniqueTagsFromSegments } from "@/lib/segment-utils";
import { Check, AlertTriangle } from "lucide-react";

interface VocabularySectionProps {
  reportData: ReportDataV2;
}

export function VocabularySection({ reportData }: VocabularySectionProps) {
  const vocabulary = reportData.reports?.cefr?.vocabulary;

  // Initialize state for selected tags
  const segments = vocabulary?.segments ?? [];
  const allTags = useMemo(() => getUniqueTagsFromSegments(segments), [segments]);
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set(allTags));

  if (!vocabulary) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
        <h2 className="text-2xl font-bold mb-4">Vocabulary Analysis</h2>
        <p className="text-gray-600">No vocabulary data available.</p>
      </div>
    );
  }

  const score = vocabulary.score?.score ?? 0;
  const strengths = vocabulary.score?.strengths ?? [];
  const limitations = vocabulary.score?.limitations ?? [];
  const metrics = vocabulary.metrics;

  return (
    <div className="space-y-6">
      {/* Header with Score Ring */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
        <div className="grid items-center lg:grid-cols-[1.4fr_minmax(0,1fr)]">
          <div className="space-y-3 text-center lg:text-left">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Vocabulary Analysis</h2>
              <p className="mt-2 text-sm text-gray-600">
                Your vocabulary score is{" "}
                <span className="font-semibold text-gray-900">{score}</span>{" "}
                ({score >= 60 ? "B1" : score >= 40 ? "A2" : "A1"}). Keep expanding your
                word choices while focusing on the areas outlined below.
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
            {metrics.lexical_diversity && (
              <MetricCard
                // name={metrics.lexical_diversity.name}
                name={"Number of new words used"}
                userScore={metrics.lexical_diversity.user_score}
                targetScore={metrics.lexical_diversity.target_score}
              />
            )}

            {/* {metrics.lexical_distribution && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base font-medium">
                    {metrics.lexical_distribution.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <div className="text-2xl font-bold text-gray-900">
                        {metrics.lexical_distribution.average_lexical_level.toFixed(1)}
                      </div>
                      <div className="text-sm text-gray-500">Average CEFR Level</div>
                    </div>
                    <div className="text-sm text-gray-700">
                      {metrics.lexical_distribution.interpretation}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {metrics.lexical_sophistication && (
              <MetricCard
                name={metrics.lexical_sophistication.name}
                userScore={metrics.lexical_sophistication.user_score}
                targetScore={metrics.lexical_sophistication.target_score}
                interpretation={metrics.lexical_sophistication.interpretation}
              />
            )}

            {metrics.lexical_precision && (
              <MetricCard
                name={metrics.lexical_precision.name}
                userScore={metrics.lexical_precision.user_score}
                targetScore={metrics.lexical_precision.target_score}
                interpretation={metrics.lexical_precision.precision_level}
              />
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
