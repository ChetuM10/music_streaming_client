import { useState } from "react";
import { Music, Mic } from "lucide-react";
import { getPlaceholderGradient, getInitials, cn } from "../../lib/utils";

/**
 * Premium Cover Image Component
 *
 * Displays album/podcast cover with beautiful gradient fallback.
 * No more ugly letter avatars!
 */
const CoverImage = ({
  src,
  alt,
  title,
  type = "track", // track, podcast, playlist
  size = "md", // sm, md, lg, xl
  className = "",
  showIcon = false,
  rounded = "lg", // none, sm, md, lg, xl, full
}) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const shouldShowFallback = !src || imageError;

  // Size classes
  const sizeClasses = {
    xs: "w-10 h-10",
    sm: "w-12 h-12",
    md: "w-16 h-16",
    lg: "w-24 h-24",
    xl: "w-32 h-32",
    "2xl": "w-40 h-40",
    full: "w-full aspect-square",
  };

  // Rounded classes
  const roundedClasses = {
    none: "rounded-none",
    sm: "rounded",
    md: "rounded-md",
    lg: "rounded-lg",
    xl: "rounded-xl",
    "2xl": "rounded-2xl",
    full: "rounded-full",
  };

  // Icon for fallback
  const FallbackIcon = type === "podcast" ? Mic : Music;

  // Get gradient based on title
  const gradientStyle = shouldShowFallback
    ? { background: getPlaceholderGradient(title || alt) }
    : {};

  return (
    <div
      className={cn(
        "relative overflow-hidden flex-shrink-0",
        "shadow-lg",
        sizeClasses[size] || sizeClasses.md,
        roundedClasses[rounded] || roundedClasses.lg,
        className
      )}
      style={gradientStyle}
    >
      {/* Actual Image */}
      {!shouldShowFallback && (
        <img
          src={src}
          alt={alt || title}
          className={cn(
            "w-full h-full object-cover transition-opacity duration-300",
            imageLoaded ? "opacity-100" : "opacity-0"
          )}
          onLoad={() => setImageLoaded(true)}
          onError={() => setImageError(true)}
          loading="lazy"
        />
      )}

      {/* Gradient Fallback with Icon/Initials */}
      {shouldShowFallback && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {/* Subtle overlay pattern */}
          <div className="absolute inset-0 bg-black/10" />

          {/* Icon or Initials */}
          <div className="relative z-10 flex flex-col items-center justify-center">
            {showIcon ? (
              <FallbackIcon
                className={cn(
                  "text-white/90",
                  size === "xs" || size === "sm"
                    ? "w-4 h-4"
                    : size === "md"
                    ? "w-6 h-6"
                    : size === "lg"
                    ? "w-8 h-8"
                    : "w-12 h-12"
                )}
              />
            ) : (
              <span
                className={cn(
                  "font-bold text-white/90 drop-shadow-lg",
                  size === "xs" || size === "sm"
                    ? "text-xs"
                    : size === "md"
                    ? "text-lg"
                    : size === "lg"
                    ? "text-2xl"
                    : size === "xl"
                    ? "text-3xl"
                    : "text-4xl"
                )}
              >
                {getInitials(title || alt)}
              </span>
            )}
          </div>

          {/* Shine effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent" />
        </div>
      )}

      {/* Loading shimmer */}
      {!shouldShowFallback && !imageLoaded && (
        <div className="absolute inset-0 skeleton" />
      )}
    </div>
  );
};

export default CoverImage;
