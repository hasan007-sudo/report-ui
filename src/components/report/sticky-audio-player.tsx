import { useAudioPlayer } from "@/contexts/audio-player-context";
import { formatSecondsToTime } from "@/lib/audio-utils";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { CEFRReportProps } from "../cefr-report";

interface StickyAudioPlayerProps {
  recordingTitle: string;
  studentName: string;
  variant: CEFRReportProps['variant'];
}

export function StickyAudioPlayer({
  recordingTitle: _recordingTitle,
  studentName: _studentName,
  variant
}: StickyAudioPlayerProps) {
  const {
    isPlaying,
    currentTime,
    duration,
    isLoading,
    seekTo,
    togglePlay,
    audioRef,
  } = useAudioPlayer();

  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0] ?? 1;
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
    if (newVolume > 0 && isMuted) {
      setIsMuted(false);
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.volume = volume;
        setIsMuted(false);
      } else {
        audioRef.current.volume = 0;
        setIsMuted(true);
      }
    }
  };

  const handleSeek = (value: number[]) => {
    const newTime = value[0] ?? 0;
    seekTo(newTime);
  };

  const leftPosition =
    variant === "integrated"
      ? "calc(16rem + (100vw - 16rem) / 2)"
      : "50%";

  return (
    <div
      className="fixed bottom-4 z-50 w-[65%] -translate-x-1/2 rounded-lg border bg-white shadow-2xl"
      style={{ left: leftPosition }}
    >
      <div className="flex items-center gap-3 px-4 py-2.5">
        {/* Center section: Play button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => void togglePlay()}
          disabled={isLoading || !duration}
          className="h-9 w-9 shrink-0 rounded-full bg-blue-600 text-white shadow-lg hover:scale-105 hover:bg-blue-700 disabled:opacity-50"
        >
          {isPlaying ? (
            <Pause className="h-4 w-4 fill-current" />
          ) : (
            <Play className="h-4 w-4 fill-current" />
          )}
        </Button>

        {/* Progress bar - Takes most of the space */}
        <div className="flex flex-1 items-center gap-2.5">
          <span className="text-[11px] tabular-nums text-gray-600 font-medium">
            {formatSecondsToTime(currentTime)}
          </span>
          <div className="relative flex-1">
            <Slider
              value={[currentTime]}
              max={duration || 100}
              step={0.1}
              onValueChange={handleSeek}
              disabled={!duration}
              className="cursor-pointer bg-gray-200"
            />
          </div>
          <span className="text-[11px] tabular-nums text-gray-600 font-medium">
            {formatSecondsToTime(duration)}
          </span>
        </div>

        {/* Right section: Volume control */}
        <div className="hidden items-center gap-2 md:flex">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleMute}
            className="h-8 w-8 flex-shrink-0 text-gray-600 hover:text-gray-900"
          >
            {isMuted || volume === 0 ? (
              <VolumeX className="h-4 w-4" />
            ) : (
              <Volume2 className="h-4 w-4" />
            )}
          </Button>
          <div className="w-20">
            <Slider
              value={[isMuted ? 0 : volume]}
              max={1}
              step={0.01}
              onValueChange={handleVolumeChange}
              className="cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
