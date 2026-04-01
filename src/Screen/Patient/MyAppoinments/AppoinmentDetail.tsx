import React from 'react';
import { FaUser, FaCalendarAlt, FaStethoscope, FaIdCard } from 'react-icons/fa';
import { MdOutlineCheckCircle, MdCurrencyRupee, MdPeople, MdEvent, MdEventAvailable, MdAddTask } from 'react-icons/md';
import { FiCalendar } from "react-icons/fi";

const AppoinmentDetail = () => {
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

                <div className="bg-white/20 h-auto w-70 backdrop-blur-md shadow-md rounded-lg">

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
                    <span className="text-cyan-600 text-sm font-semibold ">Status: Upcoming</span><br />
                    <span className="text-cyan-600 text-sm font-semibold  ">Created: 10/03/2026</span><br />
                    <span className="text-cyan-600 text-sm font-semibold  ">Updated: 10/03/2026</span>
                    </div> 
                </div>


                 {/* Doctor Summary */}

            <div className="bg-white/20 backdrop-blur-md shadow-md rounded-lg w-110 h-65 ">
            
                <h2 className="text-2xl pl-5 pt-5 font-bold text-blue-500">Doctor Summary</h2>
                <div className=" pl-5 pt-2">

                 <span className="text-lg font-semibold flex items-center pl-1 gap-2 text-black dark:text-white"> 
                   Dr.Rahul Sen 
                  </span>

                     <span className="font-sm flex items-center pl-1 gap-2  text-black dark:text-white"> 
                   Cardiologist
                  </span>

                <span className="font-sm flex items-center pl-0.5 gap-2 text-black dark:text-white"> 
                   12+ Experience
                  </span>



                <span className="font-sm flex items-center pl-0.5 gap-2  pb-2 text-black dark:text-white"> 
                   Fees: 500
                  </span>
                      </div>

                                                            <button
                     
                      type="button"
                      className="text-xs p-2 w-40 ml-2 mt-5  border  border-cyan-50 text-cyan-500 dark:text-cyan-600 dark:bg-cyan-100 bg-blue-100 rounded-full font-semibold hover:bg-red-200 dark:hover:bg-red-300 transition"
                    >
                      View Doctor Profile
                    </button>

                </div>
            </div>

            {/*Appoinment Details */}
            <div className="bg-white/20 backdrop-blur-md shadow-md rounded-lg ml-40 w-108 h-65 ">

            <h2 className="text-2xl pl-5 pt-5 font-bold text-blue-500">Appointment Summary</h2>
                <div className=" pl-5 pt-2">

                 <span className="text-sm font-semibold flex items-center pl-1 gap-2 text-black dark:text-white"> 
                   Appointment ID: APT-1025 
                  </span>

                     <span className="font-sm flex items-center pl-1 gap-2  text-black dark:text-white"> 
                   Booking Date: 16/03/2026
                  </span>

                 <span className="font-sm flex items-center pl-1 gap-2  text-black dark:text-white"> 
                   Booking Time: 10:30 AM
                  </span>

                 <span className="font-sm flex items-center pl-0.5 gap-2  text-black dark:text-white"> 
                  Consultation Type: In-Person
                  </span>

                <span className="font-sm flex items-center pl-0.5 gap-2  text-black dark:text-white"> 
                  Status: Upcoming
                  </span>

                <span className="font-sm flex items-center pl-0.5 gap-2  pb-2 text-black dark:text-white"> 
                  Consultation: Follow-Up
                  </span>
                      </div>

                </div>



           


     
     
     
     
     
     
     
     
     
     
     
     
     </div>
      

            

        
    </div>
  )
}

export default AppoinmentDetail