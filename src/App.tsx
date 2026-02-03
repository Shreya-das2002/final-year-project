import React from "react";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../store/store";
import { logout, loginSuccess } from "../store/slices/authSlice";
import { isTokenExpired } from "./utils/jwt";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
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
import PatientProfileView from "./Screen/Patient/Profile/PatientProfileView";
import Feedback from "./Screen/Patient/Feedback";

import PrivateRoute from "./Screen/Common/Route/PrivateRoute";


import Admin from "./Screen/Admin";

const App: React.FC = () => {

const dispatch = useDispatch<AppDispatch>();
const location = useLocation();

const hideNavOnRoutes = ["/patient", "/doctor", "/admin"];

  const shouldHideNav = hideNavOnRoutes.some(path =>
    location.pathname.startsWith(path)
  );

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

  // Auto logout watcher
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
    <BrowserRouter>
        <div className="h-screen overflow-hidden bg-gray-100 dark:bg-gray-900">

    <Header />

    {/* CONTENT AREA */}
    <div className={`${shouldHideNav ? "pt-16" : "pt-32"} pb-12 h-full flex`}>

      {/* MAIN CONTENT */}
      <main className="flex-1 overflow-y-auto p-6 ml-0 md:ml-0">
          <Routes>

            {/* PUBLIC ROUTES */}
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
          <Route path="profile_edit" element={<PatientProfileView />} />
          <Route path="feedback" element={<Feedback />} />

        </Route>

        {/* ADMIN */}
        <Route
          path="/admin"
          element={
            <PrivateRoute allowedRoles={["admin", "super admin"]}>
              <Admin />
            </PrivateRoute>
          }
        />

          </Routes>

        </main>

        <Footer />
      </div>
      </div>
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