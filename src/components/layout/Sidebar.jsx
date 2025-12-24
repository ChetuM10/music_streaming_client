import { NavLink, useNavigate } from "react-router-dom";
import {
  Home,
  Search,
  Library,
  PlusSquare,
  Heart,
  Music2,
  Podcast,
  Clock,
  Settings,
  LogOut,
  User,
  LayoutDashboard,
} from "lucide-react";
import useAuthStore from "../../store/authStore";
import { cn } from "../../lib/utils";

const Sidebar = ({ className }) => {
  const { profile, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const mainNavItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: Search, label: "Search", path: "/search" },
    { icon: Music2, label: "Browse", path: "/browse" },
    { icon: Podcast, label: "Podcasts", path: "/podcasts" },
  ];

  const libraryItems = [
    { icon: Library, label: "Your Playlists", path: "/playlists" },
    { icon: Heart, label: "Liked Songs", path: "/favorites" },
    { icon: Clock, label: "Recently Played", path: "/recently-played" },
  ];

  const adminItems = profile?.is_admin
    ? [{ icon: LayoutDashboard, label: "Admin Dashboard", path: "/admin" }]
    : [];

  return (
    <aside
      className={cn(
        "w-[var(--sidebar-width)] bg-black flex flex-col h-screen sticky top-0",
        className
      )}
    >
      {/* Logo */}
      <div className="p-6">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-[var(--accent-primary)] rounded-lg flex items-center justify-center">
            <Music2 className="w-6 h-6 text-black" />
          </div>
          <span className="text-xl font-bold">Melodify</span>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="px-3">
        <ul className="space-y-1">
          {mainNavItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-4 px-4 py-3 rounded-lg transition-colors",
                    "text-[var(--text-secondary)] hover:text-white",
                    isActive && "bg-[var(--bg-tertiary)] text-white"
                  )
                }
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Library Section */}
      <div className="mt-6 px-3 flex-1">
        <div className="flex items-center justify-between px-4 mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
            Your Library
          </span>
          <button className="text-[var(--text-muted)] hover:text-white transition-colors">
            <PlusSquare className="w-5 h-5" />
          </button>
        </div>

        <ul className="space-y-1">
          {libraryItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-4 px-4 py-3 rounded-lg transition-colors",
                    "text-[var(--text-secondary)] hover:text-white",
                    isActive && "bg-[var(--bg-tertiary)] text-white"
                  )
                }
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Admin Section */}
        {adminItems.length > 0 && (
          <div className="mt-6">
            <div className="px-4 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                Admin
              </span>
            </div>
            <ul className="space-y-1">
              {adminItems.map((item) => (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      cn(
                        "flex items-center gap-4 px-4 py-3 rounded-lg transition-colors",
                        "text-[var(--text-secondary)] hover:text-white",
                        isActive && "bg-[var(--bg-tertiary)] text-white"
                      )
                    }
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* User Profile & Logout */}
      <div className="p-3 border-t border-[var(--border-light)]">
        <div className="flex items-center gap-3 px-4 py-3">
          <div className="w-8 h-8 rounded-full bg-[var(--bg-tertiary)] flex items-center justify-center overflow-hidden">
            {profile?.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt=""
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="w-4 h-4 text-[var(--text-muted)]" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">
              {profile?.username || "User"}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="text-[var(--text-muted)] hover:text-white transition-colors"
            title="Logout"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
