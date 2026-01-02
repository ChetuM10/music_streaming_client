import { NavLink, useNavigate } from "react-router-dom";
import {
  Home,
  Search,
  Library,
  Heart,
  Clock,
  PlusCircle,
  ListMusic,
  Compass,
  Mic2,
  Music2,
  LogOut,
  Settings,
  Shield,
} from "lucide-react";
import useAuthStore from "../../store/authStore";

const Sidebar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const mainLinks = [
    { to: "/", icon: Home, label: "Home" },
    { to: "/search", icon: Search, label: "Search" },
    { to: "/browse", icon: Library, label: "Browse" },
    { to: "/discover", icon: Compass, label: "Discover" },
  ];

  const libraryLinks = [
    { to: "/playlists", icon: ListMusic, label: "Playlists" },
    { to: "/favorites", icon: Heart, label: "Liked Songs" },
    { to: "/recently-played", icon: Clock, label: "Recently Played" },
    { to: "/podcasts", icon: Mic2, label: "Podcasts" },
  ];

  return (
    <div className="sidebar flex flex-col h-full">
      {/* Logo */}
      <div className="p-6">
        <NavLink to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center glow-teal-sm">
            <Music2 className="w-6 h-6 text-black" />
          </div>
          <span className="text-xl font-bold text-moonlight">Melodify</span>
        </NavLink>
      </div>

      {/* Main Navigation */}
      <nav className="px-3 mb-6">
        {mainLinks.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? "active" : ""}`
            }
          >
            <link.icon className="w-5 h-5" />
            <span>{link.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Divider */}
      <div className="divider mx-4" />

      {/* Your Library */}
      <div className="px-4 mb-2">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
          Your Library
        </h3>
      </div>
      <nav className="px-3 flex-1 overflow-y-auto hide-scrollbar">
        {libraryLinks.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? "active" : ""}`
            }
          >
            <link.icon className="w-5 h-5" />
            <span>{link.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Bottom Section */}
      <div className="mt-auto p-4 border-t border-slate-800/50">
        {/* Admin Link */}
        {user?.role === "admin" && (
          <NavLink
            to="/admin"
            className={({ isActive }) =>
              `sidebar-link mb-3 ${isActive ? "active" : ""}`
            }
          >
            <Shield className="w-5 h-5" />
            <span>Admin</span>
          </NavLink>
        )}

        {/* User Info Card */}
        <div
          className="glass-subtle rounded-xl p-3 mb-3"
          style={{
            background: "rgba(15, 23, 42, 0.6)",
            border: "1px solid rgba(45, 212, 191, 0.1)",
          }}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center text-sm font-bold text-black shadow-lg flex-shrink-0">
              {user?.username?.charAt(0).toUpperCase() || "U"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-100 truncate">
                {user?.username || "User"}
              </p>
              <p className="text-xs text-slate-500 truncate">{user?.email}</p>
            </div>
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-2.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200"
        >
          <LogOut className="w-5 h-5" />
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
