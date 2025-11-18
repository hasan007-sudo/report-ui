import { useState, useMemo } from "react";
import type { ReportDataV2 } from "@/types/cefr-report";
import { ScoreRadialChart } from "./score-radial-chart";
import { TagFilterPills } from "./tag-filter-pills";
import { TaggedSegmentsView } from "./tagged-segments-view";
import { getUniqueTagsFromSegments } from "@/lib/segment-utils";
import { Check, AlertTriangle } from "lucide-react";

interface ClaritySectionProps {
  reportData: ReportDataV2;
}

export function ClaritySection({ reportData }: ClaritySectionProps) {
  const clarity = reportData.reports?.cefr?.clarity;

  // Initialize state for selected tags
  const segments = clarity?.segments ?? [];
  const allTags = useMemo(() => getUniqueTagsFromSegments(segments), [segments]);
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set(allTags));

  if (!clarity) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
        <h2 className="text-2xl font-bold mb-4">Clarity Analysis</h2>
        <p className="text-gray-600">No clarity data available.</p>
      </div>
    );
  }

  const score = clarity.score?.score ?? 0;
  const strengths = clarity.score?.strengths ?? [];
  const limitations = clarity.score?.limitations ?? [];

  return (
    <div className="space-y-6">
      {/* Header with Score Ring */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
        <div className="grid items-center lg:grid-cols-[1.4fr_minmax(0,1fr)]">
          <div className="space-y-3 text-center lg:text-left">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Clarity Analysis</h2>
              <p className="mt-2 text-sm text-gray-600">
                Your clarity score is{" "}
                <span className="font-semibold text-gray-900">{score}</span>{" "}
                ({score >= 60 ? "B1" : score >= 40 ? "A2" : "A1"}). Stay consistent with
                organized ideas while addressing the key opportunities outlined below.
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
      {/* {metrics && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Detailed Metrics
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {metrics.cohesive_devices && (
              <MetricCard
                name={metrics.cohesive_devices.name}
                userScore={metrics.cohesive_devices.user_score}
                targetScore={metrics.cohesive_devices.target_score}
                interpretation={metrics.cohesive_devices.interpretation}
              />
            )}

            {metrics.discourse_organization && (
              <MetricCard
                name={metrics.discourse_organization.name}
                userScore={metrics.discourse_organization.user_score}
                targetScore={metrics.discourse_organization.target_score}
                interpretation={metrics.discourse_organization.interpretation}
              />
            )}

            {metrics.thematic_continuity && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base font-medium">
                    {metrics.thematic_continuity.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <div className="text-2xl font-bold text-gray-900">
                        {metrics.thematic_continuity.topic_drift_count}
                      </div>
                      <div className="text-sm text-gray-500">Topic Drift Count</div>
                    </div>
                    <div className="text-sm text-gray-700">
                      <span className="font-medium">Recovery Rate:</span>{" "}
                      {(metrics.thematic_continuity.recovery_rate * 100).toFixed(1)}%
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )} */}

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
