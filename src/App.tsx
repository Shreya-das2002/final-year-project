

import React from "react";
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

            {/* PROTECTED PATIENT ROUTES */}
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

            <Route>
              <Route path="/admin" element={<Admin/>} />
            </Route>

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