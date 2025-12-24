import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Repeat,
  Repeat1,
  Shuffle,
} from "lucide-react";
import usePlayerStore from "../../store/playerStore";
import ProgressBar from "./ProgressBar";
import VolumeControl from "./VolumeControl";
import { formatDuration, getPlaceholderCover } from "../../lib/utils";

const MiniPlayer = () => {
  const {
    currentTrack,
    currentType,
    isPlaying,
    currentTime,
    duration,
    isShuffled,
    repeatMode,
    togglePlay,
    next,
    previous,
    seek,
    toggleShuffle,
    toggleRepeat,
  } = usePlayerStore();

  if (!currentTrack) return null;

  const coverUrl =
    currentTrack.cover_url || getPlaceholderCover(currentTrack.title);
  const title = currentTrack.title;
  const subtitle =
    currentType === "track"
      ? currentTrack.artist
      : currentTrack.podcasts?.title || "Podcast";

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 bg-[var(--bg-secondary)] border-t border-[var(--border-light)] lg:bottom-0"
      style={{
        height: "var(--player-height)",
        marginBottom: "env(safe-area-inset-bottom)",
      }}
    >
      {/* Progress bar at top */}
      <ProgressBar
        currentTime={currentTime}
        duration={duration}
        onSeek={seek}
        className="absolute -top-1 left-0 right-0"
      />

      <div className="h-full px-4 flex items-center gap-4 max-w-screen-2xl mx-auto">
        {/* Track Info */}
        <div className="flex items-center gap-3 flex-1 min-w-0 lg:w-1/4 lg:flex-none">
          <div className="w-14 h-14 rounded-md overflow-hidden flex-shrink-0 shadow-lg">
            <img
              src={coverUrl}
              alt={title}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="min-w-0">
            <p className="font-medium truncate text-sm lg:text-base">{title}</p>
            <p className="text-[var(--text-secondary)] text-xs lg:text-sm truncate">
              {subtitle}
            </p>
          </div>
        </div>

        {/* Desktop Controls */}
        <div className="hidden lg:flex flex-col items-center flex-1">
          {/* Control Buttons */}
          <div className="flex items-center gap-4 mb-2">
            <button
              onClick={toggleShuffle}
              className={`p-2 transition-colors ${
                isShuffled
                  ? "text-[var(--accent-primary)]"
                  : "text-[var(--text-muted)] hover:text-white"
              }`}
              title="Shuffle"
            >
              <Shuffle className="w-4 h-4" />
            </button>

            <button
              onClick={previous}
              className="p-2 text-[var(--text-secondary)] hover:text-white transition-colors"
              title="Previous"
            >
              <SkipBack className="w-5 h-5" />
            </button>

            <button
              onClick={togglePlay}
              className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:scale-105 transition-transform"
              title={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? (
                <Pause className="w-5 h-5 text-black" fill="black" />
              ) : (
                <Play className="w-5 h-5 text-black ml-0.5" fill="black" />
              )}
            </button>

            <button
              onClick={next}
              className="p-2 text-[var(--text-secondary)] hover:text-white transition-colors"
              title="Next"
            >
              <SkipForward className="w-5 h-5" />
            </button>

            <button
              onClick={toggleRepeat}
              className={`p-2 transition-colors ${
                repeatMode !== "none"
                  ? "text-[var(--accent-primary)]"
                  : "text-[var(--text-muted)] hover:text-white"
              }`}
              title={`Repeat: ${repeatMode}`}
            >
              {repeatMode === "one" ? (
                <Repeat1 className="w-4 h-4" />
              ) : (
                <Repeat className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* Time Display */}
          <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
            <span className="w-10 text-right">
              {formatDuration(currentTime)}
            </span>
            <div className="w-[400px]">
              <ProgressBar
                currentTime={currentTime}
                duration={duration}
                onSeek={seek}
                showThumb
              />
            </div>
            <span className="w-10">{formatDuration(duration)}</span>
          </div>
        </div>

        {/* Mobile Controls */}
        <div className="flex lg:hidden items-center gap-2">
          <button
            onClick={togglePlay}
            className="w-10 h-10 bg-white rounded-full flex items-center justify-center"
          >
            {isPlaying ? (
              <Pause className="w-5 h-5 text-black" fill="black" />
            ) : (
              <Play className="w-5 h-5 text-black ml-0.5" fill="black" />
            )}
          </button>
        </div>

        {/* Volume Control (Desktop) */}
        <div className="hidden lg:flex items-center justify-end w-1/4">
          <VolumeControl />
        </div>
      </div>
    </div>
  );
};

export default MiniPlayer;
