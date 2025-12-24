import { Link } from "react-router-dom";
import { Music, Podcast, Upload, Users, BarChart } from "lucide-react";
import Button from "../../components/common/Button";

const AdminDashboard = () => {
  const stats = [
    { label: "Total Tracks", value: "—", icon: Music },
    { label: "Total Podcasts", value: "—", icon: Podcast },
    { label: "Total Users", value: "—", icon: Users },
  ];

  const actions = [
    {
      label: "Upload Track",
      description: "Add new music to the library",
      icon: Music,
      path: "/admin/upload/track",
      color: "from-green-500 to-emerald-600",
    },
    {
      label: "Upload Podcast",
      description: "Add new podcasts and episodes",
      icon: Podcast,
      path: "/admin/upload/podcast",
      color: "from-purple-500 to-indigo-600",
    },
  ];

  return (
    <div className="p-6 lg:p-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-[var(--bg-secondary)] rounded-xl p-6 flex items-center gap-4"
          >
            <div className="w-12 h-12 rounded-lg bg-[var(--accent-primary)]/20 flex items-center justify-center">
              <stat.icon className="w-6 h-6 text-[var(--accent-primary)]" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-[var(--text-secondary)] text-sm">
                {stat.label}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {actions.map((action) => (
          <Link
            key={action.path}
            to={action.path}
            className="group bg-[var(--bg-secondary)] rounded-xl p-6 hover:bg-[var(--bg-tertiary)] transition-colors"
          >
            <div
              className={`w-14 h-14 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center mb-4`}
            >
              <action.icon className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-lg font-semibold mb-1">{action.label}</h3>
            <p className="text-[var(--text-secondary)] text-sm">
              {action.description}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
