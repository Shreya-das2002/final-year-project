import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

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

type LockedField = keyof Pick<
  ProfileData,
  "firstName" | "middleName" | "lastName" | "email" | "phone" | "gender" | "password"
>;

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
    bloodGroup: "",
    allergies: "",
    height: "",
    weight: "",
    currentAddress: "",
    permanentAddress: "",
  };
};

const Profile: React.FC = () => {
  const [profile, setProfile] = useState<ProfileData>(getInitialProfile);

  const lockedFields: LockedField[] = [
    "firstName",
    "middleName",
    "lastName",
    "email",
    "phone",
    "gender",
    "password",
  ];

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

          // Sync locked fields from backend
          firstName: data.patient?.first_name || prev.firstName,
          middleName: data.patient?.middle_name || prev.middleName,
          lastName: data.patient?.last_name || prev.lastName,
          email: data.patient?.email || prev.email,
          phone: data.patient?.phone_no || prev.phone,

          // 🔥 Gender converted from number → label
          gender: genderMap[Number(data.patient?.gender)] || "",

          // Patient details
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

  const handleSave = async () => {
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

  const inputClass = "w-full p-2 border rounded mt-1";
  const labelClass = "text-sm font-semibold capitalize";

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-6">Patient Profile</h2>

      {/* Locked fields */}
      <div className="grid grid-cols-3 gap-4">
        {lockedFields.map(field => (
          <div key={field}>
            <label className={labelClass}>
              {field.replace(/([A-Z])/g, " $1")}
            </label>
            <input
              value={profile[field]}
              disabled
              className={`${inputClass} bg-gray-100`}
            />
          </div>
        ))}
      </div>

      <hr className="my-6" />

      {/* Editable fields */}
      <div className="grid grid-cols-2 gap-4">
        <input
          type="date"
          className={inputClass}
          value={profile.dob}
          onChange={e => setProfile({ ...profile, dob: e.target.value })}
        />

        <input
          placeholder="Blood Group"
          className={inputClass}
          value={profile.bloodGroup}
          onChange={e => setProfile({ ...profile, bloodGroup: e.target.value })}
        />

        <input
          placeholder="Allergies"
          className={inputClass}
          value={profile.allergies}
          onChange={e => setProfile({ ...profile, allergies: e.target.value })}
        />

        <input
          placeholder="Height (cm)"
          className={inputClass}
          value={profile.height}
          onChange={e => setProfile({ ...profile, height: e.target.value })}
        />

        <input
          placeholder="Weight (kg)"
          className={inputClass}
          value={profile.weight}
          onChange={e => setProfile({ ...profile, weight: e.target.value })}
        />

        <textarea
          placeholder="Current Address"
          className={inputClass}
          value={profile.currentAddress}
          onChange={e =>
            setProfile({ ...profile, currentAddress: e.target.value })
          }
        />

        <textarea
          placeholder="Permanent Address"
          className={inputClass}
          value={profile.permanentAddress}
          onChange={e =>
            setProfile({ ...profile, permanentAddress: e.target.value })
          }
        />
      </div>

      <button
        onClick={handleSave}
        className="mt-6 px-6 py-2 bg-teal-600 text-white rounded"
      >
        Save Profile
      </button>
    </div>
  );
};

export default Profile;
