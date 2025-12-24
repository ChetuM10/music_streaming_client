import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Mail, Lock, Music2, Eye, EyeOff } from "lucide-react";
import useAuthStore from "../store/authStore";
import Button from "../components/common/Button";
import Input from "../components/common/Input";

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

    // Clear errors
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
              Welcome Back
            </h1>
            <p className="text-[var(--text-secondary)] text-center mb-8">
              Log in to continue to Melodify
            </p>

            {error && (
              <div className="bg-red-500/10 border border-red-500/50 rounded-lg px-4 py-3 mb-6">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
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
                  placeholder="Enter your password"
                  icon={Lock}
                  value={formData.password}
                  onChange={handleChange}
                  error={formErrors.password}
                  autoComplete="current-password"
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

              <Button
                type="submit"
                className="w-full"
                size="lg"
                loading={isLoading}
              >
                Log In
              </Button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-[var(--text-secondary)]">
                Don't have an account?{" "}
                <Link
                  to="/signup"
                  className="text-[var(--accent-primary)] hover:underline font-medium"
                >
                  Sign up for free
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Login;
