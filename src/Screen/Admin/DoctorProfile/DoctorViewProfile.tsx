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

            <p><strong>Doctor ID:</strong> {doctor.doctor_no}</p>
            <p><strong>Licence:</strong> {doctor.licence_number || "—"}</p>
            <p><strong>Specialization:</strong> {doctor.specialization || "—"}</p>
            <p><strong>Bio :</strong>{doctor.bio || "-"}</p>
            
          </div>

          {/* BIO */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-blue-600 font-semibold flex items-center gap-2 mb-3">
             <MdWork /> Experience
            </h3>

            

            <p><strong>Previous Experience :</strong>{doctor.organization_name || "-"}</p>

            <p><strong>Previous Role :</strong>{doctor.designation || "-"}</p>

            <p><strong>Start Date :</strong>{doctor.start_date || "-"}</p>

            <p><strong>End Date :</strong>{doctor.end_date || "-"}</p>

            

          
          </div>

          {/* CURRENT ADDRESS */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-blue-600 font-semibold flex items-center gap-2 mb-3">
              <FaMapMarkerAlt /> Current Address
            </h3>

            <p><strong>Address Line 1:</strong>
              {doctor.addressLine1 || "—"}</p>

            <p><strong>Address Line 2:</strong>
              {doctor.addressLine2 || "—"}</p>
            

            <p><strong>City :</strong>
               {doctor.city || "—"}</p>

            <p><strong>District :</strong>
               {doctor.district || "—"}</p>
            

            <p><strong>State :</strong>
               {doctor.state ||"—"}</p>

            <p><strong>Country :</strong>
               {doctor.country ||"—"}</p>
            

            <p><strong>PIN :</strong>
            {doctor.pin ||"-"}</p>

          </div>

          {/* PERMANENT ADDRESS */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-blue-600 font-semibold flex items-center gap-2 mb-3">
              <FaHome /> Permanent Address
            </h3>

            <p><strong>Address Line 1:</strong>
              {doctor.addressLine1 || "—"}</p>

            <p><strong>Address Line 2:</strong>
              {doctor.addressLine2 || "—"}</p>
            

            <p><strong>City :</strong>
               {doctor.city || "—"}</p>

            <p><strong>District :</strong>
               {doctor.district || "—"}</p>
            

            <p><strong>State :</strong>
               {doctor.state ||"—"}</p>

            <p><strong>Country :</strong>
               {doctor.country ||"—"}</p>
            

            <p><strong>PIN :</strong>
            {doctor.pin ||"-"}</p>
          </div>
     
<div style={{ display: "flex", justifyContent: "flex-end" }}>
  <button
    style={{
      backgroundColor: "blue",
      color: "white",
      padding: "8px 16px",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",
    }}

    className="mt-6 inline-flex items-center gap-2 px-6 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition"
  >
    Delete Account
  </button>
</div>


    </div>
    </div>
    </div>
  );
};

export default DoctorViewProfile;