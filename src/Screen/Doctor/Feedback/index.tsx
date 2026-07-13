import { useState } from "react";
import { useSelector } from "react-redux";

import type { RootState } from "../../../../store/store";

import {
  createDoctorFeedbackApi,
  type CreateDoctorFeedbackPayload,
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

const doctorRatingAreas = [
  "Website Design & UI",
  "Appointment Management",
  "Patient Information",
  "System Performance",
  "Support Service",
  "Patient Cooperation",
  "Staff Behaviour",
] as const;

type DoctorRatingArea = (typeof doctorRatingAreas)[number];

interface RatingTableProps {
  title: string;
  areas: readonly DoctorRatingArea[];
  ratings: Partial<Record<DoctorRatingArea, number>>;
  onRate: (area: DoctorRatingArea, rating: number) => void;
}

interface AuthDoctorUser {
  doctor_id?: number;
  ref_id?: number;
}

interface ApiErrorShape {
  message?: string;
  response?: {
    data?: {
      message?: string;
    };
  };
}

function RatingTable({
  title,
  areas,
  ratings,
  onRate,
}: RatingTableProps) {
  return (
    <section className="overflow-hidden rounded-lg border border-gray-200 bg-white">
      <div className="p-4">
        <h2 className="font-bold text-teal-700">{title}</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-t border-gray-200 text-sm">
          <thead>
            <tr className="bg-gray-50">
              <th className="min-w-[220px] border border-gray-200 p-3 text-left">
                Feedback Area
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
                      value={column.value}
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
}

function DoctorFeedback() {
  const user = useSelector((state: RootState) => state.auth.user);

  const doctorUser = user as AuthDoctorUser | null;

  const doctorId = doctorUser?.doctor_id ?? doctorUser?.ref_id;

  const [overallRating, setOverallRating] = useState(0);

  const [areaRatings, setAreaRatings] = useState<
    Partial<Record<DoctorRatingArea, number>>
  >({});

  const [recommend, setRecommend] = useState<"yes" | "no">("yes");
  const [description, setDescription] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [feedbackReference, setFeedbackReference] = useState("");

  const handleAreaRating = (
    area: DoctorRatingArea,
    rating: number,
  ) => {
    setAreaRatings((previous) => ({
      ...previous,
      [area]: rating,
    }));

    setSubmitError("");
    setSubmitted(false);
  };

  const handleSubmit = async () => {
    try {
      setSubmitError("");
      setSubmitted(false);
      setFeedbackReference("");

      const currentDoctorId = Number(doctorId);

      if (
        !Number.isInteger(currentDoctorId) ||
        currentDoctorId <= 0
      ) {
        setSubmitError(
          "Doctor information was not found. Please log in again.",
        );
        return;
      }

      if (!overallRating) {
        setSubmitError(
          "Please select your overall experience rating.",
        );
        return;
      }

      const missingRatingArea = doctorRatingAreas.find(
        (area) => !areaRatings[area],
      );

      if (missingRatingArea) {
        setSubmitError(`Please rate ${missingRatingArea}.`);
        return;
      }

      const payload: CreateDoctorFeedbackPayload = {
        doctor_id: currentDoctorId,
        experience: overallRating,
        website: Number(areaRatings["Website Design & UI"]),
        management: Number(
          areaRatings["Appointment Management"],
        ),
        p_info: Number(areaRatings["Patient Information"]),
        system_performance: Number(
          areaRatings["System Performance"],
        ),
        support_service: Number(
          areaRatings["Support Service"],
        ),
        p_cooperation: Number(
          areaRatings["Patient Cooperation"],
        ),
        staff: Number(areaRatings["Staff Behaviour"]),
        recommendation: recommend === "yes",
        desc: description.trim() || null,
      };

      setSubmitting(true);

      const response = await createDoctorFeedbackApi(payload);
      const result = response.data;

      /*
       * The service uses validateStatus: () => true,
       * therefore business success must be checked manually.
       */
      if (!result?.success) {
        setSubmitError(
          result?.message ||
            "Failed to submit doctor feedback.",
        );
        return;
      }

      const feedbackId = result.data?.doctor_feedback_id;

      setFeedbackReference(
        feedbackId
          ? `SN-DFBK-${feedbackId}`
          : "SN-DFBK-",
      );

      setSubmitted(true);
    } catch (error: unknown) {
      console.error("DOCTOR FEEDBACK API ERROR:", error);

      const apiError = error as ApiErrorShape;

      setSubmitError(
        apiError.response?.data?.message ||
          apiError.message ||
          "Something went wrong while submitting doctor feedback.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleClear = () => {
    setOverallRating(0);
    setAreaRatings({});
    setRecommend("yes");
    setDescription("");
    setSubmitting(false);
    setSubmitted(false);
    setSubmitError("");
    setFeedbackReference("");
  };

  const ratedAreaCount = doctorRatingAreas.filter(
    (area) => Boolean(areaRatings[area]),
  ).length;

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="mx-auto max-w-7xl rounded-sm border border-gray-200 bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between bg-gradient-to-r from-teal-700 to-cyan-600 px-6 py-4 text-white">
          <div>
            <div className="flex items-center gap-3">
              <button type="button" className="text-2xl">
                ←
              </button>

              <h1 className="text-2xl font-bold">
                Doctor Feedback
              </h1>
            </div>

            <p className="ml-10 mt-1 text-sm">
              Your feedback helps us improve our services and
              doctor experience.
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
                    setSubmitted(false);
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
              <RatingTable
                title="Please rate the following areas"
                areas={doctorRatingAreas}
                ratings={areaRatings}
                onRate={handleAreaRating}
              />

              {/* Description and Recommendation */}
              <section className="rounded-lg border border-gray-200 bg-white p-4">
                <h2 className="mb-4 font-bold text-teal-700">
                  Tell us more about your experience
                </h2>

                <textarea
                  className="h-24 w-full rounded-md border border-gray-300 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
                  placeholder="Please share your suggestions, complaints, or appreciation here..."
                  value={description}
                  onChange={(event) => {
                    setDescription(event.target.value);
                    setSubmitError("");
                    setSubmitted(false);
                  }}
                />

                <div className="mt-5 border-t border-gray-200 pt-4">
                  <p className="mb-2 font-medium">
                    Would you recommend SymptoNexus?
                  </p>

                  <div className="flex gap-6">
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="radio"
                        name="recommend"
                        checked={recommend === "yes"}
                        onChange={() => {
                          setRecommend("yes");
                          setSubmitError("");
                          setSubmitted(false);
                        }}
                      />
                      Yes
                    </label>

                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="radio"
                        name="recommend"
                        checked={recommend === "no"}
                        onChange={() => {
                          setRecommend("no");
                          setSubmitError("");
                          setSubmitted(false);
                        }}
                      />
                      No
                    </label>
                  </div>
                </div>
              </section>
            </div>

            {/* Right Side */}
            <aside className="space-y-4">
              <div className="flex min-h-[205px] flex-col justify-center rounded-lg border border-green-100 bg-green-50 p-5 text-center">
                <div className="mb-3 text-5xl">✅</div>

                <h3 className="text-lg font-bold text-green-700">
                  Thank You!
                </h3>

                <p className="mt-2 text-sm leading-6 text-gray-600">
                  Your feedback is very important to us. We use
                  your feedback to improve our services.
                </p>

                <div className="mt-5 text-5xl">📋🙂</div>
              </div>

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
                      Areas Rated
                    </span>

                    <span className="font-semibold text-gray-800">
                      {ratedAreaCount}/{doctorRatingAreas.length}
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

              <div className="min-h-[262px] rounded-lg border border-gray-200 bg-white p-5">
                <h3 className="mb-4 font-bold text-teal-700">
                  Why Give Feedback?
                </h3>

                <ul className="space-y-4 text-sm text-gray-600">
                  <li className="flex gap-3">
                    <span>🛡️</span>
                    <span>Help us improve our services</span>
                  </li>

                  <li className="flex gap-3">
                    <span>👥</span>
                    <span>Improve doctor experience</span>
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

          {/* Success Message */}
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
                    Your feedback has been recorded successfully.
                  </p>
                </div>
              </div>

              <div>
                <p className="text-xs text-gray-500">
                  Feedback Reference No.
                </p>

                <p className="font-semibold">
                  {feedbackReference || "SN-DFBK-"}
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
}

export default DoctorFeedback;


