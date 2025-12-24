import { cn } from "../../lib/utils";

const Loader = ({ size = "md", className }) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12",
    xl: "w-16 h-16",
  };

  return (
    <div className={cn("flex items-center justify-center", className)}>
      <div
        className={cn(
          "border-2 border-[var(--bg-tertiary)] border-t-[var(--accent-primary)] rounded-full animate-spin",
          sizeClasses[size]
        )}
      />
    </div>
  );
};

// Skeleton loader for cards
export const SkeletonCard = ({ className }) => (
  <div className={cn("animate-pulse", className)}>
    <div className="skeleton aspect-square rounded-lg mb-3" />
    <div className="skeleton h-4 rounded w-3/4 mb-2" />
    <div className="skeleton h-3 rounded w-1/2" />
  </div>
);

// Skeleton loader for track list items
export const SkeletonTrack = ({ className }) => (
  <div className={cn("flex items-center gap-4 p-3 animate-pulse", className)}>
    <div className="skeleton w-12 h-12 rounded" />
    <div className="flex-1">
      <div className="skeleton h-4 rounded w-1/3 mb-2" />
      <div className="skeleton h-3 rounded w-1/4" />
    </div>
    <div className="skeleton h-3 rounded w-12" />
  </div>
);

export default Loader;
