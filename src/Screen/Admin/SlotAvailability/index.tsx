import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CalendarDaysIcon } from "@heroicons/react/24/outline";

import type { RootState, AppDispatch } from "../../../../store/store";
import {
  fetchDoctorListThunk,
  setSelectedDoctor,
} from "../../../../store/slices/doctorSlice";
import { upsertSlotApi } from "../../../services/doctorApi";
import type { UpsertSlotPayload } from "../../../services/doctorApi";

import type { Doctor } from "../../../services/doctorApi";
import toast from "react-hot-toast";

const SlotAvailability = () => {
  const dispatch = useDispatch<AppDispatch>();


  const { doctors, selectedDoctor, slot } = useSelector(
    (state: RootState) => state.doctor
  );

  const [showCalendar, setShowCalendar] = useState(false);
  const [showSlotModal, setShowSlotModal] = useState(false);

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<number | null>(null);

      const [startHour, setStartHour] = useState("01");
      const [startMinute, setStartMinute] = useState("00");
      const [startPeriod, setStartPeriod] = useState("AM");

      const [endHour, setEndHour] = useState("01");
      const [endMinute, setEndMinute] = useState("00");
      const [endPeriod, setEndPeriod] = useState("AM");
  const [fee, setFee] = useState("");
  const [slotCount, setSlotCount] = useState(1);

  // store slots (local for instant UI)
const [slotData, setSlotData] = useState<
  Record<
    string,
    {
      slots: number;
      fee: string;
      start_time: string;
      end_time: string;
    }
  >
>({});

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();

  const monthName = currentDate.toLocaleString("default", {
    month: "long",
  });

  useEffect(() => {
    dispatch(fetchDoctorListThunk());
  }, [dispatch]);

const convertToAMPM = (time: string) => {
  if (!time) return "";

  const [h, m] = time.split(":");
  let hour = parseInt(h);

  const period = hour >= 12 ? "PM" : "AM";
  hour = hour % 12 || 12;

  return `${hour}:${m} ${period}`;
};

const convertTo24Hour = (hour: string, minute: string, period: string) => {
  let h = parseInt(hour);

  if (period === "PM" && h !== 12) h += 12;
  if (period === "AM" && h === 12) h = 0;

  return `${String(h).padStart(2, "0")}:${minute}`;
};

 const openCalendar = (doc: Doctor) => {
  dispatch(setSelectedDoctor(doc));
  setShowCalendar(true);

  const docSlots = slot[doc.doctor_id];
  if (docSlots) {
    const firstDate = Object.keys(docSlots)[0];
    if (firstDate) {
      setCurrentDate(new Date(firstDate));
    }
  }

  setSelectedDate(null);
  setFee("");
  setSlotCount(1);

  //FIX DEFAULT RESET
  setStartHour("01");
  setStartMinute("00");
  setStartPeriod("AM");

  setEndHour("01");
  setEndMinute("00");
  setEndPeriod("AM");
};

  const handleAddSlot = async () => {
    if (!selectedDoctor) {
      toast("Doctor not selected");
      return;
    }

    if (!selectedDate || !fee) {
      toast("Please select date and enter fee");
      return;
    }

  const start_time = convertTo24Hour(startHour, startMinute, startPeriod);
const end_time = convertTo24Hour(endHour, endMinute, endPeriod);

if (!start_time || !end_time) {
  toast("Please select start and end time");
  return;
}

if (start_time >= end_time) {
  toast("End time must be greater than start time");
  return;
}

    try {
      const formattedDate = `${year}-${String(month + 1).padStart(
        2,
        "0"
      )}-${String(selectedDate).padStart(2, "0")}`;

      const payload: UpsertSlotPayload = {
        doctor_id: selectedDoctor.doctor_id,
        date: formattedDate,
          start_time: start_time,
          end_time: end_time,
        slot_count: slotCount,
        fees: Number(fee),
      };

      const res = await upsertSlotApi(payload);

      if (res.data.success) {
        const key = formattedDate;

      
        setSlotData((prev) => ({
          ...prev,
          [key]: {
            slots: slotCount,
            fee,
            start_time: start_time,
            end_time: end_time
          },
        }));

        toast(res.data.message);

        setShowSlotModal(false);
        setSelectedDate(null);
        setStartHour("01");
        setStartMinute("00");
        setStartPeriod("AM");
        setEndHour("01");
        setEndMinute("00");
        setEndPeriod("AM");
        setFee("");
        setSlotCount(1);
      } else {
        toast(res.data.message);
      }
    } catch (error) {
      console.error(error);
      toast("Something went wrong");
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-semibold text-blue-600 mb-6">
        Doctor List
      </h2>

      <table className="w-full bg-white border rounded-xl">
        <thead className="bg-blue-50">
          <tr>
            <th className="p-4">Sl No.</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Specialization</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {doctors.map((doc, i) => (
            <tr key={doc.doctor_id} className="border-t">
              <td className="p-4">{i + 1}</td>
              <td>{doc.first_name}</td>
              <td>{doc.email}</td>
              <td>{doc.phone_no}</td>
              <td>{doc.specialization}</td>

              <td className="flex gap-3 justify-center p-4">
                <button
                  onClick={() => openCalendar(doc)}
                  className="p-2 bg-blue-100 rounded-full hover:bg-blue-200"
                >
                  <CalendarDaysIcon className="w-5 text-blue-600" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ================= CALENDAR ================= */}
      {showCalendar && selectedDoctor && (
        <div className="fixed inset-0 bg-black/30 flex items-start justify-center z-40 pt-24">
          <div className="bg-white w-[600px] rounded-2xl p-6 border shadow-lg">
            <div className="flex justify-between mb-4">
              <h2 className="font-semibold">
                Slot for Dr. {selectedDoctor.first_name}{" "}
                {selectedDoctor.middle_name} {selectedDoctor.last_name}
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
                  const key = `${year}-${String(month + 1).padStart(
                    2,
                    "0"
                  )}-${String(day).padStart(2, "0")}`;

                const slotInfo =
  slotData[key] ||
  (selectedDoctor &&
    slot[selectedDoctor.doctor_id]?.[key]);

                  return (
                    <div
  key={day}
  className={`h-16 flex flex-col items-center justify-center border rounded-lg cursor-pointer
  ${
    slotInfo
      ? "bg-green-50 border-green-400"
      : "hover:bg-blue-50"
  }`}
     // ✅ MAIN FIX HERE (LOAD DB DATA BEFORE OPEN MODAL)
      onClick={() => {
        const existingSlot =
          slotData[key] ||
          (selectedDoctor &&
            slot[selectedDoctor.doctor_id]?.[key]);

        if (existingSlot) {
          setSlotCount(existingSlot.slots);
          setFee(existingSlot.fee);

          // START TIME
          if (existingSlot.start_time) {
            const [h, m] = existingSlot.start_time.split(":").slice(0, 2);

            let hour = parseInt(h);
            const period = hour >= 12 ? "PM" : "AM";
            hour = hour % 12 || 12;

            setStartHour(String(hour).padStart(2, "0"));
            setStartMinute(m);
            setStartPeriod(period);
          }

          // END TIME
          if (existingSlot.end_time) {
            const [h, m] = existingSlot.end_time.split(":").slice(0, 2);

            let hour = parseInt(h);
            const period = hour >= 12 ? "PM" : "AM";
            hour = hour % 12 || 12;

            setEndHour(String(hour).padStart(2, "0"));
            setEndMinute(m);
            setEndPeriod(period);
          }

        } else {
          // DEFAULT VALUE
          setSlotCount(1);
          setFee("");

          setStartHour("01");
          setStartMinute("00");
          setStartPeriod("AM");

          setEndHour("01");
          setEndMinute("00");
          setEndPeriod("AM");
        }

        setSelectedDate(day);
        setShowSlotModal(true);
      }}
    >
      <span>{day}</span>

      {slotInfo && (
        <div className="text-center pointer-events-none">
          <span className="text-xs text-green-600 block">
            {slotInfo.slots} slots
          </span>

          <span className="text-xs text-gray-400 block">
            {convertToAMPM(slotInfo.start_time)} - {convertToAMPM(slotInfo.end_time)}
          </span>
        </div>
      )}
    </div>
  );
})}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= SLOT MODAL ================= */}
      {showSlotModal && selectedDate && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white w-[400px] p-6 rounded-xl border shadow-xl">
            <div className="flex justify-between mb-4">
              <h2 className="font-semibold">
                Add Slot - {selectedDate} {monthName}
              </h2>
              <button onClick={() => setShowSlotModal(false)}>✕</button>
            </div>

            <div className="flex justify-between mb-4 items-center">
              <span>Slots</span>

              <div className="flex border rounded overflow-hidden w-fit">
                <button
                  onClick={() => setSlotCount((s) => Math.max(1, s - 1))}
                  className="px-3 bg-gray-100"
                >
                  -
                </button>

                <input
                  type="number"
                  value={slotCount}
                  onChange={(e) => {
                    const value = Number(e.target.value);
                    if (value >= 1 || e.target.value === "") {
                      setSlotCount(value);
                    }
                  }}
                  onBlur={() => {
                    if (!slotCount || slotCount < 1) {
                      setSlotCount(1);
                    }
                  }}
                  className="w-12 text-center outline-none"
                />

                <button
                  onClick={() => setSlotCount((s) => s + 1)}
                  className="px-3 bg-gray-100"
                >
                  +
                </button>
              </div>
            </div>
<div className="flex gap-3 mb-4">

  {/* START TIME */}
  <div className="flex-1">
    <label className="block text-sm text-gray-600 mb-1">
      Start Time
    </label>

    <div className="flex gap-2 border rounded-lg px-3 py-2">
      <select
        value={startHour}
        onChange={(e) => setStartHour(e.target.value)}
        className="outline-none bg-transparent"
      >
        {[...Array(12)].map((_, i) => (
          <option key={i} value={String(i + 1).padStart(2, "0")}>
            {i + 1}
          </option>
        ))}
      </select>

      <span>:</span>

      <select
        value={startMinute}
        onChange={(e) => setStartMinute(e.target.value)}
        className="outline-none bg-transparent"
      >
        {[...Array(60)].map((_, i) => (
          <option key={i} value={String(i).padStart(2, "0")}>
            {String(i).padStart(2, "0")}
          </option>
        ))}
      </select>

      <select
        value={startPeriod}
        onChange={(e) => setStartPeriod(e.target.value)}
        className="outline-none bg-transparent"
      >
        <option value="AM">AM</option>
        <option value="PM">PM</option>
      </select>
    </div>
  </div>

  {/* END TIME */}
  <div className="flex-1">
    <label className="block text-sm text-gray-600 mb-1">
      End Time
    </label>

    <div className="flex gap-2 border rounded-lg px-3 py-2">
      <select
        value={endHour}
        onChange={(e) => setEndHour(e.target.value)}
        className="outline-none bg-transparent"
      >
        {[...Array(12)].map((_, i) => (
          <option key={i} value={String(i + 1).padStart(2, "0")}>
            {i + 1}
          </option>
        ))}
      </select>

      <span>:</span>

      <select
        value={endMinute}
        onChange={(e) => setEndMinute(e.target.value)}
        className="outline-none bg-transparent"
      >
        {[...Array(60)].map((_, i) => (
          <option key={i} value={String(i).padStart(2, "0")}>
            {String(i).padStart(2, "0")}
          </option>
        ))}
      </select>

      <select
        value={endPeriod}
        onChange={(e) => setEndPeriod(e.target.value)}
        className="outline-none bg-transparent"
      >
        <option value="AM">AM</option>
        <option value="PM">PM</option>
      </select>
    </div>
  </div>

</div>
            <div className="mb-4">
              <label className="block mb-1 text-sm text-gray-600">Fee</label>
              <input
                type="number"
                value={fee}
                onChange={(e) => setFee(e.target.value)}
                className="w-full border px-3 py-2 rounded"
                placeholder="Enter fee"
              />
            </div>

            <button
              onClick={() => {
                handleAddSlot();
                setShowSlotModal(false);
              }}
              className="w-full bg-blue-600 text-white py-2 rounded"
            >
              Save Slot
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SlotAvailability;