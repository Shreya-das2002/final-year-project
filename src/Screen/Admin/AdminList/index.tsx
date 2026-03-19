
import { useEffect, useMemo, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {  EyeIcon, PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import { FiFilter } from "react-icons/fi";
import { FaSearch, FaEnvelope, FaUser } from "react-icons/fa";
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
  const [departmentFilter, setDepartmentFilter] = useState<number | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("");


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

  /* ================= FETCH ADMINS ================= */

  useEffect(() => {
    dispatch(fetchAllAdmins());
  }, [dispatch]);

  /* ================= FILTER ADMINS ================= */

  const filteredAdmins = useMemo(() => {
    const q = search.toLowerCase();
    const safeAdmins = Array.isArray(admins) ? admins : [];

    return safeAdmins.filter((admin) => {
      const roleText = getAdminTypeLabel(admin.role).label.toLowerCase();

      return (
        `${admin.first_name} ${admin.last_name}`
          .toLowerCase()
          .includes(q) ||
        (admin.email ?? "").toLowerCase().includes(q) ||
        roleText.includes(q) ||
        (admin.created_on) ||
        (admin.department_id) ||
        (admin.status)
      );

      const matchesSearch =
        ${admin.first_name} ${admin.last_name}.toLowerCase().includes(q) ||
        (admin.email ?? "").toLowerCase().includes(q) ||
        roleText.includes(q);

      const matchesRole =
        !roleFilter ||
        admin.role?.toLowerCase() === roleFilter.toLowerCase();

      const matchesDepartment =
        !departmentFilter ||
        admin.department_id?.includes(departmentFilter);

      const matchesStatus =
        !statusFilter ||
        admin.status?.toLowerCase() === statusFilter.toLowerCase();

      return (
        matchesSearch &&
        matchesRole &&
        matchesDepartment &&
        matchesStatus
      );
    });
  }, [admins, search, roleFilter, departmentFilter, statusFilter]);



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
          <button
            onClick={() => setShowFilter(!showFilter)}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg bg-white shadow-sm hover:bg-gray-50 transition"
          >
            <FiFilter className="text-gray-600" />
            <span className="text-sm text-gray-700">Filter</span>
          </button>

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

        {/* FILTER PANEL */}

      {showFilter && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">

    {/* Modal Box */}
    <div className="bg-white rounded-2xl shadow-xl w-[400px] p-6 relative">

      {/* Close Button */}
      <button
        onClick={() => setShowFilter(false)}
        className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
      >
        ✕
      </button>

      <h3 className="text-lg font-semibold mb-4 text-gray-700">
        Filter Options
      </h3>

      <div className="flex flex-col gap-4">

        {/* Role */}
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="border px-3 py-2 rounded-lg text-sm"
        >
          <option value="">All Roles</option>
          <option value="super admin">Super Admin</option>
          <option value="standard admin">Standard Admin</option>
          <option value="guest admin">Guest Admin</option>
        </select>

        {/* Department */}
        <select
          value={departmentFilter ?? ""}
          onChange={(e) =>
            setDepartmentFilter(e.target.value ? Number(e.target.value) : null)
          }
          className="border px-3 py-2 rounded-lg text-sm"
        >
          <option value="">All Departments</option>
          {DOCTOR_SPECIALIZATIONS.map((dept) => (
            <option key={dept.value} value={dept.value}>
              {dept.department}
            </option>
          ))}
        </select>

        {/* Status */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border px-3 py-2 rounded-lg text-sm"
        >
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>

      </div>

      {/* Actions */}
      <div className="flex justify-between mt-6">

        <button
          onClick={() => {
            setRoleFilter("");
            setDepartmentFilter(null);
            setStatusFilter("");
          }}
          className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 text-sm"
        >
          Clear
        </button>

        <button
          onClick={() => setShowFilter(false)}
          className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 text-sm"
        >
          Apply
        </button>

      </div>

    </div>
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

                      <td className="p-4 flex items-center gap-2">
                        <FaUser className={roleColor} />
                        <span className={px-3 py-1 rounded-full text-xs ${role.className}}>
                          {role.label}
                        </span>
                      </td>

                      <td className="p-4 flex justify-center gap-3">

                        <EyeIcon
                          onClick={() =>
                            navigate(/admin/admin_view_profile/${admin.admin_user_id}, { state: admin })
                          }
                          className="w-5 h-5 text-blue-500 cursor-pointer"
                        />

                        <PencilSquareIcon
                          onClick={() =>
                            navigate(/admin/admin_edit_profile/${admin.admin_user_id}, { state: admin })
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
