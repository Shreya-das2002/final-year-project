import SideNav from "../Common/SideNav";
import PatientPage from "./Patientpage";

const Patient = () => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <SideNav role="patient" />
      <div className="flex-1">
        <PatientPage />
      </div>
    </div>
  );
};

export default Patient;
