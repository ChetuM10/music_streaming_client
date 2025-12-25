import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Play,
  Pause,
  Clock,
  MoreHorizontal,
  Trash2,
  Music2,
  ArrowLeft,
  Shuffle,
} from "lucide-react";
import Button from "../components/common/Button";
import Loader from "../components/common/Loader";
import { EmptyPlaylist } from "../components/common/EmptyState";
import usePlayerStore from "../store/playerStore";
import api from "../lib/api";
import { formatDuration } from "../lib/utils";

const PlaylistDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [playlist, setPlaylist] = useState(null);
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { currentTrack, isPlaying, playTrack, togglePlay, setQueue } =
    usePlayerStore();

  useEffect(() => {
    fetchPlaylist();
  }, [id]);

  const fetchPlaylist = async () => {
    try {
      const response = await api.get(`/playlists/${id}`);
      setPlaylist(response.data.data);
      setTracks(response.data.data.tracks || []);
    } catch (err) {
      setError("Failed to load playlist");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePlayAll = () => {
    if (tracks.length > 0) {
      setQueue(tracks);
      playTrack(tracks[0]);
    }
  };

  const handleShufflePlay = () => {
    if (tracks.length > 0) {
      const shuffled = [...tracks].sort(() => Math.random() - 0.5);
      setQueue(shuffled);
      playTrack(shuffled[0]);
    }
  };

  const handlePlayTrack = (track, index) => {
    setQueue(tracks);
    playTrack(track, index);
  };

  const handleRemoveTrack = async (trackId) => {
    try {
      await api.delete(`/playlists/${id}/tracks/${trackId}`);
      setTracks(tracks.filter((t) => t.id !== trackId));
    } catch (err) {
      console.error("Failed to remove track:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader size="lg" />
      </div>
    );
  }

  if (error || !playlist) {
    return (
      <div className="p-6 lg:p-8">
        <button
          onClick={() => navigate("/playlists")}
          className="flex items-center gap-2 text-[var(--text-secondary)] hover:text-white mb-6"
        >
          <ArrowLeft size={20} />
          Back to Playlists
        </button>
        <p className="text-red-500">{error || "Playlist not found"}</p>
      </div>
    );
  }

  return (
    <div className="pb-32">
      {/* Header */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/50 to-[var(--bg-primary)]" />

        <div className="relative p-6 lg:p-8">
          <button
            onClick={() => navigate("/playlists")}
            className="flex items-center gap-2 text-[var(--text-secondary)] hover:text-white mb-6"
          >
            <ArrowLeft size={20} />
            Back
          </button>

          <div className="flex flex-col md:flex-row gap-6 items-start md:items-end">
            {/* Playlist Cover */}
            <div className="w-48 h-48 lg:w-56 lg:h-56 rounded-lg overflow-hidden bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center shadow-2xl flex-shrink-0">
              {playlist.cover_url ? (
                <img
                  src={playlist.cover_url}
                  alt={playlist.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Music2 size={64} className="text-white/60" />
              )}
            </div>

            {/* Playlist Info */}
            <div className="flex-1">
              <p className="text-sm font-medium text-[var(--text-secondary)] uppercase tracking-wider">
                Playlist
              </p>
              <h1 className="text-4xl lg:text-5xl font-bold mt-2 mb-4">
                {playlist.name}
              </h1>
              {playlist.description && (
                <p className="text-[var(--text-secondary)] mb-4">
                  {playlist.description}
                </p>
              )}
              <p className="text-sm text-[var(--text-secondary)]">
                {tracks.length} {tracks.length === 1 ? "song" : "songs"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="px-6 lg:px-8 py-4 flex items-center gap-4">
        <button
          onClick={handlePlayAll}
          disabled={tracks.length === 0}
          className="w-14 h-14 rounded-full bg-[var(--accent-primary)] flex items-center justify-center 
                     hover:scale-105 hover:bg-[var(--accent-hover)] transition-all disabled:opacity-50"
        >
          <Play size={28} className="text-black ml-1" fill="black" />
        </button>

        <Button
          variant="secondary"
          icon={Shuffle}
          onClick={handleShufflePlay}
          disabled={tracks.length === 0}
        >
          Shuffle
        </Button>
      </div>

      {/* Tracks List */}
      <div className="px-6 lg:px-8">
        {tracks.length === 0 ? (
          <EmptyPlaylist
            title="This playlist is empty"
            description="Add some songs to get started"
          />
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
              {tracks.map((track, index) => (
                <TrackRow
                  key={track.id}
                  track={track}
                  index={index}
                  isPlaying={currentTrack?.id === track.id && isPlaying}
                  isActive={currentTrack?.id === track.id}
                  onPlay={() => handlePlayTrack(track, index)}
                  onRemove={() => handleRemoveTrack(track.id)}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Track Row Component
const TrackRow = ({ track, index, isPlaying, isActive, onPlay, onRemove }) => {
  const [showMenu, setShowMenu] = useState(false);

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

      {/* Duration & Actions */}
      <div className="flex items-center justify-end gap-4">
        <span className="text-sm text-[var(--text-secondary)]">
          {formatDuration(track.duration)}
        </span>

        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(!showMenu);
            }}
            className="p-1 opacity-0 group-hover:opacity-100 hover:bg-white/10 rounded transition-all"
          >
            <MoreHorizontal size={18} />
          </button>

          {showMenu && (
            <div className="absolute right-0 top-8 bg-[var(--bg-elevated)] rounded-lg shadow-xl py-2 min-w-[150px] z-10">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove();
                  setShowMenu(false);
                }}
                className="flex items-center gap-2 px-4 py-2 w-full text-left text-red-500 hover:bg-white/10"
              >
                <Trash2 size={16} />
                Remove
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlaylistDetail;
