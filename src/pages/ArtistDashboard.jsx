import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  BarChart3,
  Music,
  Users,
  TrendingUp,
  Upload,
  Settings,
  Play,
  Heart,
} from "lucide-react";
import api from "../lib/api";
import Loader from "../components/common/Loader";
import CoverImage from "../components/common/CoverImage";

/**
 * Artist Dashboard
 *
 * Multi-tenancy: Artists can view analytics and upload music
 */
const ArtistDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [dashboard, setDashboard] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const response = await api.get("/artist/dashboard");
      setDashboard(response.data.data);
    } catch (err) {
      if (err.response?.status === 404) {
        setError("not_artist");
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader size="lg" />
      </div>
    );
  }

  if (error === "not_artist") {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <Music className="w-16 h-16 text-[var(--accent-primary)] mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-white mb-2">Become an Artist</h1>
        <p className="text-[var(--text-secondary)] mb-6">
          Share your music with the world. Register as an artist to upload
          tracks and access analytics.
        </p>
        <button
          onClick={() => navigate("/artist/register")}
          className="px-6 py-3 bg-[var(--accent-primary)] text-black rounded-full font-semibold hover:scale-105 transition-transform"
        >
          Register as Artist
        </button>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-16 text-red-400">
        Error loading dashboard: {error}
      </div>
    );
  }

  const { profile, stats, tracks } = dashboard;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full overflow-hidden bg-[var(--bg-tertiary)]">
            {profile.profile_image ? (
              <img
                src={profile.profile_image}
                alt={profile.artist_name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-[var(--accent-primary)]">
                {profile.artist_name.charAt(0)}
              </div>
            )}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              {profile.artist_name}
              {profile.verified && (
                <span className="text-[var(--accent-primary)]">✓</span>
              )}
            </h1>
            <p className="text-[var(--text-secondary)]">Artist Dashboard</p>
          </div>
        </div>
        <button
          onClick={() => navigate("/artist/upload")}
          className="flex items-center gap-2 px-4 py-2 bg-[var(--accent-primary)] text-black rounded-full font-medium hover:scale-105 transition-transform"
        >
          <Upload size={18} />
          Upload Track
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard
          icon={<Play size={24} />}
          label="Total Plays"
          value={stats.total_plays.toLocaleString()}
        />
        <StatCard
          icon={<Music size={24} />}
          label="Tracks"
          value={stats.total_tracks}
        />
        <StatCard
          icon={<Users size={24} />}
          label="Followers"
          value={stats.followers.toLocaleString()}
        />
        <StatCard
          icon={<Heart size={24} />}
          label="Monthly Listeners"
          value={stats.monthly_listeners.toLocaleString()}
        />
      </div>

      {/* Tracks */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white">Your Tracks</h2>
          <button className="text-[var(--text-secondary)] hover:text-white text-sm">
            View All →
          </button>
        </div>

        {tracks.length === 0 ? (
          <div className="bg-[var(--bg-secondary)] rounded-xl p-8 text-center">
            <Music className="w-12 h-12 text-[var(--text-muted)] mx-auto mb-3" />
            <p className="text-[var(--text-secondary)] mb-4">
              You haven't uploaded any tracks yet
            </p>
            <button
              onClick={() => navigate("/artist/upload")}
              className="px-4 py-2 bg-[var(--accent-primary)] text-black rounded-lg font-medium"
            >
              Upload Your First Track
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {tracks.map((track) => (
              <div
                key={track.id}
                className="bg-[var(--bg-secondary)] rounded-lg p-4 hover:bg-[var(--bg-tertiary)] transition-colors"
              >
                <CoverImage
                  src={track.cover_url}
                  alt={track.title}
                  title={track.title}
                  size="medium"
                  className="mb-3"
                />
                <h3 className="font-medium text-white truncate">
                  {track.title}
                </h3>
                <p className="text-sm text-[var(--text-secondary)]">
                  {(track.play_count || 0).toLocaleString()} plays
                </p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

const StatCard = ({ icon, label, value }) => (
  <div className="bg-[var(--bg-secondary)] rounded-xl p-4">
    <div className="text-[var(--accent-primary)] mb-2">{icon}</div>
    <p className="text-2xl font-bold text-white">{value}</p>
    <p className="text-sm text-[var(--text-secondary)]">{label}</p>
  </div>
);

export default ArtistDashboard;
