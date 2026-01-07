import { NavLink } from "react-router-dom";
import { FaHome, FaUserMd, FaFileMedical } from "react-icons/fa";

const PatientSideNav = () => (
  <aside className="w-64 min-h-screen bg-purple-600 text-white">
    <div className="p-6 text-xl font-bold">Patient Panel</div>

    <nav className="px-4 space-y-2">
      <NavLink to="/patient/home" className="block p-3 rounded hover:bg-purple-500">
        <FaHome /> Dashboard
      </NavLink>

      <NavLink to="/patient/doctors" className="block p-3 rounded hover:bg-purple-500">
        <FaUserMd /> Find Doctor
      </NavLink>

      <NavLink to="/patient/reports" className="block p-3 rounded hover:bg-purple-500">
        <FaFileMedical /> Reports
      </NavLink>
    </nav>
  </aside>
);

export default PatientSideNav;
