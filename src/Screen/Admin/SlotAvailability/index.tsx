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


const SlotAvailability = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { doctors, selectedDoctor } = useSelector(
    (state: RootState) => state.doctor
  );



  const [showCalendar, setShowCalendar] = useState(false);
  const [showSlotModal, setShowSlotModal] = useState(false);

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<number | null>(null);

  const [fee, setFee] = useState("");
  const [slotCount, setSlotCount] = useState(1);

  // store slots
  const [slotData, setSlotData] = useState<
    Record<string, { slots: number; fee: string }>
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

  const openCalendar = (doc: Doctor) => {
    dispatch(setSelectedDoctor(doc));
    setShowCalendar(true);

    setSelectedDate(null);
    setFee("");
    setSlotCount(1);
  };

const handleAddSlot = async () => {
  if (!selectedDoctor) {
    alert("Doctor not selected");
    return;
  }

  if (!selectedDate || !fee) {
    alert("Please select date and enter fee");
    return;
  }

  try {
    const formattedDate = `${year}-${String(month + 1).padStart(2, "0")}-${String(selectedDate).padStart(2, "0")}`;

    const payload: UpsertSlotPayload = {
      doctor_id: selectedDoctor.doctor_id,   
      date: formattedDate,                  
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
        },
      }));

      alert(res.data.message);

      // Reset
      setShowSlotModal(false);
      setSelectedDate(null);
      setFee("");
      setSlotCount(1);

    } else {
      alert(res.data.message);
    }

  } catch (error) {
    console.error(error);
    alert("Something went wrong");
  }
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
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ================= CALENDAR MODAL ================= */}
      {showCalendar && selectedDoctor && (
        <div className="fixed inset-0 bg-black/30 flex items-start justify-center z-40 pt-24">

          <div className="bg-white w-[600px] rounded-2xl p-6 border shadow-lg">

            {/* HEADER */}
            <div className="flex justify-between mb-4">
              <h2 className="font-semibold">
                Slot for Dr. {selectedDoctor.first_name}{" "}
                {selectedDoctor.middle_name} {selectedDoctor.last_name}
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
                  const key = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                  const slotInfo = slotData[key];

                  return (
                    <div
                      key={day}
                      onClick={() => {
                        setSelectedDate(day);
                        setFee("");
                        setSlotCount(1);
                        setShowSlotModal(true);
                      }}
                      className={`h-16 flex flex-col items-center justify-center border rounded-lg cursor-pointer
                      ${slotInfo ? "bg-green-50 border-green-400" : "hover:bg-blue-50"}
                      `}
                    >
                      <span>{day}</span>

                      {slotInfo && (
                        <span className="text-xs text-green-600">
                          {slotInfo.slots} slots
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

            {/* SLOT */}
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

            {/* FEE */}
            <div className="mb-4">
              <label className="block mb-1 text-sm text-gray-600">Fee</label>
              <input
                type="number"
                value={fee}
                onChange={(e)=>setFee(e.target.value)}
                className="w-full border px-3 py-2 rounded"
                placeholder="Enter fee"
              />
            </div>

            {/* SAVE */}
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