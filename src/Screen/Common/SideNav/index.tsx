import AdminSideNav from "./AdminNav";
import DoctorSideNav from "./DoctorNav";
import PatientSideNav from "./PatientNav";

type Role = "admin" | "doctor" | "patient";

const SideNav = ({ role }: { role: Role }) => {
    if (role === "admin") return <AdminSideNav />;
    if (role === "doctor") return <DoctorSideNav />;
    return <PatientSideNav />;
};

export default SideNav;
