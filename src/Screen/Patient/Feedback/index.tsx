import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../../../../store/store";
import { fetchAppointmentsThunk } from "../../../../store/slices/appointmentSlice";
import type { Appointment } from "../../../services/appointmentApi";

const overallRatings = [
  { value: 1, label: "Poor", emoji: "😟" },
  { value: 2, label: "Fair", emoji: "🙁" },
  { value: 3, label: "Good", emoji: "😐" },
  { value: 4, label: "Very Good", emoji: "🙂" },
  { value: 5, label: "Excellent", emoji: "😄" },
];

const ratingColumns = [
  { value: 1, label: "Poor" },
  { value: 2, label: "Fair" },
  { value: 3, label: "Good" },
  { value: 4, label: "Very Good" },
  { value: 5, label: "Excellent" },
];

const platformRatingAreas = [
  "AI Symptom Checker Accuracy",
  "Website Design & UI",
];

const consultationRatingAreas = [
  "Ease of Booking",
  "Doctor Communication",
  "Doctor Professionalism",
  "Waiting Time",
  "Quality of Consultation",
  "Staff Behaviour",
];

const Feedback: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { appointments } = useSelector(
    (state: RootState) => state.appointment
  );

  const user = useSelector((state: RootState) => state.auth.user);

  const patientId = (user as { patient_id?: number } | null)?.patient_id;

  const [overallRating, setOverallRating] = useState<number>(0);
  const [areaRatings, setAreaRatings] = useState<Record<string, number>>({});
  const [recommend, setRecommend] = useState("yes");
  const [submitted, setSubmitted] = useState(false);
  const [consultedDoctor, setConsultedDoctor] = useState(false);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState("");

  const [formData, setFormData] = useState({
    patientName: "",
    mobileNumber: "",
    patientId: "",
    visitDate: "",
    department: "",
    doctorName: "",
    visitType: "",
    websiteExperience: "",
    whatWentWell: "",
    improvements: "",
  });

  useEffect(() => {
    if (patientId) {
      dispatch(fetchAppointmentsThunk({ patient_id: patientId }));
    } else {
      dispatch(fetchAppointmentsThunk());
    }
  }, [dispatch, patientId]);

  const appointmentList = useMemo(() => {
    return Array.isArray(appointments) ? appointments : [];
  }, [appointments]);

  const normalizeStatus = useCallback((status?: string | number | null) => {
    return String(status || "")
      .toLowerCase()
      .replace(/_/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }, []);

  const feedbackAppointments = useMemo(() => {
    return appointmentList.filter((appointment) => {
      const status = normalizeStatus(appointment.booking_status);

      return (
        status === "slot assigned" ||
        status === "consultation completed" ||
        status === "prescription generated"
      );
    });
  }, [appointmentList, normalizeStatus]);

  const selectedAppointment = useMemo(() => {
    return feedbackAppointments.find(
      (appointment) =>
        String(appointment.appointment_id) === String(selectedAppointmentId)
    );
  }, [feedbackAppointments, selectedAppointmentId]);

  const getAppointmentTime = (appointment: Appointment) => {
    if (
      appointment.slot_details?.start_time &&
      appointment.slot_details?.end_time
    ) {
      return `${appointment.slot_details.start_time} - ${appointment.slot_details.end_time}`;
    }

    return (
      appointment.appointment_time ||
      appointment.booking_time ||
      appointment.start_time ||
      "-"
    );
  };

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAreaRating = (area: string, rating: number) => {
    setAreaRatings((prev) => ({
      ...prev,
      [area]: rating,
    }));
  };

  const handleSubmit = () => {
    const payload = {
      ...formData,
      overallRating,
      areaRatings,
      recommend,
      consultedDoctor,
      appointment_id: selectedAppointment?.appointment_id || null,
      doctor_id: selectedAppointment?.doctor_id || null,
      doctorName: selectedAppointment?.doctor_name || "",
      appointmentDate: selectedAppointment?.appointment_date || "",
      appointmentTime: selectedAppointment
        ? getAppointmentTime(selectedAppointment)
        : "",
      bookingStatus: selectedAppointment?.booking_status || "",
    };

    console.log("Feedback Payload:", payload);
    setSubmitted(true);
  };

  const handleClear = () => {
    setOverallRating(0);
    setAreaRatings({});
    setRecommend("yes");
    setSubmitted(false);
    setConsultedDoctor(false);
    setSelectedAppointmentId("");

    setFormData({
      patientName: "",
      mobileNumber: "",
      patientId: "",
      visitDate: "",
      department: "",
      doctorName: "",
      visitType: "",
      websiteExperience: "",
      whatWentWell: "",
      improvements: "",
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="mx-auto max-w-7xl bg-white shadow-xl rounded-sm border border-gray-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-700 to-cyan-600 text-white px-6 py-4 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3">
              <button className="text-2xl">←</button>
              <h1 className="text-2xl font-bold">Patient Feedback</h1>
            </div>

            <p className="text-sm mt-1 ml-10">
              Your feedback helps us improve our services and patient
              experience.
            </p>
          </div>

          <div className="hidden md:flex items-center gap-2 text-4xl">
            📋 ❤️
          </div>
        </div>

        <div className="p-5 space-y-4">
          {/* Overall Experience */}
          <section className="border border-gray-200 rounded-lg p-4 bg-white">
            <h2 className="text-teal-700 font-bold mb-5">
              How was your overall experience?
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-5">
              {overallRatings.map((item) => (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => setOverallRating(item.value)}
                  className={`rounded-lg p-4 text-center transition border ${
                    overallRating === item.value
                      ? "border-teal-500 bg-teal-50"
                      : "border-transparent hover:bg-gray-50"
                  }`}
                >
                  <div className="text-4xl mb-2">{item.emoji}</div>

                  <div className="text-yellow-400 text-lg">
                    {"★".repeat(item.value)}
                  </div>

                  <div className="font-semibold">{item.value}</div>

                  <div className="text-sm text-gray-600">{item.label}</div>
                </button>
              ))}
            </div>
          </section>

          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 items-start">
            <div className="lg:col-span-3 space-y-4">
              {/* Platform Rating Table */}
              <section className="border border-gray-200 rounded-lg bg-white overflow-hidden">
                <div className="p-4">
                  <h2 className="text-teal-700 font-bold">
                    3. Please rate the following areas
                  </h2>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm border-t border-gray-200">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="text-left p-3 border border-gray-200 min-w-[220px]">
                          Feedback Area
                        </th>

                        {ratingColumns.map((col) => (
                          <th
                            key={col.value}
                            className="p-3 border border-gray-200 text-center min-w-[110px]"
                          >
                            <div>{col.label}</div>

                            <div className="text-yellow-400">
                              {"★".repeat(col.value)}
                            </div>

                            <div className="text-xs text-gray-500">
                              {col.value}
                            </div>
                          </th>
                        ))}
                      </tr>
                    </thead>

                    <tbody>
                      {platformRatingAreas.map((area) => (
                        <tr key={area}>
                          <td className="p-3 border border-gray-200 font-medium">
                            {area}
                          </td>

                          {ratingColumns.map((col) => (
                            <td
                              key={col.value}
                              className="p-3 border border-gray-200 text-center"
                            >
                              <input
                                type="radio"
                                name={area}
                                checked={areaRatings[area] === col.value}
                                onChange={() =>
                                  handleAreaRating(area, col.value)
                                }
                              />
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              {/* Doctor Consultation */}
              <section className="border border-gray-200 rounded-lg p-4 bg-white">
                <h2 className="text-teal-700 font-bold mb-4">
                  Doctor Consultation
                </h2>

                <p className="mb-3 font-medium">
                  Did you consult with our doctor?
                </p>

                <div className="flex gap-6 mb-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="consultedDoctor"
                      checked={consultedDoctor}
                      onChange={() => setConsultedDoctor(true)}
                    />
                    Yes
                  </label>

                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="consultedDoctor"
                      checked={!consultedDoctor}
                      onChange={() => {
                        setConsultedDoctor(false);
                        setSelectedAppointmentId("");
                      }}
                    />
                    No
                  </label>
                </div>

                {consultedDoctor && (
                  <div className="mb-4 rounded-lg border border-teal-100 bg-teal-50 p-4">
                    <label className="block text-sm font-semibold mb-2 text-gray-700">
                      Select Appointment for Feedback
                    </label>

                    <select
                      value={selectedAppointmentId}
                      onChange={(e) =>
                        setSelectedAppointmentId(e.target.value)
                      }
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-teal-400"
                    >
                      <option value="">Select appointment</option>

                      {feedbackAppointments.map((appointment) => (
                        <option
                          key={appointment.appointment_id}
                          value={appointment.appointment_id}
                        >
                          {appointment.doctor_name || "Doctor"} |{" "}
                          {appointment.specialization || "General"} |{" "}
                          {appointment.appointment_date || "-"} |{" "}
                          {getAppointmentTime(appointment)}
                        </option>
                      ))}
                    </select>

                    {feedbackAppointments.length === 0 && (
                      <p className="mt-2 text-xs text-red-500">
                        No eligible appointment found for doctor feedback.
                      </p>
                    )}
                  </div>
                )}

                {consultedDoctor && selectedAppointment && (
                  <>
                    <div className="mb-4 rounded-lg border border-gray-200 bg-white p-4">
                      <h3 className="font-bold text-gray-800 mb-3">
                        Selected Appointment Details
                      </h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                        <p>
                          <span className="font-semibold">Doctor:</span>{" "}
                          {selectedAppointment.doctor_name || "-"}
                        </p>

                        <p>
                          <span className="font-semibold">
                            Specialization:
                          </span>{" "}
                          {selectedAppointment.specialization || "-"}
                        </p>

                        <p>
                          <span className="font-semibold">
                            Appointment Date:
                          </span>{" "}
                          {selectedAppointment.appointment_date || "-"}
                        </p>

                        <p>
                          <span className="font-semibold">Time:</span>{" "}
                          {getAppointmentTime(selectedAppointment)}
                        </p>

                        <p>
                          <span className="font-semibold">Status:</span>{" "}
                          {selectedAppointment.booking_status || "-"}
                        </p>

                        <p>
                          <span className="font-semibold">
                            Appointment No:
                          </span>{" "}
                          {selectedAppointment.appointment_no || "-"}
                        </p>
                      </div>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-sm border border-gray-200">
                        <thead>
                          <tr className="bg-gray-50">
                            <th className="text-left p-3 border border-gray-200 min-w-[220px]">
                              Consultation Area
                            </th>

                            {ratingColumns.map((col) => (
                              <th
                                key={col.value}
                                className="p-3 border border-gray-200 text-center min-w-[110px]"
                              >
                                <div>{col.label}</div>

                                <div className="text-yellow-400">
                                  {"★".repeat(col.value)}
                                </div>

                                <div className="text-xs text-gray-500">
                                  {col.value}
                                </div>
                              </th>
                            ))}
                          </tr>
                        </thead>

                        <tbody>
                          {consultationRatingAreas.map((area) => (
                            <tr key={area}>
                              <td className="p-3 border border-gray-200 font-medium">
                                {area}
                              </td>

                              {ratingColumns.map((col) => (
                                <td
                                  key={col.value}
                                  className="p-3 border border-gray-200 text-center"
                                >
                                  <input
                                    type="radio"
                                    name={area}
                                    checked={areaRatings[area] === col.value}
                                    onChange={() =>
                                      handleAreaRating(area, col.value)
                                    }
                                  />
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </>
                )}
              </section>

              {/* Additional Feedback + Comment */}
              <div className="border border-gray-200 rounded-lg p-4 bg-white">
                    <h2 className="text-teal-700 font-bold mb-4">
                    5. Tell us more about your experience
                  </h2>

                  <textarea
                    className="w-full h-24 border border-gray-300 rounded-md p-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
                    placeholder="Please share your suggestions, complaints, or appreciation here..."
                    value={formData.websiteExperience}
                    onChange={(e) =>
                      handleInputChange("websiteExperience", e.target.value)
                    }
                  />

                  <div className="mt-5 border-t border-gray-200 pt-4 text-center">
                    <p className="font-medium mb-2">
                      Would you recommend SymptoNexus?
                    </p>

                    <div className="flex gap-6">
                      <label className="flex items-center gap-2 text-sm">
                        <input
                          type="radio"
                          name="recommend"
                          checked={recommend === "yes"}
                          onChange={() => setRecommend("yes")}
                        />
                        Yes
                      </label>

                      <label className="flex items-center gap-2 text-sm">
                        <input
                          type="radio"
                          name="recommend"
                          checked={recommend === "no"}
                          onChange={() => setRecommend("no")}
                        />
                        No
                      </label>
                    </div>
                  </div>
              </div>
            </div>

            {/* Right Side Cards */}
            <aside className="space-y-4">
              <div className="border border-green-100 bg-green-50 rounded-lg p-5 text-center min-h-[205px] flex flex-col justify-center">
                <div className="text-5xl mb-3">✅</div>

                <h3 className="text-green-700 font-bold text-lg">
                  Thank You!
                </h3>

                <p className="text-sm text-gray-600 mt-2 leading-6">
                  Your feedback is very important to us. We use your feedback to
                  improve our services.
                </p>

                <div className="text-5xl mt-5">📋🙂</div>
              </div>

              <div className="border border-gray-200 rounded-lg p-5 bg-white min-h-[190px]">
                <h3 className="text-teal-700 font-bold mb-4">
                  Feedback Summary
                </h3>

                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between rounded-md bg-gray-50 px-3 py-2">
                    <span className="text-gray-600">Overall Rating</span>
                    <span className="font-semibold text-gray-800">
                      {overallRating ? `${overallRating}/5` : "Not selected"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between rounded-md bg-gray-50 px-3 py-2">
                    <span className="text-gray-600">Doctor Consulted</span>
                    <span className="font-semibold text-gray-800">
                      {consultedDoctor ? "Yes" : "No"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between rounded-md bg-gray-50 px-3 py-2">
                    <span className="text-gray-600">Appointment</span>
                    <span className="font-semibold text-gray-800">
                      {selectedAppointment ? "Selected" : "Not selected"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between rounded-md bg-gray-50 px-3 py-2">
                    <span className="text-gray-600">Recommend</span>
                    <span className="font-semibold text-gray-800 capitalize">
                      {recommend}
                    </span>
                  </div>
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg p-5 bg-white min-h-[262px]">
                <h3 className="text-teal-700 font-bold mb-4">
                  Why Give Feedback?
                </h3>

                <ul className="space-y-4 text-sm text-gray-600">
                  <li className="flex gap-3">
                    <span>🛡️</span>
                    <span>Help us improve our services</span>
                  </li>

                  <li className="flex gap-3">
                    <span>👥</span>
                    <span>Better patient experience</span>
                  </li>

                  <li className="flex gap-3">
                    <span>⚡</span>
                    <span>Quick resolution of issues</span>
                  </li>

                  <li className="flex gap-3">
                    <span>♡</span>
                    <span>We value your opinion</span>
                  </li>
                </ul>
              </div>
            </aside>
          </div>

          {/* Buttons */}
          <div className="flex justify-center gap-5 pt-2">
            <button
              type="button"
              onClick={handleSubmit}
              className="bg-green-600 hover:bg-green-700 text-white px-10 py-3 rounded-md font-semibold transition"
            >
              Submit Feedback
            </button>

            <button
              type="button"
              onClick={handleClear}
              className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-10 py-3 rounded-md font-semibold transition"
            >
              Clear Form
            </button>
          </div>

          {/* Success Footer */}
          {submitted && (
            <div className="border border-green-200 bg-green-50 rounded-lg p-4 grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
              <div className="md:col-span-2 flex items-center gap-4">
                <div className="w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center text-2xl">
                  ✓
                </div>

                <div>
                  <h3 className="font-bold text-green-700">
                    Thank you for your feedback!
                  </h3>

                  <p className="text-sm text-gray-600">
                    Your feedback has been recorded successfully. Our team will
                    review it and contact you if required.
                  </p>
                </div>
              </div>

              <div>
                <p className="text-xs text-gray-500">
                  Feedback Reference No.
                </p>

                <p className="font-semibold">SN-FBK-</p>
              </div>

              <div>
                <p className="text-xs text-gray-500">Status</p>

                <span className="inline-block bg-green-200 text-green-700 px-3 py-1 rounded-md text-sm font-semibold">
                  Submitted
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};



export default Feedback;