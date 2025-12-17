import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./Screen/Common/Header/index";
import Footer from "./Screen/Common/Footer/index";
import HomePage from "./Screen/Homepage/index";
import About from "./Screen/Homepage/About";
import Privacy from "./Screen/Homepage/Privacy/index";
import Contact from "./Screen/Homepage/Contact";
import FAQ from "./Screen/Homepage/FAQs";

import RegistrationLogin from "./Screen/RegistrationLogin";
import Login from "./Screen/RegistrationLogin/Login";
import Signup from "./Screen/RegistrationLogin/Signup";

const App: React.FC = () => {
  return (
    <>
    <BrowserRouter>
    <div className=" bg-gray-100 dark:bg-gray-900 min-h-screen flex flex-col">
      <Header />
    <div/>
      <main className="flex-grow">
        <Routing />
      </main>
    <div>
      <Footer/>
      </div>
    </div>
    </BrowserRouter>
    </>
  );
};

export default App;




const Routing = ()=>(<Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<About />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/registrationlogin" element={<RegistrationLogin />} >
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<Signup />} />
        </Route>

      </Routes>
)
