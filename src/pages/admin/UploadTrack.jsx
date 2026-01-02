import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Upload, Music, Image, ArrowLeft } from "lucide-react";
import api from "../../lib/api";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";

const UploadTrack = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [audioFile, setAudioFile] = useState(null);
  const [coverFile, setCoverFile] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    artist: "",
    album: "",
    genre: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!audioFile) {
      setError("Please select an audio file");
      return;
    }

    if (!formData.title || !formData.artist) {
      setError("Title and artist are required");
      return;
    }

    try {
      setIsLoading(true);
      setError("");

      const audioFormData = new FormData();
      audioFormData.append("audio", audioFile);

      const audioRes = await api.post("/upload/audio", audioFormData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      let coverUrl = null;

      if (coverFile) {
        const coverFormData = new FormData();
        coverFormData.append("cover", coverFile);

        const coverRes = await api.post("/upload/cover", coverFormData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        coverUrl = coverRes.data.data.url;
      }

      await api.post("/tracks", {
        ...formData,
        audio_url: audioRes.data.data.url,
        cover_url: coverUrl,
      });

      setSuccess("Track uploaded successfully!");
      setTimeout(() => {
        navigate("/admin");
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to upload track");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 lg:p-8 max-w-2xl animate-fade-in">
      <button
        onClick={() => navigate("/admin")}
        className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-6"
      >
        <ArrowLeft size={20} />
        Back to Dashboard
      </button>

      <h1 className="text-3xl font-bold text-moonlight mb-8">Upload Track</h1>

      {error && (
        <div className="error-box mb-6">
          <p className="error-text text-sm">{error}</p>
        </div>
      )}

      {success && (
        <div className="success-box mb-6">
          <p className="success-text text-sm">{success}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Audio File */}
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-2">
            Audio File *
          </label>
          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-700 rounded-xl cursor-pointer hover:border-teal-500 transition-colors bg-slate-900/50">
            <div className="flex flex-col items-center justify-center py-5">
              <Music className="w-8 h-8 text-slate-500 mb-2" />
              <p className="text-sm text-slate-400">
                {audioFile
                  ? audioFile.name
                  : "Click to upload audio (MP3, WAV, OGG)"}
              </p>
            </div>
            <input
              type="file"
              accept="audio/*"
              className="hidden"
              onChange={(e) => setAudioFile(e.target.files?.[0])}
            />
          </label>
        </div>

        {/* Cover Image */}
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-2">
            Cover Image (optional)
          </label>
          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-700 rounded-xl cursor-pointer hover:border-teal-500 transition-colors bg-slate-900/50">
            <div className="flex flex-col items-center justify-center py-5">
              <Image className="w-8 h-8 text-slate-500 mb-2" />
              <p className="text-sm text-slate-400">
                {coverFile
                  ? coverFile.name
                  : "Click to upload cover (JPG, PNG, WebP)"}
              </p>
            </div>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => setCoverFile(e.target.files?.[0])}
            />
          </label>
        </div>

        {/* Track Details */}
        <Input
          label="Title *"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Enter track title"
        />

        <Input
          label="Artist *"
          name="artist"
          value={formData.artist}
          onChange={handleChange}
          placeholder="Enter artist name"
        />

        <Input
          label="Album"
          name="album"
          value={formData.album}
          onChange={handleChange}
          placeholder="Enter album name (optional)"
        />

        <Input
          label="Genre"
          name="genre"
          value={formData.genre}
          onChange={handleChange}
          placeholder="e.g., Pop, Rock, Jazz"
        />

        <div className="flex gap-4 pt-4">
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate("/admin")}
          >
            Cancel
          </Button>
          <Button type="submit" loading={isLoading} icon={Upload}>
            Upload Track
          </Button>
        </div>
      </form>
    </div>
  );
};

export default UploadTrack;
