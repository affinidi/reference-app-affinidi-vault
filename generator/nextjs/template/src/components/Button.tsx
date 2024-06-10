import React, { ReactNode } from "react";

interface ButtonProps {
  id?: string;
  children: ReactNode;
  type?: "button" | "submit";
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  id,
  children,
  type = "button",
  onClick,
  disabled = false,
  className = "",
}) => {
  const baseClasses =
    "px-4 py-2 text-base font-medium border border-gray-300 rounded-md shadow-sm";
  const primaryClasses = `${baseClasses} bg-white text-gray-700 hover:bg-gray-50 focus:ring-blue-500`;
  const secondaryClasses = `${baseClasses} bg-gray-200 text-gray-400 focus:ring-gray-400`;

  return (
    <button
      id={id}
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${className} ${disabled ? secondaryClasses : primaryClasses}`}
    >
      {children}
    </button>
  );
};

export default Button;
