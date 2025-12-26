import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { io } from "socket.io-client";
import useAuthStore from "../store/authStore";

const SocketContext = createContext(null);

const SOCKET_URL =
  import.meta.env.VITE_API_URL?.replace("/api", "") || "http://localhost:5000";

/**
 * Socket Provider Component
 *
 * Provides real-time features:
 * - Currently listening indicator
 * - Real-time like counts
 * - Collaborative playlist updates
 * - User presence (online/offline)
 */
export const SocketProvider = ({ children }) => {
  const { token, isAuthenticated } = useAuthStore();
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [listeningUsers, setListeningUsers] = useState(new Map());

  // Connect to socket when authenticated
  useEffect(() => {
    if (!isAuthenticated || !token) {
      if (socket) {
        socket.disconnect();
        setSocket(null);
        setIsConnected(false);
      }
      return;
    }

    const newSocket = io(SOCKET_URL, {
      auth: { token },
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    newSocket.on("connect", () => {
      console.log("[Socket] Connected");
      setIsConnected(true);
    });

    newSocket.on("disconnect", () => {
      console.log("[Socket] Disconnected");
      setIsConnected(false);
    });

    newSocket.on("connect_error", (error) => {
      console.error("[Socket] Connection error:", error.message);
    });

    // Online users
    newSocket.on("users:online", (users) => {
      setOnlineUsers(users);
    });

    newSocket.on("user:online", (user) => {
      setOnlineUsers((prev) => [...prev, user]);
    });

    newSocket.on("user:offline", ({ userId }) => {
      setOnlineUsers((prev) => prev.filter((u) => u.userId !== userId));
      setListeningUsers((prev) => {
        const updated = new Map(prev);
        updated.delete(userId);
        return updated;
      });
    });

    // Currently listening
    newSocket.on("user:listening", ({ userId, username, track }) => {
      setListeningUsers((prev) => {
        const updated = new Map(prev);
        updated.set(userId, { username, track });
        return updated;
      });
    });

    newSocket.on("user:paused", ({ userId }) => {
      setListeningUsers((prev) => {
        const updated = new Map(prev);
        updated.delete(userId);
        return updated;
      });
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [isAuthenticated, token]);

  // Emit track playing
  const emitTrackPlaying = useCallback(
    (trackData) => {
      if (socket && isConnected) {
        socket.emit("track:playing", trackData);
      }
    },
    [socket, isConnected]
  );

  // Emit track paused
  const emitTrackPaused = useCallback(() => {
    if (socket && isConnected) {
      socket.emit("track:paused");
    }
  }, [socket, isConnected]);

  // Emit like
  const emitLike = useCallback(
    (trackId) => {
      if (socket && isConnected) {
        socket.emit("track:like", { trackId });
      }
    },
    [socket, isConnected]
  );

  // Emit unlike
  const emitUnlike = useCallback(
    (trackId) => {
      if (socket && isConnected) {
        socket.emit("track:unlike", { trackId });
      }
    },
    [socket, isConnected]
  );

  // Join playlist room
  const joinPlaylistRoom = useCallback(
    (playlistId) => {
      if (socket && isConnected) {
        socket.emit("playlist:join", { playlistId });
      }
    },
    [socket, isConnected]
  );

  // Leave playlist room
  const leavePlaylistRoom = useCallback(
    (playlistId) => {
      if (socket && isConnected) {
        socket.emit("playlist:leave", { playlistId });
      }
    },
    [socket, isConnected]
  );

  // Subscribe to playlist events
  const onPlaylistTrackAdded = useCallback(
    (callback) => {
      if (socket) {
        socket.on("playlist:track-added", callback);
        return () => socket.off("playlist:track-added", callback);
      }
    },
    [socket]
  );

  const onPlaylistTrackRemoved = useCallback(
    (callback) => {
      if (socket) {
        socket.on("playlist:track-removed", callback);
        return () => socket.off("playlist:track-removed", callback);
      }
    },
    [socket]
  );

  // Subscribe to like events
  const onTrackLiked = useCallback(
    (callback) => {
      if (socket) {
        socket.on("track:liked", callback);
        return () => socket.off("track:liked", callback);
      }
    },
    [socket]
  );

  const onTrackUnliked = useCallback(
    (callback) => {
      if (socket) {
        socket.on("track:unliked", callback);
        return () => socket.off("track:unliked", callback);
      }
    },
    [socket]
  );

  const value = {
    socket,
    isConnected,
    onlineUsers,
    listeningUsers,
    emitTrackPlaying,
    emitTrackPaused,
    emitLike,
    emitUnlike,
    joinPlaylistRoom,
    leavePlaylistRoom,
    onPlaylistTrackAdded,
    onPlaylistTrackRemoved,
    onTrackLiked,
    onTrackUnliked,
  };

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
};

/**
 * Hook to use socket context
 */
export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};

export default SocketContext;
