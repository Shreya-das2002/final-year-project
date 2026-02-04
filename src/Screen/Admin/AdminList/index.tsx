import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { EyeIcon, PencilSquareIcon } from "@heroicons/react/24/outline";
import { fetchAllAdmins } from "../../../../store/slices/adminSlice";
import type { RootState, AppDispatch } from "../../../../store/store";

const AdminList = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { admins, loading } = useSelector(
    (state: RootState) => state.admin
  );

  useEffect(() => {
    dispatch(fetchAllAdmins());
  }, [dispatch]);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">Admin List</h2>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-4">Name</th>
              <th className="p-4">Email</th>
              <th className="p-4">Phone</th>
              <th className="p-4">Admin Type</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {loading && (
              <tr>
                <td colSpan={6} className="p-6 text-center">
                  Loading...
                </td>
              </tr>
            )}

            {!loading && admins.length === 0 && (
              <tr>
                <td colSpan={6} className="p-6 text-center text-gray-500">
                  No admins found
                </td>
              </tr>
            )}

            {!loading &&
              admins.map((admin) => (
                <tr
                  key={admin.admin_user_id}
                  className="border-t hover:bg-gray-50"
                >
                  <td className="p-4">
                    {admin.first_name} {admin.last_name}
                  </td>
                  <td className="p-4">{admin.email}</td>
                  <td className="p-4">{admin.phone_no}</td>
                  <td className="p-4">
                    {admin.user_type === 1 ? "Super Admin" : "Admin"}
                  </td>
                  <td className="p-4 text-green-600 font-medium">
                    {admin.status ?? "Active"}
                  </td>

                  {/* ACTION ICONS */}
                  <td className="p-4">
                    <div className="flex justify-center gap-4">
                      <button
                        title="View Admin"
                        className="text-gray-600 hover:text-blue-600"
                        onClick={() =>
                          console.log("View admin", admin)
                        }
                      >
                        <EyeIcon className="w-5 h-5" />
                      </button>

                      <button
                        title="Edit Admin"
                        className="text-gray-600 hover:text-green-600"
                        onClick={() =>
                          console.log("Edit admin", admin)
                        }
                      >
                        <PencilSquareIcon className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminList;
