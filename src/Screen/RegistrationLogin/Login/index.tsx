import { Link, useNavigate, useLocation } from "react-router-dom";
import React, { useState } from "react";


const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();


  // Default role selection + credentials

  const [id, setId] = useState("");
  const [password, setPassword] = useState("");

  //  Read role passed from Navbar
const [selected, setSelected] = useState<string>(
  location.state?.role ?? "doctor"
);

  //  Login logic
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
    <div>
        {/* Role Switch Buttons */}
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

        {/* Heading */}
        <h2 className="text-2xl text-center mb-6 text-blue-600 dark:text-blue-300 font-bold">
          {selected.charAt(0).toUpperCase() + selected.slice(1)} Login
        </h2>

        {/* Login Form */}
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
              // className="w-full p-2 rounded-md border dark:border-gray-700 bg-transparent focus:ring-2 focus:ring-blue-500 outline-none"
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
              // className="w-full p-2 rounded-md border dark:border-gray-700 bg-transparent focus:ring-2 focus:ring-blue-500 outline-none"
              className="w-full px-4 py-2 bg-white/20 border border-white/30 rounded-full text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-blue-300"
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            // className="w-full bg-blue-500 text-white py-2 rounded-md transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg"
          className="w-full bg-gradient-to-r from-blue-300 to-blue-400 py-2 rounded-full font-semibold hover:from-blue-400 hover:to-blue-600 transition-transform hover:-translate-y-1 shadow-lg"
          >
            Login
          </button>
        </form>

        {/* Patient Register Link */}
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