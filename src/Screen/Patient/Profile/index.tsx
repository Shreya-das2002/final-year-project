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

/* ================= TYPES ================= */

interface FieldProps {
  label: string;
  value: string;
  onChange?: (val: string) => void;
  disabled?: boolean;
}

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
  const [profile, setProfile] =
    useState<PatientProfilePayload>(getInitialProfile);
  const [step, setStep] = useState(1);

  const [showAllergyDropdown, setShowAllergyDropdown] = useState(false);
  const [showMedicalDropdown, setShowMedicalDropdown] = useState(false);

  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const medicalDropdownRef = useRef<HTMLDivElement | null>(null);

  /* ---------- CLICK OUTSIDE ---------- */
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setShowAllergyDropdown(false);
      }

      if (
        medicalDropdownRef.current &&
        !medicalDropdownRef.current.contains(e.target as Node)
      ) {
        setShowMedicalDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
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

  /* ---------- SAVE ---------- */
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
                    className={`w-9 h-9 rounded-full font-semibold transition ${
                      active
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {current}
                  </button>
                  <p
                    className={`mt-2 text-sm ${
                      active ? "text-blue-600 font-medium" : "text-gray-400"
                    }`}
                  >
                    {label}
                  </p>
                </div>

                {i < steps.length - 1 && (
                  <div
                    className={`flex-1 h-1 mx-4 rounded ${
                      step > current ? "bg-blue-600" : "bg-gray-200"
                    }`}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>

        <h2 className="text-xl font-semibold mb-6">
          {steps[step - 1]}
        </h2>

        {/* ================= STEP 1 ================= */}
        {step === 1 && (
          <div className="grid grid-cols-3 gap-6">
            <Field label="First Name" value={profile.firstName} disabled />
            <Field label="Middle Name" value={profile.middleName} disabled />
            <Field label="Last Name" value={profile.lastName} disabled />
            <Field label="Email" value={profile.email} disabled />
            <Field label="Phone" value={profile.phone} disabled />
            <Field label="Gender" value={profile.gender} disabled />
          </div>
        )}

        {/* ================= STEP 2 ================= */}
        {step === 2 && (
          <div className="grid grid-cols-2 gap-6">
            <Textarea
              label="Current Address"
              value={profile.currentAddress}
              onChange={val =>
                setProfile({ ...profile, currentAddress: val })
              }
            />
            <Textarea
              label="Permanent Address"
              value={profile.permanentAddress}
              onChange={val =>
                setProfile({ ...profile, permanentAddress: val })
              }
            />

            <div>
              <label className="block text-sm col-span-3 font-medium mb-1">
                Date of Birth
              </label>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  format="DD/MM/YYYY"
                  value={profile.dob ? dayjs(profile.dob) : null}
                  className="w-full  px-3 pr-10 border rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                        borderRadius:
                          datePickerStyles.date.borderRadius,
                        fontSize: datePickerStyles.date.fontSize,
                      },
                    },
                  }}
                />
              </LocalizationProvider>
            </div>

            <Field label="Age" value={profile.age} disabled />

            <Textarea
              label="Occupation"
              value={profile.occupation}
              onChange={val =>
                setProfile({ ...profile, occupation: val })
              }
            />
    <div>
    <label className="block text-sm font-medium mb-1">
    Marital Status
  </label>

  <select
    value={profile.maritalStatus}
    onChange={e =>
      setProfile({ ...profile, maritalStatus: e.target.value })
    }
    className="w-full h-[42px] px-3 border rounded-md bg-white"
  >
    <option value="">Select status</option>
    <option value="Single">Single (Never Married)</option>
    <option value="Married">Married</option>
    <option value="Divorced">Divorced</option>
    <option value="Widowed">Widowed</option>
    <option value="Separated">Separated</option>
  </select>
  </div>
          </div>
        )}

        {/* ================= STEP 3 ================= */}
        {step === 3 && (
          <div className="grid grid-cols-2 gap-6">
            <Field
              label="Blood Group"
              value={profile.bloodGroup}
              onChange={val =>
                setProfile({ ...profile, bloodGroup: val })
              }
            />
            <Field
              label="Height"
              value={profile.height}
              onChange={val =>
                setProfile({ ...profile, height: val })
              }
            />

            <Field
              label="weight"
              value={profile.weight}
              onChange={val =>
                setProfile({ ...profile, weight: val })
              }
            />

            {/* Allergy dropdown */}
            <div className="relative" ref={dropdownRef}>
              <label className="block text-sm font-medium mb-1">
                Allergy Types
              </label>

              <div
                onClick={() =>
                  setShowAllergyDropdown(prev => !prev)
                }
                className="w-full px-3 py-2 border rounded-md bg-white cursor-pointer flex flex-wrap gap-1"
              >
                {profile.allergies.length
                  ? profile.allergies.join(", ")
                  : "Select allergy types"}
              </div>

              {showAllergyDropdown && (
                <div className="absolute z-10 mt-1 w-full bg-white border rounded-md shadow-md p-2">
                  {[
                    "Food",
                    "Drug / Medication",
                    "Environmental",
                    "Insect / Sting",
                    "Latex",
                    "Pet / Animal",
                    "Chemical",
                    "Other",
                  ].map(type => (
                    <label
                      key={type}
                      className="flex items-center gap-2 text-sm"
                    >
                      <input
                        type="checkbox"
                        checked={profile.allergies.includes(type)}
                        onChange={e => {
                          const updated = e.target.checked
                            ? [...profile.allergies, type]
                            : profile.allergies.filter(
                                t => t !== type
                              );
                          setProfile({
                            ...profile,
                            allergies: updated,
                          });
                        }}
                      />
                      {type}
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Medical Conditions */}
            <div className="relative" ref={medicalDropdownRef}>
              <label className="block text-sm font-medium mb-1">
                Medical Conditions
              </label>

              <div
                onClick={() =>
                  setShowMedicalDropdown(prev => !prev)
                }
                className="w-full px-3 py-2 border rounded-md bg-white cursor-pointer"
              >
                {profile.medicalCondition.length
                  ? profile.medicalCondition.join(", ")
                  : "Select medical conditions"}
              </div>

              {showMedicalDropdown && (
                <div className="absolute z-10 mt-1 w-full bg-white border rounded-md shadow-md p-2">
                  {medicalConditionOptions.map(item => (
                    <label
                      key={item}
                      className="flex items-center gap-2 text-sm"
                    >
                      <input
                        type="checkbox"
                        checked={profile.medicalCondition.includes(
                          item
                        )}
                        onChange={e => {
                          const updated = e.target.checked
                            ? [
                                ...profile.medicalCondition,
                                item,
                              ]
                            : profile.medicalCondition.filter(
                                i => i !== item
                              );
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
            
            <div className="col-span-2">
  <label className="block text-sm font-medium mb-2">
    Do you consume alcohol?
  </label>

  <div className="flex gap-3">
    {["Yes", "No"].map(option => (
      <button
        key={option}
        type="button"
        onClick={() =>
          setProfile({ ...profile, alcohol: option })
        }
        className={`px-5 py-2 rounded-md border text-sm font-medium transition ${
          profile.alcohol === option
            ? "bg-blue-600 text-white border-blue-600"
            : "bg-white hover:bg-blue-50"
        }`}
      >
        {option}
      </button>
    ))}
  </div>
</div>
<div className="col-span-2">
  <label className="block text-sm font-medium mb-2">
    Do you consume smoking?
  </label>

  <div className="flex gap-3">
    {["Yes", "No"].map(option => (
      <button
        key={option}
        type="button"
        onClick={() =>
          setProfile({ ...profile, smoking: option })
        }
        className={`px-5 py-2 rounded-md border text-sm font-medium transition ${
          profile.smoking === option
            ? "bg-blue-600 text-white border-blue-600"
            : "bg-white hover:bg-blue-50"
        }`}
      >
        {option}
      </button>
    ))}
  </div>
</div>

          </div>
        )}

        {/* ================= STEP 4 ================= */}
        {step === 4 && (
          <div className="border rounded-xl p-6 bg-white">
            <h3 className="text-lg font-semibold mb-4">
              Upload Medical Report
            </h3>
            <div className="border-2 border-dashed rounded-lg p-6 text-center bg-gray-50">
              Drag & drop file here or{" "}
              <span className="text-blue-600 cursor-pointer">
                Browse
              </span>
            </div>
          </div>
        )}

        {/* ---------- FOOTER ---------- */}
        <div className="flex justify-between mt-14">
          <button
            onClick={() => setStep(prev => Math.max(1, prev - 1))}
            disabled={step === 1}
            className={`px-6 py-2 rounded-md text-white ${
              step === 1
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-blue-600"
            }`}
          >
            ← Back
          </button>

          {step < 4 ? (
            <button
              onClick={() => setStep(prev => prev + 1)}
              className="bg-blue-600 text-white px-8 py-2 rounded-md"
            >
              Next →
            </button>
          ) : (
            <button
              onClick={handleSave}
              className="bg-blue-600 text-white px-8 py-2 rounded-md"
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

/* ================= REUSABLE FIELDS ================= */

const Field: React.FC<FieldProps> = ({
  label,
  value,
  onChange,
  disabled,
}) => (
  <div>
    <label className="block text-sm font-medium mb-1">
      {label}
    </label>
    <input
      value={value}
      disabled={disabled}
      onChange={e => onChange?.(e.target.value)}
      className={`w-full px-3 py-2 border rounded-md ${
        disabled ? "bg-gray-100" : "bg-white"
      }`}
    />
  </div>
);

const Textarea: React.FC<FieldProps> = ({
  label,
  value,
  onChange,
}) => (
  <div>
    <label className="block text-sm font-medium mb-1">
      {label}
    </label>
    <textarea
      value={value}
      onChange={e => onChange?.(e.target.value)}
      className="w-full px-3 py-2 border rounded-md h-24"
    />
  </div>
);
