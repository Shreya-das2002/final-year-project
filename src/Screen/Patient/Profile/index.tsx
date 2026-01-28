import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import dayjs from "dayjs";

import ProfileAvatar from "./ProfileAvatar";

import {
  getPatientProfileApi,
  savePatientProfileApi,
} from "../../../services/patientApi";

import type {
  PatientProfilePayload,
  SavePatientProfilePayload,
} from "../../../services/patientApi";

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

/* ================= INITIAL STATE ================= */

const getInitialProfile = (): PatientProfilePayload => ({
  firstName: "",
  middleName: "",
  lastName: "",
  email: "",
  phone: "",
  gender: "",
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
});

/* ================= COMPONENT ================= */

const Profile: React.FC = () => {
  const [profile, setProfile] =
    useState<PatientProfilePayload>(getInitialProfile);
  const [step, setStep] = useState(1);

  /* ================= FETCH PROFILE ================= */
  useEffect(() => {
    getPatientProfileApi()
      .then(res => {
        const data = res.data;

        setProfile(prev => ({
          ...prev,
          firstName: data.first_name || "",
          middleName: data.middle_name || "",
          lastName: data.last_name || "",
          email: data.email || "",
          phone: data.phone_no || "",
          gender: data.patient_detail?.gender || "",
          dob: data.patient_detail?.dob || "",
          age: data.patient_detail?.dob
            ? calculateAge(data.patient_detail.dob)
            : "",
          bloodGroup: data.patient_detail?.blood_group || "",
          allergies: data.patient_detail?.allergies || [],
          height: data.patient_detail?.height || "",
          weight: data.patient_detail?.weight || "",
          currentAddress: data.patient_detail?.current_address || "",
          permanentAddress: data.patient_detail?.permanent_address || "",
        }));
      })
      .catch(() => toast.error("Failed to load profile"));
  }, []);

  /* ================= SAVE PROFILE ================= */
  const handleSave = async () => {
    if (!isValidDOB(profile.dob)) {
      toast.error("Invalid Date of Birth");
      return;
    }

    const payload: SavePatientProfilePayload = {
      dob: profile.dob,
      bloodGroup: profile.bloodGroup,
      height: profile.height,
      weight: profile.weight,
      currentAddress: profile.currentAddress,
      permanentAddress: profile.permanentAddress,
    };

    try {
      await savePatientProfileApi(payload);
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

        <h2 className="text-xl font-semibold mb-6">
          Patient Profile
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
              <label className="block text-sm font-medium mb-1">
                Date of Birth
              </label>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
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
                  className="w-full"
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
              label="Weight"
              value={profile.weight}
              onChange={val =>
                setProfile({ ...profile, weight: val })
              }
            />
          </div>
        )}

        {/* ================= FOOTER ================= */}
        <div className="flex justify-between mt-10">
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

          {step < 3 ? (
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

/* ================= REUSABLE COMPONENTS ================= */

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
