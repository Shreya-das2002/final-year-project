
import { useEffect, useMemo, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {  EyeIcon, PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import { FaSearch, FaEnvelope, FaUser } from "react-icons/fa";
import { fetchAllAdmins } from "../../../../store/slices/adminSlice";
import type { RootState, AppDispatch } from "../../../../store/store";

/* ================= COLUMN KEY TYPE ================= */

type ColumnKey =  "name" | "email" | "role" | "action";

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

  /* ================= COLUMN WIDTH STATE ================= */

  const [columnWidths, setColumnWidths] = useState<Record<ColumnKey, number>>({
    name: 250,
    email: 300,
    role: 180,
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
        roleText.includes(q)
      );
    });
  }, [admins, search]);



  return (
    <div
      className="p-6 bg-gradient-to-r from-slate-200 via-gray-50 to-slate-200 min-h-screen"
      onMouseMove={resize}
      onMouseUp={stopResize}
    >

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-cyan-700">Admin List</h2>
      <div className="flex items-center w-72 border border-cyan-600 rounded-full px-3 py-2 shadow-sm focus-within:ring-1 focus-within:ring-cyan-600">

  <input
    type="text"
    placeholder="Search by name, email, or role..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    className="flex-1 outline-none text-sm"
  />

  <FaSearch className="text-cyan-700 text-lg" />

</div>
      </div>

      <div className="bg-gray-100 rounded-lg shadow-md overflow-hidden border border-gray-200">
        <table className="w-full text-left ">

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

                    <td className="p-4">
                      <div className="flex justify-center gap-4">

                        <button
                          onClick={() =>
                            navigate(`/admin/admin_view_profile/${admin.admin_user_id}`, {
                              state: admin
                            })
                          }
                          className="text-gray-500 hover:text-blue-600 transition"
                        >
                          <div className="rounded-full bg-blue-200 shadow w-8 h-8 flex items-center justify-center" >
                          <EyeIcon className="w-5 h-5  hover:text-blue-800 text-blue-500 cursor-pointer
                            transform transition-transform duration-300 ease-in-out hover:scale-103 dark:hover:scale-103 " />
                          </div>
                        </button>

                        <button
                          onClick={() =>
                            navigate(`/admin/admin_edit_profile/${admin.admin_user_id}`, {
                              state: admin
                            })
                          }
                          className="  transition"
                        >
                          <div className="rounded-full bg-gray-200 shadow w-8 h-8 flex items-center justify-center" >
                          <PencilSquareIcon className="w-5 h-5  hover:text-slate-800 text-slate-500 cursor-pointer
                            transform transition-transform duration-300 ease-in-out hover:scale-103 dark:hover:scale-103" />
                          </div>
                        </button>

                        {admin?.role !== "super admin" && (
                        <button>
                          <div className="rounded-full bg-red-200 shadow w-8 h-8 flex items-center justify-center" >
                          <TrashIcon className="w-5 h-5  hover:text-red-800 text-red-500 cursor-pointer
                            transform transition-transform duration-300 ease-in-out hover:scale-103 dark:hover:scale-103"/>
                          </div>
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
  );
};

export default AdminList;

