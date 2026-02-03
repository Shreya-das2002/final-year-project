import { Outlet } from "react-router-dom";
import SideNav from "../Common/SideNav";

const Admin = () => {
  return (
    <div className="flex">
      <SideNav />

      <main className="ml-64 w-screen">
        <Outlet />
      </main>
    </div>
  );
};

export default Admin;
