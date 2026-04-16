import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AdjustmentsHorizontalIcon, EyeIcon } from "@heroicons/react/24/outline";
import { FaSearch } from "react-icons/fa";
import { MdCalendarToday } from "react-icons/md";
import type { RootState, AppDispatch } from "../../../../store/store";
import { fetchAppointmentsThunk } from "../../../../store/slices/appointmentSlice";
import { HiArrowsUpDown } from "react-icons/hi2";
import { useNavigate } from "react-router-dom";
import { FaXmark } from "react-icons/fa6";
import { DocumentTextIcon } from "@heroicons/react/24/solid";

/* ================= COLUMN KEY TYPE ================= */

type ColumnKey =
  | "appointment_id"
  | "patient_name"
  | "patient_gender"
  | "patient_phone"
  | "patient_email"
  | "slot_time"
  | "appointment_date"
  | "appointment_time"
  | "status"
  | "action";

const DoctorAppointments = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { appointments, loading } = useSelector(
    (state: RootState) => state.appointment
  );

  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc");

  /* ================= COLUMN WIDTH STATE ================= */

  const [columnWidths, setColumnWidths] = useState<Record<ColumnKey, number>>({
    appointment_id: 250,
    patient_name: 350,
    patient_gender: 250,
    patient_phone: 250,
    patient_email: 250,
    slot_time: 250,
    appointment_date: 150,
    appointment_time: 170,
    status: 100,
    action: 150,
  });

  const resizingCol = useRef<ColumnKey | null>(null);
  const filterRef = useRef<HTMLDivElement | null>(null);

  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [tempSelectedDate, setTempSelectedDate] = useState("");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [openSection, setOpenSection] = useState<"status" | "">("");

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

  const handleDateClick = (fullDate: string) => {
    setTempSelectedDate(fullDate);
    setShowConfirmModal(true);
  };

  const handleConfirmDate = () => {
    setSelectedDate(tempSelectedDate);
    setShowConfirmModal(false);
    setIsCalendarOpen(false);
  };

  const handleCancelDate = () => {
    setShowConfirmModal(false);
    setTempSelectedDate("");
  };

  const startResize = (
    _e: React.MouseEvent<HTMLDivElement>,
    column: ColumnKey
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

  /* ================= FETCH APPOINTMENTS ================= */
  const hasFetched = useRef(false);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    dispatch(fetchAppointmentsThunk());
  }, [dispatch]);

  /* ================= CLOSE FILTER ON OUTSIDE CLICK ================= */
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        filterRef.current &&
        !filterRef.current.contains(event.target as Node)
      ) {
        setShowFilter(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  /* ================= STATUS OPTIONS FROM booking_status ================= */
  const statusOptions = Array.from(
    new Set(
      (Array.isArray(appointments) ? appointments : [])
        .map((item) => item?.booking_status)
        .filter((status): status is string => Boolean(status && status.trim()))
    )
  );

  /* ================= FILTER APPOINTMENTS (SEARCH + DATE + STATUS) ================= */
  const filteredAppointments = (
    Array.isArray(appointments) ? appointments : []
  )
    .filter((appointment) => {
      const statusName = appointment.booking_status || "";
      const patientName = appointment.patient_name || "-";
      const phone = appointment.patient_phone || "";
      const email = appointment.patient_email || "";
      const appointmentDate = appointment.appointment_date || "";
      const appointmentTime = appointment.appointment_time || "";

      const matchesStatus =
        !statusFilter ||
        statusName.toLowerCase() === statusFilter.toLowerCase();

      const normalizedAppointmentDate =
        typeof appointmentDate === "string" && appointmentDate.includes("T")
          ? appointmentDate.split("T")[0]
          : appointmentDate;

      const matchesDate =
        !selectedDate || normalizedAppointmentDate === selectedDate;

      const matchesSearch =
        !search ||
        String(appointment.appointment_id || "")
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        String(patientName).toLowerCase().includes(search.toLowerCase()) ||
        String(phone).toLowerCase().includes(search.toLowerCase()) ||
        String(appointmentDate).toLowerCase().includes(search.toLowerCase()) ||
        String(appointmentTime).toLowerCase().includes(search.toLowerCase()) ||
        String(statusName).toLowerCase().includes(search.toLowerCase()) ||
        String(email).toLowerCase().includes(search.toLowerCase());

      return matchesDate && matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      const dateA = a.appointment_date
        ? new Date(a.appointment_date).getTime()
        : 0;
      const dateB = b.appointment_date
        ? new Date(b.appointment_date).getTime()
        : 0;

      return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
    });

  /* ================= UI ================= */

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
          Appointments
        </h2>
      </div>

      {/* SEARCH */}
      <div className="p-6 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-lg">
        <div className="flex items-center justify-between gap-3 mb-4">
          {/* Sort Button */}
          <div className="flex items-center justify-between gap-2 ">

              <button
            onClick={() => setShowFilter(!showFilter)}
            className="flex items-center gap-1 px-3 py-2 ml-1 border border-cyan-600 dark:border-gray-200 rounded-4xl backdrop-blur-md bg-white/10 shadow-sm hover:bg-white/30 dark:hover:bg-white/20 transition"
          >
            <AdjustmentsHorizontalIcon className="text-cyan-700 dark:text-gray-100 w-5 h-5" />
            <span className="text-sm font-semibold text-cyan-700 dark:text-gray-100">
              Filter
            </span>
          </button>

            <button
              onClick={() =>
                setSortOrder((prev) => (prev === "desc" ? "asc" : "desc"))
              }
              className="flex items-center gap-1 px-3 py-2 ml-1 border border-cyan-600 dark:border-gray-200 rounded-4xl backdrop-blur-md bg-white/10 shadow-sm hover:bg-white/30 dark:hover:bg-white/20 transition"
            >
              <HiArrowsUpDown className="text-cyan-700 dark:text-gray-100 w-5 h-5" />
              <span className="text-sm font-semibold text-cyan-700 dark:text-gray-100">
                Sort
              </span>
            </button>
          </div>


         {/* Calendar */}
          <button
            onClick={() => setIsCalendarOpen(true)}
            className="flex items-center gap-1 px-3 py-2 ml-1 border border-cyan-600 dark:border-gray-200 rounded-4xl backdrop-blur-md bg-white/10 shadow-sm hover:bg-white/30 dark:hover:bg-white/20 transition"
          >
            <MdCalendarToday className="text-cyan-700 dark:text-gray-100 w-5 h-5" />
          </button>

          {/* Search Bar */}
          <div className="flex items-center ml-auto gap-2">
            <div className="flex items-center w-[400px] border border-cyan-600 dark:border-gray-200 rounded-full px-4 py-2 shadow-sm backdrop-blur-md">
              <input
                type="text"
                placeholder="Search by name, email, or no..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 outline-none text-sm bg-transparent text-gray-800 dark:text-gray-200 placeholder-gray-700 dark:placeholder-gray-200"
              />
              <FaSearch className="text-cyan-700 dark:text-gray-200 text-lg mr-2" />
            </div>
          </div>
        </div>

        {/* DROPDOWN FILTER BOX */}
        {showFilter && (
          <div
            ref={filterRef}
            className="absolute mt-2 w-64 bg-white dark:bg-cyan-950 rounded-xl shadow-xl border border-gray-200 dark:border-cyan-700 p-4 z-50"
          >
            {/* STATUS HEADER */}
            <button
              onClick={() =>
                setOpenSection(openSection === "status" ? "" : "status")
              }
              className="w-full text-left px-3 py-2 font-semibold bg-gray-100 dark:bg-gray-600 text-black dark:text-white hover:bg-gray-300 dark:hover:bg-gray-500 rounded-lg mb-2"
            >
              Status
            </button>

            {/* STATUS OPTIONS */}
            {openSection === "status" && (
              <div className="flex flex-col gap-2 mb-3 max-h-56 overflow-y-auto">
                {statusOptions.length > 0 ? (
                  statusOptions.map((status) => (
                    <button
                      key={status}
                      onClick={() => setStatusFilter(status)}
                      className={`px-3 py-2 rounded-lg text-sm text-left ${
                        statusFilter === status
                          ? "bg-cyan-600 dark:bg-cyan-800 text-white"
                          : "bg-gray-200 dark:bg-slate-500 text-black dark:text-white hover:bg-cyan-500 dark:hover:bg-cyan-700"
                      }`}
                    >
                      {status}
                    </button>
                  ))
                ) : (
                  <p className="text-sm text-gray-500 px-2">No status found</p>
                )}
              </div>
            )}

            <button
              onClick={() => setShowFilter(false)}
              className="w-full py-2 bg-cyan-600 dark:bg-cyan-700 text-white rounded-lg mb-2 hover:bg-cyan-800 dark:hover:bg-cyan-500"
            >
              Apply Filters
            </button>

            <button
              onClick={() => {
                setStatusFilter("");
                setSearch("");
                setShowFilter(false);
              }}
              className="w-full py-2 bg-gray-200 dark:bg-slate-400 text-black dark:text-white rounded-lg hover:bg-gray-400 dark:hover:bg-gray-300"
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-md">
          <div className="max-h-[450px] overflow-y-auto rounded-2xl">
            <table className="w-full text-left">
              <thead className="bg-cyan-600 text-gray-100 text-sm sticky top-0 z-10">
                <tr className="divide-x divide-gray-100">
                  <th
                    style={{ width: columnWidths.appointment_id }}
                    className="p-4 relative"
                  >
                    Appointment No.
                    <div
                      className="absolute right-0 top-0 h-full w-2 cursor-col-resize"
                      onMouseDown={(e) => startResize(e, "appointment_id")}
                    />
                  </th>

                  <th
                    style={{ width: columnWidths.patient_name }}
                    className="p-4 relative"
                  >
                    Patient Name
                    <div
                      className="absolute right-0 top-0 h-full w-2 cursor-col-resize"
                      onMouseDown={(e) => startResize(e, "patient_name")}
                    />
                  </th>

                  <th
                    style={{ width: columnWidths.patient_gender }}
                    className="p-4 relative"
                  >
                    Gender
                    <div
                      className="absolute right-0 top-0 h-full w-2 cursor-col-resize"
                      onMouseDown={(e) => startResize(e, "patient_gender")}
                    />
                  </th>

                  <th
                    style={{ width: columnWidths.patient_phone }}
                    className="p-4 relative"
                  >
                    Phone Number
                    <div
                      className="absolute right-0 top-0 h-full w-2 cursor-col-resize"
                      onMouseDown={(e) => startResize(e, "patient_phone")}
                    />
                  </th>

                  <th
                    style={{ width: columnWidths.patient_email }}
                    className="p-4 relative"
                  >
                    Email
                    <div
                      className="absolute right-0 top-0 h-full w-2 cursor-col-resize"
                      onMouseDown={(e) => startResize(e, "patient_email")}
                    />
                  </th>

                  <th
                    style={{ width: columnWidths.slot_time }}
                    className="p-4 relative"
                  >
                    Slot Time
                    <div
                      className="absolute right-0 top-0 h-full w-2 cursor-col-resize"
                      onMouseDown={(e) => startResize(e, "slot_time")}
                    />
                  </th>

                  <th
                    style={{ width: columnWidths.appointment_date }}
                    className="p-4 relative"
                  >
                    Appointment Date
                    <div
                      className="absolute right-0 top-0 h-full w-2 cursor-col-resize"
                      onMouseDown={(e) => startResize(e, "appointment_date")}
                    />
                  </th>

                  <th
                    style={{ width: columnWidths.appointment_time }}
                    className="p-4 relative"
                  >
                    Appointment Time
                    <div
                      className="absolute right-0 top-0 h-full w-2 cursor-col-resize"
                      onMouseDown={(e) => startResize(e, "appointment_time")}
                    />
                  </th>

                  <th
                    style={{ width: columnWidths.status }}
                    className="p-4 relative"
                  >
                    Status
                    <div
                      className="absolute right-0 top-0 h-full w-2 cursor-col-resize"
                      onMouseDown={(e) => startResize(e, "status")}
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

              <tbody className="text-sm text-gray-700">
                {loading && (
                  <tr>
                    <td colSpan={10} className="p-6 text-center">
                      Loading...
                    </td>
                  </tr>
                )}

                {!loading && filteredAppointments.length === 0 && (
                  <tr>
                    <td colSpan={10} className="p-6 text-center text-gray-500">
                      No appointments found
                    </td>
                  </tr>
                )}

                {!loading &&
                  filteredAppointments.map((app) => {
                    return (
                      <tr
                        key={app.appointment_id}
                        className="border-b border-gray-300 items-center transition duration-200"
                      >
                        <td className="p-4">
                          <div className="flex gap-2 justify-center items-center">
                            {app.appointment_no || "-"}
                          </div>
                        </td>

                        <td className="p-4">
                          {app.patient_name || "-"}
                        </td>

                        <td className="p-4">
                          {app.patient_gender || "-"}
                        </td>

                        <td className="p-4">
                          <div className="flex gap-2 justify items-center">
                            {app.patient_phone || "-"}
                          </div>
                        </td>

                        <td className="p-4">
                          <div className="flex gap-2 justify items-center">
                            {app.patient_email || "-"}
                          </div>
                        </td>

                        <td className="p-4">
                          <div className="flex gap-2 justify items-center">
                            {app.doc_slot || "-"}
                          </div>
                        </td>

                        <td className="p-4">
                          <div className="flex gap-2 justify items-center">
                            {app.appointment_date || "-"}
                          </div>
                        </td>

                        <td className="p-4">
                          <div className="flex gap-2 justify items-center">
                            {app.appointment_time || "Not Generated"}
                          </div>
                        </td>

                        <td className="p-4">
                          <div className="flex gap-2 justify items-center">
                            {app.booking_status || "-"}
                          </div>
                        </td>

                        <td className="p-4">
                          <div className="flex justify-center gap-4">
                            <button
                              onClick={() => {
                                navigate(
                                  `/doctor/appointments/appointment_details/${app.appointment_id}`,
                                  { state: app }
                                );
                              }}
                              type="button"
                              className="text-blue-600 hover:text-blue-800"
                              title="View Doctor"
                            >
                              <EyeIcon className="w-5 h-5" />
                              
                            </button>
                            
                    {app.booking_status?.toLowerCase() === "consultation completed".toLowerCase() && (
                          <button
                            onClick={() => {
                              navigate(`/doctor/appointments/prescription/${app.appointment_id}`, { state: app });
                            }}
                            type="button"
                            className="text-green-600 hover:text-green-800"
                            title="Generate Prescription"
                          >
                            <DocumentTextIcon className="w-5 h-5" />
                          </button>
                        )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
              {selectedDate && (
          <div className="mb-4 text-sm font-medium text-cyan-800 dark:text-gray-200">
            Selected Date: {selectedDate}
          </div>
        )}

                {isCalendarOpen && (
            <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/40 p-6">
              <div className="w-[700px] max-w-[95vw] h-[500px] max-h-[90vh] rounded-2xl  mt-10 bg-white shadow-2xl border border-cyan-200 overflow-hidden flex flex-col -translate-y-4">
                
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4">
                  <div>
                    <h2 className="font-semibold text-cyan-900">Select Date</h2>
                  </div>
          
                  <button
                    onClick={() => {
                      setIsCalendarOpen(false);
                      setShowConfirmModal(false);
                      setTempSelectedDate("");
                    }}
                    className="text-2xl text-red-700 hover:text-red-900 hover:scale-105 transition"
                  >
                    <FaXmark />
                  </button>
                </div>
          
                <div className="flex-1 overflow-y-auto">
                  <div className="border border-cyan-200 m-2 mr-2.5 [scrollbar-gutter:stable]">
                    
                    {/* Month Navigation */}
                    <div className="flex items-center justify-between px-6 py-4 border-b border-cyan-200 bg-cyan-100">
                      <button
                        onClick={() => setCurrentDate(new Date(year, month - 1, 1))}
                        className="rounded-lg border border-cyan-300 bg-white px-4 py-2 text-sm font-medium text-cyan-800 hover:bg-cyan-700 hover:border-cyan-800 hover:text-cyan-50 transition"
                      >
                        Previous
                      </button>
          
                      <h3 className="text-lg font-semibold text-cyan-900">
                        {monthName} {year}
                      </h3>
          
                      <button
                        onClick={() => setCurrentDate(new Date(year, month + 1, 1))}
                        className="rounded-lg border border-cyan-300 bg-white px-4 py-2 text-sm font-medium text-cyan-800 hover:bg-cyan-700 hover:border-cyan-800 hover:text-cyan-50 transition"
                      >
                        Next
                      </button>
                    </div>
          
                    {/* Week Header */}
                    <div className="grid grid-cols-7 border-b border-cyan-200 bg-cyan-50">
                      {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                        <div
                          key={day}
                          className="border-r last:border-r-0 border-cyan-200 px-4 py-4 text-center text-sm font-semibold text-cyan-900"
                        >
                          {day}
                        </div>
                      ))}
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
          
                        const fullDate = `${year}-${String(month + 1).padStart(
                          2,
                          "0"
                        )}-${String(day).padStart(2, "0")}`;
          
                        const isToday = fullDate === todayDate;
                        const isSelected = fullDate === selectedDate;
                        const isTempSelected = fullDate === tempSelectedDate;
          
                        return (
                          <div
                            key={day}
                            className={`relative min-h-[80px] border-r border-b border-cyan-200 p-1 transition cursor-pointer
                              ${
                                isSelected
                                  ? "bg-cyan-600 text-white"
                                  : isTempSelected
                                  ? "bg-cyan-200 text-cyan-900"
                                  : isToday
                                  ? "bg-cyan-50 border-cyan-400 hover:bg-cyan-100"
                                  : "bg-white hover:bg-cyan-50"
                              }`}
                            onClick={() => handleDateClick(fullDate)}
                          >
                            <div className="flex justify-end">
                              <span
                                className={`inline-flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold
                                  ${
                                    isToday
                                      ? "bg-cyan-700 text-white"
                                      : isSelected
                                      ? "text-white"
                                      : "text-cyan-900"
                                  }`}
                              >
                                {String(day).padStart(2, "0")}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
          
                {/* Footer */}
                <div className="flex justify-between px-4 py-3 border-t border-cyan-200 bg-white">
                  <button
                    onClick={() => {
                      setSelectedDate("");
                      setTempSelectedDate("");
                    }}
                    className="px-4 py-2 rounded-lg border border-red-400 text-red-600 hover:bg-red-50"
                  >
                    Clear
                  </button>
                </div>
              </div>
            </div>
          )}
      

        {showConfirmModal && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white w-[360px] rounded-2xl p-6 shadow-lg border">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Select Date
              </h3>

              <p className="text-sm text-gray-600 mb-6">
                Show appointments for{" "}
                <span className="font-semibold">{tempSelectedDate}</span>?
              </p>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={handleCancelDate}
                  className="px-4 py-2 rounded-lg border text-gray-700 hover:bg-gray-100"
                >
                  Cancel
                </button>

                <button
                  onClick={handleConfirmDate}
                  className="px-4 py-2 rounded-lg bg-cyan-600 text-white hover:bg-cyan-700 disabled:opacity-60"
                >
                  Ok
                </button>
              </div>
            </div>
          </div>
        )}
    </div>
    </div>
  );
};

export default DoctorAppointments;