import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import {
  FaEdit,
  FaUserCircle,
  FaMapMarkerAlt,
  FaHome,
  FaStethoscope,
} from "react-icons/fa";

import {
  MdEmail,
  MdPhone,
  MdCake,
  MdWork,
} from "react-icons/md";

import { GiMedicalPack } from "react-icons/gi";

import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../../../../store/store";
import { setSelectedDoctor } from "../../../../store/slices/doctorSlice";

const DoctorViewProfile: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const doctorFromState = location.state;

  const doctorFromStore = useSelector(
    (state: RootState) => state.doctor.selectedDoctor
  );

  
  const buttons = useSelector(
    (state: RootState) => state.auth.buttons
  );

  const canEditProfile = buttons?.some(
    (btn) => btn.control_key === "edit doc profile"
  );

    const canDeleteProfile = buttons?.some(
    (btn) => btn.control_key === "delete doc account"
  );

  
  const doctorFromStorage = localStorage.getItem("selectedDoctor");

  const doctor =
    doctorFromState ||
    doctorFromStore ||
    (doctorFromStorage ? JSON.parse(doctorFromStorage) : null);

  useEffect(() => {
    if (doctorFromState) {
      dispatch(setSelectedDoctor(doctorFromState));
      localStorage.setItem("selectedDoctor", JSON.stringify(doctorFromState));
    } else if (!doctorFromStore && doctorFromStorage) {
      dispatch(setSelectedDoctor(JSON.parse(doctorFromStorage)));
    }
  }, [doctorFromState, doctorFromStore, doctorFromStorage, dispatch]);

  if (!doctor) {
    return <div className="p-10">No doctor data found</div>;
  }

  const dob = doctor.dob || null;

  const initials =
    doctor.first_name?.charAt(0)?.toUpperCase() +
    doctor.last_name?.charAt(0)?.toUpperCase();

  const fullName = `${doctor.first_name} ${doctor.middle_name || ""} ${doctor.last_name}`.trim();

  const image = localStorage.getItem("profileImage");

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* HEADER CARD */}
        <div className="bg-gradient-to-r from-indigo-500 via-blue-500 to-cyan-500 text-white rounded-2xl p-6 shadow-lg flex flex-col md:flex-row md:items-center md:justify-between">

          {/* LEFT */}
          <div className="flex items-center gap-4">
            <div className="relative w-20 h-20">
              
              {/* AVATAR */}
              <div className="w-full h-full rounded-xl bg-white/20 flex items-center justify-center text-2xl font-bold overflow-hidden">
                {image ? (
                  <img src={image} className="w-full h-full object-cover rounded-xl" />
                ) : (
                  initials
                )}
              </div>

              {/* STETHOSCOPE ICON */}
              <div className="absolute -bottom-1 -right-1 bg-green-500/80 p-2 rounded-lg shadow-md">
                <FaStethoscope className="text-white text-sm" />
              </div>

            </div>

            <div>
              <p className="text-xs bg-white/20 px-3 py-1 rounded-full inline-block mb-1">
                {doctor.specialization || "Specialist"}
              </p>

              <h2 className="text-xl font-semibold">
                Dr. {fullName}
              </h2>

              <p className="text-sm opacity-90 flex items-center gap-2">
                <MdEmail /> {doctor.email}
              </p>
            </div>
          </div>

          {/* RIGHT INFO CHIPS */}
          <div className="flex flex-wrap gap-4 mt-4 md:mt-0">

            {/* PHONE */}
            <div className="flex flex-col items-center justify-center px-6 py-3 rounded-xl 
              bg-white/10 backdrop-blur-md border border-white/20 shadow-md min-w-[130px]">
              <MdPhone className="text-white text-lg mb-1 opacity-80" />
              <span className="text-[10px] uppercase tracking-wide opacity-70">
                Phone
              </span>
              <span className="text-sm font-semibold">
                {doctor.phone_no || "—"}
              </span>
            </div>

            {/* GENDER */}
            <div className="flex flex-col items-center justify-center px-6 py-3 rounded-xl 
              bg-white/10 backdrop-blur-md border border-white/20 shadow-md min-w-[130px]">
              <FaUserCircle className="text-white text-lg mb-1 opacity-80" />
              <span className="text-[10px] uppercase tracking-wide opacity-70">
                Gender
              </span>
              <span className="text-sm font-semibold">
                {doctor.gender || "—"}
              </span>
            </div>

            {/* DOB */}
            <div className="flex flex-col items-center justify-center px-6 py-3 rounded-xl 
              bg-white/10 backdrop-blur-md border border-white/20 shadow-md min-w-[130px]">
              <MdCake className="text-white text-lg mb-1 opacity-80" />
              <span className="text-[10px] uppercase tracking-wide opacity-70">
                DOB
              </span>
              <span className="text-sm font-semibold">
                {dob || "—"}
              </span>
            </div>

            {/* EXPERIENCE */}
            <div className="flex flex-col items-center justify-center px-6 py-3 rounded-xl 
              bg-white/10 backdrop-blur-md border border-white/20 shadow-md min-w-[130px]">
              <MdWork className="text-white text-lg mb-1 opacity-80" />
              <span className="text-[10px] uppercase tracking-wide opacity-70">
                Experience
              </span>
              <span className="text-sm font-semibold">
                {Number(doctor.experience)} year{Number(doctor.experience) > 1 ? "s" : ""}
              </span>
            </div>

          </div>
        </div>

        {/* EDIT BUTTON */}
        {canEditProfile && (
          <div>
            <button
              onClick={() =>
                navigate(`/admin/doctor_edit_profile/${doctor.doctor_id}`, { state: doctor })
              }
              className="flex items-center gap-2 px-5 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700"
            >
              <FaEdit /> Edit Profile
            </button>
          </div>
        )}

        {/* GRID */}
        <div className="grid md:grid-cols-2 gap-6">

          {/* PROFESSIONAL */}
          <div className="bg-white rounded-xl shadow p-5">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-indigo-600">
              <GiMedicalPack /> Professional Details
            </h3>

            <div className="space-y-2 text-sm">
              <p><strong>Doctor ID:</strong> {doctor.doctor_no}</p>
              <p><strong>Licence:</strong> {doctor.licence_number || "—"}</p>
              <p><strong>Specialization:</strong> {doctor.specialization || "—"}</p>

              <div className="bg-gray-100 p-3 rounded-lg mt-2">
                {doctor.bio || "-"}
              </div>
            </div>
          </div>

          {/* EXPERIENCE */}
          <div className="bg-white rounded-xl shadow p-5">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-indigo-600">
              <MdWork /> Experience
            </h3>

            {doctor?.doctor_experiences?.length ? (
              <div className="border-l-2 border-blue-400 pl-4 space-y-2">
                <p className="font-medium">
                  {doctor.doctor_experiences[0]?.organization_name}
                </p>

                <p className="text-sm text-gray-600">
                  {doctor.doctor_experiences[0]?.designation}
                </p>

                <p className="text-xs text-gray-500">
                  {doctor.doctor_experiences[0]?.start_date} →{" "}
                  {doctor.doctor_experiences[0]?.end_date}
                </p>
              </div>
            ) : (
              <p>-</p>
            )}
          </div>

          {/* CURRENT ADDRESS */}
          <div className="bg-white rounded-xl shadow p-5">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-pink-500">
              <FaMapMarkerAlt /> Current Address
            </h3>

            <div className="grid grid-cols-2 gap-2 text-sm">
              <p>{doctor?.doctor_address?.current_address?.address_line_1 || "—"}</p>
              <p>{doctor?.doctor_address?.current_address?.address_line_2 || "—"}</p>
              <p>{doctor?.doctor_address?.current_address?.city || "—"}</p>
              <p>{doctor?.doctor_address?.current_address?.district || "—"}</p>
              <p>{doctor?.doctor_address?.current_address?.state || "—"}</p>
              <p>{doctor?.doctor_address?.current_address?.country || "—"}</p>
              <p>{doctor?.doctor_address?.current_address?.pin || "—"}</p>
            </div>
          </div>

          {/* PERMANENT ADDRESS */}
          <div className="bg-white rounded-xl shadow p-5">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-green-500">
              <FaHome /> Permanent Address
            </h3>

            <div className="grid grid-cols-2 gap-2 text-sm">
              <p>{doctor?.doctor_address?.permanent_address?.address_line_1 || "—"}</p>
              <p>{doctor?.doctor_address?.permanent_address?.address_line_2 || "—"}</p>
              <p>{doctor?.doctor_address?.permanent_address?.city || "—"}</p>
              <p>{doctor?.doctor_address?.permanent_address?.district || "—"}</p>
              <p>{doctor?.doctor_address?.permanent_address?.state || "—"}</p>
              <p>{doctor?.doctor_address?.permanent_address?.country || "—"}</p>
              <p>{doctor?.doctor_address?.permanent_address?.pin || "—"}</p>
            </div>
          </div>
        </div>

        {/* DELETE */}
        <div className="flex justify-end">
          {canDeleteProfile && (
            <button className="px-5 py-2 bg-red-500 text-white rounded-lg shadow hover:bg-red-600">
              Delete Account
            </button>
          )}
        </div>

      </div>
    </div>
  );
};

export default DoctorViewProfile;