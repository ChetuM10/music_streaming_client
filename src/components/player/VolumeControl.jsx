import { Volume2, VolumeX, Volume1 } from "lucide-react";

const VolumeControl = ({ volume, isMuted, onVolumeChange, onToggleMute }) => {
  const VolumeIcon =
    isMuted || volume === 0 ? VolumeX : volume < 0.5 ? Volume1 : Volume2;

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={onToggleMute}
        className="p-2 text-slate-400 hover:text-slate-200 transition-colors"
      >
        <VolumeIcon className="w-5 h-5" />
      </button>
      <input
        type="range"
        min="0"
        max="1"
        step="0.01"
        value={isMuted ? 0 : volume}
        onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
        className="volume-slider w-24"
        style={{
          background: `linear-gradient(to right, #2dd4bf 0%, #2dd4bf ${
            (isMuted ? 0 : volume) * 100
          }%, rgba(148, 163, 184, 0.2) ${
            (isMuted ? 0 : volume) * 100
          }%, rgba(148, 163, 184, 0.2) 100%)`,
        }}
      />
    </div>
  );
};

export default VolumeControl;
