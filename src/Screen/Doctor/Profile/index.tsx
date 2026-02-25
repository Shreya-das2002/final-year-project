import React, { useEffect, useRef } from "react";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../../../../store/store";

import {
  FaEdit,
  FaUserCircle,
  FaTimes,
  FaRing,
  FaHome,
  FaMapMarkerAlt,
} from "react-icons/fa";

import {
  MdEmail,
  MdPhone,
  MdCake,
  MdWork,
} from "react-icons/md";

import { GiMedicalPack } from "react-icons/gi";

import { getGenderLabel } from "../../../Environment";
import { setProfile } from "../../../../store/slices/authSlice";

interface Props {
  open: boolean;
  onClose: () => void;
}

const DoctorProfile: React.FC<Props> = ({ open, onClose }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector((state: RootState) => state.auth.user);
  const profile = useSelector((state: RootState) => state.auth.profile);

  const hydrated = useRef(false);

  useEffect(() => {
    if (!profile && !hydrated.current) {
      const storedProfile = localStorage.getItem("doctorProfile");
      if (storedProfile) {
        dispatch(setProfile(JSON.parse(storedProfile)));
      }
      hydrated.current = true;
    }
  }, [profile, dispatch]);

  if (!user) return null;

  const dob = profile?.dob || user?.dob || null;
  const age = dob ? dayjs().diff(dayjs(dob), "year") : null;

  const initials =
    user.first_name?.charAt(0).toUpperCase() +
    user.last_name?.charAt(0).toUpperCase();

  const fullName = `${user.first_name} ${user.middle_name || ""} ${user.last_name}`.trim();

  const image = localStorage.getItem("profileImage");

  return (
    <div className="w-full bg-gradient-to-br from-sky-100 to-blue-200 rounded-2xl">
      {/* Drawer */}
      <div
        className={`fixed top-16 right-0 h-[calc(100vh-80px-30px)] w-[420px] shadow-2xl z-50 bg-gradient-to-br from-sky-100 to-blue-200 transform transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        } overflow-y-auto`}
        onClick={onClose}
      >
        {/* Close */}
        <button onClick={onClose}>
          <FaTimes className="text-gray-500 hover:text-red-500" />
        </button>

        <div className="text-center">
          {/* Header */}
          <div className="flex flex-col items-center">
            <div className="w-24 h-24 rounded-full overflow-hidden bg-blue-600 flex items-center justify-center text-white text-2xl font-semibold shadow-md">
              {image ? (
                <img src={image} alt="profile" className="w-full h-full object-cover" />
              ) : (
                initials || "D"
              )}
            </div>

            <h2 className="mt-4 text-xl font-semibold text-gray-800">
              Dr. {fullName}
            </h2>

            <p className="text-gray-500 flex items-center gap-2">
              <MdEmail /> {user.email}
            </p>

            <div className="mt-4 flex flex-wrap justify-center gap-3 text-sm">
              <span className="px-4 py-2 bg-blue-50 rounded-full flex items-center gap-2 shadow text-gray-700">
                <MdPhone /> {user.phone_no || "—"}
              </span>

              <span className="px-4 py-2 bg-blue-50 rounded-full shadow flex items-center gap-2 text-gray-700">
                <FaUserCircle /> {getGenderLabel(user.gender) || "—"}
              </span>

              <span className="px-4 py-2 bg-blue-50 rounded-full shadow flex items-center gap-2 text-gray-700">
                <MdCake /> Age: {age ?? "—"}
              </span>

              <span className="px-4 py-2 bg-blue-50 rounded-full shadow flex items-center gap-2 text-gray-700">
                <MdWork /> yrs Experience
              </span>

              <span className="px-4 py-2 bg-blue-50 rounded-full shadow flex items-center gap-2 text-gray-700">
                <FaRing /> {profile?.marital_status}
              </span>
            </div>

            <button
              onClick={() => {
                navigate("/doctor/profile");
                onClose();
              }}
              className="mt-6 inline-flex items-center gap-2 px-6 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition"
            >
              <FaEdit />
              Edit Profile
            </button>
          </div>

          {/* Professional Details */}
          <div className="mt-6 p-4 grid grid-cols-1 gap-4 text-left">
            <div>
              <h3 className="text-blue-600 font-semibold flex items-center gap-2">
                <GiMedicalPack /> Professional Details
              </h3>

              <p className="flex items-center gap-2">
                Specialization:
                </p>

              <p className="flex items-center gap-2">
                Qualification: { "—"}
              </p>

              <p className="flex items-center gap-2">
                Hospital/Clinic: 
              </p>
            </div>

            {/* Current Address */}
            <div className="mt-4">
              <h3 className="text-blue-600 font-semibold flex items-center gap-2">
                <FaMapMarkerAlt /> Current Address
              </h3>

              <p>
                City: {profile?.current_address?.city},{" "}
                State: {profile?.current_address?.state}
              </p>

              <p>
                District: {profile?.current_address?.district},{" "}
                Country: {profile?.current_address?.country}
              </p>

              <p>PIN: {profile?.current_address?.pin}</p>
            </div>

            {/* Permanent Address */}
            <div className="mt-4">
              <h3 className="text-blue-600 font-semibold flex items-center gap-2">
                <FaHome /> Permanent Address
              </h3>

              <p>
                {profile?.permanent_address?.address_line_1},{" "}
                {profile?.permanent_address?.address_line_2}
              </p>

              <p>
                City: {profile?.permanent_address?.city},{" "}
                State: {profile?.permanent_address?.state}
              </p>

              <p>PIN: {profile?.permanent_address?.pin}</p>
            </div>
          </div>
          {/* DELETE BUTTON */}
          <div className="w-full pb-5 pr-5 flex justify-end mt-6 items-end">
            <button className="px-6 py-2 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 transition">
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorProfile;