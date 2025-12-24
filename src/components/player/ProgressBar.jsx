import { useRef } from "react";
import { cn } from "../../lib/utils";

const ProgressBar = ({
  currentTime,
  duration,
  onSeek,
  showThumb = false,
  className,
}) => {
  const progressRef = useRef(null);

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  const handleClick = (e) => {
    if (!progressRef.current || !duration) return;

    const rect = progressRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    const newTime = percentage * duration;

    onSeek(Math.max(0, Math.min(newTime, duration)));
  };

  const handleDrag = (e) => {
    if (e.buttons !== 1) return; // Only left mouse button
    handleClick(e);
  };

  return (
    <div
      ref={progressRef}
      className={cn(
        "group relative h-1 bg-[var(--bg-tertiary)] rounded-full cursor-pointer",
        showThumb && "hover:h-1.5 transition-all",
        className
      )}
      onClick={handleClick}
      onMouseMove={handleDrag}
    >
      {/* Progress fill */}
      <div
        className="absolute top-0 left-0 h-full bg-[var(--accent-primary)] rounded-full transition-all group-hover:bg-[var(--accent-secondary)]"
        style={{ width: `${progress}%` }}
      />

      {/* Thumb */}
      {showThumb && (
        <div
          className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
          style={{ left: `calc(${progress}% - 6px)` }}
        />
      )}
    </div>
  );
};

export default ProgressBar;
