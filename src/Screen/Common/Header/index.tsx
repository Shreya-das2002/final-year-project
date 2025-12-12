import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { FaRegCalendarAlt, FaRegClock } from "react-icons/fa";
import Theme from "../Theme/Theme";

const Header: React.FC = () => {
  const location = useLocation();
  const [date, setDate] = useState<string>("");
  const [time, setTime] = useState<string>("");

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();

      const formattedDate = now.toLocaleDateString("en-IN", {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
      });

      const formattedTime = now.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });

      setDate(formattedDate);
      setTime(formattedTime);
    };

    updateDateTime();
    const interval = setInterval(updateDateTime, 1000);
    return () => clearInterval(interval);
  }, [location]);

  return (
    <div className="sticky">
      {/* TOP HEADER */}
      <header className="w-full h-16 bg-gradient-to-r from-blue-100 via-blue-400 to-blue-700 dark:from-gray-400 dark:via-gray-500 dark:to-gray-700 flex items-center justify-between px-6 shadow-md">
        <div>
          <span className="text-xl text-blue-950 font-bold">Sympto</span>
          <span className="text-xl text-sky-600 font-bold">Nexus</span>
        </div>


        {/* DATE & TIME WITH ICONS BEHIND */}
        <div className="flex items-center gap-8 text-sm text-white font-medium">
          <div className="pr-2">
            <Theme/>
          </div>
          

          {/* Date */}
          <div className="relative flex items-center">
            <span className="absolute -left-7 bg-white/30 p-2 rounded-full">
              <FaRegCalendarAlt className="text-white text-lg" />
            </span>
            <span className="ml-4">{date}</span>
          </div>

          {/* Time */}
          <div className="relative flex items-center">
            <span className="absolute -left-7 bg-white/30 p-2 rounded-full">
              <FaRegClock className="text-white text-lg" />
            </span>
            <span className="ml-4">{time}</span>
          </div>

        </div>
      </header>

      {/* NAV BAR */}
      <nav className="w-full h-18 bg-blue-100 flex items-center justify-between px-6 shadow">
        <div className="flex items-center">
          <span className="text-xl text-blue-950 font-bold">Guiding Your Path</span>
          &ensp;
          <span className="text-xl text-blue-500 font-bold">From Concern to Calm</span>
        </div>

        <div className="flex gap-4">
          <button className="px-4 py-1 h-12 rounded-lg bg-gradient-to-r from-blue-400 to-blue-700 text-white font-semibold">
            Doctor
          </button>

          <button className="px-4 py-1 h-12 rounded-lg bg-gradient-to-r from-blue-400 to-blue-700 text-white font-semibold">
            Patient
          </button>

          <button className="px-4 py-1 h-12 rounded-lg bg-gradient-to-r from-blue-400 to-blue-700 text-white font-semibold">
            Admin
          </button>
        </div>
      </nav>
    </div>
  );
};

export default Header;
