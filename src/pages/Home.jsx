import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Play,
  ChevronRight,
  Sparkles,
  Music,
  Headphones,
  Search,
} from "lucide-react";
import useAuthStore from "../store/authStore";
import usePlayerStore from "../store/playerStore";
import api from "../lib/api";
import TrackCard from "../components/music/TrackCard";
import PodcastCard from "../components/podcast/PodcastCard";
import CoverImage from "../components/common/CoverImage";
import { SkeletonCard } from "../components/common/Loader";
import { cn, getPlaceholderGradient } from "../lib/utils";

const Home = () => {
  const { profile } = useAuthStore();
  const { playList, currentTrack, isPlaying } = usePlayerStore();

  const [isLoading, setIsLoading] = useState(true);
  const [recentTracks, setRecentTracks] = useState([]);
  const [newReleases, setNewReleases] = useState([]);
  const [podcasts, setPodcasts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        const tracksRes = await api.get("/tracks?limit=10");
        if (tracksRes.data.success) {
          setRecentTracks(tracksRes.data.data.tracks.slice(0, 6));
          setNewReleases(tracksRes.data.data.tracks);
        }

        const podcastsRes = await api.get("/podcasts?limit=5");
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

  return (
    <div className="min-h-full pb-32">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Ambient Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#1db954]/25 via-[#1db954]/5 to-transparent" />
        <div className="absolute -top-48 -right-48 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px]" />
        <div className="absolute top-20 -left-32 w-[400px] h-[400px] bg-[#1db954]/15 rounded-full blur-[100px]" />

        <div className="relative px-6 pt-10 pb-10 lg:px-8">
          {/* Greeting */}
          <div className="max-w-4xl">
            <div className="flex items-center gap-4 mb-3">
              <h1 className="text-4xl lg:text-6xl font-bold tracking-tight">
                {getGreeting()}
              </h1>
              <Sparkles className="w-10 h-10 text-[var(--accent-primary)] animate-pulse" />
            </div>
            <p className="text-[var(--text-secondary)] text-xl mb-10">
              Welcome back,{" "}
              <span className="text-white font-semibold">
                {profile?.username || "music lover"}
              </span>
            </p>
          </div>

          {/* Quick Play Grid - Premium Cards */}
          {isLoading ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="skeleton h-20 rounded-xl" />
              ))}
            </div>
          ) : recentTracks.length > 0 ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              {recentTracks.map((track) => {
                const isActive = currentTrack?.id === track.id;
                return (
                  <button
                    key={track.id}
                    onClick={() =>
                      playList(recentTracks, recentTracks.indexOf(track))
                    }
                    className={cn(
                      "flex items-center gap-4 rounded-xl overflow-hidden transition-all duration-300 group",
                      "bg-white/[0.06] hover:bg-white/[0.12]",
                      "border border-white/[0.06] hover:border-white/[0.12]",
                      "hover:shadow-xl hover:shadow-black/30",
                      "hover:scale-[1.02] active:scale-[0.99]",
                      isActive &&
                        "bg-white/[0.12] border-[var(--accent-primary)]/40"
                    )}
                  >
                    <div className="relative w-20 h-20 flex-shrink-0">
                      <CoverImage
                        src={track.cover_url}
                        title={track.title}
                        alt={track.title}
                        size="full"
                        rounded="none"
                        className="w-20 h-20"
                      />
                      {isActive && isPlaying && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                          <div className="flex items-end gap-0.5 h-5">
                            <span className="w-1 bg-[var(--accent-primary)] rounded-full animate-music-bar-1" />
                            <span className="w-1 bg-[var(--accent-primary)] rounded-full animate-music-bar-2" />
                            <span className="w-1 bg-[var(--accent-primary)] rounded-full animate-music-bar-3" />
                          </div>
                        </div>
                      )}
                    </div>
                    <span
                      className={cn(
                        "font-semibold truncate pr-4 text-left flex-1 transition-colors",
                        isActive
                          ? "text-[var(--accent-primary)]"
                          : "group-hover:text-white"
                      )}
                    >
                      {track.title}
                    </span>
                    <div className="mr-4 w-12 h-12 bg-[var(--accent-primary)] rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 shadow-lg transition-all duration-300 transform group-hover:scale-105">
                      <Play
                        className="w-5 h-5 text-black ml-0.5"
                        fill="black"
                      />
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="empty-state-premium">
              <div className="icon-container">
                <Music className="w-10 h-10 text-[var(--accent-primary)]" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-white">
                No tracks yet
              </h3>
              <p className="text-[var(--text-secondary)] mb-6 max-w-md mx-auto">
                Start exploring to discover amazing music and build your
                collection
              </p>
              <Link
                to="/browse"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--accent-primary)] hover:bg-[var(--accent-hover)] text-black font-semibold rounded-full transition-all hover:scale-105 hover:shadow-lg hover:shadow-[var(--accent-primary)]/30"
              >
                <Sparkles className="w-4 h-4" />
                Start Exploring
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Content Sections */}
      <div className="px-6 lg:px-8 py-8 space-y-14">
        {/* New Releases */}
        <section className="animate-fade-in-up">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl lg:text-3xl font-bold mb-1">
                New Releases
              </h2>
              <p className="text-sm text-[var(--text-secondary)]">
                Fresh tracks just for you
              </p>
            </div>
            <Link
              to="/browse"
              className="flex items-center gap-1 px-4 py-2 rounded-full text-sm text-[var(--text-secondary)] hover:text-white hover:bg-white/5 font-medium transition-all"
            >
              Show all <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
              {[...Array(5)].map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : newReleases.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
              {newReleases.slice(0, 10).map((track, index) => (
                <TrackCard
                  key={track.id}
                  track={track}
                  onPlay={() => playList(newReleases, index)}
                />
              ))}
            </div>
          ) : (
            <div className="empty-state-premium">
              <div className="icon-container">
                <Music className="w-10 h-10 text-[var(--accent-primary)]" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-white">
                No tracks available
              </h3>
              <p className="text-[var(--text-secondary)] mb-6">
                Fresh music is on the way! Check back soon for new releases.
              </p>
              <Link
                to="/search"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/15 text-white font-medium rounded-full transition-all hover:scale-105 border border-white/10"
              >
                <Search className="w-4 h-4" />
                Search Music
              </Link>
            </div>
          )}
        </section>

        {/* Podcasts */}
        <section
          className="animate-fade-in-up"
          style={{ animationDelay: "0.1s" }}
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl lg:text-3xl font-bold mb-1">
                Popular Podcasts
              </h2>
              <p className="text-sm text-[var(--text-secondary)]">
                Discover amazing shows
              </p>
            </div>
            <Link
              to="/podcasts"
              className="flex items-center gap-1 px-4 py-2 rounded-full text-sm text-[var(--text-secondary)] hover:text-white hover:bg-white/5 font-medium transition-all"
            >
              Show all <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
              {[...Array(5)].map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : podcasts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
              {podcasts.map((podcast) => (
                <PodcastCard key={podcast.id} podcast={podcast} />
              ))}
            </div>
          ) : (
            <div className="empty-state-premium">
              <div
                className="icon-container"
                style={{
                  background:
                    "linear-gradient(145deg, rgba(139, 92, 246, 0.15) 0%, rgba(139, 92, 246, 0.05) 100%)",
                }}
              >
                <Headphones className="w-10 h-10 text-[var(--purple-accent)]" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-white">
                No podcasts yet
              </h3>
              <p className="text-[var(--text-secondary)] mb-6">
                Amazing shows are coming soon. Stay tuned for updates!
              </p>
              <Link
                to="/search"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--purple-accent)] hover:opacity-90 text-white font-semibold rounded-full transition-all hover:scale-105 hover:shadow-lg hover:shadow-[var(--purple-accent)]/30"
              >
                <Sparkles className="w-4 h-4" />
                Discover More
              </Link>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Home;
