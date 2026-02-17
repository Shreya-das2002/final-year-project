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
      <main className="relative ml-64 w-screen">

{/* RIGHT PROFILE DRAWER */}
      <PatientProfileView
        open={openProfileDrawer}
        onClose={() => setOpenProfileDrawer(false)}
      />

        <Outlet />
      </main>

      

    </div>
  );
};

export default Patient;
