import React from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../../../store/store";
import { logout } from "../../../../store/slices/authSlice";
import { getRoute } from "../../../Environment";

const SideNav: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // DATA FROM LOGIN API (REDUX)
  const user = useSelector((state: RootState) => state.auth.user);
  const menus = useSelector((state: RootState) => state.auth.menus);
  const role = useSelector((state: RootState) => state.auth.role);

  /* ================= AVATAR LETTERS ================= */
  const firstLetter =
    user?.first_name?.charAt(0)?.toUpperCase() || "";
  const lastLetter =
    user?.last_name?.charAt(0)?.toUpperCase() || "";

  /* ================= PROFILE NAV ================= */
  const handleProfileClick = () => {
    if (role === "patient") navigate("/patient/profile_edit");
    else if (role === "doctor") navigate("/doctor/profile");
    else navigate("/admin/profile");
  };

  /* ================= MENU NAV ================= */
  const handleMenuClick = (controlKey: string) => {
    if (controlKey === "logout") {
      dispatch(logout());
      localStorage.clear();
      navigate("/registrationlogin/login");
      return;
    }

    navigate(getRoute(controlKey));
  };

  return (
    <aside className="w-64 bg-blue-900 text-white min-h-screen flex flex-col">

      {/* ===== PROFILE HEADER (OLD DESIGN PRESERVED) ===== */}
      <div
        className="flex flex-col items-center py-6 border-b border-blue-700 cursor-pointer"
        onClick={handleProfileClick}
      >
        {/* AVATAR */}
        <div className="w-16 h-16 rounded-full bg-blue-500 flex items-center justify-center text-xl font-bold mb-2">
          {firstLetter}{lastLetter}
        </div>

        {/* NAME */}
        <p className="font-semibold text-center">
          {user?.first_name} {user?.last_name}
        </p>

        {/* EMAIL */}
        <p className="text-sm text-blue-200 text-center break-all px-2">
          {user?.email}
        </p>
      </div>

      {/* ===== MENU LIST (DB CONTROLLED) ===== */}
      <ul className="flex-1 p-4 space-y-2">
        {menus.map((menu) => (
          <li
            key={menu.control_master_id}
            onClick={() => handleMenuClick(menu.control_key)}
            className="cursor-pointer px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            {menu.control_name}
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default SideNav;
