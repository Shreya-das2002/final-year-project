import React from "react";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../../../../store/store";
import { FaEdit, FaUserCircle } from "react-icons/fa";
import { MdEmail, MdPhone, MdCake } from "react-icons/md";
import { GiMedicalPack } from "react-icons/gi";
import { RiVirusLine } from "react-icons/ri";
import { getGenderLabel } from "../../../Environment";
import { bloodGroupMap } from "../../../Environment";


const PatientProfileView: React.FC = () => {
  const navigate = useNavigate();

  // USER FROM LOGIN API (REDUX)
  const user = useSelector((state: RootState) => state.auth.user);
  const profile = useSelector((state: RootState) => state.auth.profile);
  const dob = profile?.dob || user?.dob || null;
  const age = dob
  ? dayjs().diff(dayjs(dob), "year")
  : null;

  if (!user) {
    return <p className="text-center mt-10">No profile data</p>;
  }

  /* ================= DERIVED DATA ================= */
  const initials =
    user.first_name?.charAt(0).toUpperCase() +
    user.last_name?.charAt(0).toUpperCase();

  const fullName = `${user.first_name} ${user.middle_name || ""} ${user.last_name}`.trim();

  const image = localStorage.getItem("profileImage");

  // Optional DOB logic if later added

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-3xl bg-gradient-to-br from-sky-100 to-blue-200 rounded-2xl shadow-xl p-10 text-center">

        {/* ================= PROFILE HEADER ================= */}
        <div className="flex flex-col items-center">

          {/* Avatar */}
          <div className="w-24 h-24 rounded-full overflow-hidden bg-blue-600 flex items-center justify-center text-white text-2xl font-semibold shadow-md">
            {image ? (
              <img src={image} alt="profile" className="w-full h-full object-cover" />
            ) : (
              initials || "P"
            )}
          </div>

          <h2 className="mt-4 text-2xl font-semibold text-gray-800">
            {fullName}
          </h2>

          <p className="text-gray-500 flex items-center gap-2">
            <MdEmail /> {user.email}
          </p>

          {/* Info Pills */}
          <div className="mt-4 flex flex-wrap justify-center gap-3 text-sm">
            <span className="px-4 py-2 bg-blue-50 rounded-full flex items-center gap-2 shadow text-gray-700">
              <MdPhone /> {user.phone_no || "—"}
            </span>

            <span className="px-4 py-2 bg-blue-50 rounded-full shadow flex items-center gap-2 text-gray-700">
              <FaUserCircle /> {getGenderLabel(user.gender) || "—"}
            </span>

            <span className="px-4 py-2 bg-blue-50 rounded-full shadow flex items-center gap-2 text-gray-700">
              <MdCake /> Age:  {age !== null ? age : "—"}
            </span>
          </div>

          {/* Edit Button */}
          <button
            onClick={() => navigate("/patient/profile")}
            className="mt-6 inline-flex items-center gap-2 px-6 py-2 rounded-lg bg-blue-600 text-white font-medium shadow hover:bg-blue-700 transition"
          >
            <FaEdit />
            Edit Profile
          </button>
        </div>

        {/* ================= MEDICAL + ALLERGIES ================= */}
        <div className="mt-10 bg-gradient-to-br from-sky-50 to-blue-100 rounded-xl shadow-md p-6 grid grid-cols-1 md:grid-cols-2 gap-6 text-left">

          <div>
            <h3 className="text-blue-600 font-semibold mb-2 flex items-center gap-2">
              <GiMedicalPack />
              Medical Details
            </h3>
            <p className="text-gray-700 text-sm">
              <span className="font-medium">Blood Group:</span>{" "}
                  {profile?.blood_group
                  ? bloodGroupMap[profile.blood_group]
                  : "—"}
            </p>
          </div>

          <div>
            <h3 className="text-pink-600 font-semibold mb-2 flex items-center gap-2">
              <RiVirusLine />
              Allergies
            </h3>
            <p className="text-gray-700 text-sm">
                {profile?.allergies?.length
                ? profile.allergies.join(", ")
                : "—"}
</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientProfileView;
