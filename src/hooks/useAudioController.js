/**
 * useAudioController Hook
 *
 * Separates audio logic from UI components.
 * Handles HTML5 <audio> API interactions, keyboard events, and state sync.
 */

import { useEffect, useRef, useCallback } from "react";
import usePlayerStore from "../store/playerStore";

const SEEK_STEP = 5; // seconds
const VOLUME_STEP = 0.1;

export const useAudioController = () => {
  const audioRef = useRef(null);

  const {
    currentTrack,
    isPlaying,
    volume,
    isMuted,
    repeatMode,
    setAudioRef,
    setCurrentTime,
    setDuration,
    togglePlay,
    seek,
    setVolume,
    toggleMute,
    onTrackEnd,
    next,
    previous,
  } = usePlayerStore();

  // Initialize audio element and store reference
  useEffect(() => {
    if (audioRef.current) {
      setAudioRef(audioRef.current);
      audioRef.current.volume = isMuted ? 0 : volume;
    }

    return () => {
      setAudioRef(null);
    };
  }, [setAudioRef]);

  // Sync volume with audio element
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  // Handle time update
  const handleTimeUpdate = useCallback(() => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  }, [setCurrentTime]);

  // Handle loaded metadata
  const handleLoadedMetadata = useCallback(() => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  }, [setDuration]);

  // Handle track end
  const handleEnded = useCallback(() => {
    onTrackEnd();
  }, [onTrackEnd]);

  // Keyboard controls
  const handleKeyDown = useCallback(
    (e) => {
      // Ignore if user is typing in an input
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") {
        return;
      }

      const currentTime = audioRef.current?.currentTime || 0;
      const duration = audioRef.current?.duration || 0;

      switch (e.code) {
        case "Space":
          e.preventDefault();
          togglePlay();
          break;

        case "ArrowLeft":
          e.preventDefault();
          seek(Math.max(0, currentTime - SEEK_STEP));
          break;

        case "ArrowRight":
          e.preventDefault();
          seek(Math.min(duration, currentTime + SEEK_STEP));
          break;

        case "ArrowUp":
          e.preventDefault();
          setVolume(Math.min(1, volume + VOLUME_STEP));
          break;

        case "ArrowDown":
          e.preventDefault();
          setVolume(Math.max(0, volume - VOLUME_STEP));
          break;

        case "KeyM":
          e.preventDefault();
          toggleMute();
          break;

        case "KeyN":
          e.preventDefault();
          next();
          break;

        case "KeyP":
          e.preventDefault();
          previous();
          break;

        default:
          break;
      }
    },
    [togglePlay, seek, setVolume, volume, toggleMute, next, previous]
  );

  // Attach global keyboard listener
  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return {
    audioRef,
    handleTimeUpdate,
    handleLoadedMetadata,
    handleEnded,
  };
};

export default useAudioController;
