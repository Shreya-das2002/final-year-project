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
  ChevronRight,
  FileText,
  HeartPulse,
  Pill,
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
    }, 2 * 60 * 1000); // 2 minutes

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
  const normalizeStatus = useCallback((status?: string | null) => {
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
    (status: string) => {
      const normalizedStatus = normalizeStatus(status);

      if (normalizedStatus === "slot assigned") {
        return "bg-emerald-100 text-emerald-700";
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

  /* ================= LOGIN TOAST NOTIFICATIONS ================= */
  useEffect(() => {
    if (!appointmentList.length) return;

    const toastSessionKey = getToastSessionKey();

    if (sessionStorage.getItem(toastSessionKey)) return;

    const toastMessages: string[] = [];

    /* Today's appointment toast */
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

    /* Booking status changed toast */
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
            value="5"
            subtitle="Last uploaded 2 days ago"
            icon={<FileText size={24} />}
            bg="from-violet-500 to-purple-600"
          />

          <StatCard
            title="Prescriptions"
            value="3"
            subtitle="1 refill due soon"
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
                description="Access current and past prescriptions anytime."
                buttonText="View Prescriptions"
                onClick={() => navigate("/patient/prescriptions")}
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