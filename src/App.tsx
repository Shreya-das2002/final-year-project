import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../store/store";
import { logout, loginSuccess } from "../store/slices/authSlice";
import { isTokenExpired } from "./utils/jwt";
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

import Header from "./Screen/Common/Header";
import Footer from "./Screen/Common/Footer";

import HomePage from "./Screen/Homepage";
import About from "./Screen/Homepage/About";
import Privacy from "./Screen/Homepage/Privacy";
import Contact from "./Screen/Homepage/Contact";
import FAQ from "./Screen/Homepage/FAQs";

import RegistrationLogin from "./Screen/RegistrationLogin";
import Login from "./Screen/RegistrationLogin/Login";
import Signup from "./Screen/RegistrationLogin/Signup";

import Patient from "./Screen/Patient";
import Patientpage from "./Screen/Patient/Dashboard";
import Profile from "./Screen/Patient/Profile";
import Feedback from "./Screen/Patient/Feedback";
import SymptoChecker from "./Screen/Patient/SymptoChecker";
import SymptoBot from "./Screen/Patient/SymptoBot";
import Appointments from "./Screen/Patient/Appointments";

import Admin from "./Screen/Admin";
import PrivateRoute from "./Screen/Common/Route/PrivateRoute";
import CreateAdmin from "./Screen/Admin/Create Admin";
import AdminList from "./Screen/Admin/AdminList";
import AdminDashboard from "./Screen/Admin/Dashboard";
import PendingDoctorlist from "./Screen/Admin/PendingDoctorlist";
import DoctorList from "./Screen/Admin/DoctorList";
import AddDoctor from "./Screen/Admin/AddDoctor";
import Messages from "./Screen/Admin/Messages";
import Doctor from "./Screen/Doctor";
import DoctorDashbord from "./Screen/Doctor/Dashbord";
import DoctorAppointments from "./Screen/Doctor/DoctorAppointments";
import AppointmentRequests from "./Screen/Doctor/AppointmentRequests";

/* ================= LAYOUT (SAFE PLACE FOR useLocation) ================= */

const AppLayout: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const location = useLocation();

  const hideNavOnRoutes = ["/patient", "/doctor", "/admin"];
  const shouldHideNav = hideNavOnRoutes.some(path =>
    location.pathname.startsWith(path)
  );

  /* ---------- AUTH BOOTSTRAP ---------- */
  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    const role = localStorage.getItem("role");
    const menus = localStorage.getItem("menus");

    if (!token || !user || !role) {
      dispatch(logout());
      return;
    }

    if (isTokenExpired(token)) {
      localStorage.clear();
      dispatch(logout());
      return;
    }

    dispatch(
      loginSuccess({
        token,
        user: JSON.parse(user),
        role,
        menus: menus ? JSON.parse(menus) : [],
      })
    );
  }, [dispatch]);

  /* ---------- AUTO LOGOUT ---------- */
  useEffect(() => {
    const interval = setInterval(() => {
      const token = localStorage.getItem("token");
      if (!token || isTokenExpired(token)) {
        localStorage.clear();
        dispatch(logout());
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [dispatch]);

  return (
    <div className="h-screen overflow-hidden bg-gray-100 dark:bg-gray-900">

      <Header />

      {/* CONTENT AREA */}
      <div className={`${shouldHideNav ? "pt-16" : "pt-32"} pb-12 h-full flex`}>
        <main className="flex-1 overflow-y-auto p-6">
          <Routes>
            {/* PUBLIC */}
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<About />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/faq" element={<FAQ />} />

            <Route path="/registrationlogin" element={<RegistrationLogin />}>
              <Route path="login" element={<Login />} />
              <Route path="signup" element={<Signup />} />
            </Route>

            {/* PATIENT */}
            <Route
              path="/patient"
              element={
                <PrivateRoute allowedRoles={["patient"]}>
                  <Patient />
                </PrivateRoute>
              }
            >
              <Route index element={<Patientpage />} />
              <Route path="profile" element={<Profile />} />
              <Route path="feedback" element={<Feedback />} />
              <Route path="symptom_checker" element={<SymptoChecker/>} />
              <Route path="symptobot" element={<SymptoBot/>} />
              <Route path="patient_appointments" element={<Appointments/>} />
            </Route>

            {/* ADMIN */}
            <Route
              path="/admin"
              element={
                <PrivateRoute allowedRoles={["admin"]}>
                  <Admin />
                </PrivateRoute>
              }
            >
              <Route index element={<AdminDashboard />} />
              <Route path="create_admin" element={<CreateAdmin />} />
              <Route path="admin_list" element={<AdminList/>} />
              <Route path="pending_doctor_list" element={<PendingDoctorlist/>} />
              <Route path="doctor_list" element={<DoctorList/>} />
              <Route path="messages" element={<Messages/>} />
              <Route path="add_doctor" element={<AddDoctor/>} />
            </Route>

            {/* Doctor */}
            <Route
              path="/doctor"
              element={
                <PrivateRoute allowedRoles={["doctor"]}>
                  <Doctor/>
                </PrivateRoute>
              }
            >
              <Route index element={< DoctorDashbord/>} />
              <Route path="appointment" element={<DoctorAppointments/>} />
              <Route path="appointment_requests" element={<AppointmentRequests/>} />
            </Route>

          </Routes>
        </main>
      </div>

      <Footer />
    </div>
  );
};

/* ================= ROOT ================= */

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
};

export default App;


  {/* {
    !!user  &&UserActivation.user_type == 3 &&
        <Route path="/patient" element={<Patient />}>
  <Route index element={<Patientpage />} />
  <Route path="profile" element={<Profile />} />
  <Route path="profile_edit" element={<PatientProfileView />} />
  <Route path="feedback" element={<Feedback />} />
  } */}