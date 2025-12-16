import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { getRoleFromUrl } from "../../../Environment";
import type { Role } from "../../../Environment";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // 🔑 ROLE DERIVED FROM URL (SINGLE SOURCE OF TRUTH)
  const selected: Role = getRoleFromUrl(location.search);

  // Form state only
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");

  /* ---------- LOGIN HANDLER ---------- */
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
      return;
    }

    navigate("/");
  };

  /* ---------- ROLE SWITCH FROM LOGIN ---------- */
  const switchRole = (role: Role) => {
    navigate(`/registrationlogin/login?role=${role}`);
    setId("");
    setPassword("");
  };

  return (
    <div>
      {/* ROLE SWITCH BUTTONS */}
      <div className="flex justify-center gap-3 mb-6">
        {(["doctor", "patient", "admin"] as Role[]).map((role) => (
          <button
            key={role}
            onClick={() => switchRole(role)}
            className={`px-4 py-2 rounded-md font-semibold capitalize transition-all
              ${
                selected === role
                  ? "bg-blue-500 text-white shadow-md"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
              }`}
          >
            {role}
          </button>
        ))}
      </div>

      {/* HEADING */}
      <h2 className="text-2xl text-center mb-6 text-blue-600 dark:text-blue-300 font-bold">
        {selected.charAt(0).toUpperCase() + selected.slice(1)} Login
      </h2>

      {/* LOGIN FORM */}
      <form className="space-y-4" onSubmit={handleLogin}>
        <div>
          <label className="block mb-1 pl-3 text-gray-700 dark:text-gray-300">
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
          <label className="block mb-1 pl-3 text-gray-700 dark:text-gray-300">
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
          className="w-full bg-gradient-to-r from-blue-300 to-blue-400 dark:from-gray-400 dark:to-gray-600 hover:dark:from-gray-500 hover:dark:to-gray-700  py-2 rounded-full font-semibold hover:from-blue-400 hover:to-blue-600 transition-transform hover:-translate-y-1 shadow-lg"
        >
          Login
        </button>
      </form>

      {/* PATIENT REGISTER LINK */}
      {selected === "patient" && (
        <p className="text-center text-gray-600 dark:text-gray-300 mt-4">
          New here?{" "}
          <Link
            to="/registrationlogin/signup"
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            Register Now
          </Link>
        </p>
      )}
    </div>
  );
};

export default Login;
