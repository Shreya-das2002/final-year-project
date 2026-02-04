import React, { useState } from "react";

const CreateAdmin = () => {
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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      alert("Password and Confirm Password must match");
      return;
    }

    console.log(form);
  };

  const inputClass =
    "w-full rounded-md border border-gray-400 px-3 py-2 text-sm " +
    "focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none bg-white";

  return (
    <div className="w-full px-6 py-4">
      <h2 className="text-xl font-semibold mb-6">Create Admin</h2>

      <form className="space-y-6" onSubmit={handleSubmit}>
        {/* PERSONAL DETAILS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium mb-1">First Name</label>
            <input
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Middle Name</label>
            <input
              name="middleName"
              value={form.middleName}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Last Name</label>
            <input
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
              className={inputClass}
            />
          </div>
        </div>

        {/* CONTACT DETAILS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-1">
              Phone Number
            </label>
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className={inputClass}
            />
          </div>
        </div>

        {/* ROLE DETAILS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-1">Admin Type</label>
            <select
              name="adminType"
              value={form.adminType}
              onChange={handleChange}
              className={inputClass}
            >
              <option value="">Select Admin Type</option>
              <option>Super Admin</option>
              <option>Admin</option>
              <option>Sub Admin</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Gender</label>
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
        </div>

        {/* SECURITY */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              className={inputClass}
            />
          </div>
        </div>

        {/* ACTIONS */}
        <div className="flex justify-end gap-4 pt-4">
          <button
            type="reset"
            onClick={() =>
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
              })
            }
            className="px-6 py-2 border border-gray-400 rounded-md text-sm"
          >
            Clear
          </button>

          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700"
          >
            Create Admin
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateAdmin;
