import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-hot-toast";

import type { AppDispatch } from "../../../../store/store";
import { createDoctorThunk } from "../../../../store/slices/doctorSlice";

import {
  isStrongPassword,
  doPasswordsMatch,
  getPasswordStrength,
  genderOption,
  DOCTOR_SPECIALIZATIONS
} from "../../../Environment";


const AddDoctor: React.FC = () => {

  const dispatch = useDispatch<AppDispatch>();


  /* ================= STATE ================= */

  const [form, setForm] = useState({

    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
    phone: "",
    gender: "",
    specialization: "",
    password: "",
    confirmPassword: ""

  });


  const [loading, setLoading] = useState(false);


  /* ================= PASSWORD CHECK ================= */

  const passwordStrength = getPasswordStrength(form.password);

  const passwordsMatch =
    form.confirmPassword.length === 0 ||
    doPasswordsMatch(form.password, form.confirmPassword);


  /* ================= HANDLE CHANGE ================= */

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {

    setForm({

      ...form,

      [e.target.name]: e.target.value

    });

  };


  /* ================= SUBMIT ================= */

  const handleSubmit = async (e: React.FormEvent) => {

    e.preventDefault();


    if (!form.gender) {

      toast.error("Please select gender");
      return;

    }


    if (!form.specialization) {

      toast.error("Please select specialization");
      return;

    }


    if (!doPasswordsMatch(form.password, form.confirmPassword)) {

      toast.error("Passwords do not match");
      return;

    }


    if (!isStrongPassword(form.password)) {

      toast.error("Password is not strong enough");
      return;

    }


    const payload = {

  first_name: form.firstName,

  middle_name: form.middleName || undefined,

  last_name: form.lastName,

  email: form.email,

  phone_no: form.phone,

  gender: Number(form.gender),

  specialization: Number(form.specialization),

  password: form.password,

  confirm_password: form.confirmPassword

};

    setLoading(true);


    try {

      const result = await dispatch(createDoctorThunk(payload));


      if (createDoctorThunk.fulfilled.match(result)) {

        toast.success("Doctor created successfully and pending for approval");


        setForm({

          firstName: "",
          middleName: "",
          lastName: "",
          email: "",
          phone: "",
          gender: "",
          specialization: "",
          password: "",
          confirmPassword: ""

        });

      }
      else {

        toast.error(result.payload as string);

      }

    }
    catch {

      toast.error("Something went wrong");

    }
    finally {

      setLoading(false);

    }

  };


  /* ================= INPUT STYLE ================= */

  const inputClass =
    "w-full rounded-md border border-gray-300 px-3 py-2 text-sm " +
    "focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none";


  /* ================= UI ================= */

  return (

    <div className="w-full px-6 py-4">

      <h2 className="text-xl font-semibold mb-6">
        Add Doctor
      </h2>


      <form onSubmit={handleSubmit} className="space-y-6">


        {/* PERSONAL */}

        <div className="bg-white border rounded-lg p-6 space-y-4">

          <h3 className="font-semibold">
            Personal Information
          </h3>

          <div className="grid grid-cols-3 gap-6">

            <input
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
              className={inputClass}
              placeholder="First Name"
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
              placeholder="Last Name"
              required
            />

          </div>

        </div>


        {/* CONTACT */}

        <div className="bg-white border rounded-lg p-6 space-y-4">

          <h3 className="font-semibold">
            Contact Information
          </h3>

          <div className="grid grid-cols-2 gap-6">

            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className={inputClass}
              placeholder="Email"
              required
            />


            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              className={inputClass}
              placeholder="Phone Number"
              required
            />

          </div>

        </div>


        {/* PROFESSIONAL */}

        <div className="bg-white border rounded-lg p-6 space-y-4">

          <h3 className="font-semibold">
            Professional Information
          </h3>

          <div className="grid grid-cols-2 gap-6">


            {/* GENDER */}

           <select
  name="gender"
  value={form.gender}
  onChange={(e) =>
    setForm({
      ...form,
      gender: e.target.value
    })
  }
  className={inputClass}
  required
>
  <option value="">
    Select Gender
  </option>

  {genderOption.map((g) => (
    <option key={g.value} value={g.value}>
      {g.label}
    </option>
  ))}

</select>


            {/* SPECIALIZATION */}

            <select
              name="specialization"
              value={form.specialization}
              onChange={handleChange}
              className={inputClass}
              required
            >

              <option value="">
                Select Specialization
              </option>

              {DOCTOR_SPECIALIZATIONS.map((spec) => (

                <option key={spec.value} value={spec.value}>

                  {spec.label}

                </option>

              ))}

            </select>


          </div>

        </div>


        {/* SECURITY */}

        <div className="bg-white border rounded-lg p-6 space-y-4">

          <h3 className="font-semibold">
            Account Security
          </h3>

          <div className="grid grid-cols-2 gap-6">


            {/* PASSWORD */}

            <div>

              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                className={inputClass}
                placeholder="Password"
                required
              />

              {form.password && (

                <p className="text-sm mt-1 text-blue-600">

                  Strength: {passwordStrength}

                </p>

              )}

            </div>


            {/* CONFIRM PASSWORD */}

            <div>

              <input
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                className={inputClass}
                placeholder="Confirm Password"
                required
              />


              {form.confirmPassword && !passwordsMatch && (

                <p className="text-red-600 text-sm mt-1">

                  Passwords do not match

                </p>

              )}


              {form.confirmPassword && passwordsMatch && (

                <p className="text-green-600 text-sm mt-1">

                  Passwords match

                </p>

              )}

            </div>


          </div>

        </div>


        {/* SUBMIT */}

        <div className="flex justify-end">

          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-md"
          >

            {loading ? "Creating..." : "Add Doctor"}

          </button>

        </div>


      </form>

    </div>

  );

};


export default AddDoctor;
