import { NavLink } from "react-router-dom";
import { Home, Search, Library, Heart, User } from "lucide-react";

const MobileNav = () => {
  const links = [
    { to: "/", icon: Home, label: "Home" },
    { to: "/search", icon: Search, label: "Search" },
    { to: "/browse", icon: Library, label: "Browse" },
    { to: "/favorites", icon: Heart, label: "Favorites" },
    { to: "/playlists", icon: User, label: "Library" },
  ];

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-40"
      style={{
        background: "rgba(10, 15, 26, 0.95)",
        backdropFilter: "blur(20px)",
        borderTop: "1px solid rgba(148, 163, 184, 0.1)",
      }}
    >
      <div className="flex items-center justify-around py-2">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 py-2 px-4 rounded-lg transition-all ${
                isActive
                  ? "text-teal-400"
                  : "text-slate-400 hover:text-slate-200"
              }`
            }
          >
            <link.icon className="w-5 h-5" />
            <span className="text-xs">{link.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default MobileNav;
