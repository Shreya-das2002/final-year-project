import React from "react";
import { BrowserRouter } from "react-router-dom";
import Header from "./Screen/Common/Header/index";

const App: React.FC = () => {
  return (
    <>
    <BrowserRouter>
    <div>
      <Header />
    </div>
    </BrowserRouter>
    </>
  );
};

export default App;
