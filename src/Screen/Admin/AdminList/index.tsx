import { EyeIcon, PencilSquareIcon } from "@heroicons/react/24/outline";

const AdminList = () => {
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
            <tr className="border-t hover:bg-gray-50">
              <td className="p-4">Shruti Das</td>
              <td className="p-4">superadmin@gmail.com</td>
              <td className="p-4">9876543210</td>
              <td className="p-4">Super Admin</td>
              <td className="p-4 text-green-600 font-medium">Active</td>

              {/* ACTION ICONS */}
              <td className="p-4">
                <div className="flex justify-center gap-4">
                  <button
                    title="View Admin"
                    className="text-gray-600 hover:text-blue-600"
                    onClick={() => console.log("View admin")}
                  >
                    <EyeIcon className="w-5 h-5" />
                  </button>

                  <button
                    title="Edit Admin"
                    className="text-gray-600 hover:text-green-600"
                    onClick={() => console.log("Edit admin")}
                  >
                    <PencilSquareIcon className="w-5 h-5" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminList;
