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
      alert("Password and Confirm Password must be same");
      return;
    }

    console.log("Create Admin Data:", form);
    // API call goes here
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 max-w-4xl">
      <h2 className="text-xl font-semibold mb-6">Create Admin</h2>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <input
          name="firstName"
          value={form.firstName}
          onChange={handleChange}
          className="input"
          placeholder="First Name"
          required
        />

        <input
          name="middleName"
          value={form.middleName}
          onChange={handleChange}
          className="input"
          placeholder="Middle Name"
        />

        <input
          name="lastName"
          value={form.lastName}
          onChange={handleChange}
          className="input"
          placeholder="Last Name"
          required
        />

        <input
          name="phone"
          value={form.phone}
          onChange={handleChange}
          className="input"
          placeholder="Phone Number"
          required
        />

        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          className="input"
          placeholder="Email"
          required
        />

        <select
          name="adminType"
          value={form.adminType}
          onChange={handleChange}
          className="input"
          required
        >
          <option value="">Select Admin Type</option>
          <option>Super Admin</option>
          <option>Admin</option>
          <option>Sub Admin</option>
        </select>

        <select
          name="gender"
          value={form.gender}
          onChange={handleChange}
          className="input"
          required
        >
          <option value="">Select Gender</option>
          <option>Male</option>
          <option>Female</option>
          <option>Other</option>
        </select>

        <input
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          className="input"
          placeholder="Password"
          required
        />

        <input
          type="password"
          name="confirmPassword"
          value={form.confirmPassword}
          onChange={handleChange}
          className="input"
          placeholder="Confirm Password"
          required
        />

        <div className="md:col-span-2 flex justify-end gap-3 mt-4">
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
            className="border px-5 py-2 rounded-lg"
          >
            Reset
          </button>

          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Create Admin
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateAdmin;
