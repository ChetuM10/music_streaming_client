import {
  Music,
  Podcast,
  ListMusic,
  Search as SearchIcon,
  Play,
  Heart,
  Clock,
  Sparkles,
  Music2,
  Radio,
} from "lucide-react";
import { cn, getPlaceholderGradient } from "../../lib/utils";

/**
 * Premium Empty State Component
 */
const EmptyState = ({
  icon: Icon = Music,
  title = "Nothing here yet",
  description = "Content will appear here once available.",
  action,
  className,
  suggestions,
}) => {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-20 px-4 text-center",
        className
      )}
    >
      {/* Icon with gradient background */}
      <div className="relative mb-8">
        <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-white/[0.08] to-white/[0.02] flex items-center justify-center border border-white/[0.08] shadow-2xl shadow-black/50">
          <Icon className="w-12 h-12 text-[var(--text-muted)]" />
        </div>
        <div className="absolute -inset-4 bg-[var(--accent-primary)]/10 rounded-full blur-2xl" />
      </div>

      <h3 className="text-2xl font-bold mb-3">{title}</h3>
      <p className="text-[var(--text-secondary)] max-w-md mb-8 text-lg">
        {description}
      </p>

      {action && <div className="mb-8">{action}</div>}

      {/* Suggestions Grid */}
      {suggestions && suggestions.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-lg w-full">
          {suggestions.map((suggestion, i) => (
            <button
              key={i}
              onClick={suggestion.onClick}
              className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.05] transition-all duration-200 hover:scale-[1.02] active:scale-[0.99]"
            >
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: getPlaceholderGradient(suggestion.label) }}
              >
                <suggestion.icon className="w-5 h-5 text-white" />
              </div>
              <span className="text-sm font-medium truncate">
                {suggestion.label}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// Pre-configured empty states with premium design
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

export const EmptySearch = ({ query, onSuggestionClick }) => {
  const suggestions = [
    { label: "Pop", icon: Music2, onClick: () => onSuggestionClick?.("Pop") },
    { label: "Rock", icon: Radio, onClick: () => onSuggestionClick?.("Rock") },
    { label: "Jazz", icon: Music, onClick: () => onSuggestionClick?.("Jazz") },
    {
      label: "Hip Hop",
      icon: Music2,
      onClick: () => onSuggestionClick?.("Hip Hop"),
    },
    {
      label: "Classical",
      icon: Sparkles,
      onClick: () => onSuggestionClick?.("Classical"),
    },
    {
      label: "Electronic",
      icon: Music,
      onClick: () => onSuggestionClick?.("Electronic"),
    },
  ];

  return (
    <EmptyState
      icon={SearchIcon}
      title={query ? "No results found" : "Search for music"}
      description={
        query
          ? `We couldn't find anything for "${query}". Try different keywords.`
          : "Find your favorite songs, artists, albums, and podcasts."
      }
      suggestions={!query ? suggestions : undefined}
    />
  );
};

export const EmptyFavorites = ({ action }) => (
  <EmptyState
    icon={Heart}
    title="No favorites yet"
    description="Like songs while listening and they'll appear here."
    action={action}
  />
);

export const EmptyHistory = ({ action }) => (
  <EmptyState
    icon={Clock}
    title="No listening history"
    description="Start playing music and your history will show up here."
    action={action}
  />
);

export default EmptyState;
