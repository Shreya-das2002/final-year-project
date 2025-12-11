import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

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
    <div>
      {/* TOP HEADER */}
      <header className="w-full h-16 bg-gradient-to-r from-blue-100 via-blue-400 to-blue-700 flex items-center justify-between px-6 shadow-md">
        <div>
          <span className="text-xl text-blue-950 font-bold">Sympto</span>
          <span className="text-xl text-sky-600 font-bold">Nexus</span>
        </div>

        <div className="flex items-center gap-4 text-sm text-gray-900">
          <span>{date}</span>
          <span>{time}</span>
        </div>
      </header>

      {/* NAV BAR */}
      <nav className="w-full h-18 bg-blue-100 flex items-center justify-between px-6 shadow">
        <div className="flex items-center">
          <span className="text-xl text-blue-950 font-bold">
            Guiding Your Path
          </span>
          &ensp;
          <span className="text-xl text-blue-500 font-bold">
            From Concern to Calm
          </span>
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
