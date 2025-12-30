import { useState, useEffect } from "react";
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
  Users,
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
  const [focusedField, setFocusedField] = useState(null);

  const from = location.state?.from?.pathname || "/";

  // Floating album covers for hero
  const floatingCovers = [
    "https://i.scdn.co/image/ab67616d0000b273c5663cc5e22c3d5a9b4f8c4e",
    "https://i.scdn.co/image/ab67616d0000b2732e8ed79e177ff6011076f5f0",
    "https://i.scdn.co/image/ab67616d0000b273e8b066f70c206551210d902b",
    "https://i.scdn.co/image/ab67616d0000b273ba5db46f4b838ef6027e500f",
    "https://i.scdn.co/image/ab67616d0000b27323c552f7f3f8af8c6a5b5c6d",
    "https://i.scdn.co/image/ab67616d0000b2731dc7483a9e10ef0a8e7e9f8e",
  ];

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

  const handleSocialLogin = (provider) => {
    // Placeholder for social auth
    alert(`${provider} login coming soon!`);
  };

  return (
    <div className="min-h-screen flex overflow-hidden">
      {/* ═══════════════════════════════════════════
          LEFT SIDE - HERO WITH VISUAL STORYTELLING
      ═══════════════════════════════════════════ */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        {/* Animated Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#1db954] via-[#1ed760] to-[#191414]">
          {/* Animated gradient overlay */}
          <div
            className="absolute inset-0 opacity-60"
            style={{
              background:
                "linear-gradient(45deg, #1db954, #191414, #1ed760, #121212)",
              backgroundSize: "400% 400%",
              animation: "gradientShift 15s ease infinite",
            }}
          />
        </div>

        {/* Floating Album Covers */}
        <div className="absolute inset-0 overflow-hidden">
          {floatingCovers.map((cover, i) => (
            <div
              key={i}
              className="absolute rounded-2xl shadow-2xl overflow-hidden opacity-20 hover:opacity-40 transition-opacity duration-500"
              style={{
                width: `${80 + Math.random() * 60}px`,
                height: `${80 + Math.random() * 60}px`,
                left: `${5 + i * 15 + Math.random() * 10}%`,
                top: `${10 + i * 12 + Math.random() * 10}%`,
                animation: `float ${8 + i * 2}s ease-in-out infinite`,
                animationDelay: `${i * 0.5}s`,
                transform: `rotate(${-15 + Math.random() * 30}deg)`,
              }}
            >
              <img src={cover} alt="" className="w-full h-full object-cover" />
            </div>
          ))}
        </div>

        {/* Glowing Orbs */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[#1db954]/30 rounded-full blur-[120px] animate-pulse" />
        <div
          className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-purple-500/20 rounded-full blur-[100px] animate-pulse"
          style={{ animationDelay: "1s" }}
        />

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-14 h-14 bg-black/30 backdrop-blur-xl rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform border border-white/10">
              <Music2 className="w-8 h-8 text-white" />
            </div>
            <span className="text-3xl font-bold text-white tracking-tight">
              Melodify
            </span>
          </Link>

          {/* Main Hero Content */}
          <div className="space-y-8">
            {/* Big Bold Heading */}
            <div className="space-y-4">
              <h1 className="text-6xl font-black text-white leading-tight">
                Music that
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-green-200 to-white">
                  moves you
                </span>
              </h1>
              <p className="text-xl text-white/80 max-w-md leading-relaxed">
                Discover millions of songs, podcasts, and curated playlists.
                Your soundtrack starts here.
              </p>
            </div>

            {/* Social Proof */}
            <div className="flex items-center gap-6">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="w-10 h-10 rounded-full border-2 border-[#1db954] bg-gradient-to-br from-pink-400 to-purple-600"
                    style={{ zIndex: 6 - i }}
                  />
                ))}
              </div>
              <div>
                <p className="text-white font-bold text-lg">2M+ music lovers</p>
                <p className="text-white/60 text-sm">Join the community</p>
              </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-6 pt-4">
              <div className="text-center p-4 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10">
                <Headphones className="w-8 h-8 text-white mx-auto mb-2" />
                <p className="text-2xl font-bold text-white">50M+</p>
                <p className="text-white/60 text-sm">Songs</p>
              </div>
              <div className="text-center p-4 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10">
                <Disc3
                  className="w-8 h-8 text-white mx-auto mb-2 animate-spin"
                  style={{ animationDuration: "4s" }}
                />
                <p className="text-2xl font-bold text-white">100K+</p>
                <p className="text-white/60 text-sm">Podcasts</p>
              </div>
              <div className="text-center p-4 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10">
                <Heart className="w-8 h-8 text-white mx-auto mb-2" />
                <p className="text-2xl font-bold text-white">4.9★</p>
                <p className="text-white/60 text-sm">Rating</p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <p className="text-white/40 text-sm">
            © 2024 Melodify. Premium music streaming.
          </p>
        </div>
      </div>

      {/* ═══════════════════════════════════════════
          RIGHT SIDE - PREMIUM LOGIN FORM
      ═══════════════════════════════════════════ */}
      <div className="flex-1 flex flex-col justify-center items-center p-8 bg-[#0a0a0a] relative">
        {/* Subtle background effects */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-[#1db954]/5 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-purple-500/5 to-transparent rounded-full blur-3xl" />

        {/* Mobile Logo */}
        <div className="lg:hidden mb-12">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-14 h-14 bg-[#1db954] rounded-2xl flex items-center justify-center shadow-lg shadow-[#1db954]/20">
              <Music2 className="w-8 h-8 text-black" />
            </div>
            <span className="text-3xl font-bold text-white">Melodify</span>
          </Link>
        </div>

        <div className="w-full max-w-md relative z-10">
          {/* Main Card */}
          <div className="bg-[#121212] border border-[#282828] rounded-3xl p-8 shadow-2xl">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#1db954]/10 border border-[#1db954]/20 rounded-full mb-4">
                <Sparkles className="w-4 h-4 text-[#1db954]" />
                <span className="text-[#1db954] text-sm font-medium">
                  Welcome back
                </span>
              </div>
              <h1 className="text-4xl font-black text-white mb-2">
                Log in to <span className="text-[#1db954]">Melodify</span>
              </h1>
              <p className="text-[#a7a7a7]">Continue your music journey</p>
            </div>

            {/* Social Login Buttons */}
            <div className="space-y-3 mb-6">
              <button
                onClick={() => handleSocialLogin("Google")}
                className="w-full flex items-center justify-center gap-3 px-4 py-3.5 bg-white hover:bg-gray-100 text-black font-semibold rounded-full transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Continue with Google
              </button>

              <button
                onClick={() => handleSocialLogin("Apple")}
                className="w-full flex items-center justify-center gap-3 px-4 py-3.5 bg-white hover:bg-gray-100 text-black font-semibold rounded-full transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
              >
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                </svg>
                Continue with Apple
              </button>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-4 my-6">
              <div className="flex-1 h-px bg-[#282828]" />
              <span className="text-[#a7a7a7] text-sm">or</span>
              <div className="flex-1 h-px bg-[#282828]" />
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 mb-6 animate-shake">
                <p className="text-red-400 text-sm text-center">{error}</p>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email Input */}
              <div>
                <label className="block text-white text-sm font-semibold mb-2">
                  Email address
                </label>
                <div
                  className={`relative group ${
                    focusedField === "email" ? "ring-2 ring-[#1db954]" : ""
                  } rounded-lg transition-all duration-200`}
                >
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail
                      className={`w-5 h-5 transition-colors ${
                        focusedField === "email"
                          ? "text-[#1db954]"
                          : "text-[#a7a7a7]"
                      }`}
                    />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    onFocus={() => setFocusedField("email")}
                    onBlur={() => setFocusedField(null)}
                    placeholder="name@example.com"
                    autoComplete="email"
                    className="w-full pl-16 pr-4 py-3.5 bg-[#1a1a1a] border border-[#333] rounded-lg text-white placeholder:text-[#888] focus:outline-none focus:border-[#1db954] transition-all duration-200"
                  />
                </div>
                {formErrors.email && (
                  <p className="mt-2 text-red-400 text-sm">
                    {formErrors.email}
                  </p>
                )}
              </div>

              {/* Password Input */}
              <div>
                <label className="block text-white text-sm font-semibold mb-2">
                  Password
                </label>
                <div
                  className={`relative group ${
                    focusedField === "password" ? "ring-2 ring-[#1db954]" : ""
                  } rounded-lg transition-all duration-200`}
                >
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock
                      className={`w-5 h-5 transition-colors ${
                        focusedField === "password"
                          ? "text-[#1db954]"
                          : "text-[#a7a7a7]"
                      }`}
                    />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    onFocus={() => setFocusedField("password")}
                    onBlur={() => setFocusedField(null)}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    className="w-full pl-16 pr-12 py-3.5 bg-[#1a1a1a] border border-[#333] rounded-lg text-white placeholder:text-[#888] focus:outline-none focus:border-[#1db954] transition-all duration-200"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-[#a7a7a7] hover:text-white transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {formErrors.password && (
                  <p className="mt-2 text-red-400 text-sm">
                    {formErrors.password}
                  </p>
                )}
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between py-2">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={() => setRememberMe(!rememberMe)}
                      className="sr-only"
                    />
                    <div
                      className={`w-5 h-5 rounded border-2 transition-all duration-200 ${
                        rememberMe
                          ? "bg-[#1db954] border-[#1db954]"
                          : "border-[#666] group-hover:border-[#888]"
                      }`}
                    >
                      {rememberMe && (
                        <svg
                          className="w-full h-full text-black"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      )}
                    </div>
                  </div>
                  <span className="text-[#a7a7a7] text-sm group-hover:text-white transition-colors">
                    Remember me
                  </span>
                </label>
                <Link
                  to="/forgot-password"
                  className="text-sm text-[#a7a7a7] hover:text-[#1db954] underline transition-colors"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 bg-[#1db954] hover:bg-[#1ed760] disabled:opacity-50 disabled:hover:bg-[#1db954] text-black font-bold rounded-full transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-[#1db954]/20 hover:shadow-[#1db954]/40 flex items-center justify-center gap-2"
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
            <div className="mt-8 pt-6 border-t border-[#282828] text-center">
              <p className="text-[#a7a7a7]">
                Don't have an account?{" "}
                <Link
                  to="/signup"
                  className="text-white hover:text-[#1db954] font-semibold underline underline-offset-2 transition-colors"
                >
                  Sign up for Melodify
                </Link>
              </p>
            </div>
          </div>

          {/* Trust Badge */}
          <div className="flex items-center justify-center gap-2 mt-6 text-[#666]">
            <Lock className="w-4 h-4" />
            <span className="text-sm">Secured with 256-bit encryption</span>
          </div>
        </div>
      </div>

      {/* Keyframe Animations */}
      <style jsx>{`
        @keyframes gradientShift {
          0%,
          100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        @keyframes float {
          0%,
          100% {
            transform: translateY(0) rotate(var(--rotation, 0deg));
          }
          50% {
            transform: translateY(-20px) rotate(var(--rotation, 0deg));
          }
        }
        @keyframes shake {
          0%,
          100% {
            transform: translateX(0);
          }
          25% {
            transform: translateX(-5px);
          }
          75% {
            transform: translateX(5px);
          }
        }
        .animate-shake {
          animation: shake 0.3s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default Login;
