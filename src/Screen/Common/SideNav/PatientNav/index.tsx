
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
interface NavItemProps {
  icon: ReactNode;
  text: string;
  onClick?: () => void;
}

const PatientNav: React.FC = () => {
    const navigate = useNavigate();
  return (
    <aside className="w-64 bg-teal-700 text-white flex flex-col min-h-screen">

      <div className="p-6 text-2xl font-bold border-b border-teal-600">
        Patient Panel
      </div>

      <nav className="flex-1 p-4 space-y-3">
        <NavItem icon={<FaHome />} text="Dashboard" onClick={() => navigate("/patient")} />
        <NavItem icon={<FaUser />} text="Profile" />
        <NavItem icon={<FaComments />} text="Symptom Checker" />
        <NavItem icon={<FaRobot />} text="SymptoBot" />
        <NavItem icon={<FaCalendarAlt />} text="Appointments" />
        <NavItem icon={<FaCommentDots />} text="Feedback" />
      </nav>

      <div className="p-4 border-t border-teal-600">
        <button className="flex items-center gap-3 w-full p-3 rounded-lg bg-red-600 hover:bg-red-700">
          <FaSignOutAlt /> Logout
        </button>
      </div>

    </aside>
  );
};

const NavItem: React.FC<NavItemProps> = ({ icon, text }) => (
  <button className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-teal-600">
    {icon}
    {text}
  </button>
);

export default PatientNav;
