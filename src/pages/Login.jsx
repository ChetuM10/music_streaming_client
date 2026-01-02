import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Mail,
  Lock,
  Music2,
  Eye,
  EyeOff,
  Headphones,
  Disc3,
  Sparkles,
  Heart,
  Loader2,
} from "lucide-react";
import useAuthStore from "../store/authStore";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLoading, error, clearError } = useAuthStore();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [rememberMe, setRememberMe] = useState(false);

  const from = location.state?.from?.pathname || "/";

  const validateForm = () => {
    const errors = {};

    if (!formData.email) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Please enter a valid email";
    }

    if (!formData.password) {
      errors.password = "Password is required";
    } else if (formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }
    if (error) {
      clearError();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const result = await login(formData.email, formData.password);

    if (result.success) {
      navigate(from, { replace: true });
    }
  };

  return (
    <div className="min-h-screen forest-bg flex">
      {/* Fireflies */}
      <div
        className="firefly firefly-gold"
        style={{ top: "20%", left: "15%", animationDelay: "0s" }}
      />
      <div
        className="firefly firefly-green"
        style={{ top: "60%", left: "80%", animationDelay: "2s" }}
      />
      <div
        className="firefly firefly-blue"
        style={{ top: "80%", left: "30%", animationDelay: "4s" }}
      />

      {/* LEFT SIDE - HERO */}
      <div className="hidden lg:flex lg:w-1/2 relative p-12 flex-col justify-between">
        <div className="relative z-10">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 mb-16">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center glow-teal">
              <Music2 className="w-7 h-7 text-black" />
            </div>
            <span className="text-2xl font-bold text-moonlight">Melodify</span>
          </Link>

          {/* Main Hero Content */}
          <div>
            <h1 className="text-5xl font-bold leading-tight mb-6">
              <span className="text-slate-100 glow-text">Music that</span>
              <br />
              <span className="text-gradient-teal">moves you</span>
            </h1>
            <p className="text-lg text-slate-400 max-w-md">
              Discover millions of songs, podcasts, and curated playlists. Your
              soundtrack starts here in the midnight forest.
            </p>
          </div>

          {/* Stats Row */}
          <div className="flex gap-8 mt-12">
            <div className="glass-subtle p-4 rounded-xl">
              <Headphones className="w-6 h-6 text-teal-400 mb-2" />
              <p className="text-2xl font-bold text-slate-100">50M+</p>
              <p className="text-sm text-slate-400">Songs</p>
            </div>
            <div className="glass-subtle p-4 rounded-xl">
              <Disc3 className="w-6 h-6 text-cyan-400 mb-2" />
              <p className="text-2xl font-bold text-slate-100">100K+</p>
              <p className="text-sm text-slate-400">Podcasts</p>
            </div>
            <div className="glass-subtle p-4 rounded-xl">
              <Heart className="w-6 h-6 text-purple-400 mb-2" />
              <p className="text-2xl font-bold text-slate-100">4.9★</p>
              <p className="text-sm text-slate-400">Rating</p>
            </div>
          </div>
        </div>

        <p className="text-slate-600 text-sm">
          © 2024 Melodify. Premium music streaming.
        </p>
      </div>

      {/* RIGHT SIDE - LOGIN FORM */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex justify-center mb-8">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center">
                <Music2 className="w-6 h-6 text-black" />
              </div>
              <span className="text-xl font-bold text-slate-100">Melodify</span>
            </Link>
          </div>

          {/* Main Card */}
          <div className="glass p-8 animate-fade-in-up">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-teal-400" />
                <span className="text-sm text-teal-400 font-medium">
                  Welcome back
                </span>
              </div>
              <h1 className="text-2xl font-bold text-slate-100">
                Log in to <span className="text-gradient-teal">Melodify</span>
              </h1>
              <p className="text-slate-400 mt-2">Continue your music journey</p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="error-box mb-6">
                <p className="error-text text-sm">{error}</p>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email Input */}
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">
                  Email address
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                    <Mail className="w-5 h-5" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="name@example.com"
                    autoComplete="email"
                    className={`input input-with-icon ${
                      formErrors.email ? "border-red-500" : ""
                    }`}
                  />
                </div>
                {formErrors.email && (
                  <p className="mt-2 text-sm error-text">{formErrors.email}</p>
                )}
              </div>

              {/* Password Input */}
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                    <Lock className="w-5 h-5" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    className={`input input-with-icon pr-12 ${
                      formErrors.password ? "border-red-500" : ""
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {formErrors.password && (
                  <p className="mt-2 text-sm error-text">
                    {formErrors.password}
                  </p>
                )}
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={() => setRememberMe(!rememberMe)}
                    className="w-4 h-4 rounded border-slate-600 bg-slate-800 text-teal-400 focus:ring-teal-400"
                  />
                  <span className="text-sm text-slate-400">Remember me</span>
                </label>
                <Link
                  to="/forgot-password"
                  className="text-sm text-teal-400 hover:underline"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="btn btn-primary w-full py-3 text-base"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Logging in...
                  </>
                ) : (
                  "Log In"
                )}
              </button>
            </form>

            {/* Sign Up Link */}
            <div className="mt-8 text-center">
              <p className="text-slate-400">
                Don't have an account?{" "}
                <Link
                  to="/signup"
                  className="text-teal-400 hover:underline font-medium"
                >
                  Sign up for Melodify
                </Link>
              </p>
            </div>
          </div>

          {/* Trust Badge */}
          <div className="mt-6 flex items-center justify-center gap-2 text-slate-600 text-sm">
            <Lock className="w-4 h-4" />
            <span>Secured with 256-bit encryption</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
