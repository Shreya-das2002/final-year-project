import React, { useEffect } from "react";
import {
  FaPhoneAlt,
  // FaUser,
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

        <div className="flex flex-col md:flex-row md:items-start md:justify-between">

          {/* LEFT */}
          <div className="flex items-center gap-4">

            {/* AVATAR WITH EDIT ICON */}
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-blue-600 text-white flex items-center justify-center text-2xl font-bold shadow-md">
                {getInitials()}
              </div>

              <button
                onClick={() =>
                  navigate(`/admin/admin_edit_profile/${admin.admin_user_id}`, {
                    state: admin,
                  })
                }
                className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-md hover:bg-gray-100 
                transition-transform duration-300 ease-in-out hover:scale-105 active:scale-95 cursor-pointer transform"
              >
                <FaEdit className="text-blue-600 text-sm" />
              </button>
            </div>

            {/* NAME + INFO */}
            <div>
              <h2 className="text-2xl font-semibold">
                {admin.first_name} {admin.last_name}
              </h2>

              <p className="text-gray-600">{admin.email}</p>

              {/* BADGES */}
              <div className="flex gap-2 mt-2">
                <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm">
                  {admin.role}
                </span>
                <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm">
                  {admin.status}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* CONTACT STRIP */}
        <div className="flex flex-wrap gap-6 mt-6 text-gray-700">
          <div className="flex items-center gap-2">
            <FaPhoneAlt /> {admin.phone_no}
          </div>
        </div>
      </div>

      {/* GRID */}
      <div className="grid md:grid-cols-2 gap-6 mt-6">

        {/* PROFESSIONAL */}
        <div className="bg-white rounded-xl p-6 shadow">
          <h3 className="text-blue-600 font-semibold mb-2">
            Professional Details
          </h3>

          <p><strong>Role:</strong> {admin.role}</p>
          <p><strong>Department:</strong> {admin.department_id?.join(", ")}</p>
          <p><strong>Joined:</strong> {admin.created_on}</p>
        </div>

        {/* CONTACT */}
        <div className="bg-white rounded-xl p-6 shadow">
          <h3 className="text-blue-600 font-semibold mb-2">
            Contact Information
          </h3>

          <p><strong>Email:</strong> {admin.email}</p>
          <p><strong>Phone:</strong> {admin.phone_no}</p>
        </div>

        {/* ABOUT */}
        <div className="bg-white rounded-xl p-6 shadow">
          <h3 className="text-blue-600 font-semibold mb-2">
            Current Address
          </h3>

          <p className="mt-1">
            {admin.current_address?.address_line_1},{" "}
            {admin.current_address?.address_line_2},{" "}
            {admin.current_address?.city},{" "}
            {admin.current_address?.district},{" "}
            {admin.current_address?.state},{" "}
            {admin.current_address?.country},{" "}
            {admin.current_address?.pin}
          </p>

        </div>

        {/* ADDRESS */}
        <div className="bg-white rounded-xl p-6 shadow">
          <h3 className="text-blue-600 font-semibold mb-2">
            Permanent Address 
          </h3>

          <p className="mt-1">
            {admin.permanent_address?.address_line_1},{" "}
            {admin.permanent_address?.address_line_2},{" "}
            {admin.permanent_address?.city},{" "}
            {admin.permanent_address?.district},{" "}
            {admin.permanent_address?.state},{" "}
            {admin.permanent_address?.country},{" "}
            {admin.permanent_address?.pin}
          </p>
        </div>
      </div>

    </div>
  </div>
);
};

export default AdminProfileView;