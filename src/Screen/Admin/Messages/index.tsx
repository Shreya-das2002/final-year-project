import { useEffect, useMemo, useState } from "react";
import {
  FaCommentMedical,
  FaStar,
  FaUserMd,
} from "react-icons/fa";
import {
  LuStethoscope,
  LuUser,
} from "react-icons/lu";

import {
  getAllDoctorFeedbackApi,
  getAllPatientFeedbackApi,
  type DoctorFeedback,
  type PatientFeedback,
} from "../.././../services/feedbackApi";

/* =====================================================
   TYPES
===================================================== */

type AdminRole =
  | "standard admin"
  | "guest admin"
  | "";

interface StoredUser {
  role?: string;
  role_name?: string;
  user_role?: string;
  userType?: string;
  user_type_name?: string;

  data?: {
    role?: string;
    role_name?: string;
    user_role?: string;
  };

  user?: {
    role?: string;
    role_name?: string;
    user_role?: string;
  };
}

/* =====================================================
   ROLE HELPERS
===================================================== */

const normalizeRole = (
  value: unknown
): AdminRole => {
  const normalizedValue = String(value || "")
    .trim()
    .toLowerCase();

  if (normalizedValue === "standard admin") {
    return "standard admin";
  }

  if (normalizedValue === "guest admin") {
    return "guest admin";
  }

  return "";
};

const extractRoleFromObject = (
  user: StoredUser
): AdminRole => {
  return normalizeRole(
    user.role ||
      user.role_name ||
      user.user_role ||
      user.userType ||
      user.user_type_name ||
      user.data?.role ||
      user.data?.role_name ||
      user.data?.user_role ||
      user.user?.role ||
      user.user?.role_name ||
      user.user?.user_role
  );
};

const getLoggedInRole = (): AdminRole => {
  /*
   * First check directly stored role.
   */
  const directRole =
    localStorage.getItem("role") ||
    sessionStorage.getItem("role");

  if (directRole) {
    const normalizedRole =
      normalizeRole(directRole);

    if (normalizedRole) {
      return normalizedRole;
    }
  }

  /*
   * Check commonly used user-storage keys.
   * Add your own storage key here if required.
   */
  const possibleKeys = [
    "user",
    "userData",
    "authUser",
    "loginData",
    "auth",
    "loggedInUser",
  ];

  for (const key of possibleKeys) {
    const storedValue =
      localStorage.getItem(key) ||
      sessionStorage.getItem(key);

    if (!storedValue) {
      continue;
    }

    try {
      const parsedUser =
        JSON.parse(storedValue) as StoredUser;

      const role =
        extractRoleFromObject(parsedUser);

      if (role) {
        return role;
      }
    } catch {
      /*
       * The stored value may itself be the role.
       */
      const role =
        normalizeRole(storedValue);

      if (role) {
        return role;
      }
    }
  }

  return "";
};

/* =====================================================
   COMMON HELPERS
===================================================== */

const getSafeRating = (
  rating?: number | null
): number => {
  const parsedRating = Number(rating || 0);

  if (Number.isNaN(parsedRating)) {
    return 0;
  }

  return Math.max(
    0,
    Math.min(Math.round(parsedRating), 5)
  );
};

const formatDoctorName = (
  doctorName?: string | null
): string => {
  if (!doctorName) {
    return "Doctor";
  }

  const cleanName = doctorName.replace(
    /^Dr\.?\s*/i,
    ""
  );

  return `Dr. ${cleanName}`;
};

/* =====================================================
   MAIN COMPONENT
===================================================== */

const Messages = () => {
  const [role, setRole] =
    useState<AdminRole>("");

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

  const isStandardAdmin =
    role === "standard admin";

  const isGuestAdmin =
    role === "guest admin";

  useEffect(() => {
    let componentMounted = true;

    const fetchFeedbacks = async () => {
      try {
        setLoading(true);
        setErrorMessage("");

        const loggedInRole =
          getLoggedInRole();

        console.log(
          "MESSAGES PAGE ROLE:",
          loggedInRole
        );

        if (!componentMounted) {
          return;
        }

        setRole(loggedInRole);

        /* =============================================
           STANDARD ADMIN
           SHOW ONLY DOCTOR FEEDBACK
        ============================================= */

        if (
          loggedInRole ===
          "standard admin"
        ) {
          const response =
            await getAllDoctorFeedbackApi();

          if (!componentMounted) {
            return;
          }

          if (!response.data?.success) {
            setDoctorFeedbacks([]);

            setErrorMessage(
              response.data?.message ||
                "Failed to fetch doctor feedback."
            );

            return;
          }

          setDoctorFeedbacks(
            response.data.data || []
          );

          setPatientFeedbacks([]);

          return;
        }

        /* =============================================
           GUEST ADMIN
           SHOW ONLY PATIENT FEEDBACK
        ============================================= */

        if (
          loggedInRole ===
          "guest admin"
        ) {
          const response =
            await getAllPatientFeedbackApi();

          if (!componentMounted) {
            return;
          }

          if (!response.data?.success) {
            setPatientFeedbacks([]);

            setErrorMessage(
              response.data?.message ||
                "Failed to fetch patient feedback."
            );

            return;
          }

          setPatientFeedbacks(
            response.data.data || []
          );

          setDoctorFeedbacks([]);

          return;
        }

        setErrorMessage(
          "Your admin role could not be identified. Please log in again."
        );
      } catch (error) {
        console.error(
          "FETCH FEEDBACK ERROR:",
          error
        );

        if (componentMounted) {
          setErrorMessage(
            "Something went wrong while loading feedback."
          );
        }
      } finally {
        if (componentMounted) {
          setLoading(false);
        }
      }
    };

    fetchFeedbacks();

    return () => {
      componentMounted = false;
    };
  }, []);

  const feedbackCount = useMemo(() => {
    if (isStandardAdmin) {
      return doctorFeedbacks.length;
    }

    if (isGuestAdmin) {
      return patientFeedbacks.length;
    }

    return 0;
  }, [
    isStandardAdmin,
    isGuestAdmin,
    doctorFeedbacks,
    patientFeedbacks,
  ]);

  if (loading) {
    return <FeedbackLoading />;
  }

  if (errorMessage) {
    return (
      <FeedbackError
        message={errorMessage}
        role={role}
      />
    );
  }

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
        {/* =================================================
            PAGE HEADER
        ================================================= */}

        <div
          className="
            mb-8
            rounded-3xl
            bg-gradient-to-r
            from-cyan-700
            to-teal-500
            p-8
            text-white
            shadow-xl
          "
        >
          <div
            className="
              flex
              flex-col
              gap-5
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
                <h1
                  className="
                    text-3xl
                    font-bold
                    md:text-4xl
                  "
                >
                  {isStandardAdmin
                    ? "Doctor Feedback"
                    : "Patient Feedback"}
                </h1>

                <p className="mt-2 text-cyan-50">
                  {isStandardAdmin
                    ? "Review feedback submitted by registered doctors."
                    : "Review feedback submitted by registered patients."}
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
                {feedbackCount}
              </p>
            </div>
          </div>
        </div>

        {/* =================================================
            ROLE INFORMATION
        ================================================= */}

        <div
          className="
            mb-6
            flex
            flex-col
            gap-4
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
          <div className="flex items-center gap-3">
            {isStandardAdmin ? (
              <LuStethoscope
                className="
                  text-3xl
                  text-emerald-600
                  dark:text-emerald-400
                "
              />
            ) : (
              <LuUser
                className="
                  text-3xl
                  text-blue-600
                  dark:text-blue-400
                "
              />
            )}

            <div>
              <p
                className="
                  font-semibold
                  text-gray-900
                  dark:text-white
                "
              >
                Logged in as
              </p>

              <p
                className="
                  text-sm
                  capitalize
                  text-gray-500
                  dark:text-gray-400
                "
              >
                {role}
              </p>
            </div>
          </div>

          <div
            className={`
              rounded-full
              px-5
              py-2
              text-sm
              font-semibold
              ${
                isStandardAdmin
                  ? `
                    bg-emerald-100
                    text-emerald-700
                    dark:bg-emerald-950
                    dark:text-emerald-300
                  `
                  : `
                    bg-blue-100
                    text-blue-700
                    dark:bg-blue-950
                    dark:text-blue-300
                  `
              }
            `}
          >
            {isStandardAdmin
              ? "Doctor Reviews"
              : "Patient Reviews"}
          </div>
        </div>

        {/* =================================================
            STANDARD ADMIN CONTENT
        ================================================= */}

        {isStandardAdmin && (
          <DoctorFeedbackSection
            feedbacks={doctorFeedbacks}
          />
        )}

        {/* =================================================
            GUEST ADMIN CONTENT
        ================================================= */}

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
   DOCTOR FEEDBACK SECTION
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
        description="Doctor feedback will appear here after a doctor submits it."
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
        <div
          key={feedback.doctor_feedback_id}
          className="
            group
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
                  <h2
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
                  </h2>

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
                {feedback.desc ||
                  "No additional comments provided."}
                ”
              </p>
            </div>

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
                value={feedback.support_service}
              />

              <RatingItem
                label="Cooperation"
                value={feedback.p_cooperation}
              />

              <RatingItem
                label="Staff"
                value={feedback.staff}
              />
            </div>

            <div
              className="
                mt-5
                flex
                items-center
                justify-between
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
                Would recommend
              </span>

              <BooleanBadge
                value={feedback.recommendation}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

/* =====================================================
   PATIENT FEEDBACK SECTION
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
        description="Patient feedback will appear here after a patient submits it."
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
        <div
          key={feedback.patient_feedback_id}
          className="
            group
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
                  <h2
                    className="
                      text-xl
                      font-bold
                      text-gray-900
                      dark:text-white
                    "
                  >
                    {feedback.patient_name ||
                      "Patient"}
                  </h2>

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
                {feedback.desc ||
                  "No additional comments provided."}
                ”
              </p>
            </div>

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
              <div
                className="
                  flex
                  items-center
                  justify-between
                "
              >
                <span
                  className="
                    text-sm
                    text-gray-500
                    dark:text-gray-400
                  "
                >
                  Recommend
                </span>

                <BooleanBadge
                  value={feedback.recommendation}
                />
              </div>

              <div
                className="
                  flex
                  items-center
                  justify-between
                "
              >
                <span
                  className="
                    text-sm
                    text-gray-500
                    dark:text-gray-400
                  "
                >
                  Consultation
                </span>

                <BooleanBadge
                  value={feedback.consultation}
                />
              </div>
            </div>
          </div>
        </div>
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
  const rating =
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
        {rating === null
          ? "-"
          : `${rating}/5`}
      </p>
    </div>
  );
};

/* =====================================================
   BOOLEAN BADGE
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

/* =====================================================
   EMPTY FEEDBACK
===================================================== */

interface EmptyFeedbackProps {
  title: string;
  description: string;
  type: "doctor" | "patient";
}

const EmptyFeedback = ({
  title,
  description,
  type,
}: EmptyFeedbackProps) => {
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
            type === "doctor"
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
        {type === "doctor" ? (
          <FaUserMd className="text-3xl" />
        ) : (
          <LuUser className="text-3xl" />
        )}
      </div>

      <h2
        className="
          mt-5
          text-xl
          font-bold
          text-gray-900
          dark:text-white
        "
      >
        {title}
      </h2>

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
   ERROR COMPONENT
===================================================== */

interface FeedbackErrorProps {
  message: string;
  role: string;
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
            Detected role:{" "}
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
   LOADING COMPONENT
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