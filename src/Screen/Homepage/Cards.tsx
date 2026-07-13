import {
  FaSearchPlus,
  FaUserMd,
  FaHeartbeat,
  FaCommentMedical,
  FaLightbulb,
  FaHandsHelping,
} from "react-icons/fa";
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

  const getStars = (rating?: number | null) => {
    const safeRating = Math.max(0, Math.min(Number(rating || 0), 5));
    return "★".repeat(safeRating) + "☆".repeat(5 - safeRating);
  };

  const latestPatientFeedbacks = patientFeedbacks.slice(0, 3);
  const latestDoctorFeedbacks = doctorFeedbacks.slice(0, 3);

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
            Analyze your symptoms with our AI-powered symptom checker to
            understand possible health conditions and the most relevant type of
            specialist to consult.
          </p>
        </div>

        {/* Card 2 */}
        <div className="relative group rounded-xl cursor-pointer">
          <div className="bg-gradient-to-r from-emerald-200 to-cyan-700 shadow-lg rounded-xl p-8 h-70 w-full transition-transform duration-300 group-hover:-translate-y-1 group-hover:shadow-xl">
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
          <div className="bg-gradient-to-r from-sky-200 to-teal-700 dark:bg-gray-800 shadow-lg rounded-xl p-8 h-70 w-full text-left transition-transform duration-300 group-hover:-translate-y-1 group-hover:shadow-xl">
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
        <h2 className="text-6xl font-bold text-center text-cyan-900 dark:text-gray-100 mb-3">
          What Our Users Say
        </h2>

        <p className="text-xl pl-2 text-center text-gray-600 dark:text-gray-100 mb-10">
          Join thousands of satisfied users who trust SymptoNexus for their
          healthcare needs
        </p>

        {feedbackLoading ? (
          <p className="text-center text-gray-600 dark:text-gray-300">
            Loading feedback...
          </p>
        ) : (
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
            {latestPatientFeedbacks.map((feedback) => (
              <div
                key={`patient-${feedback.patient_feedback_id}`}
                className="rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-6 shadow-md"
              >
                <div className="mb-3 text-yellow-400 text-xl">
                  {getStars(feedback.experience)}
                </div>

                <p className="text-gray-600 dark:text-gray-300 leading-7">
                  {feedback.desc ||
                    "Great healthcare experience with SymptoNexus."}
                </p>

                <div className="mt-5 border-t border-gray-200 dark:border-gray-700 pt-4">
                  <p className="font-bold text-cyan-900 dark:text-white">
                    Patient Feedback
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Recommendation: {feedback.recommendation ? "Yes" : "No"}
                  </p>
                </div>
              </div>
            ))}

            {latestDoctorFeedbacks.map((feedback) => (
              <div
                key={`doctor-${feedback.doctor_feedback_id}`}
                className="rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-6 shadow-md"
              >
                <div className="mb-3 text-yellow-400 text-xl">
                  {getStars(feedback.experience)}
                </div>

                <p className="text-gray-600 dark:text-gray-300 leading-7">
                  {feedback.desc ||
                    "Smooth platform experience for doctor workflow."}
                </p>

                <div className="mt-5 border-t border-gray-200 dark:border-gray-700 pt-4">
                  <p className="font-bold text-cyan-900 dark:text-white">
                    Doctor Feedback
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Recommendation: {feedback.recommendation ? "Yes" : "No"}
                  </p>
                </div>
              </div>
            ))}

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