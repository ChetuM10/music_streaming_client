import { forwardRef } from "react";

const Input = forwardRef(
  ({ label, error, icon: Icon, className = "", ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-slate-400 mb-2">
            {label}
          </label>
        )}
        <div className="relative">
          {Icon && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
              <Icon className="w-5 h-5" />
            </div>
          )}
          <input
            ref={ref}
            className={`input ${Icon ? "input-with-icon" : ""} ${
              error
                ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                : ""
            } ${className}`}
            {...props}
          />
        </div>
        {error && <p className="mt-2 text-sm error-text">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
