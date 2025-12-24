import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useEffect } from "react";
import useAuthStore from "./store/authStore";
import usePlayerStore from "./store/playerStore";

// Layout
import Layout from "./components/layout/Layout";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Browse from "./pages/Browse";
import Podcasts from "./pages/Podcasts";
import PodcastDetail from "./pages/PodcastDetail";
import Playlists from "./pages/Playlists";
import PlaylistDetail from "./pages/PlaylistDetail";
import Search from "./pages/Search";
import Favorites from "./pages/Favorites";
import RecentlyPlayed from "./pages/RecentlyPlayed";

// Admin Pages
import AdminDashboard from "./pages/admin/Dashboard";
import UploadTrack from "./pages/admin/UploadTrack";
import UploadPodcast from "./pages/admin/UploadPodcast";

// Components
import ProtectedRoute from "./components/common/ProtectedRoute";
import AdminRoute from "./components/common/AdminRoute";
import Loader from "./components/common/Loader";

function App() {
  const { initialize, isLoading, isAuthenticated } = useAuthStore();
  const { setAudioRef, onTrackEnd, setCurrentTime, setDuration } =
    usePlayerStore();

  // Initialize auth on mount
  useEffect(() => {
    initialize();
  }, [initialize]);

  // Setup global audio element
  useEffect(() => {
    const audio = new Audio();
    audio.preload = "auto"; // Changed from metadata to auto for faster loading
    audio.crossOrigin = "anonymous"; // Help with CORS

    // Audio event listeners
    audio.addEventListener("timeupdate", () => {
      setCurrentTime(audio.currentTime);
    });

    audio.addEventListener("loadedmetadata", () => {
      setDuration(audio.duration);
    });

    audio.addEventListener("canplay", () => {
      console.log("Audio ready to play");
    });

    audio.addEventListener("waiting", () => {
      console.log("Audio buffering...");
    });

    audio.addEventListener("error", (e) => {
      console.error("Audio error:", audio.error?.message || "Unknown error");
    });

    audio.addEventListener("ended", onTrackEnd);

    // Set reference in store
    setAudioRef(audio);

    // Cleanup
    return () => {
      audio.pause();
      audio.src = "";
    };
  }, [setAudioRef, setCurrentTime, setDuration, onTrackEnd]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/" replace /> : <Login />}
        />
        <Route
          path="/signup"
          element={isAuthenticated ? <Navigate to="/" replace /> : <Signup />}
        />

        {/* Protected routes with Layout */}
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/browse" element={<Browse />} />
            <Route path="/podcasts" element={<Podcasts />} />
            <Route path="/podcasts/:id" element={<PodcastDetail />} />
            <Route path="/playlists" element={<Playlists />} />
            <Route path="/playlists/:id" element={<PlaylistDetail />} />
            <Route path="/search" element={<Search />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/recently-played" element={<RecentlyPlayed />} />

            {/* Admin routes */}
            <Route element={<AdminRoute />}>
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/upload/track" element={<UploadTrack />} />
              <Route path="/admin/upload/podcast" element={<UploadPodcast />} />
            </Route>
          </Route>
        </Route>

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
