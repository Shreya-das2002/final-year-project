import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

const Footer: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigate = (path: string) => {
    if (location.pathname === path) {
      navigate("/"); // Toggle back to Home
    } else {
      navigate(path); // Navigate to clicked page
    }
  };

  return (

    <footer className="fixed bottom-0 left-0 w-full h-12 py-3 px-6 bg-gradient-to-r from-sky-100 to-blue-300 dark:from-gray-700 dark:to-gray-800 z-50">

      <div className="mx-w-7xl mx-auto px-6 flex items-center justify-between">
        <p className="text-sm">
          © {new Date().getFullYear()} SymptoNexus. All rights reserved.
        </p>

        <div className="flex items-center gap-6 text-sm">
          <span 
            onClick={() => handleNavigate("/about")}
            className="hover:text-green-800 dark:hover:text-teal-600 cursor-pointer"
          >
            About
          </span>

          <span 
            onClick={() => handleNavigate("/privacy")}
            className="hover:text-green-800 dark:hover:text-teal-600 cursor-pointer"
          >
            Privacy Policy
          </span>

          <span 
            onClick={() => handleNavigate("/contact")}
            className="hover:text-green-800 dark:hover:text-teal-600 cursor-pointer"
          >
            Contact
          </span>

          <span 
            onClick={() => handleNavigate("/faq")}
            className="hover:text-green-800 dark:hover:text-teal-600 cursor-pointer"
          >
            FAQs
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
