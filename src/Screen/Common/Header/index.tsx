import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaRegCalendarAlt, FaRegClock } from "react-icons/fa";
import {FiLogIn} from "react-icons/fi";
import Theme from "../Theme/Theme";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../../../../store/store";
import { logout } from "../../../../store/slices/authSlice";


const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);


  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  /* ---------- HOME ---------- */
  const goToHome = () => {
  localStorage.removeItem("token");
  dispatch(logout());    
  navigate("/");
};



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
    <div className="fixed top-0 left-0 w-full z-50">
      {/* ================= TOP HEADER (ALWAYS VISIBLE) ================= */}
      <header className="h-16 bg-linear-to-r from-sky-100 via-cyan-600 to-cyan-800 dark:from-sky-700 dark:via-sky-800 dark:to-sky-950 flex items-center justify-between px-3 shadow-md">
        <div
          onClick={goToHome}
          className="cursor-pointer select-none"
        >
          <span className="text-2xl text-blue-950 dark:text-gray-900 font-bold">
            Sympto
          </span>
          <span className="text-2xl text-sky-600 dark:text-gray-300 font-bold">
            Nexus
          </span>
        
          <h6 className=" text-sky-900 text-xs pt-1 dark:text-white">
            Guiding Your Path, From Concern to Calm
          </h6>
          
        </div>

      {/* RIGHT NAV ITEMS */}
<div className="flex items-center text-sm text-white font-medium pl-10">

  {/* THEME */}
  <div className="w-20 flex justify-center">
    <Theme />
  </div>

  {/* DATE */}
  <div className="w-40 flex items-center gap-3">
    <span className="bg-white/30 p-2 rounded-full">
      <FaRegCalendarAlt className="text-lg" />
    </span>

    <span className="whitespace-nowrap">{date}</span>
  </div>

  {/* TIME */}
  <div className="w-36 flex pl-3 items-center gap-3">
    <span className="bg-white/30 p-2 rounded-full ">
      <FaRegClock className="text-lg" />
    </span>

    <span className="whitespace-nowrap">{time}</span>
  </div>

  {/* SIGN IN / BACK */}
    {(!user || Object.keys(user).length === 0) && (
  <button
    onClick={handleSignInClick}
    className="flex items-center gap-2 px-6 h-11 rounded-lg font-semibold text-white 
               bg-linear-to-r from-sky-500 to-cyan-700 hover:from-sky-600 hover:to-cyan-900 
               dark:from-sky-800 dark:to-sky-900
               dark:hover:from-sky-700 dark:hover:to-sky-800
               transition-all"
  >
    <FiLogIn />
    <span>Sign In</span>
  </button>
)}
</div>
      </header>

      {/* ================= NAV BAR ================= */}

    </div>
  );
};

export default Header;
