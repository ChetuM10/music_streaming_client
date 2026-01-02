import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Mic2 } from "lucide-react";
import api from "../lib/api";
import Loader from "../components/common/Loader";
import EpisodeCard from "../components/podcast/EpisodeCard";

const PodcastDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [podcast, setPodcast] = useState(null);
  const [episodes, setEpisodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPodcast = async () => {
      try {
        // First try internal podcasts
        const response = await api.get(`/podcasts/${id}`);
        setPodcast(response.data.data);
        setEpisodes(response.data.data.episodes || []);
      } catch (err) {
        // If not found internally, try external API (iTunes/Podcast Index)
        if (err.response?.status === 404) {
          try {
            const externalResponse = await api.get(`/external/podcasts/${id}`);
            const podcastData = externalResponse.data.data;
            setPodcast(podcastData);
            setEpisodes(podcastData.episodes || []);
          } catch (externalErr) {
            setError("Failed to load podcast");
            console.error(externalErr);
          }
        } else {
          setError("Failed to load podcast");
          console.error(err);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPodcast();
  }, [id]);

  if (loading) {
    return (
      <div className="p-6 lg:p-8 flex items-center justify-center min-h-[400px]">
        <Loader size="lg" />
      </div>
    );
  }

  if (error || !podcast) {
    return (
      <div className="p-6 lg:p-8 text-center">
        <button
          onClick={() => navigate("/podcasts")}
          className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-6"
        >
          <ArrowLeft size={20} />
          Back to Podcasts
        </button>
        <p className="text-slate-400">{error || "Podcast not found"}</p>
      </div>
    );
  }

  return (
    <div className="pb-32 animate-fade-in">
      {/* Header */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/30 to-transparent pointer-events-none" />

        <div className="relative p-6 lg:p-8">
          <button
            onClick={() => navigate("/podcasts")}
            className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-4"
          >
            <ArrowLeft size={20} />
            Back
          </button>

          <div className="flex flex-col md:flex-row gap-6 items-start md:items-end">
            {/* Cover */}
            <div
              className="w-40 h-40 md:w-48 md:h-48 lg:w-56 lg:h-56 rounded-xl overflow-hidden bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center shadow-2xl flex-shrink-0 glow-teal"
              style={{ maxWidth: "224px", maxHeight: "224px" }}
            >
              {podcast.cover_url ? (
                <img
                  src={podcast.cover_url}
                  alt={podcast.title}
                  className="w-full h-full object-cover"
                  style={{ maxWidth: "100%", maxHeight: "100%" }}
                />
              ) : (
                <Mic2 size={64} className="text-white/60" />
              )}
            </div>

            {/* Info */}
            <div className="flex-1">
              <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">
                Podcast
              </p>
              <h1 className="text-4xl lg:text-5xl font-bold mt-2 mb-2 text-moonlight">
                {podcast.title}
              </h1>
              <p className="text-lg text-slate-300 mb-2">{podcast.host}</p>
              {podcast.description && (
                <p className="text-slate-400 line-clamp-3">
                  {podcast.description}
                </p>
              )}
              <p className="text-sm text-slate-500 mt-3">
                {episodes.length}{" "}
                {episodes.length === 1 ? "episode" : "episodes"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Episodes */}
      <div className="px-6 lg:px-8 mt-6">
        <h2 className="text-xl font-bold text-slate-100 mb-4">Episodes</h2>
        {episodes.length === 0 ? (
          <p className="text-slate-400">No episodes yet</p>
        ) : (
          <div className="space-y-3">
            {episodes.map((episode) => (
              <EpisodeCard
                key={episode.id}
                episode={episode}
                podcast={podcast}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PodcastDetail;
