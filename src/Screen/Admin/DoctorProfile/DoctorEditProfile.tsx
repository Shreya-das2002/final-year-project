import React, { useState } from "react";
import { useLocation, useParams } from "react-router-dom";

import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";

import { saveDoctorProfileApi } from "../../../services/doctorProfileApi";

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

interface Experience {
  organization: string;
  startDate: string;
  endDate: string;
  designation: string;
  responsibilities: string;
}

/* ================= COMPONENT ================= */

const DoctorEditProfile: React.FC = () => {
  const { doctor_id } = useParams();
  const location = useLocation();
  const doctor = location.state;

  const [step, setStep] = useState<number>(1);
  const [sameAddress, setSameAddress] = useState<boolean>(false);

  const [profile, setProfile] = useState({
    firstName: doctor?.first_name || "",
    middleName: doctor?.middle_name || "",
    lastName: doctor?.last_name || "",
    gender: doctor?.gender || "",
    dob: "",
    docNumber: doctor?.doctor_no || "",
    license: "",
    registration: "",
    experience: "",
    specialization: doctor?.specialization || "",
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

  const [experiences, setExperiences] = useState<Experience[]>([
    {
      organization: "",
      startDate: "",
      endDate: "",
      designation: "",
      responsibilities: "",
    },
  ]);

  /* ================= HANDLERS ================= */

  const handleProfileChange = (key: string, value: string) => {
    setProfile((prev) => ({ ...prev, [key]: value }));
  };

  const handleCurrentChange = (key: string, value: string) => {
    const updated = { ...currentAddress, [key]: value };
    setCurrentAddress(updated);
    if (sameAddress) setPermanentAddress(updated);
  };

  const handlePermanentChange = (key: string, value: string) => {
    setPermanentAddress((prev) => ({ ...prev, [key]: value }));
  };

  const handleSameAddress = () => {
    const checked = !sameAddress;
    setSameAddress(checked);
    if (checked) setPermanentAddress(currentAddress);
  };

  const handleExpChange = (
    index: number,
    field: keyof Experience,
    value: string
  ) => {
    const updated = [...experiences];
    updated[index][field] = value;
    setExperiences(updated);
  };

  const addExperience = () => {
    setExperiences([
      ...experiences,
      {
        organization: "",
        startDate: "",
        endDate: "",
        designation: "",
        responsibilities: "",
      },
    ]);
  };

  /* ================= SAVE ================= */

  const handleSave = async () => {
    try {
      if (!doctor_id) {
        alert("Doctor ID missing");
        return;
      }

      const payload = {
        dob: profile.dob,
        licence_number: profile.license,
        registration_number: profile.registration,
        experience: profile.experience,
        bio: profile.bio,

        current_address: {
          address_line_1: currentAddress.addressLine1,
          address_line_2: currentAddress.addressLine2,
          city: currentAddress.city,
          district: currentAddress.district,
          state: currentAddress.state,
          country: currentAddress.country,
          pin_code: currentAddress.pincode,
        },

        permanent_address: {
          address_line_1: permanentAddress.addressLine1,
          address_line_2: permanentAddress.addressLine2,
          city: permanentAddress.city,
          district: permanentAddress.district,
          state: permanentAddress.state,
          country: permanentAddress.country,
          pin_code: permanentAddress.pincode,
        },

        experiences: experiences.map((exp) => ({
          organization: exp.organization,
          start_date: exp.startDate,
          end_date: exp.endDate,
          designation: exp.designation,
          responsibilities: exp.responsibilities,
        })),
      };

      const res = await saveDoctorProfileApi(doctor_id, payload);

      if (res.data.success) {
        alert("Profile saved successfully ✅");
      } else {
        alert(res.data.message || "Failed ❌");
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    }
  };

  /* ================= SAFETY ================= */

  if (!doctor) {
    return <div className="p-10">No doctor data found</div>;
  }

  /* ================= UI ================= */
return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto bg-blue-100 p-8 rounded shadow">

        {/* AVATAR */}
        <ProfileAvatar firstName={profile.firstName} lastName={profile.lastName} />

        {/* STEPPER */}
        <StepIndicator step={step} onStepClick={setStep} />

        {/* ================= STEP 1 ================= */}
        {step === 1 && (
          <div className="bg-white p-6 rounded space-y-6">

            {/* PERSONAL */}
            <fieldset className="border p-4">
              <legend className="text-sm font-semibold">Personal Details</legend>

              <div className="grid md:grid-cols-3 gap-4">
                <Field label="First Name" value={profile.firstName} onChange={(v)=>handleProfileChange("firstName",v)} />
                <Field label="Middle Name" value={profile.middleName} onChange={(v)=>handleProfileChange("middleName",v)} />
                <Field label="Last Name" value={profile.lastName} onChange={(v)=>handleProfileChange("lastName",v)} />
              </div>

              <div className="grid md:grid-cols-2 gap-4 mt-4">
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label="Date of Birth"
                    value={profile.dob ? dayjs(profile.dob) : null}
                    onChange={(v: Dayjs | null) =>
                      handleProfileChange("dob", v ? v.format("YYYY-MM-DD") : "")
                    }
                    slotProps={{ textField: { fullWidth: true } }}
                  />
                </LocalizationProvider>

                <Field label="Gender" value={profile.gender} onChange={(v)=>handleProfileChange("gender",v)} />
              </div>
            </fieldset>

            {/* PROFESSIONAL */}
            <fieldset className="border p-4">
              <legend className="text-sm font-semibold">Professional Information</legend>

              <div className="grid md:grid-cols-3 gap-4">
                <Field label="Doctor ID" value={profile.docNumber} onChange={(v)=>handleProfileChange("docNumber",v)} />
                <Field label="Licence Number" value={profile.license} onChange={(v)=>handleProfileChange("license",v)} />
                <Field label="Registration Number" value={profile.registration} onChange={(v)=>handleProfileChange("registration",v)} />
                </div>
              <div className="grid md:grid-cols-2 gap-4">
                <Field label="Experience" value={profile.experience} onChange={(v)=>handleProfileChange("experience",v)} />
                <Field label="Specialization" value={profile.specialization} onChange={(v)=>handleProfileChange("specialization",v)} />
              </div>

              <textarea
                className="w-full mt-4 border p-2"
                placeholder="Bio"
                value={profile.bio}
                onChange={(e)=>handleProfileChange("bio",e.target.value)}
              />
            </fieldset>

            {/* ADDRESS */}
            <fieldset className="border p-4 bg-blue-50">
              <legend className="text-sm font-semibold">Address Details</legend>

              <div className="grid md:grid-cols-2 gap-6">

                {/* CURRENT */}
                <div className="border p-4">
                  <p className="text-sm font-semibold mb-2">Current Address</p>

                  <AddressFields state={currentAddress} handler={handleCurrentChange} />
                </div>

                {/* PERMANENT */}
                <div className="border p-4">
                  <div className="flex justify-between mb-2">
                    <p className="text-sm font-semibold">Permanent Address</p>
                    <label className="text-xs">
                      <input type="checkbox" checked={sameAddress} onChange={handleSameAddress}/> Same as
                    </label>
                  </div>

                  <AddressFields state={permanentAddress} handler={handlePermanentChange} disabled={sameAddress}/>
                </div>

              </div>
            </fieldset>

          </div>
        )}

        {/* ================= STEP 2 ================= */}
        {step === 2 && (
          <div className="bg-white p-6 rounded space-y-6">
            {experiences.map((exp,index)=>(
              <div key={index} className="border p-4">
                <Field label="Organization" value={exp.organization} onChange={(v)=>handleExpChange(index,"organization",v)} />
                <Field label="Start Date" type="date" value={exp.startDate} onChange={(v)=>handleExpChange(index,"startDate",v)} />
                <Field label="End Date" type="date" value={exp.endDate} onChange={(v)=>handleExpChange(index,"endDate",v)} />
                <Field label="Designation" value={exp.designation} onChange={(v)=>handleExpChange(index,"designation",v)} />

                <textarea
                  className="w-full mt-2 border p-2"
                  placeholder= "Responsibilities"
                  value={exp.responsibilities}
                  onChange={(e)=>handleExpChange(index,"responsibilities",e.target.value)}
                />
              </div>
            ))}

            <button onClick={addExperience} className="border px-4 py-2">
              + Add Another
            </button>
          </div>
        )}
{/* ================= NAVIGATION ================= */}
<div className="flex justify-between mt-10">

  {/* BACK BUTTON */}
  <button
    onClick={() => setStep((s) => Math.max(1, s - 1))}
    disabled={step === 1}
    className="px-6 py-2 rounded-md bg-blue-600 text-white disabled:bg-gray-300"
  >
    ← Back
  </button>

  {/* RIGHT SIDE BUTTONS */}
  <div className="flex gap-4">

    {/* SAVE BUTTON (SHOW IN ALL STEPS) */}
    <button
      onClick={handleSave}
      className="px-6 py-2 rounded-md bg-green-600 text-white"
    >
      Save
    </button>

    {/* NEXT BUTTON (ONLY STEP 1) */}
    {step === 1 && (
      <button
        onClick={() => setStep(2)}
        className="px-6 py-2 bg-blue-600 text-white rounded-md"
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

export default DoctorEditProfile;

/* ================= COMPONENTS ================= */

const Field = ({label,value,onChange,type="text"}:{
  label:string; value:string; onChange:(v:string)=>void; type?:string
})=>(
  <div>
    <label className="text-sm">{label}</label>
    <input
      type={type}
      value={value}
      onChange={(e)=>onChange(e.target.value)}
      className="w-full border p-2"
    />
  </div>
);

const AddressFields = ({
  state,
  handler,
}: {
  state: Address;
  handler: (key: keyof Address, value: string) => void;
  disabled?: boolean;
}) => (
  <div className="grid grid-cols-2 gap-2">
    <Field label="Address Line 1" value={state.addressLine1} onChange={(v)=>handler("addressLine1",v)} />
    <Field label="Address Line 2" value={state.addressLine2} onChange={(v)=>handler("addressLine2",v)} />
    <Field label="City" value={state.city} onChange={(v)=>handler("city",v)} />
    <Field label="District" value={state.district} onChange={(v)=>handler("district",v)} />
    <Field label="State" value={state.state} onChange={(v)=>handler("state",v)} />
    <Field label="Country" value={state.country} onChange={(v)=>handler("country",v)} />
    <Field label="PIN Code" value={state.pincode} onChange={(v)=>handler("pincode",v)} />
  </div>
);

const ProfileAvatar = ({firstName,lastName}:{firstName:string;lastName:string})=>{
  const initials = (firstName[0]||"")+(lastName[0]||"");
  return(
    <div className="text-center mb-6">
      <div className="w-24 h-24 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto text-2xl">
        {initials}
      </div>
      <button className="mt-2 border px-4 py-1 rounded">Edit Profile</button>
    </div>
  );
};

/* ================= HELPER COMPONENTS ================= */

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

          {/* STEP */}
          <div className="flex flex-col items-center">
            <div
              onClick={() => onStepClick(s.id)}
              className={`w-10 h-10 rounded-full flex items-center justify-center cursor-pointer
              ${
                step >= s.id
                  ? "bg-blue-600 text-white"
                  : "bg-gray-300 text-gray-700"
              }`}
            >
              {s.id}
            </div>

            <span
              className={`mt-2 text-xs text-center
              ${
                step >= s.id
                  ? "text-blue-600 font-medium"
                  : "text-gray-500"
              }`}
            >
              {s.label}
            </span>
          </div>

          {/* CONNECTOR LINE */}
          {index !== steps.length - 1 && (
            <div
              className={`flex-1 h-[3px] mx-6
              ${
                step > s.id ? "bg-blue-600" : "bg-gray-300"
              }`}
            />
          )}

        </React.Fragment>
      ))}
    </div>
  </div>
);
}