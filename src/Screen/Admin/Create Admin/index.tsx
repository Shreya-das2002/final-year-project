import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-hot-toast";

import { createAdminApi } from "../../../services/createAdminApi";
import { addAdmin } from "../../../../store/slices/adminSlice";

const CreateAdmin = () => {
  const dispatch = useDispatch();

  const [form, setForm] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    phone: "",
    email: "",
    adminType: "",
    gender: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);

  /* ================= HANDLERS ================= */

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const mapAdminType = (value: string): number | undefined => {
    if (value === "Super Admin") return 1;
    if (value === "Standard Admin") return 2;
    if (value === "Guest Admin") return 3;
    return undefined;
  };

  const mapGender = (value: string): number | undefined => {
    if (value === "Male") return 1;
    if (value === "Female") return 2;
    if (value === "Other") return 3;
    return undefined;
  };

  /* ================= SUBMIT ================= */

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // password validation (same pattern as signup)
    if (form.password !== form.confirmPassword) {
      toast.error("Password and Confirm Password must match");
      return;
    }

    // resolve required values FIRST
    const adminTypeValue = mapAdminType(form.adminType);
    const genderValue = mapGender(form.gender);

    // admin type is REQUIRED
    if (!adminTypeValue) {
      toast.error("Please select Admin Type");
      return;
    }

    const payload = {
      first_name: form.firstName,
      middle_name: form.middleName || undefined,
      last_name: form.lastName,
      phone_no: form.phone,
      email: form.email,
      admin_type: adminTypeValue, // now always number
      gender: genderValue,         // optional
      password: form.password,
    };

    setLoading(true);

    try {
      const res = await createAdminApi(payload);

      if (res.data.success) {
        // store in redux (same style as auth/profile)
        dispatch(addAdmin(res.data.data));

        toast.success("Admin created successfully");

        // reset form
        setForm({
          firstName: "",
          middleName: "",
          lastName: "",
          phone: "",
          email: "",
          adminType: "",
          gender: "",
          password: "",
          confirmPassword: "",
        });
      } else {
        toast.error(res.data.message || "Failed to create admin");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI ================= */

  const inputClass =
    "w-full rounded-md border border-gray-400 px-3 py-2 text-sm " +
    "focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none bg-white";

  return (
    <div className="w-full px-6 py-4">
      <h2 className="text-xl font-semibold mb-6">Create Admin</h2>

      <form className="space-y-6" onSubmit={handleSubmit}>
        {/* PERSONAL DETAILS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <input
            name="firstName"
            value={form.firstName}
            onChange={handleChange}
            className={inputClass}
            placeholder="First Name"
          />
          <input
            name="middleName"
            value={form.middleName}
            onChange={handleChange}
            className={inputClass}
            placeholder="Middle Name"
          />
          <input
            name="lastName"
            value={form.lastName}
            onChange={handleChange}
            className={inputClass}
            placeholder="Last Name"
          />
        </div>

        {/* CONTACT DETAILS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            className={inputClass}
            placeholder="Phone Number"
          />
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className={inputClass}
            placeholder="Email"
          />
        </div>

        {/* ROLE DETAILS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <select
            name="adminType"
            value={form.adminType}
            onChange={handleChange}
            className={inputClass}
          >
            <option value="">Select Admin Type</option>
            <option>Super Admin</option>
            <option>Standard Admin</option>
            <option>Guest Admin</option>
          </select>

          <select
            name="gender"
            value={form.gender}
            onChange={handleChange}
            className={inputClass}
          >
            <option value="">Select Gender</option>
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </select>
        </div>

        {/* SECURITY */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            className={inputClass}
            placeholder="Password"
          />
          <input
            type="password"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            className={inputClass}
            placeholder="Confirm Password"
          />
        </div>

        {/* ACTIONS */}
        <div className="flex justify-end gap-4 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700"
          >
            {loading ? "Creating..." : "Create Admin"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateAdmin;
