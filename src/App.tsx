import React from "react";
import { BrowserRouter } from "react-router-dom";
import Header from "./Screen/Common/Header/index";
import Footer from "./Screen/Common/Footer/index";
import HomePage from "./Screen/Homepage/index";

const App: React.FC = () => {
  return (
    <>
    <BrowserRouter>
    <div className="min-h-screen flex flex-col">
      <Header />
    <div/>
      <main className="flex-grow">
        <HomePage />
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
