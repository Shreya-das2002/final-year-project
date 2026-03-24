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
import { PencilSquareIcon } from "@heroicons/react/24/solid";
import { FaUserShield } from "react-icons/fa";
import type { AddressPayload } from "../../../services/adminProfileApi";

import {

  genderOption,
  statusOption,

} from "../../../Environment";

/* ================= TYPES ================= */


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


  const [sameAddress, setSameAddress] = useState(false);
  const [loading, setLoading] = useState(false);

  const [profile, setProfile] = useState({
    first_name: admin?.first_name || "",
    middle_name: admin?.middle_name || "",
    last_name: admin?.last_name || "",
    dob: admin?.dob || "",
    gender: admin?.gender || "",
    email: admin?.email || "",
    department_id: admin?.department || "",
    created_on: admin?.created_on || "",
    phone: admin?.phone || "",
    status: admin?.status || "",
    role: admin?.role || "",
  });

  const [permanentAddress, setPermanentAddress] = useState<AddressPayload>({
    address_line_1: "",
    address_line_2: "",
    city: "",
    district: "",
    state: "",
    country: "",
    pin_code: "",

  });

  const [currentAddress, setCurrentAddress] = useState<AddressPayload>({
    address_line_1: "",
    address_line_2: "",
    city: "",
    district: "",
    state: "",
    country: "",
    pin_code: "",
  });


  /* ================= HANDLERS ================= */

  const handleChange = (key: string, value: string) => {
    setProfile((prev) => ({ ...prev, [key]: value }));
  };

  const handlePermanentChange = (key: keyof AddressPayload, value: string) => {
    const updated = { ...permanentAddress, [key]: value };
    setPermanentAddress(updated);

    if (sameAddress) {
      setCurrentAddress(updated);
    }
  };

  const handleCurrentChange = (key: keyof AddressPayload, value: string) => {
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
      <div className="max-w-6xl mx-auto bg-blue-100 p-8 rounded-3xl pl-1 pr-1">

          
          <ProfileAvatar firstName={profile.first_name} lastName={profile.last_name} />
                    {/* Role Chip */}
          <div className="mt-4 flex justify-center">

            <span className="
              px-4 py-2 mb-3
              bg-cyan-600 dark:bg-gray-500
              rounded-full
              shadow
              flex items-center gap-2
              text-gray-200 dark:text-gray-200
            ">
              <FaUserShield />
              {profile.role}
             
            </span>
            </div>
          

          <div className="bg-gray-50 p-6 rounded-3xl space-y-6">

            {/* PERSONAL */}
            <fieldset className="border p-5 bg-blue-50 rounded-sm">
              <legend className="text-sm font-semibold px-2">Personal Details</legend>

              <div className="grid md:grid-cols-3 gap-4">
                
                <Field label="First Name" value={profile.first_name} onChange={(v) => handleChange("first_name", v)} disabled={!isSuperAdmin} />
                <Field label="Middle Name" value={profile.middle_name} onChange={(v) => handleChange("middle_name", v)} disabled={!isSuperAdmin} />
                <Field label="Last Name" value={profile.last_name} onChange={(v) => handleChange("last_name", v)} disabled={!isSuperAdmin} />
                  </div>
                  <div className="grid md:grid-cols-2 gap-4 pt-5 ">
            
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                                  <DatePicker
                                    label="Date of Birth"
                                    value={profile.dob ? dayjs(profile.dob) : null}
                                    onChange={(v: Dayjs | null) =>
                                      handleChange("dob", v ? v.format("YYYY-MM-DD") : "")                        
                                    }
                                   
                                    className="rounded-2xl"
                                    
                                    slotProps={{
                                      textField: {
                                        fullWidth: true,
                                        size: "small",
                                      },
                                    }}
                                  />
                                </LocalizationProvider>

                          <select
                            name="gender"
                            value={profile.gender}
                            onChange={(e) => handleChange("gender", e.target.value)}
                            className="border p-2 rounded-sm"
                            disabled={!isSuperAdmin}
                            
                          >
                            <option className=" bg-white dark:bg-black text-black dark:text-white" value="">Select Gender</option>
                
                            {genderOption.map((g) => (
                
                              <option key={g.value} value={g.value} className=" bg-white dark:bg-black text-black dark:text-white">
                                {g.label}
                              </option>
                
                            ))}
                
                          </select>
                
              </div>


            </fieldset>

                    {/* PROFESSIONAL */}
            <fieldset className="border p-5 bg-blue-50 rounded-sm">
              <legend className="text-sm font-semibold px-2">Professional Details</legend>

              <div className="grid md:grid-cols-2 gap-4 ">

                <Field label="E-mail" value={profile.email} onChange={(v) => handleChange("email", v)}disabled={!isSuperAdmin} /> 
                <Field label="Phone" value={profile.phone} onChange={(v) => handleChange("phone", v)}disabled={!isSuperAdmin} />

                  </div>
                  <div className="grid md:grid-cols-2 gap-4">

            {admin?.role === "standard admin" && (
  <Field
    label="Department"
    value={profile.department_id}
    onChange={(v) => handleChange("department_id", v)}
    disabled={!isSuperAdmin}
  />
)}

                          <select
                            name="Status"
                            value={profile.status}
                            onChange={(e) => handleChange("status", e.target.value)}
                            className="border p-2 mt-6 my-3 rounded-sm"
                            
                          >
                            <option className=" bg-white dark:bg-black text-black dark:text-white" value="">Status</option>
                
                            {statusOption.map((g) => (
                
                              <option key={g.value} value={g.value} className=" bg-white dark:bg-black text-black dark:text-white">
                                {g.label}
                              </option>
                
                            ))}
                
                          </select>  

              </div>

              <div className="grid md:grid-cols-2 gap-4 mt-4">

              </div>
            </fieldset>

            {/* ADDRESS */}
            <fieldset className="border p-4 bg-blue-50 rounded-sm">
              <legend className="text-sm px-2 font-semibold">Address Details</legend>

              <div className="grid md:grid-cols-2 gap-6">

                <fieldset className="border p-4 bg-blue-50 rounded-sm">
                  <legend className="text-sm p-2 font-semibold mb-6">Permanent Address</legend>

                  <AddressFields state={permanentAddress} handler={handlePermanentChange} />
                </fieldset>

                <fieldset className="border p-4 bg-blue-50 rounded-sm">
                  
                  
                    <legend className="text-sm p-2 font-semibold ">Current Address</legend>

                       <label className="text-xs flex items-center ml-90 mb-2 gap-2">
                      <input type="checkbox" checked={sameAddress} onChange={handleSameAddress} />
                      Same as Permanent
                    </label>


                  

                  <AddressFields
                    state={currentAddress}
                    handler={handleCurrentChange}
                    disabled={sameAddress}
                  />
                </fieldset>

              </div>
            </fieldset>


          </div>



        {/* NAV */}
        <div className="flex justify-between mt-10">



          <div className="flex gap-4">
            <button
          onClick={handleSave}
        disabled={loading}
        className="px-6 py-2 w-37 ml-242 rounded-3xl bg-cyan-600 text-white hover:bg-cyan-800 disabled:bg-gray-400"
        >
  {loading ? "Saving..." : "Save Changes"}
</button>

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
    <label className="text-sm pl-1">{label}</label>
    <input
      type={type}
      value={value || ""}
      disabled={disabled}  
      onChange={(e) => onChange(e.target.value)}
      className={`w-full border p-2 ${
        disabled ? "bg-gray-100 cursor-not-allowed rounded-sm" : "rounded-sm "
      }`}
    />
  </div>
);
const AddressFields = ({
  state,
  handler,
  disabled = false,
}: {
  state: AddressPayload;
  handler: (key: keyof AddressPayload, value: string) => void;
  disabled?: boolean;
}) => (
  <div className="space-y-3">
    <input placeholder="Address Line 1" value={state.address_line_1} onChange={(e) => handler("address_line_1", e.target.value)} disabled={disabled} className="w-full border p-2 rounded" />
    <input placeholder="Address Line 2" value={state.address_line_2} onChange={(e) => handler("address_line_2", e.target.value)} disabled={disabled} className="w-full border p-2 rounded" />
    <input placeholder="City" value={state.city} onChange={(e) => handler("city", e.target.value)} disabled={disabled} className="w-full border p-2 rounded" />
    <input placeholder="District" value={state.district} onChange={(e) => handler("district", e.target.value)} disabled={disabled} className="w-full border p-2 rounded" />
    <input placeholder="State" value={state.state} onChange={(e) => handler("state", e.target.value)} disabled={disabled} className="w-full border p-2 rounded" />
    <input placeholder="Country" value={state.country} onChange={(e) => handler("country", e.target.value)} disabled={disabled} className="w-full border p-2 rounded" />
    <input placeholder="Pincode" value={state.pin_code} onChange={(e) => handler("pin_code", e.target.value)} disabled={disabled} className="w-full border p-2 rounded" />
  </div>
);

const ProfileAvatar = ({firstName,lastName}:{firstName:string;lastName:string})=>{
  const initials = (firstName[0]||"")+(lastName[0]||"");
  return(
    <div className="flex flex-col items-center">

  {/* Avatar Container */}
  <div className="relative">

    {/* Avatar */}
    <div
      className="
        w-24 h-24
        rounded-full
        bg-cyan-600 dark:bg-gray-500
        flex items-center justify-center
        text-white text-2xl font-semibold
        border-2 border-cyan-100 dark:border-cyan-800
        shadow-lg
      "
    >
      {initials}
    </div>

    {/* Edit Icon (overlay) */}
    <button
      className="
        absolute bottom-0 right-0
        p-2
        rounded-full
        bg-white/80 backdrop-blur-md
        shadow-md
        hover:bg-cyan-100
        transition
      "
    >
      <PencilSquareIcon className="w-4 h-4 text-gray-600" />
    </button>

  </div>



</div>
  );
};
  