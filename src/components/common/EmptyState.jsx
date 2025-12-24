import { Music, Podcast, ListMusic, Search as SearchIcon } from "lucide-react";
import { cn } from "../../lib/utils";

const EmptyState = ({
  icon: Icon = Music,
  title = "Nothing here yet",
  description = "Content will appear here once available.",
  action,
  className,
}) => {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-16 px-4 text-center",
        className
      )}
    >
      <div className="w-20 h-20 rounded-full bg-[var(--bg-tertiary)] flex items-center justify-center mb-6">
        <Icon className="w-10 h-10 text-[var(--text-muted)]" />
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-[var(--text-secondary)] max-w-md mb-6">
        {description}
      </p>
      {action}
    </div>
  );
};

// Pre-configured empty states
export const EmptyTracks = ({ action }) => (
  <EmptyState
    icon={Music}
    title="No tracks found"
    description="Start exploring music or upload some tracks."
    action={action}
  />
);

export const EmptyPodcasts = ({ action }) => (
  <EmptyState
    icon={Podcast}
    title="No podcasts found"
    description="Discover podcasts or add some to your library."
    action={action}
  />
);

export const EmptyPlaylist = ({ action }) => (
  <EmptyState
    icon={ListMusic}
    title="This playlist is empty"
    description="Add some tracks to get started."
    action={action}
  />
);

export const EmptySearch = ({ query }) => (
  <EmptyState
    icon={SearchIcon}
    title="No results found"
    description={
      query
        ? `No results for "${query}". Try a different search.`
        : "Start typing to search."
    }
  />
);

export const EmptyFavorites = ({ action }) => (
  <EmptyState
    icon={Music}
    title="No favorites yet"
    description="Like some tracks to see them here."
    action={action}
  />
);

export default EmptyState;
