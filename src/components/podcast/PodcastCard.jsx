import { Link } from "react-router-dom";
import { Mic2 } from "lucide-react";
import CoverImage from "../common/CoverImage";

const PodcastCard = ({ podcast }) => {
  return (
    <Link
      to={`/podcasts/${podcast.id}`}
      className="card card-interactive group animate-fade-in"
    >
      <div className="relative mb-3">
        <CoverImage
          src={podcast.cover_url}
          alt={podcast.title}
          title={podcast.title}
          size="medium"
        />
        <div className="absolute bottom-2 right-2 w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <Mic2 className="w-4 h-4 text-white" />
        </div>
      </div>

      <h3 className="font-semibold truncate mb-1 text-slate-100 group-hover:text-teal-400 transition-colors">
        {podcast.title}
      </h3>
      <p className="text-sm text-slate-400 truncate">{podcast.host}</p>
    </Link>
  );
};

export default PodcastCard;
