import React from "react";
import { FaTimes, FaUserShield, FaEnvelope } from "react-icons/fa";

interface AdminUser {
  first_name: string;
  last_name: string;
  email: string;
  role?: string;
}

interface AdminProfileDrawerProps {
  open: boolean;
  onClose: () => void;
  user: AdminUser | null;
}

const AdminProfile = ({
  open,
  onClose,
  user,
}: AdminProfileDrawerProps) => {

  if (!user) return null;

  const initials =
    user.first_name?.charAt(0).toUpperCase() +
    user.last_name?.charAt(0).toUpperCase();

  const fullName = `${user.first_name} ${user.last_name}`;

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
        z-50 transform transition-transform duration-300
        ${open ? "translate-x-0" : "translate-x-full"}
        overflow-y-auto`}
      >

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 text-gray-500 hover:text-red-500"
        >
          <FaTimes size={18} />
        </button>


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


          {/* Role chip */}
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


          {/* Admin Info Card */}
          <div className="
            mt-6
            bg-white/60
            backdrop-blur-md
            rounded-xl
            shadow-md
            p-4
            text-left
          ">

            <h3 className="text-blue-600 font-semibold mb-3">
              Admin Details
            </h3>

            <div className="space-y-2 text-sm text-gray-700">

              <p>
                <span className="font-medium">Name:</span> {fullName}
              </p>

              <p>
                <span className="font-medium">Email:</span> {user.email}
              </p>

            </div>

          </div>

        </div>

      </div>
    </>
  );
};

export default AdminProfile;
