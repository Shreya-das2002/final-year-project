import React from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../../../store/store";
import { logout } from "../../../../store/slices/authSlice";
import { MENU_ROUTE_MAP, MENU_ORDER_BY_ROLE } from "../../../Environment";

/* ================= TYPES ================= */

interface Menu {
  control_master_id: number;
  control_key: string;
  control_name: string;
  control_type: string;
  control_desc: string | null;
  status: string;
}

const SideNav: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // DATA FROM REDUX
  const user = useSelector((state: RootState) => state.auth.user);
  const menus = useSelector((state: RootState) => state.auth.menus);
  const role = useSelector((state: RootState) => state.auth.role);

  /* ================= ORDERED MENUS (FRONTEND CONTROLLED) ================= */

  const roleMenuOrder: string[] =
  MENU_ORDER_BY_ROLE[role ?? ""] ?? [];

const orderedMenus: Menu[] = roleMenuOrder
  .map((key: string) =>
    menus.find(
      (menu: Menu) => menu.control_key === key
    )
  )
  .filter((menu): menu is Menu => Boolean(menu));
  /* ================= AVATAR LETTERS ================= */

  const firstLetter =
    user?.first_name?.charAt(0)?.toUpperCase() || "";
  const lastLetter =
    user?.last_name?.charAt(0)?.toUpperCase() || "";

  /* ================= PROFILE NAV ================= */

  const handleProfileClick = () => {
    if (role === "patient") navigate("/patient/profile_edit");
    else if (role === "doctor") navigate("/doctor/profile");
    else if (role?.includes("admin")) navigate("/admin/profile");
  };

  /* ================= MENU NAV ================= */

  const handleMenuClick = (controlKey: string) => {
    if (controlKey === "logout") {
      dispatch(logout());
      localStorage.clear();
      navigate("/registrationlogin/login");
      return;
    }

    const route = MENU_ROUTE_MAP[controlKey];
    if (route) {
      navigate(route);
    } else {
      console.warn("Route not found for menu:", controlKey);
    }
  };

  /* ================= UI ================= */

  return (
    <aside className="w-64 bg-blue-900 text-white min-h-screen flex flex-col">

      {/* PROFILE HEADER */}
      <div
        className="flex flex-col items-center py-6 border-b border-blue-700 cursor-pointer"
        onClick={handleProfileClick}
      >
        <div className="w-16 h-16 rounded-full bg-blue-500 flex items-center justify-center text-xl font-bold mb-2">
          {firstLetter}{lastLetter}
        </div>

        <p className="font-semibold text-center">
          {user?.first_name} {user?.last_name}
        </p>

        <p className="text-sm text-blue-200 text-center break-all px-2">
          {user?.email}
        </p>
      </div>

      {/* MENU LIST */}
      <ul className="flex-1 p-4 space-y-2">
        {orderedMenus.map((menu: Menu) => (
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
