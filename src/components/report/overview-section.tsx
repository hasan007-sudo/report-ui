import type { ReportDataV2 } from "@/types/cefr-report";
import { ScoreRadialChart } from "./score-radial-chart";
import { TalkTimeChart } from "./talk-time-chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, AlertTriangle } from "lucide-react";

interface OverviewSectionProps {
  reportData: ReportDataV2;
}

export function OverviewSection({ reportData }: OverviewSectionProps) {
  const summary = reportData.reports?.cefr?.summary;
  const transcript = reportData.transcript;
  const interactiveAnalysis = reportData.interactive_analysis;

  const scores = summary?.dimension_scores ?? {
    clarity: 0,
    fluency: 0,
    grammar: 0,
    vocabulary: 0,
    pronunciation: 0,
  };

  const overallScore = summary?.score?.score ?? 0;
  const strengths = summary?.score?.strengths ?? [];
  const limitations = summary?.score?.limitations ?? [];

  const duration = transcript?.talk_time?.duration ?? "N/A";
  const topicsCount = interactiveAnalysis?.topic_segments?.length ?? 0;
  const isSafe =
    interactiveAnalysis?.safety_flags?.profanity_detected === false;

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-150">
        <CardContent>
          <h2 className="text-2xl font-bold mb-2">Assessment Overview</h2>
          <p className="text-muted-foreground">
            Overall CEFR Level: <span className="font-semibold">B1</span> | Score:{" "}
            <span className="font-semibold">{overallScore}</span>
          </p>

          {/* Score Rings Grid */}
          <div className="flex flex-wrap justify-center gap-8 animate-in fade-in duration-700">
            <ScoreRadialChart score={scores.clarity} label="Clarity" showLabel showFraction={false} />
            <ScoreRadialChart score={scores.fluency} label="Fluency" showLabel showFraction={false} />
            <ScoreRadialChart score={scores.grammar} label="Grammar" showLabel showFraction={false} />
            <ScoreRadialChart score={scores.vocabulary} label="Vocabulary" showLabel showFraction={false} />
            <ScoreRadialChart score={scores.pronunciation} label="Pronunciation" showLabel showFraction={false} />
          </div>
        </CardContent>
      </Card>

      {/* Talk Time Distribution Pie Chart */}
      {transcript?.talk_time && transcript?.speaker_map && (
        <Card className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-150">
          <CardHeader>
            <CardTitle>Talk Time Distribution</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            <TalkTimeChart
              talkTime={transcript.talk_time}
              speakerMap={transcript.speaker_map}
              size={280}
            />
          </CardContent>
        </Card>
      )}

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300">
        {/* Session Duration */}
        <Card className="transition-all duration-200 hover:shadow-lg hover:scale-105">
          <CardContent className="p-6">
            <div className="text-sm font-medium text-muted-foreground mb-1">
              Session Duration
            </div>
            <div className="text-3xl font-bold text-primary">{duration}</div>
          </CardContent>
        </Card>

        {/* Topics Covered */}
        <Card className="transition-all duration-200 hover:shadow-lg hover:scale-105">
          <CardContent className="p-6">
            <div className="text-sm font-medium text-muted-foreground mb-1">
              Topics Covered
            </div>
            <div className="text-3xl font-bold dark:text-purple-400">
              {topicsCount}
            </div>
          </CardContent>
        </Card>

        {/* Content Safety */}
        <Card className="transition-all duration-200 hover:shadow-lg hover:scale-105">
          <CardContent className="p-6">
            <div className="text-sm font-medium text-muted-foreground mb-1">
              Content Safety
            </div>
            <div className="flex items-center gap-2">
              {isSafe ? (
                <>
                  <Check className="w-6 h-6 text-green-600 dark:text-green-400" />
                  <span className="text-lg font-semibold text-green-600 dark:text-green-400">
                    All Clear
                  </span>
                </>
              ) : (
                <>
                  <AlertTriangle className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                  <span className="text-lg font-semibold text-yellow-600 dark:text-yellow-400">
                    Flagged
                  </span>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Key Strengths */}
      {strengths.length > 0 && (
        <Card className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-500">
          <CardHeader>
            <CardTitle className="text-green-700 dark:text-green-400">
              Key Strengths
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {strengths.map((strength, index) => (
                <li
                  key={index}
                  className="flex items-start gap-2 animate-in fade-in slide-in-from-left-2 duration-300"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <Check className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                  <span className="text-sm">{strength}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Areas for Improvement */}
      {limitations.length > 0 && (
        <Card className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-700">
          <CardHeader>
            <CardTitle className="text-orange-700 dark:text-orange-400">
              Priority Areas for Improvement
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {limitations.map((limitation, index) => (
                <li
                  key={index}
                  className="flex items-start gap-2 animate-in fade-in slide-in-from-left-2 duration-300"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <AlertTriangle className="w-5 h-5 text-orange-600 dark:text-orange-400 flex-shrink-0 mt-0.5" />
                  <span className="text-sm">{limitation}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Action Plan */}
      {summary?.action_plan && summary.action_plan.length > 0 && (
        <Card className="bg-primary/5 border-primary/20 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-1000">
          <CardHeader>
            <CardTitle className="text-primary">
              Recommended Action Plan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="space-y-3">
              {summary.action_plan.map((action, index) => (
                <li
                  key={index}
                  className="flex items-start gap-3 animate-in fade-in slide-in-from-left-2 duration-300"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm font-semibold flex items-center justify-center">
                    {index + 1}
                  </span>
                  <span className="text-sm">{action}</span>
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
