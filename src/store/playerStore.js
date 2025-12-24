import { create } from "zustand";
import { shuffleArray } from "../lib/utils";

const usePlayerStore = create((set, get) => ({
  // Current track/episode
  currentTrack: null,
  currentType: "track", // 'track' | 'episode'

  // Playback state
  isPlaying: false,
  currentTime: 0,
  duration: 0,
  volume: 0.8,
  isMuted: false,

  // Queue
  queue: [],
  originalQueue: [], // For unshuffle
  queueIndex: 0,

  // Modes
  isShuffled: false,
  repeatMode: "none", // 'none' | 'one' | 'all'

  // Audio element reference (set from component)
  audioRef: null,

  // Set audio reference
  setAudioRef: (ref) => set({ audioRef: ref }),

  // Play a track
  play: (track, type = "track") => {
    const { audioRef } = get();

    set({
      currentTrack: track,
      currentType: type,
      isPlaying: true,
      currentTime: 0,
    });

    if (audioRef) {
      audioRef.src = track.audio_url;
      audioRef.play().catch(console.error);
    }
  },

  // Play a list of tracks (e.g., playlist, album)
  playList: (tracks, startIndex = 0, type = "track") => {
    const { isShuffled } = get();

    let queue = [...tracks];
    let index = startIndex;

    if (isShuffled) {
      // Move current track to front, shuffle rest
      const current = queue.splice(startIndex, 1)[0];
      queue = [current, ...shuffleArray(queue)];
      index = 0;
    }

    set({
      queue,
      originalQueue: [...tracks],
      queueIndex: index,
      currentTrack: queue[index],
      currentType: type,
      isPlaying: true,
      currentTime: 0,
    });

    const { audioRef } = get();
    if (audioRef) {
      audioRef.src = queue[index].audio_url;
      audioRef.play().catch(console.error);
    }
  },

  // Toggle play/pause
  togglePlay: () => {
    const { audioRef, isPlaying, currentTrack } = get();

    if (!currentTrack) return;

    if (isPlaying) {
      audioRef?.pause();
    } else {
      audioRef?.play().catch(console.error);
    }

    set({ isPlaying: !isPlaying });
  },

  // Pause
  pause: () => {
    const { audioRef } = get();
    audioRef?.pause();
    set({ isPlaying: false });
  },

  // Resume
  resume: () => {
    const { audioRef, currentTrack } = get();
    if (!currentTrack) return;

    audioRef?.play().catch(console.error);
    set({ isPlaying: true });
  },

  // Next track
  next: () => {
    const { queue, queueIndex, repeatMode, audioRef } = get();

    if (queue.length === 0) return;

    let nextIndex = queueIndex + 1;

    if (nextIndex >= queue.length) {
      if (repeatMode === "all") {
        nextIndex = 0;
      } else {
        // End of queue
        set({ isPlaying: false });
        return;
      }
    }

    const nextTrack = queue[nextIndex];

    set({
      queueIndex: nextIndex,
      currentTrack: nextTrack,
      currentTime: 0,
      isPlaying: true,
    });

    if (audioRef) {
      audioRef.src = nextTrack.audio_url;
      audioRef.play().catch(console.error);
    }
  },

  // Previous track
  previous: () => {
    const { queue, queueIndex, currentTime, audioRef } = get();

    // If more than 3 seconds in, restart current track
    if (currentTime > 3) {
      if (audioRef) {
        audioRef.currentTime = 0;
      }
      set({ currentTime: 0 });
      return;
    }

    if (queue.length === 0 || queueIndex === 0) return;

    const prevIndex = queueIndex - 1;
    const prevTrack = queue[prevIndex];

    set({
      queueIndex: prevIndex,
      currentTrack: prevTrack,
      currentTime: 0,
      isPlaying: true,
    });

    if (audioRef) {
      audioRef.src = prevTrack.audio_url;
      audioRef.play().catch(console.error);
    }
  },

  // Seek to time
  seek: (time) => {
    const { audioRef } = get();
    if (audioRef) {
      audioRef.currentTime = time;
    }
    set({ currentTime: time });
  },

  // Update current time (called from audio element)
  setCurrentTime: (time) => set({ currentTime: time }),

  // Set duration (called from audio element)
  setDuration: (duration) => set({ duration }),

  // Set volume
  setVolume: (volume) => {
    const { audioRef } = get();
    if (audioRef) {
      audioRef.volume = volume;
    }
    set({ volume, isMuted: volume === 0 });
  },

  // Toggle mute
  toggleMute: () => {
    const { audioRef, isMuted, volume } = get();

    if (audioRef) {
      audioRef.volume = isMuted ? volume : 0;
    }

    set({ isMuted: !isMuted });
  },

  // Toggle shuffle
  toggleShuffle: () => {
    const { isShuffled, queue, originalQueue, currentTrack } = get();

    if (isShuffled) {
      // Unshuffle - restore original order
      const currentIndex = originalQueue.findIndex(
        (t) => t.id === currentTrack?.id
      );
      set({
        isShuffled: false,
        queue: [...originalQueue],
        queueIndex: currentIndex >= 0 ? currentIndex : 0,
      });
    } else {
      // Shuffle - move current to front, shuffle rest
      if (queue.length > 0 && currentTrack) {
        const rest = queue.filter((t) => t.id !== currentTrack.id);
        const shuffled = [currentTrack, ...shuffleArray(rest)];
        set({
          isShuffled: true,
          queue: shuffled,
          queueIndex: 0,
        });
      } else {
        set({ isShuffled: true });
      }
    }
  },

  // Toggle repeat mode
  toggleRepeat: () => {
    const { repeatMode } = get();
    const modes = ["none", "all", "one"];
    const currentIndex = modes.indexOf(repeatMode);
    const nextMode = modes[(currentIndex + 1) % modes.length];
    set({ repeatMode: nextMode });
  },

  // Add to queue
  addToQueue: (track) => {
    set((state) => ({
      queue: [...state.queue, track],
      originalQueue: [...state.originalQueue, track],
    }));
  },

  // Clear queue
  clearQueue: () => {
    set({
      queue: [],
      originalQueue: [],
      queueIndex: 0,
    });
  },

  // Handle track end
  onTrackEnd: () => {
    const { repeatMode, audioRef } = get();

    if (repeatMode === "one") {
      // Repeat current track
      if (audioRef) {
        audioRef.currentTime = 0;
        audioRef.play().catch(console.error);
      }
    } else {
      // Go to next
      get().next();
    }
  },
}));

export default usePlayerStore;
