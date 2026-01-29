import SideNav from "../Common/SideNav";
import { Outlet } from "react-router-dom";

const Patient = () => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <SideNav/>
      
      <div className="flex-1 p-6">
        <Outlet />
      </div>
    </div>
  );
};

export default Patient;
