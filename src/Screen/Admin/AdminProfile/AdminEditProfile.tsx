import React, { useEffect } from "react";
import {
  FaPhoneAlt,
  FaUser,
  FaBirthdayCake,
  FaBriefcase,
  FaEdit,
} from "react-icons/fa";

import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import type { RootState, AppDispatch } from "../../../../store/store";
import { fetchAllAdmins } from "../../../../store/slices/adminSlice";

<<<<<<< HEAD
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
=======
const AdminProfileView: React.FC = () => {
>>>>>>> 990ba967761a019aff75f41744d9d7b27e6da0c3
  const dispatch = useDispatch<AppDispatch>();
  const { id } = useParams();

<<<<<<< HEAD
  /* ================= DATA ================= */

  const adminFromState = location.state;

  const adminFromStore = useSelector(
    (state: RootState) => state.admin.admins
  );

  const adminFromStorage = localStorage.getItem("selectedAdmin");

=======
  const { admins, loading } = useSelector(
    (state: RootState) => state.admin
  );

>>>>>>> 990ba967761a019aff75f41744d9d7b27e6da0c3
  useEffect(() => {
    dispatch(fetchAllAdmins());
  }, [dispatch]);

<<<<<<< HEAD
  const admin =
    adminFromState ||
    adminFromStore.find((a) => a.admin_user_id === Number(id)) ||
    (adminFromStorage ? JSON.parse(adminFromStorage) : null);

  /* ================= STATE ================= */

  const [step, setStep] = useState(1);
  const [sameAddress, setSameAddress] = useState(false);

  const [profile, setProfile] = useState({
    first_name: "",
    middle_name: "",
    last_name: "",
    role: "",
    email: "",
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
=======
  const admin = admins.find(
    (a) => a.admin_user_id === Number(id)
  );

  const getInitials = () => {
    if (!admin) return "";
    return `${admin.first_name?.[0] || ""}${admin.last_name?.[0] || ""}`;
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (!admin) return <p className="text-center mt-10">Admin Not Found</p>;
>>>>>>> 990ba967761a019aff75f41744d9d7b27e6da0c3

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center p-6">
      <div className="w-full max-w-5xl">

<<<<<<< HEAD
        <ProfileAvatar
          firstName={profile.first_name}
          lastName={profile.last_name}
        />

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
              </div>

              <div className="grid md:grid-cols-2 gap-4 mt-4">
                <Field label="Email" value={profile.email} onChange={(v) => handleChange("email", v)} />
                <Field label="Role" value={profile.role} onChange={(v) => handleChange("role", v)} />
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

=======
        {/* HEADER CARD */}
        <div className="bg-blue-200 rounded-xl p-10 text-center">

          <div className="w-24 h-24 mx-auto rounded-full bg-blue-600 text-white flex items-center justify-center text-3xl font-bold">
            {getInitials()}
          </div>

          <h2 className="mt-4 text-2xl font-semibold">
            {admin.first_name} {admin.last_name}
          </h2>

          <p className="text-gray-600">{admin.email}</p>

          {/* INFO PILLS */}
          <div className="flex flex-wrap justify-center gap-4 mt-6">

            <div className="pill flex items-center gap-2">
              <FaPhoneAlt /> 
            </div>

            <div className="pill flex items-center gap-2">
              <FaUser /> {admin.role}
            </div>

            <div className="pill flex items-center gap-2">
              <FaBirthdayCake /> 
            </div>

            <div className="pill flex items-center gap-2">
              <FaBriefcase /> Admin
            </div>

        {/* DETAILS */}
        <div className="grid md:grid-cols-2 gap-6 mt-6">

          <div className="bg-white rounded-xl p-6">
            <h3 className="text-blue-600 font-semibold mb-3">
              Professional Details
            </h3>

            <p><strong>Role:</strong> {admin.role}</p>
            <p><strong>Admin ID:</strong> {admin.admin_user_id}</p>
          </div>

          <div className="bg-white rounded-xl p-6">
            <h3 className="text-purple-600 font-semibold mb-3">
              About Admin
            </h3>

            <p>System administrator of platform</p>
          </div>

        </div>

        {/* DELETE BUTTON */}
        <div className="w-full flex justify-end mt-6">
          {admin?.role !== "super_admin" && (
            <button className="px-6 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700">
              Delete Account
            </button>
          )}
>>>>>>> 990ba967761a019aff75f41744d9d7b27e6da0c3
        </div>

      </div>
    </div>
  );
};

<<<<<<< HEAD
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
=======
export default AdminProfileView;
>>>>>>> 990ba967761a019aff75f41744d9d7b27e6da0c3
