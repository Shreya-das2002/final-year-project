import React from "react";
import { FaUserShield, FaDatabase, FaEnvelope } from "react-icons/fa";

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 px-4 py-10">
      {/* ================= PAGE HEADER ================= */}
      <div className="max-w-4xl mx-auto text-center mb-10">
        <h1 className="text-4xl font-bold text-blue-600 dark:text-white mb-3">
          Privacy Policy
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          SymptoNexus is committed to protecting your privacy. This policy explains
          how we collect, use, and safeguard your personal and health-related
          information when you use our platform.
        </p>
      </div>

      {/* ================= CONTENT CARD ================= */}
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 space-y-8 text-gray-700 dark:text-gray-300 leading-relaxed">

        {/* Introduction */}
        <section>
          <h2 className="text-2xl font-semibold text-blue-500 dark:text-white mb-2">
            1. Introduction
          </h2>
          <p>
            SymptoNexus is a healthcare support platform designed to help users understand symptoms, explore home remedies, and connect with doctors.
            Protecting your privacy is a priority for us. This Privacy Policy explains how we collect, use, and protect information when you interact with our website and services.
          </p>
        </section>

        {/* Information We Collect */}
        <section>
          <h2 className="text-2xl font-semibold text-blue-500 dark:text-white mb-3">
            2. Information We Collect
          </h2>

          <div className="space-y-2">
            <p className="flex items-center gap-2">
              <FaUserShield className="text-blue-500 dark:text-white" />
              Personal details such as name, email address, and account credentials
            </p>

            <p className="flex items-baseline gap-2">
              <FaDatabase className="text-blue-500 dark:text-white" />
              Health-related inputs such as symptoms entered for informational guidance
            </p>

            <p className="flex items-baseline gap-2">
              <FaDatabase className="text-blue-500 dark:text-white" />
              Technical information including browser type, device information, and usage data
            </p>

            <p className="flex items-center gap-2">
              <FaDatabase className="text-blue-500 dark:text-white" />
              Interaction data such as searches, health queries, and platform activity
            </p>
          </div>
        </section>

        {/* How We Use Information */}
        <section>
          <h2 className="text-2xl font-semibold text-blue-500 dark:text-white mb-2">
            3. How We Use Your Information
          </h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>Provide symptom guidance and health-related information</li>
            <li>Suggest possible home remedies and healthcare resources</li>
            <li>Improve platform performance and user experience</li>
            <li>Maintain security and prevent misuse of the platform</li>
            <li>Support doctor connection and consultation features</li>
          </ul>
        </section>

        {/* Data Protection */}
        <section>
          <h2 className="text-2xl font-semibold text-blue-500 dark:text-white mb-2">
            4. Data Protection & Security
          </h2>
          <p className="flex items-baseline gap-2">
            SymptoNexus uses secure technologies and best practices to protect
            user information. We implement authentication mechanisms, secure
            database storage, and encrypted communication where possible.
            We do not sell or trade personal data to third parties.
          </p>
        </section>

        {/* Cookies */}
        <section>
          <h2 className="text-2xl font-semibold text-blue-500 dark:text-white mb-2">
            5. Cookies & Tracking
          </h2>
          <p>
            SymptoNexus may use cookies or similar technologies to maintain
            user sessions, analyze platform usage, and improve functionality.
            Users can manage or disable cookies through their browser settings,
            although some features of the platform may not work properly.
          </p>
        </section>

        {/* User Rights */}
        <section>
          <h2 className="text-2xl font-semibold text-blue-500 dark:text-white mb-2">
            6. Your Rights
          </h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>Access the personal information associated with your account</li>
            <li>Update or correct inaccurate information</li>
            <li>Request deletion of your account and associated data</li>
            <li>Contact the team regarding privacy-related concerns</li>
          </ul>
        </section>

        {/* Medical Disclaimer */}

        <section>
          <h2 className="text-2xl font-semibold text-blue-500 dark:text-white mb-2">
            7. Medical Disclaimer
          </h2>
          <p>
            SymptoNexus provides health-related information and guidance for
            educational purposes only. The information available on this platform
            should not be considered professional medical advice, diagnosis, or
            treatment. Users should consult qualified healthcare professionals
            for proper medical evaluation and treatment.
          </p>
        </section>

        {/* Policy Changes */}
        <section>
          <h2 className="text-2xl font-semibold text-blue-500 dark:text-white mb-2">
            8. Changes to This Policy
          </h2>
          <p>
            We may update this Privacy Policy from time to time. Any changes will
            be reflected on this page with an updated revision date.
          </p>
        </section>

        {/* Contact */}
        <section>
          <h2 className="text-2xl font-semibold text-blue-500 dark:text-white mb-2">
            9. Contact Us
          </h2>

          <p className="mb-3">
            If you have questions about this Privacy Policy or how your data is handled,
            please contact the SymptoNexus team at:
          </p>

          <p className="flex items-center justify-center gap-2">
            <FaEnvelope className="text-blue-500 dark:text-white" />
            <span className="font-semibold text-blue-600 dark:text-gray-200">
              symptonexus333@gmail.com
            </span>
          </p>
        </section>

        {/* Footer Note */}
        <div className="text-center text-sm text-gray-500 dark:text-gray-400 pt-6 border-t border-gray-300 dark:border-gray-700">
          Last updated: March 2026
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
