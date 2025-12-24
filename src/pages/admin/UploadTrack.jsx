import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Upload, Music, Image } from "lucide-react";
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

      // Upload audio file
      const audioFormData = new FormData();
      audioFormData.append("audio", audioFile);

      const audioRes = await api.post("/upload/audio", audioFormData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      let coverUrl = null;

      // Upload cover if provided
      if (coverFile) {
        const coverFormData = new FormData();
        coverFormData.append("cover", coverFile);

        const coverRes = await api.post("/upload/cover", coverFormData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        coverUrl = coverRes.data.data.url;
      }

      // Create track
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
    <div className="p-6 lg:p-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-8">Upload Track</h1>

      {error && (
        <div className="bg-red-500/10 border border-red-500/50 rounded-lg px-4 py-3 mb-6">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      {success && (
        <div className="bg-green-500/10 border border-green-500/50 rounded-lg px-4 py-3 mb-6">
          <p className="text-green-400 text-sm">{success}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Audio File */}
        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
            Audio File *
          </label>
          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-[var(--border-color)] rounded-lg cursor-pointer hover:border-[var(--accent-primary)] transition-colors bg-[var(--bg-tertiary)]">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <Music className="w-8 h-8 text-[var(--text-muted)] mb-2" />
              <p className="text-sm text-[var(--text-secondary)]">
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
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
            Cover Image (optional)
          </label>
          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-[var(--border-color)] rounded-lg cursor-pointer hover:border-[var(--accent-primary)] transition-colors bg-[var(--bg-tertiary)]">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <Image className="w-8 h-8 text-[var(--text-muted)] mb-2" />
              <p className="text-sm text-[var(--text-secondary)]">
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

        <div className="flex gap-4">
          <Button
            type="button"
            variant="ghost"
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
