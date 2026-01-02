import { useState, useRef, useEffect } from "react";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Repeat,
  Shuffle,
  Volume2,
  VolumeX,
  Heart,
  Maximize2,
  ListMusic,
} from "lucide-react";
import usePlayerStore from "../../store/playerStore";
import { formatDuration } from "../../lib/utils";
import ProgressBar from "./ProgressBar";
import VolumeControl from "./VolumeControl";
import CoverImage from "../common/CoverImage";

const MiniPlayer = () => {
  const {
    currentTrack,
    isPlaying,
    progress,
    duration,
    volume,
    isMuted,
    isShuffled,
    repeatMode,
    togglePlay,
    nextTrack,
    previousTrack,
    seek,
    setVolume,
    toggleMute,
    toggleShuffle,
    toggleRepeat,
  } = usePlayerStore();

  const [showQueue, setShowQueue] = useState(false);

  if (!currentTrack) return null;

  return (
    <div className={`player-bar ${isPlaying ? "active" : ""}`}>
      <div className="max-w-screen-2xl mx-auto flex items-center gap-4">
        {/* Track Info */}
        <div className="flex items-center gap-3 w-1/4 min-w-0">
          <div className="w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 glow-teal-sm">
            <CoverImage
              src={currentTrack.cover_url}
              alt={currentTrack.title}
              title={currentTrack.title}
              size="small"
              className="w-full h-full"
            />
          </div>
          <div className="min-w-0">
            <h4 className="font-medium truncate text-slate-100 glow-text">
              {currentTrack.title}
            </h4>
            <p className="text-sm text-slate-400 truncate">
              {currentTrack.artist}
            </p>
          </div>
          <button className="ml-2 p-2 text-slate-400 hover:text-teal-400 transition-colors">
            <Heart className="w-5 h-5" />
          </button>
        </div>

        {/* Player Controls */}
        <div className="flex-1 flex flex-col items-center gap-2">
          {/* Control Buttons */}
          <div className="flex items-center gap-4">
            <button
              onClick={toggleShuffle}
              className={`p-2 transition-colors ${
                isShuffled
                  ? "text-teal-400"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Shuffle className="w-5 h-5" />
            </button>
            <button
              onClick={previousTrack}
              className="p-2 text-slate-300 hover:text-white transition-colors"
            >
              <SkipBack className="w-5 h-5" fill="currentColor" />
            </button>
            <button
              onClick={togglePlay}
              className="btn-play glow-teal animate-glow-pulse"
            >
              {isPlaying ? (
                <Pause className="w-6 h-6" fill="currentColor" />
              ) : (
                <Play className="w-6 h-6 ml-0.5" fill="currentColor" />
              )}
            </button>
            <button
              onClick={nextTrack}
              className="p-2 text-slate-300 hover:text-white transition-colors"
            >
              <SkipForward className="w-5 h-5" fill="currentColor" />
            </button>
            <button
              onClick={toggleRepeat}
              className={`p-2 transition-colors ${
                repeatMode !== "off"
                  ? "text-teal-400"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Repeat className="w-5 h-5" />
              {repeatMode === "one" && (
                <span className="absolute text-xs font-bold">1</span>
              )}
            </button>
          </div>

          {/* Progress Bar */}
          <div className="w-full max-w-xl flex items-center gap-3">
            <span className="text-xs text-slate-400 w-10 text-right">
              {formatDuration(progress)}
            </span>
            <ProgressBar
              progress={progress}
              duration={duration}
              onSeek={seek}
            />
            <span className="text-xs text-slate-400 w-10">
              {formatDuration(duration)}
            </span>
          </div>
        </div>

        {/* Right Controls */}
        <div className="w-1/4 flex items-center justify-end gap-3">
          <button
            onClick={() => setShowQueue(!showQueue)}
            className={`p-2 transition-colors ${
              showQueue
                ? "text-teal-400"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <ListMusic className="w-5 h-5" />
          </button>
          <VolumeControl
            volume={volume}
            isMuted={isMuted}
            onVolumeChange={setVolume}
            onToggleMute={toggleMute}
          />
          <button className="p-2 text-slate-400 hover:text-slate-200 transition-colors">
            <Maximize2 className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MiniPlayer;
