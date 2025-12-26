import { NavLink } from "react-router-dom";
import { FaHome, FaUserPlus, FaUserMd } from "react-icons/fa";

const AdminSideNav = () => (
  <aside className="w-64 min-h-screen bg-blue-600 text-white">
    <div className="p-6 text-xl font-bold">Admin Panel</div>

    <nav className="px-4 space-y-2">
      <NavLink to="/admin/home" className="block p-3 rounded hover:bg-blue-500">
        <FaHome /> Home
      </NavLink>

      <NavLink to="/admin/add-doctor" className="block p-3 rounded hover:bg-blue-500">
        <FaUserPlus /> Add Doctor
      </NavLink>

      <NavLink to="/admin/doctors" className="block p-3 rounded hover:bg-blue-500">
        <FaUserMd /> Doctor List
      </NavLink>
      <NavLink to="/admin/doctors" className="block p-3 rounded hover:bg-blue-500">
        <FaUserMd /> Exit
      </NavLink>
    </nav>
  </aside>
);

export default AdminSideNav;
