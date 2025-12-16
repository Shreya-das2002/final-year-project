import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaRegCalendarAlt, FaRegClock } from "react-icons/fa";
import Theme from "../Theme/Theme";
import { getRoleFromUrl } from "../../../Environment";
import type { Role } from "../../../Environment";

const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  // 🔑 ROLE FROM URL (single source of truth)
  const activeRole = getRoleFromUrl(location.search);
  const isOnLogin = location.pathname === "/registrationlogin/login";

  /* ---------- ROLE CLICK ---------- */
  const handleRoleClick = (role: Role) => {
    // Same role clicked again → go home
    if (isOnLogin && activeRole === role) {
      navigate("/");
      return;
    }

    // Open login with selected role
    navigate(`/registrationlogin/login?role=${role}`);
  };

  const goToHome = () => {
    navigate("/");
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
      {/* ================= TOP HEADER ================= */}
      <header className="w-full h-16 bg-gradient-to-r from-blue-100 via-blue-400 to-blue-700 dark:from-gray-400 dark:via-gray-500 dark:to-gray-700 flex items-center justify-between px-6 shadow-md">
        <div onClick={goToHome} className="cursor-pointer select-none">
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

        <div className="flex gap-4">
          {(["doctor", "patient", "admin"] as Role[]).map((role) => {
            const isActive = isOnLogin && activeRole === role;

            return (
              <button
                key={role}
                onClick={() => handleRoleClick(role)}
                className={`px-4 h-12 rounded-lg font-semibold text-white transition-all
                  ${
                    isActive
                      ? "bg-blue-800 dark:bg-gray-800"
                      : "bg-gradient-to-r from-blue-400 to-blue-700 hover:from-blue-500 hover:to-blue-800 dark:from-gray-500 dark:to-gray-700 dark:hover:from-gray-600 dark:hover:to-gray-900 "
                  }`}
              >
                {role.charAt(0).toUpperCase() + role.slice(1)}
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default Header;
