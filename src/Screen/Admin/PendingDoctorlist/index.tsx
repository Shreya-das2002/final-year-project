import React, { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { FaEnvelope, FaCommentMedical, FaPhone } from "react-icons/fa";

import type { RootState, AppDispatch } from "../../../../store/store";
import { fetchDoctorListThunk } from "../../../../store/slices/doctorSlice";

import {
  getPendingDoctorsApi,
  updateDoctorStatusApi
} from "../../../services/doctorApi";

import type { Doctor } from "../../../services/doctorApi";

const cardThemes = [
  "from-cyan-100 to-cyan-500",
  "from-cyan-200 to-cyan-600",
  "from-cyan-300 to-cyan-700",
  "from-sky-100 to-sky-500",
  "from-cyan-200 to-teal-500",
  "from-teal-100 to-cyan-500",
];

const textColorThemes = [
  "text-cyan-950",
  "text-cyan-950",
  "text-cyan-950",
  "text-teal-900",
  "text-sky-950",
  "text-teal-950",
];

const iconThemes = [
  "text-cyan-600",
  "text-cyan-700",
  "text-cyan-800",
  "text-sky-600",
  "text-teal-700",
  "text-cyan-600",
];

const PendingDoctorList: React.FC = () => {

  const dispatch = useDispatch<AppDispatch>();

  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const calledRef = useRef(false);

  const buttons = useSelector(
    (state: RootState) => state.auth.buttons
  );

  const canAccept = buttons?.some(
    (btn) => btn.control_key === "doctor accept"
  );

  const canDecline = buttons?.some(
    (btn) => btn.control_key === "doctor decline"
  );

  /* ================= FETCH ================= */

  useEffect(() => {

    if (calledRef.current) return;
    calledRef.current = true;

    const fetchDoctors = async () => {
      try {
        const data = await getPendingDoctorsApi();
        setDoctors(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();

  }, []);

  /* ================= ACCEPT ================= */

  const handleAccept = async (doctorId: number) => {

    try {

      const res = await updateDoctorStatusApi({
        doctor_id: doctorId,
        status: "Active"
      });

      if (res.data.success) {

        // remove from pending UI
        setDoctors(prev =>
          prev.filter(d => d.doctor_id !== doctorId)
        );

        // 🔥 IMPORTANT FIX
        dispatch(fetchDoctorListThunk());

      }

    } catch (error) {
      console.error(error);
    }

  };

  /* ================= DECLINE ================= */

  const handleDecline = async (doctorId: number) => {

    try {

      const res = await updateDoctorStatusApi({
        doctor_id: doctorId,
        status: "Rejected"
      });

      if (res.data.success) {

        setDoctors(prev =>
          prev.filter(d => d.doctor_id !== doctorId)
        );

      }

    } catch (error) {
      console.error(error);
    }

  };

  if (loading) {
    return <div className="p-6">Loading pending doctors...</div>;
  }
  return (

    <div className="p-6 bg-gray-100 min-h-screen">

      <h1 className="text-2xl font-semibold mb-6">
        Pending Doctor Approvals
      </h1>

      {doctors.length === 0 ? (

        <div>No pending doctors found.</div>

      ) : (

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          {doctors.map((doctor, index) => {

            const theme = cardThemes[index % cardThemes.length];
            const textColor = textColorThemes[index % textColorThemes.length];
            const iconColor = iconThemes[index % iconThemes.length];

            return (
              <div
                key={doctor.doctor_id}
                className={`bg-gradient-to-r ${theme} rounded-2xl shadow-md border border-gray-200 overflow-hidden`}
              >

                {/* HEADER */}
                <div className="flex items-center gap-4 p-4">

                  {/* Avatar */}
                  <div className="w-12 h-12 flex items-center justify-center rounded-full bg-cyan-50 text-teal-600 font-bold">
                    {doctor.first_name?.[0]}
                    {doctor.last_name?.[0]}
                  </div>

                  {/* Name + Tag */}
                  <div>
                    <h2 className={`font-semibold text-lg ${textColor}`}>
                      Dr. {doctor.first_name}
                      {doctor.middle_name ? ` ${doctor.middle_name}` : ""}{" "}
                      {doctor.last_name}
                    </h2>

                    <span className={`inline-block mt-1 text-[11px] px-3 py-0.5 rounded-full bg-white/70 ${textColor}`}>
                      {doctor.specialization}
                    </span>
                  </div>

                </div>

                {/* BODY */}
                <div className="p-4 space-y-2 text-gray-700 dark:text-gray-50">

                  <div className="flex items-center gap-3">
                    <FaEnvelope className={iconColor} />
                    <span>{doctor.email}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <FaPhone className={iconColor} />
                    <span>{doctor.phone_no}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <FaCommentMedical className={iconColor} />
                    <span>
                      Submitted {new Date().toLocaleDateString()}
                    </span>
                  </div>

                </div>

                {/* FOOTER */}
                {(canAccept || canDecline) && (

                  <div className="flex items-center gap-6 px-6 py-3">

                    {canAccept && (
                      <button
                        onClick={() => handleAccept(doctor.doctor_id)}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white py-1 rounded-lg font-medium"
                      >
                        ✓ Approve
                      </button>
                    )}

                    {canDecline && (
                      <button
                        onClick={() => handleDecline(doctor.doctor_id)}
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white py-1 rounded-lg font-medium"
                      >
                        ✕ Reject
                      </button>
                    )}

                  </div>

                )}

              </div>
            );
          })}

        </div>

      )}

    </div>

  );

};

export default PendingDoctorList;