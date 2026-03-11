import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { getRoleFromUrl } from "../../../Environment";
import type { Role } from "../../../Environment";
import {
  sendOtpApi,
  verifyOtpApi,
  resetPasswordApi
} from "../../../services/authApi";
import toast from "react-hot-toast";

const ForgotPassword: React.FC = () => {

  const location = useLocation();

  // ROLE FROM URL
  const selected: Role = getRoleFromUrl(location.search);

  const [step, setStep] = useState(1);

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);

  /* ================= SEND OTP ================= */

  const handleSendOtp = async () => {

    if (!email) {
      toast.error("Please enter email");
      return;
    }

    setLoading(true);

    try {

      const res = await sendOtpApi({
        email,
        role: selected
      });

      if (res.data.success) {

        setToken(res.data.data.token);

        toast.success("OTP sent successfully");

        setStep(2);

      } else {

        toast.error(res.data.message || "Failed to send OTP");

      }

    } catch (error) {

      console.error("SEND OTP ERROR:", error);

      toast.error("Server error");

    } finally {

      setLoading(false);

    }

  };

  /* ================= VERIFY OTP ================= */

  const handleVerifyOtp = async () => {

    if (!otp) {
      toast.error("Enter OTP");
      return;
    }

    setLoading(true);

    try {

      const res = await verifyOtpApi({
        otp,
        token
      });

      if (res.data.success) {

        toast.success("OTP verified");

        setStep(3);

      } else {

        toast.error(res.data.message || "Invalid OTP");

      }

    } catch (error) {

      console.error("VERIFY OTP ERROR:", error);

      toast.error("Verification failed");

    } finally {

      setLoading(false);

    }

  };

  /* ================= RESET PASSWORD ================= */

  const handleResetPassword = async () => {

    if (!password || !confirmPassword) {
      toast.error("Please fill all fields");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);

    try {

      const res = await resetPasswordApi({
        password,
        confirmPassword,
        token
      });

      if (res.data.success) {

        toast.success("Password updated successfully");

        setStep(1);

        setEmail("");
        setOtp("");
        setPassword("");
        setConfirmPassword("");

      } else {

        toast.error(res.data.message || "Reset failed");

      }

    } catch (error) {

      console.error("RESET PASSWORD ERROR:", error);

      toast.error("Server error");

    } finally {

      setLoading(false);

    }

  };

  return (
    <div>

      {/* HEADING */}

      <h2 className="text-2xl text-center mb-6 text-blue-600 dark:text-gray-100 font-bold">
        Reset {selected.charAt(0).toUpperCase() + selected.slice(1)} Password
      </h2>

      <div className="space-y-4">

        {/* STEP 1 EMAIL */}

        {step === 1 && (
          <>
            <label className="block mb-1 pl-3 text-gray-800 dark:text-gray-300">
              Email
            </label>

            <input
              type="email"
              value={email}
              disabled={loading}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 rounded-full border"
              placeholder="Enter your registered email"
            />

            <button
              onClick={handleSendOtp}
              disabled={loading}
              className="w-full py-2 rounded-full bg-blue-500 text-white font-semibold"
            >
              {loading ? "Sending..." : "Send OTP"}
            </button>
          </>
        )}

        {/* STEP 2 OTP */}

        {step === 2 && (
          <>
            <label className="block mb-1 pl-3 text-gray-800 dark:text-gray-300">
              Enter OTP
            </label>

            <input
              type="text"
              value={otp}
              disabled={loading}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full px-4 py-2 rounded-full border"
              placeholder="Enter verification code"
            />

            <button
              onClick={handleVerifyOtp}
              disabled={loading}
              className="w-full py-2 rounded-full bg-blue-500 text-white font-semibold"
            >
              Verify OTP
            </button>
          </>
        )}

        {/* STEP 3 PASSWORD */}

        {step === 3 && (
          <>
            <label className="block mb-1 pl-3 text-gray-800 dark:text-gray-300">
              New Password
            </label>

            <input
              type="password"
              value={password}
              disabled={loading}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-full border"
              placeholder="Enter new password"
            />

            <label className="block mb-1 pl-3 text-gray-800 dark:text-gray-300">
              Confirm Password
            </label>

            <input
              type="password"
              value={confirmPassword}
              disabled={loading}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-full border"
              placeholder="Confirm new password"
            />

            <button
              onClick={handleResetPassword}
              disabled={loading}
              className="w-full py-2 rounded-full bg-blue-500 text-white font-semibold"
            >
              Reset Password
            </button>
          </>
        )}

        {/* BACK LINK */}

        <div className="text-right mt-1">
          <Link
            to={`/registrationlogin/login?role=${selected}`}
            className="text-sm text-blue-600 hover:underline"
          >
            Back to Login
          </Link>
        </div>

      </div>

    </div>
  );
};

export default ForgotPassword;