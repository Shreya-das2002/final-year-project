import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import dayjs from "dayjs";

import ProfileAvatar from "./ProfileAvatar";

import {
  getPatientProfileApi,
  savePatientProfileApi,
} from "../../../services/patientApi";

import type { PatientProfilePayload } from "../../../services/patientApi";
import {
  isValidDOB,
  datePickerStyles,
  calculateAge,
} from "../../../Environment";

import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

/* ================= HELPERS ================= */

const genderMap: Record<number, string> = {
  1: "Male",
  2: "Female",
  3: "Others",
};

const medicalConditionOptions = [
  "Diabetes",
  "Blood Pressure",
  "Heart Disease",
  "Thyroid",
  "Asthma",
  "Arthritis",
  "None",
];

const steps = [
  "Basic Information",
  "Personal Details",
  "Medical Details",
  "Reports",
];

/* ================= INITIAL STATE ================= */

const getInitialProfile = (): PatientProfilePayload => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  return {
    firstName: user.first_name || "",
    middleName: user.middle_name || "",
    lastName: user.last_name || "",
    email: user.email || "",
    phone: user.phone_no || "",
    gender: genderMap[user.gender] || "",
    age: "",
    password: "********",
    dob: "",
    bloodGroup: "",
    allergies: [],
    medicalCondition: [],
    height: "",
    weight: "",
    currentAddress: "",
    permanentAddress: "",
    occupation: "",
    maritalStatus: "",
    alcohol: "",
    smoking: "",
  };
};

/* ================= COMPONENT ================= */

const Profile: React.FC = () => {
  const [profile, setProfile] = useState<PatientProfilePayload>(getInitialProfile);
  const [step, setStep] = useState<number>(1);

  const [showAllergyDropdown, setShowAllergyDropdown] = useState(false);
  const [showMedicalDropdown, setShowMedicalDropdown] = useState(false);

  const allergyRef = useRef<HTMLDivElement | null>(null);
  const medicalRef = useRef<HTMLDivElement | null>(null);

  /* ---------- CLICK OUTSIDE ---------- */
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (allergyRef.current && !allergyRef.current.contains(e.target as Node)) {
        setShowAllergyDropdown(false);
      }
      if (medicalRef.current && !medicalRef.current.contains(e.target as Node)) {
        setShowMedicalDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* ---------- FETCH PROFILE ---------- */
  useEffect(() => {
    getPatientProfileApi()
      .then(res => {
        const data = res.data;

        setProfile(prev => ({
          ...prev,
          firstName: data.patient?.first_name || "",
          middleName: data.patient?.middle_name || "",
          lastName: data.patient?.last_name || "",
          email: data.patient?.email || "",
          phone: data.patient?.phone_no || "",
          gender: genderMap[Number(data.patient?.gender)] || "",
          dob: data.patient_detail?.dob || "",
          age: data.patient_details?.age || "",
          occupation: data.patient_details?.occupation || "",
          maritalStatus: data.patient_details?.maritalStatus || "",
          bloodGroup: data.patient_detail?.blood_group || "",
          allergies: data.patient_detail?.allergies || [],
          medicalCondition: data.patient_detail?.medical_condition || [],
          height: data.patient_detail?.height || "",
          weight: data.patient_detail?.weight || "",
          smoking: data.patient_detail?.smoking || "",
          alcohol: data.patient_detail?.alcohol || "",
          currentAddress: data.patient_detail?.current_address || "",
          permanentAddress: data.patient_detail?.permanent_address || "",
        }));
      })
      .catch(() => toast.error("Failed to load profile"));
  }, []);

  /* ---------- SAVE PROFILE ---------- */
  const handleSave = async () => {
    if (!isValidDOB(profile.dob)) {
      toast.error("Invalid Date of Birth");
      return;
    }

    try {
      await savePatientProfileApi(profile);
      toast.success("Profile saved successfully");
    } catch {
      toast.error("Failed to save profile");
    }
  };

  /* ================= UI ================= */

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-5xl mx-auto bg-gradient-to-br from-sky-100 to-blue-200 shadow-xl rounded-lg p-8">

        <ProfileAvatar
          firstName={profile.firstName}
          lastName={profile.lastName}
        />

        {/* ---------- STEPPER ---------- */}
        <div className="flex items-center mb-12">
          {steps.map((label, i) => {
            const current = i + 1;
            const active = step >= current;

            return (
              <React.Fragment key={label}>
                <div className="flex flex-col items-center min-w-[120px]">
                  <button
                    onClick={() => setStep(current)}
                    className={`w-9 h-9 rounded-full font-semibold transition
                      ${
                        active
                          ? "bg-blue-600 text-white"
                          : "bg-gray-200 text-gray-500"
                      }`}
                  >
                    {current}
                  </button>
                  <p
                    className={`mt-2 text-sm
                      ${
                        active ? "text-blue-600 font-medium" : "text-gray-400"
                      }`}
                  >
                    {label}
                  </p>
                </div>

                {i < steps.length - 1 && (
                  <div
                    className={`flex-1 h-1 mx-4 rounded transition
                      ${step > current ? "bg-blue-600" : "bg-gray-200"}`}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>

        <h2 className="text-xl font-semibold mb-6">
          {steps[step - 1]}
        </h2>

        {/* ---------- STEP 2 ---------- */}
        {step === 2 && (
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1">
                Date of Birth
              </label>
              <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="en-gb">
                <DatePicker
                  format="DD/MM/YYYY"
                  value={profile.dob ? dayjs(profile.dob) : null}
                  onChange={val => {
                    const dob = val ? val.format("YYYY-MM-DD") : "";
                    setProfile({
                      ...profile,
                      dob,
                      age: calculateAge(dob),
                    });
                  }}
                  slotProps={{
                    day: {
                      sx: {
                        borderRadius: datePickerStyles.date.borderRadius,
                        fontSize: datePickerStyles.date.fontSize,
                        "&.Mui-selected": {
                          backgroundColor:
                            datePickerStyles.date.selectedBg,
                          color: datePickerStyles.date.selectedColor,
                        },
                        "&:hover": {
                          backgroundColor: datePickerStyles.date.hoverBg,
                        },
                      },
                    },
                  }}
                />
              </LocalizationProvider>
            </div>
          </div>
        )}

        {/* ---------- STEP 3 ---------- */}
        {step === 3 && (
          <div className="grid grid-cols-2 gap-6">

            {/* Allergy dropdown */}
            <div ref={allergyRef} className="relative">
              <label className="block text-sm font-medium mb-1">
                Allergy Types
              </label>
              <div
                onClick={() => setShowAllergyDropdown(v => !v)}
                className="w-full px-3 py-2 border rounded-md bg-white cursor-pointer"
              >
                {profile.allergies.length
                  ? profile.allergies.join(", ")
                  : "Select allergy types"}
              </div>

              {showAllergyDropdown && (
                <div className="absolute z-10 mt-1 w-full bg-white border rounded-md shadow-md p-2 space-y-1">
                  {[
                    "Food",
                    "Drug / Medication",
                    "Environmental",
                    "Insect / Sting",
                    "Latex",
                    "Pet / Animal",
                    "Chemical",
                    "Other",
                  ].map(item => (
                    <label
                      key={item}
                      className="flex items-center gap-2 text-sm"
                    >
                      <input
                        type="checkbox"
                        checked={profile.allergies.includes(item)}
                        onChange={e => {
                          const updated = e.target.checked
                            ? [...profile.allergies, item]
                            : profile.allergies.filter(a => a !== item);
                          setProfile({
                            ...profile,
                            allergies: updated,
                          });
                        }}
                      />
                      {item}
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Medical conditions dropdown */}
            <div ref={medicalRef} className="relative">
              <label className="block text-sm font-medium mb-1">
                Medical Conditions
              </label>
              <div
                onClick={() => setShowMedicalDropdown(v => !v)}
                className="w-full px-3 py-2 border rounded-md bg-white cursor-pointer"
              >
                {profile.medicalCondition.length
                  ? profile.medicalCondition.join(", ")
                  : "Select medical conditions"}
              </div>

              {showMedicalDropdown && (
                <div className="absolute z-10 mt-1 w-full bg-white border rounded-md shadow-md p-2 space-y-1">
                  {medicalConditionOptions.map(item => (
                    <label
                      key={item}
                      className="flex items-center gap-2 text-sm"
                    >
                      <input
                        type="checkbox"
                        checked={profile.medicalCondition.includes(item)}
                        onChange={e => {
                          const updated = e.target.checked
                            ? [...profile.medicalCondition, item]
                            : profile.medicalCondition.filter(m => m !== item);
                          setProfile({
                            ...profile,
                            medicalCondition: updated,
                          });
                        }}
                      />
                      {item}
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ---------- FOOTER ---------- */}
        <div className="flex justify-between mt-14">
          <button
            onClick={() => setStep(Math.max(1, step - 1))}
            disabled={step === 1}
            className={`px-6 py-2 rounded-md text-white transition
              ${
                step === 1
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-400 to-blue-600"
              }`}
          >
            ← Back
          </button>

          {step < 3 ? (
            <button
              onClick={() => setStep(step + 1)}
              className="bg-gradient-to-r from-blue-400 to-blue-600 text-white px-8 py-2 rounded-md"
            >
              Next →
            </button>
          ) : (
            <button
              onClick={handleSave}
              className="bg-gradient-to-r from-blue-400 to-blue-600 text-white px-8 py-2 rounded-md"
            >
              Save
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
