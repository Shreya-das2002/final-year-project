import React, { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { signupApi } from "../../../services/authApi";
import {
  genderOptions,
  isValidGender,
  getPasswordStrength,
  doPasswordsMatch,
  isStrongPassword,
} from "../../../Environment";

const RequiredStar = ({ required }: { required?: boolean }) =>
  required ? (
    <span className="absolute top-1/2 right-4 -translate-y-1/2 text-red-500 text-sm font-bold pointer-events-none">
      *
    </span>
  ) : null;

/* 🆕 GENDER MAPPING */
const genderToNumber: Record<string, number> = {
  male: 1,
  female: 2,
  other: 3,
};

const Signup: React.FC = () => {
  const navigate = useNavigate();

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
    phone: "",
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
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!isValidGender(formData.gender)) {
      setError("Please select a valid gender.");
      return;
    }

    if (!genderToNumber[formData.gender]) {
      setError("Invalid gender selected.");
      return;
    }

    if (!isStrongPassword(formData.password)) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (!passwordsMatch) {
      setError("Passwords do not match.");
      return;
    }

    if (!/^[0-9]{10}$/.test(formData.phone)) {
      setError("Please enter a valid 10-digit phone number");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        first_name: formData.firstName,
        middle_name: formData.middleName || "",
        last_name: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        confirm_password: formData.confirmPassword,
        gender: genderToNumber[formData.gender],
      };

      const res = await signupApi(payload);
      const apiResponse = res?.data;

      if (apiResponse?.status === 200 && apiResponse?.data?.success) {
        toast.success("Account created successfully");
        navigate("/registrationlogin/login?role=patient");
      } else {
        toast.error(apiResponse?.error_message || "Signup failed");
      }
    } catch {
      toast.error("Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center">
      <div className="w-full max-w-3xl p-6 rounded-xl">

        <h2 className="text-2xl font-bold text-center text-blue-600 mb-6">
          Create New Account
        </h2>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-6 gap-4"
        >
          <div className="md:col-span-2 relative">
            <RequiredStar required />
            <input
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="First Name"
              required
              className="w-full px-4 py-2 border rounded-md"
            />
          </div>

          <div className="md:col-span-2 relative">
            <input
              name="middleName"
              value={formData.middleName}
              onChange={handleChange}
              placeholder="Middle Name"
              className="w-full px-4 py-2 border rounded-md"
            />
          </div>

          <div className="md:col-span-2 relative">
            <RequiredStar required />
            <input
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Last Name"
              required
              className="w-full px-4 py-2 border rounded-md"
            />
          </div>

          <div className="md:col-span-2 relative">
            <RequiredStar required />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              required
              className="w-full px-4 py-2 border rounded-md"
            />
          </div>

          <div className="md:col-span-2 relative">
            <RequiredStar required />
            <input
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Phone"
              required
              className="w-full px-4 py-2 border rounded-md"
            />
          </div>

          <div className="md:col-span-2 relative">
            <RequiredStar required />
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-md"
            >
              <option value="">Select Gender</option>
              {genderOptions.map(g => (
                <option key={g.value} value={g.value}>
                  {g.label}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-3 relative">
            <RequiredStar required />
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              required
              className="w-full px-4 py-2 border rounded-md"
            />
            <small className="text-gray-500">{passwordStrength}</small>
          </div>

          <div className="md:col-span-3 relative">
            <RequiredStar required />
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm Password"
              required
              className="w-full px-4 py-2 border rounded-md"
            />

            {formData.confirmPassword.length > 0 && (
              <p
                className={`text-xs mt-1 ${
                  passwordsMatch ? "text-green-600" : "text-red-500"
                }`}
              >
                {passwordsMatch ? "Passwords match " : "Passwords do not match "}
              </p>
            )}
          </div>

          {error && (
            <p className="md:col-span-6 text-red-500 text-center">{error}</p>
          )}

          <button
            disabled={loading}
            className="md:col-span-6 bg-blue-600 text-white py-2 rounded-md disabled:opacity-60"
          >
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <p className="text-center mt-4">
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
