import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

/* ================= TYPES ================= */

interface ProfileData {
  firstName: string;
  middleName: string;
  lastName: string;
  email: string;
  phone: string;
  gender: string;
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

        {/* Header */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold">{steps[step - 1]}</h2>

          {/* Stepper */}
          <div className="flex items-center justify-between relative mt-6">
            <div className="absolute left-0 right-0 h-1 bg-slate-200 top-1/2 -translate-y-1/2" />
            {steps.map((label, i) => {
              const active = i + 1 <= step;
              return (
                <div key={label} className="relative flex flex-col items-center w-1/3">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
                      active ? "bg-blue-600" : "bg-slate-300"
                    }`}
                  >
                    {i + 1}
                  </div>
                  <span className={`mt-2 text-sm ${active ? "text-blue-600" : "text-slate-400"}`}>
                    {label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Step Content */}
        {step === 1 && (
          <div className="grid grid-cols-2 gap-6 mt-8">
            <Field label="First Name" value={profile.firstName} />
            <Field label="Last Name" value={profile.lastName} />
            <Field label="Email" value={profile.email} />
            <Field label="Phone" value={profile.phone} />
          </div>
        )}

        {step === 2 && (
          <div className="grid grid-cols-2 gap-6 mt-8">
            <Field label="Date of Birth" value={profile.dob} />
            <Field label="Blood Group" value={profile.bloodGroup} />
            <Field label="Height" value={profile.height} />
            <Field label="Weight" value={profile.weight} />
          </div>
        )}

        {step === 3 && (
          <div className="grid grid-cols-2 gap-6 mt-8">
            <Textarea label="Current Address" value={profile.currentAddress} />
            <Textarea label="Permanent Address" value={profile.permanentAddress} />
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between mt-10">
          {step > 1 && (
            <button onClick={() => setStep(step - 1)} className="px-6 py-2 border rounded-md">
              ← Back
            </button>
          )}

          {step < 3 ? (
            <button onClick={() => setStep(step + 1)} className="bg-blue-600 text-white px-8 py-2 rounded-md">
              Next →
            </button>
          ) : (
            <button onClick={handleSave} className="bg-blue-600 text-white px-8 py-2 rounded-md">
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

const Field: React.FC<FieldProps> = ({ label, value }) => (
  <div>
    <label className="block text-sm font-medium mb-1">{label}</label>
    <input
      value={value}
      disabled
      className="w-full px-3 py-2 border rounded-md bg-gray-100"
    />
  </div>
);

const Textarea: React.FC<FieldProps> = ({ label, value }) => (
  <div>
    <label className="block text-sm font-medium mb-1">{label}</label>
    <textarea
      value={value}
      className="w-full px-3 py-2 border rounded-md h-24"
    />
  </div>
);
