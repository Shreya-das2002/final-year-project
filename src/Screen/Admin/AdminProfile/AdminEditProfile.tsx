import React, { useState, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";

import type { RootState, AppDispatch } from "../../../../store/store";
import { fetchAllAdmins } from "../../../../store/slices/adminSlice";
import { saveAdminProfileApi } from "../../../services/adminProfileApi";
import { toast } from "react-hot-toast";

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

    const isSuperAdmin = admin?.role === "super admin";

  /* ================= STATE ================= */

  const [step, setStep] = useState(1);
  const [sameAddress, setSameAddress] = useState(false);
  const [loading, setLoading] = useState(false);

  const [profile, setProfile] = useState({
    first_name: admin?.first_name || "",
    middle_name: admin?.middle_name || "",
    last_name: admin?.last_name || "",
    dob: admin?.dob || "",
    gender: "",
    email: "",
    department_id: "",
    created_on: "",
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

  
const handleSave = async () => {
  try {
    if (!id) {
      toast.error("Admin ID missing");
      return;
    }

    setLoading(true);

    const finalData = {
      dob: profile.dob,
      current_address: currentAddress,
      permanent_address: permanentAddress,
    };

    console.log("Sending:", finalData);

    const res = await saveAdminProfileApi(id, finalData);

    if (res?.data?.success) {
      toast.success(res.data.message || "Profile saved");
    } else {
      toast.error(res?.data?.message || "Failed");
    }

  } catch (error) {
    console.error(error);
    toast.error("Server error");
  } finally {
    setLoading(false);
  }
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


          <div className="bg-gray-50 p-6 rounded space-y-6">

            {/* PERSONAL */}
            <fieldset className="border p-5 bg-blue-50 rounded">
              <legend className="text-sm font-semibold">Personal Details</legend>

              <div className="grid md:grid-cols-3 gap-4">
                
                <Field label="First Name" value={profile.first_name} onChange={(v) => handleChange("first_name", v)} disabled={!isSuperAdmin} />
                <Field label="Middle Name" value={profile.middle_name} onChange={(v) => handleChange("middle_name", v)} />
                <Field label="Last Name" value={profile.last_name} onChange={(v) => handleChange("last_name", v)} />
            
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                                  <DatePicker
                                    label="Date of Birth"
                                    value={profile.dob ? dayjs(profile.dob) : null}
                                    onChange={(v: Dayjs | null) =>
                                      handleChange("dob", v ? v.format("YYYY-MM-DD") : "")
                                    }
                                    slotProps={{
                                      textField: {
                                        fullWidth: true,
                                        size: "small",
                                      },
                                    }}
                                  />
                                </LocalizationProvider>

                <Field label="Gender" value={profile.gender} onChange={(v) => handleChange("gender", v)} />
                
              </div>

              <div className="grid md:grid-cols-2 gap-4 mt-4">
              
          
              </div>
            </fieldset>

                    {/* PERSONAL */}
            <fieldset className="border p-5 bg-blue-50 rounded">
              <legend className="text-sm font-semibold">Professional Details</legend>

              <div className="grid md:grid-cols-3 gap-4">
                {admin?.role === "standard admin" && (
  <Field
    label="Department"
    value={profile.department_id}
    onChange={(v) => handleChange("department_id", v)}
  />
)}
                <Field label="E-mail" value={profile.email} onChange={(v) => handleChange("email", v)} /> 
                <Field label="Phone" value={profile.phone} onChange={(v) => handleChange("phone", v)} />  

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
            <button
          onClick={handleSave}
        disabled={loading}
        className="px-6 py-2 bg-green-600 text-white rounded disabled:bg-gray-400"
        >
  {loading ? "Saving..." : "Save"}
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
  