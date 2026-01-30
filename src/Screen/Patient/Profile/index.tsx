import React, { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../../../../store/store";
import dayjs from "dayjs";

import ProfileAvatar from "./ProfileAvatar";
import { isValidDOB, calculateAge, getGenderLabel } from "../../../Environment";
import { savePatientProfileApi } from "../../../services/patientProfileApi";

import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import toast from "react-hot-toast";

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
  maritalStatus: string;
  occupation: string;

  currentAddress: string;
  permanentAddress: string;

  bloodGroup: string;
  height: string;
  weight: string;

  allergies: string[];
  smoking: boolean | null;
  alcohol: boolean | null;
}

/* ================= CONSTANTS ================= */

const ALLERGY_OPTIONS = [
  "Food",
  "Drug / Medication",
  "Environmental",
  "Insect / Sting",
  "Latex",
  "Pet / Animal",
  "Chemical",
  "Other",
];

/* ================= COMPONENT ================= */

const Profile: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const [step, setStep] = useState(1);
  const [sameAddress, setSameAddress] = useState(false);

const [currentAddress, setCurrentAddress] = useState({
  addressLine1: "",
  addressLine2: "",
  city: "",
  district: "",
  state: "",
  country: "",
  pincode: "",
});

const [permanentAddress, setPermanentAddress] = useState({
  addressLine1: "",
  addressLine2: "",
  city: "",
  district: "",
  state: "",
  country: "",
  pincode: "",
});

  const [profile, setProfile] = useState<EditableProfile>({
    firstName: user?.first_name || "",
    middleName: user?.middle_name || "",
    lastName: user?.last_name || "",
    email: user?.email || "",
    phone: user?.phone_no || "",
    gender: user?.gender || "",

    dob: "",
    age: "",
    maritalStatus: "",
    occupation: "",

    currentAddress: "",
    permanentAddress: "",

    bloodGroup: "",
    height: "",
    weight: "",

    allergies: [],
    smoking: null,
    alcohol: null,
  });

  /* ================= PROFILE COMPLETION ================= */

  const completion = Math.round(
    (Object.values(profile).filter(v =>
      Array.isArray(v) ? v.length : v !== "" && v !== null
    ).length /
      Object.keys(profile).length) *
      100
  );

  const handleSameAddressToggle = () => {
  const checked = !sameAddress;
  setSameAddress(checked);

  if (checked) {
    setPermanentAddress({ ...currentAddress });
  }
};

  /* ================= SAVE ================= */

  const handleSave = async () => {
    
    if (!isValidDOB(profile.dob)) {
      toast.error("Invalid Date of Birth");
      return;
    }

    if (!user?.patient_id) {
      toast.error("Patient ID missing");
      return;
    }

    try {
      // ✅ ONLY FIX: null → undefined
      const payload = {
        patient_id: user.patient_id,

        dob: profile.dob || undefined,
        marital_status: profile.maritalStatus || undefined,
        occupation: profile.occupation || undefined,

        blood_group: profile.bloodGroup
          ? Number(profile.bloodGroup)
          : undefined,

        height: profile.height ? Number(profile.height) : undefined,
        weight: profile.weight ? Number(profile.weight) : undefined,

        allergies: profile.allergies.length
          ? profile.allergies
          : undefined,

        smoking: profile.smoking ?? undefined,
        alcohol: profile.alcohol ?? undefined,

        current_address: profile.currentAddress
          ? {
              address_line: profile.currentAddress,
              city: "",
              state: "",
              pincode: "",
            }
          : undefined,

        permanent_address: profile.permanentAddress
          ? {
              address_line: profile.permanentAddress,
              city: "",
              state: "",
              pincode: "",
            }
          : undefined,
      };

      const res = await savePatientProfileApi(payload);

      if (res.data?.success) {
        toast.success("Profile saved successfully");
        console.log("Saved profile:", res.data.data);
      } else {
        toast.error(res.data?.data?.errorcode || "Save failed");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="relative max-w-5xl mx-auto bg-gradient-to-br from-sky-100 to-blue-200 shadow-xl rounded-lg p-8">

        <div className="absolute top-6 right-6 bg-white shadow rounded p-4">
          <p className="text-sm font-medium">Profile Completion</p>
          <p className="text-blue-600 font-bold">{completion}%</p>
        </div>

        <ProfileAvatar
          firstName={profile.firstName}
          lastName={profile.lastName}
        />

        <h2 className="text-xl font-semibold mb-6">Patient Profile</h2>

        <StepIndicator step={step} onStepClick={setStep} />

        {/* STEP 1 */}
        {step === 1 && (
          <div className="grid grid-cols-3 gap-6">
            <Field label="First Name" value={profile.firstName} disabled />
            <Field label="Middle Name" value={profile.middleName} disabled />
            <Field label="Last Name" value={profile.lastName} disabled />
            <Field label="Email" value={profile.email} disabled />
            <Field label="Phone" value={profile.phone} disabled />
            <Field
              label="Gender"
              value={getGenderLabel(profile.gender)}
              disabled
            />
          </div>
        )}

{step === 2 && (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

    {/* Current Address */}
    <div>
      <h3 className="text-lg font-semibold mb-4">Current Address</h3>

      <div className="space-y-4">
        <input
          placeholder="Address Line 1"
          className="input"
          value={currentAddress.addressLine1}
          onChange={e =>
            setCurrentAddress({ ...currentAddress, addressLine1: e.target.value })
          }
        />

        <input
          placeholder="Address Line 2"
          className="input"
          value={currentAddress.addressLine2}
          onChange={e =>
            setCurrentAddress({ ...currentAddress, addressLine2: e.target.value })
          }
        />

        <div className="grid grid-cols-2 gap-4">
          <input
            placeholder="City"
            className="input"
            value={currentAddress.city}
            onChange={e =>
              setCurrentAddress({ ...currentAddress, city: e.target.value })
            }
          />

          <input
            placeholder="District"
            className="input"
            value={currentAddress.district}
            onChange={e =>
              setCurrentAddress({ ...currentAddress, district: e.target.value })
            }
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <input
            placeholder="State"
            className="input"
            value={currentAddress.state}
            onChange={e =>
              setCurrentAddress({ ...currentAddress, state: e.target.value })
            }
          />

          <input
            placeholder="Country"
            className="input"
            value={currentAddress.country}
            onChange={e =>
              setCurrentAddress({ ...currentAddress, country: e.target.value })
            }
          />
        </div>

        <input
          placeholder="PIN Code"
          className="input"
          value={currentAddress.pincode}
          onChange={e =>
            setCurrentAddress({ ...currentAddress, pincode: e.target.value })
          }
        />
      </div>
    </div>

    {/* Permanent Address */}
    <div>
      <h3 className="text-lg font-semibold mb-4">Permanent Address</h3>

      <div className="flex items-center gap-2 mb-4">
        <input
          type="checkbox"
          checked={sameAddress}
          onChange={handleSameAddressToggle}
        />
        <span className="text-sm">Same as Current Address</span>
      </div>

      <div className="space-y-4">
        <input
          placeholder="Address Line 1"
          disabled={sameAddress}
          className="input"
          value={permanentAddress.addressLine1}
          onChange={e =>
            setPermanentAddress({ ...permanentAddress, addressLine1: e.target.value })
          }
        />

        <input
          placeholder="Address Line 2"
          disabled={sameAddress}
          className="input"
          value={permanentAddress.addressLine2}
          onChange={e =>
            setPermanentAddress({ ...permanentAddress, addressLine2: e.target.value })
          }
        />

        <div className="grid grid-cols-2 gap-4">
          <input
            placeholder="City"
            disabled={sameAddress}
            className="input"
            value={permanentAddress.city}
            onChange={e =>
              setPermanentAddress({ ...permanentAddress, city: e.target.value })
            }
          />

          <input
            placeholder="District"
            disabled={sameAddress}
            className="input"
            value={permanentAddress.district}
            onChange={e =>
              setPermanentAddress({ ...permanentAddress, district: e.target.value })
            }
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <input
            placeholder="State"
            disabled={sameAddress}
            className="input"
            value={permanentAddress.state}
            onChange={e =>
              setPermanentAddress({ ...permanentAddress, state: e.target.value })
            }
          />

          <input
            placeholder="Country"
            disabled={sameAddress}
            className="input"
            value={permanentAddress.country}
            onChange={e =>
              setPermanentAddress({ ...permanentAddress, country: e.target.value })
            }
          />
        </div>

        <input
          placeholder="PIN Code"
          disabled={sameAddress}
          className="input"
          value={permanentAddress.pincode}
          onChange={e =>
            setPermanentAddress({ ...permanentAddress, pincode: e.target.value })
          }
        />
      </div>
    </div>
  </div>
)}

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

            <Field label="Age" value={profile.age} disabled />

            <Field
              label="Occupation"
              value={profile.occupation}
              onChange={v => setProfile({ ...profile, occupation: v })}
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
                className="w-full border px-3 py-2 rounded-md"
              >
                <option value="">Select status</option>
                <option value="single">Single</option>
                <option value="married">Married</option>
                <option value="divorced">Divorced</option>
              </select>
            </div>
          </div>

        {/* STEP 3 */}
        {step === 3 && (
          <div className="grid grid-cols-2 gap-6">
            <Field
              label="Blood Group"
              value={profile.bloodGroup}
              onChange={v => setProfile({ ...profile, bloodGroup: v })}
            />

            <Field
              label="Height (cm)"
              value={profile.height}
              onChange={v => setProfile({ ...profile, height: v })}
            />

            <Field
              label="Weight (kg)"
              value={profile.weight}
              onChange={v => setProfile({ ...profile, weight: v })}
            />

            <AllergySelect
              value={profile.allergies}
              onChange={v => setProfile({ ...profile, allergies: v })}
            />

            <YesNo
              label="Do you smoke?"
              value={profile.smoking}
              onChange={v => setProfile({ ...profile, smoking: v })}
            />

            <YesNo
              label="Do you consume alcohol?"
              value={profile.alcohol}
              onChange={v => setProfile({ ...profile, alcohol: v })}
            />
          </div>
        )}

        <div className="flex justify-between mt-10">
          <button
            onClick={() => setStep(s => Math.max(1, s - 1))}
            disabled={step === 1}
            className="px-6 py-2 rounded-md bg-blue-600 text-white disabled:bg-gray-300"
          >
            ← Back
          </button>

          {step < 3 ? (
            <button
              onClick={() => setStep(s => s + 1)}
              className="px-8 py-2 bg-blue-600 text-white rounded-md"
            >
              Next →
            </button>
          ) : (
            <button
              onClick={handleSave}
              className="px-8 py-2 bg-green-600 text-white rounded-md"
            >
              Save
            </button>
          )}
        </div>
      </div>
  );
};

export default Profile;

/* ================= HELPER COMPONENTS ================= */

const StepIndicator = ({
  step,
  onStepClick,
}: {
  step: number;
  onStepClick: (n: number) => void;
}) => (
  <div className="flex items-center mb-8">
    {[1, 2, 3].map(n => (
      <div key={n} className="flex items-center w-full">
        <div
          onClick={() => onStepClick(n)}
          className={`w-8 h-8 rounded-full flex items-center justify-center cursor-pointer
          ${step >= n ? "bg-blue-600 text-white" : "bg-gray-300"}`}
        >
          {n}
        </div>
        {n !== 3 && (
          <div
            className={`flex-1 h-1 mx-2 ${
              step > n ? "bg-blue-600" : "bg-gray-300"
            }`}
          />
        )}
      </div>
    ))}
  </div>
);

const AllergySelect = ({
  value,
  onChange,
}: {
  value: string[];
  onChange: (v: string[]) => void;
}) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const toggle = (item: string) => {
    onChange(
      value.includes(item)
        ? value.filter(v => v !== item)
        : [...value, item]
    );
  };

  return (
    <div ref={ref} className="relative">
      <label className="block text-sm font-medium mb-1">Allergy Types</label>
      <div
        onClick={() => setOpen(!open)}
        className="min-h-[42px] border rounded-md px-2 py-1 flex flex-wrap gap-2 cursor-pointer bg-white"
      >
        {value.length === 0 && (
          <span className="text-gray-400">Select allergy types</span>
        )}
        {value.map(v => (
          <span
            key={v}
            className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-sm"
          >
            {v}
          </span>
        ))}
      </div>

      {open && (
        <div className="absolute z-20 mt-1 w-full bg-white border rounded-md shadow-lg">
          {ALLERGY_OPTIONS.map(opt => (
            <label key={opt} className="flex items-center gap-2 px-3 py-2">
              <input
                type="checkbox"
                checked={value.includes(opt)}
                onChange={() => toggle(opt)}
              />
              {opt}
            </label>
          ))}
        </div>
      )}
    </div>
  );
};

const YesNo = ({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean | null;
  onChange: (v: boolean) => void;
}) => (
  <div>
    <label className="block text-sm font-medium mb-1">{label}</label>
    <button
      type="button"
      onClick={() => onChange(true)}
      className={`px-4 py-1 mr-2 ${
        value === true ? "bg-blue-600 text-white" : "border"
      }`}
    >
      Yes
    </button>
    <button
      type="button"
      onClick={() => onChange(false)}
      className={`px-4 py-1 ${
        value === false ? "bg-blue-600 text-white" : "border"
      }`}
    >
      No
    </button>
  </div>
);

const Field = ({
  label,
  value,
  onChange,
  disabled,
}: {
  label: string;
  value: string;
  onChange?: (v: string) => void;
  disabled?: boolean;
}) => (
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

