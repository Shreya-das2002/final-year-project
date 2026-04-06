import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
  fetchDoctorListThunk,
  setSelectedDoctor,
} from "../../../../store/slices/doctorSlice";

import { FaEnvelope, FaUser } from "react-icons/fa";

import type { RootState, AppDispatch } from "../../../../store/store";
import type { Doctor } from "../../../services/doctorApi";
import { appointmentRequestApi } from "../../../services/appointmentApi";
import toast from "react-hot-toast";

const SpDoctorList = () => {
  const { specializationId } = useParams();
  const dispatch = useDispatch<AppDispatch>();

  const { doctors, loading, selectedDoctor } = useSelector(
    (state: RootState) => state.doctor,
  );
  const doctorSlots = useSelector((state: RootState) => state.doctor.slot);
  const user = useSelector((state: RootState) => state.auth.user);

  const [showCalendar, setShowCalendar] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [selectedBookingDate, setSelectedBookingDate] = useState("");
  const [bookingLoading, setBookingLoading] = useState(false);

  const [selectedBookingSlot, setSelectedBookingSlot] = useState<{
    doctor_availability_id?: number;
    start_time?: string;
    end_time?: string;
    fee?: number;
  } | null>(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();

  const monthName = currentDate.toLocaleString("default", {
    month: "long",
  });

  const today = new Date();
  const todayDate = `${today.getFullYear()}-${String(
    today.getMonth() + 1,
  ).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  const convertToAMPM = (time: string) => {
    if (!time) return "";

    const [h, m] = time.split(":");
    let hour = parseInt(h);

    const period = hour >= 12 ? "PM" : "AM";
    hour = hour % 12 || 12;

    return `${hour}:${m} ${period}`;
  };

  const formatDateForDisplay = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
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

  const handleDateClick = (
    fullDate: string,
    slotInfo?: {
      doctor_availability_id?: number;
      start_time?: string;
      end_time?: string;
      fee?: string | number;
    } | null,
  ) => {
    setSelectedBookingDate(fullDate);

    setSelectedBookingSlot(
      slotInfo
        ? {
            doctor_availability_id: slotInfo.doctor_availability_id,
            start_time: slotInfo.start_time,
            end_time: slotInfo.end_time,
            fee: slotInfo.fee ? Number(slotInfo.fee) : 0,
          }
        : null,
    );

    setShowConfirmModal(true);
  };

  const handleConfirmBooking = async () => {
    try {
      if (!selectedDoctor || !selectedBookingDate) return;

      if (!user?.patient_id) {
        toast("Patient not found. Please login again.");
        return;
      }

      const dateSlot =
        doctorSlots[selectedDoctor.doctor_id]?.[selectedBookingDate];

      const doctorAvailabilityId =
        selectedBookingSlot?.doctor_availability_id ||
        dateSlot?.doctor_availability_id ||
        selectedDoctor.doctor_availability?.[selectedBookingDate]
          ?.doctor_availability_id;

      if (!doctorAvailabilityId) {
        toast("Doctor availability id not found for selected date.");
        return;
      }

      setBookingLoading(true);

      const response = await appointmentRequestApi({
        patient_id: Number(user.patient_id),
        doctor_id: Number(selectedDoctor.doctor_id),
        doctor_availability_id: Number(doctorAvailabilityId),
        booking_date: selectedBookingDate,
      });

      const resData = response?.data;

      if (resData?.success === true || resData?.isSuccess === true) {
        setShowConfirmModal(false);
        setShowSuccessModal(true);
        return;
      }

      toast(resData?.message || "Failed to book appointment");
    } catch (error) {
      console.error("BOOK APPOINTMENT ERROR:", error);
      toast("Something went wrong while booking appointment");
    } finally {
      setBookingLoading(false);
    }
  };

  const [symptoms, setSymptoms] = useState("");

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
                        : `${Number(doc.experience)} year${
                            Number(doc.experience) > 1 ? "s" : ""
                          }`}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-right">
                    <div className="text-lg font-semibold text-green-950 dark:text-cyan-50">
                      {todayFee ? `₹${todayFee} per visit` : ""}
                    </div>
                    <div
                      className={`text-xs ${
                        todayFee ? "pr-5" : "pl-3"
                      } text-gray-600 dark:text-cyan-10`}
                    >
                      {todayFee ? "(Today's Fee)" : "Doctor Unavailable today"}
                    </div>
                  </div>

                  <button
                    onClick={() => openCalendar(doc)}
                    className="mt-2 bg-cyan-600 text-white px-4 py-2 mr-3 rounded hover:bg-cyan-700"
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

                  const fullDate = `${year}-${String(month + 1).padStart(
                    2,
                    "0",
                  )}-${String(day).padStart(2, "0")}`;

                  const slotInfo =
                    selectedDoctor &&
                    doctorSlots[selectedDoctor.doctor_id]?.[fullDate];

                  return (
                    <div
                      key={day}
                      className="min-h-[60px] flex flex-col items-center justify-center border rounded-lg cursor-pointer hover:bg-cyan-100"
                      onClick={() => handleDateClick(fullDate, slotInfo)}
                    >
                      <span>{day}</span>

                      {slotInfo && (
                        <span className="text-[10px] text-cyan-700 text-center px-1">
                          {convertToAMPM(slotInfo.start_time || "")} -{" "}
                          {convertToAMPM(slotInfo.end_time || "")}
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

      {showConfirmModal && selectedDoctor && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-cyan-100/70 backdrop-blur-md border border-white/20 w-[420px] rounded-2xl p-6 shadow-xl">
            <h2 className="text-2xl flex items-center justify-center font-semibold text-cyan-700 mb-2">
              Confirm Booking
            </h2>

            <div className=" border w-90 border-cyan-400/30 mt-1 mb-2 ml-1 items-center"></div>

            <div className="space-y-2 text-sm text-gray-700 pl-2">
              <p className="text-cyan-950 flex items-center gap-2">
                  <span className="font-semibold">Doctor:</span>
                <span>
                  Dr. {selectedDoctor.first_name} {selectedDoctor.last_name}
                </span>
              </p>

              {selectedBookingSlot?.start_time &&
              selectedBookingSlot?.end_time ? (
                <>
                  <p className="text-cyan-950 flex items-center gap-1.5 ">
                    <span className="font-semibold"> Date: </span>{" "}
                    {formatDateForDisplay(selectedBookingDate)}
                  </p>
                  <p className="text-cyan-950 flex items-center gap-1.5">
                    <span className="font-semibold"> Time: </span>{" "}
                    {convertToAMPM(selectedBookingSlot.start_time)} -{" "}
                    {convertToAMPM(selectedBookingSlot.end_time)}
                  </p>
                  
                  <p className="text-cyan-950 flex items-center gap-1.5">
                    <span className="font-semibold">
                      Fees:
                    </span>
                    {selectedBookingSlot?.fee ?? "-"} /-
                  </p>
                </>
              ) : (
                <p className="text-orange-600 font-medium">
                  No slot information available for this date.
                </p>
              )}
            </div>

            <div className="mt-4">
              <p className="text-cyan-950 pb-1.5 pl-1.5"> Describe your symptoms</p>
              <textarea
                value={symptoms}
                onChange={(e) => {
                  if (e.target.value.length <= 350) {
                    setSymptoms(e.target.value);
                  }
                }}
                placeholder="(maximum 350 characters)"
                className="w-full text-[12px] bg-white/30 backdrop-blur-md rounded-xl p-3 text-left font-medium text-cyan-900 dark:text-cyan-50 min-h-[90px] resize-none focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />

              {/* Character Counter */}
              <div className="text-right text-[10px] text-gray-500 mt-1">
                {symptoms.length}/350
              </div>
            </div>            

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 rounded-lg border text-gray-700 hover:bg-gray-100"
                disabled={bookingLoading}
              >
                Cancel
              </button>

              <button
                onClick={handleConfirmBooking}
                className="px-4 py-2 rounded-lg bg-cyan-600 text-white hover:bg-cyan-700 disabled:opacity-60"
                disabled={bookingLoading}
              >
                {bookingLoading ? "Booking..." : "OK"}
              </button>
            </div>
          </div>
        </div>
      )}

      {showSuccessModal && selectedDoctor && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[60]">
          <div className="bg-white w-[420px] rounded-2xl p-6 shadow-2xl border text-center">

            <div className="w-10 h-10 rounded-full bg-green-600 text-white flex items-center justify-center mx-auto mb-3 shadow">
              ✓
            </div>

            <h2 className="text-2xl font-semibold text-green-700 mb-2">
              Booking Successful
            </h2>

            <p className="text-sm text-gray-700 mb-3">
              Your appointment with{" "}
              <span className="font-semibold">
                Dr. {selectedDoctor.first_name} {selectedDoctor.last_name}
              </span>{" "}
              has been booked successfully.
            </p>

            <p className="text-sm text-gray-600 mb-1">
              Date: {formatDateForDisplay(selectedBookingDate)}
            </p>

            <div className="border-t my-3"></div>

            <p className="text-base font-semibold text-gray-800 mb-5">
              Your slot will be assigned shortly! <br/>
              You can check your booking status in your "My appointment" section.
            </p>

            <button
              onClick={() => {
                setShowSuccessModal(false);
                setShowCalendar(false);
              }}
              className="px-6 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SpDoctorList;
