

const AdminList = () => {
 

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      
      {/* Header Section */}
      <div className="flex items-center justify-between mb-6">
        <button
        
          className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          + Add Admin
        </button>

        <h2 className="text-2xl font-semibold">Admin List</h2>
      </div>

      {/* Admin Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-4">Name</th>
              <th className="p-4">Email</th>
              <th className="p-4">Phone</th>
              <th className="p-4">Admin Type</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-t">
              <td className="p-4">Shruti Das</td>
              <td className="p-4">superadmin@gmail.com</td>
              <td className="p-4">9876543210</td>
              <td className="p-4">Super Admin</td>
              <td className="p-4 text-green-600 font-medium">Active</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Drawer */}
    </div>
  );
};

export default AdminList;
