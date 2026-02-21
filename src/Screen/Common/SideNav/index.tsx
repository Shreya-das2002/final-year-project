import React from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../../../store/store";
import { logout } from "../../../../store/slices/authSlice";
import { MENU_ROUTE_MAP, SIDE_NAV_CONTROLS } from "../../../Environment";

interface SideNavProps {
  onProfileClick?: () => void;
}

interface Menu {
  control_master_id: number;
  control_key: string;
  control_name: string;
  control_type: string;
  control_desc: string | null;
  status: string;
}

const SideNav: React.FC<SideNavProps> = ({ onProfileClick }) => {

  const navigate = useNavigate();
  const dispatch = useDispatch();

  /* ================= REDUX ================= */

  const user = useSelector((state: RootState) => state.auth.user);
  const menus = useSelector((state: RootState) => state.auth.menus);
  const role = useSelector((state: RootState) => state.auth.role);

  /* ================= KEEP YOUR EXISTING LOGIC ================= */

  const normalizedRole = role?.toLowerCase();

  /* ================= ORDER MENUS ================= */

  const orderedMenus: Menu[] = SIDE_NAV_CONTROLS
    .map((key) => menus.find((menu) => menu.control_key === key))
    .filter((menu): menu is Menu => Boolean(menu));

  /* ================= INITIALS ================= */

  const firstLetter =
    user?.first_name?.charAt(0)?.toUpperCase() || "";

  const lastLetter =
    user?.last_name?.charAt(0)?.toUpperCase() || "";

  /* ================= PROFILE CLICK ================= */

  const handleProfileClick = () => {

    console.log("PROFILE CLICK", normalizedRole);

    if (!user) return;

    // PATIENT
    if (normalizedRole?.includes("patient")) {
      onProfileClick?.();
      return;
    }

    // ADMIN (super admin, standard admin, guest admin)
    if (normalizedRole?.includes("admin")) {
      onProfileClick?.();
      return;
    }

    if (normalizedRole?.includes("doctor")) {
      onProfileClick?.();
      return;
    }

  };

  /* ================= MENU CLICK ================= */

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
    }

  };

  /* ================= UI ================= */

  return (
    <aside className="fixed top-16 bottom-12 left-0 w-64 bg-blue-900 text-white flex flex-col z-40">

      {/* PROFILE */}

      <div
        className="flex flex-col items-center py-6 border-b border-blue-700 cursor-pointer transition"
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

      {/* MENUS */}

      <ul className="flex-1 p-4 space-y-2">

        {orderedMenus.map((menu) => (

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
