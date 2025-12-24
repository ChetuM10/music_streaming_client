import { NavLink } from "react-router-dom";
import { Home, Search, Library, Podcast, User } from "lucide-react";
import { cn } from "../../lib/utils";
import usePlayerStore from "../../store/playerStore";

const MobileNav = ({ className }) => {
  const { currentTrack } = usePlayerStore();

  const navItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: Search, label: "Search", path: "/search" },
    { icon: Library, label: "Library", path: "/playlists" },
    { icon: Podcast, label: "Podcasts", path: "/podcasts" },
    { icon: User, label: "Profile", path: "/favorites" },
  ];

  return (
    <nav
      className={cn(
        "fixed bottom-0 left-0 right-0 bg-[var(--bg-secondary)] border-t border-[var(--border-light)]",
        "z-40",
        currentTrack && "bottom-[var(--player-height)]",
        className
      )}
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <ul className="flex justify-around items-center py-2">
        {navItems.map((item) => (
          <li key={item.path}>
            <NavLink
              to={item.path}
              className={({ isActive }) =>
                cn(
                  "flex flex-col items-center gap-1 px-4 py-2 transition-colors",
                  isActive ? "text-white" : "text-[var(--text-muted)]"
                )
              }
            >
              <item.icon className="w-6 h-6" />
              <span className="text-xs font-medium">{item.label}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default MobileNav;
