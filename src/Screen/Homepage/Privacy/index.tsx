import React from "react";
import { FaLock, FaUserShield, FaDatabase, FaEnvelope } from "react-icons/fa";

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 px-4 py-10">
      {/* ================= PAGE HEADER ================= */}
      <div className="max-w-4xl mx-auto text-center mb-10">
        <h1 className="text-4xl font-bold text-blue-600 dark:text-white mb-3">
          Privacy Policy
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Your privacy matters. This policy explains how SymptoNexus collects,
          uses, and protects your information.
        </p>
      </div>

      {/* ================= CONTENT CARD ================= */}
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 space-y-8 text-gray-700 dark:text-gray-300 leading-relaxed">

        {/* Introduction */}
        <section>
          <h2 className="text-2xl font-semibold text-blue-500 mb-2">
            1. Introduction
          </h2>
          <p>
            At SymptoNexus, we respect your privacy and are committed to protecting
            your personal and health-related information. This Privacy Policy
            outlines how we handle your data when you use our platform.
          </p>
        </section>

        {/* Information We Collect */}
        <section>
          <h2 className="text-2xl font-semibold text-blue-500 mb-3">
            2. Information We Collect
          </h2>

          <div className="space-y-2">
            <p className="flex items-center gap-2">
              <FaUserShield className="text-blue-500" />
              Personal details such as name, email, and login credentials
            </p>
            <p className="flex items-center gap-2">
              <FaDatabase className="text-blue-500" />
              Health-related inputs like symptoms provided by users
            </p>
            <p className="flex items-center gap-2">
              <FaDatabase className="text-blue-500" />
              Usage data including browser type and device information
            </p>
          </div>
        </section>

        {/* How We Use Information */}
        <section>
          <h2 className="text-2xl font-semibold text-blue-500 mb-2">
            3. How We Use Your Information
          </h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>To provide accurate health guidance and services</li>
            <li>To improve platform performance and user experience</li>
            <li>To maintain security and prevent unauthorized access</li>
          </ul>
        </section>

        {/* Data Protection */}
        <section>
          <h2 className="text-2xl font-semibold text-blue-500 mb-2">
            4. Data Protection & Security
          </h2>
          <p className="flex items-center gap-2">
            <FaLock className="text-blue-500" />
            We use secure technologies and best practices to protect your data.
            We do not sell or share your personal information with third parties.
          </p>
        </section>

        {/* Cookies */}
        <section>
          <h2 className="text-2xl font-semibold text-blue-500 mb-2">
            5. Cookies & Tracking
          </h2>
          <p>
            SymptoNexus may use cookies to enhance functionality and improve your
            browsing experience. You can manage cookie preferences through your
            browser settings.
          </p>
        </section>

        {/* User Rights */}
        <section>
          <h2 className="text-2xl font-semibold text-blue-500 mb-2">
            6. Your Rights
          </h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>Access your personal information</li>
            <li>Update or correct your data</li>
            <li>Request deletion of your data</li>
          </ul>
        </section>

        {/* Policy Changes */}
        <section>
          <h2 className="text-2xl font-semibold text-blue-500 mb-2">
            7. Changes to This Policy
          </h2>
          <p>
            We may update this Privacy Policy from time to time. Any changes will
            be reflected on this page with an updated revision date.
          </p>
        </section>

        {/* Contact */}
        <section>
          <h2 className="text-2xl font-semibold text-blue-500 mb-2">
            8. Contact Us
          </h2>
          <p className="flex items-center gap-2">
            <FaEnvelope className="text-blue-500" />
            If you have any questions, contact us at:
            <span className="font-semibold text-blue-600 dark:text-blue-400">
              support@symptonexus.com
            </span>
          </p>
        </section>

        {/* Footer Note */}
        <div className="text-center text-sm text-gray-500 dark:text-gray-400 pt-6 border-t border-gray-300 dark:border-gray-700">
          Last updated: March 2025
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;

