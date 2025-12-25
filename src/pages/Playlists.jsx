import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Plus, Music2, X, Loader2 } from "lucide-react";
import Button from "../components/common/Button";
import Input from "../components/common/Input";
import { EmptyPlaylist } from "../components/common/EmptyState";
import { Loader, SkeletonCard } from "../components/common/Loader";
import api from "../lib/api";

const Playlists = () => {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    fetchPlaylists();
  }, []);

  const fetchPlaylists = async () => {
    try {
      const response = await api.get("/playlists");
      setPlaylists(response.data.data || []);
    } catch (err) {
      console.error("Failed to fetch playlists:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError("Playlist name is required");
      return;
    }

    setCreating(true);
    setError("");

    try {
      const response = await api.post("/playlists", formData);
      setPlaylists([response.data.data, ...playlists]);
      setShowModal(false);
      setFormData({ name: "", description: "" });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create playlist");
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this playlist?")) return;

    try {
      await api.delete(`/playlists/${id}`);
      setPlaylists(playlists.filter((p) => p.id !== id));
    } catch (err) {
      console.error("Failed to delete playlist:", err);
    }
  };

  if (loading) {
    return (
      <div className="p-6 lg:p-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Your Playlists</h1>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {[...Array(6)].map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Your Playlists</h1>
        <Button icon={Plus} onClick={() => setShowModal(true)}>
          Create Playlist
        </Button>
      </div>

      {playlists.length === 0 ? (
        <EmptyPlaylist
          action={
            <Button
              variant="secondary"
              icon={Plus}
              onClick={() => setShowModal(true)}
            >
              Create your first playlist
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {playlists.map((playlist) => (
            <PlaylistCard
              key={playlist.id}
              playlist={playlist}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Create Playlist Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="bg-[var(--bg-secondary)] rounded-xl p-6 w-full max-w-md mx-4 animate-scale-up">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Create Playlist</h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreate}>
              <Input
                label="Playlist Name"
                placeholder="My Awesome Playlist"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                error={error}
              />

              <div className="mt-4">
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                  Description (optional)
                </label>
                <textarea
                  placeholder="Add a description..."
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-[var(--bg-elevated)] border border-white/10 rounded-lg 
                           text-white placeholder-gray-500 focus:outline-none focus:border-[var(--accent-primary)]
                           resize-none h-24"
                />
              </div>

              <div className="flex gap-3 mt-6">
                <Button
                  type="button"
                  variant="secondary"
                  className="flex-1"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" className="flex-1" disabled={creating}>
                  {creating ? (
                    <>
                      <Loader2 size={18} className="animate-spin mr-2" />
                      Creating...
                    </>
                  ) : (
                    "Create"
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// Playlist Card Component
const PlaylistCard = ({ playlist, onDelete }) => {
  return (
    <div className="group relative bg-[var(--bg-elevated)] rounded-lg p-4 hover:bg-[var(--bg-hover)] transition-all duration-300">
      <Link to={`/playlists/${playlist.id}`}>
        <div className="aspect-square rounded-lg overflow-hidden mb-3 bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
          {playlist.cover_url ? (
            <img
              src={playlist.cover_url}
              alt={playlist.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <Music2 size={48} className="text-white/60" />
          )}
        </div>

        <h3 className="font-semibold truncate group-hover:text-[var(--accent-primary)] transition-colors">
          {playlist.name}
        </h3>
        <p className="text-sm text-[var(--text-secondary)] truncate">
          {playlist.description || "Playlist"}
        </p>
      </Link>

      {/* Delete button on hover */}
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onDelete(playlist.id);
        }}
        className="absolute top-2 right-2 p-2 bg-red-500/80 rounded-full opacity-0 group-hover:opacity-100 
                   transition-opacity hover:bg-red-500"
      >
        <X size={14} />
      </button>
    </div>
  );
};

export default Playlists;
