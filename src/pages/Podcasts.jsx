import { useState, useEffect } from "react";
import api from "../lib/api";
import PodcastCard from "../components/podcast/PodcastCard";
import Loader, { SkeletonCard } from "../components/common/Loader";
import { EmptyPodcasts } from "../components/common/EmptyState";

const Podcasts = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [podcasts, setPodcasts] = useState([]);

  useEffect(() => {
    const fetchPodcasts = async () => {
      try {
        setIsLoading(true);
        const res = await api.get("/podcasts");
        if (res.data.success) {
          setPodcasts(res.data.data.podcasts);
        }
      } catch (error) {
        console.error("Failed to fetch podcasts:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPodcasts();
  }, []);

  return (
    <div className="p-6 lg:p-8">
      <h1 className="text-3xl font-bold mb-6">Podcasts</h1>

      {isLoading ? (
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
