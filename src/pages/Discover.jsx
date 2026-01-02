import { useState, useEffect } from "react";
import {
  Search,
  Music,
  Podcast,
  Users,
  TrendingUp,
  Play,
  Pause,
} from "lucide-react";
import api from "../lib/api";
import Loader from "../components/common/Loader";
import usePlayerStore from "../store/playerStore";

import { useNavigate } from "react-router-dom";

const Discover = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [trending, setTrending] = useState({ music: [], podcasts: [] });
  const [activeTab, setActiveTab] = useState("all");

  const [joeRoganEpisodes, setJoeRoganEpisodes] = useState([]);
  const [loadingJoe, setLoadingJoe] = useState(true);

  const { currentTrack, isPlaying, play, togglePlay } = usePlayerStore();

  useEffect(() => {
    loadTrending();
    loadJoeRogan();
  }, []);

  const loadTrending = async () => {
    try {
      const [musicRes, podcastsRes] = await Promise.all([
        api.get("/external/music/trending"),
        api.get("/external/podcasts/trending?limit=10"),
      ]);
      setTrending({
        music: musicRes.data.data || [],
        podcasts: podcastsRes.data.data || [],
      });
    } catch (error) {
      console.error("Failed to load trending:", error);
    }
  };

  const loadJoeRogan = async () => {
    try {
      const response = await api.get(
        "/external/podcasts/360084272/episodes?limit=5"
      );
      setJoeRoganEpisodes(response.data.data || []);
    } catch (error) {
      console.error("Failed to load Joe Rogan:", error);
    } finally {
      setLoadingJoe(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim() || query.length < 2) return;

    setLoading(true);
    try {
      const response = await api.get(
        `/external/search?q=${encodeURIComponent(query)}&limit=15`
      );
      setResults(response.data.data);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setLoading(false);
    }
  };

  const playEpisode = (episode) => {
    if (!episode.audioUrl) {
      alert("No audio available for this episode");
      return;
    }

    if (currentTrack?.id === episode.id) {
      togglePlay();
    } else {
      // Map episode data to track format expected by player
      const trackData = {
        ...episode,
        audio_url: episode.audioUrl,
        cover_url:
          episode.coverUrl ||
          "https://ui-avatars.com/api/?name=Joe+Rogan&background=000&color=fff",
        artist: "Joe Rogan",
        album: "The Joe Rogan Experience",
      };
      play(trackData, "episode");
    }
  };

  const handleTrackClick = (track) => {
    play(track);
  };

  const handlePodcastClick = (podcast) => {
    // If it's a specific episode with audio, play it
    if (podcast.audioUrl || podcast.audio_url) {
      playEpisode(podcast);
    } else {
      // Otherwise navigate to podcast details
      navigate(`/podcasts/${podcast.id}`);
    }
  };

  const formatDuration = (seconds) => {
    if (!seconds) return "";
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    if (hrs > 0) return `${hrs}h ${mins}m`;
    return `${mins} min`;
  };

  return (
    <div className="max-w-6xl mx-auto p-6 lg:p-8 animate-fade-in pb-32">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <TrendingUp className="text-teal-400 w-8 h-8" />
          <h1 className="text-3xl font-bold text-moonlight">Discover</h1>
        </div>
        <p className="text-slate-400">
          Search millions of songs and podcasts from around the world
        </p>
      </div>

      {/* Featured: Joe Rogan Experience */}
      <section
        className="mb-10 glass p-6 animate-fade-in-up"
        style={{
          background:
            "linear-gradient(135deg, rgba(153, 27, 27, 0.2) 0%, rgba(154, 52, 18, 0.2) 100%)",
        }}
      >
        <div className="flex items-center gap-4 mb-4">
          <img
            src="https://is1-ssl.mzstatic.com/image/thumb/Podcasts116/v4/62/30/3a/62303a2a-155e-5c1e-a5e6-f7653bb1c5f8/mza_10991360281941659498.jpg/600x600bb.jpg"
            alt="Joe Rogan Experience"
            className="w-20 h-20 rounded-xl"
          />
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              🎙️ The Joe Rogan Experience
            </h2>
            <p className="text-slate-400">
              Featured Podcast • Playable Episodes
            </p>
          </div>
        </div>

        {loadingJoe ? (
          <div className="flex justify-center py-8">
            <Loader size="md" />
          </div>
        ) : joeRoganEpisodes.length > 0 ? (
          <div className="space-y-3">
            {joeRoganEpisodes.map((episode) => (
              <div
                key={episode.id}
                className="flex items-center gap-4 p-4 rounded-xl hover:bg-black/20 transition-colors glass-subtle"
              >
                <button
                  onClick={() => playEpisode(episode)}
                  className="btn-play btn-play-sm flex-shrink-0"
                >
                  {currentTrack?.id === episode.id && isPlaying ? (
                    <Pause size={20} fill="currentColor" />
                  ) : (
                    <Play size={20} className="ml-0.5" fill="currentColor" />
                  )}
                </button>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-white truncate">
                    {episode.title}
                  </p>
                  <p className="text-sm text-slate-400 line-clamp-1">
                    {episode.description?.substring(0, 100)}...
                  </p>
                </div>
                <span className="text-sm text-slate-500 flex-shrink-0">
                  {formatDuration(episode.duration)}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-slate-400 py-4">
            Unable to load episodes. Try searching "Joe Rogan" below!
          </p>
        )}
      </section>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="mb-8 max-w-2xl">
        <div className="relative flex gap-3">
          <div className="relative flex-1">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
              size={20}
            />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for artists, songs, albums, podcasts..."
              className="input input-with-icon w-full"
            />
          </div>
          <button
            type="submit"
            disabled={loading || query.length < 2}
            className="btn btn-primary px-6 flex-shrink-0"
          >
            {loading ? "Searching..." : "Search"}
          </button>
        </div>
      </form>

      {/* Loading */}
      {loading && (
        <div className="flex justify-center py-12">
          <Loader size="lg" />
        </div>
      )}

      {/* Search Results */}
      {results && !loading && (
        <div className="space-y-8">
          {/* Tabs */}
          <div className="flex gap-2 flex-wrap">
            {["all", "tracks", "artists", "podcasts"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeTab === tab
                    ? "bg-teal-400 text-slate-900 glow-teal-sm"
                    : "glass-subtle text-slate-400 hover:text-white"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {/* Tracks */}
          {(activeTab === "all" || activeTab === "tracks") &&
            results.tracks?.length > 0 && (
              <section className="animate-fade-in-up">
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Music size={20} className="text-teal-400" /> Songs
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {results.tracks.map((track, i) => (
                    <div
                      key={track.id || i}
                      onClick={() => handleTrackClick(track)}
                      className="card card-interactive flex items-center gap-3 cursor-pointer"
                    >
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-teal-500 to-purple-600 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                        {currentTrack?.id === track.id && isPlaying ? (
                          <div className="w-3 bar-animation flex gap-0.5 items-end h-4">
                            <div className="w-1 bg-white animate-music-bar-1"></div>
                            <div className="w-1 bg-white animate-music-bar-2"></div>
                            <div className="w-1 bg-white animate-music-bar-3"></div>
                          </div>
                        ) : (
                          <Play
                            size={20}
                            className="text-white opacity-0 group-hover:opacity-100 transition-opacity"
                          />
                        )}
                        {!isPlaying && currentTrack?.id !== track.id && (
                          <Music
                            size={20}
                            className="text-white group-hover:opacity-0 absolute transition-opacity"
                          />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p
                          className={`font-medium truncate ${
                            currentTrack?.id === track.id
                              ? "text-teal-400"
                              : "text-white"
                          }`}
                        >
                          {track.title}
                        </p>
                        <p className="text-sm text-slate-400 truncate">
                          {track.artist} {track.album && `• ${track.album}`}
                        </p>
                      </div>
                      <span className="text-xs text-slate-500">
                        {track.year}
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            )}

          {/* Podcasts */}
          {(activeTab === "all" || activeTab === "podcasts") &&
            results.podcasts?.length > 0 && (
              <section className="animate-fade-in-up">
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Podcast size={20} className="text-purple-400" /> Podcasts
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {results.podcasts.map((podcast, i) => (
                    <div
                      key={podcast.id || i}
                      onClick={() => handlePodcastClick(podcast)}
                      className="card card-interactive cursor-pointer group"
                    >
                      <div className="aspect-square rounded-lg overflow-hidden mb-3 bg-slate-800 relative">
                        {podcast.coverUrl ? (
                          <img
                            src={podcast.coverUrl}
                            alt={podcast.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Podcast size={40} className="text-slate-600" />
                          </div>
                        )}

                        {/* Play overlay for hover */}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <div className="bg-teal-500/90 p-3 rounded-full backdrop-blur-sm transform scale-90 group-hover:scale-100 transition-transform">
                            <Play
                              size={24}
                              fill="white"
                              className="ml-1 text-white"
                            />
                          </div>
                        </div>
                      </div>
                      <p className="font-medium text-white text-sm truncate group-hover:text-teal-300 transition-colors">
                        {podcast.title}
                      </p>
                      <p className="text-xs text-slate-400 truncate">
                        {podcast.host || "Podcast"}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}

          {/* No Results */}
          {results.tracks?.length === 0 &&
            results.artists?.length === 0 &&
            results.podcasts?.length === 0 && (
              <div className="text-center py-12">
                <Search size={48} className="mx-auto mb-4 text-slate-600" />
                <p className="text-slate-400">No results found for "{query}"</p>
              </div>
            )}
        </div>
      )}

      {/* Trending Section (when no search) */}
      {!results && !loading && (
        <div className="space-y-8">
          {/* Trending Podcasts */}
          {trending.podcasts.length > 0 && (
            <section className="animate-fade-in-up">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Podcast size={20} className="text-purple-400" />
                Trending Podcasts
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {trending.podcasts.slice(0, 10).map((podcast, i) => (
                  <div key={podcast.id || i} className="card card-interactive">
                    <div className="aspect-square rounded-lg overflow-hidden mb-3 bg-slate-800">
                      {podcast.coverUrl ? (
                        <img
                          src={podcast.coverUrl}
                          alt={podcast.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Podcast size={40} className="text-slate-600" />
                        </div>
                      )}
                    </div>
                    <p className="font-medium text-white text-sm truncate">
                      {podcast.title}
                    </p>
                    <p className="text-xs text-slate-400 truncate">
                      {podcast.host}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
};

export default Discover;
