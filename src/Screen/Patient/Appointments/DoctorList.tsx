import  { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchDoctorListThunk } from "../../../../store/slices/doctorSlice";
import { FaEnvelope, FaUser } from "react-icons/fa";
import type { RootState } from "../../../../store/store";
import type { AppDispatch } from "../../../../store/store";

const SpDoctorList = () => {
  const { specializationId } = useParams();

  const dispatch = useDispatch<AppDispatch>(); 
  const { doctors, loading } = useSelector(
    (state: RootState) => state.doctor
  );

  console.log("Component Loaded");
  console.log("Param:", specializationId);

  useEffect(() => {
    if (specializationId) {
      console.log("🚀 Dispatching Thunk...");
      dispatch(fetchDoctorListThunk(Number(specializationId)));
    }
  }, [dispatch, specializationId]);

  console.log("Doctors:", doctors);

 return (
  <div className="bg-gradient-to-r from-sky-100/50 via-sky-50/50 to-sky-100/50 dark:from-sky-950 dark:via-sky-900 dark:to-sky-950 p-6 min-h-screen w-full">
    <h2 className="text-[35px] text-cyan-700 dark:text-cyan-100 font-bold mb-1 pl-4">Doctor List</h2>

    {loading ? (
      <p>Loading...</p>
    ) : doctors.length === 0 ? (
      <p>No doctors found</p>
    ) : (
      <div className="p-4 space-y-4 ">
        {doctors.map((doc) => (
          <div
            key={doc.doctor_id}
            className="bg-gradient-to-r from-cyan-100/40 to-teal-200/30 rounded-xl flex justify-between items-center p-5  shadow transition-transform duration-300 ease-in-out hover:scale-103 active:scale-75 cursor-pointer transform"
          >
            {/* LEFT SECTION */}
            <div className="flex items-center gap-4">
              
              {/* Avatar */}
              <div className="w-16 h-16 rounded-full bg-cyan-700 flex items-center justify-center text-cyan-100 text-2xl font-semibold">
                {doc.first_name?.charAt(0)}
              </div>

              {/* Info */}
              <div className="space-y-1">
                
                {/* Name + Tag in one line */}
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-semibold text-cyan-900 dark:text-cyan-50">
                    Dr. {doc.first_name} {doc.last_name}
                  </h3>

                  <span className="text-[9px] px-2 py-0.5 rounded-full bg-cyan-100 dark:bg-cyan-800 text-cyan-700 dark:text-cyan-100 font-medium">
                    {doc.specialization || "General"}
                  </span>
                </div>

                {/* Email + Phone in one line */}
                <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-50">
                  <span className="flex items-center gap-1"> 
                    <FaEnvelope /> {doc.email}
                  </span>
                  <span className="flex items-center gap-1">
                    <FaUser /> {doc.phone_no}
                  </span>
                </div>

                {/* Bottom row */}
                <div className="flex items-center gap-3 text-xs pt-0.5">
                  <span className="text-yellow-500 dark:text-yellow-600 font-medium">★ 4.6</span>
                  <span className="text-gray-500 dark:text-cyan-100">{Number(doc.experience)} year{Number(doc.experience) > 1 ? "s" : ""}</span>
                  <span className="text-[10px] bg-cyan-100 dark:bg-cyan-800 text-cyan-700 dark:text-cyan-100 px-2 py-0.5 rounded-full font-medium">
                    Available Today
                  </span>
                </div>

              </div>
            </div>

            {/* RIGHT SECTION */}
            <div className="flex flex-col items-end gap-2">
              
              <div className="text-right">
                <div className="text-lg font-semibold text-green-950 dark:text-cyan-50">
                  ₹500
                </div>
                <div className="text-xs text-gray-600 dark:text-cyan-100">
                  per visit
                </div>
              </div>

              <button className="bg-cyan-600 dark:bg-cyan-100 text-white dark:text-cyan-950 px-4 py-2 rounded-lg text-sm hover:bg-cyan-700">
                Book Now
              </button>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
);
};

export default SpDoctorList;