import React, { useState, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import type { RootState, AppDispatch } from "../../../../store/store";
import { fetchAllAdmins } from "../../../../store/slices/adminSlice";

/* ================= TYPES ================= */

type AddressType = {
  address_line1: string;
  address_line2: string;
  city: string;
  state: string;
  pincode: string;
};

/* ================= COMPONENT ================= */

const AdminEditProfile: React.FC = () => {
  const { id } = useParams();
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();

  /* ================= DATA ================= */

  const adminFromState = location.state;

  const adminFromStore = useSelector(
    (state: RootState) => state.admin.admins
  );

  const adminFromStorage = localStorage.getItem("selectedAdmin");

  useEffect(() => {
    dispatch(fetchAllAdmins());
  }, [dispatch]);

  const admin =
    adminFromState ||
    adminFromStore.find((a) => a.admin_user_id === Number(id)) ||
    (adminFromStorage ? JSON.parse(adminFromStorage) : null);

  /* ================= STATE ================= */

  const [step, setStep] = useState(1);
  const [sameAddress, setSameAddress] = useState(false);

  const [profile, setProfile] = useState({
    first_name: admin.first_name || "",
    middle_name: "",
    last_name: "",
    dob: "",
    gender: "",
    email: "",
    department_id: "",
    created_on: "",
    created_by: "",
    phone: "",
  });

  const [permanentAddress, setPermanentAddress] = useState<AddressType>({
    address_line1: "",
    address_line2: "",
    city: "",
    state: "",
    pincode: "",
  });

  const [currentAddress, setCurrentAddress] = useState<AddressType>({
    address_line1: "",
    address_line2: "",
    city: "",
    state: "",
    pincode: "",
   
  });

  /* ================= FIX: NO CASCADING RENDER ================= */


  /* ================= HANDLERS ================= */

  const handleChange = (key: string, value: string) => {
    setProfile((prev) => ({ ...prev, [key]: value }));
  };

  const handlePermanentChange = (key: keyof AddressType, value: string) => {
    const updated = { ...permanentAddress, [key]: value };
    setPermanentAddress(updated);

    if (sameAddress) {
      setCurrentAddress(updated);
    }
  };

  const handleCurrentChange = (key: keyof AddressType, value: string) => {
    setCurrentAddress((prev) => ({ ...prev, [key]: value }));
  };

  const handleSameAddress = () => {
    setSameAddress((prev) => !prev);

    if (!sameAddress) {
      setCurrentAddress(permanentAddress);
    }
  };

  /* ================= SAVE ================= */

  const handleSave = () => {
    const finalData = {
      ...profile,
      permanent_address: permanentAddress,
      current_address: currentAddress,
    };

    console.log("Saved:", finalData);
  };

  /* ================= SAFETY ================= */

  if (!admin) {
    return <div className="p-10">No admin data found</div>;
  }

  /* ================= UI ================= */

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto bg-blue-100 p-8 rounded">

          <ProfileAvatar firstName={profile.first_name} lastName={profile.last_name} />

        <StepIndicator step={step} onStepClick={setStep} />

        {step === 1 && (
          <div className="bg-gray-50 p-6 rounded space-y-6">

            {/* PERSONAL */}
            <fieldset className="border p-5 bg-blue-50 rounded">
              <legend className="text-sm font-semibold">Personal Details</legend>

              <div className="grid md:grid-cols-3 gap-4">
                <Field label="First Name" value={profile.first_name} onChange={(v) => handleChange("first_name", v)} />
                <Field label="Middle Name" value={profile.middle_name} onChange={(v) => handleChange("middle_name", v)} />
                <Field label="Last Name" value={profile.last_name} onChange={(v) => handleChange("last_name", v)} />
                <Field label="Date of Birth" value={profile.dob} onChange={(v) => handleChange("dob", v)} />
                <Field label="Gender" value={profile.gender} onChange={(v) => handleChange("gender", v)} />
                
              </div>

              <div className="grid md:grid-cols-2 gap-4 mt-4">
              
               
              </div>
            </fieldset>

            {/* ADDRESS */}
            <fieldset className="border p-4 bg-blue-50 rounded">
              <legend className="text-sm font-semibold">Address Details</legend>

              <div className="grid md:grid-cols-2 gap-6">

                <div className="border p-4 bg-lime-50 rounded">
                  <p className="text-sm font-semibold mb-2">Permanent Address</p>

                  <AddressFields state={permanentAddress} handler={handlePermanentChange} />
                </div>

                <div className="border p-4 bg-lime-50 rounded">
                  <div className="flex justify-between mb-2">
                    <p className="text-sm font-semibold">Current Address</p>

                    <label className="text-xs flex items-center gap-2">
                      <input type="checkbox" checked={sameAddress} onChange={handleSameAddress} />
                      Same as Permanent
                    </label>
                  </div>

                  <AddressFields
                    state={currentAddress}
                    handler={handleCurrentChange}
                    disabled={sameAddress}
                  />
                </div>

              </div>
            </fieldset>

          </div>
        )}


        {step === 2 && (
          <div className="bg-gray-50 p-6 rounded space-y-6">

            {/* PERSONAL */}
            <fieldset className="border p-5 bg-blue-50 rounded">
              <legend className="text-sm font-semibold">Professional Details</legend>

              <div className="grid md:grid-cols-3 gap-4">
                <Field label="Department" value={profile.department_id} onChange={(v) => handleChange("department_id", v)} />
                <Field label="Created On" value={profile.created_on} onChange={(v) => handleChange("created_on", v)} />
                <Field label="Created By" value={profile.created_by} onChange={(v) => handleChange("created_by", v)} />
                <Field label="E-mail" value={profile.email} onChange={(v) => handleChange("email", v)} /> 
                <Field label="Phone" value={profile.phone} onChange={(v) => handleChange("phone", v)} />  

              </div>

              <div className="grid md:grid-cols-2 gap-4 mt-4">

              </div>
            </fieldset>

           

              </div>
            
        
        )}




        {/* NAV */}
        <div className="flex justify-between mt-10">

          <button
            onClick={() => setStep((s) => Math.max(1, s - 1))}
            disabled={step === 1}
            className="px-6 py-2 bg-blue-600 text-white rounded disabled:bg-gray-300"
          >
            ← Back
          </button>

          <div className="flex gap-4">
            <button onClick={handleSave} className="px-6 py-2 bg-green-600 text-white rounded">
              Save
            </button>

            {step === 1 && (
              <button onClick={() => setStep(2)} className="px-6 py-2 bg-blue-600 text-white rounded">
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

/* ================= COMPONENTS ================= */

const Field = ({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) => (
  <div>
    <label className="text-sm">{label}</label>
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full border p-2 rounded"
    />
  </div>
);

const AddressFields = ({
  state,
  handler,
  disabled = false,
}: {
  state: AddressType;
  handler: (key: keyof AddressType, value: string) => void;
  disabled?: boolean;
}) => (
  <div className="space-y-3">
    <input placeholder="Address Line 1" value={state.address_line1} onChange={(e) => handler("address_line1", e.target.value)} disabled={disabled} className="w-full border p-2 rounded" />
    <input placeholder="Address Line 2" value={state.address_line2} onChange={(e) => handler("address_line2", e.target.value)} disabled={disabled} className="w-full border p-2 rounded" />
    <input placeholder="City" value={state.city} onChange={(e) => handler("city", e.target.value)} disabled={disabled} className="w-full border p-2 rounded" />
    <input placeholder="State" value={state.state} onChange={(e) => handler("state", e.target.value)} disabled={disabled} className="w-full border p-2 rounded" />
    <input placeholder="Pincode" value={state.pincode} onChange={(e) => handler("pincode", e.target.value)} disabled={disabled} className="w-full border p-2 rounded" />
  </div>
);

const ProfileAvatar = ({ firstName, lastName }: { firstName: string; lastName: string }) => {
  const initials = (firstName?.[0] || "") + (lastName?.[0] || "");
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
    { id: 2, label: "Professional Details" },
  ];

  return (
    <div className="mb-10 w-full px-10">
      <div className="flex items-center w-full">
        {steps.map((s, index) => (
          <React.Fragment key={s.id}>
            <div className="flex flex-col items-center">
              <div
                onClick={() => onStepClick(s.id)}
                className={`w-10 h-10 rounded-full flex items-center justify-center cursor-pointer ${
                  step >= s.id ? "bg-blue-600 text-white" : "bg-gray-300"
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