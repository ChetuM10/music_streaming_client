import { useState, useEffect } from "react";
import { Mic2 } from "lucide-react";
import api from "../lib/api";
import Loader, { SkeletonCard } from "../components/common/Loader";
import PodcastCard from "../components/podcast/PodcastCard";
import { EmptyPodcasts } from "../components/common/EmptyState";

const Podcasts = () => {
  const [podcasts, setPodcasts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPodcasts = async () => {
      try {
        const response = await api.get("/podcasts");
        const data = response.data.data;
        if (Array.isArray(data)) {
          setPodcasts(data);
        } else if (data?.podcasts && Array.isArray(data.podcasts)) {
          setPodcasts(data.podcasts);
        } else {
          setPodcasts([]);
        }
      } catch (err) {
        console.error("Failed to fetch podcasts:", err);
        setPodcasts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPodcasts();
  }, []);

  return (
    <div className="p-6 lg:p-8 animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <Mic2 className="w-8 h-8 text-purple-400" />
        <h1 className="text-3xl font-bold text-moonlight">Podcasts</h1>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {[...Array(10)].map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : podcasts.length === 0 ? (
        <EmptyPodcasts />
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {podcasts.map((podcast) => (
            <PodcastCard key={podcast.id} podcast={podcast} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Podcasts;
