import React from "react";
import { BrowserRouter } from "react-router-dom";
import Header from "./Screen/Common/Header/index";
import Footer from "./Screen/Common/Footer/index";

const App: React.FC = () => {
  return (
    <>
    <BrowserRouter>
    <div>
      <Header />
    <div/>
    <div>
      <Footer/>
      </div>
    </div>
    </BrowserRouter>
    </>
  );
};

export default App;
