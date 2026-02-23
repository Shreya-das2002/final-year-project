import  { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchDoctorListThunk } from "../../../../store/slices/doctorSlice";
import type { RootState } from "../../../../store/store";
import type { AppDispatch } from "../../../../store/store";

const SpDoctorList = () => {
  const { specializationId } = useParams();

  const dispatch = useDispatch<AppDispatch>(); // 🔥 important fix

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
  <div className="p-6">
    <h2 className="text-xl font-semibold mb-6">Doctor List</h2>

    {loading ? (
      <p>Loading...</p>
    ) : doctors.length === 0 ? (
      <p>No doctors found</p>
    ) : (
      <div className="space-y-4">
        {doctors.map((doc) => (
          <div
            key={doc.doctor_id}
            className="flex justify-between items-center border rounded-xl p-4 shadow-sm bg-white"
          >
            {/* LEFT SECTION */}
            <div className="flex items-start gap-4">
              
              {/* Avatar */}
              <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-lg font-bold text-gray-600">
                {doc.first_name?.charAt(0)}
              </div>

              {/* Info */}
              <div>
                <h3 className="text-lg font-semibold">
                  Dr. {doc.first_name} {doc.last_name}
                </h3>

                <p className="text-gray-600 text-sm">
                  {doc.specialization || "General"}
                </p>

                <p className="text-gray-500 text-sm">
                  📧 {doc.email}
                </p>

                <p className="text-gray-500 text-sm">
                  📞 {doc.phone_no}
                </p>
              </div>
            </div>

            {/* RIGHT SECTION */}
            <div className="flex flex-col items-end gap-3">
              
              {/* Fees */}
              <div className="text-lg font-semibold text-gray-800">
                ₹500
              </div>

              {/* Button */}
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
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