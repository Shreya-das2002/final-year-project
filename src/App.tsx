import React from "react";
import { useEffect } from "react";
import { useSelector,useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../store/store";
import { logout, loginSuccess } from "../store/slices/authSlice";
import { isTokenExpired } from "./utils/jwt";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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

const { user, role } = useSelector(
  (state: RootState) => state.auth
);

const dispatch = useDispatch<AppDispatch>();

useEffect(() => {
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");
  const role = localStorage.getItem("role");
  const menus = localStorage.getItem("menus");

  // No token → logout
  if (!token || !user || !role) {
    dispatch(logout());
    return;
  }

  // Token expired → logout
  if (isTokenExpired(token)) {
    localStorage.clear();
    dispatch(logout());
    return;
  }

  // Restore redux
  dispatch(
    loginSuccess({
      token,
      user: JSON.parse(user),
      role,
      menus: menus ? JSON.parse(menus) : [],
    })
  );
}, [dispatch]);

  return (
    <BrowserRouter>
      <div className="bg-gray-100 dark:bg-gray-900 min-h-screen flex flex-col">

        <Header />

        <main className="flex-grow">
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

           {/* ================= PATIENT ROUTES ================= */}
            {user && role === "patient" && (
              <Route
                path="/patient"
                element={
                  <PrivateRoute>
                    <Patient />
                  </PrivateRoute>
                }
              >
                <Route index element={<Patientpage />} />
                <Route path="profile" element={<Profile />} />
                <Route path="profile_edit" element={<PatientProfileView />} />
                <Route path="feedback" element={<Feedback />} />
              </Route>
            )}

            {/* ================= ADMIN ROUTES ================= */}
            {user && role?.includes("admin") && (
              <Route
                path="/admin"
                element={
                  <PrivateRoute>
                    <Admin />
                  </PrivateRoute>
                }
              />
            )}

          </Routes>

        </main>

        <Footer />

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