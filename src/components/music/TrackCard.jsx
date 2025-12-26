import { Play, Pause } from "lucide-react";
import { cn } from "../../lib/utils";
import usePlayerStore from "../../store/playerStore";
import CoverImage from "../common/CoverImage";

/**
 * Premium Track Card Component
 *
 * Professional-looking card with:
 * - Gradient cover fallbacks (no ugly letters)
 * - Now-playing indicator with music bars
 * - Hover animations
 * - Active state highlighting
 */
const TrackCard = ({ track, onPlay, showArtist = true }) => {
  const { currentTrack, isPlaying } = usePlayerStore();
  const isCurrentTrack = currentTrack?.id === track.id;

  return (
    <div
      className={cn(
        "group relative p-4 rounded-xl transition-all duration-300 cursor-pointer",
        "bg-gradient-to-b from-white/[0.05] to-transparent",
        "hover:bg-white/[0.08]",
        "border border-transparent hover:border-white/[0.08]",
        "hover:shadow-xl hover:shadow-black/20",
        isCurrentTrack && "bg-white/[0.08] border-[var(--accent-primary)]/20"
      )}
      onClick={onPlay}
    >
      {/* Cover Image */}
      <div className="relative mb-4">
        <CoverImage
          src={track.cover_url}
          title={track.title}
          alt={track.title}
          size="full"
          rounded="xl"
          className="shadow-xl group-hover:shadow-2xl transition-all duration-300 group-hover:scale-[1.02]"
        />

        {/* Play Button Overlay */}
        <button
          className={cn(
            "absolute bottom-3 right-3 w-12 h-12 rounded-full",
            "flex items-center justify-center",
            "bg-[var(--accent-primary)] shadow-lg",
            "transform transition-all duration-300",
            isCurrentTrack
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0",
            "hover:scale-110 hover:shadow-[0_8px_25px_rgba(29,185,84,0.4)]"
          )}
          onClick={(e) => {
            e.stopPropagation();
            onPlay?.();
          }}
        >
          {isCurrentTrack && isPlaying ? (
            <Pause className="w-5 h-5 text-black" fill="black" />
          ) : (
            <Play className="w-5 h-5 text-black ml-0.5" fill="black" />
          )}
        </button>

        {/* Now Playing Indicator */}
        {isCurrentTrack && isPlaying && (
          <div className="absolute top-3 left-3 flex items-end gap-0.5 h-4 px-2 py-1 bg-black/60 rounded-full backdrop-blur-sm">
            <span className="w-1 bg-[var(--accent-primary)] rounded-full animate-music-bar-1" />
            <span className="w-1 bg-[var(--accent-primary)] rounded-full animate-music-bar-2" />
            <span className="w-1 bg-[var(--accent-primary)] rounded-full animate-music-bar-3" />
          </div>
        )}
      </div>

      {/* Track Info */}
      <h3
        className={cn(
          "font-semibold truncate mb-1 transition-colors",
          isCurrentTrack
            ? "text-[var(--accent-primary)]"
            : "group-hover:text-white"
        )}
      >
        {track.title}
      </h3>
      {showArtist && (
        <p className="text-sm text-[var(--text-secondary)] truncate group-hover:text-[var(--text-primary)] transition-colors">
          {track.artist}
        </p>
      )}
    </div>
  );
};

export default TrackCard;
