import React, { useState } from "react";

import { isStrongPassword, doPasswordsMatch } from "../../../Environment";
import { isValidDOB } from "../../../Environment";
import { genderOptions, isValidGender } from "../../../Environment";

const Signup: React.FC = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    dob: "",
    email: "",
    password: "",
    confirmPassword: "",
    gender: "",
  });

  const [error, setError] = useState<string>("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
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
        "Password must be at least 8 characters and include uppercase, lowercase, number, and special character."
      );
      return;
    }

    if (!doPasswordsMatch(formData.password, formData.confirmPassword)) {
      setError("Passwords do not match.");
      return;
    }

    console.log("Signup Data:", formData);
    alert("Account created successfully!");
  };

  return (
    <div className=" flex items-center justify-center">
      {/* CARD */}
      <div className=" shadow-lg rounded-md">
        <h2 className="text-2xl font-bold text-center">
          Create New Account
        </h2>

        <form
          className="grid grid-cols-1 md:grid-cols-6 gap-4"
          onSubmit={handleSubmit}
        >
          {/* Full Name */}
          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            value={formData.fullName}
            onChange={handleChange}
            required
            className="md:col-span-4 px-4 py-2 border rounded-md"
          />

          {/* Date of Birth */}
          <input
            type="date"
            name="dob"
            value={formData.dob}
            onChange={handleChange}
            required
            className="md:col-span-2 px-4 py-2 border rounded-md"
          />

          {/* Email */}
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            required
            className="md:col-span-4 px-4 py-2 border rounded-md"
          />

          {/* Gender */}
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            required
            className="md:col-span-2 px-4 py-2 border rounded-md"
          >
            <option value="">Select Gender</option>
            {genderOptions.map((g) => (
              <option key={g.value} value={g.value}>
                {g.label}
              </option>
            ))}
          </select>

          {/* Password */}
          <input
            type="password"
            name="password"
            placeholder="Create Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="md:col-span-3 px-4 py-2 border rounded-md"
          />

          {/* Confirm Password */}
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            className="md:col-span-3 px-4 py-2 border rounded-md"
          />

          {/* Error Message */}
          {error && (
            <p className="md:col-span-6 text-red-500 text-sm text-center">
              {error}
            </p>
          )}

          {/* Button */}
          <button
            type="submit"
            className="md:col-span-6 bg-blue-600 text-white py-2 font-semibold rounded-md hover:bg-blue-700 transition"
          >
            Create Account
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
