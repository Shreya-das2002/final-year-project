import React from "react";
import { useSelector } from "react-redux";
import {useState, useEffect} from "react";
import type { RootState } from "../../../../store/store";
import { DOCTOR_SPECIALIZATIONS} from "../../../Environment";
import background from "../../../assets/apply_light.jpeg"
import dark_background from "../../../assets/doctor_light.webp"

import {
  
  FaUserShield,
  FaEnvelope,
  FaUserCircle,
  FaPhone, 
  FaVenusMars,
  FaHospital
} from "react-icons/fa";
import { FiChevronRight } from "react-icons/fi";
import { PencilSquareIcon } from "@heroicons/react/24/solid";


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
    <div>
  {/* Overlay */}
  <div
    className={`fixed inset-0 bg-black/30 z-40 transition-opacity ${
      open ? "opacity-100 visible" : "opacity-0 invisible"
    }`}
    onClick={onClose}
  />

  {/* ✅ FLOATING ARROW OUTSIDE */}
 <div
  className={`fixed top-1/2 right-[400px] -translate-y-1/2 translate-x-1/2 z-[9999]
              transition-transform duration-100
              ${open ? "translate-x-1/2 opacity-100 visible " : "translate-x-full opacity-0 invisible"}`}
>
    <button
      onClick={onClose}
      className="w-7 h-7 flex items-center justify-center
                 rounded-full bg-gray-200 shadow-lg 
                 text-cyan-700 hover:text-red-500 transition"
    >
      <FiChevronRight size={20} style={{ strokeWidth: 3 }} />
    </button>
  </div>



      {/* Drawer */}
      <div
        className={`fixed top-16 bottom-0 right-0 w-[400px]
        shadow-2xl z-50 min-h-[calc(100vh-110px)] bg-cover flex flex-col justify-start 
        transform transition-transform duration-300
        ${open ? "translate-x-0" : "translate-x-full"}
        overflow-y-auto overflow-x-visible`} style={{ backgroundImage: `url(${isDark ? dark_background : background})`, }}
      >


        <div className=" bg-white/20 pb-5 rounded-4xl relative ml-7 mr-7 mt-20  border border-white/20">
          {/* Avatar */}
          <div className="absolute left-1/2 -top-12 transform -translate-x-1/2">
            <div className="
              w-24 h-24 border-2 border-cyan-100 dark:border-cyan-800
              rounded-full mb-0 
              bg-cyan-600 dark:bg-gray-500
              flex items-center justify-center
              text-white text-2xl font-semibold
              shadow-lg
            ">
              {initials || "A"}
            </div>
            
          </div>

                  {/* Edit Profile */}

{canEditProfile && (
  <button
  
    className="relative mt-5 ml-46 p-1  backdrop-blur-md bg-white/70 text-gray-500 dark:text-gray-700 
               hover:text-cyan-700 transition rounded-full "
  >
    <PencilSquareIcon className="w-5 h-5 flex items-center pl-1" />
  </button>
)}


              

                    {/* Name */}
          <h2 className={`${user.role !== "super admin" ? "pt-10" : " "} mt-4 mb-2 text-xl font-bold text-center bg- text-gray-800 dark:text-gray-700`}>
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
              bg-cyan-600 dark:bg-gray-500
              rounded-full
              shadow
              flex items-center gap-2
              text-gray-200 dark:text-gray-200
            ">
              <FaUserShield />
              {user.role || "Admin"}
            </span>
            </div>



        {/* Content */}
        <div className="ml-5 mr-5 mt-6 rounded-4xl">

  <div className="p-6 text-center rounded-4xl 
    bg-white/40 dark:bg-gray-500/40 ">

      

          {/* Admin Details Card */}



            <div className={`${user.role !== "super admin" ? " " : "pt-5"} space-y-3 text-sm text-gray-700 dark:text-gray-200`}>


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
                {user.gender || "—"}
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
              {user?.role !== "super admin" && (

              <div className="absolute border w-65 border-gray-400/30 mt-2 ml-1 items-center ">
                </div>)}

              

               {/* DELETE BUTTON */}
        <div className="w-full flex justify-end mt-0 pt-5 items-end ">
          {canDeleteMyProfile && (
          <button className="text-xs p-2 w-100 mr-0 border border-red-50 text-red-500 dark:text-red-600 dark:bg-red-100 bg-red-100 rounded-full font-semibold hover:bg-red-200 dark:hover:bg-red-300 transition">
            Delete Account
          </button>
          )}
          
        </div>
        

        </div>
        </div>

            </div>



        
        
        
        </div>

          </div> 

      
    </div>
  );
};

export default AdminProfile;