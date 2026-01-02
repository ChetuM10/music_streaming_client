import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import MobileNav from "./MobileNav";
import MediaPlayerBar from "../player/MediaPlayerBar";
import usePlayerStore from "../../store/playerStore";
import useAuthStore from "../../store/authStore";

const Layout = () => {
  const location = useLocation();
  const { currentTrack } = usePlayerStore();
  const { isAuthenticated } = useAuthStore();
  const isAuthPage =
    location.pathname === "/login" || location.pathname === "/signup";

  if (isAuthPage) {
    return <Outlet />;
  }

  return (
    <div className="min-h-screen forest-bg relative">
      {/* Noise Overlay */}
      <div className="noise-overlay" />

      {/* Ambient Fireflies */}
      <div
        className="firefly firefly-gold"
        style={{ top: "15%", left: "10%", animationDelay: "0s" }}
      />
      <div
        className="firefly firefly-green"
        style={{ top: "25%", left: "85%", animationDelay: "1.5s" }}
      />
      <div
        className="firefly firefly-blue"
        style={{ top: "60%", left: "5%", animationDelay: "3s" }}
      />
      <div
        className="firefly firefly-gold"
        style={{ top: "70%", left: "90%", animationDelay: "4.5s" }}
      />
      <div
        className="firefly firefly-green"
        style={{ top: "40%", left: "75%", animationDelay: "2s" }}
      />
      <div
        className="firefly firefly-blue"
        style={{ top: "85%", left: "20%", animationDelay: "5s" }}
      />

      <div className="flex relative z-10">
        {/* Desktop Sidebar */}
        <aside className="hidden md:block w-64 flex-shrink-0">
          <Sidebar />
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-h-screen pb-32 md:pb-24">
          <Outlet />
        </main>
      </div>

      {/* Mobile Navigation */}
      <MobileNav />

      {/* Player */}
      {isAuthenticated && currentTrack && <MediaPlayerBar />}
    </div>
  );
};

export default Layout;
