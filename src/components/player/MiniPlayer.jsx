import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Repeat,
  Repeat1,
  Shuffle,
  Heart,
} from "lucide-react";
import usePlayerStore from "../../store/playerStore";
import ProgressBar from "./ProgressBar";
import VolumeControl from "./VolumeControl";
import CoverImage from "../common/CoverImage";
import { formatDuration } from "../../lib/utils";

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

  const title = currentTrack.title;
  const subtitle =
    currentType === "track"
      ? currentTrack.artist
      : currentTrack.podcasts?.title || "Podcast";

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-t from-black via-black/95 to-black/90 backdrop-blur-xl border-t border-white/[0.05]"
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
        <div className="flex items-center gap-4 flex-1 min-w-0 lg:w-1/4 lg:flex-none">
          <div className="relative group">
            <CoverImage
              src={currentTrack.cover_url}
              title={currentTrack.title}
              alt={currentTrack.title}
              size="md"
              rounded="lg"
              className="shadow-xl"
            />
            {/* Playing animation overlay */}
            {isPlaying && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-lg">
                <div className="flex items-end gap-0.5 h-6">
                  <span className="w-1 bg-[var(--accent-primary)] rounded-full animate-music-bar-1" />
                  <span className="w-1 bg-[var(--accent-primary)] rounded-full animate-music-bar-2" />
                  <span className="w-1 bg-[var(--accent-primary)] rounded-full animate-music-bar-3" />
                </div>
              </div>
            )}
          </div>
          <div className="min-w-0">
            <p className="font-semibold truncate text-sm lg:text-base hover:text-[var(--accent-primary)] transition-colors cursor-pointer">
              {title}
            </p>
            <p className="text-[var(--text-secondary)] text-xs lg:text-sm truncate hover:text-white transition-colors cursor-pointer">
              {subtitle}
            </p>
          </div>
          {/* Like Button */}
          <button className="hidden lg:flex p-2 text-[var(--text-muted)] hover:text-[var(--accent-primary)] transition-colors">
            <Heart className="w-5 h-5" />
          </button>
        </div>

        {/* Desktop Controls */}
        <div className="hidden lg:flex flex-col items-center flex-1">
          {/* Control Buttons */}
          <div className="flex items-center gap-5 mb-2">
            <button
              onClick={toggleShuffle}
              className={`p-2 rounded-full transition-all duration-200 ${
                isShuffled
                  ? "text-[var(--accent-primary)] bg-[var(--accent-primary)]/10"
                  : "text-[var(--text-muted)] hover:text-white hover:bg-white/5"
              }`}
              title="Shuffle"
            >
              <Shuffle className="w-4 h-4" />
            </button>

            <button
              onClick={previous}
              className="p-2 text-[var(--text-secondary)] hover:text-white hover:scale-110 transition-all"
              title="Previous"
            >
              <SkipBack className="w-5 h-5" fill="currentColor" />
            </button>

            <button
              onClick={togglePlay}
              className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:scale-105 transition-all shadow-lg hover:shadow-xl"
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
              className="p-2 text-[var(--text-secondary)] hover:text-white hover:scale-110 transition-all"
              title="Next"
            >
              <SkipForward className="w-5 h-5" fill="currentColor" />
            </button>

            <button
              onClick={toggleRepeat}
              className={`p-2 rounded-full transition-all duration-200 ${
                repeatMode !== "none"
                  ? "text-[var(--accent-primary)] bg-[var(--accent-primary)]/10"
                  : "text-[var(--text-muted)] hover:text-white hover:bg-white/5"
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
          <div className="flex items-center gap-3 text-xs text-[var(--text-muted)]">
            <span className="w-10 text-right font-medium">
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
            <span className="w-10 font-medium">{formatDuration(duration)}</span>
          </div>
        </div>

        {/* Mobile Controls */}
        <div className="flex lg:hidden items-center gap-3">
          <button
            onClick={previous}
            className="p-2 text-[var(--text-secondary)]"
          >
            <SkipBack className="w-5 h-5" fill="currentColor" />
          </button>
          <button
            onClick={togglePlay}
            className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg"
          >
            {isPlaying ? (
              <Pause className="w-6 h-6 text-black" fill="black" />
            ) : (
              <Play className="w-6 h-6 text-black ml-0.5" fill="black" />
            )}
          </button>
          <button onClick={next} className="p-2 text-[var(--text-secondary)]">
            <SkipForward className="w-5 h-5" fill="currentColor" />
          </button>
        </div>

        {/* Volume Control (Desktop) */}
        <div className="hidden lg:flex items-center justify-end gap-4 w-1/4">
          <VolumeControl />
        </div>
      </div>
    </div>
  );
};

export default MiniPlayer;
