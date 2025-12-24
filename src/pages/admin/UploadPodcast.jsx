import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Upload, Podcast, Image } from "lucide-react";
import api from "../../lib/api";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";

const UploadPodcast = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [coverFile, setCoverFile] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    host: "",
    description: "",
    category: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.host) {
      setError("Title and host are required");
      return;
    }

    try {
      setIsLoading(true);
      setError("");

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

      // Create podcast
      await api.post("/podcasts", {
        ...formData,
        cover_url: coverUrl,
      });

      setSuccess("Podcast created successfully!");
      setTimeout(() => {
        navigate("/admin");
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create podcast");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 lg:p-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-8">Create Podcast</h1>

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
        {/* Cover Image */}
        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
            Cover Image (optional)
          </label>
          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-[var(--border-color)] rounded-lg cursor-pointer hover:border-[var(--accent-primary)] transition-colors bg-[var(--bg-tertiary)]">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <Podcast className="w-8 h-8 text-[var(--text-muted)] mb-2" />
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

        {/* Podcast Details */}
        <Input
          label="Podcast Title *"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Enter podcast title"
        />

        <Input
          label="Host *"
          name="host"
          value={formData.host}
          onChange={handleChange}
          placeholder="Enter host name"
        />

        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter podcast description"
            rows={4}
            className="w-full bg-[var(--bg-tertiary)] border border-[var(--border-color)] rounded-lg px-4 py-3 text-white placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-primary)] focus:ring-1 focus:ring-[var(--accent-primary)] transition-all duration-200 resize-none"
          />
        </div>

        <Input
          label="Category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          placeholder="e.g., Technology, Business, Comedy"
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
            Create Podcast
          </Button>
        </div>
      </form>
    </div>
  );
};

export default UploadPodcast;
