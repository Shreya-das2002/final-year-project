import React from "react";
import { useNavigate } from "react-router-dom";

const ApplicationSubmitted: React.FC = () => {
    const navigate = useNavigate();
    
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white shadow-xl rounded-2xl p-10 max-w-md w-full text-center">

        {/* Title */}
        <h1 className="text-2xl font-bold text-gray-800 mb-3">
          Your Application has been submitted
        </h1>

        {/* Subtitle */}
        <p className="text-gray-600 mb-8">
          Thank you for applying. We’ve received your application and will
          review it shortly. You’ll be notified once there’s an update.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => navigate("/")}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition"
          >
            Go to Home
          </button>
        </div>

      </div>
    </div>
  );
};

export default ApplicationSubmitted;