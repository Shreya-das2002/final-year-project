import { Outlet, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

import background from "../../assets/login_bg.png";
import dark_background from "../../assets/dark_login_bg.png";


const RegistrationLogin = () => {
  const [isDark, setIsDark] = useState(
    document.documentElement.classList.contains("dark")
  );

  const location = useLocation();
  const isSignupPage = location.pathname.includes("/signup");

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains("dark"));
    });
    observer.observe(document.documentElement, { attributes: true });
    return () => observer.disconnect();
  }, []);

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-cover bg-center"
      style={{
        backgroundImage: `url(${isDark ? dark_background : background})`,
      }}
    >
      <div
        className={`
          relative shadow-2xl rounded-3xl overflow-hidden
          transition-all duration-300 ease-in-out
          ${isSignupPage ? "w-[900px] h-[480px]" : "w-full max-w-md"}
        `}
      >
        {/* 🖼 Card background image */}
        <div
          className="relative backdrop-blur-md"
        />

        {/* 🧊 Glass content */}
        <div className="relative h-full w-full bg-white/15 dark:bg-gray-900/30 backdrop-blur-md p-8 rounded-3xl">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default RegistrationLogin;
