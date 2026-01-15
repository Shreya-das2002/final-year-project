import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEdit,FaUserCircle } from "react-icons/fa";
import { MdEmail, MdPhone, MdCake } from "react-icons/md";
import { GiMedicalPack } from "react-icons/gi";
import { RiVirusLine } from "react-icons/ri";

/* ================= TYPES ================= */

interface ProfileData {
  firstName: string;
  middleName: string;
  lastName: string;
  email: string;
  phone: string;
  gender: string;
  age: string;
  password: string;
  dob: string;
  bloodGroup: string;
  allergies: string[];
  medicalCondition: string[];
  height: string;
  weight: string;
  currentAddress: string;
  permanentAddress: string;
  occupation: string;
  maritalStatus: string;
  alcohol: string;
  smoking: string;
}


/* ================= HELPERS ================= */

const genderMap: Record<number, string> = {
  1: "Male",
  2: "Female",
  3: "Others",
};

const getInitialProfile = (): ProfileData => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  return {
    firstName: user.first_name || "",
    middleName: user.middle_name || "",
    lastName: user.last_name || "",
    email: user.email || "",
    phone: user.phone_no || "",
    gender: genderMap[user.gender] || "",
    password: "********",
    dob: "",
    age: "",
    occupation: "",
    maritalStatus: "",
    bloodGroup: "",
    allergies: [],
    medicalCondition: [],
    smoking: "",
    alcohol: "",
    height: "",
    weight: "",
    currentAddress: "",
    permanentAddress: "",
  };
};

/* ================= COMPONENT ================= */

const PatientProfileView: React.FC = () => {
  const [profile, setProfile] = useState<ProfileData>(getInitialProfile());
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
  const image = localStorage.getItem("profileImage");

  const initials =
    (storedUser.first_name?.charAt(0) || "").toUpperCase() +
    (storedUser.last_name?.charAt(0) || "").toUpperCase();

  const fullName = `${storedUser.first_name || ""} ${storedUser.middle_name || ""} ${storedUser.last_name || ""}`.trim();

  useEffect(() => {
      
      if (!token) return;
  
      fetch("http://localhost:3000/api/patient/profile", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(res => res.json())
        .then(res => {
          const data = res.data;
          setProfile(prev => ({
            ...prev,
            firstName: data.patient?.first_name || prev.firstName,
            middleName: data.patient?.middle_name || prev.middleName,
            lastName: data.patient?.last_name || prev.lastName,
            email: data.patient?.email || prev.email,
            phone: data.patient?.phone_no || prev.phone,
            gender: genderMap[Number(data.patient?.gender)] || "",
            dob: data.patient_detail?.dob || "",
            age: data.patient_details?.age || "",
            occupation: data.patient_details?.occupation || "",
            maritalStatus: data.patient_details?.maritalStatus || "",
            bloodGroup: data.patient_detail?.blood_group || "",
            allergies: Array.isArray(data.patient_detail?.allergies)
              ? data.patient_detail.allergies
              : [],
            medicalCondition: Array.isArray(data.patient_detail?.medical_condition)
            ? data.patient_detail.medical_condition
            : [],
            height: data.patient_detail?.height || "",
            smoking: data.patient_detail.smoking || "",
            alcohol: data.patient_detail.alcohol || "",
            weight: data.patient_detail?.weight || "",
            currentAddress: data.patient_detail?.current_address || "",
            permanentAddress: data.patient_detail?.permanent_address || "",
          }));
        });
    }, [token]);

  return (
  <div className="min-h-screen flex items-center justify-center p-6">
    <div className="w-full max-w-3xl bg-gradient-to-br from-sky-100 to-blue-200 rounded-2xl shadow-xl p-10 text-center">

      {/* PROFILE HEADER */}
      <div className="flex flex-col items-center">

        {/* Avatar */}
        <div className="w-24 h-24 rounded-full overflow-hidden bg-blue-600 flex items-center justify-center text-white text-2xl font-semibold shadow-md">
          {image ? (
            <img src={image} className="w-full h-full object-cover" />
          ) : (
            initials || "P"
          )}
        </div>

        <h2 className="mt-4 text-2xl font-semibold text-gray-800">
          {fullName || "Patient"}
        </h2>

        <p className="text-gray-500 flex items-center gap-2">
          <MdEmail className=""/>{profile.email}
          </p>

        {/* Info Pills */}
        <div className="mt-4 flex flex-wrap justify-center gap-3  text-sm">
          <span className="px-4 py-2 bg-blue-50 rounded-full flex items-center gap-2 shadow text-gray-700">
            <MdPhone/>{profile.phone || "—"}
          </span>
          <span className="px-4 py-2 bg-blue-50 rounded-full shadow flex items-center gap-2 text-gray-700">
            <FaUserCircle/>{profile.gender || "—"}
          </span>
          <span className="px-4 py-2 bg-blue-50 rounded-full shadow  flex items-center gap-2 text-gray-700">
          <MdCake/>Age: {profile.age || "—"}
          </span>
        </div>

        {/* Edit Button */}
        <button
          onClick={() => navigate("/patient/profile")}
          className="mt-6 inline-flex items-center gap-2 px-6 py-2 rounded-lg bg-blue-600 text-white font-medium shadow hover:bg-blue-700 transition"
        >
          <FaEdit />
          Edit Profile
        </button>
      </div>

      {/* MEDICAL + ALLERGIES CARD */}
      <div className="mt-10 bg-gradient-to-br from-sky-50 to-blue-100 rounded-xl  shadow-md p-6 grid grid-cols-1 md:grid-cols-2 gap-6 text-left">

        {/* Medical Conditions */}
        <div>
          <h3 className="text-blue-600 font-semibold mb-2 flex items-center gap-2">
          <GiMedicalPack/>Medical Conditions
          </h3>
          <p className="text-gray-700 text-sm">
            {profile.medicalCondition.join(", ") || "—"}
          </p>
          <p className="mt-2 text-gray-700 text-sm">
            <span className="font-medium">Blood Group:</span>{" "}
            {profile.bloodGroup || "—"}
          </p>
        </div>

        {/* Allergies */}
        <div>
          <h3 className="text-pink-600 font-semibold mb-2 flex items-center gap-2">
            <RiVirusLine/>Allergies
          </h3>
          <p className="text-gray-700 text-sm">
            {profile.allergies.join(", ") || "—"}
          </p>
        </div>
      </div>
    </div>
  </div>
);
}

export default PatientProfileView;
