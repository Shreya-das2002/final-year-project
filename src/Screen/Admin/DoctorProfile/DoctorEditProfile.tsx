import React, { useState, useEffect } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import type { Address } from "../../../services/doctorApi";
import type { Experience } from "../../../services/doctorApi";
import { saveDoctorProfileApi } from "../../../services/doctorProfileApi";
import type {
  DoctorProfilePayload,

} from "../../../services/doctorProfileApi";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../../../../store/store";
import  { fetchDoctorListThunk } from "../../../../store/slices/doctorSlice";
import type { AppDispatch } from "../../../../store/store";

/* ================= TYPES ================= */



/* ================= COMPONENT ================= */

const DoctorEditProfile: React.FC = () => {
  const { doctorId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>()

const doctorFromState = location.state;

const doctorFromStore = useSelector(
  (state: RootState) => state.doctor.selectedDoctor
);

const doctorFromStorage = localStorage.getItem("selectedDoctor");

const doctor =
  doctorFromState ||
  doctorFromStore ||
  (doctorFromStorage ? JSON.parse(doctorFromStorage) : null);
  const finalDoctorId = doctorId || doctor?.doctor_id;

  const [step, setStep] = useState<number>(1);
  const [sameAddress, setSameAddress] = useState<boolean>(false);

useEffect(() => {
  dispatch(fetchDoctorListThunk());
}, [dispatch]);

  const [profile, setProfile] = useState({
    firstName: doctor?.first_name || "",
    middleName: doctor?.middle_name || "",
    lastName: doctor?.last_name || "",
    gender: doctor?.gender || "",
    dob: doctor?.dob ||"",
    docNumber: doctor?.doctor_no || "",
    license: doctor?.licence_number ||"",
    registration: doctor?.registration_number ||"",
    experience: doctor?.experience ||"",
    specialization: doctor?.specialization || "",
    bio: doctor?.bio || "",
  });

  const [currentAddress, setCurrentAddress] = useState<Address>({
    address_line_1: doctor?.doctor_address?.current_address?.address_line_1 || "",
    address_line_2: doctor?.doctor_address?.current_address?.address_line_2 || "",
    city:  doctor?.doctor_address?.current_address?.city || "",
    district:  doctor?.doctor_address?.current_address?.district || "",
    state:  doctor?.doctor_address?.current_address?.state || "",
    country:  doctor?.doctor_address?.current_address?.country || "",
    pin:  doctor?.doctor_address?.current_address?.pin || "",
  });

  const [permanentAddress, setPermanentAddress] = useState<Address>({
    address_line_1:  doctor?.doctor_address?.permanent_address?.address_line_1 || "",
    address_line_2:  doctor?.doctor_address?.permanent_address?.address_line_2 || "",
    city:  doctor?.doctor_address?.permanent_address?.city || "",
    district:  doctor?.doctor_address?.permanent_address?.district || "",
    state:  doctor?.doctor_address?.permanent_address?.state || "",
    country:  doctor?.doctor_address?.permanent_address?.country || "",
    pin:  doctor?.doctor_address?.permanent_address?.pin || "",
  });

  const [experiences, setExperiences] = useState<Experience[]>([
    {
      organization_name:  doctor?.doctor_experiences?.[0]?.organization_name || "",
      start_date:  doctor?.doctor_experiences?.[0]?.start_date || "",
      end_date:  doctor?.doctor_experiences?.[0]?.end_date || "",
      designation:  doctor?.doctor_experiences?.[0]?.designation || "",
      responsibilities:  doctor?.doctor_experiences?.[0]?.responsibilities || "",
    },
  ]);

  

  /* ================= HANDLERS ================= */

  const handleProfileChange = (key: string, value: string) => {
    setProfile((prev) => ({ ...prev, [key]: value }));
  };

  const handlePermanentChange = (key: string, value: string) => {
    const updated = { ...permanentAddress, [key]: value };
    setPermanentAddress(updated);
    if (sameAddress) setCurrentAddress(updated);
  };

  const handleCurrentChange = (key: string, value: string) => {
    setCurrentAddress((prev) => ({ ...prev, [key]: value }));
  };

  const handleSameAddress = () => {
    const checked = !sameAddress;
    setSameAddress(checked);
    if (checked) setCurrentAddress(permanentAddress);
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
        organization_name: "",
        start_date: "",
        end_date: "",
        designation: "",
        responsibilities: "",
      },
    ]);
  };

  /* ================= SAVE ================= */

  const handleSave = async () => {
  try {
if (!doctor) {
  return <div className="p-10">Loading doctor...</div>;
    }

    let payload: DoctorProfilePayload = {};

    /* ================= STEP 1 SAVE ================= */
    if (step === 1) {
      payload = {
        dob: profile.dob,
        licence_number: profile.license,
        registration_number: profile.registration,
        experience: profile.experience,
        bio: profile.bio,

        current_address: {
          address_line_1: doctor?.doctor_address?.current_address.address_line_1 || "",
          address_line_2: doctor?.doctor_address?.current_address.address_line_2 || "",
          city: doctor?.doctor_address?.current_address.city || "",
          district: doctor?.doctor_address?.current_address.district || "",
          state: doctor?.doctor_address?.current_address.state || "",
          country: doctor?.doctor_address?.current_address.country || "",
          pin_code: doctor?.doctor_address?.current_address.pin || "",
        },

        permanent_address: {
          address_line_1: doctor?.doctor_address?.permanent_address.address_line_1 || "",
          address_line_2: doctor?.doctor_address?.permanent_address.address_line_2 || "",
          city: doctor?.doctor_address?.permanent_address.city || "",
          district: doctor?.doctor_address?.permanent_address.district || "",
          state: doctor?.doctor_address?.permanent_address.state || "",
          country: doctor?.doctor_address?.permanent_address.country || "",
          pin_code: doctor?.doctor_address?.permanent_address.pin || "",
        },
      };
    }

    /* ================= STEP 2 SAVE ================= */
if (step === 2) {
  payload = {
    ...payload,

    experiences: doctor.doctor_experiences?.map((exp: Experience
    ) => ({
      organization_name: exp.organization_name || "",
      start_date: exp.start_date || "",
      end_date: exp.end_date || "",
      designation: exp.designation || "",
      responsibilities: exp.responsibilities || "",
    })) || [],
  };
}

    const res = await saveDoctorProfileApi(finalDoctorId, payload);

    if (res.data.success) {
      if(step === 2){
        toast( "Doctor profile update successfully ");
        navigate("/admin/doctor_list");
      }
      
    } else {
      toast(res.data.message || "Failed");
    }

  } catch (error) {
    console.error(error);
    toast("Something went wrong");
  }
};

  /* ================= SAFETY ================= */

 if (!doctor) {
  toast("Doctor data not found");
  return;
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
          <div className="bg-gray-50 p-6 rounded space-y-6">

            {/* PERSONAL */}
          <fieldset className="border p-5 bg-blue-50 rounded">
                <legend className="px-2 text-sm font-semibold">
                        Personal Details
                </legend>
              <div className="grid md:grid-cols-3 gap-4">
                <Field label="First Name" value={profile.firstName} onChange={(v)=>handleProfileChange("firstName",v)} disabled />
                <Field label="Middle Name" value={profile.middleName} onChange={(v)=>handleProfileChange("middleName",v)} disabled />
                <Field label="Last Name" value={profile.lastName} onChange={(v)=>handleProfileChange("lastName",v)} disabled />
              </div>

              <div className="grid md:grid-cols-2 gap-4 mt-4 items-end">
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label="Date of Birth"
                    value={profile.dob ? dayjs(profile.dob) : null}
                    onChange={(v: Dayjs | null) =>
                      handleProfileChange("dob", v ? v.format("YYYY-MM-DD") : "")
                    }
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        size: "small",
                      },
                    }}
                  />
                </LocalizationProvider>

                <Field label="Gender" value={profile.gender} onChange={(v)=>handleProfileChange("gender",v)} disabled />
              </div>
            </fieldset>

            {/* PROFESSIONAL */}
            <fieldset className="border p-5 bg-blue-50 rounded">
              <legend className="px-2 text-sm font-semibold">Professional Information</legend>

              <div className="grid md:grid-cols-3 gap-4">
                <Field label="Doctor ID" value={profile.docNumber} onChange={(v)=>handleProfileChange("docNumber",v)} disabled />
                <Field label="Licence Number" value={profile.license} onChange={(v)=>handleProfileChange("license",v)}  />
                <Field label="Registration Number" value={profile.registration} onChange={(v)=>handleProfileChange("registration",v)} />
                </div>
              <div className="grid md:grid-cols-2 gap-4">
                <Field label="Experience" value={profile.experience} onChange={(v)=>handleProfileChange("experience",v)} />
                <Field label="Specialization" value={profile.specialization} onChange={(v)=>handleProfileChange("specialization",v)} disabled />
              </div>

              <textarea
                className="w-full mt-4 border p-2"
                placeholder="Bio"
                value={profile.bio}
                onChange={(e)=>handleProfileChange("bio",e.target.value)}
              />
            </fieldset>

            {/* ADDRESS */}
            <fieldset className="border p-4 bg-blue-50 rounded">
              <legend className="px-2 text-sm font-semibold">Address Details</legend>

              <div className="grid md:grid-cols-2 gap-6">

                {/* PERMANENT */}
                <div className="border p-4 bg-lime-50 rounded">
                  <p className="text-sm font-semibold mb-2">Permanent Address</p>

                  <AddressFields state={permanentAddress} handler={handlePermanentChange} />
                </div>

                {/* CURRENT */}
                <div className="border p-4 bg-lime-50 rounded">
                  <div className="flex justify-between mb-2">
                    <p className="text-sm font-semibold">Current Address</p>
                    <label className="text-xs">
                      <input type="checkbox" checked={sameAddress} onChange={handleSameAddress}/> Same as
                    </label>
                  </div>

                  <AddressFields state={currentAddress} handler={handleCurrentChange} disabled={sameAddress}/>
                </div>

              </div>
            </fieldset>

          </div>
        )}

        {/* ================= STEP 2 ================= */}
        {step === 2 && (
          <div className="bg-gray-50 p-6 rounded space-y-6">
            {experiences.map((exp,index)=>(
              <div key={index} className="border p-4 bg-blue-50 rounded">
                <Field label="Organization" value={exp.organization_name} onChange={(v)=>handleExpChange(index,"organization_name",v)} />
                <Field label="Start Date" type="date" value={exp.start_date} onChange={(v)=>handleExpChange(index,"start_date",v)} />
                <Field label="End Date" type="date" value={exp.end_date} onChange={(v)=>handleExpChange(index,"end_date",v)} />
                <Field label="Designation" value={exp.designation} onChange={(v)=>handleExpChange(index,"designation",v)} />

                <textarea
                  className="w-full mt-2 border p-2"
                  placeholder= "Responsibilities"
                  value={exp.responsibilities || ""}
                  onChange={(e)=>handleExpChange(index,"responsibilities",e.target.value)}
                />
              </div>
            ))}

            <button onClick={addExperience} className="border px-4 py-2 bg-lime-100 rounded">
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

const Field = ({
  label,
  value,
  onChange,
  type = "text",
  disabled = false, 
}: {
  label: string;
  value:  string | null;
  onChange: (v: string) => void;
  type?: string;
  disabled?: boolean; 
}) => (
  <div>
    <label className="text-sm">{label}</label>
    <input
      type={type}
      value={value || ""}
      disabled={disabled}  
      onChange={(e) => onChange(e.target.value)}
      className={`w-full border p-2 ${
        disabled ? "bg-gray-100 cursor-not-allowed" : ""
      }`}
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
    <Field label="Address Line 1" value={state.address_line_1} onChange={(v)=>handler("address_line_1",v)} />
    <Field label="Address Line 2" value={state.address_line_2} onChange={(v)=>handler("address_line_2",v)} />
    <Field label="City" value={state.city} onChange={(v)=>handler("city",v)} />
    <Field label="District" value={state.district} onChange={(v)=>handler("district",v)} />
    <Field label="State" value={state.state} onChange={(v)=>handler("state",v)} />
    <Field label="Country" value={state.country} onChange={(v)=>handler("country",v)} />
    <Field label="PIN Code" value={state.pin} onChange={(v)=>handler("pin",v)} />
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