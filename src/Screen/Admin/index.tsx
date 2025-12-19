import { Outlet } from "react-router-dom";
import SideNav from "../Common/SideNav";

const Admin = () => {
  return (
    <div className="flex">
      {/* Admin Sidebar */}
      <SideNav role="admin" />

      {/* Page Content */}
      <main className="flex-1 p-6 bg-gray-100 min-h-screen">
        <Outlet />
      </main>
    </div>
  );
};

export default Admin;
