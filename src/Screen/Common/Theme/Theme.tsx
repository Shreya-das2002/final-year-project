import React, { useEffect, useState } from "react";
import { SunIcon, MoonIcon } from "@heroicons/react/24/solid";

const Theme: React.FC = () => {
  const [theme, setTheme] = useState<string>(
    localStorage.getItem("theme") || "light"
  );

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <button
      onClick={toggleTheme}
      className={`relative flex items-center w-16 h-8 rounded-full transition-colors duration-300 
      ${theme === "dark" ? "bg-gray-600" : "bg-gray-50"}`}
    >
      {/* Sliding Circle */}
      <span
        className={`absolute flex items-center justify-center w-7 h-7 rounded-full shadow-md transform transition-transform duration-300
        ${theme === "dark" ? "translate-x-8  bg-indigo-400  " : "translate-x-1  bg-yellow-300 "}`}
      >
        {theme === "dark" ? (
          <MoonIcon className="w-4 h-4 text-white" />
        ) : (
          <SunIcon className="w-4 h-4 text-white" />
        )}
      </span>
    </button>
  );
};

export default Theme;