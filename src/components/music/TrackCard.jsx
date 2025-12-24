import { Play, Heart } from "lucide-react";
import { getPlaceholderCover, cn } from "../../lib/utils";

const TrackCard = ({ track, onPlay, showArtist = true }) => {
  const coverUrl = track.cover_url || getPlaceholderCover(track.title);

  return (
    <div
      className={cn(
        "group p-4 rounded-lg bg-[var(--bg-secondary)] hover:bg-[var(--bg-tertiary)]",
        "transition-all duration-300 cursor-pointer"
      )}
      onClick={onPlay}
    >
      {/* Cover Image */}
      <div className="relative aspect-square mb-4 rounded-lg overflow-hidden shadow-lg">
        <img
          src={coverUrl}
          alt={track.title}
          className="w-full h-full object-cover"
          loading="lazy"
        />

        {/* Play Button Overlay */}
        <button
          className={cn(
            "absolute bottom-2 right-2 w-12 h-12 bg-[var(--accent-primary)]",
            "rounded-full flex items-center justify-center shadow-xl",
            "opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0",
            "transition-all duration-300 hover:scale-105 hover:bg-[var(--accent-hover)]"
          )}
          onClick={(e) => {
            e.stopPropagation();
            onPlay?.();
          }}
        >
          <Play className="w-6 h-6 text-black ml-0.5" fill="black" />
        </button>
      </div>

      {/* Track Info */}
      <h3 className="font-semibold truncate mb-1">{track.title}</h3>
      {showArtist && (
        <p className="text-sm text-[var(--text-secondary)] truncate">
          {track.artist}
        </p>
      )}
    </div>
  );
};

export default TrackCard;
