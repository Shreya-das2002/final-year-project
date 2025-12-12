import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

const Footer: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const handleAboutClick = () => {
    if (location.pathname === "/about") {
      navigate("/");
    } else {
      navigate("/about"); 
    }
  };
  return (
    <footer className="w-full bg-gray-200 dark:bg-gray-900 text-gray-600 dark:text-gray-400 py-4 text-center">
      <div className="container mx-auto">
        <p className="mb-2">© {new Date().getFullYear()} SymptoNexus. All rights reserved.</p>
        <div className="flex justify-center gap-4">
              <span
            onClick={handleAboutClick}
            className="hover:text-teal-600 cursor-pointer"
          >
            About
          </span>
              <span
            onClick={handleAboutClick}
            className="hover:text-teal-600 cursor-pointer"
          >
            Privacy Policy
          </span>
          <span
            onClick={handleAboutClick}
            className="hover:text-teal-600 cursor-pointer"
          >
            Contact
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;