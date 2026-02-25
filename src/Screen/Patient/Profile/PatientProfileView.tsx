import React, { useEffect, useRef } from "react";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../../../../store/store";

import { FaEdit, FaUserCircle, FaTimes, FaRing, FaTint, FaWalking, FaHome,
  FaSmoking,
  FaWineGlassAlt,
  FaMapMarkerAlt,  } from "react-icons/fa";
import { MdEmail, MdPhone, MdCake, MdWork, MdHeight, MdMonitorWeight } from "react-icons/md";
import { GiMedicalPack } from "react-icons/gi";
import { RiVirusLine } from "react-icons/ri";

import { getGenderLabel } from "../../../Environment";
import { setProfile } from "../../../../store/slices/authSlice";

const bloodGroupMap: Record<number, string> = {
  1: "A+",
  2: "A-",
  3: "B+",
  4: "B-",
  5: "AB+",
  6: "AB-",
  7: "O+",
  8: "O-",
};

interface Props {
  open: boolean;
  onClose: () => void;
}

const PatientProfileView: React.FC<Props> = ({ open, onClose }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector((state: RootState) => state.auth.user);
  const profile = useSelector((state: RootState) => state.auth.profile);

  const hydrated = useRef(false);

  useEffect(() => {
    if (!profile && !hydrated.current) {
      const storedProfile = localStorage.getItem("patientProfile");
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
    <div className="w-full bg-gradient-to-br from-sky-100 to-blue-200 rounded-2xl ">
        {/* Drawer */}
      <div
        className={`fixed top-16 right-0 h-[calc(100vh-80px-30px)] w-[420px] shadow-2xl z-50 bg-gradient-to-br from-sky-100 to-blue-200  transform transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        } overflow-y-auto`}
        onClick={onClose}
      >
        {/* Close button */}
      
          <button onClick={onClose}>
            <FaTimes className="text-gray-500 hover:text-red-500" />
          </button>
          <div className=" text-center">

            {/* Profile Header */}
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 rounded-full overflow-hidden bg-blue-600 flex items-center justify-center text-white text-2xl font-semibold shadow-md">
                {image ? (
                  <img src={image} alt="profile" className="w-full h-full object-cover" />
                ) : (
                  initials || "P"
                )}
              </div>

              <h2 className="mt-4 text-xl font-semibold text-gray-800">
                {fullName}
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
        <MdWork/> {profile?.occupation}
        </span>

        <span className="px-4 py-2 bg-blue-50 rounded-full shadow flex items-center gap-2 text-gray-700">
          <FaRing/> {profile?.marital_status}
        </span>

              </div>

              <button
                onClick={() => {
                navigate("/patient/profile");
                onClose();
                  }}

                className="mt-6 inline-flex items-center gap-2 px-6 py-2 rounded-lg bg-blue-600 text-white font-medium  hover:bg-blue-700 transition"
              >
                <FaEdit />
                Edit Profile
              </button>
            </div>

            {/* Medical + Allergies */}
            <div className="mt-6 p-4 grid grid-cols-1 gap-4 text-left">

              <div>
                <h3 className="text-blue-600 font-semibold  flex items-center gap-2">
                  <GiMedicalPack /> Medical Details
                </h3>

                  <span className="font-medium flex items-center gap-2"> 
                    <FaTint className="text-red-600"/> Blood Group: {profile?.blood_group
                    ? bloodGroupMap[profile.blood_group]
                    : "—"}
                    </span>
                

              
                  <span className="font-medium flex items-center gap-2">
                  <MdHeight className="text-amber-500"/>  Height:{profile?.height}
                  </span>
                
                
                  <span className="font-medium flex items-center gap-2"> 
                  <MdMonitorWeight className="text-amber-500"/> Weight:{profile?.weight}
                  </span> 
                
                
              </div>

              <div>
                <h3 className="text-pink-600 font-semibold  flex items-center gap-2">
                  <RiVirusLine /> Allergies
                </h3>
                <p className="text-gray-700 text-sm">
                  {profile?.allergies?.length
                    ? profile.allergies.join(", ")
                    : "—"}
                </p>
              </div>

              {/* Lifestyle */}
<div className="mt-4">

  <h3 className="text-purple-600 font-semibold flex items-center gap-2">
    <FaWalking/> Lifestyle
  </h3>

  <div className="text-gray-700 text-sm mt-1 space-y-1">

    <p>
     
      <span className="font-medium flex items-center gap-2">
        <FaSmoking className="text-red-500"/> Smoking: {profile?.smoking ? "Yes" : "No"}
      </span>
    </p>

    <p>
      
      <span className="font-medium flex items-center gap-2">
        <FaWineGlassAlt className="text-red-500"/> Alcohol: {profile?.alcohol ? "Yes" : "No"}
      </span>
    </p>

  </div>

</div>
{/* Current Address */}
<div className="mt-4">

  <h3 className="text-blue-600 font-semibold flex items-center gap-2">
    <FaMapMarkerAlt/> Current Address
  </h3>

  <div className="text-gray-700 text-sm mt-1">

 

    <p>
     Address line-1: {profile?.current_address?.address_line_1},
     Address line-2: {profile?.current_address?.address_line_2}
    </p>

    <p>
      City: {profile?.current_address?.city},{" "}
      District: {profile?.current_address?.district},{" "}
      State: {profile?.current_address?.state},{""}
      Country: {profile?.current_address?.country},{""}
    </p>

    <p>
      PIN: {profile?.current_address?.pin}
    </p>

  </div>

</div>
{/* Permanent Address */}
<div className="mt-4">

  <h3 className="text-blue-600 font-semibold flex items-center gap-2">
    <FaHome/> Permanent Address
  </h3>

  <div className="text-gray-700 text-sm mt-1">

    <p>
      Address line-1: {profile?.permanent_address?.address_line_1},
      Address line-2: {profile?.permanent_address?.address_line_2}
    </p>

    <p>
      City: {profile?.permanent_address?.city},{" "}
      District: {profile?.permanent_address?.district},{" "}
      State: {profile?.permanent_address?.state},{""}
      Country: {profile?.permanent_address?.country},{""}
    </p>

    <p>
      PIN: {profile?.permanent_address?.pin}
    </p>

  </div>

</div>
        {/* DELETE BUTTON */}
        <div className="w-full flex justify-end mt-6 items-end">
          <button className="px-6 py-2 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 transition">
            Delete Account
          </button>
        </div>

            </div>

          </div>
        </div>
    </div>
  );
};

export default PatientProfileView;
