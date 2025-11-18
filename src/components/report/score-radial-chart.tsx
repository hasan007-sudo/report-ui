import { Label, PolarRadiusAxis, RadialBar, RadialBarChart } from "recharts";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface ScoreRadialChartProps {
  score: number;
  size?: number;
  showLabel?: boolean;
  label?: string;
  showFraction?: boolean;
}

function getScoreColor(score: number): string {
  if (score >= 70) return "hsl(142, 71%, 45%)"; // green - excellent
  if (score >= 50) return "hsl(45, 93%, 47%)"; // yellow - average
  return "hsl(0, 84%, 60%)"; // red - needs improvement
}

function getCEFRLevel(score: number): string {
  if (score >= 90) return "C2";
  if (score >= 80) return "C1";
  if (score >= 70) return "B2";
  if (score >= 60) return "B1";
  if (score >= 40) return "A2";
  return "A1";
}

export function ScoreRadialChart({
  score,
  size = 120,
  showLabel = true,
  label,
  showFraction = false,
}: ScoreRadialChartProps) {
  const cefrLevel = getCEFRLevel(score);
  const scoreColor = getScoreColor(score);

  const chartData = [{ name: "score", value: score, fill: scoreColor }];

  const chartConfig = {
    score: {
      label: label || "Score",
      color: scoreColor,
    },
  } satisfies ChartConfig;

  return (
    <div className="flex flex-col items-center gap-2">
      <ChartContainer
        config={chartConfig}
        className="mx-auto"
        style={{ width: size, height: size }}
      >
        <RadialBarChart
          data={chartData}
          startAngle={90}
          endAngle={90 + (score / 100) * 360}
          innerRadius="70%"
          outerRadius="100%"
        >
          <ChartTooltip
            cursor={false}
            content={
              <ChartTooltipContent
                hideLabel
                className="min-w-[120px]"
                formatter={(value) => (
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Score:</span>
                    <span className="font-bold">{value}/100</span>
                  </div>
                )}
              />
            }
          />
          <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
            <Label
              content={({ viewBox }) => {
                if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                  const centerY = (viewBox.cy || 0) + 6;

                  return (
                    <g>
                      <text
                        x={viewBox.cx}
                        y={centerY}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={
                            showFraction
                              ? centerY - 18
                              : centerY - 8
                          }
                          className="fill-foreground text-3xl font-bold"
                        >
                          {score}
                        </tspan>
                        {showFraction && (
                          <tspan
                            x={viewBox.cx}
                            y={centerY}
                            className="fill-muted-foreground text-xs"
                          >
                            /100
                          </tspan>
                        )}
                        <tspan
                          x={viewBox.cx}
                          y={
                            showFraction
                              ? centerY + 18
                              : centerY + 12
                          }
                          className="fill-muted-foreground text-xs font-semibold"
                        >
                          {cefrLevel}
                        </tspan>
                      </text>
                    </g>
                  );
                }
              }}
            />
          </PolarRadiusAxis>
          <RadialBar
            dataKey="value"
            cornerRadius={10}
            fill={scoreColor}
            stroke={scoreColor}
            className="transition-all duration-1000 ease-out"
          />
        </RadialBarChart>
      </ChartContainer>

      {showLabel && label && (
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
      )}
    </div>
  );
}
