import { NavLink } from "react-router-dom";
import { FaHome, FaUsers, FaCalendar } from "react-icons/fa";

const DoctorSideNav = () => (
  <aside className="w-64 min-h-screen bg-green-600 text-white">
    <div className="p-6 text-xl font-bold">Doctor Panel</div>

    <nav className="px-4 space-y-2">
      <NavLink to="/doctor/home" className="block p-3 rounded hover:bg-green-500">
        <FaHome /> Dashboard
      </NavLink>

      <NavLink to="/doctor/patients" className="block p-3 rounded hover:bg-green-500">
        <FaUsers /> My Patients
      </NavLink>

      <NavLink to="/doctor/appointments" className="block p-3 rounded hover:bg-green-500">
        <FaCalendar /> Appointments
      </NavLink>
    </nav>
  </aside>
);

export default DoctorSideNav;
