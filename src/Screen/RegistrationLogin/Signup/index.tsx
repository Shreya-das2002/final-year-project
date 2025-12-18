import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  isValidDOB,
  genderOptions,
  isValidGender,
  datePickerStyles,
  getPasswordStrength,
  doPasswordsMatch,
  isStrongPassword,
} from "../../../Environment";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs, { Dayjs } from "dayjs";

const Signup: React.FC = () => {
  const navigate = useNavigate();

  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    fullName: "",
    dob: "",
    email: "",
    password: "",
    confirmPassword: "",
    gender: "",
  });

  const passwordStrength = getPasswordStrength(formData.password);
  const passwordsMatch = doPasswordsMatch(
    formData.password,
    formData.confirmPassword
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ SINGLE submit handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setError("");

    if (!isValidDOB(formData.dob)) {
      setError("Please enter a valid date of birth.");
      return;
    }

    if (!isValidGender(formData.gender)) {
      setError("Please select a valid gender.");
      return;
    }

    if (!isStrongPassword(formData.password)) {
      setError(
        "Password must be at least 8 characters."
      );
      return;
    }

    if (!passwordsMatch) {
      setError("Passwords do not match.");
      return;
    }

    // ✅ SUCCESS → redirect
    navigate("/registrationlogin/login?role=patient");
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-3xl p-6 rounded-xl">
        <h2 className="text-2xl font-bold text-center text-blue-600 mb-6">
          Create New Account
        </h2>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-6 gap-4"
        >
          {/* Full Name */}
          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            value={formData.fullName}
            onChange={handleChange}
            required
            className="md:col-span-3 px-4 py-2 border rounded-md"
          />

          {/* DOB */}
          <DatePicker
            openTo="year"
            views={["year", "month", "day"]}
            format="DD/MM/YYYY"
            disableFuture
            value={formData.dob ? dayjs(formData.dob) : null}
            onChange={(newValue: Dayjs | null) =>
              setFormData((prev) => ({
                ...prev,
                dob: newValue ? newValue.toISOString() : "",
              }))
            }
            slotProps={{
              textField: {
                required: true,
                placeholder: "DD/MM/YYYY",
                className: "md:col-span-3",
              },
            }}
            sx={datePickerStyles}
          />

          {/* Email */}
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            required
            className="md:col-span-3 px-4 py-2 border rounded-md"
          />

          {/* Gender */}
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            required
            className="md:col-span-3 px-4 py-2 border rounded-md"
          >
            <option value="">Select Gender</option>
            {genderOptions.map((g) => (
              <option key={g.value} value={g.value}>
                {g.label}
              </option>
            ))}
          </select>

          {/* Password */}
          <div className="md:col-span-3 flex flex-col">
            <div className="relative">
              <input
                type="password"
                name="password"
                placeholder="Create Password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-2 pr-16 border rounded-md"
              />

              {formData.password && (
                <span
                  className={`absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold ${
                    passwordStrength === "Weak"
                      ? "text-red-500"
                      : passwordStrength === "Medium"
                      ? "text-yellow-500"
                      : "text-green-600"
                  }`}
                >
                  {passwordStrength}
                </span>
              )}
            </div>

            {submitted && !isStrongPassword(formData.password) && (
              <p className="mt-1 text-xs text-red-500">
                Password must be at least 8 characters
              </p>
            )}

  {/* ✅ SHOW WHILE TYPING */}
  {formData.password.length > 0 && formData.password.length < 8 && (
    <p className="mt-1 text-xs text-red-500">
      Password must be at least 8 characters
    </p>
  )}
          </div>

          {/* Confirm Password */}
          <div className="md:col-span-3 flex flex-col">
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="px-4 py-2 border rounded-md"
            />

  {formData.password.length >= 8 &&
  formData.confirmPassword.length > 0 && (
    <p
      className={`mt-1 text-xs ${
        passwordsMatch ? "text-green-600" : "text-red-500"
      }`}
    >
      {passwordsMatch
        ? "Passwords match"
        : "Passwords do not match"}
    </p>
)}
          </div>

          {/* Global Error */}
          {error && (
            <p className="md:col-span-6 text-red-500 text-sm text-center">
              {error}
            </p>
          )}

          {/* Submit */}
          <button
            type="submit"
            className="md:col-span-6 bg-blue-600 text-white py-2 font-semibold rounded-md hover:bg-blue-700 transition"
          >
            Create Account
          </button>
        </form>

        <p className="text-center text-gray-600 mt-4">
          Already have an account?{" "}
          <Link to="/registrationlogin/login" className="text-blue-600">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
