import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../../../../store/store";

import { getPendingDoctorsApi } from "../../../services/doctorApi";
import type { Doctor } from "../../../services/doctorApi";

const PendingDoctorList: React.FC = () => {

  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);

  const calledRef = useRef(false);

  /* ================= GET BUTTON PERMISSIONS ================= */

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

      }
      catch (error) {

        console.error("Error fetching pending doctors:", error);

      }
      finally {

        setLoading(false);

      }

    };

    fetchDoctors();

  }, []);


  /* ================= HANDLERS ================= */

  const handleAccept = (doctorId: number) => {

    console.log("Accept doctor:", doctorId);

  };

  const handleDecline = (doctorId: number) => {

    console.log("Decline doctor:", doctorId);

  };


  /* ================= LOADING ================= */

  if (loading) {

    return (
      <div className="p-6 text-lg">
        Loading pending doctors...
      </div>
    );

  }


  /* ================= UI ================= */

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

              {/* Status Badge */}
              <span className="absolute top-4 right-4 bg-yellow-100 text-yellow-700 text-xs px-3 py-1 rounded-full">
                {doctor.status}
              </span>


              {/* Doctor Name */}
              <h2 className="text-lg font-semibold mb-2">

                Dr. {doctor.first_name}
                {doctor.middle_name ? ` ${doctor.middle_name}` : ""}
                {" "}
                {doctor.last_name}

              </h2>


              {/* Email */}
              <p className="text-sm text-gray-600 mb-1">
                📧 {doctor.email}
              </p>


              {/* Gender */}
              <p className="text-sm text-gray-600 mb-1">
                👤 {doctor.gender}
              </p>


              {/* Specialization */}
              <p className="text-sm text-gray-600 mb-1">
                🩺 {doctor.specialization}
              </p>


              {/* Phone */}
              <p className="text-sm text-gray-600 mb-4">
                📱 {doctor.phone_no}
              </p>


              {/* Buttons (permission based) */}
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
