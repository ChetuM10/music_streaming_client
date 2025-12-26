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
        "w-[var(--sidebar-width)] bg-black/95 backdrop-blur-xl flex flex-col h-screen sticky top-0",
        "border-r border-white/[0.05]",
        className
      )}
    >
      {/* Logo */}
      <div className="p-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-[var(--accent-primary)] to-[#1ed760] rounded-xl flex items-center justify-center shadow-lg shadow-[var(--accent-primary)]/20">
            <Music2 className="w-6 h-6 text-black" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-white to-white/70 bg-clip-text">
            Melodify
          </span>
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
                    "flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200",
                    "text-[var(--text-secondary)] hover:text-white hover:bg-white/[0.06]",
                    isActive &&
                      "bg-gradient-to-r from-[var(--accent-primary)]/10 to-transparent text-white border-l-2 border-[var(--accent-primary)]"
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <item.icon
                      className={cn(
                        "w-5 h-5 transition-colors",
                        isActive && "text-[var(--accent-primary)]"
                      )}
                    />
                    <span className="font-medium">{item.label}</span>
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Library Section */}
      <div className="mt-8 px-3 flex-1">
        <div className="flex items-center justify-between px-4 mb-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
            Your Library
          </span>
          <button className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-white hover:bg-white/[0.06] transition-all">
            <PlusSquare className="w-4 h-4" />
          </button>
        </div>

        <ul className="space-y-1">
          {libraryItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200",
                    "text-[var(--text-secondary)] hover:text-white hover:bg-white/[0.06]",
                    isActive &&
                      "bg-gradient-to-r from-[var(--accent-primary)]/10 to-transparent text-white border-l-2 border-[var(--accent-primary)]"
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <item.icon
                      className={cn(
                        "w-5 h-5 transition-colors",
                        isActive && "text-[var(--accent-primary)]"
                      )}
                    />
                    <span className="font-medium">{item.label}</span>
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Admin Section */}
        {adminItems.length > 0 && (
          <div className="mt-8">
            <div className="px-4 mb-3">
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
                        "flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200",
                        "text-[var(--text-secondary)] hover:text-white hover:bg-white/[0.06]",
                        isActive &&
                          "bg-gradient-to-r from-purple-500/10 to-transparent text-white border-l-2 border-purple-500"
                      )
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <item.icon
                          className={cn(
                            "w-5 h-5 transition-colors",
                            isActive && "text-purple-400"
                          )}
                        />
                        <span className="font-medium">{item.label}</span>
                      </>
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* User Profile & Logout */}
      <div className="p-3 border-t border-white/[0.05]">
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/[0.04] transition-colors cursor-pointer group">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--accent-primary)] to-[#1ed760] flex items-center justify-center overflow-hidden ring-2 ring-white/10">
            {profile?.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt=""
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="w-5 h-5 text-black" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold truncate group-hover:text-white transition-colors">
              {profile?.username || "User"}
            </p>
            <p className="text-xs text-[var(--text-muted)]">Free account</p>
          </div>
          <button
            onClick={handleLogout}
            className="p-2 rounded-lg text-[var(--text-muted)] hover:text-red-400 hover:bg-red-500/10 transition-all"
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
