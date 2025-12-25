import { useState, useEffect } from "react";
import { Play, Pause, Clock, History, Shuffle } from "lucide-react";
import Button from "../components/common/Button";
import Loader from "../components/common/Loader";
import { EmptyHistory } from "../components/common/EmptyState";
import usePlayerStore from "../store/playerStore";
import api from "../lib/api";
import { formatDuration, formatRelativeTime } from "../lib/utils";

const RecentlyPlayed = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const { currentTrack, isPlaying, playTrack, setQueue } = usePlayerStore();

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const response = await api.get("/history");
      setHistory(response.data.data || []);
    } catch (err) {
      console.error("Failed to fetch history:", err);
    } finally {
      setLoading(false);
    }
  };

  const handlePlayAll = () => {
    const tracks = history.map((h) => h.track).filter(Boolean);
    if (tracks.length > 0) {
      setQueue(tracks);
      playTrack(tracks[0]);
    }
  };

  const handleShufflePlay = () => {
    const tracks = history.map((h) => h.track).filter(Boolean);
    if (tracks.length > 0) {
      const shuffled = [...tracks].sort(() => Math.random() - 0.5);
      setQueue(shuffled);
      playTrack(shuffled[0]);
    }
  };

  const handlePlayTrack = (track, index) => {
    const tracks = history.map((h) => h.track).filter(Boolean);
    setQueue(tracks);
    playTrack(track, index);
  };

  if (loading) {
    return (
      <div className="p-6 lg:p-8">
        <div className="flex items-center gap-6 mb-8">
          <div className="w-48 h-48 rounded-lg bg-gradient-to-br from-green-600 to-teal-400 flex items-center justify-center">
            <History size={64} className="text-white" />
          </div>
          <div>
            <p className="text-sm text-[var(--text-secondary)] uppercase">
              Your Activity
            </p>
            <h1 className="text-4xl font-bold">Recently Played</h1>
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
        <div className="absolute inset-0 bg-gradient-to-b from-green-900/50 to-[var(--bg-primary)]" />

        <div className="relative p-6 lg:p-8">
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-end">
            {/* Cover */}
            <div className="w-48 h-48 lg:w-56 lg:h-56 rounded-lg bg-gradient-to-br from-green-600 to-teal-400 flex items-center justify-center shadow-2xl flex-shrink-0">
              <History size={64} className="text-white" />
            </div>

            {/* Info */}
            <div className="flex-1">
              <p className="text-sm font-medium text-[var(--text-secondary)] uppercase tracking-wider">
                Your Activity
              </p>
              <h1 className="text-4xl lg:text-5xl font-bold mt-2 mb-4">
                Recently Played
              </h1>
              <p className="text-sm text-[var(--text-secondary)]">
                {history.length} {history.length === 1 ? "song" : "songs"} in
                your history
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="px-6 lg:px-8 py-4 flex items-center gap-4">
        <button
          onClick={handlePlayAll}
          disabled={history.length === 0}
          className="w-14 h-14 rounded-full bg-[var(--accent-primary)] flex items-center justify-center 
                     hover:scale-105 hover:bg-[var(--accent-hover)] transition-all disabled:opacity-50"
        >
          <Play size={28} className="text-black ml-1" fill="black" />
        </button>

        <Button
          variant="secondary"
          icon={Shuffle}
          onClick={handleShufflePlay}
          disabled={history.length === 0}
        >
          Shuffle
        </Button>
      </div>

      {/* Tracks List */}
      <div className="px-6 lg:px-8">
        {history.length === 0 ? (
          <EmptyHistory />
        ) : (
          <div className="mt-4">
            {/* Header */}
            <div className="grid grid-cols-[16px_4fr_2fr_minmax(80px,1fr)] gap-4 px-4 py-2 text-[var(--text-secondary)] text-sm border-b border-white/10">
              <span>#</span>
              <span>Title</span>
              <span className="hidden md:block">Played</span>
              <span className="flex justify-end">
                <Clock size={16} />
              </span>
            </div>

            {/* Track Rows */}
            <div className="mt-2">
              {history.map((item, index) => (
                <HistoryRow
                  key={item.id}
                  item={item}
                  index={index}
                  isPlaying={currentTrack?.id === item.track?.id && isPlaying}
                  isActive={currentTrack?.id === item.track?.id}
                  onPlay={() => handlePlayTrack(item.track, index)}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// History Row Component
const HistoryRow = ({ item, index, isPlaying, isActive, onPlay }) => {
  const track = item.track;
  if (!track) return null;

  return (
    <div
      className={`group grid grid-cols-[16px_4fr_2fr_minmax(80px,1fr)] gap-4 px-4 py-3 rounded-md 
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

      {/* Played Time */}
      <span className="hidden md:flex items-center text-[var(--text-secondary)] text-sm">
        {formatRelativeTime(item.played_at)}
      </span>

      {/* Duration */}
      <div className="flex items-center justify-end">
        <span className="text-sm text-[var(--text-secondary)]">
          {formatDuration(track.duration)}
        </span>
      </div>
    </div>
  );
};

export default RecentlyPlayed;
