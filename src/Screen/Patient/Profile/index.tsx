import React, { useEffect, useState } from "react";
import ProfileAvatar from "./ProfileAvatar";
import toast from "react-hot-toast";
import { isValidDOB, datePickerStyles, calculateAge } from "../../../Environment";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

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
  allergies: string;
  height: string;
  weight: string;
  currentAddress: string;
  permanentAddress: string;
}

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

const steps = ["Basic Information", "Personal Details", "Medical Details"];

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
    bloodGroup: "",
    allergies: "",
    height: "",
    weight: "",
    currentAddress: "",
    permanentAddress: "",
  };
};

/* ================= COMPONENT ================= */

const Profile: React.FC = () => {
  const [profile, setProfile] = useState<ProfileData>(getInitialProfile);
  const [step, setStep] = useState<number>(1);
  const token = localStorage.getItem("token");

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
          bloodGroup: data.patient_detail?.blood_group || "",
          allergies: data.patient_detail?.allergies || "",
          height: data.patient_detail?.height || "",
          weight: data.patient_detail?.weight || "",
          currentAddress: data.patient_detail?.current_address || "",
          permanentAddress: data.patient_detail?.permanent_address || "",
        }));
      });
  }, [token]);

  const handleSave = async (): Promise<void> => {
    if (!isValidDOB(profile.dob)) {
      toast.error("Please enter a valid Date of Birth");
      return;
    }

    await fetch("http://localhost:3000/api/patient/profile", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(profile),
    });

    toast.success("Profile saved successfully");
  };

  return (
    <div className="min-h-screen bg-slate-100 p-8">
      <div className="max-w-5xl mx-auto bg-white shadow-xl rounded-lg p-8">

        <ProfileAvatar
          firstName={profile.firstName}
          lastName={profile.lastName}
        />

        {/* Progress Bar Stepper */}
<div className="mb-12">

  <div className="flex items-center">

    {steps.map((label, i) => {
      const current = i + 1;
      const active = step >= current;

      return (
        <React.Fragment key={label}>
          <div className="flex flex-col items-center min-w-[120px]">

            <button
  onClick={() => setStep(current)}
  className={`w-9 h-9 rounded-full flex items-center justify-center font-semibold transition
  ${active ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-500"}`}
>
  {current}
</button>

            <p
              className={`mt-2 text-sm
              ${active ? "text-blue-600 font-medium" : "text-gray-400"}`}
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

</div>


        <h2 className="text-xl font-semibold mb-6">{steps[step - 1]}</h2>

        {/* Step Content */}
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

        {step === 2 && (
          <div className="grid grid-cols-2 gap-6">
            <Textarea
              label="Current Address"
              value={profile.currentAddress}
              onChange={val => setProfile({ ...profile, currentAddress: val })}
            />
            <Textarea
              label="Permanent Address"
              value={profile.permanentAddress}
              onChange={val => setProfile({ ...profile, permanentAddress: val })}
            />

            <div>
              <label className="block text-sm font-medium mb-1">Date of Birth</label>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
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
                          backgroundColor: datePickerStyles.date.selectedBg,
                          color: datePickerStyles.date.selectedColor,
                        },
                        "&:hover": {
                          backgroundColor: datePickerStyles.date.hoverBg,
                        },
                      },
                    },
                    calendarHeader: {
                      sx: {
                        fontSize: datePickerStyles.header.fontSize,
                        fontWeight: datePickerStyles.header.fontWeight,
                      },
                    },
                  }}
                />
              </LocalizationProvider>

              {!isValidDOB(profile.dob) && profile.dob && (
                <p className="text-xs text-blue-500 mt-1">
                  Please select a valid birth date
                </p>
              )}
            </div>
            <Field label="Age" value={profile.age} disabled />
          </div>
        )}

        {step === 3 && (
          <div className="grid grid-cols-2 gap-6">
            <Field label="Blood Group" value={profile.bloodGroup}
              onChange={val => setProfile({ ...profile, bloodGroup: val })} />
            <Field label="Height" value={profile.height}
              onChange={val => setProfile({ ...profile, height: val })} />
            <Field label="Weight" value={profile.weight}
              onChange={val => setProfile({ ...profile, weight: val })} />
          </div>
        )}

        {/* Footer Buttons */}
        <div className="flex justify-between mt-14">
          <button
            onClick={() => setStep(Math.max(1, step - 1))}
            disabled={step === 1}
            className={`px-6 py-2 rounded-md text-white transition
              ${step === 1
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700"
              }`}
          >
            ← Back
          </button>

          {step < 3 ? (
            <button
              onClick={() => setStep(Math.min(3, step + 1))}
              className="bg-gradient-to-r from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700 text-white px-8 py-2 rounded-md transition"
            >
              Next →
            </button>
          ) : (
            <button
              onClick={handleSave}
              className="bg-gradient-to-r from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700 text-white px-8 py-2 rounded-md transition"
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

const Field: React.FC<FieldProps> = ({ label, value, onChange, disabled }) => (
  <div>
    <label className="block text-sm font-medium mb-1">{label}</label>
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

const Textarea: React.FC<FieldProps> = ({ label, value, onChange }) => (
  <div>
    <label className="block text-sm font-medium mb-1">{label}</label>
    <textarea
      value={value}
      onChange={e => onChange?.(e.target.value)}
      className="w-full px-3 py-2 border rounded-md h-24"
    />
  </div>
);
