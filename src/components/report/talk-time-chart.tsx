import { Cell, Label, Pie, PieChart } from "recharts";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface TalkTimeChartProps {
  talkTime: {
    duration: string;
    speakers: Record<string, string>;
    idle?: string;
  };
  speakerMap: Array<{ speaker_id: string; speaker_name: string }>;
  size?: number;
}

function timeToSeconds(time: string): number {
  const parts = time.split(":");
  if (parts.length === 3) {
    const [hours, minutes, seconds] = parts.map(Number);
    return (hours || 0) * 3600 + (minutes || 0) * 60 + (seconds || 0);
  }
  return 0;
}

function formatTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

export function TalkTimeChart({
  talkTime,
  speakerMap,
  size = 300,
}: TalkTimeChartProps) {
  const totalSeconds = timeToSeconds(talkTime.duration);

  // Prepare chart data
  const chartData = Object.entries(talkTime.speakers || {}).map(
    ([id, time], index) => {
      const speaker = speakerMap.find((s) => s.speaker_id === id);
      const seconds = timeToSeconds(time);
      const percentage = totalSeconds > 0 ? (seconds / totalSeconds) * 100 : 0;

      return {
        speaker: speaker?.speaker_name || id,
        speakerId: id,
        time: formatTime(seconds),
        seconds,
        percentage: Math.round(percentage * 10) / 10,
        fill:
          index === 0 ? "#3b82f6" : "#22c55e", // Mentor: blue, Student: green
      };
    }
  );

  // Add idle time if exists
  const idleSeconds = timeToSeconds(talkTime.idle || "00:00:00");
  if (idleSeconds > 0) {
    const idlePercentage =
      totalSeconds > 0 ? (idleSeconds / totalSeconds) * 100 : 0;
    chartData.push({
      speaker: "Idle Time",
      speakerId: "idle",
      time: formatTime(idleSeconds),
      seconds: idleSeconds,
      percentage: Math.round(idlePercentage * 10) / 10,
      fill: "#9ca3af", // gray-400
    });
  }

  const chartConfig = chartData.reduce(
    (config, item) => ({
      ...config,
      [item.speakerId]: {
        label: item.speaker,
        color: item.fill,
      },
    }),
    {} as ChartConfig
  );

  return (
    <div className="flex flex-col items-center gap-4">
      <ChartContainer
        config={chartConfig}
        className="mx-auto"
        style={{ width: size, height: size }}
      >
        <PieChart>
          <ChartTooltip
            content={
              <ChartTooltipContent
                hideLabel
                className="min-w-[200px]"
                formatter={(_value, _name, item) => (
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center justify-between gap-4">
                      <span className="font-medium">{item.payload.speaker}</span>
                      <span className="font-bold">{item.payload.time}</span>
                    </div>
                    <div className="text-muted-foreground text-xs">
                      {item.payload.percentage}% of total
                    </div>
                  </div>
                )}
              />
            }
          />
          <Pie
            data={chartData}
            dataKey="seconds"
            nameKey="speaker"
            cx="50%"
            cy="50%"
            innerRadius="60%"
            outerRadius="80%"
            paddingAngle={2}
            className="transition-all duration-300"
          >
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.fill}
                stroke={entry.fill}
                className="transition-all duration-300 hover:opacity-80"
              />
            ))}
            <Label
              content={({ viewBox }) => {
                if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                  return (
                    <text
                      x={viewBox.cx}
                      y={viewBox.cy}
                      textAnchor="middle"
                      dominantBaseline="middle"
                    >
                      <tspan
                        x={viewBox.cx}
                        y={(viewBox.cy || 0) - 8}
                        className="fill-foreground text-2xl font-bold"
                      >
                        {talkTime.duration}
                      </tspan>
                      <tspan
                        x={viewBox.cx}
                        y={(viewBox.cy || 0) + 12}
                        className="fill-muted-foreground text-xs"
                      >
                        Total Duration
                      </tspan>
                    </text>
                  );
                }
              }}
            />
          </Pie>
        </PieChart>
      </ChartContainer>

      {/* Custom Legend */}
      <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
        {chartData.map((entry, index) => (
          <div key={index} className="flex items-center gap-2">
            <div
              className="h-3 w-3 rounded-full"
              style={{ backgroundColor: entry.fill }}
            />
            <span className="font-medium">{entry.speaker}</span>
            <span className="text-muted-foreground">
              ({entry.time} · {entry.percentage}%)
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
