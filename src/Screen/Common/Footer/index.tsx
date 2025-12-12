import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-gray-200 dark:bg-gray-900 text-gray-600 py-4 text-center">
      <div className="container mx-auto">
        <p className="mb-2">© {new Date().getFullYear()} SymptoNexus. All rights reserved.</p>
        <div className="flex justify-center gap-4">
          <a href="/about" className="hover:text-teal-600">About</a>
          <a href="/privacy" className="hover:text-teal-600">Privacy Policy</a>
          <a href="/contact" className="hover:text-teal-600">Contact</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;