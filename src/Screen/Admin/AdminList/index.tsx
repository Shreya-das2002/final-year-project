import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { EyeIcon, PencilSquareIcon } from "@heroicons/react/24/outline";
import { fetchAllAdmins } from "../../../../store/slices/adminSlice";
import type { RootState, AppDispatch } from "../../../../store/store";

/* ================= ROLE UI TYPE ================= */

type AdminRoleUI = {
  label: string;
  className: string;
};

/* ================= ROLE LABEL HELPER ================= */

const getAdminTypeLabel = (role?: string): AdminRoleUI => {
  const normalized = role?.toLowerCase();

  switch (normalized) {
    case "super admin":
      return {
        label: "Super Admin",
        className: "bg-purple-100 text-purple-700",
      };

    case "standard admin":
      return {
        label: "Standard Admin",
        className: "bg-blue-100 text-blue-700",
      };

    case "guest admin":
      return {
        label: "Guest Admin",
        className: "bg-gray-100 text-gray-700",
      };

    default:
      return {
        label: role || "Unknown",
        className: "bg-red-100 text-red-700",
      };
  }
};

const AdminList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { admins, loading } = useSelector(
    (state: RootState) => state.admin
  );

  const [search, setSearch] = useState("");

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

  /* ================= UI ================= */

  return (
    <div className="p-6 bg-gray-50 min-h-screen rounded-xl shadow-sm">

      {/* Header + Search */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-blue-600">
          Admin List
        </h2>

        <input
          type="text"
          placeholder="Search by name, email, or role..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-72 px-4 py-2 border rounded-full shadow-sm
                    focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-left">

          <thead className="bg-blue-50">
            <tr>
              <th className="p-4">Sl. No.</th>
              <th className="p-4">Name</th>
              <th className="p-4">Email</th>
              <th className="p-4">Role</th>
              <th className="p-4 text-center">Action</th>
            </tr>
          </thead>

          <tbody>

            {/* Loading */}
            {loading && (
              <tr>
                <td colSpan={5} className="p-6 text-center">
                  Loading...
                </td>
              </tr>
            )}

            {/* No Data */}
            {!loading && filteredAdmins.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="p-6 text-center text-gray-500"
                >
                  No admins found
                </td>
              </tr>
            )}

            {/* Admin Rows */}
            {!loading &&
              filteredAdmins.map((admin, index) => {
                const role = getAdminTypeLabel(admin.role);

                return (
                  <tr
                    key={admin.admin_user_id}
                    className="border-t hover:bg-gray-50"
                  >

                    <td className="p-4 font-medium">
                      {index + 1}
                    </td>

                    <td className="p-4 font-medium">
                      {admin.first_name} {admin.middle_name ?? ""} {admin.last_name}
                    </td>

                    <td className="p-4">
                      {admin.email ?? "-"}
                    </td>

                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${role.className}`}
                      >
                        {role.label}
                      </span>
                    </td>

                    <td className="p-4">
                      <div className="flex justify-center gap-4">

                        {/* View */}
                        <button
        onClick={() =>
          navigate(`/admin/admin_view_profile/${admin.admin_user_id}`, {
            state: admin,
          })
        }
        type="button"
        className="text-gray-600 hover:text-blue-600"
        title="View Doctor"
      >
                          <EyeIcon className="w-5 h-5" />
                        </button>

                        {/* Edit */}
                        <button
                        onClick={() =>
          navigate(`/admin/admin_edit_profile/${admin.admin_user_id}`, {
            state: admin,
          })
        }
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

export default AdminList;
