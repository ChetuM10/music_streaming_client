import { Link } from "react-router-dom";
import { cn } from "../../lib/utils";
import CoverImage from "../common/CoverImage";

/**
 * Premium Podcast Card Component
 */
const PodcastCard = ({ podcast }) => {
  return (
    <Link
      to={`/podcasts/${podcast.id}`}
      className={cn(
        "group relative p-4 rounded-xl transition-all duration-300",
        "bg-gradient-to-b from-white/[0.05] to-transparent",
        "hover:bg-white/[0.08]",
        "border border-transparent hover:border-white/[0.08]",
        "hover:shadow-xl hover:shadow-black/20"
      )}
    >
      {/* Cover Image */}
      <div className="relative mb-4">
        <CoverImage
          src={podcast.cover_url}
          title={podcast.title}
          alt={podcast.title}
          type="podcast"
          size="full"
          rounded="xl"
          className="shadow-xl group-hover:shadow-2xl transition-all duration-300 group-hover:scale-[1.02]"
        />
      </div>

      {/* Podcast Info */}
      <h3 className="font-semibold truncate mb-1 group-hover:text-white transition-colors">
        {podcast.title}
      </h3>
      <p className="text-sm text-[var(--text-secondary)] truncate group-hover:text-[var(--text-primary)] transition-colors">
        {podcast.host}
      </p>
    </Link>
  );
};

export default PodcastCard;
