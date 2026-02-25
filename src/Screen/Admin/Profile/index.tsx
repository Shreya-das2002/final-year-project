import React from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../../../../store/store";
import {getGenderLabel, DOCTOR_SPECIALIZATIONS} from "../../../Environment";

import {
  FaTimes,
  FaUserShield,
  FaEnvelope,
  FaUserCircle,
  FaPhone, 
  FaVenusMars,
  FaHospital
} from "react-icons/fa";


interface Props {
  open: boolean;
  onClose: () => void;
}

const AdminProfile: React.FC<Props> = ({ open, onClose }) => {

  // Get admin user from Redux store
  const user = useSelector((state: RootState) => state.auth.user);

  // If no user, don't render
  if (!user) return null;

  // Admin initials
  const initials =
    user.first_name?.charAt(0).toUpperCase() +
    user.last_name?.charAt(0).toUpperCase();

  // Full name
  const fullName =
    `${user.first_name} ${user.middle_name || ""} ${user.last_name}`.trim();


  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/30 z-40 transition-opacity ${
          open ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={onClose}
      />


      {/* Drawer */}
      <div
        className={`fixed top-16 bottom-0 right-0 w-[420px]
        bg-gradient-to-br from-sky-100 to-blue-200
        shadow-2xl z-50
        transform transition-transform duration-300
        ${open ? "translate-x-0" : "translate-x-full"}
        overflow-y-auto`}
      >


        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 text-gray-500 hover:text-red-500"
        >
          <FaTimes size={18} />
        </button>


        {/* Content */}
        <div className="p-6 text-center">


          {/* Avatar */}
          <div className="flex justify-center">
            <div className="
              w-24 h-24
              rounded-full
              bg-blue-600
              flex items-center justify-center
              text-white text-2xl font-semibold
              shadow-lg
            ">
              {initials || "A"}
            </div>
          </div>


          {/* Name */}
          <h2 className="mt-4 text-xl font-semibold text-gray-800">
            {fullName}
          </h2>


          {/* Email */}
          <p className="text-gray-600 flex justify-center items-center gap-2 mt-1">
            <FaEnvelope />
            {user.email}
          </p>


          {/* Role Chip */}
          <div className="mt-4 flex justify-center">

            <span className="
              px-4 py-2
              bg-white/70
              rounded-full
              shadow
              flex items-center gap-2
              text-gray-700
            ">
              <FaUserShield />
              {user.role || "Admin"}
            </span>


          </div>


          {/* Admin Details Card */}
          <div className="
            mt-6
            bg-white/60
            backdrop-blur-md
            rounded-xl
            shadow-md
            p-4
            text-left
          ">


            <div className="space-y-3 text-sm text-gray-700">


              <p className="flex items-center gap-2">
                <FaUserCircle className="text-blue-500" />
                <span className="font-medium">Name:</span>
                {fullName}
              </p>


              <p className="flex items-center gap-2">
                <FaEnvelope className="text-green-500" />
                <span className="font-medium">Email:</span>
                {user.email}
              </p>


              <p className="flex items-center gap-2">
                <FaPhone className="text-purple-500" />
                <span className="font-medium">Phone no:</span>
                {user.phone_no}
              </p>

              <p className="flex items-center gap-2">
                <FaVenusMars className="text-orange-500" />
                <span className="font-medium">Gender:</span>
                {getGenderLabel(user.gender) || "—"}
              </p>
              
          {user.role === "standard admin" && (
  <p className="flex items-center gap-2">
    <FaHospital className="text-blue-500" />
    <span className="font-medium">Department:</span>
    {
    user.department_id
      ? user.department_id
          .split(",")
          .map(id =>
            DOCTOR_SPECIALIZATIONS.find(
              spec => spec.value === Number(id)
            )?.department
          )
          .filter(Boolean)
          .join(", ")
      : "-"
  }
  </p>
)}

            </div>

          </div>
 
        </div>
{/* DELETE BUTTON */}
        <div className="w-full flex justify-end mt-6 pr-2 pt-10 items-end">
          <button className="px-6 py-2 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 transition">
            Delete My Account
          </button>
        </div>

      </div>

      
    </>
  );
};

export default AdminProfile;
