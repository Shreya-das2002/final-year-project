import React, { useState } from "react";
import { FaEnvelope, FaPhoneAlt, FaMapMarkerAlt } from "react-icons/fa";
import  { teamMembers } from "../../../Environment";

const Contact: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setName("");
    setEmail("");
    setMessage("");
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 px-4 py-10">
      {/* ================= HEADER ================= */}
      <div className="max-w-4xl mx-auto text-center mb-10">
        <h1 className="text-4xl font-bold text-blue-600 dark:text-white mb-3">
          Contact Us
        </h1>
        <p className="text-gray-600 dark:text-gray-200">
          We’re here to help. Reach out to us with any questions or concerns.
        </p>
      </div>

      {/* ================= CONTACT INFO ================= */}
      <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow text-center">
          <FaEnvelope className="text-blue-500 dark:text-gray-300 text-3xl mx-auto mb-3" />
          <h3 className="text-gray-600 dark:text-gray-100 font-semibold text-lg mb-1">Email</h3>
          <p className="text-gray-600 dark:text-gray-200">
            support@symptonexus.com
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow text-center">
          <FaPhoneAlt className="text-blue-500 dark:text-gray-300 text-3xl mx-auto mb-3" />
          <h3 className="text-gray-600 dark:text-gray-100 font-semibold text-lg mb-1">Phone</h3>
          <p className="text-gray-600 dark:text-gray-200">
            +91 98765 43210
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow text-center">
          <FaMapMarkerAlt className="text-blue-500 dark:text-gray-300 text-3xl mx-auto mb-3" />
          <h3 className="text-gray-600 dark:text-gray-100 font-semibold text-lg mb-1">Location</h3>
          <p className="text-gray-600 dark:text-gray-200">
            India
          </p>
        </div>
      </div>

      {/* ================= OUR TEAM ================= */}
<div className="max-w-4xl mx-auto mb-12">
  <h2 className="text-3xl font-bold text-center text-blue-600 dark:text-white mb-6">
    Our Team
  </h2>

  <div className="grid md:grid-cols-4 gap-6">
    {teamMembers.map((member) => (
      <div
        key={member.name}
        className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow text-center"
      >
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-50">
          {member.name}
        </h3>

        <p className="text-sm text-blue-500 dark:text-gray-100 mb-3">
          {member.role}
        </p>

        <p className="text-gray-600 dark:text-gray-200 text-center flex items-center gap-2">
          <FaPhoneAlt/> {member.num}
        </p>

        <p className="text-gray-600 dark:text-gray-300 text-xs text-center flex items-center gap-2">
        <FaEnvelope className="flex-shrink-0" />
  <span className="truncate">{member.email}</span>
        </p>
      </div>
    ))}
  </div>
</div>
      {/* ================= CONTACT FORM ================= */}
      <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-semibold text-blue-500 dark:text-white mb-6 text-center">
          Send Us a Message
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 text-gray-700 dark:text-gray-200">
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-2 rounded-md border dark:text-gray-200 dark:border-gray-700 bg-transparent focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Your name"
            />
          </div>

          <div>
            <label className="block mb-1 text-gray-700 dark:text-gray-300">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 rounded-md border dark:text-gray-200 dark:border-gray-700 bg-transparent focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Your email"
            />
          </div>

          <div>
            <label className="block mb-1 text-gray-700 dark:text-gray-300">
              Message
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              rows={4}
              className="w-full px-4 py-2 rounded-md border dark:text-gray-200 dark:border-gray-700 bg-transparent focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Write your message..."
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-400 to-blue-600 dark:from-gray-400 dark:to-gray-600 text-white py-2 rounded-md font-semibold hover:from-blue-500 hover:to-blue-700 dark:hover:from-gray-500 dark:hover:to-gray-700 transition"
          >
            Send Message
          </button>
        </form>
      </div>

      {/* ================= FOOTER NOTE ================= */}
      <p className="text-center text-gray-500 dark:text-gray-400 mt-8 text-sm">
        We usually respond within 24 hours.
      </p>
    </div>
  );
};

export default Contact;
