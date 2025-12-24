import { forwardRef } from "react";
import { cn } from "../../lib/utils";

const Input = forwardRef(
  (
    { label, error, icon: Icon, className, containerClassName, ...props },
    ref
  ) => {
    return (
      <div className={cn("w-full", containerClassName)}>
        {label && (
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
            {label}
          </label>
        )}
        <div className="relative">
          {Icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]">
              <Icon className="w-5 h-5" />
            </div>
          )}
          <input
            ref={ref}
            className={cn(
              "w-full bg-[var(--bg-tertiary)] border border-[var(--border-color)] rounded-lg",
              "px-4 py-3 text-white placeholder:text-[var(--text-muted)]",
              "focus:outline-none focus:border-[var(--accent-primary)] focus:ring-1 focus:ring-[var(--accent-primary)]",
              "transition-all duration-200",
              Icon && "pl-11",
              error && "border-red-500 focus:border-red-500 focus:ring-red-500",
              className
            )}
            {...props}
          />
        </div>
        {error && <p className="mt-1.5 text-sm text-red-500">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
