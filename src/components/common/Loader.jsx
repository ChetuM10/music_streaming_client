import { Loader2 } from "lucide-react";

const Loader = ({ size = "md", className = "" }) => {
  const sizeClasses = {
    sm: "w-5 h-5",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <Loader2 className={`${sizeClasses[size]} text-teal-400 animate-spin`} />
    </div>
  );
};

export const SkeletonCard = () => {
  return (
    <div className="glass-subtle p-4 rounded-xl animate-fade-in">
      <div className="aspect-square skeleton rounded-lg mb-3" />
      <div className="skeleton h-4 w-3/4 rounded mb-2" />
      <div className="skeleton h-3 w-1/2 rounded" />
    </div>
  );
};

export default Loader;
