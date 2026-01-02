/**
 * MediaPlayerBar Component
 *
 * A persistent, accessible media player status bar.
 *
 * Features:
 * - Play/Pause toggle
 * - Current time and total duration display
 * - Scrubbable seek/progress bar
 * - Volume control with slider and mute toggle
 * - Track info (title, artist, thumbnail)
 * - Keyboard accessibility (Space, Arrow keys, M for mute)
 * - Semantic HTML with ARIA attributes
 *
 * The bar sticks to the bottom of the screen and persists across pages.
 */

import { useRef, useState } from "react";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Repeat,
  Repeat1,
  Shuffle,
  Volume2,
  VolumeX,
  Volume1,
  Heart,
  ChevronUp,
  ListMusic,
  Music2,
} from "lucide-react";
import usePlayerStore from "../../store/playerStore";
import useAudioController from "../../hooks/useAudioController";
import { formatDuration } from "../../lib/utils";

/**
 * Main MediaPlayerBar Component
 */
const MediaPlayerBar = () => {
  const {
    currentTrack,
    isPlaying,
    currentTime,
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
    next,
    previous,
  } = usePlayerStore();

  const { audioRef, handleTimeUpdate, handleLoadedMetadata, handleEnded } =
    useAudioController();

  // Don't render if no track is loaded
  if (!currentTrack) return null;

  return (
    <>
      {/* Hidden Audio Element */}
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
        preload="auto"
        aria-hidden="true"
      />

      {/* Player Bar */}
      <footer
        role="region"
        aria-label="Media player"
        className={`player-bar ${isPlaying ? "active" : ""}`}
      >
        <div className="max-w-screen-2xl mx-auto flex items-center gap-4">
          {/* Track Info Section */}
          <TrackInfo track={currentTrack} />

          {/* Playback Controls Section */}
          <PlaybackControls
            isPlaying={isPlaying}
            isShuffled={isShuffled}
            repeatMode={repeatMode}
            currentTime={currentTime}
            duration={duration}
            onTogglePlay={togglePlay}
            onNext={next || nextTrack}
            onPrevious={previous || previousTrack}
            onSeek={seek}
            onToggleShuffle={toggleShuffle}
            onToggleRepeat={toggleRepeat}
          />

          {/* Volume Controls Section */}
          <VolumeControls
            volume={volume}
            isMuted={isMuted}
            onVolumeChange={setVolume}
            onToggleMute={toggleMute}
          />
        </div>
      </footer>
    </>
  );
};

/**
 * Track Info Component
 * Displays album art, title, and artist
 */
const TrackInfo = ({ track }) => {
  const placeholderUrl = track.title
    ? `https://ui-avatars.com/api/?name=${encodeURIComponent(
        track.title
      )}&background=1e293b&color=2dd4bf&size=56`
    : null;

  return (
    <section
      className="flex items-center gap-3 w-1/4 min-w-0"
      aria-label="Now playing"
    >
      {/* Album Art / Thumbnail */}
      <figure className="w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 glow-teal-sm bg-slate-800">
        {track.cover_url || placeholderUrl ? (
          <img
            src={track.cover_url || placeholderUrl}
            alt={`Album art for ${track.title}`}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Music2 className="w-6 h-6 text-slate-600" aria-hidden="true" />
          </div>
        )}
      </figure>

      {/* Track Details */}
      <div className="min-w-0">
        <h3 className="font-medium truncate text-slate-100 glow-text text-sm">
          {track.title}
        </h3>
        {track.artist && (
          <p className="text-xs text-slate-400 truncate">{track.artist}</p>
        )}
      </div>

      {/* Like Button */}
      <button
        className="ml-2 p-2 text-slate-400 hover:text-teal-400 transition-colors"
        aria-label="Add to favorites"
      >
        <Heart className="w-4 h-4" aria-hidden="true" />
      </button>
    </section>
  );
};

/**
 * Playback Controls Component
 * Includes play/pause, skip, shuffle, repeat, and progress bar
 */
const PlaybackControls = ({
  isPlaying,
  isShuffled,
  repeatMode,
  currentTime,
  duration,
  onTogglePlay,
  onNext,
  onPrevious,
  onSeek,
  onToggleShuffle,
  onToggleRepeat,
}) => {
  return (
    <section
      className="flex-1 flex flex-col items-center gap-2"
      aria-label="Playback controls"
    >
      {/* Control Buttons */}
      <div
        className="flex items-center gap-3"
        role="group"
        aria-label="Transport controls"
      >
        {/* Shuffle */}
        <button
          onClick={onToggleShuffle}
          className={`p-2 transition-colors ${
            isShuffled ? "text-teal-400" : "text-slate-400 hover:text-slate-200"
          }`}
          aria-label={isShuffled ? "Disable shuffle" : "Enable shuffle"}
          aria-pressed={isShuffled}
        >
          <Shuffle className="w-4 h-4" aria-hidden="true" />
        </button>

        {/* Previous */}
        <button
          onClick={onPrevious}
          className="p-2 text-slate-300 hover:text-white transition-colors"
          aria-label="Previous track"
        >
          <SkipBack
            className="w-5 h-5"
            fill="currentColor"
            aria-hidden="true"
          />
        </button>

        {/* Play/Pause */}
        <button
          onClick={onTogglePlay}
          className="btn-play glow-teal"
          aria-label={isPlaying ? "Pause" : "Play"}
          aria-pressed={isPlaying}
        >
          {isPlaying ? (
            <Pause className="w-6 h-6" fill="currentColor" aria-hidden="true" />
          ) : (
            <Play
              className="w-6 h-6 ml-0.5"
              fill="currentColor"
              aria-hidden="true"
            />
          )}
        </button>

        {/* Next */}
        <button
          onClick={onNext}
          className="p-2 text-slate-300 hover:text-white transition-colors"
          aria-label="Next track"
        >
          <SkipForward
            className="w-5 h-5"
            fill="currentColor"
            aria-hidden="true"
          />
        </button>

        {/* Repeat */}
        <button
          onClick={onToggleRepeat}
          className={`p-2 transition-colors relative ${
            repeatMode !== "none"
              ? "text-teal-400"
              : "text-slate-400 hover:text-slate-200"
          }`}
          aria-label={`Repeat mode: ${repeatMode}`}
        >
          {repeatMode === "one" ? (
            <Repeat1 className="w-4 h-4" aria-hidden="true" />
          ) : (
            <Repeat className="w-4 h-4" aria-hidden="true" />
          )}
        </button>
      </div>

      {/* Progress/Seek Bar */}
      <ProgressBar
        currentTime={currentTime}
        duration={duration}
        onSeek={onSeek}
      />
    </section>
  );
};

/**
 * Progress Bar Component
 * Scrubbable seek bar with time display
 */
const ProgressBar = ({ currentTime, duration, onSeek }) => {
  const barRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [hoverPosition, setHoverPosition] = useState(null);

  const progressPercent = duration ? (currentTime / duration) * 100 : 0;

  const handleClick = (e) => {
    if (!barRef.current || !duration) return;
    const rect = barRef.current.getBoundingClientRect();
    const percent = Math.max(
      0,
      Math.min(1, (e.clientX - rect.left) / rect.width)
    );
    onSeek(percent * duration);
  };

  const handleMouseMove = (e) => {
    if (!barRef.current || !duration) return;
    const rect = barRef.current.getBoundingClientRect();
    const percent = Math.max(
      0,
      Math.min(1, (e.clientX - rect.left) / rect.width)
    );
    setHoverPosition(percent);

    if (isDragging) {
      onSeek(percent * duration);
    }
  };

  const handleMouseDown = (e) => {
    setIsDragging(true);
    handleClick(e);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setHoverPosition(null);
    setIsDragging(false);
  };

  // Handle keyboard seek on the progress bar
  const handleKeyDown = (e) => {
    const step = 5; // seconds
    switch (e.key) {
      case "ArrowLeft":
        e.preventDefault();
        onSeek(Math.max(0, currentTime - step));
        break;
      case "ArrowRight":
        e.preventDefault();
        onSeek(Math.min(duration, currentTime + step));
        break;
      case "Home":
        e.preventDefault();
        onSeek(0);
        break;
      case "End":
        e.preventDefault();
        onSeek(duration);
        break;
      default:
        break;
    }
  };

  return (
    <div className="w-full max-w-xl flex items-center gap-3">
      {/* Current Time */}
      <time className="text-xs text-slate-400 w-10 text-right tabular-nums">
        {formatDuration(currentTime)}
      </time>

      {/* Seek Bar */}
      <div
        ref={barRef}
        role="slider"
        tabIndex={0}
        aria-label="Seek"
        aria-valuemin={0}
        aria-valuemax={duration || 100}
        aria-valuenow={currentTime}
        aria-valuetext={`${formatDuration(currentTime)} of ${formatDuration(
          duration
        )}`}
        className="flex-1 h-5 flex items-center cursor-pointer group"
        onClick={handleClick}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onKeyDown={handleKeyDown}
      >
        <div className="w-full h-1 bg-slate-700 rounded-full relative group-hover:h-1.5 transition-all">
          {/* Filled Progress */}
          <div
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-teal-500 to-cyan-400 rounded-full"
            style={{ width: `${progressPercent}%` }}
          >
            {/* Thumb */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-teal-400 opacity-0 group-hover:opacity-100 transition-opacity glow-teal-sm" />
          </div>

          {/* Hover Preview */}
          {hoverPosition !== null && (
            <div
              className="absolute top-0 bottom-0 bg-teal-400/30 rounded-full"
              style={{ width: `${hoverPosition * 100}%` }}
            />
          )}
        </div>
      </div>

      {/* Total Duration */}
      <time className="text-xs text-slate-400 w-10 tabular-nums">
        {formatDuration(duration)}
      </time>
    </div>
  );
};

/**
 * Volume Controls Component
 * Volume slider with mute toggle
 */
const VolumeControls = ({ volume, isMuted, onVolumeChange, onToggleMute }) => {
  const [showSlider, setShowSlider] = useState(false);
  const sliderRef = useRef(null);

  const effectiveVolume = isMuted ? 0 : volume;
  const VolumeIcon =
    effectiveVolume === 0 ? VolumeX : effectiveVolume < 0.5 ? Volume1 : Volume2;

  const handleSliderChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    onVolumeChange(newVolume);
  };

  const handleKeyDown = (e) => {
    const step = 0.1;
    switch (e.key) {
      case "ArrowUp":
      case "ArrowRight":
        e.preventDefault();
        onVolumeChange(Math.min(1, volume + step));
        break;
      case "ArrowDown":
      case "ArrowLeft":
        e.preventDefault();
        onVolumeChange(Math.max(0, volume - step));
        break;
      default:
        break;
    }
  };

  return (
    <section
      className="w-1/4 flex items-center justify-end gap-2"
      aria-label="Volume controls"
      onMouseEnter={() => setShowSlider(true)}
      onMouseLeave={() => setShowSlider(false)}
    >
      {/* Queue Toggle (Optional) */}
      <button
        className="p-2 text-slate-400 hover:text-slate-200 transition-colors hidden md:block"
        aria-label="Show queue"
      >
        <ListMusic className="w-4 h-4" aria-hidden="true" />
      </button>

      {/* Mute Toggle */}
      <button
        onClick={onToggleMute}
        className="p-2 text-slate-400 hover:text-slate-200 transition-colors"
        aria-label={isMuted ? "Unmute" : "Mute"}
        aria-pressed={isMuted}
      >
        <VolumeIcon className="w-5 h-5" aria-hidden="true" />
      </button>

      {/* Volume Slider */}
      <div
        className={`w-24 transition-opacity ${
          showSlider ? "opacity-100" : "opacity-70"
        }`}
      >
        <input
          ref={sliderRef}
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={effectiveVolume}
          onChange={handleSliderChange}
          onKeyDown={handleKeyDown}
          className="volume-slider w-full cursor-pointer"
          aria-label="Volume"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(effectiveVolume * 100)}
          aria-valuetext={`${Math.round(effectiveVolume * 100)}%`}
          style={{
            background: `linear-gradient(to right, #2dd4bf 0%, #2dd4bf ${
              effectiveVolume * 100
            }%, rgba(148, 163, 184, 0.2) ${
              effectiveVolume * 100
            }%, rgba(148, 163, 184, 0.2) 100%)`,
          }}
        />
      </div>
    </section>
  );
};

export default MediaPlayerBar;
