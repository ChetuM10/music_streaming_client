import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useEffect, lazy, Suspense } from "react";
import useAuthStore from "./store/authStore";
import usePlayerStore from "./store/playerStore";

// Layout (always loaded)
import Layout from "./components/layout/Layout";
import Loader from "./components/common/Loader";
import ErrorBoundary from "./components/common/ErrorBoundary";

// Lazy-loaded pages for code splitting
const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));
const Browse = lazy(() => import("./pages/Browse"));
const Podcasts = lazy(() => import("./pages/Podcasts"));
const PodcastDetail = lazy(() => import("./pages/PodcastDetail"));
const Playlists = lazy(() => import("./pages/Playlists"));
const PlaylistDetail = lazy(() => import("./pages/PlaylistDetail"));
const Search = lazy(() => import("./pages/Search"));
const Favorites = lazy(() => import("./pages/Favorites"));
const RecentlyPlayed = lazy(() => import("./pages/RecentlyPlayed"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const ArtistDashboard = lazy(() => import("./pages/ArtistDashboard"));
const Discover = lazy(() => import("./pages/Discover"));

// Admin Pages (lazy-loaded)
const AdminDashboard = lazy(() => import("./pages/admin/Dashboard"));
const UploadTrack = lazy(() => import("./pages/admin/UploadTrack"));
const UploadPodcast = lazy(() => import("./pages/admin/UploadPodcast"));

// Components
import ProtectedRoute from "./components/common/ProtectedRoute";
import AdminRoute from "./components/common/AdminRoute";

// Loading fallback for Suspense
const PageLoader = () => (
  <div>
    <Loader size="lg" />
  </div>
);

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
    audio.preload = "auto";
    audio.crossOrigin = "anonymous";

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
      if (audio.src && audio.src !== window.location.href) {
        console.error("Audio error:", audio.error?.message || "Unknown error");
      }
    });

    audio.addEventListener("ended", onTrackEnd);

    setAudioRef(audio);

    return () => {
      audio.pause();
      audio.src = "";
    };
  }, [setAudioRef, setCurrentTime, setDuration, onTrackEnd]);

  if (isLoading) {
    return (
      <div>
        <Loader size="lg" />
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <Router>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Public routes */}
            <Route
              path="/login"
              element={
                isAuthenticated ? <Navigate to="/" replace /> : <Login />
              }
            />
            <Route
              path="/signup"
              element={
                isAuthenticated ? <Navigate to="/" replace /> : <Signup />
              }
            />
            <Route path="/privacy" element={<PrivacyPolicy />} />

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
                <Route path="/discover" element={<Discover />} />

                {/* Artist routes */}
                <Route path="/artist/dashboard" element={<ArtistDashboard />} />

                {/* Admin routes */}
                <Route element={<AdminRoute />}>
                  <Route path="/admin" element={<AdminDashboard />} />
                  <Route path="/admin/upload/track" element={<UploadTrack />} />
                  <Route
                    path="/admin/upload/podcast"
                    element={<UploadPodcast />}
                  />
                </Route>
              </Route>
            </Route>

            {/* Catch all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
