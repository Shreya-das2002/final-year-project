import { Outlet } from "react-router-dom";
import SideNav from "../Common/SideNav";


const Doctor = () => {
  // const [openProfileDrawer, setOpenProfileDrawer] = useState(false);
  // const user = useSelector((state: RootState) => state.auth.user);

  return (
    <div className="flex">
      <SideNav  />

      <main className="ml-64 w-screen">
        <Outlet />
      </main>

      {/* RIGHT DRAWER
      <AdminProfile
        open={openProfileDrawer}
        onClose={() => setOpenProfileDrawer(false)}
        user={user}
      /> */}
    </div>
  );
};

export default Doctor;
