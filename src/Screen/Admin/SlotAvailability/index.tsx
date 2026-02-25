import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CalendarDaysIcon } from "@heroicons/react/24/outline";

import type { RootState, AppDispatch } from "../../../../store/store";
import {
  fetchDoctorListThunk,
  setSelectedDoctor,
} from "../../../../store/slices/doctorSlice";

import type { Doctor } from "../../../services/doctorApi";

/* ================= TYPES ================= */

interface Slot {
  date: string;
  fee: number;
}

/* ================= COMPONENT ================= */

const SlotAvailability = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { doctors, loading, selectedDoctor } = useSelector(
    (state: RootState) => state.doctor
  );

  const [search, setSearch] = useState("");
  const [showCalendar, setShowCalendar] = useState(false);

  /* Calendar */
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<number | null>(null);

  /* Slot */
  const [fee, setFee] = useState("");
  const [slotCount, setSlotCount] = useState(1);
  const [slots, setSlots] = useState<Record<string, Slot[]>>({});

  /* ================= DATE ================= */

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();

  const monthName = currentDate.toLocaleString("default", {
    month: "long",
  });

  /* ================= FETCH ================= */

  useEffect(() => {
    dispatch(fetchDoctorListThunk());
  }, [dispatch]);

  /* ================= FILTER ================= */

  const filteredDoctors = useMemo(() => {
    const q = search.toLowerCase();

    return doctors.filter((doc) => {
      const fullName = `${doc.first_name} ${doc.middle_name ?? ""} ${doc.last_name}`.toLowerCase();

      return (
        fullName.includes(q) ||
        (doc.email ?? "").toLowerCase().includes(q) ||
        (doc.phone_no ?? "").includes(q) ||
        (doc.specialization ?? "").toLowerCase().includes(q)
      );
    });
  }, [doctors, search]);

  /* ================= HANDLERS ================= */

  const openCalendar = (doc: Doctor) => {
    dispatch(setSelectedDoctor(doc));
    setShowCalendar(true);
    setSelectedDate(null);
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleDateClick = (day: number) => {
    setSelectedDate(day);
  };

  const increaseSlot = () => setSlotCount((prev) => prev + 1);

  const decreaseSlot = () =>
    setSlotCount((prev) => (prev > 1 ? prev - 1 : 1));

  const handleAddSlot = () => {
    if (!selectedDate || !fee) return;

    const dateKey = `${year}-${String(month + 1).padStart(2, "0")}-${String(selectedDate).padStart(2, "0")}`;

    const newSlots: Slot[] = Array.from({ length: slotCount }, () => ({
      date: dateKey,
      fee: Number(fee),
    }));

    setSlots((prev) => ({
      ...prev,
      [dateKey]: [...(prev[dateKey] || []), ...newSlots],
    }));

    setFee("");
    setSlotCount(1);
  };

  /* ================= UI ================= */

  return (
    <div className="p-6 bg-gray-50 min-h-screen rounded-xl">

      {/* HEADER */}
      <div className="flex justify-between mb-6">
        <h2 className="text-2xl font-semibold text-blue-600">
          Doctor List
        </h2>

        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-72 px-4 py-2 border rounded-full"
        />
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-blue-50">
            <tr>
              <th className="p-4">Sl No.</th>
              <th className="p-4">Name</th>
              <th className="p-4">Email</th>
              <th className="p-4">Phone</th>
              <th className="p-4">Specialization</th>
              <th className="p-4 text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {!loading &&
              filteredDoctors.map((doc, i) => (
                <tr key={doc.doctor_id} className="border-t">
                  <td className="p-4">{i + 1}</td>
                  <td className="p-4">
                    {doc.first_name} {doc.last_name}
                  </td>
                  <td className="p-4">{doc.email}</td>
                  <td className="p-4">{doc.phone_no}</td>
                  <td className="p-4">{doc.specialization}</td>

                  <td className="p-4 text-center">
                    <button
                      onClick={() => openCalendar(doc)}
                      className="p-2 bg-blue-50 rounded-full"
                    >
                      <CalendarDaysIcon className="w-6 h-6 text-blue-600" />
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* ================= MODAL ================= */}

      {showCalendar && selectedDoctor && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

          <div className="bg-white w-[420px] rounded-2xl p-6 shadow-2xl">

            {/* HEADER */}
            <div className="flex justify-between mb-4">
              <h2 className="font-semibold">
                {selectedDoctor.first_name}
              </h2>
              <button onClick={() => setShowCalendar(false)}>✕</button>
            </div>

            {/* CALENDAR */}
            <div className="bg-gray-50 rounded-2xl p-5">

              {/* NAV */}
              <div className="flex justify-between mb-4">
                <button onClick={handlePrevMonth}>◀</button>
                <h3>{monthName} {year}</h3>
                <button onClick={handleNextMonth}>▶</button>
              </div>

              {/* WEEK */}
              <div className="grid grid-cols-7 text-sm text-gray-400 mb-2">
                {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map(d=>(
                  <div key={d}>{d}</div>
                ))}
              </div>

              {/* DAYS */}
              <div className="grid grid-cols-7 gap-y-2">

                {[...Array(firstDayOfMonth)].map((_,i)=>(
                  <div key={i}></div>
                ))}

                {[...Array(daysInMonth)].map((_,i)=>{
                  const day = i+1;

                  const today = new Date();
                  const isToday =
                    day === today.getDate() &&
                    month === today.getMonth() &&
                    year === today.getFullYear();

                  const isSelected = selectedDate === day;

                  const dateKey = `${year}-${String(month+1).padStart(2,"0")}-${String(day).padStart(2,"0")}`;
                  const slotCountForDay = slots[dateKey]?.length || 0;

                  return (
                    <div
                      key={day}
                      onClick={()=>handleDateClick(day)}
                      className={`relative w-10 h-10 flex items-center justify-center rounded-xl cursor-pointer

                      ${
                        isSelected
                          ? "bg-red-500 text-white"
                          : isToday
                          ? "bg-blue-100 text-blue-600"
                          : "hover:bg-gray-200"
                      }

                      ${slotCountForDay ? "border border-green-500" : ""}
                      `}
                    >
                      {day}

                      {/* SLOT COUNT BADGE */}
                      {slotCountForDay > 0 && (
                        <span className="absolute top-0 right-0 text-[10px] bg-green-500 text-white px-1 rounded-full">
                          {slotCountForDay}
                        </span>
                      )}
                    </div>
                  );
                })}

              </div>
            </div>

            {/* SLOT SECTION */}
            {selectedDate && (
              <div className="mt-4">

                {/* FEE */}
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-sm font-medium">Fee:</span>
                  <input
                    type="number"
                    value={fee}
                    onChange={(e)=>setFee(e.target.value)}
                    className="border px-3 py-2 rounded w-24"
                  />
                </div>

                {/* SLOT COUNT */}
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-sm font-medium">Slots:</span>

                  <div className="flex items-center border rounded-lg overflow-hidden">
                    <button onClick={decreaseSlot} className="px-3 py-1 bg-gray-100">-</button>

                    <input
                      type="number"
                      value={slotCount}
                      onChange={(e)=>setSlotCount(Number(e.target.value) || 1)}
                      className="w-14 text-center outline-none"
                      min={1}
                    />

                    <button onClick={increaseSlot} className="px-3 py-1 bg-gray-100">+</button>
                  </div>
                </div>

                {/* ADD BUTTON */}
                <button
                  onClick={handleAddSlot}
                  className="bg-green-500 text-white px-4 py-2 rounded w-full"
                >
                  Add Slot
                </button>

              </div>
            )}

          </div>
        </div>
      )}
    </div>
  );
};

export default SlotAvailability;