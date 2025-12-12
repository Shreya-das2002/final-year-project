import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./Screen/Common/Header/index";
import Footer from "./Screen/Common/Footer/index";
import HomePage from "./Screen/Homepage/index";
import About from "./Screen/About";

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
        {/* <Route path="/privacy" element={<Privacy />} /> */}
      </Routes>
      </main>
    <div className="">
      <Footer/>
      </div>
    </div>
    </BrowserRouter>
    </>
  );
};

export default App;
