import { Outlet } from "react-router-dom";
import { useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../../../store/store";
import SideNav from "../Common/SideNav";
import AdminProfile from "./Profile";

const Admin = () => {
  const [openProfileDrawer, setOpenProfileDrawer] = useState(false);
  const user = useSelector((state: RootState) => state.auth.user);

  return (
    <div className="flex">
      <SideNav onProfileClick={() => setOpenProfileDrawer(true)} />

      <main className="ml-64 w-screen">
        <Outlet />
      </main>

      {/* RIGHT DRAWER */}
      <AdminProfile
        open={openProfileDrawer}
        onClose={() => setOpenProfileDrawer(false)}
        user={user}
      />
    </div>
  );
};

export default Admin;
