import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { getRoleFromUrl } from "../../../Environment";
import type { Role } from "../../../Environment";
import { loginApi } from "../../../services/authApi";
import type { LoginPayload } from "../../../services/authApi";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // 🔑 ROLE DERIVED FROM URL (SINGLE SOURCE OF TRUTH)
  const selected: Role = getRoleFromUrl(location.search);

  // Form state only
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  /* ---------- LOGIN HANDLER ---------- */
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);

    try {
      const payload: LoginPayload = {
        email: id,
        password,
      };

      const res = await loginApi(payload);

      if (res.data.status === 200) {
        const { token, role } = res.data.data;

        localStorage.setItem("token", token);

        if (role === "admin") navigate("/admin/home");
        else if (role === "doctor") navigate("/doctor-dashboard");
        else if (role === "patient") navigate("/patient/home");
        else navigate("/");
      } else {
        alert(res.data.error_message);
      }
    } catch (error: unknown) {
      console.error("LOGIN ERROR:", error);
      alert("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
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
      <form className="space-y-4">
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
            disabled={loading}
            onChange={(e) => setId(e.target.value)}
            className="w-full px-4 py-2 bg-gray-100 border border-blue-300 rounded-full text-black placeholder-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-300 disabled:opacity-60"
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
            disabled={loading}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 bg-white/20 border border-white/30 rounded-full text-black placeholder-black/70 focus:outline-none focus:ring-2 focus:ring-blue-300 disabled:opacity-60"
            placeholder="Enter your password"
          />

          {/* 🔑 Forgot Password */}
          <div className="text-right mt-1">
            <Link
              to={`/registrationlogin/forgot-password?role=${selected}`}
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
            >
              Forgot Password?
            </Link>
          </div>
        </div>

        <button
          type="button"
          onClick={handleLogin}
          disabled={loading}
          className={`w-full py-2 rounded-full font-semibold shadow-lg transition-all
            ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-300 to-blue-400 dark:from-gray-400 dark:to-gray-600 hover:from-blue-400 hover:to-blue-600 hover:-translate-y-1"
            }
          `}
        >
          {loading ? "Logging in..." : "Login"}
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
