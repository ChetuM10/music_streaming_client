import { useRef } from "react";

const ProgressBar = ({ progress, duration, onSeek }) => {
  const barRef = useRef(null);

  const handleClick = (e) => {
    if (!barRef.current || !duration) return;
    const rect = barRef.current.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    onSeek(percent * duration);
  };

  const progressPercent = duration ? (progress / duration) * 100 : 0;

  return (
    <div
      ref={barRef}
      className="progress-bar flex-1 group cursor-pointer"
      onClick={handleClick}
    >
      <div className="progress-fill" style={{ width: `${progressPercent}%` }}>
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-teal-400 opacity-0 group-hover:opacity-100 transition-opacity glow-teal-sm" />
      </div>
    </div>
  );
};

export default ProgressBar;
