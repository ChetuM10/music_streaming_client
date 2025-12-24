import EmptyState from "../components/common/EmptyState";
import { Clock } from "lucide-react";

const RecentlyPlayed = () => {
  // Placeholder - will be implemented in Day 9
  return (
    <div className="p-6 lg:p-8">
      <h1 className="text-3xl font-bold mb-6">Recently Played</h1>

      <EmptyState
        icon={Clock}
        title="No listening history yet"
        description="Start playing some music to see your history here."
      />
    </div>
  );
};

export default RecentlyPlayed;
