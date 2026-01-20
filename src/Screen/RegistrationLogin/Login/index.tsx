import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { getRoleFromUrl } from "../../../Environment";
import type { Role } from "../../../Environment";
import { loginApi } from "../../../services/authApi";
import type { LoginPayload } from "../../../services/authApi";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../../../store/store";
import { loginSuccess } from "../../../../store/slices/authSlice";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();

  //  ROLE FROM URL
  const selected: Role = getRoleFromUrl(location.search);

  // ================= STATE =================
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [idError, setIdError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loading, setLoading] = useState(false);

  // ================= LOGIN HANDLER =================
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    setIdError("");
    setPasswordError("");

    if (!id || !password) {
      toast.error("Please fill all fields");
      return;
    }

    setLoading(true);

    try {
      const payload: LoginPayload = {
        email: id,
        password,
      };

      const res = await loginApi(payload);

      /* ================= SUCCESS ================= */
      if (res.data.success) {
        const { token, role, user } = res.data.data;

        //  REDUX UPDATE (IMPORTANT)
        dispatch(
          loginSuccess({
            token,
            user,
            role,
          })
        );

        //  Persist
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));

        //  Role-based navigation
        if (role === "admin") navigate("/admin");
        else if (role === "doctor") navigate("/doctor");
        else if (role === "patient") navigate("/patient");
        else navigate("/");

        return;
      }

      /* ================= FAILURE ================= */
      const { message, errorCode } = res.data;

      if (errorCode === "USER_NOT_FOUND") {
        setIdError(message || "Invalid User ID");
        toast.error(message || "Invalid User ID");
      } else if (errorCode === "INVALID_PASSWORD") {
        setPasswordError(message || "Invalid Password");
        toast.error(message || "Invalid Password");
      } else {
        toast.error(message || "Login failed");
      }
    } catch (error) {
      console.error("LOGIN ERROR:", error);
      toast.error("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ================= ROLE SWITCH =================
  const switchRole = (role: Role) => {
    navigate(`/registrationlogin/login?role=${role}`);
    setId("");
    setPassword("");
    setIdError("");
    setPasswordError("");
  };

  return (
    <div>
      {/* ROLE SWITCH */}
      <div className="flex justify-center gap-3 mb-6">
        {(["doctor", "patient", "admin"] as Role[]).map((role) => (
          <button
            key={role}
            onClick={() => switchRole(role)}
            className={`px-4 py-2 rounded-md font-semibold capitalize transition-all
              ${
                selected === role
                  ? "bg-blue-500 dark:bg-gray-500 text-white shadow-md"
                  : "bg-blue-300/30 dark:bg-gray-700/30 text-gray-700 dark:text-gray-300"
              }`}
          >
            {role}
          </button>
        ))}
      </div>

      {/* HEADING */}
      <h2 className="text-2xl text-center mb-6 text-blue-600 dark:text-gray-100 font-bold">
        {selected.charAt(0).toUpperCase() + selected.slice(1)} Login
      </h2>

      {/* FORM */}
      <form className="space-y-4" onSubmit={handleLogin}>
        {/* USER ID */}
        <div>
          <label className="block mb-1 pl-3 text-gray-800 dark:text-gray-300">
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
            className="w-full px-4 py-2 rounded-full border focus:ring-2"
            placeholder={
              selected === "doctor"
                ? "Enter Doctor ID"
                : selected === "admin"
                ? "Enter Admin ID"
                : "Enter Your Email"
            }
          />

          {idError && (
            <p className="text-sm text-red-500 mt-1 pl-3">
              {idError}
            </p>
          )}
        </div>

        {/* PASSWORD */}
        <div>
          <label className="block mb-1 pl-3 text-gray-800 dark:text-gray-300">
            Password
          </label>

          <input
            type="password"
            value={password}
            disabled={loading}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 rounded-full border focus:ring-2"
            placeholder="Enter Your Password"
          />

          {passwordError && (
            <p className="text-sm text-red-500 mt-1 pl-3">
              {passwordError}
            </p>
          )}

          <div className="text-right mt-1">
            <Link
              to={`/registrationlogin/forgot-password?role=${selected}`}
              className="text-sm text-blue-600 hover:underline"
            >
              Forgot Password?
            </Link>
          </div>
        </div>

        {/* SUBMIT */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 rounded-full bg-blue-500 text-white font-semibold"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      {/* REGISTER */}
      {selected === "patient" && (
        <p className="text-center mt-4">
          New here?{" "}
          <Link to="/registrationlogin/signup" className="text-blue-600">
            Register Now
          </Link>
        </p>
      )}
    </div>
  );
};

export default Login;
