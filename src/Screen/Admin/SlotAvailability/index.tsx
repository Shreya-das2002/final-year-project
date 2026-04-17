import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MdCalendarToday } from "react-icons/md";
import { FaEnvelope, FaSearch, FaStethoscope } from "react-icons/fa";
import type { RootState, AppDispatch } from "../../../../store/store";
import {
  fetchDoctorListThunk,
  setSelectedDoctor,
} from "../../../../store/slices/doctorSlice";
import { upsertSlotApi } from "../../../services/doctorApi";
import type { UpsertSlotPayload } from "../../../services/doctorApi";
import type { Doctor } from "../../../services/doctorApi";
import toast from "react-hot-toast";
import { FiPhone } from "react-icons/fi";
import { HiArrowsUpDown } from "react-icons/hi2";
import { FaXmark } from "react-icons/fa6";

const SlotAvailability = () => {
  const dispatch = useDispatch<AppDispatch>();

  const ROW_COLORS = [
    "bg-gray-100 hover:bg-gray-200 dark:bg-gray-400/60",
    "bg-gray-50 hover:bg-gray-200 dark:bg-gray-300/100",
  ];

  const { doctors, selectedDoctor, slot } = useSelector(
    (state: RootState) => state.doctor
  );

  const [showCalendar, setShowCalendar] = useState(false);
  const [showSlotModal, setShowSlotModal] = useState(false);
  const [search, setSearch] = useState("");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc");

  const [startHour, setStartHour] = useState("01");
  const [startMinute, setStartMinute] = useState("00");
  const [startPeriod, setStartPeriod] = useState("AM");

  const [endHour, setEndHour] = useState("01");
  const [endMinute, setEndMinute] = useState("00");
  const [endPeriod, setEndPeriod] = useState("AM");

  const [fee, setFee] = useState("");
  const [slotCount, setSlotCount] = useState(1);

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
    dispatch(
      fetchDoctorListThunk({
        isPatientRoute: true,
      })
    );
  }, [dispatch]);

  const convertToAMPM = (time: string) => {
    if (!time) return "";

    const [h, m] = time.split(":");
    let hour = parseInt(h, 10);

    const period = hour >= 12 ? "PM" : "AM";
    hour = hour % 12 || 12;

    return `${hour}:${m} ${period}`;
  };

  const convertTo24Hour = (hour: string, minute: string, period: string) => {
    let h = parseInt(hour, 10);

    if (period === "PM" && h !== 12) h += 12;
    if (period === "AM" && h === 12) h = 0;

    return `${String(h).padStart(2, "0")}:${minute}`;
  };

  const today = new Date();
  const todayDate = `${today.getFullYear()}-${String(
    today.getMonth() + 1
  ).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  const formatDateToYMD = (date: Date) => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(date.getDate()).padStart(2, "0")}`;
  };

  const bookingStartDate = todayDate;

  const bookingEnd = new Date(today);
  bookingEnd.setMonth(bookingEnd.getMonth() + 1);
  const bookingEndDate = formatDateToYMD(bookingEnd);

  const [columnWidths, setColumnWidths] = useState({
    doctor_no: 130,
    name: 250,
    email: 300,
    phone_no: 250,
    specialization: 250,
    action: 130,
  });

  const resizingCol = useRef<keyof typeof columnWidths | null>(null);

  const startResize = (
    _e: React.MouseEvent<HTMLDivElement>,
    column: keyof typeof columnWidths
  ) => {
    resizingCol.current = column;
  };

  const stopResize = () => {
    resizingCol.current = null;
  };

  const resize = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!resizingCol.current) return;

    setColumnWidths((prev) => ({
      ...prev,
      [resizingCol.current!]: prev[resizingCol.current!] + e.movementX,
    }));
  };

  const resetSlotForm = () => {
    setSlotCount(1);
    setFee("");
    setStartHour("01");
    setStartMinute("00");
    setStartPeriod("AM");
    setEndHour("01");
    setEndMinute("00");
    setEndPeriod("AM");
  };

  const handleDateClick = (day: number, key: string) => {
    if (key < bookingStartDate || key > bookingEndDate) {
      return;
    }

    const existingSlot =
      slotData[key] ||
      (selectedDoctor && slot[selectedDoctor.doctor_id]?.[key]);

    if (existingSlot) {
      setSlotCount(Number(existingSlot.slots) || 1);
      setFee(String(existingSlot.fee ?? ""));

      if (existingSlot.start_time) {
        const [h, m] = existingSlot.start_time.split(":").slice(0, 2);

        let hour = parseInt(h, 10);
        const period = hour >= 12 ? "PM" : "AM";
        hour = hour % 12 || 12;

        setStartHour(String(hour).padStart(2, "0"));
        setStartMinute(m);
        setStartPeriod(period);
      }

      if (existingSlot.end_time) {
        const [h, m] = existingSlot.end_time.split(":").slice(0, 2);

        let hour = parseInt(h, 10);
        const period = hour >= 12 ? "PM" : "AM";
        hour = hour % 12 || 12;

        setEndHour(String(hour).padStart(2, "0"));
        setEndMinute(m);
        setEndPeriod(period);
      }
    } else {
      resetSlotForm();
    }

    setSelectedDate(day);
    setShowSlotModal(true);
  };

  const openCalendar = (doc: Doctor) => {
    dispatch(setSelectedDoctor(doc));
    setShowCalendar(true);

    const docSlots = slot?.[doc.doctor_id];
    if (docSlots) {
      const firstDate = Object.keys(docSlots)[0];
      if (firstDate) {
        setCurrentDate(new Date(firstDate));
      }
    }

    setSelectedDate(null);
    resetSlotForm();
  };

  const handleAddSlot = async () => {
    if (!selectedDoctor) {
      toast("Doctor not selected");
      return;
    }

    if (selectedDate === null || !fee) {
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
            end_time: end_time,
          },
        }));

        toast(res.data.message);

        setShowSlotModal(false);
        setSelectedDate(null);
        resetSlotForm();
      } else {
        toast(res.data.message);
      }
    } catch (error) {
      console.error(error);
      toast("Something went wrong");
    }
  };

  const filteredDoctors = (Array.isArray(doctors) ? doctors : [])
    .filter((doc) => {
      return (
        doc.first_name?.toLowerCase().includes(search.toLowerCase()) ||
        doc.middle_name?.toLowerCase().includes(search.toLowerCase()) ||
        doc.last_name?.toLowerCase().includes(search.toLowerCase()) ||
        doc.email?.toLowerCase().includes(search.toLowerCase()) ||
        doc.phone_no?.toLowerCase().includes(search.toLowerCase()) ||
        doc.specialization?.toLowerCase().includes(search.toLowerCase())
      );
    })
    .sort((a, b) => {
      return sortOrder === "desc"
        ? b.doctor_id - a.doctor_id
        : a.doctor_id - b.doctor_id;
    });

  return (
    <div
      className="relative p-6 bg-gradient-to-r from-slate-300 via-cyan-100 to-slate-300 dark:from-cyan-900 dark:via-slate-700 dark:to-cyan-900 min-h-screen"
      onMouseMove={resize}
      onMouseUp={stopResize}
    >
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold text-cyan-700 dark:text-gray-300">
            Slot Availability
          </h2>
        </div>

        <div className="p-6 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-lg">
          <div className="flex items-center justify-between gap-3 mb-4">
            {/* Search Bar */}
            <div className="flex items-center ml-auto gap-2">
              {/* Sort Button */}
              <button
                onClick={() =>
                  setSortOrder((prev) => (prev === "desc" ? "asc" : "desc"))
                }
                className="  flex items-center gap-1 px-3 py-2 ml-1 border border-cyan-600 dark:border-gray-200
                            rounded-4xl backdrop-blur-md bg-white/10 shadow-sm hover:bg-white/30 dark:hover:bg-white/20 transition"
              >
                <HiArrowsUpDown className=" text-cyan-700 dark:text-gray-100  w-5 h-5 " />
                <span className="text-sm font-semibold text-cyan-700 dark:text-gray-100">
                  Sort
                </span>
              </button>

              {/* Search Bar */}
              <div className="flex items-center w-[400px] border border-cyan-600 dark:border-gray-200 rounded-full px-4 py-2 shadow-sm backdrop-blur-md">
                <input
                  type="text"
                  placeholder="Search by name, email, or specialization..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="flex-1 outline-none text-sm bg-transparent text-gray-800 dark:text-gray-200 placeholder-gray-700 dark:placeholder-gray-200"
                />
                <FaSearch className="text-cyan-700 dark:text-gray-200 text-lg mr-2" />
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-2xl shadow-md">
            {/* SCROLL CONTAINER */}
            <div className="max-h-[450px] overflow-y-auto rounded-2xl">
              <table className="w-full text-left">
                <thead className="bg-cyan-600 text-gray-100 text-sm sticky top-0 z-10">
                  <tr className="divide-x divide-gray-100">
                    <th
                      style={{ width: columnWidths.doctor_no }}
                      className="p-4 relative"
                    >
                      Doctor ID
                      <div
                        className="absolute right-0 top-0 h-full w-2 cursor-col-resize"
                        onMouseDown={(e) => startResize(e, "doctor_no")}
                      />
                    </th>

                    <th
                      style={{ width: columnWidths.name }}
                      className="p-4 relative"
                    >
                      Name
                      <div
                        className="absolute right-0 top-0 h-full w-2 cursor-col-resize"
                        onMouseDown={(e) => startResize(e, "name")}
                      />
                    </th>

                    <th
                      style={{ width: columnWidths.email }}
                      className="p-4 relative"
                    >
                      Email
                      <div
                        className="absolute right-0 top-0 h-full w-2 cursor-col-resize"
                        onMouseDown={(e) => startResize(e, "email")}
                      />
                    </th>

                    <th
                      style={{ width: columnWidths.phone_no }}
                      className="p-4 relative"
                    >
                      Phone
                      <div
                        className="absolute right-0 top-0 h-full w-2 cursor-col-resize"
                        onMouseDown={(e) => startResize(e, "phone_no")}
                      />
                    </th>

                    <th
                      style={{ width: columnWidths.specialization }}
                      className="p-4 relative"
                    >
                      Specialization
                      <div
                        className="absolute right-0 top-0 h-full w-2 cursor-col-resize"
                        onMouseDown={(e) => startResize(e, "specialization")}
                      />
                    </th>

                    <th
                      style={{ width: columnWidths.action }}
                      className="p-4 relative"
                    >
                      Action
                      <div
                        className="absolute right-0 top-0 h-full w-2 cursor-col-resize"
                        onMouseDown={(e) => startResize(e, "action")}
                      />
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredDoctors.map((doc, index) => {
                    const color = ROW_COLORS[index % ROW_COLORS.length];

                    return (
                      <tr
                        key={doc.doctor_id}
                        className={`border-b border-gray-300 items-center ${color} transition duration-200`}
                      >
                        <td className=" pl-8 ">
                          <div className="flex gap-2 justify items-center">
                            {doc.doctor_no}
                          </div>
                        </td>

                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div
                              className="flex items-center justify-center w-8 h-8 text-sm rounded-full 
                        bg-cyan-600 dark:bg-cyan-700 text-white font-semibold shadow-sm cursor-pointer
                        transform transition-transform duration-300 ease-in-out hover:scale-103 dark:hover:scale-103"
                            >
                              {doc.first_name?.[0]}
                              {doc.last_name?.[0]}
                            </div>

                            <div>
                              {doc.first_name} {doc.middle_name ?? ""}{" "}
                              {doc.last_name}
                            </div>
                          </div>
                        </td>

                        <td className="p-4 ">
                          <div className="flex gap-2 justify items-center">
                            <FaEnvelope className="pt-1 text-xl text-cyan-600 dark:text-cyan-700" />
                            {doc.email}
                          </div>
                        </td>
                        <td className="p-4 ">
                          <div className="flex gap-2 justify items-center">
                            <FiPhone className="pt-1 text-lg text-cyan-600 dark:text-cyan-700" />
                            {doc.phone_no}
                          </div>
                        </td>
                        <td className="p-4 ">
                          <div className="flex gap-2 justify items-center">
                            <FaStethoscope className=" text-xs text-cyan-600 dark:text-cyan-700" />
                            {doc.specialization}
                          </div>
                        </td>

                        <td className="flex gap-3 justify-center p-4">
                          <button
                            onClick={() => openCalendar(doc)}
                            className="p-2 bg-blue-100 rounded-full hover:bg-blue-200"
                          >
                            <MdCalendarToday className="w-5 text-cyan-600" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* ================= CALENDAR ================= */}
        {showCalendar && selectedDoctor && (
          <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/40 p-6">
            <div className="w-[700px] max-w-[95vw] h-[500px] max-h-[90vh] rounded-2xl bg-white shadow-2xl border border-cyan-200 overflow-hidden flex flex-col -translate-y-4">
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4">
                <div>
                  <h2 className="font-semibold">
                    Slot for Dr. {selectedDoctor.first_name}{" "}
                    {selectedDoctor.middle_name} {selectedDoctor.last_name}
                  </h2>
                </div>

                <button
                  onClick={() => setShowCalendar(false)}
                  className="text-2xl text-red-700 hover:text-red-900 
                                hover:scale-105 transition"
                >
                  <FaXmark />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto">
                <div className="border border-cyan-200 m-2 mr-2.5 [scrollbar-gutter:stable]">
                  {/* Month Navigation */}
                  <div className="flex items-center justify-between px-6 py-4 border-b border-cyan-200 bg-cyan-100">
                    <button
                      onClick={() =>
                        setCurrentDate(new Date(year, month - 1, 1))
                      }
                      className="rounded-lg border  border-cyan-300 bg-white px-4 py-2 text-sm font-medium text-cyan-800 hover:bg-cyan-700 hover:border-cyan-800 hover:text-cyan-50 transition"
                    >
                      Previous
                    </button>

                    <h3 className="text-lg font-semibold text-cyan-900">
                      {monthName} {year}
                    </h3>

                    <button
                      onClick={() =>
                        setCurrentDate(new Date(year, month + 1, 1))
                      }
                      className="rounded-lg border border-cyan-300 bg-white px-4 py-2 text-sm font-medium text-cyan-800 hover:bg-cyan-700 hover:border-cyan-800 hover:text-cyan-50 transition"
                    >
                      Next
                    </button>
                  </div>

                  {/* Week Header */}
                  <div className="grid grid-cols-7 border-b border-cyan-200 bg-cyan-50">
                    {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                      (day) => (
                        <div
                          key={day}
                          className="border-r last:border-r-0 border-cyan-200 px-4 py-4 text-center text-sm font-semibold text-cyan-900"
                        >
                          {day}
                        </div>
                      )
                    )}
                  </div>

                  {/* Calendar Grid */}
                  <div className="grid grid-cols-7">
                    {[...Array(firstDay)].map((_, i) => (
                      <div
                        key={`empty-${i}`}
                        className="min-h-[50px] border-r border-b border-cyan-200 bg-cyan-50/40"
                      />
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

                      const isToday = key === todayDate;
                      const hasSlot = !!slotInfo;
                      const isWithinBookingRange =
                        key >= bookingStartDate && key <= bookingEndDate;

                      return (
                        <div
                          key={day}
                          className={`relative min-h-[80px] border-r border-b border-cyan-200 p-1 transition
                    ${
                      isWithinBookingRange
                        ? hasSlot
                          ? "cursor-pointer hover:bg-cyan-100"
                          : "bg-white cursor-pointer hover:bg-cyan-50"
                        : "bg-white cursor-not-allowed opacity-60"
                    }
                  `}
                          onClick={() =>
                            isWithinBookingRange && handleDateClick(day, key)
                          }
                        >
                          {/* Date */}
                          <div className="flex justify-end">
                            <span
                              className={`inline-flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold
                        ${
                          isToday
                            ? "bg-cyan-700 text-white"
                            : "text-cyan-900"
                        }
                      `}
                            >
                              {String(day).padStart(2, "0")}
                            </span>
                          </div>

                          {slotInfo && (
                            <div>
                              <div className="flex items-center gap-2 mb-2"></div>

                              <p className="text-[9.5px] text-cyan-700 mb-1 justify-center">
                                {convertToAMPM(slotInfo.start_time || "")} -{" "}
                                {convertToAMPM(slotInfo.end_time || "")}
                              </p>

                              <p className="text-[11px] font-medium text-emerald-700 pl-0.5">
                                {slotInfo.slots} slots
                              </p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= SLOT MODAL ================= */}
        {showSlotModal && selectedDate !== null && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white w-[400px] p-6 ml-25 mt-15 rounded-xl border shadow-xl">
              <div className="flex justify-between mb-4">
                <h2 className="font-semibold text-cyan-900">
                  Add Slot - {selectedDate} {monthName}
                </h2>
                <button
                  onClick={() => setShowSlotModal(false)}
                  className="text-2xl text-red-700 hover:text-red-900 
                                hover:scale-103 transition"
                >
                  <FaXmark />
                </button>
              </div>

              <div className="flex justify-between mb-4 text-cyan-800 items-center">
                <span>Slots:</span>

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
                        <option
                          key={i}
                          value={String(i + 1).padStart(2, "0")}
                        >
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
                        <option
                          key={i}
                          value={String(i).padStart(2, "0")}
                        >
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
                        <option
                          key={i}
                          value={String(i + 1).padStart(2, "0")}
                        >
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
                        <option
                          key={i}
                          value={String(i).padStart(2, "0")}
                        >
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
                <label className="block mb-1 text-sm text-cyan-800">
                  Fee:
                </label>
                <input
                  type="number"
                  value={fee}
                  onChange={(e) => setFee(e.target.value)}
                  className="w-full border px-3 py-2 rounded"
                  placeholder="Enter fee"
                />
              </div>

              <button
                onClick={handleAddSlot}
                className="w-full bg-cyan-600 hover:bg-cyan-800 text-white py-2 rounded-lg"
              >
                Save Slot
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SlotAvailability;