import { FaClipboardCheck, FaUserMd, FaHeartbeat, FaCommentMedical, FaLightbulb, FaHandsHelping } from "react-icons/fa";

const Cards = () => {
    return (
        <div className="bg-cyan-50">
    <div className="grid gap-6 md:grid-cols-3 p-8 bg-cyan-50 dark:bg-gray-800">
        
        <div className="bg-gradient-to-r from-zinc-200 to-stone-400 dark:bg-gradient-to-r from-rose-100 to-red-900 shadow-lg rounded-xl p-6 text-center transition-transform duration-300 hover:-translate-y-1 hover:shadow-xl dark:hover:shadow-gray-700">
        <FaClipboardCheck className="text-gray-800 dark:text-blue-950 text-4xl mx-auto mb-4" />
        <h3 className="text-gray-700 dark:text-blue-900 font-semibold text-lg mb-3">
            Symptom Checker
        </h3>
        <p className="text-gray-600 dark:text-blue-800">
            Understand possible conditions based on your symptoms and get next-step guidance.
        </p>
        </div>

        <div className="bg-gradient-to-r from-indigo-200 to-sky-400 dark:bg-gray-800 shadow-lg rounded-xl p-6 text-center transition-transform duration-300 hover:-translate-y-1 hover:shadow-xl dark:hover:shadow-gray-700">
        <FaHeartbeat className="text-blue-800 dark:text-green-950 text-4xl mx-auto mb-4" />
        <h3 className="text-blue-700 dark:text-green-900 font-semibold text-lg mb-3">
            Wellness Tips
        </h3>
        <p className="text-blue-600 dark:text-green-800">
            Learn lifestyle habits and prevention techniques for better well-being.
        </p>
        </div>

        <div className="bg-gradient-to-r from-purple-200 to-violet-400 dark:bg-gray-800 shadow-lg rounded-xl p-6 text-center transition-transform duration-300 hover:-translate-y-1 hover:shadow-xl dark:hover:shadow-gray-700">
        <FaUserMd className="text-purple-800 dark:text-purple-950 text-4xl mx-auto mb-4" />
        <h3 className="text-purple-700 dark:text-purple-900 font-semibold text-lg mb-3">
            Doctor Consultation
        </h3>
        <p className="text-purple-600 dark:text-purple-800">
            Connect with healthcare professionals for personalized medical support.
        </p>
        </div>

    </div>

    <div className="py-14 px-6 bg-cyan-50 dark:bg-gray-800">
        <h2 className="text-2xl font-semibold text-center text-blue-600 dark:text-gray-300 mb-10">
        How SymptoNexus Works
        </h2>

        <div className="grid gap-8 md:grid-cols-3 text-center dark:bg-gray-800 bg-cyan-50">

        <div className="bg-gradient-to-r from-purple-200 to-indigo-300 dark:bg-gray-700 p-6 rounded-xl shadow-md transition-transform duration-300 hover:-translate-y-1 hover:shadow-xl dark:hover:shadow-gray-700">
            <FaCommentMedical className="text-indigo-900 dark:text-blue-9500 text-4xl mx-auto mb-4" />
            <h3 className="text-indigo-800 dark:text-blue-900 text-lg font-bold mb-2">1. Describe Your Symptoms</h3>
            <p className="text-indigo-700 dark:text-blue-800">
            Tell us how you're feeling to get personalized insights.
            </p>
        </div>

        <div className="bg-gradient-to-r from-lime-100 to-teal-300 dark:bg-gray-700 p-6 rounded-xl shadow-md transition-transform duration-300 hover:-translate-y-1 hover:shadow-xl dark:hover:shadow-gray-700">
            <FaLightbulb className="text-green-600 dark:text-green-950 text-4xl mx-auto mb-4" />
            <h3 className="text-teal-800 dark:text-green-900-lg font-bold mb-2">2. Get Advice & Insights</h3>
            <p className="text-teal-700 dark:text-green-800">
            Understand possible causes and recommended next steps.
            </p>
        </div>

        <div className="bg-gradient-to-r from-purple-200 to-cyan-400 dark:bg-gray-700 p-6 rounded-xl shadow-md transition-transform duration-300 hover:-translate-y-1 hover:shadow-xl dark:hover:shadow-gray-700">
            <FaHandsHelping className="text-purple-600 dark:text-purple-950 text-4xl mx-auto mb-4" />
            <h3 className="text-blue-900 dark:text-purple-900-lg font-bold mb-2">3. Connect With Doctors</h3>
            <p className="text-blue-800 dark:text-purple-800">
            If needed, talk to a medical expert directly.
            </p>
        </div>

        </div>
    </div>
    </div>
    );
};

export default Cards;
