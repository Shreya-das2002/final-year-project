import React from 'react'

const AppoinmentDetail = () => {
  return (
     <div
      className="p-6 bg-gradient-to-r from-slate-300 via-cyan-100 to-slate-300 dark:from-cyan-900 dark:via-slate-700 dark:to-cyan-900 min-h-screen">
        
              <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-cyan-700 dark:text-gray-300">Appoinments Details</h2>
        </div>

        <div className="bg-white/20 backdrop-blur-md shadow-md w-sm  rounded-lg">
        <div className=" pl-5 pt-5">

                      <p className="text-gray-700 dark:text-gray-800 ">
                        Dr. Rahul Sen
                      </p>

                     <p className="text-gray-700 dark:text-gray-800 ">
                        Cardiologist
                      </p>

                     <p className="text-gray-700 dark:text-gray-800 ">
                        12 Apr 2026 | 10:30 AM
                      </p>

                    <p className="text-gray-700 dark:text-gray-800 ">
                        Appoinment ID: APT-1025
                      </p>

                    <p className="text-gray-700 dark:text-gray-800 ">
                        Status: Upcoming
                      </p>
                      </div>


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
      

            

        
    </div>
  )
}

export default AppoinmentDetail