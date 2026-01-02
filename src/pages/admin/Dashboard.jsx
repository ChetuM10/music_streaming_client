import { Link } from "react-router-dom";
import { Music, Podcast, Upload, Users } from "lucide-react";

const AdminDashboard = () => {
  const stats = [
    { label: "Total Tracks", value: "—", icon: Music, color: "text-teal-400" },
    {
      label: "Total Podcasts",
      value: "—",
      icon: Podcast,
      color: "text-purple-400",
    },
    { label: "Total Users", value: "—", icon: Users, color: "text-cyan-400" },
  ];

  const actions = [
    {
      label: "Upload Track",
      description: "Add new music to the library",
      icon: Music,
      path: "/admin/upload/track",
      gradient: "from-teal-500 to-cyan-500",
    },
    {
      label: "Upload Podcast",
      description: "Add new podcasts and episodes",
      icon: Podcast,
      path: "/admin/upload/podcast",
      gradient: "from-purple-500 to-pink-500",
    },
  ];

  return (
    <div className="p-6 lg:p-8 animate-fade-in">
      <h1 className="text-3xl font-bold text-moonlight mb-8">
        Admin Dashboard
      </h1>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
        {stats.map((stat) => (
          <div key={stat.label} className="glass p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-slate-800 flex items-center justify-center">
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-100">{stat.value}</p>
              <p className="text-slate-500 text-sm">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <h2 className="text-xl font-bold text-slate-100 mb-4">Quick Actions</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {actions.map((action) => (
          <Link
            key={action.path}
            to={action.path}
            className="group glass hover:bg-slate-800/60 p-6 transition-all"
          >
            <div
              className={`w-14 h-14 rounded-xl bg-gradient-to-br ${action.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform glow-teal-sm`}
            >
              <action.icon className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-lg font-semibold mb-1 text-slate-100 group-hover:text-teal-400 transition-colors">
              {action.label}
            </h3>
            <p className="text-slate-500 text-sm">{action.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
