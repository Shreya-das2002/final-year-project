import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEdit } from "react-icons/fa";

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
    <div className="min-h-screen bg-slate-100 p-8">
      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-lg p-10">

        {/* PROFILE HEADER */}
        <div className="flex flex-col items-center text-center">

          <div className="w-24 h-24 rounded-full overflow-hidden bg-blue-600 flex items-center justify-center text-white text-2xl font-semibold">
            {image ? (
              <img src={image} className="w-full h-full object-cover" />
            ) : (
              initials || "P"
            )}
          </div>

          <h2 className="mt-4 text-xl font-semibold">{fullName || "Patient"}</h2>
          <p className="text-gray-500">{profile.email}</p>

          <div className="mt-4 text-sm space-y-1">
            <p><span className="font-medium">Phone:</span> {profile.phone || "—"}</p>
            <p><span className="font-medium">Gender:</span> {profile.gender || "—"}</p>
            <p><span className="font-medium">Age:</span> {profile.age || "—"}</p>
          </div>

          <button
            onClick={() => navigate("/patient/profile")}
            className="mt-6 flex items-center gap-2 border border-blue-600 text-blue-600 px-6 py-2 rounded-md hover:bg-blue-50 transition"
          >
            <FaEdit className="text-lg" /> Edit Profile
          </button>
        </div>

        <hr className="my-10" />

        {/* MEDICAL CONDITIONS */}
        <div>
          <h3 className="font-semibold text-lg mb-3">Medical Conditions</h3>

          <div className="grid grid-cols-2 gap-6 bg-slate-50 p-5 rounded-lg">
            <div>
              <p className="text-gray-500 text-xs">Condition</p>
              <p className="mt-1 font-medium">
                {profile.medicalCondition.join(", ") || "—"}
              </p>
            </div>

            <div>
              <p className="text-gray-500 text-xs">Blood Group</p>
              <p className="mt-1 font-medium">
                {profile.bloodGroup || "—"}
              </p>
            </div>
          </div>
        </div>

        {/* ALLERGIES */}
        <div className="mt-8">
          <h3 className="font-semibold text-lg mb-3">Allergies</h3>

          <div className="bg-slate-50 p-5 rounded-lg">
            <p className="font-medium">
              {profile.allergies.join(", ") || "—"}
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default PatientProfileView;
