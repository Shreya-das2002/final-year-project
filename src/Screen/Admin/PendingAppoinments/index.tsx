import React, { useEffect, useRef } from "react";
import { FaEnvelope, FaPhone } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../../../../store/store";
import { fetchPendingAppointmentsThunk } from "../../../../store/slices/appointmentSlice";

const PendingAppointments: React.FC = () => {
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
    <div className="bg-gradient-to-r from-sky-100 via-sky-50 to-sky-100 
                    dark:from-sky-950 dark:via-sky-900 dark:to-sky-950 
                    p-4 min-h-screen w-full">

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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pl-1">

        {/* CARD */}
        <div className="bg-gradient-to-r from-cyan-100 to-cyan-200 
                        dark:from-sky-900 dark:to-cyan-800 
                        rounded-2xl shadow-md relative p-5
                        hover:scale-102 transition">

          {/* CONTENT */}
          <div className="flex flex-col-2 gap-3.5 pt-3 text-[12px]">

            {/* PATIENT */}
            <div className="bg-white/30 backdrop-blur-md rounded-xl p-2 space-y-2">
              <h2 className="font-semibold text-lg text-cyan-900 dark:text-cyan-50">
                Patient
              </h2>

              <p><b>Name:</b> Jane Smith</p>

              <p className="flex items-center gap-2">
                <FaPhone /> (555) 123-4567
              </p>

              <p className="flex items-center gap-2">
                <FaEnvelope /> jane.smith@email.com
              </p>

              <p><b>Gender:</b> Female</p>
            </div>

            {/* DOCTOR */}
            <div className="bg-white/30 backdrop-blur-md rounded-xl p-4 space-y-2">
              <h2 className="font-semibold text-lg text-cyan-900 dark:text-cyan-50">
                Doctor
              </h2>

              <p><b>Name:</b> Dr. Rita Chaudhary</p>

              <p><b>Specialization:</b> Cardiology</p>

              <p className="flex items-center gap-2">
                <FaPhone /> (555) 765-4321
              </p>

              <p className="flex items-center gap-2">
                <FaEnvelope /> r.chaudhary@hospital.org
              </p>

              <p><b>Gender:</b> Female</p>
            </div>

          </div>

          {/* DATE */}
          <div className="mt-4 bg-white/30 backdrop-blur-md rounded-xl p-3 text-center font-medium text-cyan-900 dark:text-cyan-50">
            Requested Appointment: April 10, 2026
          </div>
        
          <div className="pt-4 flex justify-end gap-2">
            <div className="flex items-center justify-center rounded-xl 
                            bg-white/40 text-green-600 shadow px-4 py-1 cursor-pointer">
              Approve
            </div>

            <div className="flex items-center justify-center rounded-xl 
                            bg-white/40 text-red-600 shadow px-4 py-1 cursor-pointer">
              Reject
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default PendingAppointments;