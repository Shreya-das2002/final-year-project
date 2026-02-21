import React from "react";
import { useNavigate, useLocation } from "react-router-dom";


import {
  FaEdit,
  FaUserCircle,
  FaMapMarkerAlt,
  FaHome,
} from "react-icons/fa";

import {
  MdEmail,
  MdPhone,
  MdCake,
  MdWork,
} from "react-icons/md";

import { GiMedicalPack } from "react-icons/gi";


const DoctorViewProfile: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const doctor = location.state;

  if (!doctor) {
    return <div className="p-10">No doctor data found</div>;
  }

  const dob = doctor.dob || null;

  const initials =
    doctor.first_name?.charAt(0)?.toUpperCase() +
    doctor.last_name?.charAt(0)?.toUpperCase();

  const fullName = `${doctor.first_name} ${doctor.middle_name || ""} ${doctor.last_name}`.trim();

  const image = localStorage.getItem("profileImage");

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto bg-gradient-to-br from-sky-100 to-blue-200 shadow-xl rounded-lg p-8">

        {/* HEADER */}
        <div className="flex flex-col items-center text-center">
          <div className="w-28 h-28 rounded-full overflow-hidden bg-blue-600 flex items-center justify-center text-white text-3xl font-semibold shadow-md">
            {image ? (
              <img src={image} alt="profile" className="w-full h-full object-cover" />
            ) : (
              initials || "D"
            )}
          </div>

          <h2 className="mt-4 text-2xl font-semibold text-gray-800">
            Dr. {fullName}
          </h2>

          <p className="text-gray-500 flex items-center gap-2 mt-1">
            <MdEmail /> {doctor.email}
          </p>

          <div className="mt-4 flex flex-wrap justify-center gap-3 text-sm">
            <span className="px-4 py-2 bg-white rounded-full flex items-center gap-2 shadow text-gray-700">
              <MdPhone /> {doctor.phone_no || "—"}
            </span>

            <span className="px-4 py-2 bg-white rounded-full shadow flex items-center gap-2 text-gray-700">
              <FaUserCircle /> {(doctor.gender) || "—"}
            </span>

            <span className="px-4 py-2 bg-white rounded-full shadow flex items-center gap-2 text-gray-700">
              <MdCake /> DOB: {dob ?? "—"}
            </span>

            <span className="px-4 py-2 bg-white rounded-full shadow flex items-center gap-2 text-gray-700">
              <MdWork /> {doctor.experience || "—"} yrs Exp
            </span>
          </div>

          <button
            onClick={() =>
              navigate(`/admin/doctor_edit_profile/${doctor.doctor_id}`, { state: doctor })
            }
            className="mt-6 inline-flex items-center gap-2 px-6 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition"
          >
            <FaEdit />
            Edit Profile
          </button>
        </div>

        {/* DETAILS */}
        <div className="mt-10 grid md:grid-cols-2 gap-6">

          {/* PROFESSIONAL */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-blue-600 font-semibold flex items-center gap-2 mb-3">
              <GiMedicalPack /> Professional Details
            </h3>

            <p><strong>Specialization:</strong> {doctor.specialization || "—"}</p>
            <p><strong>Experience:</strong> {doctor.experience || "—"} years</p>
          </div>

          {/* BIO */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-purple-600 font-semibold mb-3">
              About Doctor
            </h3>

            <p className="text-gray-700 text-sm">
              {doctor.bio || "—"}
            </p>
          </div>

          {/* CURRENT ADDRESS */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-blue-600 font-semibold flex items-center gap-2 mb-3">
              <FaMapMarkerAlt /> Current Address
            </h3>

            <p>
              {doctor.current_address?.addressLine1},{" "}
              {doctor.current_address?.addressLine2}
            </p>

            <p>
              City: {doctor.current_address?.city},{" "}
              District: {doctor.current_address?.district}
            </p>

            <p>
              State: {doctor.current_address?.state},{" "}
              Country: {doctor.current_address?.country}
            </p>

            <p>PIN: {doctor.current_address?.pincode}</p>
          </div>

          {/* PERMANENT ADDRESS */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-blue-600 font-semibold flex items-center gap-2 mb-3">
              <FaHome /> Permanent Address
            </h3>

            <p>
              {doctor.permanent_address?.addressLine1},{" "}
              {doctor.permanent_address?.addressLine2}
            </p>

            <p>
              City: {doctor.permanent_address?.city},{" "}
              District: {doctor.permanent_address?.district}
            </p>

            <p>
              State: {doctor.permanent_address?.state},{" "}
              Country: {doctor.permanent_address?.country}
            </p>

            <p>PIN: {doctor.permanent_address?.pincode}</p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default DoctorViewProfile;