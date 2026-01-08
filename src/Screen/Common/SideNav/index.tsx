import AdminNav from "./AdminNav";
import DoctorNav from "./DoctorNav";
import PatientNav from "./PatientNav";

type Role = "admin" | "doctor" | "patient";

const SideNav = ({ role }: { role: Role }) => {
    if (role === "patient") return <PatientNav />;
    if (role === "doctor") return <DoctorNav />;
    if (role === "admin") return <AdminNav />;

  return null;
};

export default SideNav;
