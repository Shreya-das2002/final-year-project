import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { fetchDoctorListThunk, setSelectedDoctor } from "../../../../store/slices/doctorSlice";

import { FaEnvelope, FaUser } from "react-icons/fa";

import type { RootState, AppDispatch } from "../../../../store/store";
import type { Doctor } from "../../../services/doctorApi";

const SpDoctorList = () => {
  const { specializationId } = useParams();
  const dispatch = useDispatch<AppDispatch>();

  const { doctors, loading, selectedDoctor } = useSelector(
    (state: RootState) => state.doctor
  );
  const doctorSlots = useSelector((state: RootState) => state.doctor.slot);

  const [showCalendar, setShowCalendar] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();

  const monthName = currentDate.toLocaleString("default", {
    month: "long",
  });

  const today = new Date();
  const todayDate = `${today.getFullYear()}-${String(
    today.getMonth() + 1
  ).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

    
const convertToAMPM = (time: string) => {
  if (!time) return "";

  const [h, m] = time.split(":");
  let hour = parseInt(h);

  const period = hour >= 12 ? "PM" : "AM";
  hour = hour % 12 || 12;

  return `${hour}:${m} ${period}`;
};


  useEffect(() => {
    if (specializationId) {
      dispatch(fetchDoctorListThunk(Number(specializationId)));
    }
  }, [dispatch, specializationId]);

  const openCalendar = (doc: Doctor) => {
    dispatch(setSelectedDoctor(doc));
    setShowCalendar(true);
  };

  return (
    <div className="bg-gradient-to-r from-sky-100/50 via-sky-50/50 to-sky-100/50 dark:from-sky-950 dark:via-sky-900 dark:to-sky-950 p-6 min-h-screen w-full">
      <h2 className="text-[35px] text-cyan-700 dark:text-cyan-100 font-bold mb-1 pl-4">
        Doctor List
      </h2>

      {loading ? (
        <p>Loading...</p>
      ) : doctors.length === 0 ? (
        <p>No doctors found</p>
      ) : (
        <div className="p-4 space-y-4">
          {doctors.map((doc: Doctor) => {
            const todaySlot = doctorSlots[doc.doctor_id]?.[todayDate];
            const todayFee = todaySlot?.fee;

            return (
              <div
                key={doc.doctor_id}
                className="bg-gradient-to-r from-cyan-100/40 to-teal-200/30 rounded-xl flex justify-between items-center p-5 shadow hover:scale-102 transition"
              >
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-cyan-700 flex items-center justify-center text-white text-xl">
                    {doc.first_name?.charAt(0)}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-semibold">
                        Dr. {doc.first_name} {doc.last_name}
                      </h3>

                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-100 text-cyan-700">
                        {doc.specialization || "General"}
                      </span>
                    </div>

                    <div className="flex gap-4 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <FaEnvelope /> {doc.email}
                      </span>

                      <span className="flex items-center gap-1">
                        <FaUser /> {doc.phone_no}
                      </span>
                    </div>

                    <div className="text-xs text-gray-500">
                      {Number(doc.experience) === 0
                        ? "Fresher"
                      : `${Number(doc.experience)} year${Number(doc.experience) > 1 ? "s" : ""}`}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-right">
                    <div className="text-lg font-semibold text-green-950 dark:text-cyan-50">
                      {todayFee ? `₹${todayFee} per visit` : ""}
                    </div>
                    <div className="text-xs pr-5 text-gray-600 dark:text-cyan-100">
                      {todayFee ? "(Today's Fee)" : "Doctor Unavailable today"}
                    </div>
                  </div>

                  <button
                    onClick={() => openCalendar(doc)}
                    className="mt-2 bg-cyan-600 text-white px-4 py-2 rounded hover:bg-cyan-700"
                  >
                    Book Now
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showCalendar && selectedDoctor && (
        <div className="fixed inset-0 bg-black/30 flex items-start justify-center z-40 pt-24">
          <div className="bg-white w-[600px] rounded-2xl p-6 border shadow-lg">
            <div className="flex justify-between mb-4">
              <h2 className="font-semibold">
                Select Date - Dr. {selectedDoctor.first_name}{" "}
                {selectedDoctor.last_name}
              </h2>

              <button onClick={() => setShowCalendar(false)}>✕</button>
            </div>

            <div className="border rounded-xl p-4">
              <div className="flex justify-between mb-3">
                <button
                  onClick={() => setCurrentDate(new Date(year, month - 1))}
                >
                  ◀
                </button>

                <h3>
                  {monthName} {year}
                </h3>

                <button
                  onClick={() => setCurrentDate(new Date(year, month + 1))}
                >
                  ▶
                </button>
              </div>

              <div className="grid grid-cols-7 text-sm text-gray-400 text-center mb-2">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                  <div key={d}>{d}</div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-2">
                {[...Array(firstDay)].map((_, i) => (
                  <div key={i}></div>
                ))}

                {[...Array(daysInMonth)].map((_, i) => {
                  const day = i + 1;

                    const fullDate = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

                    const slotInfo =
                      selectedDoctor &&
                      doctorSlots[selectedDoctor.doctor_id]?.[fullDate];

                  return (
    <div
      key={day}
      className="min-h-[60px] flex flex-col items-center justify-center border rounded-lg cursor-pointer hover:bg-cyan-100"
      onClick={() => {
        console.log("Selected date:", fullDate);
        setShowCalendar(false);
      }}
    >
      <span>{day}</span>

      {slotInfo && (
        <span className="text-[10px] text-cyan-700">
          {convertToAMPM(slotInfo.start_time)} - {convertToAMPM(slotInfo.end_time)}
        </span>
      )}
    </div>
  );
})}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SpDoctorList;