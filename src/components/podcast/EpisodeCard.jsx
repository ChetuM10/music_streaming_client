import { Play, Clock } from "lucide-react";
import { formatDuration, getPlaceholderCover, cn } from "../../lib/utils";
import usePlayerStore from "../../store/playerStore";

const EpisodeCard = ({ episode, podcast }) => {
  const { play, currentTrack, isPlaying } = usePlayerStore();

  const isCurrentEpisode = currentTrack?.id === episode.id;

  const handlePlay = () => {
    // Pass podcast info with episode for display
    play(
      {
        ...episode,
        podcasts: podcast,
      },
      "episode"
    );
  };

  return (
    <div
      className={cn(
        "group p-4 rounded-lg hover:bg-[var(--bg-tertiary)] transition-colors cursor-pointer",
        isCurrentEpisode && "bg-[var(--bg-tertiary)]"
      )}
      onClick={handlePlay}
    >
      <div className="flex gap-4">
        {/* Episode Cover */}
        <div className="w-28 h-28 flex-shrink-0 rounded-lg overflow-hidden">
          <img
            src={podcast?.cover_url || getPlaceholderCover(episode.title)}
            alt={episode.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Episode Info */}
        <div className="flex-1 min-w-0">
          <h4
            className={cn(
              "font-semibold mb-1 line-clamp-2",
              isCurrentEpisode && "text-[var(--accent-primary)]"
            )}
          >
            Episode {episode.episode_number}: {episode.title}
          </h4>

          {episode.description && (
            <p className="text-sm text-[var(--text-secondary)] line-clamp-2 mb-3">
              {episode.description}
            </p>
          )}

          <div className="flex items-center gap-4">
            <button
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center transition-colors",
                isCurrentEpisode && isPlaying
                  ? "bg-[var(--accent-primary)] text-black"
                  : "bg-[var(--bg-elevated)] hover:bg-white/20"
              )}
              onClick={(e) => {
                e.stopPropagation();
                handlePlay();
              }}
            >
              <Play className="w-4 h-4 ml-0.5" fill="currentColor" />
            </button>

            {episode.duration && (
              <span className="flex items-center gap-1.5 text-sm text-[var(--text-muted)]">
                <Clock className="w-4 h-4" />
                {formatDuration(episode.duration)}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EpisodeCard;
