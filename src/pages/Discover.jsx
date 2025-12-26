import { useState, useEffect, useRef } from "react";
import {
  Search,
  Music,
  Podcast,
  Users,
  TrendingUp,
  Play,
  Pause,
  ExternalLink,
} from "lucide-react";
import api from "../lib/api";
import Loader from "../components/common/Loader";

/**
 * Discover Page
 *
 * Search and browse external music and podcast databases
 * Uses MusicBrainz, TheAudioDB, and iTunes APIs
 */
const Discover = () => {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [trending, setTrending] = useState({ music: [], podcasts: [] });
  const [activeTab, setActiveTab] = useState("all");

  // Joe Rogan featured podcast
  const [joeRoganEpisodes, setJoeRoganEpisodes] = useState([]);
  const [loadingJoe, setLoadingJoe] = useState(true);
  const [playingEpisode, setPlayingEpisode] = useState(null);
  const audioRef = useRef(null);

  // Load trending and Joe Rogan on mount
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
      // Joe Rogan Experience podcast ID on iTunes: 360084272
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

    if (playingEpisode?.id === episode.id) {
      // Toggle pause/play
      if (audioRef.current.paused) {
        audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
    } else {
      // Play new episode
      setPlayingEpisode(episode);
      if (audioRef.current) {
        audioRef.current.src = episode.audioUrl;
        audioRef.current.play();
      }
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
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* Hidden audio element */}
      <audio ref={audioRef} onEnded={() => setPlayingEpisode(null)} />

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
          <TrendingUp className="text-[var(--accent-primary)]" />
          Discover
        </h1>
        <p className="text-[var(--text-secondary)]">
          Search millions of songs and podcasts from around the world
        </p>
      </div>

      {/* 🎙️ FEATURED: Joe Rogan Experience */}
      <section className="mb-10 bg-gradient-to-r from-red-900/30 to-orange-900/30 rounded-2xl p-6 border border-red-500/20">
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
            <p className="text-[var(--text-secondary)]">
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
                className="flex items-center gap-4 p-4 bg-black/30 rounded-xl hover:bg-black/50 transition-colors"
              >
                <button
                  onClick={() => playEpisode(episode)}
                  className="w-12 h-12 flex-shrink-0 bg-[var(--accent-primary)] rounded-full flex items-center justify-center hover:scale-110 transition-transform"
                >
                  {playingEpisode?.id === episode.id ? (
                    <Pause size={20} className="text-black" />
                  ) : (
                    <Play size={20} className="text-black ml-1" />
                  )}
                </button>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-white truncate">
                    {episode.title}
                  </p>
                  <p className="text-sm text-[var(--text-secondary)] line-clamp-1">
                    {episode.description?.substring(0, 100)}...
                  </p>
                </div>
                <span className="text-sm text-[var(--text-muted)] flex-shrink-0">
                  {formatDuration(episode.duration)}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-[var(--text-secondary)] py-4">
            Unable to load episodes. Try searching "Joe Rogan" below!
          </p>
        )}
      </section>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="mb-8">
        <div className="relative">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"
            size={20}
          />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for artists, songs, albums, podcasts..."
            className="w-full pl-12 pr-4 py-4 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-full text-white placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-primary)] transition-colors"
          />
          <button
            type="submit"
            disabled={loading || query.length < 2}
            className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-2 bg-[var(--accent-primary)] text-black rounded-full font-medium hover:scale-105 transition-transform disabled:opacity-50"
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
          <div className="flex gap-2">
            {["all", "tracks", "artists", "podcasts"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeTab === tab
                    ? "bg-[var(--accent-primary)] text-black"
                    : "bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:text-white"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {/* Tracks */}
          {(activeTab === "all" || activeTab === "tracks") &&
            results.tracks?.length > 0 && (
              <section>
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Music size={20} /> Songs
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {results.tracks.map((track, i) => (
                    <div
                      key={track.id || i}
                      className="flex items-center gap-3 p-3 bg-[var(--bg-secondary)] rounded-lg hover:bg-[var(--bg-tertiary)] transition-colors group"
                    >
                      <div className="w-12 h-12 bg-gradient-to-br from-[var(--accent-primary)] to-purple-600 rounded-lg flex items-center justify-center">
                        <Music size={20} className="text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-white truncate">
                          {track.title}
                        </p>
                        <p className="text-sm text-[var(--text-secondary)] truncate">
                          {track.artist} {track.album && `• ${track.album}`}
                        </p>
                      </div>
                      <span className="text-xs text-[var(--text-muted)]">
                        {track.year}
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            )}

          {/* Artists */}
          {(activeTab === "all" || activeTab === "artists") &&
            results.artists?.length > 0 && (
              <section>
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Users size={20} /> Artists
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {results.artists.map((artist, i) => (
                    <div
                      key={artist.id || i}
                      className="bg-[var(--bg-secondary)] rounded-xl p-4 hover:bg-[var(--bg-tertiary)] transition-colors text-center"
                    >
                      <div className="w-20 h-20 mx-auto mb-3 rounded-full overflow-hidden bg-gradient-to-br from-pink-500 to-purple-600">
                        {artist.thumbnail ? (
                          <img
                            src={artist.thumbnail}
                            alt={artist.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-white">
                            {artist.name?.charAt(0)}
                          </div>
                        )}
                      </div>
                      <p className="font-medium text-white truncate">
                        {artist.name}
                      </p>
                      <p className="text-sm text-[var(--text-secondary)]">
                        {artist.genre || "Artist"}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}

          {/* Podcasts */}
          {(activeTab === "all" || activeTab === "podcasts") &&
            results.podcasts?.length > 0 && (
              <section>
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Podcast size={20} /> Podcasts
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {results.podcasts.map((podcast, i) => (
                    <div
                      key={podcast.id || i}
                      className="bg-[var(--bg-secondary)] rounded-xl p-3 hover:bg-[var(--bg-tertiary)] transition-colors"
                    >
                      <div className="aspect-square rounded-lg overflow-hidden mb-3 bg-[var(--bg-tertiary)]">
                        {podcast.coverUrl ? (
                          <img
                            src={podcast.coverUrl}
                            alt={podcast.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Podcast
                              size={40}
                              className="text-[var(--text-muted)]"
                            />
                          </div>
                        )}
                      </div>
                      <p className="font-medium text-white text-sm truncate">
                        {podcast.title}
                      </p>
                      <p className="text-xs text-[var(--text-secondary)] truncate">
                        {podcast.host}
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
                <Search
                  size={48}
                  className="mx-auto mb-4 text-[var(--text-muted)]"
                />
                <p className="text-[var(--text-secondary)]">
                  No results found for "{query}"
                </p>
              </div>
            )}
        </div>
      )}

      {/* Trending Section (when no search) */}
      {!results && !loading && (
        <div className="space-y-8">
          {/* Trending Podcasts */}
          {trending.podcasts.length > 0 && (
            <section>
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Podcast size={20} className="text-purple-400" />
                Trending Podcasts
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {trending.podcasts.slice(0, 10).map((podcast, i) => (
                  <div
                    key={podcast.id || i}
                    className="bg-[var(--bg-secondary)] rounded-xl p-3 hover:bg-[var(--bg-tertiary)] transition-colors"
                  >
                    <div className="aspect-square rounded-lg overflow-hidden mb-3 bg-[var(--bg-tertiary)]">
                      {podcast.coverUrl ? (
                        <img
                          src={podcast.coverUrl}
                          alt={podcast.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Podcast
                            size={40}
                            className="text-[var(--text-muted)]"
                          />
                        </div>
                      )}
                    </div>
                    <p className="font-medium text-white text-sm truncate">
                      {podcast.title}
                    </p>
                    <p className="text-xs text-[var(--text-secondary)] truncate">
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
