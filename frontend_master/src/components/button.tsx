import React from "react";

interface IButtonProps {
  canClick: boolean;
  loading: boolean;
  actionText: string;
}

export const Button: React.FC<IButtonProps> = ({
  canClick,
  loading,
  actionText,
}) => (
  <button
    role="button"
    className={`w-4/5 ml-16 rounded-md text-lg font-medium focus:outline-none text-white py-4  transition-colors ${
      canClick
        ? "bg-lime-600 hover:bg-lime-700"
        : "bg-gray-300 hover:bg-gray-400 "
    }`}
  >
    {loading ? "wait..." : actionText}
  </button>
);
