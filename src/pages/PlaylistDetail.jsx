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
      <div className="p-6 lg:p-8 flex items-center justify-center min-h-[400px]">
        <Loader size="lg" />
      </div>
    );
  }

  if (error || !playlist) {
    return (
      <div className="p-6 lg:p-8 text-center">
        <button
          onClick={() => navigate("/playlists")}
          className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-6"
        >
          <ArrowLeft size={20} />
          Back to Playlists
        </button>
        <p className="text-slate-400">{error || "Playlist not found"}</p>
      </div>
    );
  }

  return (
    <div className="pb-32 animate-fade-in">
      {/* Header */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-cyan-900/30 to-transparent pointer-events-none" />

        <div className="relative p-6 lg:p-8">
          <button
            onClick={() => navigate("/playlists")}
            className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-4"
          >
            <ArrowLeft size={20} />
            Back
          </button>

          <div className="flex flex-col md:flex-row gap-6 items-start md:items-end">
            {/* Playlist Cover */}
            <div className="w-48 h-48 lg:w-56 lg:h-56 rounded-xl overflow-hidden bg-gradient-to-br from-purple-600 to-cyan-500 flex items-center justify-center shadow-2xl flex-shrink-0 glow-teal">
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
              <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">
                Playlist
              </p>
              <h1 className="text-4xl lg:text-5xl font-bold mt-2 mb-2 text-moonlight">
                {playlist.name}
              </h1>
              {playlist.description && (
                <p className="text-slate-400 mb-2">{playlist.description}</p>
              )}
              <p className="text-sm text-slate-500">
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
          className="btn-play btn-play-lg glow-teal disabled:opacity-50"
        >
          <Play size={28} className="ml-1" fill="currentColor" />
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
            <div className="grid grid-cols-[16px_4fr_2fr_minmax(80px,1fr)] gap-4 px-4 py-2 text-slate-500 text-sm border-b border-slate-800">
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
      className={`group grid grid-cols-[16px_4fr_2fr_minmax(80px,1fr)] gap-4 px-4 py-3 rounded-lg 
                  hover:bg-slate-800/50 transition-colors cursor-pointer
                  ${isActive ? "bg-slate-800/30" : ""}`}
      onClick={onPlay}
    >
      {/* Number / Play button */}
      <div className="flex items-center">
        <span
          className={`group-hover:hidden ${
            isActive ? "text-teal-400" : "text-slate-500"
          }`}
        >
          {isPlaying ? (
            <div className="w-4 flex items-end justify-center gap-0.5 h-4">
              <span className="music-bar music-bar-1" />
              <span className="music-bar music-bar-2" />
              <span className="music-bar music-bar-3" />
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
            )}&background=1e293b&color=2dd4bf&size=40`
          }
          alt={track.title}
          className="w-10 h-10 rounded object-cover"
        />
        <div className="min-w-0">
          <p
            className={`font-medium truncate ${
              isActive ? "text-teal-400" : "text-slate-100"
            }`}
          >
            {track.title}
          </p>
          <p className="text-sm text-slate-400 truncate">{track.artist}</p>
        </div>
      </div>

      {/* Album */}
      <span className="hidden md:flex items-center text-slate-500 text-sm truncate">
        {track.album || "-"}
      </span>

      {/* Duration & Actions */}
      <div className="flex items-center justify-end gap-2">
        <span className="text-sm text-slate-500 mr-2">
          {formatDuration(track.duration)}
        </span>

        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(!showMenu);
            }}
            className="p-1 text-slate-500 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <MoreHorizontal size={18} />
          </button>

          {showMenu && (
            <div className="absolute right-0 top-full mt-1 glass p-2 rounded-lg min-w-[150px] z-10 animate-fade-in">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove();
                  setShowMenu(false);
                }}
                className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded transition-colors"
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
