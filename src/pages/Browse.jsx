import { useState, useEffect } from "react";
import api from "../lib/api";
import usePlayerStore from "../store/playerStore";
import TrackCard from "../components/music/TrackCard";
import Loader, { SkeletonCard } from "../components/common/Loader";
import { EmptyTracks } from "../components/common/EmptyState";

const Browse = () => {
  const { playList } = usePlayerStore();
  const [isLoading, setIsLoading] = useState(true);
  const [tracks, setTracks] = useState([]);
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState("all");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        const genresRes = await api.get("/tracks/genres");
        if (genresRes.data.success) {
          setGenres(genresRes.data.data.genres);
        }

        const endpoint =
          selectedGenre === "all"
            ? "/tracks?limit=50"
            : `/tracks/genre/${selectedGenre}?limit=50`;

        const tracksRes = await api.get(endpoint);
        if (tracksRes.data.success) {
          setTracks(tracksRes.data.data.tracks);
        }
      } catch (error) {
        console.error("Failed to fetch browse data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [selectedGenre]);

  return (
    <div className="p-6 lg:p-8 animate-fade-in">
      <h1 className="text-3xl font-bold text-moonlight mb-6">Browse</h1>

      {/* Genre Filter */}
      <div className="flex gap-2 mb-8 overflow-x-auto hide-scrollbar pb-2">
        <button
          onClick={() => setSelectedGenre("all")}
          className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
            selectedGenre === "all"
              ? "bg-teal-400 text-slate-900 glow-teal-sm"
              : "glass-subtle text-slate-300 hover:text-white"
          }`}
        >
          All
        </button>
        {genres.map((genre) => (
          <button
            key={genre}
            onClick={() => setSelectedGenre(genre)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
              selectedGenre === genre
                ? "bg-teal-400 text-slate-900 glow-teal-sm"
                : "glass-subtle text-slate-300 hover:text-white"
            }`}
          >
            {genre}
          </button>
        ))}
      </div>

      {/* Tracks Grid */}
      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {[...Array(10)].map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : tracks.length === 0 ? (
        <EmptyTracks />
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {tracks.map((track, index) => (
            <TrackCard
              key={track.id}
              track={track}
              onPlay={() => playList(tracks, index)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Browse;
