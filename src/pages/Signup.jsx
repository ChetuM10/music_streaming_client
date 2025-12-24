import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, User, Music2, Eye, EyeOff } from "lucide-react";
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
      // If email confirmation is disabled, redirect to login
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[var(--bg-tertiary)] to-[var(--bg-primary)] flex items-center justify-center px-4">
        <div className="bg-[var(--bg-secondary)] rounded-2xl p-8 max-w-md text-center shadow-2xl">
          <div className="w-16 h-16 bg-[var(--accent-primary)] rounded-full flex items-center justify-center mx-auto mb-6">
            <Music2 className="w-8 h-8 text-black" />
          </div>
          <h1 className="text-2xl font-bold mb-4">Check your email!</h1>
          <p className="text-[var(--text-secondary)] mb-6">
            We've sent a confirmation link to <strong>{formData.email}</strong>.
            Click the link to verify your account.
          </p>
          <p className="text-sm text-[var(--text-muted)]">
            Redirecting to login page...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[var(--bg-tertiary)] to-[var(--bg-primary)] flex flex-col">
      {/* Header */}
      <header className="p-8">
        <Link to="/" className="flex items-center gap-2 w-fit">
          <div className="w-10 h-10 bg-[var(--accent-primary)] rounded-lg flex items-center justify-center">
            <Music2 className="w-6 h-6 text-black" />
          </div>
          <span className="text-xl font-bold">Melodify</span>
        </Link>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          <div className="bg-[var(--bg-secondary)] rounded-2xl p-8 shadow-2xl">
            <h1 className="text-3xl font-bold text-center mb-2">
              Create Account
            </h1>
            <p className="text-[var(--text-secondary)] text-center mb-8">
              Sign up to start listening
            </p>

            {error && (
              <div className="bg-red-500/10 border border-red-500/50 rounded-lg px-4 py-3 mb-6">
                <p className="text-red-400 text-sm">{error}</p>
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
                  className="absolute right-3 top-[38px] text-[var(--text-muted)] hover:text-white"
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
              <p className="text-[var(--text-secondary)]">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-[var(--accent-primary)] hover:underline font-medium"
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
