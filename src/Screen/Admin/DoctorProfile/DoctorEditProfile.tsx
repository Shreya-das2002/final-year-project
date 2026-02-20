import React, { useState } from "react";

/* ================= TYPES ================= */

interface Address {
  addressLine1: string;
  addressLine2: string;
  city: string;
  district: string;
  state: string;
  country: string;
  pincode: string;
}

interface DoctorProfile {
  firstName: string;
  middleName: string;
  lastName: string;
  email: string;
  phone: string;
  gender: string;

  dob: string;
  experience: string;
  specialization: string;

  bio: string;
}

/* ================= COMPONENT ================= */

const DoctorEditProfile: React.FC = () => {
  const [step, setStep] = useState(1);
  const [sameAddress, setSameAddress] = useState(false);

  const [profile, setProfile] = useState<DoctorProfile>({
    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
    phone: "",
    gender: "",
    dob: "",
    experience: "",
    specialization: "",
    bio: "",
  });

  const [currentAddress, setCurrentAddress] = useState<Address>({
    addressLine1: "",
    addressLine2: "",
    city: "",
    district: "",
    state: "",
    country: "",
    pincode: "",
  });

  const [permanentAddress, setPermanentAddress] = useState<Address>({
    addressLine1: "",
    addressLine2: "",
    city: "",
    district: "",
    state: "",
    country: "",
    pincode: "",
  });

  /* ================= HANDLERS ================= */

  const handleProfileChange = (key: keyof DoctorProfile, value: string) => {
    setProfile(prev => ({ ...prev, [key]: value }));
  };

  const handleSameAddress = () => {
    const checked = !sameAddress;
    setSameAddress(checked);

    if (checked) {
      setPermanentAddress({ ...currentAddress });
    }
  };

  const handleCurrentChange = (key: keyof Address, value: string) => {
    const updated = { ...currentAddress, [key]: value };
    setCurrentAddress(updated);

    if (sameAddress) {
      setPermanentAddress(updated);
    }
  };

  const handlePermanentChange = (key: keyof Address, value: string) => {
    setPermanentAddress(prev => ({ ...prev, [key]: value }));
  };

  /* ================= UI ================= */

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto bg-gradient-to-br from-sky-100 to-blue-200 shadow-xl rounded-lg p-8">

        <h2 className="text-xl font-semibold mb-6">Doctor Profile</h2>

        <StepIndicator step={step} onStepClick={setStep} />

        {/* ================= STEP 1 ================= */}
        {step === 1 && (
          <Card title="Basic Information">
            <div className="grid md:grid-cols-3 gap-6">
              <Field label="First Name" value={profile.firstName} onChange={(v) => handleProfileChange("firstName", v)} />
              <Field label="Middle Name" value={profile.middleName} onChange={(v) => handleProfileChange("middleName", v)} />
              <Field label="Last Name" value={profile.lastName} onChange={(v) => handleProfileChange("lastName", v)} />
              <Field label="Email" value={profile.email} onChange={(v) => handleProfileChange("email", v)} />
              <Field label="Phone" value={profile.phone} onChange={(v) => handleProfileChange("phone", v)} />
              <Field label="Gender" value={profile.gender} onChange={(v) => handleProfileChange("gender", v)} />
            </div>
          </Card>
        )}

        {/* ================= STEP 2 ================= */}
        {step === 2 && (
          <Card title="Professional Details">
            <div className="grid md:grid-cols-2 gap-6">
              <Field label="Date of Birth" type="date" value={profile.dob} onChange={(v) => handleProfileChange("dob", v)} />
              <Field label="Experience (Years)" value={profile.experience} onChange={(v) => handleProfileChange("experience", v)} />
              <Field label="Specialization" value={profile.specialization} onChange={(v) => handleProfileChange("specialization", v)} />
            </div>
          </Card>
        )}

        {/* ================= STEP 3 ================= */}
        {step === 3 && (
          <div className="space-y-6">

            {/* ADDRESS */}
            <Card title="Address Details">
              <div className="grid md:grid-cols-2 gap-10">

                {/* CURRENT */}
                <fieldset className="border border-gray-400 rounded-xl p-6">
                  <legend className="px-3 text-sm font-semibold">Current Address</legend>

                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <Input label="Address Line 1" value={currentAddress.addressLine1}
                        onChange={(v) => handleCurrentChange("addressLine1", v)} />
                      <Input label="Address Line 2" value={currentAddress.addressLine2}
                        onChange={(v) => handleCurrentChange("addressLine2", v)} />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <Input label="City" value={currentAddress.city}
                        onChange={(v) => handleCurrentChange("city", v)} />
                      <Input label="District" value={currentAddress.district}
                        onChange={(v) => handleCurrentChange("district", v)} />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <Input label="State" value={currentAddress.state}
                        onChange={(v) => handleCurrentChange("state", v)} />
                      <Input label="Country" value={currentAddress.country}
                        onChange={(v) => handleCurrentChange("country", v)} />
                    </div>

                    <Input label="PIN Code" value={currentAddress.pincode}
                      onChange={(v) => handleCurrentChange("pincode", v)} />
                  </div>
                </fieldset>

                {/* PERMANENT */}
                <fieldset className="border border-gray-400 rounded-xl p-6">
                  <legend className="px-3 text-sm font-semibold">Permanent Address</legend>

                  <div className="flex justify-end mb-4">
                    <label className="flex items-center gap-2 text-sm">
                      <input type="checkbox" checked={sameAddress} onChange={handleSameAddress} />
                      Same as Current
                    </label>
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <Input label="Address Line 1" value={permanentAddress.addressLine1}
                        disabled={sameAddress}
                        onChange={(v) => handlePermanentChange("addressLine1", v)} />
                      <Input label="Address Line 2" value={permanentAddress.addressLine2}
                        disabled={sameAddress}
                        onChange={(v) => handlePermanentChange("addressLine2", v)} />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <Input label="City" value={permanentAddress.city}
                        disabled={sameAddress}
                        onChange={(v) => handlePermanentChange("city", v)} />
                      <Input label="District" value={permanentAddress.district}
                        disabled={sameAddress}
                        onChange={(v) => handlePermanentChange("district", v)} />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <Input label="State" value={permanentAddress.state}
                        disabled={sameAddress}
                        onChange={(v) => handlePermanentChange("state", v)} />
                      <Input label="Country" value={permanentAddress.country}
                        disabled={sameAddress}
                        onChange={(v) => handlePermanentChange("country", v)} />
                    </div>

                    <Input label="PIN Code" value={permanentAddress.pincode}
                      disabled={sameAddress}
                      onChange={(v) => handlePermanentChange("pincode", v)} />
                  </div>
                </fieldset>

              </div>
            </Card>

            {/* BIO */}
            <Card title="About Doctor">
              <textarea
                value={profile.bio}
                onChange={(e) => handleProfileChange("bio", e.target.value)}
                className="w-full border rounded-md p-3"
                placeholder="Write about yourself..."
              />
            </Card>
          </div>
        )}

        {/* ================= NAV ================= */}
        <div className="flex justify-between mt-10">
          <button
            onClick={() => setStep(s => Math.max(1, s - 1))}
            className="px-6 py-2 bg-gray-400 text-white rounded"
          >
            ← Back
          </button>

          {step < 3 ? (
            <button
              onClick={() => setStep(s => s + 1)}
              className="px-6 py-2 bg-blue-600 text-white rounded"
            >
              Next →
            </button>
          ) : (
            <button className="px-6 py-2 bg-green-600 text-white rounded">
              Save
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorEditProfile;

/* ================= REUSABLE ================= */

interface FieldProps {
  label: string;
  value: string;
  onChange?: (value: string) => void;
  type?: string;
}

const Field: React.FC<FieldProps> = ({ label, value, onChange, type = "text" }) => (
  <div>
    <label className="block text-sm mb-1">{label}</label>
    <input
      type={type}
      value={value}
      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
        onChange?.(e.target.value)
      }
      className="w-full border px-3 py-2 rounded-md"
    />
  </div>
);

interface InputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

const Input: React.FC<InputProps> = ({ label, value, onChange, disabled }) => (
  <div>
    <label className="block text-sm mb-1">{label}</label>
    <input
      value={value}
      disabled={disabled}
      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
        onChange(e.target.value)
      }
      className={`w-full border px-3 py-2 rounded-md ${
        disabled ? "bg-gray-100" : ""
      }`}
    />
  </div>
);

const Card = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
    <h3 className="text-lg font-semibold mb-4">{title}</h3>
    {children}
  </div>
);

const StepIndicator = ({
  step,
  onStepClick,
}: {
  step: number;
  onStepClick: (n: number) => void;
}) => {
  const steps = [
    { id: 1, label: "Basic Information" },
    { id: 2, label: "Professional Details" },
    { id: 3, label: "Address & Bio" },
  ];

  return (
    <div className="mb-10">
      <div className="flex items-center">
        {steps.map((s, index) => (
          <div key={s.id} className="flex items-center w-full">
            <div className="flex flex-col items-center">
              <div
                onClick={() => onStepClick(s.id)}
                className={`w-8 h-8 rounded-full flex items-center justify-center cursor-pointer
                ${
                  step >= s.id
                    ? "bg-blue-600 text-white"
                    : "bg-gray-300 text-gray-700"
                }`}
              >
                {s.id}
              </div>

              <span
                className={`mt-2 text-xs text-center w-24
                ${
                  step >= s.id
                    ? "text-blue-600 font-medium"
                    : "text-gray-500"
                }`}
              >
                {s.label}
              </span>
            </div>

            {index !== steps.length - 1 && (
              <div
                className={`flex-1 h-1 mx-2 mb-6
                ${
                  step > s.id ? "bg-blue-600" : "bg-gray-300"
                }`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};