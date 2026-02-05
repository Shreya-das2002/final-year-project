import { useEffect, useMemo, useState } from "react";
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

const getAdminTypeLabel = (userType?: number): AdminRoleUI => {
  switch (userType) {
    case 1:
      return {
        label: "Super Admin",
        className: "bg-purple-100 text-purple-700",
      };
    case 2:
      return {
        label: "Standard Admin",
        className: "bg-blue-100 text-blue-700",
      };
    case 3:
      return {
        label: "Guest Admin",
        className: "bg-gray-100 text-gray-700",
      };
    default:
      return {
        label: "Unknown",
        className: "bg-red-100 text-red-700",
      };
  }
};

const AdminList = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { admins, loading } = useSelector(
    (state: RootState) => state.admin
  );

  /* ================= SEARCH ================= */

  const [search, setSearch] = useState("");

  useEffect(() => {
    dispatch(fetchAllAdmins());
  }, [dispatch]);

  /* ================= FILTERED ADMINS (FIXED) ================= */

  const filteredAdmins = useMemo(() => {
    const q = search.toLowerCase();

    // ✅ SAFE ARRAY INSIDE useMemo (NO WARNING)
    const safeAdmins = Array.isArray(admins) ? admins : [];

    return safeAdmins.filter((admin) => {
      const userType = Number(admin.user?.user_type);
      const roleText = getAdminTypeLabel(userType).label.toLowerCase();

      return (
        `${admin.first_name} ${admin.last_name}`
          .toLowerCase()
          .includes(q) ||
        (admin.email ?? "").includes(q) ||
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
          placeholder="Search by name, phone, or type..."
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
              <th className="p-4">Admin Type</th>
              <th className="p-4 text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {loading && (
              <tr>
                <td colSpan={5} className="p-6 text-center">
                  Loading...
                </td>
              </tr>
            )}

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

            {!loading &&
              filteredAdmins.map((admin, index) => {
                const userType = Number(admin.user?.user_type);
                const role = getAdminTypeLabel(userType);

                return (
                  <tr
                    key={admin.admin_user_id}
                    className="border-t hover:bg-gray-50"
                  >
                    <td className="p-4 font-medium">
                      {index + 1}
                    </td>

                    <td className="p-4 font-medium">
                      {admin.first_name} {admin.last_name}
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
                        <button
                          type="button"
                          className="text-gray-600 hover:text-blue-600"
                        >
                          <EyeIcon className="w-5 h-5" />
                        </button>

                        <button
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
