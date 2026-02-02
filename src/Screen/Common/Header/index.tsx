import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaRegCalendarAlt, FaRegClock } from "react-icons/fa";
import Theme from "../Theme/Theme";


const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  /* ---------- HOME ---------- */
  const goToHome = () => {
    navigate("/");
  };

  const hideNavOnRoutes = [
  "/patient",
  "/doctor",
  "/admin",
];

const shouldHideNav = hideNavOnRoutes.some((path) =>
  location.pathname.startsWith(path)
);


  /* ---------- SIGN IN TOGGLE ---------- */
  const handleSignInClick = () => {
    if (location.pathname.startsWith("/registrationlogin")) {
      navigate("/");
    } else {
      navigate("/registrationlogin/login");
    }
  };

  /* ---------- DATE & TIME ---------- */
  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();

      setDate(
        now.toLocaleDateString("en-IN", {
          weekday: "short",
          year: "numeric",
          month: "short",
          day: "numeric",
        })
      );

      setTime(
        now.toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
    };

    updateDateTime();
    const interval = setInterval(updateDateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      {/* ================= TOP HEADER (ALWAYS VISIBLE) ================= */}
      <header className="fixed top-0 left-0 w-full h-16 bg-gradient-to-r from-blue-100 via-blue-400 to-blue-700 dark:from-gray-400 dark:via-gray-500 dark:to-gray-700 flex items-center justify-between px-6 shadow-md">
        <div
          onClick={goToHome}
          className="cursor-pointer select-none"
        >
          <span className="text-xl text-blue-950 dark:text-gray-800 font-bold">
            Sympto
          </span>
          <span className="text-xl text-sky-600 dark:text-gray-300 font-bold">
            Nexus
          </span>
        </div>

        {/* DATE & TIME */}
        <div className="flex items-center gap-10 text-sm text-white font-medium">
          <Theme />

          <div className="relative flex items-center">
            <span className="absolute -left-7 bg-white/30 p-2 rounded-full">
              <FaRegCalendarAlt className="text-lg" />
            </span>
            <span className="ml-4">{date}</span>
          </div>

          <div className="relative flex items-center">
            <span className="absolute -left-7 bg-white/30 p-2 rounded-full">
              <FaRegClock className="text-lg" />
            </span>
            <span className="ml-4">{time}</span>
          </div>
        </div>
      </header>

      {/* ================= NAV BAR ================= */}
      {!shouldHideNav&& (
        <nav className="w-full h-16 bg-blue-100 dark:bg-gray-200 flex items-center justify-between px-6 shadow">
          <div className="flex items-center">
            <span className="text-xl text-blue-950 dark:text-gray-950 font-bold">
              Guiding Your Path
            </span>
            &ensp;
            <span className="text-xl text-blue-500 dark:text-gray-500 font-bold">
              From Concern to Calm
            </span>
          </div>

          {/* SIGN IN / BACK */}
          <button
            onClick={handleSignInClick}
            className="px-6 h-11 rounded-lg font-semibold text-white
                       bg-gradient-to-r from-blue-500 to-blue-700
                       hover:from-blue-600 hover:to-blue-800
                       transition-all"
          >
            {location.pathname.startsWith("/registrationlogin")}
            Sign In
          </button>
        </nav>
      )}
    </div>
  );
};

export default Header;
