import React, { useEffect, useRef, useState } from "react";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
// import toast from "react-hot-toast";
// import Swal from "sweetalert2";

import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../../../../store/store";

import background from "../../../assets/apply_light.jpeg";
import dark_background from "../../../assets/doctor_light.webp";

import {
  FaEdit,
  FaUserCircle,
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

import { FiChevronRight } from "react-icons/fi";

import { getGenderLabel } from "../../../Environment";
import { setProfile } from "../../../../store/slices/authSlice";
// import { deleteAccountApi } from "../../../services/accountDeleteApi";

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

  const [isDark, setIsDark] = useState(
    document.documentElement.classList.contains("dark")
  );

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains("dark"));
    });
    observer.observe(document.documentElement, { attributes: true });
    return () => observer.disconnect();
  }, []);

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
    <div>
            <div
              className={`fixed inset-0 bg-black/30 z-40 transition-opacity ${
                open ? "opacity-100 visible" : "opacity-0 invisible"
              }`}
              onClick={onClose}
            />
      
            <div
              className={`fixed top-1/2 right-[400px] -translate-y-1/2 translate-x-1/2 z-[9999]
              transition-transform duration-100
              ${
                open
                  ? "translate-x-1/2 opacity-100 visible"
                  : "translate-x-full opacity-0 invisible"
              }`}
            >
              <button
                onClick={onClose}
                className="w-7 h-7 flex items-center justify-center rounded-full bg-gray-200 shadow-lg text-cyan-700 hover:text-red-500 transition"
              >
                <FiChevronRight size={20} style={{ strokeWidth: 3 }} />
              </button>
            </div>
      <div  className={`fixed top-16 bottom-0 right-0 w-[400px]
        shadow-2xl z-50 min-h-[calc(100vh-110px)] bg-cover flex flex-col justify-start
        transform transition-transform duration-300
        ${open ? "translate-x-0" : "translate-x-full"}
        overflow-y-auto overflow-x-visible`}
        style={{
          backgroundImage: `url(${isDark ? dark_background : background})`,
        }}
        >
        {/* Drawer */}
          <div className="bg-white/20 pb-5 rounded-4xl relative ml-7 mr-7 mt-20 border border-white/20">
            <div className="absolute left-1/2 -top-12 transform -translate-x-1/2">
              <div className="w-24 h-24 border-2 border-cyan-100 dark:border-cyan-800 rounded-full bg-cyan-600 dark:bg-gray-500 flex items-center justify-center text-white text-2xl font-semibold shadow-lg">
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