import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Upload, Podcast, ArrowLeft } from "lucide-react";
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

      if (coverFile) {
        const coverFormData = new FormData();
        coverFormData.append("cover", coverFile);

        const coverRes = await api.post("/upload/cover", coverFormData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        coverUrl = coverRes.data.data.url;
      }

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
    <div className="p-6 lg:p-8 max-w-2xl animate-fade-in">
      <button
        onClick={() => navigate("/admin")}
        className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-6"
      >
        <ArrowLeft size={20} />
        Back to Dashboard
      </button>

      <h1 className="text-3xl font-bold text-moonlight mb-8">Create Podcast</h1>

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
        {/* Cover Image */}
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-2">
            Cover Image (optional)
          </label>
          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-700 rounded-xl cursor-pointer hover:border-teal-500 transition-colors bg-slate-900/50">
            <div className="flex flex-col items-center justify-center py-5">
              <Podcast className="w-8 h-8 text-slate-500 mb-2" />
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
          <label className="block text-sm font-medium text-slate-400 mb-2">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter podcast description"
            rows={4}
            className="input resize-none"
          />
        </div>

        <Input
          label="Category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          placeholder="e.g., Technology, Business, Comedy"
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
            Create Podcast
          </Button>
        </div>
      </form>
    </div>
  );
};

export default UploadPodcast;
