import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaUserCircle } from "react-icons/fa";
import { MdEmail, MdPhone, MdCake } from "react-icons/md";
import { GiMedicalPack } from "react-icons/gi";
import { RiVirusLine } from "react-icons/ri";
import dayjs from "dayjs";

import { getPatientProfileApi } from "../../../services/patientApi";

/* ================= TYPES ================= */

interface ProfileData {
  firstName: string;
  middleName: string;
  lastName: string;
  email: string;
  phone: string;
  gender: string;
  dob: string;
  age: string;
  bloodGroup: string;
  allergies: string[];
  height: string;
  weight: string;
  currentAddress: string;
  permanentAddress: string;
}

/* ================= INITIAL STATE ================= */

const getInitialProfile = (): ProfileData => ({
  firstName: "",
  middleName: "",
  lastName: "",
  email: "",
  phone: "",
  gender: "",
  dob: "",
  age: "",
  bloodGroup: "",
  allergies: [],
  height: "",
  weight: "",
  currentAddress: "",
  permanentAddress: "",
});

/* ================= COMPONENT ================= */

const PatientProfileView: React.FC = () => {
  const [profile, setProfile] = useState<ProfileData>(getInitialProfile());
  const navigate = useNavigate();

  const image = localStorage.getItem("profileImage");

  const initials =
    (profile.firstName?.charAt(0) || "").toUpperCase() +
    (profile.lastName?.charAt(0) || "").toUpperCase();

  const fullName = `${profile.firstName} ${profile.middleName} ${profile.lastName}`.trim();

  /* ================= FETCH PROFILE ================= */

  useEffect(() => {
    getPatientProfileApi()
      .then(res => {
        // because backend uses res.sendResponse
        const data = res.data.data;

        const dob = data.patient_detail?.dob || "";
        const age = dob
          ? String(dayjs().diff(dayjs(dob), "year"))
          : "";

        setProfile({
          firstName: data.first_name || "",
          middleName: data.middle_name || "",
          lastName: data.last_name || "",
          email: data.email || "",
          phone: data.phone_no || "",
          gender: data.patient_detail?.gender || "",
          dob,
          age,
          bloodGroup: data.patient_detail?.blood_group || "",
          allergies: Array.isArray(data.patient_detail?.allergies)
            ? data.patient_detail.allergies
            : [],
          height: data.patient_detail?.height || "",
          weight: data.patient_detail?.weight || "",
          currentAddress: data.patient_detail?.current_address || "",
          permanentAddress: data.patient_detail?.permanent_address || "",
        });
      })
      .catch(() => {
        console.error("Failed to load profile");
      });
  }, []);

  /* ================= UI ================= */

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-3xl bg-gradient-to-br from-sky-100 to-blue-200 rounded-2xl shadow-xl p-10 text-center">

        {/* PROFILE HEADER */}
        <div className="flex flex-col items-center">

          {/* Avatar */}
          <div className="w-24 h-24 rounded-full overflow-hidden bg-blue-600 flex items-center justify-center text-white text-2xl font-semibold shadow-md">
            {image ? (
              <img
                src={image}
                alt="profile"
                className="w-full h-full object-cover"
              />
            ) : (
              initials || "P"
            )}
          </div>

          <h2 className="mt-4 text-2xl font-semibold text-gray-800">
            {fullName || "Patient"}
          </h2>

          <p className="text-gray-500 flex items-center gap-2">
            <MdEmail />
            {profile.email || "—"}
          </p>

          {/* Info Pills */}
          <div className="mt-4 flex flex-wrap justify-center gap-3 text-sm">
            <span className="px-4 py-2 bg-blue-50 rounded-full flex items-center gap-2 shadow text-gray-700">
              <MdPhone /> {profile.phone || "—"}
            </span>
            <span className="px-4 py-2 bg-blue-50 rounded-full shadow flex items-center gap-2 text-gray-700">
              <FaUserCircle /> {profile.gender || "—"}
            </span>
            <span className="px-4 py-2 bg-blue-50 rounded-full shadow flex items-center gap-2 text-gray-700">
              <MdCake /> Age: {profile.age || "—"}
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

        {/* MEDICAL + ALLERGIES */}
        <div className="mt-10 bg-gradient-to-br from-sky-50 to-blue-100 rounded-xl shadow-md p-6 grid grid-cols-1 md:grid-cols-2 gap-6 text-left">

          {/* Medical */}
          <div>
            <h3 className="text-blue-600 font-semibold mb-2 flex items-center gap-2">
              <GiMedicalPack />
              Medical Details
            </h3>
            <p className="text-gray-700 text-sm">
              <span className="font-medium">Blood Group:</span>{" "}
              {profile.bloodGroup || "—"}
            </p>
          </div>

          {/* Allergies */}
          <div>
            <h3 className="text-pink-600 font-semibold mb-2 flex items-center gap-2">
              <RiVirusLine />
              Allergies
            </h3>
            <p className="text-gray-700 text-sm">
              {profile.allergies.join(", ") || "—"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientProfileView;
