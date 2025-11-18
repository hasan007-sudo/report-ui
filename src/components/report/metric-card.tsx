import { Card, CardContent } from "@/components/ui/card";

interface MetricScore {
  value: number;
  unit: string;
}

interface MetricCardProps {
  name: string;
  userScore: MetricScore;
  targetScore?: MetricScore;
  interpretation?: string;
  className?: string;
}

function getProgressColor(userValue: number, targetValue?: number): string {
  if (!targetValue) return "#3b82f6"; // blue as default

  const percentage = (userValue / targetValue) * 100;
  if (percentage >= 90) return "#22c55e"; // green
  if (percentage >= 70) return "#3b82f6"; // blue
  if (percentage >= 50) return "#eab308"; // yellow
  return "#ef4444"; // red
}

export function MetricCard({
  name,
  userScore,
  targetScore,
  interpretation,
  className = "",
}: MetricCardProps) {
  const hasTarget = targetScore !== undefined;
  const maxValue = hasTarget ? Math.max(userScore.value, targetScore.value) * 1.2 : userScore.value * 1.2;
  const userPercentage = (userScore.value / maxValue) * 100;
  const targetPercentage = hasTarget ? (targetScore.value / maxValue) * 100 : 0;
  const progressColor = getProgressColor(userScore.value, targetScore?.value);

  return (
    <Card className={`${className}`}>
      <CardContent className="p-4">
        {/* Metric Name */}
        <h4 className="text-sm font-semibold text-gray-700 mb-3">{name}</h4>

        {/* Score Display */}
        <div className="flex items-baseline justify-between mb-2">
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold" style={{ color: progressColor }}>
              {userScore.value}
            </span>
            <span className="text-sm text-gray-500">{userScore.unit}</span>
          </div>
          {hasTarget && (
            <div className="text-xs text-gray-500">
              Target: {targetScore.value} {targetScore.unit}
            </div>
          )}
        </div>

        {/* Progress Bar */}
        <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden mb-2">
          {/* User Score Bar */}
          <div
            className="absolute top-0 left-0 h-full rounded-full transition-all duration-800 ease-out"
            style={{
              width: `${userPercentage}%`,
              backgroundColor: progressColor,
            }}
          />

          {/* Target Marker */}
          {hasTarget && (
            <div
              className="absolute top-0 h-full w-1 bg-gray-700 cursor-help"
              style={{ left: `${targetPercentage}%` }}
              title={`This is a target marker. This is the expected value: ${targetScore.value} ${targetScore.unit}`}
            >
              {/* <div className="absolute -top-1 -left-1 w-3 h-3 bg-gray-700 rounded-full border-2 border-white" /> */}
            </div>
          )}
        </div>

        {/* Interpretation */}
        {interpretation && (
          <p className="text-xs text-gray-600 italic">{interpretation}</p>
        )}
      </CardContent>
    </Card>
  );
}
