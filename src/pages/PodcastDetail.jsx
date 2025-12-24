import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../lib/api";
import EpisodeCard from "../components/podcast/EpisodeCard";
import Loader from "../components/common/Loader";
import { getPlaceholderCover } from "../lib/utils";

const PodcastDetail = () => {
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [podcast, setPodcast] = useState(null);

  useEffect(() => {
    const fetchPodcast = async () => {
      try {
        setIsLoading(true);
        const res = await api.get(`/podcasts/${id}`);
        if (res.data.success) {
          setPodcast(res.data.data.podcast);
        }
      } catch (error) {
        console.error("Failed to fetch podcast:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchPodcast();
    }
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader size="lg" />
      </div>
    );
  }

  if (!podcast) {
    return (
      <div className="p-6 text-center">
        <p className="text-[var(--text-secondary)]">Podcast not found</p>
      </div>
    );
  }

  const coverUrl = podcast.cover_url || getPlaceholderCover(podcast.title);

  return (
    <div>
      {/* Header */}
      <div
        className="relative p-6 lg:p-8"
        style={{
          background:
            "linear-gradient(to bottom, rgba(29, 185, 84, 0.4), var(--bg-primary))",
        }}
      >
        <div className="flex flex-col md:flex-row gap-6">
          <img
            src={coverUrl}
            alt={podcast.title}
            className="w-48 h-48 md:w-56 md:h-56 rounded-lg shadow-2xl object-cover"
          />

          <div className="flex flex-col justify-end">
            <span className="text-sm font-medium uppercase">Podcast</span>
            <h1 className="text-4xl lg:text-5xl font-bold mt-2 mb-4">
              {podcast.title}
            </h1>
            <p className="text-[var(--text-secondary)] mb-2">{podcast.host}</p>
            {podcast.description && (
              <p className="text-sm text-[var(--text-muted)] max-w-2xl line-clamp-2">
                {podcast.description}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Episodes */}
      <div className="p-6 lg:p-8">
        <h2 className="text-xl font-bold mb-4">
          Episodes ({podcast.episodes?.length || 0})
        </h2>

        <div className="space-y-2">
          {podcast.episodes?.map((episode) => (
            <EpisodeCard key={episode.id} episode={episode} podcast={podcast} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PodcastDetail;
