import {
  FaHome,
  FaUser,
  FaComments,
  FaCalendarAlt,
  FaRobot,
  FaCommentDots,
  FaSignOutAlt,
} from "react-icons/fa";
import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";

/* ================= TYPES ================= */

interface NavItemProps {
  icon: ReactNode;
  text: string;
  onClick?: () => void;
}

/* ================= COMPONENT ================= */

const PatientNav: React.FC = () => {
  const navigate = useNavigate();

  // Read user only ONCE
  const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
  const image = localStorage.getItem("profileImage");

  const initials =
    storedUser.first_name?.charAt(0).toUpperCase() +
    storedUser.last_name?.charAt(0).toUpperCase();

  const fullName = `${storedUser.first_name || ""} ${storedUser.middle_name || ""} ${storedUser.last_name || ""}`;

  return (
    <aside className="w-64 bg-sky-600 rounded-lg text-white flex flex-col min-h-screen">

      {/* Profile Header */}
      <div className="p-6 border-b border-sky-600 flex flex-col items-center text-center">

        {/* Avatar */}
        <div className="w-20 h-20 rounded-full overflow-hidden bg-white flex items-center justify-center text-blue-600 text-xl font-semibold">
          {image ? (
            <img src={image} className="w-full h-full object-cover" />
          ) : (
            initials
          )}
        </div>

        <h3 className="mt-3 font-semibold text-gray-100">
          {fullName || "Patient"}
        </h3>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-3">
        <NavItem icon={<FaHome />} text="Dashboard" onClick={() => navigate("/patient")} />
        <NavItem icon={<FaUser />} text="Profile" onClick={() => navigate("/patient/profile")} />
        <NavItem icon={<FaComments />} text="Symptom Checker" />
        <NavItem icon={<FaRobot />} text="SymptoBot" />
        <NavItem icon={<FaCalendarAlt />} text="Appointments" />
        <NavItem icon={<FaCommentDots />} text="Feedback" onClick={() => navigate("/patient/feedback")} />
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-teal-600">
        <button className="flex items-center gap-3 w-full p-3 rounded-lg bg-red-600 hover:bg-red-700">
          <FaSignOutAlt /> Logout
        </button>
      </div>

    </aside>
  );
};

/* ================= ITEM ================= */

const NavItem: React.FC<NavItemProps> = ({ icon, text, onClick }) => (
  <button
    onClick={onClick}
    className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-teal-600"
  >
    {icon}
    {text}
  </button>
);

export default PatientNav;
