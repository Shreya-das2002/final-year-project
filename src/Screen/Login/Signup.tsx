import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

import background from "../logo/Background.jpg";
import dark_background from "../logo/dark_background.jpg";
import signup_logo from "../logo/signup_logo.jpg";
import dark_signup from "../logo/dark_signup.jpg";

const Signup: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  /* ================= DARK MODE DETECTION ================= */
  const [isDark, setIsDark] = useState(
    document.documentElement.classList.contains("dark")
  );

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains("dark"));
    });

    observer.observe(document.documentElement, { attributes: true });
    return () => observer.disconnect();
  }, []);

  /* ================= ROLE (DERIVED FROM ROUTER STATE) ================= */
  const [selected, setSelected] = useState<string>(
    location.state?.role ?? "doctor"
  );

  /* ================= FORM STATE ================= */
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");

  /* ================= LOGIN LOGIC ================= */
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    if (selected === "admin") {
      if (id === "2590012300" && password === "symptonexus") {
        navigate("/admin/home");
      } else {
        alert("Invalid Admin ID or Password");
      }
      return;
    }

    if (selected === "doctor") {
      navigate("/doctor-dashboard");
    } else {
      navigate("/");
    }
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-cover bg-center"
      style={{
        backgroundImage: `url(${isDark ? dark_background : background})`,
      }}
    >
      <div
        className="bg-white dark:bg-gray-800 shadow-lg p-8 w-full max-w-md rounded-3xl bg-opacity-90 dark:bg-opacity-90"
        style={{
          backgroundImage: `url(${isDark ? dark_signup : signup_logo})`,
        }}
      >
        {/* ================= ROLE SWITCH ================= */}
        <div className="flex justify-center gap-3 mb-6">
          {["doctor", "patient", "admin"].map((role) => (
            <button
              key={role}
              onClick={() => setSelected(role)}
              className={`px-4 py-2 rounded-md text-sm font-semibold capitalize transition-all duration-300
                ${
                  selected === role
                    ? "bg-blue-500 text-white shadow-md hover:-translate-y-1"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                }`}
            >
              {role}
            </button>
          ))}
        </div>

        {/* ================= HEADING ================= */}
        <h2 className="text-2xl text-center mb-6 text-blue-600 dark:text-blue-300 font-bold">
          {selected.charAt(0).toUpperCase() + selected.slice(1)} Login
        </h2>

        {/* ================= FORM ================= */}
        <form className="space-y-4" onSubmit={handleLogin}>
          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-1 pl-3">
              {selected === "doctor"
                ? "Doctor ID"
                : selected === "admin"
                ? "Admin ID"
                : "Email"}
            </label>

            <input
              type="text"
              value={id}
              onChange={(e) => setId(e.target.value)}
              className="w-full px-4 py-2 bg-white/20 border border-white/30 rounded-full text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-blue-300"
              placeholder={
                selected === "doctor"
                  ? "Enter Doctor ID"
                  : selected === "admin"
                  ? "Enter Admin ID"
                  : "Enter your email"
              }
            />
          </div>

          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-1 pl-3">
              Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 bg-white/20 border border-white/30 rounded-full text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-blue-300"
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-300 to-blue-400 py-2 rounded-full font-semibold hover:from-blue-400 hover:to-blue-600 transition-transform hover:-translate-y-1 shadow-lg"
          >
            Login
          </button>
        </form>

        {/* ================= PATIENT REGISTER ================= */}
        {selected === "patient" && (
          <p className="text-center text-gray-600 dark:text-gray-300 mt-4">
            New here?{" "}
            <Link
              to="/Register"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              Register Now
            </Link>
          </p>
        )}
      </div>
    </div>
  );
};

export default Signup;
