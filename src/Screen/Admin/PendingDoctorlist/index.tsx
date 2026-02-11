import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../../../../store/store";

import {
  getPendingDoctorsApi,
  updateDoctorStatusApi
} from "../../../services/doctorApi";

import type { Doctor } from "../../../services/doctorApi";

const PendingDoctorList: React.FC = () => {

  /* ================= STATE ================= */

  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);

  const calledRef = useRef(false);

  /* ================= BUTTON PERMISSIONS ================= */

  const buttons = useSelector(
    (state: RootState) => state.auth.buttons
  );

  const canAccept = buttons?.some(
    (btn) => btn.control_key === "doctor accept"
  );

  const canDecline = buttons?.some(
    (btn) => btn.control_key === "doctor decline"
  );

  /* ================= FETCH PENDING DOCTORS ================= */

  useEffect(() => {

    if (calledRef.current) return;

    calledRef.current = true;

    const fetchDoctors = async () => {

      try {

        const data = await getPendingDoctorsApi();

        setDoctors(data);

      } catch (error) {

        console.error("Fetch doctors error:", error);

      } finally {

        setLoading(false);

      }

    };

    fetchDoctors();

  }, []);

  /* ================= ACCEPT HANDLER ================= */

  const handleAccept = async (doctorId: number) => {

    try {

      const res = await updateDoctorStatusApi({
        doctor_id: doctorId,
        status: "Active"
      });

      if (res.data.success) {

        // remove doctor from UI
        setDoctors(prev =>
          prev.filter(d => d.doctor_id !== doctorId)
        );

        console.log("Doctor accepted successfully");

      }

    } catch (error) {

      console.error("Accept error:", error);

    }

  };

  /* ================= DECLINE HANDLER ================= */

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

        console.log("Doctor rejected successfully");

      }

    } catch (error) {

      console.error("Decline error:", error);

    }

  };

  /* ================= LOADING UI ================= */

  if (loading) {

    return (
      <div className="p-6 text-lg">
        Loading pending doctors...
      </div>
    );

  }

  /* ================= MAIN UI ================= */

  return (

    <div className="p-6 bg-gray-100 min-h-screen">

      <h1 className="text-2xl font-semibold mb-6">
        Pending Doctor Approvals
      </h1>

      {doctors.length === 0 ? (

        <div>No pending doctors found.</div>

      ) : (

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          {doctors.map((doctor) => (

            <div
              key={doctor.doctor_id}
              className="bg-white rounded-xl shadow-md p-6 relative"
            >

              {/* STATUS */}
              <span className="absolute top-4 right-4 bg-yellow-100 text-yellow-700 text-xs px-3 py-1 rounded-full">
                {doctor.status}
              </span>

              {/* NAME */}
              <h2 className="text-lg font-semibold mb-2">
                Dr. {doctor.first_name}
                {doctor.middle_name ? ` ${doctor.middle_name}` : ""}
                {" "}
                {doctor.last_name}
              </h2>

              {/* EMAIL */}
              <p className="text-sm text-gray-600 mb-1">
                📧 {doctor.email}
              </p>

              {/* GENDER */}
              <p className="text-sm text-gray-600 mb-1">
                👤 {doctor.gender}
              </p>

              {/* SPECIALIZATION */}
              <p className="text-sm text-gray-600 mb-1">
                🩺 {doctor.specialization}
              </p>

              {/* PHONE */}
              <p className="text-sm text-gray-600 mb-4">
                📱 {doctor.phone_no}
              </p>

              {/* BUTTONS */}
              {(canAccept || canDecline) && (

                <div className="flex justify-end gap-3">

                  {canAccept && (

                    <button
                      onClick={() => handleAccept(doctor.doctor_id)}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded-md text-sm"
                    >
                      Accept
                    </button>

                  )}

                  {canDecline && (

                    <button
                      onClick={() => handleDecline(doctor.doctor_id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-1 rounded-md text-sm"
                    >
                      Decline
                    </button>

                  )}

                </div>

              )}

            </div>

          ))}

        </div>

      )}

    </div>

  );

};

export default PendingDoctorList;
