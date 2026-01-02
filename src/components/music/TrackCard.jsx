import { Play, Pause, Heart } from "lucide-react";
import CoverImage from "../common/CoverImage";
import usePlayerStore from "../../store/playerStore";

const TrackCard = ({ track, onPlay }) => {
  const { currentTrack, isPlaying, togglePlay } = usePlayerStore();
  const isCurrentTrack = currentTrack?.id === track.id;

  const handlePlay = (e) => {
    e.stopPropagation();
    if (isCurrentTrack) {
      togglePlay();
    } else {
      onPlay?.();
    }
  };

  return (
    <div className="card card-interactive group animate-fade-in">
      <div className="relative mb-3">
        <CoverImage
          src={track.cover_url}
          alt={track.title}
          title={track.title}
          size="medium"
        />
        {/* Play Button Overlay */}
        <button
          onClick={handlePlay}
          className="absolute bottom-2 right-2 btn-play btn-play-sm opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300"
        >
          {isCurrentTrack && isPlaying ? (
            <Pause className="w-5 h-5" fill="currentColor" />
          ) : (
            <Play className="w-5 h-5 ml-0.5" fill="currentColor" />
          )}
        </button>
      </div>

      <h3
        className={`font-semibold truncate mb-1 ${
          isCurrentTrack ? "text-teal-400" : "text-slate-100"
        }`}
      >
        {track.title}
      </h3>
      <p className="text-sm text-slate-400 truncate">{track.artist}</p>
    </div>
  );
};

export default TrackCard;
