import React, { useEffect } from "react";
import {
  FaPhoneAlt,
  FaUser,
  FaPowerOff,
  // FaBirthdayCake,
  // FaBriefcase,
  FaEdit,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import type { RootState, AppDispatch } from "../../../../store/store";
import { fetchAllAdmins } from "../../../../store/slices/adminSlice";

const AdminProfileView: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { id } = useParams();
  const navigate = useNavigate();

  const { admins, loading } = useSelector(
    (state: RootState) => state.admin
  );
  

  useEffect(() => {
    dispatch(fetchAllAdmins());
  }, [dispatch]);

  const admin = admins.find(
    (a) => a.admin_user_id === Number(id)
  );

  const getInitials = () => {
    if (!admin) return "";
    return `${admin.first_name?.[0] || ""}${admin.last_name?.[0] || ""}`;
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (!admin) return <p className="text-center mt-10">Admin Not Found</p>;

return (
  <div className="min-h-screen bg-gray-100 flex justify-center p-6">
    <div className="w-full max-w-6xl">

      {/* HEADER */}
      <div className="bg-gradient-to-r from-blue-200 via-white to-blue-100 rounded-2xl p-6 shadow-md">

        <div className="flex flex-col md:flex-row md:items-center md:justify-between">

          {/* LEFT */}
          <div className="flex items-center gap-4">
            <div className="relative">

              {/* Avatar */}
              <div className="w-20 h-20 rounded-full bg-blue-600 text-white flex items-center justify-center text-2xl font-bold shadow-md">
                {getInitials()}
              </div>

              {/* Edit Icon */}
              <button
                onClick={() =>
                  navigate(`/admin/admin_edit_profile/${admin.admin_user_id}`, {
                    state: admin,
                  })
                }
                className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition"
              >
                <FaEdit className="text-blue-600 text-sm" />
              </button>

            </div>

            <div>
              <h2 className="text-2xl font-semibold">
                {admin.first_name} {admin.last_name}
              </h2>
              <p className="text-gray-600">{admin.email}</p>

              {/* STATUS BADGES */}
              <div className="flex gap-2 mt-2">
                <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm">
                  {admin.role}
                </span>
                <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm">
                  Active
                </span>
              </div>
            </div>
          </div>

          {/* RIGHT BUTTONS */}
          <div className="flex gap-3 mt-4 md:mt-0">
            {admin?.role !== "super admin" && (
              <button className="bg-red-500 text-white px-5 py-2 rounded-lg">
                <FaPowerOff /> Deactivate
              </button>
            )}
          </div>
        </div>

        {/* CONTACT STRIP */}
        <div className="flex flex-wrap gap-6 mt-6 text-gray-700">
          <div className="flex items-center gap-2">
            <FaPhoneAlt /> +91 98765 43210
          </div>

          <div className="flex items-center gap-2">
            <FaUser /> Admin ID: {admin.admin_user_id}
          </div>
        </div>
      </div>

      {/* GRID SECTIONS */}
      <div className="grid md:grid-cols-2 gap-6 mt-6">

        {/* PROFESSIONAL */}
        <div className="bg-white rounded-xl p-6 shadow">
          <h3 className="text-blue-600 font-semibold mb-4">
            Professional Details
          </h3>

          <p><strong>Role:</strong> {admin.role}</p>
          <p><strong>Admin ID:</strong> {admin.admin_user_id}</p>
          <p><strong>Department:</strong> Admin</p>
        </div>

        {/* CONTACT INFO */}
        <div className="bg-white rounded-xl p-6 shadow">
          <h3 className="text-blue-600 font-semibold mb-4">
            Contact Information
          </h3>

          <p>{admin.email}</p>
          <p>+91 98765 43210</p>
          <p>Kolkata, India</p>
        </div>

        {/* ABOUT */}
        <div className="bg-white rounded-xl p-6 shadow">
          <h3 className="text-blue-600 font-semibold mb-4">
            About Admin
          </h3>

          <p>System administrator of platform</p>
          <ul className="list-disc ml-5 mt-2 text-gray-600">
            <li>Manages platform settings</li>
            <li>Monitors user activity</li>
          </ul>
        </div>

        {/* ACCOUNT ACTIONS */}
        <div className="bg-white rounded-xl p-6 shadow">
          <h3 className="text-blue-600 font-semibold mb-4">
            Account Actions
          </h3>

          <div className="flex flex-col gap-3">
            <button className="border px-4 py-2 rounded-lg">
              Reset Password
            </button>

            {admin?.role !== "super admin" && (
              <>
                <button className="bg-yellow-400 px-4 py-2 rounded-lg">
                  Deactivate Account
                </button>

                <button className="bg-red-600 text-white px-4 py-2 rounded-lg">
                  Delete Account
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* EXISTING DELETE BUTTON */}
      <div className="w-full flex justify-end mt-6">
        {admin?.role !== "super admin" && (
          <button className="px-6 py-2 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 transition">
            Delete Account
          </button>
        )}
      </div>

    </div>
  </div>
);
};

export default AdminProfileView;