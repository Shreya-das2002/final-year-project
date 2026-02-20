import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { EyeIcon, PencilSquareIcon } from "@heroicons/react/24/outline";

import type { RootState, AppDispatch } from "../../../../store/store";

import { fetchDoctorListThunk } from "../../../../store/slices/doctorSlice";


/* ================= STATUS UI HELPER ================= */

type StatusUI = {
  label: string;
  className: string;
};

const getStatusLabel = (status?: string): StatusUI => {

  const normalized = status?.toLowerCase();

  switch (normalized) {

    case "active":
      return {
        label: "Active",
        className: "bg-green-100 text-green-700"
      };

    case "pending":
      return {
        label: "Pending",
        className: "bg-yellow-100 text-yellow-700"
      };

    case "rejected":
      return {
        label: "Rejected",
        className: "bg-red-100 text-red-700"
      };

    default:
      return {
        label: status || "Unknown",
        className: "bg-gray-100 text-gray-700"
      };

  }

};



const DoctorList = () => {

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();


  const { doctors, loading } = useSelector(
    (state: RootState) => state.doctor
  );


  const [search, setSearch] = useState("");



  /* ================= FETCH DOCTORS ================= */

  useEffect(() => {

    dispatch(fetchDoctorListThunk());

  }, [dispatch]);



  /* ================= FILTER DOCTORS ================= */

  const filteredDoctors = useMemo(() => {

    const q = search.toLowerCase();

    const safeDoctors =
      Array.isArray(doctors) ? doctors : [];

    return safeDoctors.filter((doc) => {

      const fullName =
        `${doc.first_name} ${doc.middle_name ?? ""} ${doc.last_name}`
        .toLowerCase();

      return (

        fullName.includes(q)

        ||

        (doc.email ?? "")
          .toLowerCase()
          .includes(q)

        ||

        (doc.phone_no ?? "")
          .includes(q)

        ||

        (doc.specialization ?? "")
          .toLowerCase()
          .includes(q)

      );

    });

  }, [doctors, search]);



  /* ================= UI ================= */

  return (

    <div className="p-6 bg-gray-50 min-h-screen rounded-xl shadow-sm">


      {/* Header */}

      <div className="flex items-center justify-between mb-6">

        <h2 className="text-2xl font-semibold text-blue-600">
          Doctor List
        </h2>


        <input
          type="text"
          placeholder="Search by name, email, phone, specialization..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          className="w-72 px-4 py-2 border rounded-full shadow-sm
                    focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

      </div>



      {/* Table */}

      <div className="bg-white rounded-xl shadow overflow-hidden">

        <table className="w-full text-left">

          <thead className="bg-blue-50">

            <tr>

              <th className="p-4 text-blue-600">Sl. No.</th>

              <th className="p-4 text-blue-600">Name</th>

              <th className="p-4 text-blue-600">Email</th>

              <th className="p-4 text-blue-600">Phone No</th>

              <th className="p-4 text-blue-600">Specialization</th>

              <th className="p-4 text-blue-600">Status</th>

              <th className="p-4 text-blue-600 text-center">Action</th>

            </tr>

          </thead>



          <tbody>


            {/* Loading */}

            {loading && (

              <tr>
                <td colSpan={7} className="p-6 text-center">
                  Loading...
                </td>
              </tr>

            )}



            {/* No Data */}

            {!loading && filteredDoctors.length === 0 && (

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
              filteredDoctors.map((doc, index) => {

                const statusUI =
                  getStatusLabel(doc.status);

                return (

                  <tr
                    key={doc.doctor_id}
                    className="border-t hover:bg-gray-50"
                  >

                    <td className="p-4 font-medium">
                      {index + 1}
                    </td>


                    <td className="p-4 font-medium">

                      {doc.first_name}
                      {" "}
                      {doc.middle_name ?? ""}
                      {" "}
                      {doc.last_name}

                    </td>


                    <td className="p-4">
                      {doc.email ?? "-"}
                    </td>


                    <td className="p-4">
                      {doc.phone_no ?? "-"}
                    </td>


                    <td className="p-4">
                      {doc.specialization ?? "-"}
                    </td>


                    <td className="p-4">

                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${statusUI.className}`}
                      >
                        {statusUI.label}
                      </span>

                    </td>



                    <td className="p-4">

                      <div className="flex justify-center gap-4">

                        <button
                        onClick={() => {
                          navigate(`/admin/doctor_view_profile/${doc.doctor_id}`);
                        }}
                          type="button"
                          className="text-gray-600 hover:text-blue-600"
                        >
                          <EyeIcon className="w-5 h-5" />
                        </button>

                        <button
                        onClick={() => {
                          navigate(`/admin/doctor_edit_profile/${doc.doctor_id}`);
                        }}
                          type="button"
                          className="text-gray-600 hover:text-green-600"
                        >
                          <PencilSquareIcon className="w-5 h-5" />
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

  );

};

export default DoctorList;
