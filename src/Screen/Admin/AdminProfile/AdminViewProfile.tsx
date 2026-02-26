import React, { useEffect } from "react";
import {
  FaPhoneAlt,
  FaUser,
  FaBirthdayCake,
  FaBriefcase,
  FaEdit,
} from "react-icons/fa";

import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import type { RootState, AppDispatch } from "../../../../store/store";
import { fetchAllAdmins } from "../../../../store/slices/adminSlice";

const AdminProfileView: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { id } = useParams();

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
      <div className="w-full max-w-5xl ">

        <div className="bg-blue-200 rounded-xl p-10 text-center shadow">

          <div className="w-24 h-24 mx-auto rounded-full bg-blue-600 text-white flex items-center justify-center text-3xl font-bold">
            {getInitials()}
          </div>

          <h2 className="mt-4 text-2xl font-semibold">
            {admin.first_name} {admin.last_name}
          </h2>

          <p className="text-gray-600">{admin.email}</p>

          <div className="flex flex-wrap justify-center gap-4 mt-6">

            <div className="pill">
              <FaPhoneAlt />  
            </div>

            <div className="pill">
              <FaUser /> {admin.role}
            </div>

            <div className="pill">
              <FaBirthdayCake /> 
            </div>

            <div className="pill">
              <FaBriefcase /> Admin
            </div>

          </div>

          <button
          
          className="mt-6 bg-blue-600 text-white px-6 py-2 rounded-lg flex items-center gap-2 mx-auto">
            <FaEdit /> Edit Profile
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mt-6">

          <div className="bg-white rounded-xl p-6 shadow">
            <h3 className="text-blue-600 font-semibold mb-3">
              Professional Details
            </h3>

            <p><strong>Role:</strong> {admin.role}</p>
            <p><strong>Admin ID:</strong> {admin.admin_user_id}</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow">
            <h3 className="text-purple-600 font-semibold mb-3">
              About Admin
            </h3>

            <p>System administrator of platform</p>
          </div>

        </div>
        {/* DELETE BUTTON */}
        <div className="w-full flex justify-end mt-6 items-end">
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