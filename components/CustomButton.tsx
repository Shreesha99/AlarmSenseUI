import React from "react";

interface CustomButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  variant = "primary",
  size = "md",
  loading = false,
  icon,
  fullWidth = false,
  children,
  disabled,
  className = "",
  ...props
}) => {
  const baseStyles =
    "relative inline-flex items-center justify-center font-semibold rounded transition-all duration-200 focus:outline-none active:scale-[0.97] disabled:opacity-60 disabled:cursor-not-allowed overflow-hidden";

  const variants = {
    primary: "bg-[#00646C] hover:bg-[#005257] text-white",
    secondary: "bg-gray-200 hover:bg-gray-300 text-gray-800",
    danger: "bg-red-600 hover:bg-red-700 text-white",
    ghost: "bg-transparent hover:bg-gray-100 text-gray-700",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  };

  return (
    <button
      className={`
        ${baseStyles}
        ${variants[variant]}
        ${sizes[size]}
        ${fullWidth ? "w-full" : ""}
        ${className}
      `}
      disabled={disabled || loading}
      {...props}
    >
      {/* Content Wrapper */}
      <span
        className={`flex items-center transition-opacity duration-200 ${
          loading ? "opacity-0" : "opacity-100"
        }`}
      >
        {icon && <span className="mr-2 flex items-center">{icon}</span>}
        {children}
      </span>

      {/* Loader Overlay */}
      {loading && (
        <span className="absolute inset-0 flex items-center justify-center">
          <span className="relative flex h-5 w-5">
            {/* Pulse Ring */}
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-30"></span>

            {/* Spinner Core */}
            <span className="relative inline-flex rounded-full h-5 w-5 border-2 border-white/40 border-t-white animate-spin"></span>
          </span>
        </span>
      )}
    </button>
  );
};

export default CustomButton;
