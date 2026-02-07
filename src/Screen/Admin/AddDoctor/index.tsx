import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-hot-toast";
import { DOCTOR_SPECIALIZATIONS } from "../../../Environment";

// import { createDoctorApi } from "../../../services/createDoctorApi";
// import { addDoctor } from "../../../../store/slices/doctorSlice";

import {
  isStrongPassword,
  doPasswordsMatch,
  getPasswordStrength,
  genderOptions,
} from "../../../Environment";

const AddDoctor: React.FC = () => {

  const dispatch = useDispatch();

  const [form, setForm] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
    phone: "",
    gender: "",
    specializationId: "",
    password: "",
    confirmPassword: "",
    status: "active",
  });

  const [loading, setLoading] = useState(false);

  /* Password strength */
  const passwordStrength = getPasswordStrength(form.password);

  const passwordsMatch =
    form.confirmPassword.length === 0 ||
    doPasswordsMatch(form.password, form.confirmPassword);

  /* Handle change */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ): void => {

    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

  };

  /* Submit */
  const handleSubmit = async (
    e: React.FormEvent
  ): Promise<void> => {

    e.preventDefault();

    if (!doPasswordsMatch(form.password, form.confirmPassword)) {
      toast.error("Password and Confirm Password must match");
      return;
    }

    if (!isStrongPassword(form.password)) {
      toast.error("Password is not strong enough");
      return;
    }

    if (!form.specializationId) {
      toast.error("Please select specialization");
      return;
    }

    const payload = {
      first_name: form.firstName,
      middle_name: form.middleName || undefined,
      last_name: form.lastName,
      email: form.email,
      phone_no: form.phone,
      gender: form.gender,
      specialization_id: Number(form.specializationId),
      password: form.password,
      status: form.status,
    };

    setLoading(true);

    try {

      const res = await createDoctorApi(payload);

      if (res.data.success) {

        dispatch(addDoctor(res.data.data));

        toast.success("Doctor account created successfully");

        setForm({
          firstName: "",
          middleName: "",
          lastName: "",
          email: "",
          phone: "",
          gender: "",
          specializationId: "",
          password: "",
          confirmPassword: "",
          status: "active",
        });

      } else {

        toast.error(res.data.message);

      }

    } catch {

      toast.error("Something went wrong");

    } finally {

      setLoading(false);

    }

  };

  const inputClass =
    "w-full rounded-md border border-gray-300 px-3 py-2 text-sm " +
    "focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none bg-white";

  return (

    <div className="w-full px-6 py-4">

      <h2 className="text-xl font-semibold mb-6">
        Add Doctor
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Personal Information */}
        <div className="bg-white border rounded-lg p-6 space-y-4">

          <h3 className="font-semibold">
            Personal Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            <input
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
              className={inputClass}
              placeholder="First Name *"
              required
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
              placeholder="Last Name *"
              required
            />

          </div>

        </div>

        {/* Contact Information */}
        <div className="bg-white border rounded-lg p-6 space-y-4">

          <h3 className="font-semibold">
            Contact Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className={inputClass}
              placeholder="Email *"
              required
            />

            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              className={inputClass}
              placeholder="Phone Number *"
              required
            />

          </div>

        </div>

        {/* Professional Information */}
        <div className="bg-white border rounded-lg p-6 space-y-4">

          <h3 className="font-semibold">
            Professional Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            <select
              name="gender"
              value={form.gender}
              onChange={handleChange}
              className={inputClass}
              required
            >
              <option value="">Select Gender *</option>

              {genderOptions.map((g) => (
                <option key={g.value} value={g.value}>
                  {g.label}
                </option>
              ))}

            </select>

            <select name="specialization" className="input">
  <option value="">Select Specialization</option>

  {DOCTOR_SPECIALIZATIONS.map((spec) => (
    <option key={spec} value={spec}>
      {spec}
    </option>
  ))}
</select>
          </div>

        </div>

        {/* Security */}
        <div className="bg-white border rounded-lg p-6 space-y-4">

          <h3 className="font-semibold">
            Account Security
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            <div>

              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                className={inputClass}
                placeholder="Password *"
                required
              />

              {form.password && (

                <p
                  className={`text-sm mt-1 ${
                    passwordStrength === "Strong"
                      ? "text-green-600"
                      : passwordStrength === "Medium"
                      ? "text-yellow-600"
                      : "text-red-600"
                  }`}
                >
                  {passwordStrength}
                </p>

              )}

            </div>

            <div>

              <input
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                className={inputClass}
                placeholder="Confirm Password *"
                required
              />

              {form.confirmPassword && !passwordsMatch && (
                <p className="text-red-600 text-sm mt-1">
                  Password does not match
                </p>
              )}

              {form.confirmPassword && passwordsMatch && (
                <p className="text-green-600 text-sm mt-1">
                  Password match
                </p>
              )}

            </div>

          </div>

        </div>

        {/* Submit */}
        <div className="flex justify-end">

          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            {loading ? "Creating..." : "Add Doctor"}
          </button>

        </div>

      </form>

    </div>

  );

};

export default AddDoctor;
