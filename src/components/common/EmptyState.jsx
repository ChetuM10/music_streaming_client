import {
  Music2,
  Heart,
  Clock,
  ListMusic,
  Mic2,
  Search,
  AlertCircle,
} from "lucide-react";

const EmptyState = ({ icon: Icon, title, description, action }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center animate-fade-in">
      <div className="w-20 h-20 rounded-full flex items-center justify-center mb-6 bg-slate-800/50 border border-slate-700">
        <Icon className="w-10 h-10 text-slate-500" />
      </div>
      <h3 className="text-xl font-semibold text-slate-200 mb-2">{title}</h3>
      <p className="text-slate-400 max-w-md mb-6">{description}</p>
      {action}
    </div>
  );
};

export const EmptyTracks = ({ action }) => (
  <EmptyState
    icon={Music2}
    title="No tracks found"
    description="There are no tracks to display right now. Check back later or explore other sections."
    action={action}
  />
);

export const EmptyFavorites = ({ action }) => (
  <EmptyState
    icon={Heart}
    title="No liked songs yet"
    description="Songs you like will appear here. Start exploring and tap the heart icon to save your favorites."
    action={action}
  />
);

export const EmptyHistory = ({ action }) => (
  <EmptyState
    icon={Clock}
    title="No listening history"
    description="Your recently played tracks will show up here. Start listening to build your history."
    action={action}
  />
);

export const EmptyPlaylist = ({ title, description, action }) => (
  <EmptyState
    icon={ListMusic}
    title={title || "No playlists yet"}
    description={
      description ||
      "Create your first playlist to organize your favorite music."
    }
    action={action}
  />
);

export const EmptyPodcasts = ({ action }) => (
  <EmptyState
    icon={Mic2}
    title="No podcasts found"
    description="Discover new podcasts and episodes to enjoy."
    action={action}
  />
);

export const EmptySearch = ({ query, action }) => (
  <EmptyState
    icon={Search}
    title={query ? `No results for "${query}"` : "Search for music"}
    description={
      query
        ? "Try different keywords or check your spelling."
        : "Enter an artist, song, or album name to get started."
    }
    action={action}
  />
);

export const EmptyError = ({ message, action }) => (
  <EmptyState
    icon={AlertCircle}
    title="Something went wrong"
    description={message || "We couldn't load this content. Please try again."}
    action={action}
  />
);

export default EmptyState;
