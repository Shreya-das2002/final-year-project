import React, { useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../../../../store/store";
import dayjs from "dayjs";

import ProfileAvatar from "./ProfileAvatar";
import { isValidDOB, calculateAge } from "../../../Environment";

import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { getGenderLabel } from "../../../Environment";

/* ================= TYPES ================= */

interface EditableProfile {
  firstName: string;
  middleName: string;
  lastName: string;
  email: string;
  phone: string;
  gender: string;
  dob: string;
  age: string;
  bloodGroup: string;
  height: string;
  weight: string;
  currentAddress: string;
  permanentAddress: string;
}

/* ================= COMPONENT ================= */

const Profile: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth.user);

  const [step, setStep] = useState(1);

  const [profile, setProfile] = useState<EditableProfile>({
    firstName: user?.first_name || "",
    middleName: user?.middle_name || "",
    lastName: user?.last_name || "",
    email: user?.email || "",
    phone: user?.phone_no || "",
    gender: user?.gender || "",
    dob: "",
    age: "",
    bloodGroup: "",
    height: "",
    weight: "",
    currentAddress: "",
    permanentAddress: "",
  });

  /* ================= SAVE (UI ONLY) ================= */
  const handleSave = () => {
    if (!isValidDOB(profile.dob)) {
      alert("Invalid Date of Birth");
      return;
    }

    console.log("PROFILE DATA (UI ONLY):", profile);
    alert("Profile saved locally (no API)");
  };

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
            <Field label="Gender" value={getGenderLabel(profile.gender)} disabled />
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

interface FieldProps {
  label: string;
  value: string;
  onChange?: (val: string) => void;
  disabled?: boolean;
}

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
