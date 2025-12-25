import { useState, useEffect } from "react";
import { Play, Pause, Clock, Heart, Shuffle } from "lucide-react";
import Button from "../components/common/Button";
import { Loader, SkeletonCard } from "../components/common/Loader";
import { EmptyFavorites } from "../components/common/EmptyState";
import usePlayerStore from "../store/playerStore";
import api from "../lib/api";
import { formatDuration } from "../lib/utils";

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  const { currentTrack, isPlaying, playTrack, togglePlay, setQueue } =
    usePlayerStore();

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      const response = await api.get("/favorites");
      setFavorites(response.data.data || []);
    } catch (err) {
      console.error("Failed to fetch favorites:", err);
    } finally {
      setLoading(false);
    }
  };

  const handlePlayAll = () => {
    if (favorites.length > 0) {
      const tracks = favorites.map((f) => f.track);
      setQueue(tracks);
      playTrack(tracks[0]);
    }
  };

  const handleShufflePlay = () => {
    if (favorites.length > 0) {
      const tracks = favorites.map((f) => f.track);
      const shuffled = [...tracks].sort(() => Math.random() - 0.5);
      setQueue(shuffled);
      playTrack(shuffled[0]);
    }
  };

  const handlePlayTrack = (track, index) => {
    const tracks = favorites.map((f) => f.track);
    setQueue(tracks);
    playTrack(track, index);
  };

  const handleUnlike = async (trackId) => {
    try {
      await api.delete(`/favorites/${trackId}`);
      setFavorites(favorites.filter((f) => f.track_id !== trackId));
    } catch (err) {
      console.error("Failed to remove from favorites:", err);
    }
  };

  if (loading) {
    return (
      <div className="p-6 lg:p-8">
        <div className="flex items-center gap-6 mb-8">
          <div className="w-48 h-48 rounded-lg bg-gradient-to-br from-purple-700 to-blue-400 flex items-center justify-center">
            <Heart size={64} className="text-white" fill="white" />
          </div>
          <div>
            <p className="text-sm text-[var(--text-secondary)] uppercase">
              Playlist
            </p>
            <h1 className="text-4xl font-bold">Liked Songs</h1>
          </div>
        </div>
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="h-16 bg-white/5 rounded animate-pulse"
            ></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="pb-32">
      {/* Header */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/50 to-[var(--bg-primary)]" />

        <div className="relative p-6 lg:p-8">
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-end">
            {/* Cover */}
            <div className="w-48 h-48 lg:w-56 lg:h-56 rounded-lg bg-gradient-to-br from-purple-700 to-blue-400 flex items-center justify-center shadow-2xl flex-shrink-0">
              <Heart size={64} className="text-white" fill="white" />
            </div>

            {/* Info */}
            <div className="flex-1">
              <p className="text-sm font-medium text-[var(--text-secondary)] uppercase tracking-wider">
                Playlist
              </p>
              <h1 className="text-4xl lg:text-5xl font-bold mt-2 mb-4">
                Liked Songs
              </h1>
              <p className="text-sm text-[var(--text-secondary)]">
                {favorites.length} {favorites.length === 1 ? "song" : "songs"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="px-6 lg:px-8 py-4 flex items-center gap-4">
        <button
          onClick={handlePlayAll}
          disabled={favorites.length === 0}
          className="w-14 h-14 rounded-full bg-[var(--accent-primary)] flex items-center justify-center 
                     hover:scale-105 hover:bg-[var(--accent-hover)] transition-all disabled:opacity-50"
        >
          <Play size={28} className="text-black ml-1" fill="black" />
        </button>

        <Button
          variant="secondary"
          icon={Shuffle}
          onClick={handleShufflePlay}
          disabled={favorites.length === 0}
        >
          Shuffle
        </Button>
      </div>

      {/* Tracks List */}
      <div className="px-6 lg:px-8">
        {favorites.length === 0 ? (
          <EmptyFavorites />
        ) : (
          <div className="mt-4">
            {/* Header */}
            <div className="grid grid-cols-[16px_4fr_1fr_minmax(80px,1fr)] gap-4 px-4 py-2 text-[var(--text-secondary)] text-sm border-b border-white/10">
              <span>#</span>
              <span>Title</span>
              <span className="hidden md:block">Album</span>
              <span className="flex justify-end">
                <Clock size={16} />
              </span>
            </div>

            {/* Track Rows */}
            <div className="mt-2">
              {favorites.map((fav, index) => (
                <FavoriteRow
                  key={fav.id}
                  track={fav.track}
                  index={index}
                  isPlaying={currentTrack?.id === fav.track?.id && isPlaying}
                  isActive={currentTrack?.id === fav.track?.id}
                  onPlay={() => handlePlayTrack(fav.track, index)}
                  onUnlike={() => handleUnlike(fav.track_id)}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Favorite Row Component
const FavoriteRow = ({
  track,
  index,
  isPlaying,
  isActive,
  onPlay,
  onUnlike,
}) => {
  if (!track) return null;

  return (
    <div
      className={`group grid grid-cols-[16px_4fr_1fr_minmax(80px,1fr)] gap-4 px-4 py-3 rounded-md 
                  hover:bg-white/10 transition-colors cursor-pointer
                  ${isActive ? "bg-white/5" : ""}`}
      onClick={onPlay}
    >
      {/* Number / Play button */}
      <div className="flex items-center">
        <span
          className={`group-hover:hidden ${
            isActive
              ? "text-[var(--accent-primary)]"
              : "text-[var(--text-secondary)]"
          }`}
        >
          {isPlaying ? (
            <div className="w-4 flex items-end justify-center gap-0.5 h-4">
              <span className="w-1 bg-[var(--accent-primary)] animate-music-bar-1" />
              <span className="w-1 bg-[var(--accent-primary)] animate-music-bar-2" />
              <span className="w-1 bg-[var(--accent-primary)] animate-music-bar-3" />
            </div>
          ) : (
            index + 1
          )}
        </span>
        <button className="hidden group-hover:block">
          {isPlaying ? <Pause size={16} /> : <Play size={16} fill="white" />}
        </button>
      </div>

      {/* Track Info */}
      <div className="flex items-center gap-3 min-w-0">
        <img
          src={
            track.cover_url ||
            `https://ui-avatars.com/api/?name=${encodeURIComponent(
              track.title
            )}&background=333&color=fff&size=40`
          }
          alt={track.title}
          className="w-10 h-10 rounded object-cover"
        />
        <div className="min-w-0">
          <p
            className={`font-medium truncate ${
              isActive ? "text-[var(--accent-primary)]" : ""
            }`}
          >
            {track.title}
          </p>
          <p className="text-sm text-[var(--text-secondary)] truncate">
            {track.artist}
          </p>
        </div>
      </div>

      {/* Album */}
      <span className="hidden md:flex items-center text-[var(--text-secondary)] text-sm truncate">
        {track.album || "-"}
      </span>

      {/* Duration & Unlike */}
      <div className="flex items-center justify-end gap-4">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onUnlike();
          }}
          className="p-1 text-[var(--accent-primary)] hover:scale-110 transition-transform"
        >
          <Heart size={18} fill="currentColor" />
        </button>
        <span className="text-sm text-[var(--text-secondary)]">
          {formatDuration(track.duration)}
        </span>
      </div>
    </div>
  );
};

export default Favorites;
