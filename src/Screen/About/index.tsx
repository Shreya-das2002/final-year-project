import React from "react";
import { teamMembers } from "../../Environment";


const About: React.FC = () => {
  return (
    <div className="w-full flex flex-col items-center px-6 py-10 bg-gray-100 dark:bg-gray-900">
      
      {/* About Section */}
      <div className="w-full max-w-4xl bg-gray-200 dark:bg-gray-800 text-center p-8 rounded-xl shadow-md">
        <h1 className="text-3xl font-bold mb-3 text-gray-900 dark:text-white">
          About Us
        </h1>
        <p className="text-gray-700 dark:text-gray-300">
          Some text about who we are and what we do.
        </p>
        <p className="text-gray-700 dark:text-gray-300 mt-2">
          Resize the browser window to see that this page is responsive by the way.
        </p>
      </div>

      {/* Team Section */}
      <h2 className="text-2xl font-semibold mt-10 mb-6 text-gray-900 dark:text-white">
        Our Team
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 w-full max-w-6xl">
        {teamMembers.map((member) => (
          <div
            key={member.name}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden"
          >
            <img src={member.img} alt={member.name} className="w-full h-60 object-cover" />

            <div className="p-4 text-center">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">{member.name}</h3>
              <p className="text-gray-600 dark:text-gray-400">{member.role}</p>
              <p className="text-gray-700 dark:text-gray-300 mt-2">{member.desc}</p>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default About;
