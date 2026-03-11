import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const Forgotpassword = () => {

  const [step, setStep] = useState(1);

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [token, setToken] = useState("");

  /* ================= SEND OTP ================= */

  const handleSendOtp = async () => {

    try {

      const res = await axios.post("/api/auth/send-otp", {
        email
      });

      if (res.data.success) {

        setToken(res.data.data.token);

        toast.success("OTP sent to email");

        setStep(2);

      }

    } catch {

      toast.error("Failed to send OTP");

    }

  };


  /* ================= VERIFY OTP ================= */

  const handleVerifyOtp = async () => {

    try {

      const res = await axios.post("/api/auth/verify-otp", {
        otp,
        token
      });

      if (res.data.success) {

        toast.success("OTP verified");

        setStep(3);

      }

    } catch {

      toast.error("Invalid OTP");

    }

  };


  /* ================= RESET PASSWORD ================= */

  const handleResetPassword = async () => {

    try {

      const res = await axios.post("/api/auth/reset-password", {
        password,
        confirmPassword,
        token
      });

      if (res.data.success) {

        toast.success("Password updated successfully");

        setStep(1);

      }

    } catch {

      toast.error("Password reset failed");

    }

  };



  return (

    <div className="flex items-center justify-center  ">

      <div className= "p-8 rounded-xl ">

        <h2 className="text-2xl font-semibold text-center mb-2">
          Reset Patient Password
        </h2>

        <p className="text-center text-gray-500 mb-6">
          Enter your email address and we'll send you OTP in email address
        </p>


        {/* STEP 1 EMAIL */}

        {step === 1 && (

          <div className="flex flex-col gap-4">

            <label className="font-medium">
              Email Address
            </label>

            <input
              type="email"
              placeholder="Enter your registered email"
              className="border rounded-lg p-3"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <button
              onClick={handleSendOtp}
              className="bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
            >
              Send OTP
            </button>

          </div>

        )}



        {/* STEP 2 OTP */}

        {step === 2 && (

          <div className="flex flex-col gap-4">

            <label className="font-medium">
              Verification Code
            </label>

            <input
              type="text"
              placeholder="Enter OTP"
              className="border rounded-lg p-3"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />

            <button
              onClick={handleVerifyOtp}
              className="bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
            >
              Verify OTP
            </button>

          </div>

        )}



        {/* STEP 3 PASSWORD */}

        {step === 3 && (

          <div className="flex flex-col gap-4">

            <label className="font-medium">
              New Password
            </label>

            <input
              type="password"
              className="border rounded-lg p-3"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <label className="font-medium">
              Confirm Password
            </label>

            <input
              type="password"
              className="border rounded-lg p-3"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

            <button
              onClick={handleResetPassword}
              className="bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
            >
              Reset Password
            </button>

          </div>

        )}

      </div>

    </div>

  );

};

export default Forgotpassword;