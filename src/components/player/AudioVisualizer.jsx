import { useEffect, useRef, useState, useCallback } from "react";
import { cn } from "../../lib/utils";

/**
 * Audio Visualizer Component
 *
 * Uses Web Audio API to create:
 * - Frequency analyzer bars
 * - Waveform display
 *
 * This demonstrates understanding of browser APIs.
 */
const AudioVisualizer = ({
  audioRef,
  isPlaying,
  type = "bars", // "bars" | "waveform" | "circular"
  barCount = 32,
  className,
  barClassName,
}) => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const analyzerRef = useRef(null);
  const audioContextRef = useRef(null);
  const sourceRef = useRef(null);
  const [isInitialized, setIsInitialized] = useState(false);

  /**
   * Initialize Web Audio API analyzer
   */
  const initializeAnalyzer = useCallback(() => {
    if (!audioRef?.current || isInitialized) return;

    try {
      // Create or reuse AudioContext
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext ||
          window.webkitAudioContext)();
      }

      const audioContext = audioContextRef.current;

      // Create analyzer node
      if (!analyzerRef.current) {
        analyzerRef.current = audioContext.createAnalyser();
        analyzerRef.current.fftSize = 256;
        analyzerRef.current.smoothingTimeConstant = 0.8;
      }

      // Create source from audio element (only once)
      if (!sourceRef.current) {
        sourceRef.current = audioContext.createMediaElementSource(
          audioRef.current
        );
        sourceRef.current.connect(analyzerRef.current);
        analyzerRef.current.connect(audioContext.destination);
      }

      setIsInitialized(true);
    } catch (error) {
      console.error("Failed to initialize audio visualizer:", error);
    }
  }, [audioRef, isInitialized]);

  /**
   * Draw frequency bars
   */
  const drawBars = useCallback(
    (canvas, analyzer, dataArray) => {
      const ctx = canvas.getContext("2d");
      const width = canvas.width;
      const height = canvas.height;
      const bufferLength = analyzer.frequencyBinCount;

      // Get frequency data
      analyzer.getByteFrequencyData(dataArray);

      // Clear canvas
      ctx.clearRect(0, 0, width, height);

      // Calculate bar dimensions
      const barWidth = width / barCount;
      const gap = 2;

      // Draw bars
      for (let i = 0; i < barCount; i++) {
        // Sample from frequency data
        const dataIndex = Math.floor((i / barCount) * bufferLength);
        const value = dataArray[dataIndex];
        const barHeight = (value / 255) * height * 0.9;

        // Gradient color based on height
        const hue = 150 + (value / 255) * 30; // Green to teal
        const gradient = ctx.createLinearGradient(
          0,
          height,
          0,
          height - barHeight
        );
        gradient.addColorStop(0, `hsla(${hue}, 80%, 50%, 1)`);
        gradient.addColorStop(1, `hsla(${hue}, 80%, 60%, 0.6)`);

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.roundRect(
          i * barWidth + gap / 2,
          height - barHeight,
          barWidth - gap,
          barHeight,
          [4, 4, 0, 0]
        );
        ctx.fill();
      }
    },
    [barCount]
  );

  /**
   * Draw waveform
   */
  const drawWaveform = useCallback((canvas, analyzer, dataArray) => {
    const ctx = canvas.getContext("2d");
    const width = canvas.width;
    const height = canvas.height;
    const bufferLength = analyzer.frequencyBinCount;

    // Get time domain data
    analyzer.getByteTimeDomainData(dataArray);

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Draw waveform
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#1db954";
    ctx.beginPath();

    const sliceWidth = width / bufferLength;
    let x = 0;

    for (let i = 0; i < bufferLength; i++) {
      const v = dataArray[i] / 128.0;
      const y = (v * height) / 2;

      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }

      x += sliceWidth;
    }

    ctx.lineTo(width, height / 2);
    ctx.stroke();
  }, []);

  /**
   * Draw circular visualizer
   */
  const drawCircular = useCallback((canvas, analyzer, dataArray) => {
    const ctx = canvas.getContext("2d");
    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) * 0.3;

    // Get frequency data
    analyzer.getByteFrequencyData(dataArray);

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    const bars = 64;
    const angleStep = (Math.PI * 2) / bars;

    for (let i = 0; i < bars; i++) {
      const dataIndex = Math.floor((i / bars) * analyzer.frequencyBinCount);
      const value = dataArray[dataIndex];
      const barHeight = (value / 255) * radius * 0.8;

      const angle = i * angleStep - Math.PI / 2;
      const x1 = centerX + Math.cos(angle) * radius;
      const y1 = centerY + Math.sin(angle) * radius;
      const x2 = centerX + Math.cos(angle) * (radius + barHeight);
      const y2 = centerY + Math.sin(angle) * (radius + barHeight);

      const hue = 150 + (value / 255) * 30;
      ctx.strokeStyle = `hsla(${hue}, 80%, 55%, 0.9)`;
      ctx.lineWidth = 3;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    }
  }, []);

  /**
   * Animation loop
   */
  const animate = useCallback(() => {
    if (!analyzerRef.current || !canvasRef.current) return;

    const analyzer = analyzerRef.current;
    const canvas = canvasRef.current;
    const bufferLength = analyzer.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      animationRef.current = requestAnimationFrame(draw);

      switch (type) {
        case "waveform":
          drawWaveform(canvas, analyzer, dataArray);
          break;
        case "circular":
          drawCircular(canvas, analyzer, dataArray);
          break;
        default:
          drawBars(canvas, analyzer, dataArray);
      }
    };

    draw();
  }, [type, drawBars, drawWaveform, drawCircular]);

  // Initialize on first play
  useEffect(() => {
    if (isPlaying && !isInitialized) {
      initializeAnalyzer();
    }
  }, [isPlaying, isInitialized, initializeAnalyzer]);

  // Start/stop animation
  useEffect(() => {
    if (isPlaying && isInitialized) {
      // Resume AudioContext if suspended
      if (audioContextRef.current?.state === "suspended") {
        audioContextRef.current.resume();
      }
      animate();
    } else {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, isInitialized, animate]);

  // Resize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeObserver = new ResizeObserver(() => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
    });

    resizeObserver.observe(canvas);
    return () => resizeObserver.disconnect();
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={cn("w-full h-full", !isInitialized && "opacity-50", className)}
      style={{ imageRendering: "pixelated" }}
    />
  );
};

/**
 * Simple CSS-based bars (no Web Audio API required)
 * Used as fallback or for aesthetics only
 */
export const SimpleBars = ({ isPlaying, count = 5, className }) => {
  return (
    <div className={cn("flex items-end gap-0.5", className)}>
      {Array.from({ length: count }).map((_, i) => (
        <span
          key={i}
          className={cn(
            "w-1 bg-[var(--accent-primary)] rounded-full transition-all",
            isPlaying ? `animate-music-bar-${(i % 3) + 1}` : "h-1"
          )}
        />
      ))}
    </div>
  );
};

export default AudioVisualizer;
