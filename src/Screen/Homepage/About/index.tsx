import React from "react";
import { teamMembers } from "../../../Environment";
import { FaUsers } from "react-icons/fa";

const About: React.FC = () => {
  return (
    <div className="w-full flex flex-col items-center px-6 py-10 bg-cyan-50 dark:bg-gray-900">
      
      {/* About Section */}
      <div className="w-full max-w-4xl bg-blue-100 dark:bg-gray-800 text-center p-8 rounded-xl shadow-md">
        <h1 className="text-3xl font-bold mb-3 text-blue-500 dark:text-white">
          About Us
        </h1>
        <p className="text-blue-700 dark:text-gray-300 text-justify">
          SymptoNexus is a healthcare support platform developed to assist users in understanding their symptoms, exploring safe home remedies, and connecting with healthcare professionals. The platform aims to reduce uncertainty in health-related situations and improve accessibility to medical guidance. By combining intuitive design with ethical and user-friendly technology, SymptoNexus provides a reliable and approachable digital healthcare support system.

        </p>
        <p className="text-blue-700 dark:text-gray-200 mt-2">
          We focus on guidance and comfort, not replacing professional medical advice.
        </p>
      </div>

      {/* Team Section */}
      <h2 className="text-2xl font-semibold mt-10 mb-6 text-blue-600 dark:text-white text-center flex items-center gap-2">
        <FaUsers/> Our Team
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 w-full max-w-6xl">
        {teamMembers.map((member) => (
          <div
            key={member.name}
            className="bg-teal-50 dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden"
          >
            <img src={member.img} alt={member.name} className="w-full h-60 object-cover" />

            <div className="p-4 text-center">
              <h3 className="text-xl font-bold text-blue-600 dark:text-white">{member.name}</h3>
              <p className="text-sky-500 dark:text-gray-400">{member.role}</p>
              <p className="text-blue-500 dark:text-gray-300 mt-2 text-justify">{member.desc}</p>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default About;
