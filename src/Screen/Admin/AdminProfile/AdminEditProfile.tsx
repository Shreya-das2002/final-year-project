import React, {useState } from "react";


/* ================= COMPONENT ================= */

const AdminEditProfile: React.FC = () => {


  const [step, setStep] = useState(1);

 
  const [profile, setProfile] = useState({
    first_name: "",
    middle_name: "",
    last_name: "",
    role: "",
    dob: "",
  });

  /* ================= HANDLER ================= */
  const handleChange = (key: string, value: string) => {
    setProfile((prev) => ({ ...prev, [key]: value }));
  };

  /* ================= SAVE ================= */
  const handleSave = () => {
    console.log("Saved Data:", profile);
    alert("Saved (Frontend Only) ");
  };

  /* ================= UI ================= */
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto bg-blue-100 p-8 rounded shadow">

        {/* AVATAR */}
        <ProfileAvatar
          firstName={profile.first_name}
          lastName={profile.last_name}
        />

        {/* STEPPER */}
        <StepIndicator step={step} onStepClick={setStep} />

        {/* STEP 1 */}
        {step === 1 && (
          <div className="bg-gray-50 p-6 rounded space-y-6">

            <fieldset className="border p-5 bg-blue-50 rounded">
              <legend className="px-2 text-sm font-semibold">
                Personal Details
              </legend>

              <div className="grid md:grid-cols-3 gap-4">
                <Field label="First Name" value={profile.first_name} onChange={(v)=>handleChange("first_name",v)} />
                <Field label="Middle Name" value={profile.middle_name} onChange={(v)=>handleChange("middle_name",v)} />
                <Field label="Last Name" value={profile.last_name} onChange={(v)=>handleChange("last_name",v)} />
              </div>

              <div className="grid md:grid-cols-2 gap-4 mt-4">
                <Field label="Date of Birth" type="date" value={profile.dob} onChange={(v)=>handleChange("dob",v)} />

                <Field label="Role" value={profile.role} onChange={(v)=>handleChange("role",v)} />
              </div>

            </fieldset>
          </div>
        )}

        {/* STEP 2 (optional UI only) */}
        {step === 2 && (
          <div className="bg-gray-50 p-6 rounded">
            <p className="text-gray-600">Experience / Permissions (UI only)</p>
          </div>
        )}

        {/* NAV */}
        <div className="flex justify-between mt-6">

          <button
            onClick={() => setStep((s) => Math.max(1, s - 1))}
            className="px-6 py-2 bg-gray-300 rounded"
          >
            ← Back
          </button>

          <div className="flex gap-4">
            {step === 1 && (
              <button
                onClick={() => setStep(2)}
                className="px-6 py-2 bg-blue-600 text-white rounded"
              >
                Next →
              </button>
            )}

            <button
              onClick={handleSave}
              className="px-6 py-2 bg-green-600 text-white rounded"
            >
              Save
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};

export default AdminEditProfile;

/* ================= REUSABLE COMPONENTS ================= */

const Field = ({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) => (
  <div>
    <label className="text-sm">{label}</label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full border p-2 rounded"
    />
  </div>
);

const ProfileAvatar = ({
  firstName,
  lastName,
}: {
  firstName: string;
  lastName: string;
}) => {
  const initials = (firstName[0] || "") + (lastName[0] || "");

  return (
    <div className="text-center mb-6">
      <div className="w-24 h-24 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto text-2xl">
        {initials}
      </div>
      <button className="mt-2 border px-4 py-1 rounded">
        Edit Profile
      </button>
    </div>
  );
};

const StepIndicator = ({
  step,
  onStepClick,
}: {
  step: number;
  onStepClick: (n: number) => void;
}) => {
  const steps = [
    { id: 1, label: "Basic Information" },
    { id: 2, label: "Experience Details" },
  ];

  return (
    <div className="mb-10 w-full px-10">
      <div className="flex items-center w-full">

        {steps.map((s, index) => (
          <React.Fragment key={s.id}>

            <div className="flex flex-col items-center">
              <div
                onClick={() => onStepClick(s.id)}
                className={`w-10 h-10 rounded-full flex items-center justify-center cursor-pointer
                ${step >= s.id ? "bg-blue-600 text-white" : "bg-gray-300"}`}
              >
                {s.id}
              </div>

              <span className="mt-2 text-xs">{s.label}</span>
            </div>

            {index !== steps.length - 1 && (
              <div className="flex-1 h-[3px] mx-6 bg-gray-300" />
            )}

          </React.Fragment>
        ))}
      </div>
    </div>
  );
};