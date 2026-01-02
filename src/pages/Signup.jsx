import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Mail,
  Lock,
  User,
  Music2,
  Eye,
  EyeOff,
  Sparkles,
  Loader2,
} from "lucide-react";
import useAuthStore from "../store/authStore";
import Button from "../components/common/Button";
import Input from "../components/common/Input";

const Signup = () => {
  const navigate = useNavigate();
  const { signup, isLoading, error, clearError } = useAuthStore();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [success, setSuccess] = useState(false);

  const validateForm = () => {
    const errors = {};

    if (!formData.username) {
      errors.username = "Username is required";
    } else if (formData.username.length < 3) {
      errors.username = "Username must be at least 3 characters";
    }

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

    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
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

    const result = await signup(
      formData.email,
      formData.password,
      formData.username
    );

    if (result.success) {
      setSuccess(true);
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen forest-bg flex items-center justify-center px-4">
        <div className="glass p-8 max-w-md text-center animate-scale-up">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center mx-auto mb-6 glow-teal">
            <Music2 className="w-8 h-8 text-black" />
          </div>
          <h1 className="text-2xl font-bold text-slate-100 mb-4">
            Check your email!
          </h1>
          <p className="text-slate-400 mb-6">
            We've sent a confirmation link to{" "}
            <strong className="text-slate-200">{formData.email}</strong>. Click
            the link to verify your account.
          </p>
          <p className="text-sm text-slate-500">Redirecting to login page...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen forest-bg flex flex-col">
      {/* Fireflies */}
      <div
        className="firefly firefly-gold"
        style={{ top: "10%", left: "20%", animationDelay: "0s" }}
      />
      <div
        className="firefly firefly-green"
        style={{ top: "50%", left: "85%", animationDelay: "3s" }}
      />

      {/* Header */}
      <header className="p-8">
        <Link to="/" className="flex items-center gap-3 w-fit">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center glow-teal-sm">
            <Music2 className="w-6 h-6 text-black" />
          </div>
          <span className="text-xl font-bold text-moonlight">Melodify</span>
        </Link>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          <div className="glass p-8 animate-fade-in-up">
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-teal-400" />
                <span className="text-sm text-teal-400 font-medium">
                  Join the forest
                </span>
              </div>
              <h1 className="text-2xl font-bold text-slate-100">
                Create Account
              </h1>
              <p className="text-slate-400 mt-2">Sign up to start listening</p>
            </div>

            {error && (
              <div className="error-box mb-6">
                <p className="error-text text-sm">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <Input
                label="Username"
                type="text"
                name="username"
                placeholder="Choose a username"
                icon={User}
                value={formData.username}
                onChange={handleChange}
                error={formErrors.username}
                autoComplete="username"
              />

              <Input
                label="Email"
                type="email"
                name="email"
                placeholder="Enter your email"
                icon={Mail}
                value={formData.email}
                onChange={handleChange}
                error={formErrors.email}
                autoComplete="email"
              />

              <div className="relative">
                <Input
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Create a password"
                  icon={Lock}
                  value={formData.password}
                  onChange={handleChange}
                  error={formErrors.password}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-[38px] text-slate-500 hover:text-slate-300"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>

              <Input
                label="Confirm Password"
                type={showPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm your password"
                icon={Lock}
                value={formData.confirmPassword}
                onChange={handleChange}
                error={formErrors.confirmPassword}
                autoComplete="new-password"
              />

              <Button
                type="submit"
                className="w-full"
                size="lg"
                loading={isLoading}
              >
                Sign Up
              </Button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-slate-400">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-teal-400 hover:underline font-medium"
                >
                  Log in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Signup;
