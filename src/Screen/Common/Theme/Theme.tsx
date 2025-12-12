import React, { useEffect, useState } from "react";

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
      className="relative flex items-center w-14 h-8 bg-gray-300 dark:bg-gray-700 rounded-full transition-all duration-500"
    >
      {/* White circle for light mode */}
      <span
        className={`absolute left-1 w-6 h-6 rounded-full bg-white shadow-md transform transition-transform duration-500 ${
          theme === "dark" ? "translate-x-6 opacity-0" : "opacity-100"
        }`}
      ></span>

      {/* Black circle for dark mode */}
      <span
        className={`absolute right-1 w-6 h-6 rounded-full bg-black shadow-md transform transition-transform duration-500 ${
          theme === "light" ? "translate-x opacity-0" : "opacity-100"
        }`}
      ></span>
    </button>
  );
};

export default Theme;
