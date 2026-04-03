// import { useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { EyeIcon } from "@heroicons/react/24/outline";
import { FaSearch } from "react-icons/fa";
import { MdCalendarToday } from "react-icons/md";
import type { RootState, AppDispatch } from "../../../../store/store";
import { fetchAppointmentsThunk } from "../../../../store/slices/appointmentSlice";
import { HiArrowsUpDown } from "react-icons/hi2";


/* ================= COLUMN KEY TYPE ================= */

type ColumnKey = "appointment_id" | "patient_name" | "patient_gender" | "patient_phone" | "patient_email" | "appointment_date" | "appointment_time" | "status" | "action";



const DoctorAppointments = () => {

  const dispatch = useDispatch<AppDispatch>();
  // const navigate = useNavigate();


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
      appointment_date: 150,
      appointment_time: 170,
      status: 100,
      action: 150
    });
  
    const resizingCol = useRef<ColumnKey | null>(null);
  
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
        [resizingCol.current!]: prev[resizingCol.current!] + e.movementX
      }));
    };
  

  


    /* ================= FETCH APPOINTMENTS ================= */
const hasFetched = useRef(false);

useEffect(() => {
  if (hasFetched.current) return;
  hasFetched.current = true;

  dispatch(fetchAppointmentsThunk());
}, [dispatch]);



/* ================= FILTER APPOINTMENTS (SEARCH ONLY) ================= */
const filteredAppointments = (
  Array.isArray(appointments) ? appointments : []
).filter((appointment) => {
  const statusName = appointment.booking_status || "";

  const patientName = appointment.patient_name || "-";
  const phone = appointment.patient_phone || "";
  const email = appointment.patient_email || "";
  const appointmentDate = appointment.appointment_date || "";

  const appointmentTime = appointment.appointment_time || "";


  const matchesSearch =
    !search ||
    String(appointment.appointment_id)
      .toLowerCase()
      .includes(search.toLowerCase()) ||
    patientName.toLowerCase().includes(search.toLowerCase()) ||
    phone.toLowerCase().includes(search.toLowerCase()) ||
    appointmentDate.toLowerCase().includes(search.toLowerCase()) ||
    appointmentTime.toLowerCase().includes(search.toLowerCase()) ||
    statusName.toLowerCase().includes(search.toLowerCase()) ||
    email.toLowerCase().includes(search.toLowerCase());

  return matchesSearch;
})

    .sort((a, b) => {
      const dateA = a.appointment_date ? new Date(a.appointment_date).getTime() : 0;
      const dateB = b.appointment_date ? new Date(b.appointment_date).getTime() : 0;

      return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
    });

  /* ================= UI ================= */

  return (

    <div
      className="p-6 bg-gradient-to-r from-slate-300 via-cyan-100 to-slate-300 dark:from-cyan-900 dark:via-slate-700 dark:to-cyan-900 min-h-screen"
      onMouseMove={resize}
      onMouseUp={stopResize}
    >

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-cyan-700 dark:text-gray-300">Appointments</h2>
      </div>

      {/* SEARCH */}
      <div className="p-6 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-lg">

 <div className="flex items-center justify-between gap-3 mb-4">

        
         

            {/* Sort Button */}
             <div className="flex items-center justify-between gap-2 ">

              <button
                onClick={() =>
                  setSortOrder((prev) => (prev === "desc" ? "asc" : "desc"))
                }
                className="  flex items-center gap-1 px-3 py-2 ml-1 border border-cyan-600 dark:border-gray-200
                          rounded-4xl backdrop-blur-md bg-white/10 shadow-sm hover:bg-white/30 dark:hover:bg-white/20 transition"
              >
                <HiArrowsUpDown className=" text-cyan-700 dark:text-gray-100  w-5 h-5 " />
                <span className="text-sm font-semibold text-cyan-700 dark:text-gray-100">Sort</span>
              </button>
              </div>

            {/* Calender */}  

          <button
          // onClick={() => openCalendar(doc)}
          className="p-2 bg-blue-100 rounded-full hover:bg-blue-200"
        >
          <MdCalendarToday className="w-5 text-cyan-600" />
        </button>

        {/* Search Bar */}
  
        <div className="flex items-center ml-auto gap-2">



          {/* Search Bar */}
          <div className="flex items-center w-[400px] border border-cyan-600 dark:border-gray-200 rounded-full px-4 py-2 shadow-sm backdrop-blur-md">
            <input
              type="text"
              placeholder="Search by name, email, or role..."
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

          {/* TABLE HEADER */}

          <thead className="bg-cyan-600 text-gray-100 text-sm sticky top-0 z-10">

            <tr className="divide-x divide-gray-100">

              <th style={{ width: columnWidths.appointment_id }} className="p-4 relative">
                Appointment No.
                <div
                  className="absolute right-0 top-0 h-full w-2 cursor-col-resize"
                  onMouseDown={(e) => startResize(e, "appointment_id")}
                />
              </th>

              <th style={{ width: columnWidths.patient_name }} className="p-4 relative">
                Patient Name
                <div
                  className="absolute right-0 top-0 h-full w-2 cursor-col-resize"
                  onMouseDown={(e) => startResize(e, "patient_name")}
                />
              </th>

              

              <th style={{ width: columnWidths.patient_gender }} className="p-4 relative">
                Gender
                <div
                  className="absolute right-0 top-0 h-full w-2 cursor-col-resize"
                  onMouseDown={(e) => startResize(e, "patient_gender")}
                />
              </th>

              <th style={{ width: columnWidths.patient_phone }} className="p-4 relative">
                Phone Number
                <div
                  className="absolute right-0 top-0 h-full w-2 cursor-col-resize"
                  onMouseDown={(e) => startResize(e, "patient_phone")}
                />
              </th>

              <th style={{ width: columnWidths.patient_email }} className="p-4 relative">
                Email
                <div
                  className="absolute right-0 top-0 h-full w-2 cursor-col-resize"
                  onMouseDown={(e) => startResize(e, "patient_email")}
                />
              </th>

              <th style={{ width: columnWidths.appointment_date }} className="p-4 relative">
                Appointment Date
                <div
                  className="absolute right-0 top-0 h-full w-2 cursor-col-resize"
                  onMouseDown={(e) => startResize(e, "appointment_date")}
                />
              </th>

              <th style={{ width: columnWidths.appointment_time }} className="p-4 relative">
                Appointment Time
                <div
                  className="absolute right-0 top-0 h-full w-2 cursor-col-resize"
                  onMouseDown={(e) => startResize(e, "appointment_time")}
                />
              </th>

              <th style={{ width: columnWidths.status }} className="p-4 relative">
                Status
                <div
                  className="absolute right-0 top-0 h-full w-2 cursor-col-resize"
                  onMouseDown={(e) => startResize(e, "status")}
                />
              </th>

              <th style={{ width: columnWidths.action }} className="p-4 relative">
                Action
                <div
                  className="absolute right-0 top-0 h-full w-2 cursor-col-resize"
                  onMouseDown={(e) => startResize(e, "action")}
                />
              </th>

            </tr>

          </thead>



        


            {/* Loading */}

            <tbody className="text-sm text-gray-700">

            {loading && (

              <tr>
                <td colSpan={7} className="p-6 text-center">
                  Loading...
                </td>
              </tr>

            )}



            {/* No Data */}

            {!loading && filteredAppointments.length === 0 && (

              <tr>

                <td
                  colSpan={7}
                  className="p-6 text-center text-gray-500"
                >
                  No doctors found
                </td>

              </tr>

            )}



            {/* Rows */}

            {!loading &&
            filteredAppointments.map((app) => {
                  

                return (

                  <tr
                    key={app.appointment_id}
                    className={`border-b border-gray-300 items-center transition duration-200`}>
                  




                      <td className="p-4 "><div className="flex gap-2 justify-center items-center">
                      {app.appointment_no || "-"}
                      </div></td>


                 <td className="p-4 "><div className="flex gap-2 justify items-center"></div>
                 {app.patient_name}
                 </td>

                   <td className="p-4 "><div className="flex gap-2 justify items-center"></div>
                   {app.patient_gender}
                   </td>  

                    <td className="p-4"><div className="flex gap-2 justify items-center">
                      {app.patient_phone}
                    </div></td>

                    <td className="p-4"><div className="flex gap-2 justify items-center">
                      {app.patient_email}
                    </div></td>

                    <td className="p-4 "><div className="flex gap-2 justify items-center">
                      {app.appointment_date}
                      </div></td>

                      <td className="p-4 "><div className="flex gap-2 justify items-center">
                      {app.appointment_time || "Not Generated"}
                      </div></td>


                      <td className="p-4 ">
                        <div className={`flex gap-2 justify items-center`}>
                          
                        {/* {doc.status === "Active" && (
                          <FaUserCheck className="text-green-500"/>
                        )} 
                        {doc.status === "Pending" && (
                          <FaClock className="text-amber-500"/>
                        )}
                       {doc.status === "Rejected" && (
                          <FaTrash className="text-red-500"/>
                        )}
                        {doc.status === "Inactive" && (
                          <FaUsersSlash className="text-gray-500"/>
                        )}

                        {doc.status?? "-"} */}
                        </div>
                        </td> 



                    <td className="p-4">

                      <div className="flex justify-center gap-4">

                      

      <button
//       onClick={() => {
//   dispatch(setSelectedDoctor(doc));
//   navigate(`/admin/doctor_view_profile/${doc.doctor_id}`);
// }}
        type="button"
        className="text-blue-600 hover:text-blue-800"
        title="View Doctor"
      >
      
        <EyeIcon className="w-5 h-5" />

      </button>

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

    </div>

  );

};

export default DoctorAppointments;
