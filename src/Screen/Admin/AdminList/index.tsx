
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {  EyeIcon, PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import { FiFilter } from "react-icons/fi";
import { FaSearch, FaEnvelope, FaUser } from "react-icons/fa";
import { HiArrowsUpDown } from "react-icons/hi2";
import { fetchAllAdmins } from "../../../../store/slices/adminSlice";
import type { RootState, AppDispatch } from "../../../../store/store";
import { DOCTOR_SPECIALIZATIONS } from "../../../Environment";

/* ================= COLUMN KEY TYPE ================= */

type ColumnKey =  "name" | "email" | "role" | "action" | "created_on" | "department_id" | "status";

/* ================= ROLE UI TYPE ================= */

type AdminRoleUI = {
  label: string;
  className: string;
};



const getAdminTypeLabel = (role?: string): AdminRoleUI => {
  const normalized = role?.toLowerCase();

  switch (normalized) {
    case "super admin":
      return { label: "Super Admin", className: "bg-purple-100 text-purple-700" };
    case "standard admin":
      return { label: "Standard Admin", className: "bg-blue-100 text-blue-700" };
    case "guest admin":
      return { label: "Guest Admin", className: "bg-lime-100 text-lime-700" };
    default:
      return { label: role || "Unknown", className: "bg-red-100 text-red-700" };
  }
};

const ROW_COLORS = [
  "bg-gray-100 hover:bg-gray-200",
  "bg-gray-50 hover:bg-gray-200"
];

const getDepartments = (value?: number) => {
  const found = DOCTOR_SPECIALIZATIONS.find(
    item => item.value === value
  );

  return {
    value: value ?? 0,
    department: found?.department || "__"
  };
};

const ROLE_COLORS: Record<string, string> = {
  "super admin": "text-purple-700",
  "standard admin": "text-blue-700",
  "guest admin": "text-green-700"
};
const AdminList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  

  const { admins, loading } = useSelector(
    (state: RootState) => state.admin
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
    role: 250,
    action: 150,
    created_on: 250,
    department_id: 300,
    status: 180
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

  /* ================= FETCH ADMINS ================= */

  useEffect(() => {
    dispatch(fetchAllAdmins());
  }, [dispatch]);

  /* ================= FILTER ADMINS ================= */

const filteredAdmins = (Array.isArray(admins) ? admins : [])
  .filter((admin) => {
    const matchesStatus =
      !statusFilter ||
      admin.status?.toLowerCase() === statusFilter.toLowerCase();

    const matchesRole =
      !roleFilter ||
      admin.role?.toLowerCase() === roleFilter.toLowerCase();

    return matchesStatus && matchesRole;
  })
  .sort((a, b) => {
  const dateA = a.created_on
    ? new Date(a.created_on).getTime()
    : 0;

  const dateB = b.created_on
    ? new Date(b.created_on).getTime()
    : 0;

  return sortOrder === "desc"
    ? dateB - dateA
    : dateA - dateB;
});



  return (
    <div
      className="p-6 bg-gradient-to-r from-slate-200 via-gray-50 to-slate-200 min-h-screen"
      onMouseMove={resize}
      onMouseUp={stopResize}
    >

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-cyan-700">Admin List</h2>
      </div>

      {/* SEARCH + FILTER */}
      <div className="p-6 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-lg">

        <div className="flex items-center justify-between gap-3 mb-4">

          {/* FILTER BUTTON */}
          <div className="flex items-center justify-between gap-2">
          <button
            onClick={() => setShowFilter(!showFilter)}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg bg-white shadow-sm hover:bg-gray-50 transition"
          >
            <FiFilter className="text-gray-600" />
            <span className="text-sm text-gray-700">Filter</span>
          </button>

<button
  onClick={() =>
    setSortOrder((prev) => (prev === "desc" ? "asc" : "desc"))
  }
  className="p-2 w-13 h-9 rounded-lgborder border-gray-300 rounded-lg bg-white shadow-sm hover:bg-gray-50 transition flex items-center justify-center"
>
  <HiArrowsUpDown className="text-xl text-gray-600" />
</button>
</div>

          {/* SEARCH */}
          <div className="flex items-center w-[400px] border border-cyan-600 rounded-full px-4 py-2 shadow-sm bg-white">
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

{/* DROPDOWN FILTER BOX */}
{showFilter && (
  <div
    ref={filterRef}
    className="absolute mt-2 w-64 bg-white rounded-xl shadow-xl border p-4 z-50">

    {/* STATUS HEADER */}
    <button
      onClick={() =>
        setOpenSection(openSection === "status" ? "" : "status")
      }
      className="w-full text-left px-3 py-2 font-semibold bg-gray-100 rounded-lg mb-2"
    >
      Status
    </button>

    {/* STATUS OPTIONS */}
    {openSection === "status" && (
      <div className="flex flex-col gap-2 mb-3">
        <button
          onClick={() => setStatusFilter("active")}
          className={`px-3 py-2 rounded-lg text-sm ${
            statusFilter === "active"
              ? "bg-cyan-600 text-white"
              : "bg-gray-200"
          }`}
        >
          Active
        </button>

        <button
          onClick={() => setStatusFilter("inactive")}
          className={`px-3 py-2 rounded-lg text-sm ${
            statusFilter === "inactive"
              ? "bg-cyan-600 text-white"
              : "bg-gray-200"
          }`}
        >
          Inactive
        </button>
      </div>
    )}

    {/* ROLE HEADER */}
    <button
      onClick={() =>
        setOpenSection(openSection === "role" ? "" : "role")
      }
      className="w-full text-left px-3 py-2 font-semibold bg-gray-100 rounded-lg mb-2"
    >
      Role
    </button>

    {/* ROLE OPTIONS */}
    {openSection === "role" && (
      <div className="flex flex-col gap-2 mb-3">
        {["super admin", "standard admin", "guest admin"].map((role) => (
          <button
            key={role}
            onClick={() => setRoleFilter(role)}
            className={`px-3 py-2 rounded-lg text-sm capitalize ${
              roleFilter === role
                ? "bg-cyan-600 text-white"
                : "bg-gray-200"
            }`}
          >
            {role}
          </button>
        ))}
      </div>
    )}

    {/* APPLY BUTTON (TOP) */}
    <button
      onClick={() => setShowFilter(false)}
      className="w-full py-2 bg-cyan-600 text-white rounded-lg mb-2 hover:bg-cyan-700"
    >
      Apply Filters
    </button>

    {/* CLEAR BUTTON */}
    <button
      onClick={() => {
        setRoleFilter("");
        setStatusFilter("");
      }}
      className="w-full py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
    >
      Clear Filters
    </button>

  </div>
)}
{/* TABLE */}

        <div className="bg-white rounded-2xl overflow-hidden shadow-md">
  <table className="w-full text-left">
          {/* TABLE HEADER */}
          <thead className="bg-cyan-600  text-gray-100 text-sm">
            <tr className="divide-x divide-gray-100">

              <th style={{ width: columnWidths.name }} className="p-4 relative">
                Name
                <div
                  className="absolute right-0 top-0 h-full w-2 cursor-col-resize"
                  onMouseDown={(e) => startResize(e, "name")}
                />
              </th>

              <th style={{ width: columnWidths.email }} className="p-4 relative">
                Email
                <div
                  className="absolute right-0 top-0 h-full w-2 cursor-col-resize"
                  onMouseDown={(e) => startResize(e, "email")}
                />
              </th>

              <th style={{ width: columnWidths.role }} className="p-4 relative">
                Role
                <div
                  className="absolute right-0 top-0 h-full w-2 cursor-col-resize"
                  onMouseDown={(e) => startResize(e, "role")}
                />
              </th>

              <th style={{ width: columnWidths.created_on }} className="p-4 relative">
                Joining Date
                <div
                  className="absolute right-0 top-0 h-full w-2 cursor-col-resize"
                  onMouseDown={(e) => startResize(e, "role")}
                />
              </th>

              <th style={{ width: columnWidths.department_id }} className="p-4 relative">
                Departments
                <div
                  className="absolute right-0 top-0 h-full w-2 cursor-col-resize"
                  onMouseDown={(e) => startResize(e, "role")}
                />
              </th>

              <th style={{ width: columnWidths.status }} className="p-4 relative">
                Status
                <div
                  className="absolute right-0 top-0 h-full w-2 cursor-col-resize"
                  onMouseDown={(e) => startResize(e, "role")}
                />
              </th>

              <th
                style={{ width: columnWidths.action }}
                className="p-4 relative text-center"
              >
                Action
                <div
                  className="absolute right-0 top-0 h-full w-2 cursor-col-resize"
                  onMouseDown={(e) => startResize(e, "action")}
                />
              </th>

            </tr>
          </thead>

          {/* TABLE BODY */}
          <tbody className="text-sm text-gray-700">

            {loading && (
              <tr>
                <td colSpan={5} className="p-6 text-center">
                  Loading...
                </td>
              </tr>
            )}

            {!loading && filteredAdmins.length === 0 && (
              <tr>
                <td colSpan={5} className="p-6 text-center text-gray-500">
                  No admins found
                </td>
              </tr>
            )}

            {!loading &&
              filteredAdmins.map((admin, index) => {
                const role = getAdminTypeLabel(admin.role);
                const color = ROW_COLORS[index % ROW_COLORS.length];
                const roleKey = admin.role?.toLowerCase() || "";
                const roleColor = ROLE_COLORS[roleKey] || "text-gray-700";

                return (
                  <tr
                    key={admin.admin_user_id}
                    className={`border-b border-gray-300 items-center ${color} transition duration-200`}>
                  
              <td className="p-4">
  <div className="flex items-center gap-3">

    <div className="flex items-center justify-center w-11 h-11 rounded-full 
bg-cyan-600 text-white font-semibold shadow-sm cursor-pointer
                            transform transition-transform duration-300 ease-in-out hover:scale-103 dark:hover:scale-103">
  {admin.first_name?.[0]}{admin.last_name?.[0]}
</div>

    <div>
      {admin.first_name} {admin.middle_name ?? ""} {admin.last_name}
    </div>

  </div>
</td>
                    <td className="p-4 "><div className="flex gap-2 justify items-center"><FaEnvelope className="pt-1 text-2xl text-cyan-600"/>{admin.email ?? "-"}</div></td>

                    <td className="p-4">
                      <div className="flex gap-2 justify items-center" >
                        <FaUser className = {`${roleColor} pt-1 text-xl`}/>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${role.className}`}
                      >
                        
                        {role.label}
                      </span>
                      </div>
                    </td>

                    <td className="p-4 "><div className="flex gap-2 justify items-center"><FaEnvelope className="pt-1 text-2xl text-cyan-600"/>{admin.created_on ?? "-"}</div></td>
                      
<td className="flex items-center justify-center pt-5">
  {admin.department_id?.length
    ? admin.department_id
        .map((id: number) => getDepartments(id).department)
        .join(", ")
    : "__"}
</td>

                      <td className="p-4 "><div className="flex gap-2 justify items-center">{admin.status?? "-"}</div></td> 

                    
                      <td className="p-4 flex justify-center gap-3">

                      <EyeIcon
                          onClick={() =>
                          navigate(`/admin/admin_view_profile/${admin.admin_user_id}`, {
                          state: admin
                          })
                        }
                  className="w-5 h-5 text-blue-500 cursor-pointer"/>

                        <PencilSquareIcon
                          onClick={() =>
                            navigate(`/admin/admin_edit_profile/${admin.admin_user_id}`, { state: admin })
                          }
                          className="w-5 h-5 text-gray-500 cursor-pointer"
                        />

                        {admin.role !== "super admin" && (
                          <TrashIcon className="w-5 h-5 text-red-500 cursor-pointer" />
                        )}

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

export default AdminList;
