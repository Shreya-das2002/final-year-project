import { FaCalendarAlt, } from 'react-icons/fa';
import {  MdPeople, MdEventAvailable, MdAddTask } from 'react-icons/md';
// import { FaUser, FaStethoscope, FaIdCard } from 'react-icons/fa';
// import { MdOutlineCheckCircle, MdCurrencyRupee,  MdEvent, } from 'react-icons/md';
// import { FiCalendar } from "react-icons/fi";
import { useLocation, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useMemo } from "react";
import type { RootState } from "../../../../store/store";
import dayjs from 'dayjs';

const AppoinmentDetail = () => {

const { appointment_id } = useParams();
const location = useLocation();


const appointmentFromState = location.state;
const appointmentFromStore = useSelector(
  (state: RootState) => state.appointment.appointments
);

const appointment = useMemo(() => {
  return (
    appointmentFromStore.find(
      (a) => a.appointment_id === Number(appointment_id)
    ) || appointmentFromState
  );
}, [appointmentFromStore, appointmentFromState, appointment_id])

const dob = appointment?.patient_dob || null;
  const age = dob ? dayjs().diff(dayjs(dob), "year") : null;

      if (!appointment) {
    return <div className="p-10">No appointment data found</div>;
  }

  return (
     <div
      className="p-6 bg-gradient-to-r from-slate-300 via-cyan-100 to-slate-300 dark:from-cyan-900 dark:via-slate-700 dark:to-cyan-900 min-h-screen">
        
              <div className="flex items-center justify-between mb-6">
                    <h2 className="text-3xl font-bold text-cyan-700 dark:text-gray-300">Appointments Details</h2>
                <div className=" p-2 grid grid-cols-2 gap-4  ">
                    <button
                     
                      type="button"
                      className="text-xs p-2 w-full border border-red-50 text-red-500 dark:text-red-600 dark:bg-red-100 bg-red-100 rounded-full font-semibold hover:bg-red-200 dark:hover:bg-red-300 transition"
                    >
                      Cancel Booking
                    </button>

                     <button
                     
                      type="button"
                      className="text-xs p-2 w-full border border-red-50 text-red-500 dark:text-red-600 dark:bg-red-100 bg-red-100 rounded-full font-semibold hover:bg-red-200 dark:hover:bg-red-300 transition"
                    >
                      Download Details as PDF
                    </button>
                    </div>
                 </div>

     <div className="grid grid-cols-2 gap-0 bg-white/20 backdrop-blur-md shadow-md w-full  p-4  rounded-lg">
     <div className="grid grid-cols-2 gap-0">

           
                {/* Status Tracker */}

                <div className="bg-white/20 h-164 w-70 backdrop-blur-md shadow-md rounded-lg">

                    <h2 className="pt-5 pl-5 text-2xl font-bold text-blue-500">Status Tracker</h2>

                    <div className="w-50 flex items-center gap-1 ml-5 mt-2">
                        <span className="bg-cyan-700 dark:bg-cyan-700 p-2 rounded-full">
                        <MdEventAvailable className="text-xl text-cyan-100 dark:text-gray-100" />
                        </span>

                        <span className="whitespace-nowrap text-cyan-900 dark:text-gray-100">Booking Initiated</span>
                    </div>
                    

                    <div className="h-10 w-1 bg-cyan-700 rounded-full mt-1 ml-9"></div>

                    <div className="w-50 flex items-center gap-1 ml-5 mt-1">
                        <span className="bg-cyan-700 dark:bg-cyan-700 p-2 rounded-full">
                        <MdAddTask className="text-xl text-cyan-100 dark:text-gray-100" />
                        </span>

                        <span className="whitespace-nowrap text-cyan-900 dark:text-gray-100">Booking Confirmed</span>
                    </div>

                    <div className="h-10 w-1 bg-cyan-700 rounded-full mt-1 ml-9"></div>

                    <div className="w-50 flex items-center gap-1 ml-5 mt-1">
                        <span className="bg-cyan-700 dark:bg-cyan-700 p-2 rounded-full">
                        <FaCalendarAlt className="text-xl text-cyan-100 dark:text-gray-100" />
                        </span>

                        <span className="whitespace-nowrap text-cyan-900 dark:text-gray-100">Slot Assigned</span>
                    </div>

                    <div className="h-10 w-1 bg-cyan-700 rounded-full  mt-1 ml-9"></div>

                        <div className="w-50 flex items-center gap-1 ml-5 mb-3 mt-1">
                        <span className="bg-cyan-700 dark:bg-cyan-700 p-2 rounded-full">
                        <MdPeople className="text-xl text-cyan-100 dark:text-gray-100" />
                        </span>

                        <span className="whitespace-nowrap text-cyan-900 dark:text-gray-100">Completed</span>
                    </div>

                    <div className="h-0.5 w-60 bg-cyan-700 rounded-full  mt-1 ml-2 "></div>

                    <div className="mb-2 pl-5">
              <span className="text-cyan-600 text-sm font-semibold">
                Status: {appointment.booking_status}
              </span>
              <br />
              <span className="text-cyan-600 text-sm font-semibold">
                Created: {appointment.created_on}
              </span>
              <br />
              <span className="text-cyan-600 text-sm font-semibold">
                Updated: {appointment.updated_on}
              </span>
            </div>
            <div className="h-0.5 w-60 bg-cyan-700 rounded-full mt-1 ml-2">
              <h2 className="pt-3 pl-2 text-xl font-semibold">Clinic SymptoNexus</h2>
               
               <div className="mt-3 pl-2">

              <span className="text-sm  text-black dark:text-white">
               Krishnanagar, Nadia < br/> West Bengal - 741104
              </span>< br/>
              <span className="text-sm  text-black dark:text-white">
               Contact : +91 98765 43210 < br/> Email : symptonexus333@gmailcom
              </span>
              

            </div>

            </div>
              


          </div>


                 {/* Doctor Summary */}

            <div>
            <div className="bg-white/20 backdrop-blur-md shadow-md rounded-lg w-110 h-80">
            
                <h2 className="text-2xl pl-5 pt-5 font-bold text-blue-500">Doctor Summary</h2>
                <div className=" pl-5 pt-2">

                 <span className="text-lg font-semibold flex items-center pl-1 gap-2 text-black dark:text-white"> 
                   Name : {appointment.doctor_name}
                  </span>

                     <span className="font-sm flex items-center pl-1 gap-2  text-black dark:text-white"> 
                   Specialization : {appointment.specialization}
                  </span>

                   <span className="font-sm flex items-center pl-1 gap-2  text-black dark:text-white"> 
                   Bio : {appointment.doctor_bio}
                  </span>

                    <span className="font-sm flex items-center pl-1 gap-2  text-black dark:text-white"> 
                   Phone : {appointment.doctor_phone}
                  </span>

                    <span className="font-sm flex items-center pl-1 gap-2  text-black dark:text-white"> 
                   License Number : {appointment.license_number}
                  </span>

                  <span className="font-sm flex items-center pl-1 gap-2  text-black dark:text-white"> 
                  Slot Time : {appointment.doc_slot}
                  </span>

              <span className="font-sm flex items-center pl-0.5 gap-2 text-black dark:text-white"> 
                   Experience : {Number(appointment.experience) === 0
                        ? "Fresher"
                        : `${Number(appointment.experience)}+ year${
                            Number(appointment.experience) > 1 ? "s" : ""
                          }`}
                  </span>



                <span className="font-sm flex items-center pl-0.5 gap-2  pb-2 text-black dark:text-white"> 
                   Fees : {appointment.fees}
                  </span>
                      </div>
                    </div>

                       {/* Patient Details */}
                     <div className="bg-white/20 backdrop-blur-md shadow-md mt-4 rounded-lg w-110 h-80 ">
                     <h2 className="pt-5 pl-5 text-2xl font-bold text-blue-500">Patient Details</h2>

                    <div className=" pl-5 pt-2">

                 <span className="text-lg font-semibold flex items-center pl-1 gap-2 text-black dark:text-white"> 
                   Name : {appointment.patient_name}
                  </span>

                     <span className="font-sm flex items-center pl-1 gap-2  text-black dark:text-white"> 
                   Gender : {appointment.patient_gender}
                  </span>

                  <span className="font-sm flex items-center pl-1 gap-2  text-black dark:text-white"> 
                   DOB : {appointment.patient_dob}
                  </span>

                 <span className="font-sm flex items-center pl-1 gap-2  text-black dark:text-white"> 
                   Age : {age}
                  </span>

                 <span className="font-sm flex items-center pl-0.5 gap-2  text-black dark:text-white"> 
                  Phone : {appointment.patient_phone}
                  </span>


                    </div>
                      </div>
            </div>
             

            </div>

            {/*Appoinment Details */}
            <div>
            <div className="bg-white/20 backdrop-blur-md shadow-md rounded-lg ml-40 w-108 h-80">

            <h2 className="text-2xl pl-5 pt-5 font-bold text-blue-500">Appointment Summary</h2>
                <div className=" pl-5 pt-4">

                 <span className="text-sm font-semibold flex items-center pl-1 gap-2 text-black dark:text-white"> 
                   ID: {appointment.appointment_no || "Not Generated"}
                  </span>

                     <span className="font-sm flex items-center pl-1 gap-2  text-black dark:text-white"> 
                   Date: {appointment.appointment_date || "-"}
                  </span>

                 <span className="font-sm flex items-center pl-1 gap-2  text-black dark:text-white"> 
                   Time: {appointment.appointment_time || "-"}
                  </span>

                <span className="font-sm flex items-center pl-0.5 gap-2  text-black dark:text-white"> 
                  Status: {appointment.booking_status}
                  </span>

                <span className="font-sm flex items-center pl-0.5 gap-2 text-black dark:text-white"> 
                  Consultation: Follow-Up
                  </span>

                   <span className="font-sm flex items-center pl-0.5 gap-2  text-black dark:text-white"> 
                  Consultation Type: In-Person
                  </span>

                   <span className="font-sm flex items-center pl-0.5 gap-2  text-black dark:text-white"> 
                  Consultation Reason: Symptoms
                  </span>

                      </div>
                            </div>

                        {/* Booking Details */}
                      <div className="bg-white/20 backdrop-blur-md shadow-md rounded-lg ml-40 mt-4 w-108 h-80 ">
                      <h2 className="pt-5 pl-5 text-2xl font-bold text-blue-500">Booking Details</h2>

                     <div className=" pl-5 pt-2">

                 <span className="text-lg font-semibold flex items-center pl-1 gap-2 text-black dark:text-white"> 
                   Booking Number : 
                  </span>

                     <span className="font-sm flex items-center pl-1 gap-2  text-black dark:text-white"> 
                   Booking Date : {appointment.created_on}
                  </span>

                 <span className="font-sm flex items-center pl-1 gap-2  text-black dark:text-white"> 
                   Booking Time : {appointment.booking_time}
                  </span>

                    </div>
                    <div className="h-0.5 w-100 bg-cyan-700 ml-3 mt-10"></div>
                    <div className="ml-3 mt-4">
                   <span className="font-sm flex items-center pl-1 gap-2  text-black dark:text-white"> 
                   Reporting Time : 10:15 AM
                  </span>
                  <span className="font-sm flex items-center pl-1 gap-2  text-black dark:text-white"> 
                   Contact Name : {appointment.admin_name} < br/> Phone Number : {appointment.admin_phone} < br/>
                   Email : {appointment.admin_email}
                  </span>
                  </div>


                      </div>

                </div>

                {/* Instructions */}

                <div className="h-50 w-296 rounded-lg mt-4 bg-white/20 backdrop-blur-md shadow-md ">
                <h2 className="pt-3 pl-5 text-xl font-semibold text-blue-500">Notes & Instructions</h2>

                </div>

               
     </div>
     

    </div>
  )
}

export default AppoinmentDetail