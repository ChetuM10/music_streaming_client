import { Play, Pause, Clock } from "lucide-react";
import usePlayerStore from "../../store/playerStore";
import { formatDuration } from "../../lib/utils";

const EpisodeCard = ({ episode, podcast }) => {
  const { currentTrack, isPlaying, playTrack, togglePlay } = usePlayerStore();

  const isCurrentEpisode = currentTrack?.id === episode.id;

  const handlePlay = () => {
    if (isCurrentEpisode) {
      togglePlay();
    } else {
      // Handle both camelCase (external API) and snake_case (internal API)
      const audioUrl = episode.audioUrl || episode.audio_url;
      const coverUrl = podcast?.cover_url || episode.image || episode.cover_url;

      if (!audioUrl) {
        console.error("No audio URL found for episode:", episode);
        return;
      }

      playTrack({
        id: episode.id,
        title: episode.title,
        artist: podcast?.host || podcast?.title || "Podcast",
        cover_url: coverUrl,
        audio_url: audioUrl,
        duration: episode.duration,
      });
    }
  };

  return (
    <div
      className={`glass-subtle p-4 rounded-xl cursor-pointer transition-all hover:bg-slate-800/60 group ${
        isCurrentEpisode ? "border border-teal-500/30" : ""
      }`}
      onClick={handlePlay}
    >
      <div className="flex gap-4">
        {/* Play Button */}
        <button className="flex-shrink-0 btn-play btn-play-sm">
          {isCurrentEpisode && isPlaying ? (
            <Pause className="w-5 h-5" fill="currentColor" />
          ) : (
            <Play className="w-5 h-5 ml-0.5" fill="currentColor" />
          )}
        </button>

        {/* Episode Info */}
        <div className="flex-1 min-w-0">
          <h4
            className={`font-medium truncate mb-1 ${
              isCurrentEpisode ? "text-teal-400" : "text-slate-100"
            }`}
          >
            {episode.title}
          </h4>
          {episode.description && (
            <p className="text-sm text-slate-400 line-clamp-2 mb-2">
              {episode.description}
            </p>
          )}
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Clock className="w-3 h-3" />
            <span>{formatDuration(episode.duration)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EpisodeCard;
