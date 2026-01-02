import { useState } from "react";
import { Music2 } from "lucide-react";

const CoverImage = ({
  src,
  alt,
  title,
  size = "medium",
  className = "",
  showPlayButton = false,
  isPlaying = false,
  onPlay,
}) => {
  const [error, setError] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const sizeClasses = {
    small: "w-12 h-12",
    medium: "w-full aspect-square",
    large: "w-48 h-48",
  };

  const placeholderUrl = title
    ? `https://ui-avatars.com/api/?name=${encodeURIComponent(
        title
      )}&background=1e293b&color=2dd4bf&size=200`
    : null;

  return (
    <div
      className={`relative overflow-hidden rounded-lg bg-slate-800 ${sizeClasses[size]} ${className}`}
    >
      {!loaded && <div className="absolute inset-0 skeleton" />}
      <img
        src={error || !src ? placeholderUrl : src}
        alt={alt || title || "Cover"}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
        onLoad={() => setLoaded(true)}
        onError={() => {
          setError(true);
          setLoaded(true);
        }}
      />
      {error && !placeholderUrl && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-800">
          <Music2 className="w-8 h-8 text-slate-600" />
        </div>
      )}
    </div>
  );
};

export default CoverImage;
