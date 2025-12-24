import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import MobileNav from "./MobileNav";
import MiniPlayer from "../player/MiniPlayer";
import usePlayerStore from "../../store/playerStore";

const Layout = () => {
  const { currentTrack } = usePlayerStore();

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex">
      {/* Desktop Sidebar */}
      <Sidebar className="hidden lg:flex" />

      {/* Main Content */}
      <main
        className="flex-1 overflow-y-auto"
        style={{
          paddingBottom: currentTrack
            ? "calc(var(--player-height) + 1rem)"
            : "1rem",
          marginBottom: "env(safe-area-inset-bottom)",
        }}
      >
        <div className="min-h-full pb-20 lg:pb-4">
          <Outlet />
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <MobileNav className="lg:hidden" />

      {/* Mini Player */}
      {currentTrack && <MiniPlayer />}
    </div>
  );
};

export default Layout;
