import { Volume2, VolumeX, Volume1 } from "lucide-react";
import usePlayerStore from "../../store/playerStore";

const VolumeControl = () => {
  const { volume, isMuted, setVolume, toggleMute } = usePlayerStore();

  const displayVolume = isMuted ? 0 : volume;

  const VolumeIcon =
    displayVolume === 0 ? VolumeX : displayVolume < 0.5 ? Volume1 : Volume2;

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
  };

  return (
    <div className="flex items-center gap-2 w-32">
      <button
        onClick={toggleMute}
        className="text-[var(--text-secondary)] hover:text-white transition-colors"
      >
        <VolumeIcon className="w-5 h-5" />
      </button>

      <div className="flex-1 relative group">
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={displayVolume}
          onChange={handleVolumeChange}
          className="w-full h-1 bg-[var(--bg-tertiary)] rounded-full appearance-none cursor-pointer
            [&::-webkit-slider-thumb]:appearance-none
            [&::-webkit-slider-thumb]:w-3
            [&::-webkit-slider-thumb]:h-3
            [&::-webkit-slider-thumb]:rounded-full
            [&::-webkit-slider-thumb]:bg-white
            [&::-webkit-slider-thumb]:opacity-0
            [&::-webkit-slider-thumb]:transition-opacity
            group-hover:[&::-webkit-slider-thumb]:opacity-100
            [&::-moz-range-thumb]:w-3
            [&::-moz-range-thumb]:h-3
            [&::-moz-range-thumb]:rounded-full
            [&::-moz-range-thumb]:bg-white
            [&::-moz-range-thumb]:border-0
            [&::-moz-range-thumb]:opacity-0
            group-hover:[&::-moz-range-thumb]:opacity-100
          "
          style={{
            background: `linear-gradient(to right, var(--accent-primary) ${
              displayVolume * 100
            }%, var(--bg-tertiary) ${displayVolume * 100}%)`,
          }}
        />
      </div>
    </div>
  );
};

export default VolumeControl;
