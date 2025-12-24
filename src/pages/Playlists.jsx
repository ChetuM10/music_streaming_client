import { Plus } from "lucide-react";
import Button from "../components/common/Button";
import { EmptyPlaylist } from "../components/common/EmptyState";

const Playlists = () => {
  // Placeholder - will be implemented in Day 8
  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Your Playlists</h1>
        <Button icon={Plus}>Create Playlist</Button>
      </div>

      <EmptyPlaylist
        action={
          <Button variant="secondary" icon={Plus}>
            Create your first playlist
          </Button>
        }
      />
    </div>
  );
};

export default Playlists;
