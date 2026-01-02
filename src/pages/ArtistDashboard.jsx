import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Music, Users, TrendingUp, Upload, Play, Heart } from "lucide-react";
import api from "../lib/api";
import Loader from "../components/common/Loader";
import CoverImage from "../components/common/CoverImage";

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
      <div className="max-w-2xl mx-auto px-4 py-16 text-center animate-fade-in">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center glow-teal">
          <Music className="w-10 h-10 text-black" />
        </div>
        <h1 className="text-2xl font-bold text-slate-100 mb-2">
          Become an Artist
        </h1>
        <p className="text-slate-400 mb-6">
          Share your music with the world. Register as an artist to upload
          tracks and access analytics.
        </p>
        <button
          onClick={() => navigate("/artist/register")}
          className="btn btn-primary"
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
    <div className="max-w-6xl mx-auto p-6 lg:p-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full overflow-hidden bg-gradient-to-br from-teal-500 to-cyan-500 glow-teal-sm">
            {profile.profile_image ? (
              <img
                src={profile.profile_image}
                alt={profile.artist_name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-black">
                {profile.artist_name.charAt(0)}
              </div>
            )}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-moonlight flex items-center gap-2">
              {profile.artist_name}
              {profile.verified && <span className="text-teal-400">✓</span>}
            </h1>
            <p className="text-slate-500">Artist Dashboard</p>
          </div>
        </div>
        <button
          onClick={() => navigate("/artist/upload")}
          className="btn btn-primary"
        >
          <Upload size={18} />
          Upload Track
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard
          icon={<Play className="text-teal-400" />}
          label="Total Plays"
          value={stats.total_plays.toLocaleString()}
        />
        <StatCard
          icon={<Music className="text-cyan-400" />}
          label="Tracks"
          value={stats.total_tracks}
        />
        <StatCard
          icon={<Users className="text-purple-400" />}
          label="Followers"
          value={stats.followers.toLocaleString()}
        />
        <StatCard
          icon={<Heart className="text-pink-400" />}
          label="Monthly Listeners"
          value={stats.monthly_listeners.toLocaleString()}
        />
      </div>

      {/* Tracks */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-slate-100">Your Tracks</h2>
          <button className="text-slate-500 hover:text-white text-sm">
            View All →
          </button>
        </div>

        {tracks.length === 0 ? (
          <div className="glass p-8 text-center">
            <Music className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400 mb-4">
              You haven't uploaded any tracks yet
            </p>
            <button
              onClick={() => navigate("/artist/upload")}
              className="btn btn-primary"
            >
              Upload Your First Track
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {tracks.map((track) => (
              <div key={track.id} className="card card-interactive">
                <CoverImage
                  src={track.cover_url}
                  alt={track.title}
                  title={track.title}
                  size="medium"
                  className="mb-3"
                />
                <h3 className="font-medium text-slate-100 truncate">
                  {track.title}
                </h3>
                <p className="text-sm text-slate-500">
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
  <div className="glass p-4">
    <div className="mb-2">{icon}</div>
    <p className="text-2xl font-bold text-slate-100">{value}</p>
    <p className="text-sm text-slate-500">{label}</p>
  </div>
);

export default ArtistDashboard;
