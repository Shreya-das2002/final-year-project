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

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const fullName = `${user.first_name || ""} ${user.middle_name || ""} ${user.last_name || ""} `;

  return (
    <aside className="w-64 bg-teal-700 rounded-lg text-white flex flex-col min-h-screen">

      {/* Profile Header */}
      <div className="p-6 border-b border-teal-600 flex flex-col items-center text-center">
        <div className="w-20 h-20 rounded-full bg-slate-200 flex items-center justify-center overflow-hidden">
          <img
            src="/src/assets/avatar.png"
            alt="Profile"
            className="w-full h-full object-cover"
          />
        </div>

        <h3 className="mt-3 font-semibold text-slate-800">
          {fullName || "Patient"}
        </h3>
      </div>

      <nav className="flex-1 p-4 space-y-3">
        <NavItem icon={<FaHome />} text="Dashboard" onClick={() => navigate("/patient")} />
        <NavItem icon={<FaUser />} text="Profile" onClick={() => navigate("/patient/profile")} />
        <NavItem icon={<FaComments />} text="Symptom Checker" />
        <NavItem icon={<FaRobot />} text="SymptoBot" />
        <NavItem icon={<FaCalendarAlt />} text="Appointments" />
        <NavItem icon={<FaCommentDots />} text="Feedback" onClick={() => navigate("/patient/feedback")} />
      </nav>

      <div className="p-4 border-t border-teal-600">
        <button className="flex items-center gap-3 w-full p-3 rounded-lg bg-red-600 hover:bg-red-700">
          <FaSignOutAlt /> Logout
        </button>
      </div>

    </aside>
  );
};

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

