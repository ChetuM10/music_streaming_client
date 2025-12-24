import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Search as SearchIcon } from "lucide-react";
import api from "../lib/api";
import usePlayerStore from "../store/playerStore";
import Input from "../components/common/Input";
import TrackCard from "../components/music/TrackCard";
import PodcastCard from "../components/podcast/PodcastCard";
import { SkeletonCard } from "../components/common/Loader";
import { EmptySearch } from "../components/common/EmptyState";
import { debounce } from "../lib/utils";

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { playList } = usePlayerStore();

  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState({
    tracks: [],
    podcasts: [],
    episodes: [],
  });

  const performSearch = async (searchQuery) => {
    if (!searchQuery || searchQuery.length < 2) {
      setResults({ tracks: [], podcasts: [], episodes: [] });
      return;
    }

    try {
      setIsLoading(true);
      const res = await api.get(`/search?q=${encodeURIComponent(searchQuery)}`);
      if (res.data.success) {
        setResults(res.data.data.results);
      }
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Debounced search
  useEffect(() => {
    const debouncedSearch = debounce(performSearch, 300);
    debouncedSearch(query);

    // Update URL params
    if (query) {
      setSearchParams({ q: query });
    } else {
      setSearchParams({});
    }
  }, [query]);

  const hasResults = results.tracks.length > 0 || results.podcasts.length > 0;

  return (
    <div className="p-6 lg:p-8">
      <h1 className="text-3xl font-bold mb-6">Search</h1>

      {/* Search Input */}
      <div className="max-w-xl mb-8">
        <Input
          type="text"
          placeholder="What do you want to listen to?"
          icon={SearchIcon}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="text-lg"
        />
      </div>

      {/* Results */}
      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {[...Array(10)].map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : !hasResults ? (
        <EmptySearch query={query} />
      ) : (
        <div className="space-y-10">
          {/* Tracks */}
          {results.tracks.length > 0 && (
            <section>
              <h2 className="text-xl font-bold mb-4">Songs</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {results.tracks.map((track, index) => (
                  <TrackCard
                    key={track.id}
                    track={track}
                    onPlay={() => playList(results.tracks, index)}
                  />
                ))}
              </div>
            </section>
          )}

          {/* Podcasts */}
          {results.podcasts.length > 0 && (
            <section>
              <h2 className="text-xl font-bold mb-4">Podcasts</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {results.podcasts.map((podcast) => (
                  <PodcastCard key={podcast.id} podcast={podcast} />
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
};

export default Search;
