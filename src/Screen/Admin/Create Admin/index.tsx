import React, { useState, useRef, useEffect } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-hot-toast";

import { createAdminApi } from "../../../services/createAdminApi";
import { addAdmin } from "../../../../store/slices/adminSlice";

import {
  isStrongPassword,
  doPasswordsMatch,
  getPasswordStrength,
  genderOption,
  DOCTOR_SPECIALIZATIONS
} from "../../../Environment";

import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

const CreateAdmin = () => {

  const dispatch = useDispatch();

  const [form, setForm] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    phone: "",
    email: "",
    adminType: "",
    department: [] as number[],
    gender: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  /* KEEP password strength */
  const passwordStrength = getPasswordStrength(form.password);

  const passwordsMatch =
    form.confirmPassword.length === 0 ||
    doPasswordsMatch(form.password, form.confirmPassword);

  /* dropdown toggle state */
  const [showDepartmentDropdown, setShowDepartmentDropdown] = useState(false);

  /* ADD REF */
  const dropdownRef = useRef<HTMLDivElement>(null);

  /* ADD OUTSIDE CLICK HANDLER */
  useEffect(() => {

    const handleClickOutside = (event: MouseEvent) => {

      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDepartmentDropdown(false);
      }

    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };

  }, []);


  /* HANDLERS */

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {

    setForm({
      ...form,
      [e.target.name]: e.target.value
    });

  };


  /* MULTI SELECT DEPARTMENT HANDLER */

  const handleDepartmentChange = (value: number) => {

    if (form.department.includes(value)) {

      setForm({
        ...form,
        department: form.department.filter(d => d !== value)
      });

    }
    else {

      setForm({
        ...form,
        department: [...form.department, value]
      });

    }

  };


  const mapAdminType = (value: string): number | undefined => {

    if (value === "Standard Admin") return 2;
    if (value === "Guest Admin") return 3;

    return undefined;

  };


  const mapGender = (value: string): number | undefined => {

    if (!value) return undefined;

    return Number(value);

  };


  /* SUBMIT */

  const handleSubmit = async (e: React.FormEvent) => {

    e.preventDefault();

    if (!doPasswordsMatch(form.password, form.confirmPassword)) {

      toast.error("Password and Confirm Password must match");
      return;

    }

    if (!isStrongPassword(form.password)) {

      toast.error(
        "Password must be at least 8 characters with uppercase, lowercase, number and special character"
      );

      return;

    }

    const adminTypeValue = mapAdminType(form.adminType);
    const genderValue = mapGender(form.gender);

    if (!adminTypeValue) {

      toast.error("Please select Admin Type");
      return;

    }

    if (
  form.adminType === "Standard Admin" &&
  form.department.length === 0
) {

  toast.error("Please select Department");
  return;

}

    const payload = {

      first_name: form.firstName,
      middle_name: form.middleName || undefined,
      last_name: form.lastName,
      phone_no: form.phone,
      email: form.email,
      admin_type: adminTypeValue,
      gender: genderValue,
      password: form.password,
      confirm_password: form.confirmPassword,
    department_id:
  adminTypeValue === 2
    ? [...form.department]   
    : []

    };

    setLoading(true);

    try {

      const res = await createAdminApi(payload);

      if (res.data.success) {

        dispatch(addAdmin(res.data.data));

        toast.success("Admin created successfully");

        setForm({
          firstName: "",
          middleName: "",
          lastName: "",
          phone: "",
          email: "",
          adminType: "",
          department: [],
          gender: "",
          password: "",
          confirmPassword: "",
        });

      }
      else {

        toast.error(res.data.message || "Failed to create admin");

      }

    }
    catch {

      toast.error("Something went wrong");

    }
    finally {

      setLoading(false);

    }

  };


  /* UI */

  const inputClass =
  "w-full h-11 rounded-md border border-gray-400 px-3 pr-10 text-sm focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none bg-white";

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


        {/* CONTACT */}

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


        {/* ROLE */}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* ADMIN TYPE */}

          <select
  name="adminType"
  value={form.adminType}
  onChange={(e) => {

    const value = e.target.value;

    setForm({
      ...form,
      adminType: value,

      // clear department if Guest Admin selected
      department: value === "Guest Admin" ? [] : form.department

    });

  }}
  className={inputClass}
>

            <option value="">Select Admin Type</option>
            <option>Standard Admin</option>
            <option>Guest Admin</option>
          </select>


          {/* MULTI CHECKBOX DEPARTMENT */}

          <div className="relative" ref={dropdownRef}>

            <div
  className={
    inputClass +
    " cursor-pointer " +
    (form.adminType === "Guest Admin"
      ? "bg-gray-200 cursor-not-allowed"
      : "")
  }

  onClick={() => {

    if (form.adminType === "Guest Admin") return;

    setShowDepartmentDropdown(!showDepartmentDropdown);

  }}
>

              {
                form.department.length > 0
                  ? DOCTOR_SPECIALIZATIONS
                      .filter(dept => form.department.includes(dept.value))
                      .map(dept => dept.label)
                      .join(", ")
                  : "Select Department"
              }
            </div>

            {showDepartmentDropdown && (

              <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1 max-h-60 overflow-y-auto">

                {DOCTOR_SPECIALIZATIONS.map((dept) => (

                  <label
                    key={dept.value}
                    className="flex items-center px-3 py-2 hover:bg-gray-100 cursor-pointer"
                  >

                    <input
  type="checkbox"
  checked={form.department.includes(dept.value)}

  onChange={() => {

    if (form.adminType === "Guest Admin") return;

    handleDepartmentChange(dept.value);

  }}

  disabled={form.adminType === "Guest Admin"}

  className="mr-2"
/>


                    {dept.department}

                  </label>

                ))}

              </div>

            )}

          </div>


          {/* GENDER */}

          <select
            name="gender"
            value={form.gender}
            onChange={handleChange}
            className={inputClass}
          >
            <option value="">Select Gender</option>

            {genderOption.map((g) => (

              <option key={g.value} value={g.value}>
                {g.label}
              </option>

            ))}

          </select>

        </div>


        {/* PASSWORD */}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              <div>
          <div className="relative ">

            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={form.password}
              onChange={handleChange}
              className={`${inputClass} h-11 pr-10`}
              placeholder="Password"
            />
            {/* Eye Icon */}
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-[50%] translate-y-[-50%] pointer-events-auto"
            >
              {showPassword ? (
                <EyeIcon className="w-5 h-5" />
              ) : (
                <EyeSlashIcon className="w-5 h-5" />
              )}
            </button>          

          </div>

           {form.password && (
              <p className="text-sm mt-1">
                Strength: {passwordStrength}
              </p>
            )}

            </div>

              <div>
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              className={`${inputClass} h-11  pr-10`}
              placeholder="Confirm Password"
            />
            {/* Eye Icon */}
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500"
            >
              {showConfirmPassword ? (
                <EyeIcon className="w-5 h-5" />
              ) : (
                <EyeSlashIcon className="w-5 h-5" />
              )}
            </button>  
          </div>

          {form.confirmPassword && !passwordsMatch && (
              <p className="text-red-600 h-5 text-sm mt-1">
                Password does not match
              </p>
            )}
</div>

        </div>


        {/* BUTTON */}

        <div className="flex justify-end pt-4">

          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            {loading ? "Creating..." : "Create Admin"}
          </button>

        </div>

      </form>

    </div>

  );

};

export default CreateAdmin;
