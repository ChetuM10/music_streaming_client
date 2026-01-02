import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Play, ChevronRight, Sparkles, TrendingUp, Clock } from "lucide-react";
import api from "../lib/api";
import usePlayerStore from "../store/playerStore";
import useAuthStore from "../store/authStore";
import TrackCard from "../components/music/TrackCard";
import PodcastCard from "../components/podcast/PodcastCard";
import Loader, { SkeletonCard } from "../components/common/Loader";
import { EmptyTracks } from "../components/common/EmptyState";

const Home = () => {
  const { playList } = usePlayerStore();
  const { user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState({
    recentTracks: [],
    popularTracks: [],
    newReleases: [],
    podcasts: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        const [recentRes, popularRes, newRes, podcastsRes] = await Promise.all([
          api.get("/tracks?limit=6&sort=created_at"),
          api.get("/tracks?limit=6&sort=play_count"),
          api.get("/tracks?limit=6"),
          api.get("/podcasts?limit=6"),
        ]);

        setData({
          recentTracks: recentRes.data.data?.tracks || [],
          popularTracks: popularRes.data.data?.tracks || [],
          newReleases: newRes.data.data?.tracks || [],
          podcasts: podcastsRes.data.data?.podcasts || [],
        });
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
    <div className="p-6 lg:p-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-moonlight mb-1">
            {getGreeting()}, {user?.username || "there"}
          </h1>
          <p className="text-slate-400">
            Discover your next favorite track in the midnight forest
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-10">
          {[...Array(3)].map((_, i) => (
            <div key={i}>
              <div className="skeleton h-6 w-40 mb-4 rounded" />
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                {[...Array(6)].map((_, j) => (
                  <SkeletonCard key={j} />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-10">
          {/* Popular Tracks */}
          {data.popularTracks.length > 0 && (
            <Section
              title="Popular Right Now"
              icon={<TrendingUp className="w-5 h-5 text-teal-400" />}
              linkTo="/browse"
            >
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                {data.popularTracks.map((track, index) => (
                  <TrackCard
                    key={track.id}
                    track={track}
                    onPlay={() => playList(data.popularTracks, index)}
                  />
                ))}
              </div>
            </Section>
          )}

          {/* New Releases */}
          {data.newReleases.length > 0 && (
            <Section
              title="New Releases"
              icon={<Sparkles className="w-5 h-5 text-cyan-400" />}
              linkTo="/browse"
            >
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                {data.newReleases.map((track, index) => (
                  <TrackCard
                    key={track.id}
                    track={track}
                    onPlay={() => playList(data.newReleases, index)}
                  />
                ))}
              </div>
            </Section>
          )}

          {/* Recent Tracks */}
          {data.recentTracks.length > 0 && (
            <Section
              title="Recently Added"
              icon={<Clock className="w-5 h-5 text-purple-400" />}
              linkTo="/recently-played"
            >
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                {data.recentTracks.map((track, index) => (
                  <TrackCard
                    key={track.id}
                    track={track}
                    onPlay={() => playList(data.recentTracks, index)}
                  />
                ))}
              </div>
            </Section>
          )}

          {/* Podcasts */}
          {data.podcasts.length > 0 && (
            <Section title="Podcasts" linkTo="/podcasts">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                {data.podcasts.map((podcast) => (
                  <PodcastCard key={podcast.id} podcast={podcast} />
                ))}
              </div>
            </Section>
          )}

          {/* Empty State */}
          {data.popularTracks.length === 0 &&
            data.newReleases.length === 0 &&
            data.recentTracks.length === 0 && <EmptyTracks />}
        </div>
      )}
    </div>
  );
};

const Section = ({ title, icon, linkTo, children }) => (
  <section className="animate-fade-in-up">
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        {icon}
        <h2 className="text-xl font-bold text-slate-100">{title}</h2>
      </div>
      {linkTo && (
        <Link
          to={linkTo}
          className="flex items-center gap-1 text-sm text-slate-400 hover:text-teal-400 transition-colors"
        >
          See all
          <ChevronRight className="w-4 h-4" />
        </Link>
      )}
    </div>
    {children}
  </section>
);

export default Home;
