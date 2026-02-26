import React, { useState, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import type { RootState, AppDispatch } from "../../../../store/store";
import { fetchAllAdmins } from "../../../../store/slices/adminSlice";

/* ================= COMPONENT ================= */

const AdminEditProfile: React.FC = () => {
  const { id } = useParams();
  const location = useLocation();

  const dispatch = useDispatch<AppDispatch>();

  /* ================= DATA SOURCES ================= */

  const adminFromState = location.state;

  const adminFromStore = useSelector(
    (state: RootState) => state.admin.admins
  );

  const adminFromStorage = localStorage.getItem("selectedAdmin");

  /* ================= FETCH ================= */

  useEffect(() => {
    dispatch(fetchAllAdmins());
  }, [dispatch]);

  /* ================= FINAL ADMIN ================= */

  const admin =
    adminFromState ||
    adminFromStore.find((a) => a.admin_user_id === Number(id)) ||
    (adminFromStorage ? JSON.parse(adminFromStorage) : null);

  /* ================= SYNC STORAGE ================= */

  useEffect(() => {
    if (adminFromState) {
      localStorage.setItem("selectedAdmin", JSON.stringify(adminFromState));
    }
  }, [adminFromState]);

  /* ================= STATE ================= */

  const [step, setStep] = useState(1);

  const [profile, setProfile] = useState({
    first_name: admin?.first_name || "",
    middle_name: admin?.middle_name || "",
    last_name: admin?.last_name || "",
    role: admin?.role || "",
    email: admin?.email || "",
  });

  /* ================= HANDLER ================= */

  const handleChange = (key: string, value: string) => {
    setProfile((prev) => ({ ...prev, [key]: value }));
  };

  /* ================= SAVE ================= */

  const handleSave = () => {
    console.log("Saved:", profile);
    alert("Saved (Frontend Only)");
  };

  /* ================= SAFETY ================= */

  if (!admin) {
    return <div className="p-10">No admin data found</div>;
  }

  /* ================= UI ================= */

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto bg-blue-100 p-8 rounded">

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
                <Field
                  label="First Name"
                  value={profile.first_name}
                  onChange={(v) => handleChange("first_name", v)}
                />

                <Field
                  label="Middle Name"
                  value={profile.middle_name}
                  onChange={(v) => handleChange("middle_name", v)}
                />

                <Field
                  label="Last Name"
                  value={profile.last_name}
                  onChange={(v) => handleChange("last_name", v)}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4 mt-4">
                <Field
                  label="Email"
                  value={profile.email}
                  onChange={(v) => handleChange("email", v)}
                />

                <Field
                  label="Role"
                  value={profile.role}
                  onChange={(v) => handleChange("role", v)}
                />
              </div>

            </fieldset>
          </div>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <div className="bg-gray-50 p-6 rounded">
            <p className="text-gray-600">Permissions / Extra Info</p>
          </div>
        )}

        {/* NAV */}
        <div className="flex justify-between mt-10">

          <button
            onClick={() => setStep((s) => Math.max(1, s - 1))}
            className="px-6 py-2 bg-blue-600 text-white rounded"
          >
            ← Back
          </button>

          <div className="flex gap-4">

            <button
              onClick={handleSave}
              className="px-6 py-2 bg-green-600 text-white rounded"
            >
              Save
            </button>

            {step === 1 && (
              <button
                onClick={() => setStep(2)}
                className="px-6 py-2 bg-blue-600 text-white rounded"
              >
                Next →
              </button>
            )}

          </div>

        </div>

      </div>
    </div>
  );
};

export default AdminEditProfile;

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
      value={value || ""}
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
  const initials =
    (firstName?.[0] || "") + (lastName?.[0] || "");

  return (
    <div className="text-center mb-6">
      <div className="w-24 h-24 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto text-2xl">
        {initials}
      </div>
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
    { id: 2, label: "Permissions" },
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
                ${
                  step >= s.id
                    ? "bg-blue-600 text-white"
                    : "bg-gray-300"
                }`}
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