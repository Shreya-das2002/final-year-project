import SideNav from "../Common/SideNav";
import { Outlet } from "react-router-dom";
import { useState } from "react";
import PatientProfileView from "./Profile/PatientProfileView";

const Patient = () => {
  const [openProfileDrawer, setOpenProfileDrawer] = useState(false);


  return (
    <div className="flex">

      {/* SIDENAV */}
      <SideNav onProfileClick={() => setOpenProfileDrawer(true)} />

      {/* MAIN CONTENT */}
      <main className="ml-64 w-screen">
        <Outlet />
      </main>

      {/* RIGHT PROFILE DRAWER */}
      <PatientProfileView
        open={openProfileDrawer}
        onClose={() => setOpenProfileDrawer(false)}
      />

    </div>
  );
};

export default Patient;
