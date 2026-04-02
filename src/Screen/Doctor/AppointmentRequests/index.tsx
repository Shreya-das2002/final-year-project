import React from "react";
import { FaEnvelope, FaPhone, FaUser, FaVenusMars } from "react-icons/fa";

const PendingAppointments: React.FC = () => {

  const pendingAppointments = [
    {
      patient_name: "Rahul Sharma",
      patient_gender: "Male",
      patient_age: 37,
      patient_phone: "9876543210",
      patient_email: "rahul@gmail.com",
      patient_symptom: "I am having very unpleasant dreams related to my childhood, it's been about a decade since I had these kind of nightmares ",
    },
    {
      patient_name: "Priya Das",
      patient_gender: "Female",
      patient_age:29,
      patient_phone: "8765432109",
      patient_email: "priya@gmail.com",
      patient_symptom: "I am hearing strange sounds when I am alone. I feel like I am loosing my touch with reality!",
          },
  ];

  return (
    <div
      className="bg-gradient-to-r from-sky-100 via-sky-50 to-sky-100 
                    dark:from-sky-950 dark:via-sky-900 dark:to-sky-950 
                    p-4 min-h-screen w-full"
    >
      <h1 className="text-4xl font-bold mb-6 text-cyan-800 dark:text-cyan-50">
        Appointment Requests
      </h1>

      {pendingAppointments.length === 0 && (
        <div className="text-cyan-900 dark:text-cyan-50 text-lg">
          You Don't Have Any Appointment Requests Yet...
        </div>
      )}

      {/* GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 pl-1">
        {pendingAppointments.map((item, index) => (
          <div
            key={index}
            className="bg-gradient-to-r from-cyan-100 to-cyan-200 
                          dark:from-sky-900 dark:to-cyan-800 
                          rounded-2xl shadow-md relative p-5
                          hover:scale-101 transition"
          >
            {/* CONTENT */}
            <div className="pt-3 text-[14px]">
              
              {/* PATIENT */}
              <div className="bg-white/30 backdrop-blur-md rounded-xl p-2 space-y-2">
                <h2 className="font-semibold text-lg text-cyan-900 dark:text-cyan-50">
                  Patient Details
                </h2>

                <div className="bg-white/10 backdrop-blur-md rounded-xl p-2 space-y-2">

                  <span className="flex items-center gap-2">
                    <FaUser /> {item.patient_name}
                  </span>

                  <span className="flex items-center gap-2"> 
                    <FaVenusMars /> {item.patient_gender}
                  </span>
                  
                  <span className="flex items-center gap-2"> 
                    <FaVenusMars /> {item.patient_age}
                  </span>
                  
                  <span className="flex items-center gap-2">
                    <FaPhone /> {item.patient_phone}
                  </span>

                  <span className="flex items-center gap-2">
                    <FaEnvelope /> {item.patient_email}
                  </span>
                
                </div>

              </div>

            </div>

            <div className="mt-4 text-[12px] bg-white/30 backdrop-blur-md rounded-xl p-3 text-left font-medium text-cyan-900 dark:text-cyan-50">
              {item.patient_symptom}
            </div>

            {/* DATE */}
            <div className="mt-4 text-[12px] bg-white/30 backdrop-blur-md rounded-xl p-3 text-center font-medium text-cyan-900 dark:text-cyan-50">
              Requested Appointment: April 10, 2026
            </div>

            {/* BUTTONS */}
            <div className="pt-4 flex justify-end gap-2">
              <button className="rounded-xl bg-white/40 text-red-600 px-4 py-1 hover:bg-red-200/80 hover:text-red-700">
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PendingAppointments;