import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Play, ChevronRight } from "lucide-react";
import useAuthStore from "../store/authStore";
import usePlayerStore from "../store/playerStore";
import api from "../lib/api";
import TrackCard from "../components/music/TrackCard";
import PodcastCard from "../components/podcast/PodcastCard";
import Loader, { SkeletonCard } from "../components/common/Loader";
import { cn } from "../lib/utils";

const Home = () => {
  const { profile } = useAuthStore();
  const { playList } = usePlayerStore();

  const [isLoading, setIsLoading] = useState(true);
  const [recentTracks, setRecentTracks] = useState([]);
  const [newReleases, setNewReleases] = useState([]);
  const [podcasts, setPodcasts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        // Fetch tracks
        const tracksRes = await api.get("/tracks?limit=8");
        if (tracksRes.data.success) {
          setRecentTracks(tracksRes.data.data.tracks.slice(0, 4));
          setNewReleases(tracksRes.data.data.tracks);
        }

        // Fetch podcasts
        const podcastsRes = await api.get("/podcasts?limit=4");
        if (podcastsRes.data.success) {
          setPodcasts(podcastsRes.data.data.podcasts);
        }
      } catch (error) {
        console.error("Failed to fetch home data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const handlePlayAll = () => {
    if (newReleases.length > 0) {
      playList(newReleases, 0);
    }
  };

  return (
    <div className="min-h-full">
      {/* Hero Section */}
      <div
        className="relative px-6 pt-8 pb-6 lg:px-8"
        style={{
          background:
            "linear-gradient(to bottom, rgba(29, 185, 84, 0.3), var(--bg-primary))",
        }}
      >
        <h1 className="text-3xl lg:text-4xl font-bold mb-6">
          {getGreeting()}, {profile?.username || "there"}!
        </h1>

        {/* Quick Play Grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="skeleton h-16 rounded-lg" />
            ))}
          </div>
        ) : recentTracks.length > 0 ? (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
            {recentTracks.map((track) => (
              <button
                key={track.id}
                onClick={() =>
                  playList(recentTracks, recentTracks.indexOf(track))
                }
                className={cn(
                  "flex items-center gap-4 bg-white/10 hover:bg-white/20",
                  "rounded-lg overflow-hidden transition-colors group"
                )}
              >
                <img
                  src={
                    track.cover_url ||
                    `https://ui-avatars.com/api/?name=${track.title[0]}&background=1DB954&color=fff&size=64`
                  }
                  alt={track.title}
                  className="w-16 h-16 object-cover"
                />
                <span className="font-semibold truncate pr-4">
                  {track.title}
                </span>
                <div className="ml-auto mr-4 w-10 h-10 bg-[var(--accent-primary)] rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 shadow-lg transition-all">
                  <Play className="w-5 h-5 text-black ml-0.5" fill="black" />
                </div>
              </button>
            ))}
          </div>
        ) : null}
      </div>

      {/* Content Sections */}
      <div className="px-6 lg:px-8 py-6 space-y-10">
        {/* New Releases */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">New Releases</h2>
            <Link
              to="/browse"
              className="flex items-center gap-1 text-sm text-[var(--text-secondary)] hover:text-white font-medium transition-colors"
            >
              Show all <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {[...Array(5)].map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {newReleases.map((track, index) => (
                <TrackCard
                  key={track.id}
                  track={track}
                  onPlay={() => playList(newReleases, index)}
                />
              ))}
            </div>
          )}
        </section>

        {/* Podcasts */}
        {podcasts.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">Popular Podcasts</h2>
              <Link
                to="/podcasts"
                className="flex items-center gap-1 text-sm text-[var(--text-secondary)] hover:text-white font-medium transition-colors"
              >
                Show all <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {podcasts.map((podcast) => (
                <PodcastCard key={podcast.id} podcast={podcast} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default Home;
