import { Link } from "react-router-dom";
import { getPlaceholderCover, cn } from "../../lib/utils";

const PodcastCard = ({ podcast }) => {
  const coverUrl = podcast.cover_url || getPlaceholderCover(podcast.title);

  return (
    <Link
      to={`/podcasts/${podcast.id}`}
      className={cn(
        "group p-4 rounded-lg bg-[var(--bg-secondary)] hover:bg-[var(--bg-tertiary)]",
        "transition-all duration-300"
      )}
    >
      {/* Cover Image */}
      <div className="relative aspect-square mb-4 rounded-lg overflow-hidden shadow-lg">
        <img
          src={coverUrl}
          alt={podcast.title}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>

      {/* Podcast Info */}
      <h3 className="font-semibold truncate mb-1">{podcast.title}</h3>
      <p className="text-sm text-[var(--text-secondary)] truncate">
        {podcast.host}
      </p>
    </Link>
  );
};

export default PodcastCard;
