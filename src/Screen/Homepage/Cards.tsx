import {
  FaSearchPlus,
  FaUserMd,
  FaHeartbeat,
  FaCommentMedical,
  FaLightbulb,
  FaHandsHelping,
  FaArrowLeft,
  FaArrowRight,
} from "react-icons/fa";
import { LuUser, LuStethoscope } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import {
  forwardRef,
  useRef,
  useImperativeHandle,
  useEffect,
  useState,
} from "react";
import doctorPhone from "../../assets/doc_phone.png";
import Appointments from "../Patient/Appointments";

import {
  getAllDoctorFeedbackApi,
  getAllPatientFeedbackApi,
  type DoctorFeedback,
  type PatientFeedback,
} from "../../services/feedbackApi";

export type CardsRef = {
  scrollToBrowseSpecialty: () => void;
};

const Cards = forwardRef<CardsRef>((_, ref) => {
  const navigate = useNavigate();
  const browseSpecialtyRef = useRef<HTMLDivElement | null>(null);
  const hasFetchedFeedbackRef = useRef(false);

  const [patientFeedbacks, setPatientFeedbacks] = useState<PatientFeedback[]>(
    []
  );
  const [doctorFeedbacks, setDoctorFeedbacks] = useState<DoctorFeedback[]>([]);
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"patient" | "doctor">("patient");
  const [currentIndex, setCurrentIndex] = useState(0);

  const scrollToBrowseSpecialty = () => {
    browseSpecialtyRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  useImperativeHandle(ref, () => ({
    scrollToBrowseSpecialty,
  }));

  useEffect(() => {
    if (hasFetchedFeedbackRef.current) return;

    hasFetchedFeedbackRef.current = true;

    const fetchFeedbacks = async () => {
      try {
        setFeedbackLoading(true);

        const [patientResponse, doctorResponse] = await Promise.all([
          getAllPatientFeedbackApi(),
          getAllDoctorFeedbackApi(),
        ]);

        if (patientResponse.data?.success) {
          setPatientFeedbacks(patientResponse.data.data || []);
        }

        if (doctorResponse.data?.success) {
          setDoctorFeedbacks(doctorResponse.data.data || []);
        }
      } catch (error) {
        console.error("FETCH FEEDBACK ERROR:", error);
      } finally {
        setFeedbackLoading(false);
      }
    };

    fetchFeedbacks();
  }, []);

  useEffect(() => {
    setCurrentIndex(0);
  }, [activeTab]);

  const getStars = (rating?: number | null) => {
    const safeRating = Math.max(0, Math.min(Number(rating || 0), 5));
    return "★".repeat(safeRating) + "☆".repeat(5 - safeRating);
  };

  const latestPatientFeedbacks = patientFeedbacks.slice(0, 3);
  const latestDoctorFeedbacks = doctorFeedbacks.slice(0, 3);

  const visiblePatientFeedbacks = latestPatientFeedbacks
    .map((_, index) => {
      const actualIndex =
        (currentIndex + index) % latestPatientFeedbacks.length;

      return latestPatientFeedbacks[actualIndex];
    })
    .slice(0, Math.min(3, latestPatientFeedbacks.length));

  const visibleDoctorFeedbacks = latestDoctorFeedbacks
    .map((_, index) => {
      const actualIndex =
        (currentIndex + index) % latestDoctorFeedbacks.length;

      return latestDoctorFeedbacks[actualIndex];
    })
    .slice(0, Math.min(3, latestDoctorFeedbacks.length));

  const currentList =
    activeTab === "patient"
      ? latestPatientFeedbacks
      : latestDoctorFeedbacks;

  const nextReview = () => {
    if (currentList.length === 0) return;

    setCurrentIndex((prev) =>
      prev === currentList.length - 1 ? 0 : prev + 1
    );
  };

  const previousReview = () => {
    if (currentList.length === 0) return;

    setCurrentIndex((prev) =>
      prev === 0 ? currentList.length - 1 : prev - 1
    );
  };

  const patientCardThemes = [
    {
      bg: "bg-cyan-50 dark:bg-gray-800",
      accent: "from-cyan-400 to-blue-600",
      avatar: "from-cyan-500 to-blue-600",
      quote: "text-cyan-200",
    },
    {
      bg: "bg-blue-50 dark:bg-gray-800",
      accent: "from-blue-400 to-indigo-600",
      avatar: "from-blue-500 to-indigo-600",
      quote: "text-blue-200",
    },
    {
      bg: "bg-sky-50 dark:bg-gray-800",
      accent: "from-sky-400 to-cyan-600",
      avatar: "from-sky-500 to-cyan-600",
      quote: "text-sky-200",
    },
  ];

  const doctorCardThemes = [
    {
      bg: "bg-emerald-50 dark:bg-gray-800",
      accent: "from-emerald-400 to-green-600",
      avatar: "from-emerald-500 to-green-600",
      quote: "text-emerald-200",
    },
    {
      bg: "bg-teal-50 dark:bg-gray-800",
      accent: "from-teal-400 to-cyan-600",
      avatar: "from-teal-500 to-cyan-600",
      quote: "text-teal-200",
    },
    {
      bg: "bg-lime-50 dark:bg-gray-800",
      accent: "from-lime-400 to-emerald-600",
      avatar: "from-lime-500 to-emerald-600",
      quote: "text-lime-200",
    },
  ];

  return (
    <div className="bg-gradient-to-r from-gray-200 via-slate-50 to-gray-200 dark:bg-gradient-to-r dark:from-gray-950 dark:via-gray-800 dark:to-gray-950">
      <h1 className="text-6xl pt-7 font-bold text-center text-cyan-800 dark:text-gray-100 mb-3">
        Comprehensive Healthcare <br /> Features
      </h1>

      <p className="text-2xl pl-2 text-center text-gray-600 dark:text-gray-100 mb-3">
        Everything you need to understand symptoms, identify possible
        conditions, and connect with the right specialist in one intelligent
        platform
      </p>

      <div className="grid gap-8 md:grid-cols-3 p-8">
        {/* Card 1 */}
        <div
          className="group relative bg-gradient-to-r from-cyan-600 to-teal-200 shadow-lg rounded-xl p-8 h-75 w-full transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 cursor-pointer"
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
            Analyze your symptoms with our AI-powered symptom checker to
            understand possible health conditions and the most relevant type of
            specialist to consult.
          </p>
        </div>

        {/* Card 2 */}
        <div className="relative group rounded-xl cursor-pointer">
          <div className="bg-gradient-to-r from-emerald-200 to-cyan-700 shadow-lg rounded-xl p-8 h-75 w-full transition-transform duration-300 group-hover:-translate-y-1 group-hover:shadow-xl">
            <div className="inline-flex items-center justify-center bg-teal-50 border border-blue-300 dark:bg-cyan-950 dark:border-blue-900 rounded-xl p-4 mb-4 transition-all duration-300 group-hover:scale-110">
              <FaHeartbeat className="text-cyan-950 dark:text-cyan-50 dark:bg-cyan-950 text-4xl" />
            </div>

            <h3 className="text-neutral-950 font-semibold text-3xl mb-3">
              Condition Prediction
            </h3>

            <p className="text-neutral-900 text-[17px]/7">
              Get intelligent predictions of possible diseases or health
              conditions based on your symptoms, helping you understand when
              professional medical attention may be needed.
            </p>
          </div>
        </div>

        {/* Card 3 */}
        <div
          className="relative group rounded-xl cursor-pointer"
          onClick={scrollToBrowseSpecialty}
        >
          <div className="bg-gradient-to-r from-sky-200 to-teal-700 dark:bg-gray-800 shadow-lg rounded-xl p-8 h-75 w-full text-left transition-transform duration-300 group-hover:-translate-y-1 group-hover:shadow-xl">
            <div className="inline-flex items-center justify-center bg-cyan-50 border-blue-300 dark:bg-cyan-950 border dark:border-blue-950 rounded-xl p-4 mb-4 transition-all duration-300 group-hover:scale-110">
              <FaUserMd className="text-emerald-950 dark:text-emerald-50 text-4xl" />
            </div>

            <h3 className="text-neutral-950 font-semibold text-3xl mb-3">
              Doctor Consultation
            </h3>

            <p className="text-neutral-900 text-[17px]/7">
              Get matched with the right doctor based on predicted conditions
              and recommended specialization, so you can seek expert care
              faster.
            </p>
          </div>
        </div>
      </div>

      {/* Advanced Technology Section */}
      <div className="py-16 px-10 bg-gradient-to-r from-gray-200 via-slate-50 to-gray-200 dark:bg-gradient-to-r dark:from-gray-950 dark:via-gray-800 dark:to-gray-950">
        <div className="grid md:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
          <div>
            <img
              src={doctorPhone}
              alt="Healthcare Technology"
              className="rounded-2xl shadow-lg w-full object-cover"
            />
          </div>

          <div>
            <h2 className="text-4xl font-bold text-cyan-900 dark:text-gray-100 mb-6">
              Advanced Technology for Better Healthcare
            </h2>

            <p className="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
              SymptoNexus combines AI-driven symptom analysis with smart
              condition prediction to help users understand possible health
              issues and connect with doctors based on the right specialization.
            </p>

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
                  <FaHandsHelping className="text-cyan-500 dark:text-slate-400 text-2xl" />
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
                  <FaCommentMedical className="text-cyan-500 dark:text-slate-400 text-2xl" />
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
                  <FaSearchPlus className="text-cyan-500 dark:text-slate-400 text-2xl" />
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
      <div className="py-16 px-8 bg-gradient-to-r from-gray-200 via-slate-50 to-gray-200 dark:bg-gradient-to-r dark:from-gray-950 dark:via-gray-800 dark:to-gray-950">
        <div className="max-w-7xl mx-auto bg-cyan-50 dark:bg-gray-800 rounded-3xl p-12">
          <h2 className="text-3xl font-bold text-center text-cyan-950 dark:text-white mb-14">
            How SymptoNexus Works
          </h2>

          <div className="grid md:grid-cols-3 gap-12">
            <div>
              <div className="text-6xl font-bold text-blue-300 mb-4">01</div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                1. Describe Your Symptoms
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Tell us how you're feeling to get personalized insights.
              </p>
            </div>

            <div>
              <div className="text-6xl font-bold text-blue-300 mb-4">02</div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                2. Get Condition Prediction
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                View possible diseases or conditions based on your symptoms and
                understand the recommended specialist category.
              </p>
            </div>

            <div>
              <div className="text-6xl font-bold text-blue-300 mb-4">03</div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                3. Connect With Doctors
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Consult the most relevant doctor based on the predicted
                condition and specialization mapping.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Browse by Specialty */}
      <div
        ref={browseSpecialtyRef}
        className="py-16 px-8 bg-gradient-to-r from-gray-200 via-slate-50 to-gray-200 dark:bg-gradient-to-r dark:from-gray-950 dark:via-gray-800 dark:to-gray-950"
      >
        <h2 className="text-6xl font-bold text-center text-cyan-900 dark:text-gray-100 mb-5">
          Browse by Specialty
        </h2>

        <p className="text-xl pl-2 text-center text-gray-600 dark:text-gray-100 mb-7">
          Find the right specialist for your health needs from our diverse
          network of medical professionals
        </p>

        <div>
          <Appointments />
        </div>
      </div>

      {/* What Our Users Say */}
      <div className="py-16 px-8 bg-gradient-to-r from-gray-200 via-slate-50 to-gray-200 dark:bg-gradient-to-r dark:from-gray-950 dark:via-gray-800 dark:to-gray-950">
        <h2 className="text-6xl font-bold text-center text-cyan-900 dark:text-white mb-3">
            What Our Community Says
        </h2>

        <p className="text-xl text-center text-gray-600 dark:text-gray-300 mb-10">
            Trusted by patients and healthcare professionals across the country.
        </p>

        <div className="flex justify-center mb-12">

            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-2 flex gap-2">

              <button
                onClick={() => setActiveTab("patient")}
                className={`flex items-center gap-2 px-8 py-4 rounded-xl font-semibold transition ${
                  activeTab === "patient"
                    ? "bg-blue-600 dark:bg-cyan-700 text-white shadow"
                    : "text-gray-600 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                <LuUser size={20} />
                <span>Patient Reviews</span>
              </button>

              <button
                onClick={() => setActiveTab("doctor")}
                className={`flex items-center gap-2 px-8 py-4 rounded-xl font-semibold transition ${
                  activeTab === "doctor"
                    ? "bg-emerald-600 dark:bg-green-700 text-white shadow"
                    : "text-gray-600 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                <LuStethoscope size={20} />
                <span>Doctor Reviews</span>
              </button>

            </div>

        </div>

        {feedbackLoading ? (
          <p className="text-center text-gray-600 dark:text-gray-300">
            Loading feedback...
          </p>
        ) : (
          <div className="relative max-w-7xl mx-auto">
            
            <button
              onClick={previousReview}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-20 
                        w-12 h-12 rounded-full bg-white dark:bg-gray-800
                        shadow-lg border border-gray-200 dark:border-gray-700
                        hover:scale-110 transition flex items-center justify-center"
            >
              <FaArrowLeft />
            </button>

            <div className="mx-16 grid grid-cols-1 md:grid-cols-3 gap-6">
              {activeTab === "patient" &&
                visiblePatientFeedbacks.map((feedback, index) => {
                  const theme =
                    patientCardThemes[index % patientCardThemes.length];

                  return (
                    <div
                      key={`patient-${feedback.patient_feedback_id}`}
                      className={`
                        rounded-3xl
                        ${theme.bg}
                        border
                        border-gray-200
                        dark:border-gray-700
                        shadow-md
                        transition-all
                        duration-500
                        overflow-hidden
                        ${
                          index === 1
                            ? `scale-105 shadow-2xl z-10`
                            : "opacity-70 scale-95"
                        }
                      `}
                    >
                      {/* Top Accent */}
                      <div className={`h-1 bg-gradient-to-r ${theme.accent}`}></div>

                      <div className="p-8">
                        {/* Quote Icon */}
                        <div
                          className={`${theme.quote} text-6xl font-bold leading-none`}
                        >
                          ❛❛
                        </div>

                        {/* Rating */}
                        <div className="mt-3 text-yellow-400 text-xl">
                          {getStars(feedback.experience)}
                        </div>

                        {/* Review */}
                        <p className="mt-6 text-gray-600 dark:text-gray-300 leading-9 text-lg">
                          "{feedback.desc || "Great healthcare experience with SymptoNexus."}"
                        </p>

                        {/* Divider */}
                        <div className="border-t border-gray-200 dark:border-gray-700 my-8"></div>

                        {/* User */}
                        <div className="flex items-center gap-4">
                          {/* Avatar */}
                          <div
                            className={`w-14 h-14 rounded-full bg-gradient-to-r ${theme.avatar} text-white flex items-center justify-center font-bold text-lg`}
                          >
                            {feedback.patient_name
                              ?.split(" ")
                              .map((n) => n[0])
                              .join("")
                              .substring(0, 2)
                              .toUpperCase()}
                          </div>

                          <div>
                            <h4 className="font-bold text-xl text-gray-900 dark:text-white">
                              {feedback.patient_name}
                            </h4>

                            <p className="text-gray-500 dark:text-gray-400">
                              Patient
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}

              {activeTab === "doctor" &&
                visibleDoctorFeedbacks.map((feedback, index) => {
                  const theme =
                    doctorCardThemes[index % doctorCardThemes.length];

                  return (
                    <div
                      key={`doctor-${feedback.doctor_feedback_id}`}
                      className={`
                        rounded-3xl
                        ${theme.bg}
                        border
                        border-gray-200
                        dark:border-gray-700
                        shadow-md
                        transition-all
                        duration-500
                        overflow-hidden
                        ${
                          index === 1
                            ? `scale-105 shadow-2xl z-10`
                            : "opacity-70 scale-95"
                        }
                      `}
                    >
                      {/* Top Accent */}
                      <div className={`h-1 bg-gradient-to-r ${theme.accent}`}></div>

                      <div className="p-8">
                        {/* Quote Icon */}
                        <div
                          className={`${theme.quote} text-6xl font-bold leading-none`}
                        >
                          ❛❛
                        </div>

                        {/* Rating */}
                        <div className="mt-3 text-yellow-400 text-xl">
                          {getStars(feedback.experience)}
                        </div>

                        {/* Review */}
                        <p className="mt-6 text-gray-600 dark:text-gray-300 leading-9 text-lg">
                          "{feedback.desc}"
                        </p>

                        {/* Divider */}
                        <div className="border-t border-gray-200 dark:border-gray-700 my-8"></div>

                        {/* Doctor Info */}
                        <div className="flex items-center gap-4">
                          {/* Avatar */}
                          <div
                            className={`w-14 h-14 rounded-full bg-gradient-to-r ${theme.avatar} text-white flex items-center justify-center font-bold text-lg`}
                          >
                            {feedback.doctor_name
                              ?.replace("Dr. ", "")
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .substring(0, 2)
                              .toUpperCase()}
                          </div>

                          <div>
                            <h4 className="font-bold text-xl text-gray-900 dark:text-white">
                              Dr. {feedback.doctor_name}
                            </h4>

                            <p className="text-gray-500 dark:text-gray-400">
                              {feedback.specialization}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>

            <button
              onClick={nextReview}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-20
                        w-12 h-12 rounded-full bg-white dark:bg-gray-800
                        shadow-lg border border-gray-200 dark:border-gray-700
                        hover:scale-110 transition flex items-center justify-center"
            >
              <FaArrowRight />
            </button>

            {latestPatientFeedbacks.length === 0 &&
              latestDoctorFeedbacks.length === 0 && (
                <div className="md:col-span-3 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-8 text-center shadow-md">
                  <p className="text-gray-600 dark:text-gray-300">
                    No feedback available yet.
                  </p>
                </div>
              )}
          </div>
        )}
      </div>
    </div>
  );
});

export default Cards;