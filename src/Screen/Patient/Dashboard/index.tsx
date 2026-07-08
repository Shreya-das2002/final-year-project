import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import toast from "react-hot-toast";
import type { RootState, AppDispatch } from "../../../../store/store";
import { fetchAppointmentsThunk } from "../../../../store/slices/appointmentSlice";

import {
  Activity,
  Bell,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  FileText,
  HeartPulse,
  Pill,
  UserRound,
} from "lucide-react";

import { HEALTH_TIPS } from "../../../Environment";
import type { Appointment } from "../../../services/appointmentApi";

interface StatCardProps {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ReactNode;
  bg: string;
}

interface MonthwiseAppointmentData {
  month: string;
  count: number;
}

const Patientpage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const { appointments, loading } = useSelector(
    (state: RootState) => state.appointment
  );

  const user = useSelector((state: RootState) => state.auth.user);

  const [tipIndex, setTipIndex] = useState(0);

  const patientId = (user as { patient_id?: number } | null)?.patient_id;

  /* ================= HEALTH TIPS TIMER ================= */
  useEffect(() => {
    if (!HEALTH_TIPS.length) return;

    const interval = window.setInterval(() => {
      setTipIndex((prev) => (prev + 1) % HEALTH_TIPS.length);
    }, 2 * 60 * 1000);

    return () => window.clearInterval(interval);
  }, []);

  /* ================= FETCH APPOINTMENTS ================= */
  useEffect(() => {
    if (patientId) {
      dispatch(
        fetchAppointmentsThunk({
          patient_id: patientId,
        })
      );
    } else {
      dispatch(fetchAppointmentsThunk());
    }
  }, [dispatch, patientId]);

  const appointmentList = useMemo(() => {
    return Array.isArray(appointments) ? appointments : [];
  }, [appointments]);

  /* ================= HELPERS ================= */
  const normalizeStatus = useCallback((status?: string | number | null) => {
    return String(status || "")
      .toLowerCase()
      .replace(/_/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }, []);

  const getOnlyDate = useCallback((dateValue?: string | null) => {
    if (!dateValue) return null;

    const onlyDate = String(dateValue).split("T")[0];
    const parts = onlyDate.split("-");

    if (parts.length === 3) {
      const year = Number(parts[0]);
      const month = Number(parts[1]);
      const day = Number(parts[2]);

      if (!year || !month || !day) return null;

      const date = new Date(year, month - 1, day);
      date.setHours(0, 0, 0, 0);
      return date;
    }

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) return null;

    date.setHours(0, 0, 0, 0);
    return date;
  }, []);

  const today = useMemo(() => {
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    return currentDate;
  }, []);

  const isTodayDate = useCallback(
    (dateValue?: string | null) => {
      const appointmentDate = getOnlyDate(dateValue);

      if (!appointmentDate) return false;

      return appointmentDate.getTime() === today.getTime();
    },
    [getOnlyDate, today]
  );

  const getTodayKey = useCallback(() => {
    const currentDate = new Date();

    return `${currentDate.getFullYear()}-${String(
      currentDate.getMonth() + 1
    ).padStart(2, "0")}-${String(currentDate.getDate()).padStart(2, "0")}`;
  }, []);

  const getStatusStorageKey = useCallback(() => {
    return patientId
      ? `patient_appointment_status_${patientId}`
      : "patient_appointment_status";
  }, [patientId]);

  const getToastSessionKey = useCallback(() => {
    return patientId
      ? `patient_dashboard_toast_${patientId}_${getTodayKey()}`
      : `patient_dashboard_toast_${getTodayKey()}`;
  }, [patientId, getTodayKey]);

  const showToastsOneByOne = useCallback((messages: string[]) => {
    messages.forEach((message, index) => {
      window.setTimeout(() => {
        toast.success(message, {
          duration: 5000,
          position: "top-right",
        });
      }, index * 1200);
    });
  }, []);

  const getDoctorName = useCallback((appointment: Appointment) => {
    return appointment.doctor_name || "Doctor not assigned";
  }, []);

  const getSpecialization = useCallback((appointment: Appointment) => {
    return appointment.specialization
      ? String(appointment.specialization)
      : "General Consultation";
  }, []);

  const getAppointmentDate = useCallback((appointment: Appointment) => {
    return appointment.appointment_date || "-";
  }, []);

  const getAppointmentTime = useCallback((appointment: Appointment) => {
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
  }, []);

  const getAppointmentStatus = useCallback((appointment: Appointment) => {
    return appointment.booking_status || "Slot Assigned";
  }, []);

  const getStatusClass = useCallback(
    (status: string | number) => {
      const normalizedStatus = normalizeStatus(status);

      if (normalizedStatus === "slot assigned") {
        return "bg-emerald-100 text-emerald-700";
      }

      if (normalizedStatus === "booking confirmed") {
        return "bg-blue-100 text-blue-700";
      }

      if (
        normalizedStatus === "booking initiated" ||
        normalizedStatus === "pending"
      ) {
        return "bg-amber-100 text-amber-700";
      }

      if (
        normalizedStatus === "booking rejected" ||
        normalizedStatus === "canceled by doctor" ||
        normalizedStatus === "canceled by patient" ||
        normalizedStatus === "consultation missed"
      ) {
        return "bg-red-100 text-red-700";
      }

      if (
        normalizedStatus === "consultation completed" ||
        normalizedStatus === "prescription generated"
      ) {
        return "bg-violet-100 text-violet-700";
      }

      return "bg-slate-100 text-slate-700";
    },
    [normalizeStatus]
  );

  /* ================= ONLY SLOT ASSIGNED + TODAY/UPCOMING APPOINTMENTS ================= */
  const slotAssignedAppointments = useMemo(() => {
    return appointmentList
      .filter((appointment) => {
        const status = normalizeStatus(appointment.booking_status);
        const appointmentDate = getOnlyDate(appointment.appointment_date);

        return (
          status === "slot assigned" &&
          appointmentDate !== null &&
          appointmentDate >= today
        );
      })
      .sort((a, b) => {
        const dateA = getOnlyDate(a.appointment_date)?.getTime() || 0;
        const dateB = getOnlyDate(b.appointment_date)?.getTime() || 0;

        return dateA - dateB;
      });
  }, [appointmentList, normalizeStatus, getOnlyDate, today]);

  const nextAppointment = slotAssignedAppointments[0];

  const nextAppointmentSubtitle = nextAppointment
    ? `Next: ${getAppointmentDate(nextAppointment)}, ${getAppointmentTime(
        nextAppointment
      )}`
    : "No upcoming slot assigned appointment";

  /* ================= PROFILE COMPLETION ================= */
  const profileCompletion = useMemo(() => {
    const profile = (user || {}) as Record<string, unknown>;

    const fieldsToCheck = [
      "first_name",
      "last_name",
      "email",
      "phone",
      "gender",
      "dob",
      "blood_group",
      "height",
      "weight",
      "address",
    ];

    const completedFields = fieldsToCheck.filter((field) => {
      const value = profile[field];

      if (Array.isArray(value)) return value.length > 0;

      return value !== undefined && value !== null && String(value).trim() !== "";
    });

    return Math.round((completedFields.length / fieldsToCheck.length) * 100);
  }, [user]);

  /* ================= ACKNOWLEDGEMENT SLIPS ================= */
  const prescriptionCount = useMemo(() => {
    return appointmentList.filter((appointment) =>
      Boolean(appointment.prescription)
    ).length;
  }, [appointmentList]);

  const reportCount = 5;

  /* ================= ALL APPOINTMENTS MONTH-WISE LINE GRAPH ================= */
  const monthwiseAppointmentData = useMemo<MonthwiseAppointmentData[]>(() => {
    const monthMap = new Map<string, number>();

    appointmentList.forEach((appointment) => {
      const appointmentDate = getOnlyDate(appointment.appointment_date);

      if (!appointmentDate) return;

      const monthKey = appointmentDate.toLocaleString("default", {
        month: "short",
        year: "2-digit",
      });

      monthMap.set(monthKey, (monthMap.get(monthKey) || 0) + 1);
    });

    return Array.from(monthMap.entries()).map(([month, count]) => ({
      month,
      count,
    }));
  }, [appointmentList, getOnlyDate]);

  /* ================= LOGIN TOAST NOTIFICATIONS ================= */
  useEffect(() => {
    if (!appointmentList.length) return;

    const toastSessionKey = getToastSessionKey();

    if (sessionStorage.getItem(toastSessionKey)) return;

    const toastMessages: string[] = [];

    const todaysAppointments = slotAssignedAppointments.filter((appointment) =>
      isTodayDate(appointment.appointment_date)
    );

    todaysAppointments.forEach((appointment) => {
      toastMessages.push(
        `Today's appointment: ${getDoctorName(
          appointment
        )} at ${getAppointmentTime(appointment)}`
      );
    });

    const statusStorageKey = getStatusStorageKey();

    const oldStatusData = localStorage.getItem(statusStorageKey);

    let oldStatuses: Record<string, string> = {};

    try {
      oldStatuses = oldStatusData ? JSON.parse(oldStatusData) : {};
    } catch {
      oldStatuses = {};
    }

    const latestStatuses: Record<string, string> = {};

    appointmentList.forEach((appointment) => {
      const appointmentId = String(appointment.appointment_id);
      const currentStatus = appointment.booking_status || "";

      latestStatuses[appointmentId] = currentStatus;

      const previousStatus = oldStatuses[appointmentId];

      if (previousStatus && previousStatus !== currentStatus) {
        toastMessages.push(
          `Appointment status changed: ${getDoctorName(
            appointment
          )} changed from "${previousStatus}" to "${currentStatus}"`
        );
      }
    });

    localStorage.setItem(statusStorageKey, JSON.stringify(latestStatuses));

    if (toastMessages.length > 0) {
      showToastsOneByOne(toastMessages);
    }

    sessionStorage.setItem(toastSessionKey, "true");
  }, [
    appointmentList,
    slotAssignedAppointments,
    getToastSessionKey,
    getStatusStorageKey,
    isTodayDate,
    getDoctorName,
    getAppointmentTime,
    showToastsOneByOne,
  ]);

  return (
    <div className="min-h-screen flex-1 p-6 bg-gradient-to-r from-slate-300 via-cyan-100 to-slate-300 dark:from-cyan-900 dark:via-slate-700 dark:to-cyan-900 md:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Top Header */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-cyan-700 dark:text-gray-300">
              Welcome Back, {user?.first_name || "Patient"}
            </h2>
          </div>
        </section>

        {/* Stats */}
        <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Upcoming Appointments"
            value={String(slotAssignedAppointments.length)}
            subtitle={nextAppointmentSubtitle}
            icon={<CalendarDays size={24} />}
            bg="from-blue-500 to-indigo-600"
          />

          <StatCard
            title="Total Appointments"
            value={String(appointmentList.length)}
            subtitle="All consultations booked"
            icon={<CalendarDays size={24} />}
            bg="from-rose-500 to-red-600"
          />

          <StatCard
            title="Recent Reports"
            value={String(reportCount)}
            subtitle="Acknowledgement slips"
            icon={<FileText size={24} />}
            bg="from-violet-500 to-purple-600"
          />

          <StatCard
            title="Prescriptions"
            value={String(prescriptionCount)}
            subtitle="Available from appointments"
            icon={<Pill size={24} />}
            bg="from-orange-500 to-amber-500"
          />

          <StatCard
            title="AI Interactions"
            value="12"
            subtitle="SymptoBot chats this month"
            icon={<Activity size={24} />}
            bg="from-emerald-500 to-green-600"
          />
        </section>

        {/* Main Grid */}
        <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Left/Main Content */}
          <div className="space-y-6 lg:col-span-2">
            {/* Appointments */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-5 flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">
                    Upcoming Appointments
                  </h2>
                  <p className="text-sm text-slate-500">
                    Only today and upcoming slot assigned appointments are shown
                    here.
                  </p>
                </div>

                <button
                  onClick={() => navigate("/patient/my_appointments")}
                  className="hidden rounded-xl bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-700 md:block"
                >
                  View All
                </button>
              </div>

              {loading ? (
                <div className="rounded-2xl border border-slate-200 p-6 text-center text-slate-500">
                  Loading appointments...
                </div>
              ) : slotAssignedAppointments.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center">
                  <CalendarDays
                    size={36}
                    className="mx-auto mb-3 text-slate-400"
                  />

                  <h3 className="font-semibold text-slate-800">
                    No upcoming slot assigned appointments
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    You do not have any slot assigned consultations for today or
                    upcoming dates.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {slotAssignedAppointments.slice(0, 3).map((appointment) => {
                    const doctorName = getDoctorName(appointment);
                    const specialization = getSpecialization(appointment);
                    const appointmentDate = getAppointmentDate(appointment);
                    const appointmentTime = getAppointmentTime(appointment);
                    const appointmentStatus = getAppointmentStatus(appointment);

                    return (
                      <div
                        key={appointment.appointment_id}
                        className="rounded-2xl border border-slate-200 p-4 transition hover:border-teal-300 hover:bg-teal-50/40"
                      >
                        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                          <div className="flex items-center gap-4">
                            <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl bg-teal-100 text-lg font-bold text-teal-700">
                              {appointment.doctor_avatar ? (
                                <img
                                  src={appointment.doctor_avatar}
                                  alt={doctorName}
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                doctorName.charAt(0).toUpperCase()
                              )}
                            </div>

                            <div>
                              <h3 className="font-semibold text-slate-900">
                                {doctorName}
                              </h3>

                              <p className="text-sm text-slate-500">
                                {specialization}
                              </p>

                              <div className="mt-2 flex flex-wrap gap-2 text-xs">
                                <span className="rounded-full bg-blue-50 px-3 py-1 text-blue-700">
                                  {appointmentDate}
                                </span>

                                <span className="rounded-full bg-cyan-50 px-3 py-1 text-cyan-700">
                                  {appointmentTime}
                                </span>

                                {appointment.doc_slot && (
                                  <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-700">
                                    {appointment.doc_slot}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <span
                              className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusClass(
                                appointmentStatus
                              )}`}
                            >
                              {appointmentStatus}
                            </span>

                            <button
                              onClick={() =>
                                navigate(
                                  `/patient/my_appointments/booking_details/${appointment.appointment_id}`,
                                  { state: appointment }
                                )
                              }
                              className="rounded-xl bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-700"
                            >
                              Details
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* All Appointments Line Graph */}
            <MonthwiseAppointmentGraph data={monthwiseAppointmentData} />

            {/* Reports and Prescriptions */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <InfoCard
                icon={<FileText size={22} />}
                title="Medical Reports"
                description="View uploaded lab reports, diagnostic files, and history."
                buttonText="View Reports"
                onClick={() => navigate("/patient/reports")}
              />

              <InfoCard
                icon={<Pill size={22} />}
                title="Prescriptions"
                description="Access prescriptions from appointment details."
                buttonText="View Appointments"
                onClick={() => navigate("/patient/my_appointments")}
              />
            </div>

            {/* Health Tip */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-3 flex items-center gap-3">
                <div className="rounded-xl bg-emerald-100 p-3 text-emerald-700">
                  <HeartPulse size={22} />
                </div>

                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    Daily Health Tip
                  </h2>

                  <p className="text-sm text-slate-500">
                    Small tips can help maintain your health.
                  </p>
                </div>
              </div>

              <p className="leading-7 text-slate-600">
                {HEALTH_TIPS.length
                  ? HEALTH_TIPS[tipIndex]
                  : "Stay healthy and take care of yourself daily."}
              </p>

              <p className="mt-3 text-xs text-slate-400">
                Tip changes automatically every 2 minutes.
              </p>
            </div>
          </div>

          {/* Right Sidebar */}
          <aside className="space-y-6">
            <ProfileCompletionCard
              percentage={profileCompletion}
              onClick={() => navigate("/patient/profile")}
            />

            <AcknowledgementSlipsCard
              reportCount={reportCount}
              prescriptionCount={prescriptionCount}
              onReportsClick={() => navigate("/patient/reports")}
              onPrescriptionClick={() => navigate("/patient/my_appointments")}
            />

            {/* Notification */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-900">
                  Notifications
                </h2>

                <button className="rounded-xl bg-slate-100 p-2 text-slate-700 hover:bg-slate-200">
                  <Bell size={18} />
                </button>
              </div>

              <div className="space-y-3">
                <NotificationItem
                  title="Appointment Status"
                  description={
                    nextAppointment
                      ? `Your appointment with ${getDoctorName(
                          nextAppointment
                        )} is ${getAppointmentStatus(nextAppointment)}.`
                      : "No upcoming slot assigned appointment notification."
                  }
                />

                <NotificationItem
                  title="Report Uploaded"
                  description="Your latest blood report is available."
                />

                <NotificationItem
                  title="Medicine Reminder"
                  description="Afternoon tablet is pending."
                />
              </div>
            </div>
          </aside>
        </section>
      </div>
    </div>
  );
};

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  bg,
}) => (
  <div
    className={`rounded-3xl bg-gradient-to-r ${bg} p-6 text-white shadow-md`}
  >
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm font-medium text-white/90">{title}</p>
        <h3 className="mt-3 text-4xl font-bold tracking-tight">{value}</h3>
        <p className="mt-2 text-sm text-white/85">{subtitle}</p>
      </div>

      <div className="rounded-2xl bg-white/20 p-3 backdrop-blur-sm">
        {icon}
      </div>
    </div>
  </div>
);

const ProfileCompletionCard = ({
  percentage,
  onClick,
}: {
  percentage: number;
  onClick: () => void;
}) => {
  const safePercentage = Math.min(Math.max(percentage, 0), 100);

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            Profile Completion
          </h2>
          <p className="text-sm text-slate-500">
            Complete your medical profile
          </p>
        </div>

        <div className="rounded-xl bg-teal-100 p-3 text-teal-700">
          <UserRound size={20} />
        </div>
      </div>

      <div className="flex justify-center">
        <div className="relative flex h-36 w-36 items-center justify-center">
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: `conic-gradient(#0f766e ${
                safePercentage * 3.6
              }deg, #e2e8f0 0deg)`,
            }}
          />

          <div className="absolute inset-4 rounded-full bg-white shadow-inner" />

          <div className="relative text-center">
            <h3 className="text-3xl font-bold text-slate-900">
              {safePercentage}%
            </h3>
            <p className="text-xs text-slate-500">Completed</p>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={onClick}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-teal-600 px-4 py-3 text-sm font-semibold text-white hover:bg-teal-700"
      >
        Complete Profile
        <ChevronRight size={16} />
      </button>
    </div>
  );
};

const AcknowledgementSlipsCard = ({
  reportCount,
  prescriptionCount,
  onReportsClick,
  onPrescriptionClick,
}: {
  reportCount: number;
  prescriptionCount: number;
  onReportsClick: () => void;
  onPrescriptionClick: () => void;
}) => (
  <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
    <div className="mb-5 flex items-center justify-between">
      <div>
        <h2 className="text-xl font-bold text-slate-900">
          Acknowledgement Slips
        </h2>
        <p className="text-sm text-slate-500">
          Reports and prescription receipts
        </p>
      </div>

      <div className="rounded-xl bg-indigo-100 p-3 text-indigo-700">
        <ClipboardList size={20} />
      </div>
    </div>

    <div className="space-y-3">
      <SlipItem
        icon={<FileText size={18} />}
        title="Report Slips"
        count={reportCount}
        buttonText="View Reports"
        onClick={onReportsClick}
      />

      <SlipItem
        icon={<Pill size={18} />}
        title="Prescription Slips"
        count={prescriptionCount}
        buttonText="View Appointments"
        onClick={onPrescriptionClick}
      />
    </div>
  </div>
);

const SlipItem = ({
  icon,
  title,
  count,
  buttonText,
  onClick,
}: {
  icon: React.ReactNode;
  title: string;
  count: number;
  buttonText: string;
  onClick: () => void;
}) => (
  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <div className="rounded-xl bg-white p-2 text-teal-700 shadow-sm">
          {icon}
        </div>

        <div>
          <p className="font-semibold text-slate-900">{title}</p>
          <p className="text-xs text-slate-500">{count} available</p>
        </div>
      </div>

      <CheckCircle2 size={18} className="text-emerald-600" />
    </div>

    <button
      type="button"
      onClick={onClick}
      className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-teal-700 shadow-sm hover:bg-teal-50"
    >
      {buttonText}
      <ChevronRight size={14} />
    </button>
  </div>
);

const MonthwiseAppointmentGraph = ({
  data,
}: {
  data: MonthwiseAppointmentData[];
}) => {
  const sortedData = [...data];

  const maxCount = Math.max(...sortedData.map((item) => item.count), 1);
  const totalAppointments = sortedData.reduce(
    (sum, item) => sum + item.count,
    0
  );

  const average =
    sortedData.length > 0
      ? Math.round(totalAppointments / sortedData.length)
      : 0;

  const chartWidth = Math.max(sortedData.length * 90, 700);
  const chartHeight = 260;
  const paddingTop = 30;
  const paddingBottom = 45;
  const paddingLeft = 45;
  const paddingRight = 30;

  const graphHeight = chartHeight - paddingTop - paddingBottom;
  const graphWidth = chartWidth - paddingLeft - paddingRight;

  const getX = (index: number) => {
    if (sortedData.length === 1) return paddingLeft + graphWidth / 2;

    return paddingLeft + (index / (sortedData.length - 1)) * graphWidth;
  };

  const getY = (count: number) => {
    return paddingTop + graphHeight - (count / maxCount) * graphHeight;
  };

  const linePath = sortedData
    .map((item, index) => {
      const x = getX(index);
      const y = getY(item.count);

      return `${index === 0 ? "M" : "L"} ${x} ${y}`;
    })
    .join(" ");

  const areaPath =
    sortedData.length > 0
      ? `${linePath} L ${getX(sortedData.length - 1)} ${
          paddingTop + graphHeight
        } L ${getX(0)} ${paddingTop + graphHeight} Z`
      : "";

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-teal-600">
            Appointment Trend
          </p>

          <h2 className="mt-1 text-2xl font-bold text-slate-900">
            All Appointments Graph
          </h2>

          <p className="text-sm text-slate-500">
            Month-wise appointment trend with total and average comparison
          </p>
        </div>

        <div className="rounded-2xl bg-blue-50 px-4 py-3 text-right">
          <p className="text-xs font-semibold text-slate-500">
            Total Appointments
          </p>
          <p className="text-2xl font-bold text-slate-900">
            {totalAppointments}
          </p>
        </div>
      </div>

      {sortedData.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500">
          No appointment data available for graph.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <div
            className="relative"
            style={{
              width: `${chartWidth}px`,
              minWidth: "100%",
            }}
          >
            {/* Average Bars */}
            <div className="mb-4 flex items-end gap-4 pl-10">
              <div className="text-center">
                <p className="mb-2 text-xs font-semibold text-slate-500">
                  Average
                </p>

                <div className="flex h-24 items-end gap-2">
                  <div
                    className="w-10 rounded-t-xl bg-cyan-300"
                    style={{
                      height: `${Math.max(
                        (average / maxCount) * 100,
                        10
                      )}%`,
                    }}
                  />

                  <div
                    className="w-10 rounded-t-xl bg-violet-300"
                    style={{
                      height: `${Math.max(
                        (totalAppointments / maxCount / sortedData.length) *
                          100,
                        10
                      )}%`,
                    }}
                  />
                </div>
              </div>

              <div className="pb-3">
                <p className="text-sm font-semibold text-slate-700">
                  Appointments are shown month-wise.
                </p>
                <p className="text-xs text-slate-500">
                  Blue line represents appointment volume trend.
                </p>
              </div>
            </div>

            {/* SVG Line Chart */}
            <svg
              width={chartWidth}
              height={chartHeight}
              className="overflow-visible"
            >
              <defs>
                <linearGradient
                  id="appointmentAreaGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              {[0, 25, 50, 75, 100].map((percent) => {
                const y =
                  paddingTop + graphHeight - (percent / 100) * graphHeight;

                return (
                  <g key={percent}>
                    <line
                      x1={paddingLeft}
                      x2={chartWidth - paddingRight}
                      y1={y}
                      y2={y}
                      stroke="#e2e8f0"
                      strokeDasharray="4 4"
                    />

                    <text
                      x={10}
                      y={y + 4}
                      className="fill-slate-400 text-[11px]"
                    >
                      {Math.round((maxCount * percent) / 100)}
                    </text>
                  </g>
                );
              })}

              {/* Area */}
              <path d={areaPath} fill="url(#appointmentAreaGradient)" />

              {/* Line */}
              <path
                d={linePath}
                fill="none"
                stroke="#0891b2"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Points and Labels */}
              {sortedData.map((item, index) => {
                const x = getX(index);
                const y = getY(item.count);

                return (
                  <g key={item.month}>
                    <circle
                      cx={x}
                      cy={y}
                      r="6"
                      fill="#ffffff"
                      stroke="#0891b2"
                      strokeWidth="3"
                    />

                    <text
                      x={x}
                      y={y - 12}
                      textAnchor="middle"
                      className="fill-slate-700 text-[12px] font-semibold"
                    >
                      {item.count}
                    </text>

                    <text
                      x={x}
                      y={chartHeight - 14}
                      textAnchor="middle"
                      className="fill-slate-500 text-[12px] font-semibold"
                    >
                      {item.month}
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* Legend */}
            <div className="mt-3 flex flex-wrap items-center gap-5 rounded-2xl bg-slate-50 px-4 py-3">
              <div className="flex items-center gap-2">
                <span className="h-3 w-8 rounded-full bg-cyan-600" />
                <span className="text-xs font-semibold text-slate-600">
                  Appointment Trend
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded bg-cyan-300" />
                <span className="text-xs font-semibold text-slate-600">
                  Average: {average}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded bg-violet-300" />
                <span className="text-xs font-semibold text-slate-600">
                  Total: {totalAppointments}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const InfoCard = ({
  icon,
  title,
  description,
  buttonText,
  onClick,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  buttonText: string;
  onClick?: () => void;
}) => (
  <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-100 text-teal-700">
      {icon}
    </div>

    <h3 className="text-lg font-bold text-slate-900">{title}</h3>

    <p className="mt-2 text-sm leading-6 text-slate-500">{description}</p>

    <button
      type="button"
      onClick={onClick}
      className="mt-5 inline-flex items-center gap-2 rounded-xl bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-700"
    >
      {buttonText}
      <ChevronRight size={16} />
    </button>
  </div>
);

const NotificationItem = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => (
  <div className="rounded-2xl bg-slate-50 p-4">
    <p className="font-semibold text-slate-900">{title}</p>
    <p className="mt-1 text-sm text-slate-500">{description}</p>
  </div>
);

export default Patientpage;