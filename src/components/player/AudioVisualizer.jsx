import { useRef, useEffect } from "react";
import usePlayerStore from "../../store/playerStore";

const AudioVisualizer = ({ isPlaying }) => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const barCount = 32;
    const bars = Array(barCount).fill(0);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      bars.forEach((_, i) => {
        const height = isPlaying
          ? Math.random() * canvas.height * 0.8 + canvas.height * 0.1
          : canvas.height * 0.1;

        bars[i] += (height - bars[i]) * 0.1;

        const x = (i / barCount) * canvas.width;
        const width = canvas.width / barCount - 2;

        // Gradient from teal to cyan
        const gradient = ctx.createLinearGradient(0, canvas.height, 0, 0);
        gradient.addColorStop(0, "rgba(45, 212, 191, 0.3)");
        gradient.addColorStop(1, "rgba(6, 182, 212, 0.8)");

        ctx.fillStyle = gradient;
        ctx.fillRect(x, canvas.height - bars[i], width, bars[i]);
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying]);

  return (
    <canvas ref={canvasRef} width={200} height={60} className="opacity-70" />
  );
};

export default AudioVisualizer;
