import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import dayjs from "dayjs";
import type { RootState, AppDispatch } from "../../../../store/store";
import { fetchPendingAppointmentsThunk } from "../../../../store/slices/appointmentSlice";
import { FaEnvelope, FaPhone, FaUser, FaVenusMars, FaHourglassHalf } from "react-icons/fa";
import { FiTrash2 } from "react-icons/fi";

const AppointmentsRequests: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { pendingAppointments, loading, error } = useSelector(
    (state: RootState) => state.appointment
  );

  const hasFetched = useRef(false);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;
    dispatch(fetchPendingAppointmentsThunk());
  }, [dispatch]);

  return (
    <div
      className="bg-gradient-to-r from-sky-100 via-sky-50 to-sky-100 
                    dark:from-sky-950 dark:via-sky-900 dark:to-sky-950 
                    p-6 min-h-screen w-full"
    >
      <h1 className="text-4xl font-bold mb-6 text-cyan-800 dark:text-cyan-50">
        Pending Appointments
      </h1>
      {loading && (
        <div className="text-cyan-900 dark:text-cyan-50 text-lg">
          Loading...
        </div>
      )}

      {error && (
        <div className="text-red-600 dark:text-red-400 text-lg mb-4">
          {error}
        </div>
      )}

      {!loading && pendingAppointments.length === 0 && (
        <div className="text-cyan-900 dark:text-cyan-50 text-lg">
          No pending appointments found
        </div>
      )}

      {/* GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pl-1">
        {!loading &&
          pendingAppointments.map((item) => {
    const dob = item.patient_dob || null;
    const age = dob ? dayjs().diff(dayjs(dob), "year") : null;
    return (
          <div
            className="bg-gradient-to-r from-cyan-100 to-cyan-200 
                       dark:from-sky-900 dark:to-cyan-800 
                       rounded-2xl shadow-md relative p-5
                       hover:scale-[1.01] transition"
          >
            <div className="text-[15px]">
              <div className="p-2 space-y-2">
                <h2 className="font-semibold text-[20px] text-cyan-900 dark:text-cyan-50 pl-1 pb-2">
                  Patient Details
                </h2>

                <div className="bg-white/30 backdrop-blur-md rounded-xl p-2 space-y-2">
                  <span className="flex items-center gap-2">
                    <FaUser /> {item.patient_name || "N/A"}
                  </span>

                  <span className="flex items-center gap-2">
                    <FaVenusMars /> {item.patient_gender || "N/A"}
                  </span>

                  <span className="flex items-center gap-2">
                    <FaHourglassHalf /> {age !== null ? `${age} years` : "N/A"}
                  </span>

                  <span className="flex items-center gap-2">
                    <FaPhone /> {item.patient_phone || "N/A"}
                  </span>

                  <span className="flex items-center gap-2 break-all">
                    <FaEnvelope /> {item.patient_email || "N/A"}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-4 text-[12px] bg-white/30 backdrop-blur-md rounded-xl p-3 text-left font-medium text-cyan-900 dark:text-cyan-50 min-h-[90px]">
                symptom
            </div>

            <div className="mt-4 text-[12px] bg-white/30 backdrop-blur-md rounded-xl p-3 text-center font-medium text-cyan-900 dark:text-cyan-50">
              Requested Appointment: April 10, 2026
            </div>

            <div className="text-[24px] absolute top-1 right-3 pt-4 flex justify-end gap-2">
              <button
                type="button"
                className="rounded-xl text-red-600 px-4 py-1 hover:text-red-700 hover:scale-[1.05] transition"
              >
                <FiTrash2 />
              </button>
            </div>
          </div>
        )})}
      </div>
    </div>
  );
};

export default AppointmentsRequests;
