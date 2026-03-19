import { useEffect, useMemo, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { EyeIcon, PencilSquareIcon, AdjustmentsHorizontalIcon } from "@heroicons/react/24/outline";
import { FaSearch, FaEnvelope } from "react-icons/fa";
import { FiPhone } from "react-icons/fi";
import type { RootState, AppDispatch } from "../../../../store/store";

import { fetchDoctorListThunk, setSelectedDoctor } from "../../../../store/slices/doctorSlice";

/* ================= COLUMN KEY TYPE ================= */

type ColumnKey =  "name" | "email" | "phone_no" | "specialization" | "status" | "action";


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

      case "inactive":
      return {
        label: "Inactive",
        className: "bg-red-100 text-gray-700"
      };

    default:
      return {
        label: status || "Unknown",
        className: "bg-gray-100 text-gray-700"
      };

  }

};

const ROW_COLORS = [
  "bg-gray-100 hover:bg-gray-200 dark:bg-gray-400/60",
  "bg-gray-50 hover:bg-gray-200 dark:bg-gray-300/100"
];



const DoctorList = () => {

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();


  const { doctors, loading } = useSelector(
    (state: RootState) => state.doctor
  );


 

 const buttons = useSelector(
    (state: RootState) => state.auth.buttons
  );

  const canEdit = buttons?.some(
    (btn) => btn.control_key === "doctor edit"
  );

  const canView = buttons?.some(
    (btn) => btn.control_key === "doctor view"
  );

    const [search, setSearch] = useState("");
    const [showFilter, setShowFilter] = useState(false);
    const [roleFilter, setRoleFilter] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [openSection, setOpenSection] = useState<"status" | "role" | "">("");
  const filterRef = useRef<HTMLDivElement | null>(null);
  const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc");


    /* ================= COLUMN WIDTH STATE ================= */
  
    const [columnWidths, setColumnWidths] = useState<Record<ColumnKey, number>>({
      name: 250,
      email: 300,
      phone_no: 250,
      action: 150,
      specialization: 250,
      status: 150
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

       <div
      className="p-6 bg-gradient-to-r from-slate-300 via-cyan-100 to-slate-300 dark:from-cyan-900 dark:via-slate-700 dark:to-cyan-900 min-h-screen"
      onMouseMove={resize}
      onMouseUp={stopResize}
    >


      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-cyan-700 dark:text-gray-300">Doctor List</h2>
      </div>

        {/* internal div */}

        <div className="p-6 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-lg">

        {/* SEARCH + FILTER */}

        <div className="flex items-center justify-between gap-3 mb-4">

                    <button
                      onClick={() => setShowFilter(!showFilter)}
                      className="flex items-center gap-1 px-3 py-2 ml-1 border border-cyan-600 dark:border-gray-200 rounded-4xl backdrop-blur-md bg-white/10 shadow-sm hover:bg-cyan-100 dark:hover:bg-gray-400 transition"
                    >
                      <AdjustmentsHorizontalIcon className="text-cyan-700 dark:text-gray-100  w-5 h-5" />
                      <span className="text-sm font-semibold text-cyan-700 dark:text-gray-100">Filter</span>
                    </button>

          {/* SEARCH */}

          <div className=" ml-200 flex items-center w-[400px] border border-cyan-600 rounded-full px-4 py-2 shadow-sm bg-white">
            <input
              type="text"
              placeholder="Search by name, email, or role..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 outline-none text-sm bg-transparent"
            />
            <FaSearch className="text-cyan-700 text-lg mr-2" />
          </div>
          </div>

          

      



      {/* Table */}

      <div className="bg-white rounded-2xl overflow-hidden shadow-md">

        <table className="w-full text-left">

          {/* TABLE HEADER */}

          <thead className="bg-cyan-600  text-gray-100 text-sm">

            <tr className="divide-x divide-gray-100">

              <th className="p-4 text-gray-100">Name</th>

              <th className="p-4 text-gray-100">Email</th>

              <th className="p-4 text-gray-100">Phone No</th>

              <th className="p-4 text-gray-100">Specialization</th>

              <th className="p-4 text-blue-100">Status</th>

              <th className="p-4 text-blue-100 text-center">Action</th>

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
              filteredDoctors.map((doc) => {

                const statusUI =
                  getStatusLabel(doc.status);

                return (

                  <tr
                    key={doc.doctor_id}
                    className="border-t border-gray-300 hover:bg-gray-50"
                  >


  <td className="p-4">
  <div className="flex items-center gap-3">

    <div className="flex items-center justify-center w-11 h-11 rounded-full 
bg-cyan-600 dark:bg-cyan-700 text-white font-semibold shadow-sm cursor-pointer
                            transform transition-transform duration-300 ease-in-out hover:scale-103 dark:hover:scale-103">
  {doc.first_name?.[0]}{doc.last_name?.[0]}
</div>

    <div>
      {doc.first_name} {doc.middle_name ?? ""} {doc.last_name}
    </div>

  </div>
</td>


                 <td className="p-4 "><div className="flex gap-2 justify items-center"><FaEnvelope className="pt-1 text-2xl text-cyan-600 dark:text-cyan-700"/>{doc.email ?? "-"}</div></td>


                   <td className="p-4 "><div className="flex gap-2 justify items-center"><FiPhone className="pt-1 text-xl text-cyan-600 dark:text-cyan-700"/>{doc.phone_no ?? "-"}</div></td>  

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

                      
    {/* VIEW */}
    {canView && (
      <button
      onClick={() => {
  dispatch(setSelectedDoctor(doc));
  navigate(`/admin/doctor_view_profile/${doc.doctor_id}`);
}}
        type="button"
        className="text-gray-600 hover:text-blue-600"
        title="View Doctor"
      >
        <EyeIcon className="w-5 h-5" />
      </button>
    )}

    {/* EDIT */}
    {canEdit && (
      <button
        onClick={() => {
  dispatch(setSelectedDoctor(doc));
  navigate(`/admin/doctor_edit_profile/${doc.doctor_id}`);
}}
        type="button"
        className="text-gray-600 hover:text-green-600"
        title="Edit Doctor"
      >
        <PencilSquareIcon className="w-5 h-5" />
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

  );

};

export default DoctorList;
