import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./Screen/Common/Header/index";
import Footer from "./Screen/Common/Footer/index";
import HomePage from "./Screen/Homepage/index";
import About from "./Screen/About";
import Privacy from "./Screen/Privacy";
import Contact from "./Screen/Contact";
import Signup from "./Screen/Login/Signup";

const App: React.FC = () => {
  return (
    <>
    <BrowserRouter>
    <div className="min-h-screen flex flex-col">
      <Header />
    <div/>
      <main className="flex-grow">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<About />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/signup" element={<Signup />} />

      </Routes>
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
