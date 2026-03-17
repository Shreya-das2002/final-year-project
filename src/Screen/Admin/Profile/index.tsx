import React from "react";
import { useSelector } from "react-redux";
import {useState, useEffect} from "react";
import type { RootState } from "../../../../store/store";
import {getGenderLabel, DOCTOR_SPECIALIZATIONS} from "../../../Environment";
import background from "../../../assets/apply_light.jpeg"
import dark_background from "../../../assets/doctor_light.webp"

import {
  FaEdit,
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

   const [isDark, setIsDark] = useState(
        document.documentElement.classList.contains("dark")
      ); 
  
        useEffect(() => {
          const observer = new MutationObserver(() => {
            setIsDark(document.documentElement.classList.contains("dark"));
          });
          observer.observe(document.documentElement, { attributes: true });
          return () => observer.disconnect();
        }, []);
  
  
 const buttons = useSelector(
    (state: RootState) => state.auth.buttons
  );

  const canDeleteMyProfile = buttons?.some(
    (btn) => btn.control_key === "delete my acc"
  );


  const canEditProfile = buttons?.some(
    (btn) => btn.control_key === "edit profile"
  );

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
        className={`fixed top-16 bottom-0 right-0 w-[400px]
        shadow-2xl z-50 min-h-[calc(100vh-110px)] bg-cover bg-auto flex flex-col justify-start 
        transform transition-transform duration-300
        ${open ? "translate-x-0" : "translate-x-full"}
        overflow-y-auto`} style={{ backgroundImage: `url(${isDark ? dark_background : background})`, }}
      >
          {/* Avatar */}
          <div className="flex justify-center mt-10">
            <div className="
              w-24 h-24
              rounded-full
              bg-cyan-700 dark:bg-gray-500
              flex items-center justify-center
              text-white text-2xl font-semibold
              shadow-lg
            ">
              {initials || "A"}
            </div>
          </div>


                    {/* Name */}
          <h2 className="mt-4 text-xl font-bold text-center text-gray-800 dark:text-gray-100 ">
            {fullName}
          </h2>


          {/* Email */}
          <p className="text-gray-700 dark:text-gray-950 flex justify-center items-center gap-2 mt-1">
            <FaEnvelope />
            {user.email}
          </p>


          {/* Role Chip */}
          <div className="mt-4 flex justify-center">

            <span className="
              px-4 py-2
              bg-cyan-700 dark:bg-gray-500
              rounded-full
              shadow
              flex items-center gap-2
              text-gray-300 dark:text-gray-200
            ">
              <FaUserShield />
              {user.role || "Admin"}
            </span>
            </div>


        {/* Content */}
        <div className="p-6 text-center ml-10 mr-10 mt-5 rounded-4xl bg-gradient-to-r  from-cyan-100 to-gray-300 dark:from-gray-800 dark:to-gray-600">

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 left-3 text-cyan-700 dark:text-gray-200"
        >
          <FaTimes size={18} />
        </button>       
          


          



          {/* Admin Details Card */}



            <div className="space-y-3 text-sm text-gray-700 dark:text-gray-200 ">


              <p className="flex items-center gap-2">
                <FaUserCircle className="text-cyan-500" />
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

            {/* DELETE BUTTON */}
        <div className="w-full flex justify-end mt-0 pr-10 pt-5 items-end">
          {canDeleteMyProfile && (
          <button className="py-2 ml-11 px-0 w-full  rounded-full bg-red-600  text-white text-xs font-small hover:bg-red-800 transition">
            Delete Account
          </button>
          )}
        </div>

        {/* Edit Profile */}

                    {canEditProfile && (
                    <button
            
            className="mt-4 inline-flex ml-52 items-center gap-2 px-6 py-2 rounded-lg bg-cyan-600 text-white font-medium hover:bg-cyan-800 transition"
          >
            <FaEdit />
            Edit Profile
          </button>
          )}

          
          
        


      </div>

      
    </>
  );
};

export default AdminProfile;
