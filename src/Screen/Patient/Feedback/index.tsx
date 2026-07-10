import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import type { RootState, AppDispatch } from "../../../../store/store";
import { fetchAppointmentsThunk } from "../../../../store/slices/appointmentSlice";
import type { Appointment } from "../../../services/appointmentApi";

import {
  createPatientFeedbackApi,
  type CreatePatientFeedbackPayload,
} from "../../../services/feedbackApi";

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

interface RatingTableProps {
  title?: string;
  areaHeader: string;
  areas: string[];
  ratings: Record<string, number>;
  onRate: (area: string, rating: number) => void;
}

const RatingTable: React.FC<RatingTableProps> = ({
  title,
  areaHeader,
  areas,
  ratings,
  onRate,
}) => {
  return (
    <section className="overflow-hidden rounded-lg border border-gray-200 bg-white">
      {title && (
        <div className="p-4">
          <h2 className="font-bold text-teal-700">{title}</h2>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full border-t border-gray-200 text-sm">
          <thead>
            <tr className="bg-gray-50">
              <th className="min-w-[220px] border border-gray-200 p-3 text-left">
                {areaHeader}
              </th>

              {ratingColumns.map((column) => (
                <th
                  key={column.value}
                  className="min-w-[110px] border border-gray-200 p-3 text-center"
                >
                  <div>{column.label}</div>

                  <div className="text-yellow-400">
                    {"★".repeat(column.value)}
                  </div>

                  <div className="text-xs text-gray-500">
                    {column.value}
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {areas.map((area) => (
              <tr key={area}>
                <td className="border border-gray-200 p-3 font-medium">
                  {area}
                </td>

                {ratingColumns.map((column) => (
                  <td
                    key={column.value}
                    className="border border-gray-200 p-3 text-center"
                  >
                    <input
                      type="radio"
                      name={area}
                      checked={ratings[area] === column.value}
                      onChange={() => onRate(area, column.value)}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

const Feedback: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { appointments } = useSelector(
    (state: RootState) => state.appointment,
  );

  const user = useSelector(
    (state: RootState) => state.auth.user,
  );

  /*
   * Supports both patient_id and ref_id depending on
   * the authenticated user object returned by your backend.
   */
  const patientId =
    (
      user as {
        patient_id?: number;
        ref_id?: number;
      } | null
    )?.patient_id ??
    (
      user as {
        patient_id?: number;
        ref_id?: number;
      } | null
    )?.ref_id;

  const [overallRating, setOverallRating] =
    useState<number>(0);

  const [areaRatings, setAreaRatings] =
    useState<Record<string, number>>({});

  const [recommend, setRecommend] =
    useState<"yes" | "no">("yes");

  const [consultedDoctor, setConsultedDoctor] =
    useState(false);

  const [
    selectedAppointmentId,
    setSelectedAppointmentId,
  ] = useState("");

  const [description, setDescription] = useState("");

  const [submitting, setSubmitting] = useState(false);

  const [submitted, setSubmitted] = useState(false);

  const [submitError, setSubmitError] = useState("");

  const [
    feedbackReference,
    setFeedbackReference,
  ] = useState("");

  /*
   * Load appointments for the logged-in patient.
   */
  useEffect(() => {
    if (patientId) {
      dispatch(
        fetchAppointmentsThunk({
          patient_id: patientId,
        }),
      );
    } else {
      dispatch(fetchAppointmentsThunk());
    }
  }, [dispatch, patientId]);

  const appointmentList = useMemo(() => {
    return Array.isArray(appointments)
      ? appointments
      : [];
  }, [appointments]);

  const normalizeStatus = useCallback(
    (status?: string | number | null) => {
      return String(status || "")
        .toLowerCase()
        .replace(/_/g, " ")
        .replace(/\s+/g, " ")
        .trim();
    },
    [],
  );

  /*
   * Only these appointments can be selected
   * for consultation feedback.
   */
  const feedbackAppointments = useMemo(() => {
    return appointmentList.filter((appointment) => {
      const status = normalizeStatus(
        appointment.booking_status,
      );

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
        String(appointment.appointment_id) ===
        String(selectedAppointmentId),
    );
  }, [
    feedbackAppointments,
    selectedAppointmentId,
  ]);

  const getAppointmentTime = (
    appointment: Appointment,
  ) => {
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

  const handleAreaRating = (
    area: string,
    rating: number,
  ) => {
    setAreaRatings((previous) => ({
      ...previous,
      [area]: rating,
    }));

    setSubmitError("");
  };

  /*
   * When consultation is changed to No:
   *
   * 1. Remove selected appointment.
   * 2. Remove consultation-specific ratings.
   * 3. Send appointment and consultation ratings as null.
   */
  const handleConsultationChange = (
    value: boolean,
  ) => {
    setConsultedDoctor(value);
    setSubmitError("");

    if (!value) {
      setSelectedAppointmentId("");

      setAreaRatings((previous) => {
        const updatedRatings = {
          ...previous,
        };

        consultationRatingAreas.forEach((area) => {
          delete updatedRatings[area];
        });

        return updatedRatings;
      });
    }
  };

  const handleSubmit = async () => {
    try {
      setSubmitError("");
      setSubmitted(false);
      setFeedbackReference("");

      /* ================= PATIENT VALIDATION ================= */

      if (!patientId) {
        setSubmitError(
          "Patient information was not found. Please log in again.",
        );

        return;
      }

      /* ================= OVERALL RATING ================= */

      if (!overallRating) {
        setSubmitError(
          "Please select your overall experience rating.",
        );

        return;
      }

      /* ================= PLATFORM RATINGS ================= */

      const aiAccuracy =
        areaRatings[
          "AI Symptom Checker Accuracy"
        ];

      const websiteRating =
        areaRatings["Website Design & UI"];

      if (!aiAccuracy) {
        setSubmitError(
          "Please rate AI Symptom Checker Accuracy.",
        );

        return;
      }

      if (!websiteRating) {
        setSubmitError(
          "Please rate Website Design & UI.",
        );

        return;
      }

      /* ================= CONSULTATION VALIDATION ================= */

      if (consultedDoctor) {
        if (!selectedAppointment) {
          setSubmitError(
            "Please select an appointment for feedback.",
          );

          return;
        }

        const missingConsultationRating =
          consultationRatingAreas.find(
            (area) => !areaRatings[area],
          );

        if (missingConsultationRating) {
          setSubmitError(
            `Please rate ${missingConsultationRating}.`,
          );

          return;
        }
      }

      /* ================= PREPARE PAYLOAD ================= */

      const payload: CreatePatientFeedbackPayload = {
        patient_id: Number(patientId),

        appointment_id:
          consultedDoctor && selectedAppointment
            ? Number(
                selectedAppointment.appointment_id,
              )
            : null,

        /*
         * How was your overall experience?
         */
        experience: overallRating,

        /*
         * Ease of Booking
         */
        booking: consultedDoctor
          ? areaRatings["Ease of Booking"]
          : null,

        /*
         * Doctor Communication
         */
        doc_communication: consultedDoctor
          ? areaRatings["Doctor Communication"]
          : null,

        /*
         * Doctor Professionalism
         */
        doc_professionalism: consultedDoctor
          ? areaRatings[
              "Doctor Professionalism"
            ]
          : null,

        /*
         * Waiting Time
         */
        waiting: consultedDoctor
          ? areaRatings["Waiting Time"]
          : null,

        /*
         * Quality of Consultation
         */
        quality: consultedDoctor
          ? areaRatings[
              "Quality of Consultation"
            ]
          : null,

        /*
         * Staff Behaviour
         */
        staff: consultedDoctor
          ? areaRatings["Staff Behaviour"]
          : null,

        /*
         * AI Symptom Checker Accuracy
         */
        ai_accuracy: aiAccuracy,

        /*
         * Website Design & UI
         */
        website: websiteRating,

        /*
         * Would you recommend SymptoNexus?
         */
        recommendation: recommend === "yes",

        /*
         * Did you consult with our doctor?
         */
        consultation: consultedDoctor,

        /*
         * Tell us more about your experience
         */
        desc: description.trim() || null,
      };

      /* ================= CALL API ================= */

      setSubmitting(true);

      const response =
        await createPatientFeedbackApi(payload);

      const result = response.data;

      /*
       * validateStatus returns all HTTP status responses,
       * so success must be checked manually.
       */
      if (!result?.success) {
        setSubmitError(
          result?.message ||
            "Failed to submit patient feedback.",
        );

        return;
      }

      const feedbackId =
        result.data?.patient_feedback_id;

      setFeedbackReference(
        feedbackId
          ? `SN-FBK-${feedbackId}`
          : "SN-FBK-",
      );

      setSubmitted(true);
    } catch (error: unknown) {
      console.error(
        "PATIENT FEEDBACK API ERROR:",
        error,
      );

      const apiError = error as {
        message?: string;

        response?: {
          data?: {
            message?: string;
          };
        };
      };

      setSubmitError(
        apiError.response?.data?.message ||
          apiError.message ||
          "Something went wrong while submitting feedback.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleClear = () => {
    setOverallRating(0);
    setAreaRatings({});
    setRecommend("yes");
    setConsultedDoctor(false);
    setSelectedAppointmentId("");
    setDescription("");
    setSubmitting(false);
    setSubmitted(false);
    setSubmitError("");
    setFeedbackReference("");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="mx-auto max-w-7xl rounded-sm border border-gray-200 bg-white shadow-xl">
        {/* Header */}

        <div className="flex items-center justify-between bg-gradient-to-r from-teal-700 to-cyan-600 px-6 py-4 text-white">
          <div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                className="text-2xl"
              >
                ←
              </button>

              <h1 className="text-2xl font-bold">
                Patient Feedback
              </h1>
            </div>

            <p className="ml-10 mt-1 text-sm">
              Your feedback helps us improve our
              services and patient experience.
            </p>
          </div>

          <div className="hidden items-center gap-2 text-4xl md:flex">
            📋 ❤️
          </div>
        </div>

        <div className="space-y-4 p-5">
          {/* Overall Experience */}

          <section className="rounded-lg border border-gray-200 bg-white p-4">
            <h2 className="mb-5 font-bold text-teal-700">
              How was your overall experience?
            </h2>

            <div className="grid grid-cols-2 gap-5 md:grid-cols-5">
              {overallRatings.map((item) => (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => {
                    setOverallRating(item.value);
                    setSubmitError("");
                  }}
                  className={`rounded-lg border p-4 text-center transition ${
                    overallRating === item.value
                      ? "border-teal-500 bg-teal-50"
                      : "border-transparent hover:bg-gray-50"
                  }`}
                >
                  <div className="mb-2 text-4xl">
                    {item.emoji}
                  </div>

                  <div className="text-lg text-yellow-400">
                    {"★".repeat(item.value)}
                  </div>

                  <div className="font-semibold">
                    {item.value}
                  </div>

                  <div className="text-sm text-gray-600">
                    {item.label}
                  </div>
                </button>
              ))}
            </div>
          </section>

          {/* Main Grid */}

          <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-4">
            <div className="space-y-4 lg:col-span-3">
              {/* Platform Rating Table */}

              <RatingTable
                title="3. Please rate the following areas"
                areaHeader="Feedback Area"
                areas={platformRatingAreas}
                ratings={areaRatings}
                onRate={handleAreaRating}
              />

              {/* Doctor Consultation */}

              <section className="rounded-lg border border-gray-200 bg-white p-4">
                <h2 className="mb-4 font-bold text-teal-700">
                  Doctor Consultation
                </h2>

                <p className="mb-3 font-medium">
                  Did you consult with our doctor?
                </p>

                <div className="mb-4 flex gap-6">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="consultedDoctor"
                      checked={consultedDoctor}
                      onChange={() =>
                        handleConsultationChange(true)
                      }
                    />

                    Yes
                  </label>

                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="consultedDoctor"
                      checked={!consultedDoctor}
                      onChange={() =>
                        handleConsultationChange(false)
                      }
                    />

                    No
                  </label>
                </div>

                {/* Appointment Selection */}

                {consultedDoctor && (
                  <div className="mb-4 rounded-lg border border-teal-100 bg-teal-50 p-4">
                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                      Select Appointment for Feedback
                    </label>

                    <select
                      value={selectedAppointmentId}
                      onChange={(event) => {
                        setSelectedAppointmentId(
                          event.target.value,
                        );

                        setSubmitError("");
                      }}
                      className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
                    >
                      <option value="">
                        Select appointment
                      </option>

                      {feedbackAppointments.map(
                        (appointment) => (
                          <option
                            key={
                              appointment.appointment_id
                            }
                            value={
                              appointment.appointment_id
                            }
                          >
                            {appointment.doctor_name ||
                              "Doctor"}{" "}
                            |{" "}
                            {appointment.specialization ||
                              "General"}{" "}
                            |{" "}
                            {appointment.appointment_date ||
                              "-"}{" "}
                            |{" "}
                            {getAppointmentTime(
                              appointment,
                            )}
                          </option>
                        ),
                      )}
                    </select>

                    {feedbackAppointments.length ===
                      0 && (
                      <p className="mt-2 text-xs text-red-500">
                        No eligible appointment found
                        for doctor feedback.
                      </p>
                    )}
                  </div>
                )}

                {/* Selected Appointment Details */}

                {consultedDoctor &&
                  selectedAppointment && (
                    <>
                      <div className="mb-4 rounded-lg border border-gray-200 bg-white p-4">
                        <h3 className="mb-3 font-bold text-gray-800">
                          Selected Appointment Details
                        </h3>

                        <div className="grid grid-cols-1 gap-3 text-sm md:grid-cols-2">
                          <p>
                            <span className="font-semibold">
                              Doctor:
                            </span>{" "}
                            {selectedAppointment.doctor_name ||
                              "-"}
                          </p>

                          <p>
                            <span className="font-semibold">
                              Specialization:
                            </span>{" "}
                            {selectedAppointment.specialization ||
                              "-"}
                          </p>

                          <p>
                            <span className="font-semibold">
                              Appointment Date:
                            </span>{" "}
                            {selectedAppointment.appointment_date ||
                              "-"}
                          </p>

                          <p>
                            <span className="font-semibold">
                              Time:
                            </span>{" "}
                            {getAppointmentTime(
                              selectedAppointment,
                            )}
                          </p>

                          <p>
                            <span className="font-semibold">
                              Status:
                            </span>{" "}
                            {selectedAppointment.booking_status ||
                              "-"}
                          </p>

                          <p>
                            <span className="font-semibold">
                              Appointment No:
                            </span>{" "}
                            {selectedAppointment.appointment_no ||
                              "-"}
                          </p>
                        </div>
                      </div>

                      <RatingTable
                        areaHeader="Consultation Area"
                        areas={
                          consultationRatingAreas
                        }
                        ratings={areaRatings}
                        onRate={handleAreaRating}
                      />
                    </>
                  )}
              </section>

              {/* Description and Recommendation */}

              <section className="rounded-lg border border-gray-200 bg-white p-4">
                <h2 className="mb-4 font-bold text-teal-700">
                  5. Tell us more about your
                  experience
                </h2>

                <textarea
                  className="h-24 w-full rounded-md border border-gray-300 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
                  placeholder="Please share your suggestions, complaints, or appreciation here..."
                  value={description}
                  onChange={(event) => {
                    setDescription(event.target.value);
                    setSubmitError("");
                  }}
                />

                <div className="mt-5 border-t border-gray-200 pt-4 text-center">
                  <p className="mb-2 font-medium">
                    Would you recommend SymptoNexus?
                  </p>

                  <div className="flex gap-6">
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="radio"
                        name="recommend"
                        checked={recommend === "yes"}
                        onChange={() =>
                          setRecommend("yes")
                        }
                      />

                      Yes
                    </label>

                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="radio"
                        name="recommend"
                        checked={recommend === "no"}
                        onChange={() =>
                          setRecommend("no")
                        }
                      />

                      No
                    </label>
                  </div>
                </div>
              </section>
            </div>

            {/* Right Side Cards */}

            <aside className="space-y-4">
              <div className="flex min-h-[205px] flex-col justify-center rounded-lg border border-green-100 bg-green-50 p-5 text-center">
                <div className="mb-3 text-5xl">
                  ✅
                </div>

                <h3 className="text-lg font-bold text-green-700">
                  Thank You!
                </h3>

                <p className="mt-2 text-sm leading-6 text-gray-600">
                  Your feedback is very important to us.
                  We use your feedback to improve our
                  services.
                </p>

                <div className="mt-5 text-5xl">
                  📋🙂
                </div>
              </div>

              {/* Feedback Summary */}

              <div className="min-h-[190px] rounded-lg border border-gray-200 bg-white p-5">
                <h3 className="mb-4 font-bold text-teal-700">
                  Feedback Summary
                </h3>

                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between rounded-md bg-gray-50 px-3 py-2">
                    <span className="text-gray-600">
                      Overall Rating
                    </span>

                    <span className="font-semibold text-gray-800">
                      {overallRating
                        ? `${overallRating}/5`
                        : "Not selected"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between rounded-md bg-gray-50 px-3 py-2">
                    <span className="text-gray-600">
                      Doctor Consulted
                    </span>

                    <span className="font-semibold text-gray-800">
                      {consultedDoctor
                        ? "Yes"
                        : "No"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between rounded-md bg-gray-50 px-3 py-2">
                    <span className="text-gray-600">
                      Appointment
                    </span>

                    <span className="font-semibold text-gray-800">
                      {selectedAppointment
                        ? "Selected"
                        : "Not selected"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between rounded-md bg-gray-50 px-3 py-2">
                    <span className="text-gray-600">
                      Recommend
                    </span>

                    <span className="font-semibold capitalize text-gray-800">
                      {recommend}
                    </span>
                  </div>
                </div>
              </div>

              {/* Why Give Feedback */}

              <div className="min-h-[262px] rounded-lg border border-gray-200 bg-white p-5">
                <h3 className="mb-4 font-bold text-teal-700">
                  Why Give Feedback?
                </h3>

                <ul className="space-y-4 text-sm text-gray-600">
                  <li className="flex gap-3">
                    <span>🛡️</span>
                    <span>
                      Help us improve our services
                    </span>
                  </li>

                  <li className="flex gap-3">
                    <span>👥</span>
                    <span>
                      Better patient experience
                    </span>
                  </li>

                  <li className="flex gap-3">
                    <span>⚡</span>
                    <span>
                      Quick resolution of issues
                    </span>
                  </li>

                  <li className="flex gap-3">
                    <span>♡</span>
                    <span>
                      We value your opinion
                    </span>
                  </li>
                </ul>
              </div>
            </aside>
          </div>

          {/* Error Message */}

          {submitError && (
            <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-center text-sm font-medium text-red-700">
              {submitError}
            </div>
          )}

          {/* Buttons */}

          <div className="flex justify-center gap-5 pt-2">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting}
              className={`rounded-md px-10 py-3 font-semibold text-white transition ${
                submitting
                  ? "cursor-not-allowed bg-green-400"
                  : "bg-green-600 hover:bg-green-700"
              }`}
            >
              {submitting
                ? "Submitting..."
                : "Submit Feedback"}
            </button>

            <button
              type="button"
              onClick={handleClear}
              disabled={submitting}
              className="rounded-md border border-gray-300 bg-white px-10 py-3 font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Clear Form
            </button>
          </div>

          {/* Success Footer */}

          {submitted && (
            <div className="grid grid-cols-1 items-center gap-4 rounded-lg border border-green-200 bg-green-50 p-4 md:grid-cols-4">
              <div className="flex items-center gap-4 md:col-span-2">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-600 text-2xl text-white">
                  ✓
                </div>

                <div>
                  <h3 className="font-bold text-green-700">
                    Thank you for your feedback!
                  </h3>

                  <p className="text-sm text-gray-600">
                    Your feedback has been recorded
                    successfully. Our team will review it
                    and contact you if required.
                  </p>
                </div>
              </div>

              <div>
                <p className="text-xs text-gray-500">
                  Feedback Reference No.
                </p>

                <p className="font-semibold">
                  {feedbackReference ||
                    "SN-FBK-"}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-500">
                  Status
                </p>

                <span className="inline-block rounded-md bg-green-200 px-3 py-1 text-sm font-semibold text-green-700">
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