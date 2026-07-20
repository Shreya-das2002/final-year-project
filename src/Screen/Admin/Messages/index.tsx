import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import {
  FaCommentMedical,
  FaStar,
  FaUserMd,
} from "react-icons/fa";
import {
  LuStethoscope,
  LuUser,
} from "react-icons/lu";

import type { RootState } from "../../../../store/store";

import {
  getAllDoctorFeedbackApi,
  getAllPatientFeedbackApi,
  type DoctorFeedback,
  type PatientFeedback,
} from "../../../services/feedbackApi";

/* =====================================================
   TYPES
===================================================== */

type AdminRole =
  | "super admin"
  | "standard admin"
  | "guest admin"
  | "";

type FeedbackSectionType =
  | "patient"
  | "doctor";

/* =====================================================
   ROLE HELPER
===================================================== */

const normalizeRole = (
  value: unknown
): AdminRole => {
  const normalizedRole = String(value || "")
    .trim()
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/-/g, " ")
    .replace(/\s+/g, " ");

  if (
    normalizedRole === "super admin" ||
    normalizedRole === "superadmin"
  ) {
    return "super admin";
  }

  if (
    normalizedRole === "standard admin" ||
    normalizedRole === "standardadmin"
  ) {
    return "standard admin";
  }

  if (
    normalizedRole === "guest admin" ||
    normalizedRole === "guestadmin"
  ) {
    return "guest admin";
  }

  return "";
};

/* =====================================================
   OTHER HELPERS
===================================================== */

const getSafeRating = (
  value?: number | null
): number => {
  const rating = Number(value ?? 0);

  if (Number.isNaN(rating)) {
    return 0;
  }

  return Math.max(
    0,
    Math.min(Math.round(rating), 5)
  );
};

const formatDoctorName = (
  name?: string | null
): string => {
  if (!name) {
    return "Doctor";
  }

  const cleanName = name.replace(
    /^Dr\.?\s*/i,
    ""
  );

  return `Dr. ${cleanName}`;
};

/* =====================================================
   MAIN COMPONENT
===================================================== */

const Messages = () => {
  /*
   * Your login/auth bootstrap stores role directly
   * inside state.auth.role.
   */
  const reduxRole = useSelector(
    (state: RootState) =>
      state.auth.role
  );

  const role = normalizeRole(reduxRole);

  const [
    patientFeedbacks,
    setPatientFeedbacks,
  ] = useState<PatientFeedback[]>([]);

  const [
    doctorFeedbacks,
    setDoctorFeedbacks,
  ] = useState<DoctorFeedback[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [
    errorMessage,
    setErrorMessage,
  ] = useState("");

  const [
    patientError,
    setPatientError,
  ] = useState("");

  const [
    doctorError,
    setDoctorError,
  ] = useState("");

  const isSuperAdmin =
    role === "super admin";

  const isStandardAdmin =
    role === "standard admin";

  const isGuestAdmin =
    role === "guest admin";

  /* =====================================================
     FETCH FEEDBACK ACCORDING TO ROLE
  ===================================================== */

  useEffect(() => {
    let mounted = true;

    const fetchFeedback = async () => {
      try {
        setLoading(true);
        setErrorMessage("");
        setPatientError("");
        setDoctorError("");
        setPatientFeedbacks([]);
        setDoctorFeedbacks([]);

        if (!role) {
          setErrorMessage(
            "Your admin role could not be identified. Please log in again."
          );

          return;
        }

        /* =============================================
           SUPER ADMIN
           PATIENT + DOCTOR FEEDBACK
        ============================================= */

        if (role === "super admin") {
          const results =
            await Promise.allSettled([
              getAllPatientFeedbackApi(),
              getAllDoctorFeedbackApi(),
            ]);

          if (!mounted) {
            return;
          }

          const patientResult = results[0];
          const doctorResult = results[1];

          if (
            patientResult.status ===
            "fulfilled"
          ) {
            const response =
              patientResult.value.data;

            if (response?.success) {
              setPatientFeedbacks(
                response.data || []
              );
            } else {
              setPatientError(
                response?.message ||
                  "Failed to load patient feedback."
              );
            }
          } else {
            console.error(
              "PATIENT FEEDBACK ERROR:",
              patientResult.reason
            );

            setPatientError(
              "Failed to load patient feedback."
            );
          }

          if (
            doctorResult.status ===
            "fulfilled"
          ) {
            const response =
              doctorResult.value.data;

            if (response?.success) {
              setDoctorFeedbacks(
                response.data || []
              );
            } else {
              setDoctorError(
                response?.message ||
                  "Failed to load doctor feedback."
              );
            }
          } else {
            console.error(
              "DOCTOR FEEDBACK ERROR:",
              doctorResult.reason
            );

            setDoctorError(
              "Failed to load doctor feedback."
            );
          }

          return;
        }

        /* =============================================
           STANDARD ADMIN
           DOCTOR FEEDBACK ONLY
        ============================================= */

        if (
          role === "standard admin"
        ) {
          const response =
            await getAllDoctorFeedbackApi();

          if (!mounted) {
            return;
          }

          if (!response.data?.success) {
            setErrorMessage(
              response.data?.message ||
                "Failed to load doctor feedback."
            );

            return;
          }

          setDoctorFeedbacks(
            response.data.data || []
          );

          return;
        }

        /* =============================================
           GUEST ADMIN
           PATIENT FEEDBACK ONLY
        ============================================= */

        if (role === "guest admin") {
          const response =
            await getAllPatientFeedbackApi();

          if (!mounted) {
            return;
          }

          if (!response.data?.success) {
            setErrorMessage(
              response.data?.message ||
                "Failed to load patient feedback."
            );

            return;
          }

          setPatientFeedbacks(
            response.data.data || []
          );

          return;
        }

        setErrorMessage(
          "You do not have permission to view this page."
        );
      } catch (error) {
        console.error(
          "FETCH FEEDBACK ERROR:",
          error
        );

        if (mounted) {
          setErrorMessage(
            "Something went wrong while loading feedback."
          );
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchFeedback();

    return () => {
      mounted = false;
    };
  }, [role]);

  /* =====================================================
     TOTAL FEEDBACK COUNT
  ===================================================== */

  const totalFeedback = useMemo(() => {
    if (isSuperAdmin) {
      return (
        patientFeedbacks.length +
        doctorFeedbacks.length
      );
    }

    if (isStandardAdmin) {
      return doctorFeedbacks.length;
    }

    if (isGuestAdmin) {
      return patientFeedbacks.length;
    }

    return 0;
  }, [
    isSuperAdmin,
    isStandardAdmin,
    isGuestAdmin,
    patientFeedbacks.length,
    doctorFeedbacks.length,
  ]);

  /* =====================================================
     LOADING
  ===================================================== */

  if (loading) {
    return <FeedbackLoading />;
  }

  /* =====================================================
     ERROR
  ===================================================== */

  if (errorMessage) {
    return (
      <FeedbackError
        message={errorMessage}
        role={reduxRole}
      />
    );
  }

  /* =====================================================
     PAGE
  ===================================================== */

  return (
    <div
      className="
        min-h-screen
        bg-gradient-to-r
        from-gray-200
        via-slate-50
        to-gray-200
        p-4
        sm:p-6
        dark:from-gray-950
        dark:via-gray-800
        dark:to-gray-950
      "
    >
      <div className="mx-auto max-w-7xl">
        {/* HEADER */}

        <FeedbackPageHeader
          role={role}
          totalFeedback={totalFeedback}
        />


        {/* SUPER ADMIN */}

        {isSuperAdmin && (
          <div className="space-y-12">
            <section>
              <FeedbackSectionHeader
                type="patient"
                title="Patient Feedback"
                count={
                  patientFeedbacks.length
                }
              />

              {patientError ? (
                <SectionError
                  message={patientError}
                />
              ) : (
                <PatientFeedbackSection
                  feedbacks={
                    patientFeedbacks
                  }
                />
              )}
            </section>

            <section>
              <FeedbackSectionHeader
                type="doctor"
                title="Doctor Feedback"
                count={
                  doctorFeedbacks.length
                }
              />

              {doctorError ? (
                <SectionError
                  message={doctorError}
                />
              ) : (
                <DoctorFeedbackSection
                  feedbacks={
                    doctorFeedbacks
                  }
                />
              )}
            </section>
          </div>
        )}

        {/* STANDARD ADMIN */}

        {isStandardAdmin && (
          <DoctorFeedbackSection
            feedbacks={doctorFeedbacks}
          />
        )}

        {/* GUEST ADMIN */}

        {isGuestAdmin && (
          <PatientFeedbackSection
            feedbacks={patientFeedbacks}
          />
        )}
      </div>
    </div>
  );
};

/* =====================================================
   PAGE HEADER
===================================================== */

interface FeedbackPageHeaderProps {
  role: AdminRole;
  totalFeedback: number;
}

const FeedbackPageHeader = ({
  role,
  totalFeedback,
}: FeedbackPageHeaderProps) => {
  const isSuperAdmin =
    role === "super admin";

  const isStandardAdmin =
    role === "standard admin";

  const title = isSuperAdmin
    ? "All Feedback"
    : isStandardAdmin
      ? "Doctor Feedback"
      : "Patient Feedback";

  const description = isSuperAdmin
    ? "Review feedback submitted by registered patients and doctors."
    : isStandardAdmin
      ? "Review feedback submitted by registered doctors."
      : "Review feedback submitted by registered patients.";

  return (
    <div
      className="
        mb-8
        rounded-3xl
        bg-gradient-to-r
        from-cyan-700
        to-teal-500
        p-6
        text-white
        shadow-xl
        sm:p-8
      "
    >
      <div
        className="
          flex
          flex-col
          gap-6
          md:flex-row
          md:items-center
          md:justify-between
        "
      >
        <div className="flex items-center gap-5">
          <div
            className="
              flex
              h-16
              w-16
              shrink-0
              items-center
              justify-center
              rounded-2xl
              bg-white/20
              backdrop-blur
            "
          >
            <FaCommentMedical className="text-3xl" />
          </div>

          <div>
            <h1 className="text-3xl font-bold md:text-4xl">
              {title}
            </h1>

            <p className="mt-2 text-cyan-50">
              {description}
            </p>
          </div>
        </div>

        <div
          className="
            rounded-2xl
            bg-white/20
            px-7
            py-4
            backdrop-blur
          "
        >
          <p className="text-sm text-cyan-50">
            Total Feedback
          </p>

          <p className="text-3xl font-bold">
            {totalFeedback}
          </p>
        </div>
      </div>
    </div>
  );
};


/* =====================================================
   SECTION HEADER
===================================================== */

interface FeedbackSectionHeaderProps {
  type: FeedbackSectionType;
  title: string;
  count: number;
}

const FeedbackSectionHeader = ({
  type,
  title,
  count,
}: FeedbackSectionHeaderProps) => {
  const isDoctor =
    type === "doctor";

  return (
    <div
      className="
        mb-6
        flex
        flex-col
        gap-3
        rounded-2xl
        border
        border-gray-200
        bg-white
        p-5
        shadow-sm
        sm:flex-row
        sm:items-center
        sm:justify-between
        dark:border-gray-700
        dark:bg-gray-800
      "
    >
      <div className="flex items-center gap-4">
        <div
          className={`
            flex
            h-12
            w-12
            items-center
            justify-center
            rounded-xl
            ${
              isDoctor
                ? `
                  bg-emerald-100
                  text-emerald-600
                  dark:bg-emerald-950
                  dark:text-emerald-300
                `
                : `
                  bg-blue-100
                  text-blue-600
                  dark:bg-blue-950
                  dark:text-blue-300
                `
            }
          `}
        >
          {isDoctor ? (
            <LuStethoscope className="text-2xl" />
          ) : (
            <LuUser className="text-2xl" />
          )}
        </div>

        <div>
          <h2
            className="
              text-2xl
              font-bold
              text-gray-900
              dark:text-white
            "
          >
            {title}
          </h2>

          <p
            className="
              text-sm
              text-gray-500
              dark:text-gray-400
            "
          >
            {count} feedback record
            {count === 1 ? "" : "s"}
          </p>
        </div>
      </div>
    </div>
  );
};

/* =====================================================
   DOCTOR FEEDBACK
===================================================== */

interface DoctorFeedbackSectionProps {
  feedbacks: DoctorFeedback[];
}

const DoctorFeedbackSection = ({
  feedbacks,
}: DoctorFeedbackSectionProps) => {
  if (feedbacks.length === 0) {
    return (
      <EmptyFeedback
        type="doctor"
        title="No doctor feedback found"
        description="Doctor feedback will appear here after a doctor submits feedback."
      />
    );
  }

  return (
    <div
      className="
        grid
        grid-cols-1
        gap-6
        xl:grid-cols-2
      "
    >
      {feedbacks.map((feedback) => (
        <article
          key={
            feedback.doctor_feedback_id
          }
          className="
            overflow-hidden
            rounded-3xl
            border
            border-gray-200
            bg-white
            shadow-md
            transition-all
            duration-300
            hover:-translate-y-1
            hover:shadow-xl
            dark:border-gray-700
            dark:bg-gray-800
          "
        >
          <div
            className="
              h-1.5
              bg-gradient-to-r
              from-emerald-400
              to-cyan-600
            "
          />

          <div className="p-6">
            <div
              className="
                mb-5
                flex
                items-start
                justify-between
                gap-4
              "
            >
              <div className="flex items-center gap-4">
                <div
                  className="
                    flex
                    h-14
                    w-14
                    shrink-0
                    items-center
                    justify-center
                    rounded-2xl
                    bg-gradient-to-r
                    from-emerald-500
                    to-teal-600
                    text-white
                    shadow
                  "
                >
                  <FaUserMd className="text-2xl" />
                </div>

                <div>
                  <h3
                    className="
                      text-xl
                      font-bold
                      text-gray-900
                      dark:text-white
                    "
                  >
                    {formatDoctorName(
                      feedback.doctor_name
                    )}
                  </h3>

                  <p
                    className="
                      text-sm
                      text-gray-500
                      dark:text-gray-400
                    "
                  >
                    {feedback.specialization ||
                      "Specialization not available"}
                  </p>
                </div>
              </div>

              <span
                className="
                  rounded-full
                  bg-emerald-100
                  px-3
                  py-1
                  text-xs
                  font-semibold
                  text-emerald-700
                  dark:bg-emerald-950
                  dark:text-emerald-300
                "
              >
                Doctor
              </span>
            </div>

            <StarRating
              rating={feedback.experience}
            />

            <FeedbackDescription
              description={feedback.desc}
            />

            <div
              className="
                grid
                grid-cols-2
                gap-3
                sm:grid-cols-3
              "
            >
              <RatingItem
                label="Website"
                value={feedback.website}
              />

              <RatingItem
                label="Management"
                value={feedback.management}
              />

              <RatingItem
                label="Patient Info"
                value={feedback.p_info}
              />

              <RatingItem
                label="Performance"
                value={
                  feedback.system_performance
                }
              />

              <RatingItem
                label="Support"
                value={
                  feedback.support_service
                }
              />

              <RatingItem
                label="Cooperation"
                value={
                  feedback.p_cooperation
                }
              />

              <RatingItem
                label="Staff"
                value={feedback.staff}
              />
            </div>

            <RecommendationRow
              label="Would recommend"
              value={
                feedback.recommendation
              }
            />
          </div>
        </article>
      ))}
    </div>
  );
};

/* =====================================================
   PATIENT FEEDBACK
===================================================== */

interface PatientFeedbackSectionProps {
  feedbacks: PatientFeedback[];
}

const PatientFeedbackSection = ({
  feedbacks,
}: PatientFeedbackSectionProps) => {
  if (feedbacks.length === 0) {
    return (
      <EmptyFeedback
        type="patient"
        title="No patient feedback found"
        description="Patient feedback will appear here after a patient submits feedback."
      />
    );
  }

  return (
    <div
      className="
        grid
        grid-cols-1
        gap-6
        xl:grid-cols-2
      "
    >
      {feedbacks.map((feedback) => (
        <article
          key={
            feedback.patient_feedback_id
          }
          className="
            overflow-hidden
            rounded-3xl
            border
            border-gray-200
            bg-white
            shadow-md
            transition-all
            duration-300
            hover:-translate-y-1
            hover:shadow-xl
            dark:border-gray-700
            dark:bg-gray-800
          "
        >
          <div
            className="
              h-1.5
              bg-gradient-to-r
              from-blue-400
              to-cyan-600
            "
          />

          <div className="p-6">
            <div
              className="
                mb-5
                flex
                items-start
                justify-between
                gap-4
              "
            >
              <div className="flex items-center gap-4">
                <div
                  className="
                    flex
                    h-14
                    w-14
                    shrink-0
                    items-center
                    justify-center
                    rounded-2xl
                    bg-gradient-to-r
                    from-blue-500
                    to-cyan-600
                    text-white
                    shadow
                  "
                >
                  <LuUser className="text-2xl" />
                </div>

                <div>
                  <h3
                    className="
                      text-xl
                      font-bold
                      text-gray-900
                      dark:text-white
                    "
                  >
                    {feedback.patient_name ||
                      "Patient"}
                  </h3>

                  <p
                    className="
                      text-sm
                      text-gray-500
                      dark:text-gray-400
                    "
                  >
                    Appointment ID:{" "}
                    {feedback.appointment_id ??
                      "N/A"}
                  </p>
                </div>
              </div>

              <span
                className="
                  rounded-full
                  bg-blue-100
                  px-3
                  py-1
                  text-xs
                  font-semibold
                  text-blue-700
                  dark:bg-blue-950
                  dark:text-blue-300
                "
              >
                Patient
              </span>
            </div>

            <StarRating
              rating={feedback.experience}
            />

            <FeedbackDescription
              description={feedback.desc}
            />

            <div
              className="
                grid
                grid-cols-2
                gap-3
                sm:grid-cols-3
              "
            >
              <RatingItem
                label="Booking"
                value={feedback.booking}
              />

              <RatingItem
                label="Communication"
                value={
                  feedback.doc_communication
                }
              />

              <RatingItem
                label="Professionalism"
                value={
                  feedback.doc_professionalism
                }
              />

              <RatingItem
                label="Waiting"
                value={feedback.waiting}
              />

              <RatingItem
                label="Quality"
                value={feedback.quality}
              />

              <RatingItem
                label="Staff"
                value={feedback.staff}
              />

              <RatingItem
                label="AI Accuracy"
                value={feedback.ai_accuracy}
              />

              <RatingItem
                label="Website"
                value={feedback.website}
              />
            </div>

            <div
              className="
                mt-5
                grid
                grid-cols-1
                gap-4
                border-t
                border-gray-200
                pt-4
                sm:grid-cols-2
                dark:border-gray-700
              "
            >
              <BooleanInformation
                label="Recommend"
                value={
                  feedback.recommendation
                }
              />

              <BooleanInformation
                label="Consultation"
                value={
                  feedback.consultation
                }
              />
            </div>
          </div>
        </article>
      ))}
    </div>
  );
};

/* =====================================================
   STAR RATING
===================================================== */

interface StarRatingProps {
  rating?: number | null;
}

const StarRating = ({
  rating,
}: StarRatingProps) => {
  const safeRating =
    getSafeRating(rating);

  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map(
        (_, index) => (
          <FaStar
            key={index}
            className={
              index < safeRating
                ? "text-yellow-400"
                : "text-gray-300 dark:text-gray-600"
            }
          />
        )
      )}

      <span
        className="
          ml-2
          text-sm
          text-gray-500
          dark:text-gray-400
        "
      >
        {safeRating}/5
      </span>
    </div>
  );
};

/* =====================================================
   DESCRIPTION
===================================================== */

interface FeedbackDescriptionProps {
  description?: string | null;
}

const FeedbackDescription = ({
  description,
}: FeedbackDescriptionProps) => {
  return (
    <div
      className="
        my-5
        rounded-2xl
        bg-gray-50
        p-4
        dark:bg-gray-900/50
      "
    >
      <p
        className="
          leading-7
          text-gray-600
          dark:text-gray-300
        "
      >
        “
        {description ||
          "No additional comments provided."}
        ”
      </p>
    </div>
  );
};

/* =====================================================
   RATING ITEM
===================================================== */

interface RatingItemProps {
  label: string;
  value?: number | null;
}

const RatingItem = ({
  label,
  value,
}: RatingItemProps) => {
  const numericValue =
    value === null ||
    value === undefined
      ? null
      : Number(value);

  return (
    <div
      className="
        rounded-xl
        border
        border-gray-200
        bg-gray-50
        p-3
        dark:border-gray-700
        dark:bg-gray-900/40
      "
    >
      <p
        className="
          text-xs
          text-gray-500
          dark:text-gray-400
        "
      >
        {label}
      </p>

      <p
        className="
          mt-1
          font-semibold
          text-gray-900
          dark:text-white
        "
      >
        {numericValue === null ||
        Number.isNaN(numericValue)
          ? "-"
          : `${numericValue}/5`}
      </p>
    </div>
  );
};

/* =====================================================
   BOOLEAN VALUES
===================================================== */

interface BooleanBadgeProps {
  value?: boolean | null;
}

const BooleanBadge = ({
  value,
}: BooleanBadgeProps) => {
  return (
    <span
      className={`
        rounded-full
        px-3
        py-1
        text-xs
        font-semibold
        ${
          value
            ? `
              bg-green-100
              text-green-700
              dark:bg-green-950
              dark:text-green-300
            `
            : `
              bg-red-100
              text-red-700
              dark:bg-red-950
              dark:text-red-300
            `
        }
      `}
    >
      {value ? "Yes" : "No"}
    </span>
  );
};

interface BooleanInformationProps {
  label: string;
  value?: boolean | null;
}

const BooleanInformation = ({
  label,
  value,
}: BooleanInformationProps) => {
  return (
    <div
      className="
        flex
        items-center
        justify-between
        gap-3
      "
    >
      <span
        className="
          text-sm
          text-gray-500
          dark:text-gray-400
        "
      >
        {label}
      </span>

      <BooleanBadge value={value} />
    </div>
  );
};

interface RecommendationRowProps {
  label: string;
  value?: boolean | null;
}

const RecommendationRow = ({
  label,
  value,
}: RecommendationRowProps) => {
  return (
    <div
      className="
        mt-5
        flex
        items-center
        justify-between
        gap-4
        border-t
        border-gray-200
        pt-4
        dark:border-gray-700
      "
    >
      <span
        className="
          text-sm
          text-gray-500
          dark:text-gray-400
        "
      >
        {label}
      </span>

      <BooleanBadge value={value} />
    </div>
  );
};

/* =====================================================
   EMPTY FEEDBACK
===================================================== */

interface EmptyFeedbackProps {
  title: string;
  description: string;
  type: FeedbackSectionType;
}

const EmptyFeedback = ({
  title,
  description,
  type,
}: EmptyFeedbackProps) => {
  const isDoctor =
    type === "doctor";

  return (
    <div
      className="
        rounded-3xl
        border
        border-dashed
        border-gray-300
        bg-white
        p-12
        text-center
        shadow-sm
        dark:border-gray-700
        dark:bg-gray-800
      "
    >
      <div
        className={`
          mx-auto
          flex
          h-20
          w-20
          items-center
          justify-center
          rounded-full
          ${
            isDoctor
              ? `
                bg-emerald-100
                text-emerald-600
                dark:bg-emerald-950
                dark:text-emerald-300
              `
              : `
                bg-blue-100
                text-blue-600
                dark:bg-blue-950
                dark:text-blue-300
              `
          }
        `}
      >
        {isDoctor ? (
          <FaUserMd className="text-3xl" />
        ) : (
          <LuUser className="text-3xl" />
        )}
      </div>

      <h3
        className="
          mt-5
          text-xl
          font-bold
          text-gray-900
          dark:text-white
        "
      >
        {title}
      </h3>

      <p
        className="
          mt-2
          text-gray-500
          dark:text-gray-400
        "
      >
        {description}
      </p>
    </div>
  );
};

/* =====================================================
   SECTION ERROR
===================================================== */

interface SectionErrorProps {
  message: string;
}

const SectionError = ({
  message,
}: SectionErrorProps) => {
  return (
    <div
      className="
        rounded-2xl
        border
        border-red-200
        bg-red-50
        p-6
        text-red-700
        dark:border-red-900
        dark:bg-red-950/40
        dark:text-red-300
      "
    >
      {message}
    </div>
  );
};

/* =====================================================
   PAGE ERROR
===================================================== */

interface FeedbackErrorProps {
  message: string;
  role?: string | null;
}

const FeedbackError = ({
  message,
  role,
}: FeedbackErrorProps) => {
  return (
    <div
      className="
        min-h-screen
        bg-gradient-to-r
        from-gray-200
        via-slate-50
        to-gray-200
        p-6
        dark:from-gray-950
        dark:via-gray-800
        dark:to-gray-950
      "
    >
      <div className="mx-auto max-w-7xl">
        <div
          className="
            rounded-2xl
            border
            border-red-200
            bg-red-50
            p-6
            text-red-700
            shadow-sm
            dark:border-red-900
            dark:bg-red-950/40
            dark:text-red-300
          "
        >
          <h2 className="text-lg font-semibold">
            Unable to load feedback
          </h2>

          <p className="mt-2">
            {message}
          </p>

          <p className="mt-3 text-sm">
            Redux role:{" "}
            <strong>
              {role || "Not found"}
            </strong>
          </p>
        </div>
      </div>
    </div>
  );
};

/* =====================================================
   LOADING
===================================================== */

const FeedbackLoading = () => {
  return (
    <div
      className="
        min-h-screen
        bg-gradient-to-r
        from-gray-200
        via-slate-50
        to-gray-200
        p-6
        dark:from-gray-950
        dark:via-gray-800
        dark:to-gray-950
      "
    >
      <div className="mx-auto max-w-7xl">
        <div
          className="
            mb-8
            h-44
            animate-pulse
            rounded-3xl
            bg-gray-300
            dark:bg-gray-700
          "
        />

        <div
          className="
            grid
            grid-cols-1
            gap-6
            xl:grid-cols-2
          "
        >
          {Array.from({ length: 4 }).map(
            (_, index) => (
              <div
                key={index}
                className="
                  h-96
                  animate-pulse
                  rounded-3xl
                  bg-gray-300
                  dark:bg-gray-700
                "
              />
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default Messages;