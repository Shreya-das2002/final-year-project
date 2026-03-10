import React, { useEffect, useState } from "react";
import { SunIcon, MoonIcon } from "@heroicons/react/24/solid";

const Theme: React.FC = () => {
  const [theme, setTheme] = useState(
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
      className="
        flex items-center justify-center
        w-10 h-10 rounded-full
        border transition-all duration-300
        
        bg-blue-50 text-blue-600 border-blue-300
        hover:bg-blue-100
        
        dark:bg-slate-800 dark:text-yellow-300 dark:border-slate-600
        dark:hover:bg-slate-700
      "
    >
      {theme === "dark" ? (
        <SunIcon className="w-5 h-5" />
      ) : (
        <MoonIcon className="w-5 h-5" />
      )}
    </button>
  );
};

export default Theme;