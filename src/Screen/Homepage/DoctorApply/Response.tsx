import React from "react";
import { useNavigate } from "react-router-dom";
import background from "../../../assets/Background.jpg";
import dark_background from "../../../assets/dark_background.jpg";
import { useEffect, useState } from "react";

const ApplicationSubmitted: React.FC = () => {
    const navigate = useNavigate();
    const [isDark, setIsDark] = useState(
    document.documentElement.classList.contains("dark")
      );
  
  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains("dark"));
    });
    observer.observe(document.documentElement, { attributes: true });
    return () => observer.disconnect();
  }, []);

  
    
  return (
    
            <div
      className="flex items-center justify-center min-h-screen bg-cover bg-center"
      style={{
        backgroundImage: `url(${isDark? dark_background : background})`,
      }}
    >


   
      <div className="bg-gradient-to-r  from-sky-50 to-sky-300 dark:from-sky-800 dark:to-blue-950 shadow-xl rounded-2xl p-10 max-w-fit w-fit text-center">

        {/* Title */}
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-3">
          Your Application has been submitted
        </h1>

        {/* Subtitle */}
        <p className="text-gray-600 dark:text-gray-300 mb-8">
          Thank you for applying. We’ve received your application and will
          review it shortly. You’ll be notified once there’s an update.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => navigate("/")}
            className="bg-blue-500 dark:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition hover:dark:bg-blue-700 "
          >
            Go to Home
          </button>
        </div>

      </div>
    </div>
    
  );
};

export default ApplicationSubmitted;