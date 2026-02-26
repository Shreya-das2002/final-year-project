import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  CalendarDaysIcon,
  CurrencyRupeeIcon,
} from "@heroicons/react/24/outline";

import type { RootState, AppDispatch } from "../../../../store/store";
import {
  fetchDoctorListThunk,
  setSelectedDoctor,
} from "../../../../store/slices/doctorSlice";

import type { Doctor } from "../../../services/doctorApi";

const SlotAvailability = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { doctors, selectedDoctor } = useSelector(
    (state: RootState) => state.doctor
  );

  const [showCalendar, setShowCalendar] = useState(false);
  const [showFeeModal, setShowFeeModal] = useState(false);

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<number | null>(null);

  const [fee, setFee] = useState("");
  const [slotCount, setSlotCount] = useState(1);

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

  const openCalendar = (doc: Doctor) => {
    dispatch(setSelectedDoctor(doc));
    setShowCalendar(true);
    setSelectedDate(null);
  };

  const openFeeModal = (doc: Doctor) => {
    dispatch(setSelectedDoctor(doc));
    setShowFeeModal(true);
  };

  const handleAddSlot = () => {
    if (!selectedDate || !fee) return;

    console.log("Saved:", {
      date: `${year}-${month + 1}-${selectedDate}`,
      fee,
      slotCount,
    });

    setFee("");
    setSlotCount(1);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">

      {/* HEADER */}
      <h2 className="text-2xl font-semibold text-blue-600 mb-6">
        Doctor List
      </h2>

      {/* TABLE */}
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

                <button
                  onClick={() => openFeeModal(doc)}
                  className="p-2 bg-green-100 rounded-full hover:bg-green-200"
                >
                  <CurrencyRupeeIcon className="w-5 text-green-600" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ================= CALENDAR MODAL ================= */}
      {showCalendar && selectedDoctor && (
        <div className="absolute top-16 left-0 right-0 bottom-0 bg-black/30 flex items-start justify-center z-20 pt-1">

          <div className="bg-white w-[600px] rounded-2xl p-6 border">

            {/* HEADER */}
            <div className="flex justify-between mb-4">
              <h2 className="font-semibold">
                {selectedDoctor.first_name}
              </h2>
              <button onClick={() => setShowCalendar(false)}>✕</button>
            </div>

            {/* CALENDAR */}
            <div className="border rounded-xl p-4">

              <div className="flex justify-between mb-3">
                <button onClick={() => setCurrentDate(new Date(year, month - 1))}>
                  ◀
                </button>

                <h3>{monthName} {year}</h3>

                <button onClick={() => setCurrentDate(new Date(year, month + 1))}>
                  ▶
                </button>
              </div>

              <div className="grid grid-cols-7 text-sm text-gray-400 text-center mb-2">
                {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map(d=>(
                  <div key={d}>{d}</div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-2">

                {[...Array(firstDay)].map((_,i)=>(
                  <div key={i}></div>
                ))}

                {[...Array(daysInMonth)].map((_,i)=>{
                  const day = i+1;
                  const isSelected = selectedDate === day;

                  return (
                    <div
                      key={day}
                      onClick={()=>setSelectedDate(day)}
                      className={`h-14 flex items-center justify-center border rounded-lg cursor-pointer

                      ${isSelected ? "bg-blue-600 text-white" : "hover:bg-blue-50"}
                      `}
                    >
                      {day}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* SLOT SECTION */}
            {selectedDate && (
              <div className="mt-5 border-t pt-4">

                <h4 className="mb-3">
                  Add Slot for {selectedDate} {monthName}
                </h4>


                <div className="flex justify-between mb-4">
                  <span>Slots</span>

                  <div className="flex border rounded">
                    <button onClick={()=>setSlotCount(s=>Math.max(1,s-1))}>-</button>
                    <input value={slotCount} readOnly className="w-10 text-center" />
                    <button onClick={()=>setSlotCount(s=>s+1)}>+</button>
                  </div>
                </div>

                <button
                  onClick={handleAddSlot}
                  className="w-full bg-blue-600 text-white py-2 rounded"
                >
                  Add Slot
                </button>

              </div>
            )}

          </div>
        </div>
      )}

      {/* ================= FEE MODAL ================= */}
      {showFeeModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

          <div className="bg-white w-[350px] p-6 rounded-xl border">

            <div className="flex justify-between mb-4">
              <h2>Set Fee</h2>
              <button onClick={()=>setShowFeeModal(false)}>✕</button>
            </div>

            <input
              type="number"
              value={fee}
              onChange={(e)=>setFee(e.target.value)}
              className="w-full border px-4 py-2 rounded mb-4"
            />

            <button className="w-full bg-green-600 text-white py-2 rounded">
              Save Fee
            </button>

          </div>
        </div>
      )}

    </div>
  );
};

export default SlotAvailability;