import React, { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";

import type { RootState, AppDispatch } from "../../../../store/store";
import { fetchDoctorListThunk } from "../../../../store/slices/doctorSlice";

import {
  getPendingDoctorsApi,
  updateDoctorStatusApi
} from "../../../services/doctorApi";

import type { Doctor } from "../../../services/doctorApi";

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
        <div className="grid grid-cols-3 gap-6">

          {doctors.map((doctor) => (

            <div key={doctor.doctor_id} className="bg-white p-6 rounded shadow">

              <h2 className="font-semibold">
                Dr. {doctor.first_name} {doctor.middle_name} {doctor.last_name}
              </h2>

              <p>{doctor.email}</p>

              <h2 className="font-semibold mt-4">
                {doctor.gender}
              </h2>

              <h2 className="font-semibold mt-4">
                {doctor.specialization}
              </h2>

              <h2 className="font-semibold mt-4">
                {doctor.phone_no}
              </h2>

              <div className="flex gap-3 mt-4">

                {canAccept && (
                  <button
                    onClick={() => handleAccept(doctor.doctor_id)}
                    className="bg-green-600 text-white px-4 py-1 rounded"
                  >
                    Accept
                  </button>
                )}

                {canDecline && (
                  <button
                    onClick={() => handleDecline(doctor.doctor_id)}
                    className="bg-red-600 text-white px-4 py-1 rounded"
                  >
                    Decline
                  </button>
                )}

              </div>

            </div>

          ))}

        </div>
      )}

    </div>
  );
};

export default PendingDoctorList;