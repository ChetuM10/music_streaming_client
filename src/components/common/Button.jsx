import { cn } from "../../lib/utils";

const Button = ({
  children,
  variant = "primary",
  size = "md",
  className,
  disabled,
  loading,
  icon: Icon,
  ...props
}) => {
  const baseStyles =
    "inline-flex items-center justify-center font-medium rounded-full transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[var(--bg-primary)]";

  const variants = {
    primary:
      "bg-[var(--accent-primary)] hover:bg-[var(--accent-hover)] text-black focus:ring-[var(--accent-primary)]",
    secondary:
      "bg-[var(--bg-tertiary)] hover:bg-[var(--bg-elevated)] text-white focus:ring-[var(--bg-elevated)]",
    ghost:
      "bg-transparent hover:bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:text-white",
    outline:
      "border border-[var(--border-color)] hover:border-white bg-transparent text-white hover:bg-white/5",
    danger: "bg-red-600 hover:bg-red-700 text-white focus:ring-red-500",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm gap-1.5",
    md: "px-5 py-2.5 text-sm gap-2",
    lg: "px-6 py-3 text-base gap-2",
    icon: "p-2",
  };

  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : Icon ? (
        <Icon className="w-4 h-4" />
      ) : null}
      {children}
    </button>
  );
};

export default Button;
