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
    <footer className="w-full bg-gray-200 dark:bg-gray-900 text-gray-600 dark:text-gray-400 py-4 text-center">
      <div className="container mx-auto">
        <p className="mb-2">
          © {new Date().getFullYear()} SymptoNexus. All rights reserved.
        </p>

        <div className="flex justify-center gap-4">
          <span 
            onClick={() => handleNavigate("/about")}
            className="hover:text-teal-600 cursor-pointer"
          >
            About
          </span>

          <span 
            onClick={() => handleNavigate("/privacy")}
            className="hover:text-teal-600 cursor-pointer"
          >
            Privacy Policy
          </span>

          <span 
            onClick={() => handleNavigate("/contact")}
            className="hover:text-teal-600 cursor-pointer"
          >
            Contact
          </span>

          <span 
            onClick={() => handleNavigate("/faq")}
            className="hover:text-teal-600 cursor-pointer"
          >
            FAQs
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
