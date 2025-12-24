import { EmptyFavorites } from "../components/common/EmptyState";
import Button from "../components/common/Button";
import { Link } from "react-router-dom";

const Favorites = () => {
  // Placeholder - will be implemented in Day 12
  return (
    <div className="p-6 lg:p-8">
      <h1 className="text-3xl font-bold mb-6">Liked Songs</h1>

      <EmptyFavorites
        action={
          <Link to="/browse">
            <Button variant="secondary">Discover Music</Button>
          </Link>
        }
      />
    </div>
  );
};

export default Favorites;
