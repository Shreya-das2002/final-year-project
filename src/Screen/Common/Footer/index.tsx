import React from "react";

const Footer: React.FC = () => {
    return (
        <footer className="w-full bg-gray-200 dark:bg-gray-900 text-gray-600 py-3 mt-auto">
            <div className="container mx-auto text-center text-sm">
                <p className="mb-2">© {new Date().getFullYear()} SymptoNexus. All rights reserved.</p>
                <div className="flex justify-center gap-4">
                    <a href="/about" className="hover:text-teal-600 transition">About</a>
                    <a href="/privacy" className="hover:text-teal-600 transition">Privacy Policy</a>
                    <a href="/Contact" className="hover:text-teal-600 transition">Contact</a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
