import { FaSearchPlus, FaUserMd, FaHeartbeat, FaCommentMedical, FaLightbulb, FaHandsHelping } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import doctorPhone from "../../assets/doc_phone.png";

const Cards = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-gradient-to-r from-gray-200 via-slate-50 to-gray-200 dark:bg-gradient-to-r dark:from-gray-950 dark:via-gray-800 dark:to-gray-950">

      <h1 className="text-6xl pt-7 font-bold text-center text-cyan-800 dark:text-gray-100 mb-3">
        Comprehensive Healthcare <br /> Features
      </h1>

      <p className="text-2xl pl-2 text-center text-gray-600 dark:text-gray-100 mb-3">
        Everything you need for better health management in one intelligent platform
      </p>

      <div className="grid gap-8 md:grid-cols-3 p-8">

        {/* Card 1 */}
        <div
          className="group relative bg-gradient-to-r from-cyan-600 to-teal-200 shadow-lg rounded-xl p-8 h-70 w-full transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 cursor-pointer"
          onClick={() => navigate("/patient/symptom_checker")}
        >
          <div>
            <div className="inline-flex items-center justify-center bg-cyan-50 border-blue-300 dark:bg-cyan-950 dark:border-blue-900 rounded-xl p-4 mb-4 transition-all duration-300 group-hover:scale-110">
              <FaSearchPlus className="text-black dark:text-blue-50 text-4xl" />
            </div>
          </div>

          <h3 className="text-neutral-950 font-semibold text-3xl mb-3">
            Smart Symptom Insights
          </h3>

          <p className="text-neutral-900 text-[17px]/7">
            Understand your symptoms with clear and structured health information using our AI-powered symptom checker.
          </p>
        </div>

        {/* Card 2 */}
        <div className="relative group rounded-xl cursor-pointer">
          <div className="bg-gradient-to-r from-emerald-200 to-cyan-700 shadow-lg rounded-xl p-8 h-70 w-full transition-transform duration-300 group-hover:-translate-y-1 group-hover:shadow-xl">

            <div className="inline-flex items-center justify-center bg-teal-50 border border-blue-300 dark:bg-cyan-950 dark:border-blue-900 rounded-xl p-4 mb-4 transition-all duration-300 group-hover:scale-110">
              <FaHeartbeat className="text-cyan-950 dark:text-cyan-50 dark:bg-cyan-950 text-4xl" />
            </div>

            <h3 className="text-neutral-950 font-semibold text-3xl mb-3">
              Safe Remedies
            </h3>

            <p className="text-neutral-900 text-[17px]/7">
              Discover trusted home remedies and natural health tips that help manage common issues while minimizing the risk of side effects.
            </p>

          </div>
        </div>

        {/* Card 3 */}
        <div className="relative group rounded-xl cursor-pointer">
          <div className="bg-gradient-to-r from-sky-200 to-teal-700 dark:bg-gray-800 shadow-lg rounded-xl p-8 h-70 w-full text-left transition-transform duration-300 group-hover:-translate-y-1 group-hover:shadow-xl">

            <div className="inline-flex items-center justify-center bg-cyan-50 border-blue-300 dark:bg-cyan-950 border dark:border-blue-950 rounded-xl p-4 mb-4 transition-all duration-300 group-hover:scale-110">
              <FaUserMd className="text-emerald-950 dark:text-emerald-50 text-4xl" />
            </div>

            <h3 className="text-neutral-950 font-semibold text-3xl mb-3">
              Doctor Consultation
            </h3>

            <p className="text-neutral-900 text-[17px]/7">
              Connect with doctors when expert advice is needed, bridging basic health guidance with professional medical support.
            </p>

          </div>
        </div>

      </div>

      {/* Advanced Technology Section */}
      <div className="py-16 px-10 bg-gradient-to-r from-gray-200 via-slate-50 to-gray-200 dark:bg-gradient-to-r dark:from-gray-950 dark:via-gray-800 dark:to-gray-950">

        <div className="grid md:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">

          {/* Image */}
          <div>
            <img
              src={doctorPhone}
              alt="Healthcare Technology"
              className="rounded-2xl shadow-lg w-full object-cover"
            />
          </div>

          {/* Content */}
          <div>

            <h2 className="text-4xl font-bold text-cyan-900 dark:text-gray-100 mb-6">
              Advanced Technology for Better Healthcare
            </h2>

            <p className="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
              SymptoNexus combines cutting-edge AI technology with medical expertise
              to provide you with the most accurate health assessments and
              personalized care recommendations.
            </p>

            {/* Feature list */}
            <div className="grid grid-cols-2 gap-6">

              <div className="flex gap-4">
                <div className="bg-blue-100 dark:bg-cyan-900 p-3 rounded-lg h-12">
                  <FaLightbulb className="text-cyan-500 dark:text-slate-400 text-2xl" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    24/7 Availability
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Access healthcare services anytime, anywhere.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="bg-blue-100 dark:bg-cyan-900 p-3 rounded-lg h-12">
                  <FaHandsHelping className="text-cyan-500 dark:text-slate-400  text-2xl" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    Secure & Private
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Your health data is encrypted and protected.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="bg-blue-100 dark:bg-cyan-900 p-3 rounded-lg h-12">
                  <FaCommentMedical className="text-cyan-500 dark:text-slate-400  text-2xl" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    Digital Health Records
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    All your medical records in one place.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="bg-blue-100 dark:bg-cyan-900 p-3 rounded-lg h-12">
                  <FaSearchPlus className="text-cyan-500 dark:text-slate-400  text-2xl" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    Instant Results
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Get quick symptom analysis and recommendations.
                  </p>
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>

      {/* How SymptoNexus Works */}
      <div className="py-14 px-6 bg-gradient-to-r from-sky-200 via-sky-50 to-sky-200 dark:bg-gradient-to-r dark:from-gray-950 dark:via-gray-800 dark:to-gray-950">

        <h2 className="text-2xl font-bold text-center text-blue-600 dark:text-gray-300 mb-10">
          How SymptoNexus Works
        </h2>

        <div className="grid gap-8 md:grid-cols-3 text-center dark:bg-gray-800 bg-gradient-to-r from-sky-200 via-sky-50 to-sky-200">

          {/* Step 1 */}
          <div className="relative group rounded-xl cursor-pointer">
            <div className="bg-gradient-to-r from-purple-200 to-indigo-300 dark:bg-gray-700 p-6 rounded-xl shadow-md transition-transform duration-300 group-hover:-translate-y-1 group-hover:shadow-xl">

              <FaCommentMedical className="text-indigo-900 dark:text-blue-9500 text-4xl mx-auto mb-4" />

              <h3 className="text-indigo-800 dark:text-blue-900 text-lg font-bold mb-2">
                1. Describe Your Symptoms
              </h3>

              <p className="text-indigo-700 dark:text-blue-800">
                Tell us how you're feeling to get personalized insights.
              </p>

            </div>
          </div>

          {/* Step 2 */}
          <div className="relative group rounded-xl cursor-pointer">

            <div className="absolute -inset-[2px] bg-gradient-to-r from-green-500 to-teal-600 rounded-xl blur-md opacity-0 group-hover:opacity-100 transition duration-500"></div>

            <div className="bg-gradient-to-r from-lime-100 to-teal-300 dark:bg-gray-700 p-6 rounded-xl shadow-md transition-transform duration-300 group-hover:-translate-y-1 group-hover:shadow-xl">

              <FaLightbulb className="text-green-600 dark:text-green-950 text-4xl mx-auto mb-4" />

              <h3 className="text-teal-800 dark:text-green-900-lg font-bold mb-2">
                2. Get Advice & Insights
              </h3>

              <p className="text-teal-700 dark:text-green-800">
                Understand possible causes and recommended next steps.
              </p>

            </div>
          </div>

          {/* Step 3 */}
          <div className="relative group rounded-xl cursor-pointer">

            <div className="absolute -inset-[2px] bg-gradient-to-r from-purple-500 to-cyan-500 rounded-xl blur-md opacity-0 group-hover:opacity-100 transition duration-500"></div>

            <div className="bg-gradient-to-r from-purple-200 to-cyan-400 dark:bg-gray-700 p-6 rounded-xl shadow-md transition-transform duration-300 group-hover:-translate-y-1 group-hover:shadow-xl">

              <FaHandsHelping className="text-purple-600 dark:text-purple-950 text-4xl mx-auto mb-4" />

              <h3 className="text-blue-900 dark:text-purple-900-lg font-bold mb-2">
                3. Connect With Doctors
              </h3>

              <p className="text-blue-800 dark:text-purple-800">
                If needed, talk to a medical expert directly.
              </p>

            </div>
          </div>

        </div>
      </div>

    </div>
  );
};

export default Cards;