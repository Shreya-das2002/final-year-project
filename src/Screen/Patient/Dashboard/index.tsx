import { useCallback, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import toast from "react-hot-toast";

import type { RootState, AppDispatch } from "../../../../store/store";
import { fetchAppointmentsThunk } from "../../../../store/slices/appointmentSlice";

import {
  Activity,
  BarChart3,
  Bell,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock,
  FileText,
  HeartPulse,
  Pill,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  UserRound,
} from "lucide-react";

import { HEALTH_TIPS } from "../../../Environment";
import type { Appointment } from "../../../services/appointmentApi";

interface StatCardProps {
  title: string;
  value: string;
  subtitle: string;
  icon: ReactNode;
  bg: string;
  iconBg: string;
  glow: string;
}

interface MonthwiseAppointmentData {
  month: string;
  count: number;
  sortValue: number;
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

  useEffect(() => {
    if (!HEALTH_TIPS.length) return;

    const interval = window.setInterval(() => {
      setTipIndex((prev) => (prev + 1) % HEALTH_TIPS.length);
    }, 2 * 60 * 1000);

    return () => window.clearInterval(interval);
  }, []);

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
        return "bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200";
      }

      if (normalizedStatus === "booking confirmed") {
        return "bg-blue-100 text-blue-700 ring-1 ring-blue-200";
      }

      if (
        normalizedStatus === "booking initiated" ||
        normalizedStatus === "pending"
      ) {
        return "bg-amber-100 text-amber-700 ring-1 ring-amber-200";
      }

      if (
        normalizedStatus === "booking rejected" ||
        normalizedStatus === "canceled by doctor" ||
        normalizedStatus === "canceled by patient" ||
        normalizedStatus === "consultation missed"
      ) {
        return "bg-red-100 text-red-700 ring-1 ring-red-200";
      }

      if (
        normalizedStatus === "consultation completed" ||
        normalizedStatus === "prescription generated"
      ) {
        return "bg-violet-100 text-violet-700 ring-1 ring-violet-200";
      }

      return "bg-slate-100 text-slate-700 ring-1 ring-slate-200";
    },
    [normalizeStatus]
  );

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
    ? `${getAppointmentDate(nextAppointment)} • ${getAppointmentTime(
        nextAppointment
      )}`
    : "No upcoming slot assigned appointment";

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

  const prescriptionCount = useMemo(() => {
    return appointmentList.filter((appointment) =>
      Boolean(appointment.prescription)
    ).length;
  }, [appointmentList]);

  const completedCount = useMemo(() => {
    return appointmentList.filter((appointment) => {
      const status = normalizeStatus(appointment.booking_status);

      return (
        status === "consultation completed" ||
        status === "prescription generated"
      );
    }).length;
  }, [appointmentList, normalizeStatus]);

  const pendingCount = useMemo(() => {
    return appointmentList.filter((appointment) => {
      const status = normalizeStatus(appointment.booking_status);
      return status === "booking initiated" || status === "pending";
    }).length;
  }, [appointmentList, normalizeStatus]);

  const reportCount = 5;

  const monthwiseAppointmentData = useMemo<MonthwiseAppointmentData[]>(() => {
    const monthMap = new Map<string, { count: number; sortValue: number }>();

    appointmentList.forEach((appointment) => {
      const appointmentDate = getOnlyDate(appointment.appointment_date);

      if (!appointmentDate) return;

      const monthKey = appointmentDate.toLocaleString("default", {
        month: "short",
        year: "2-digit",
      });

      const sortValue =
        appointmentDate.getFullYear() * 100 + appointmentDate.getMonth();

      const existing = monthMap.get(monthKey);

      monthMap.set(monthKey, {
        count: existing ? existing.count + 1 : 1,
        sortValue,
      });
    });

    return Array.from(monthMap.entries())
      .map(([month, value]) => ({
        month,
        count: value.count,
        sortValue: value.sortValue,
      }))
      .sort((a, b) => a.sortValue - b.sortValue);
  }, [appointmentList, getOnlyDate]);

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
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-sky-50 to-indigo-100 p-4 dark:from-slate-950 dark:via-cyan-950 dark:to-slate-950 md:p-6 lg:p-8">
      <div className="mx-auto max-w-[1600px] space-y-6">
        {/* TOP WELCOME CARD */}
        <section className="relative overflow-hidden rounded-[30px] bg-gradient-to-r from-cyan-700 via-teal-600 to-indigo-800 p-6 text-white shadow-xl shadow-cyan-900/20 md:p-7">
          <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute -bottom-24 left-1/3 h-64 w-64 rounded-full bg-cyan-300/20 blur-3xl" />

          <div className="relative grid grid-cols-1 gap-6 xl:grid-cols-12 xl:items-center">
            <div className="xl:col-span-8">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-semibold backdrop-blur">
                <Sparkles size={16} />
                Patient Health Dashboard
              </div>

              <h1 className="text-3xl font-extrabold tracking-tight md:text-5xl">
                Welcome back, {user?.first_name || "Patient"}
              </h1>

              <p className="mt-3 max-w-3xl text-sm leading-6 text-cyan-50 md:text-base">
                Track appointments, prescriptions, reports, health tips, and
                profile completion from one colorful care workspace.
              </p>

              <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
                <DashboardMiniInfo
                  label="Upcoming"
                  value={String(slotAssignedAppointments.length)}
                  icon={<CalendarDays size={18} />}
                />

                <DashboardMiniInfo
                  label="Completed"
                  value={String(completedCount)}
                  icon={<CheckCircle2 size={18} />}
                />

                <DashboardMiniInfo
                  label="Pending"
                  value={String(pendingCount)}
                  icon={<Activity size={18} />}
                />
              </div>
            </div>

            <div className="xl:col-span-4">
              <CompactProfileCompletionCard
                percentage={profileCompletion}
                onClick={() => navigate("/patient/profile")}
              />
            </div>
          </div>
        </section>

        {/* KPI CARDS */}
        <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-5">
          <StatCard
            title="Upcoming"
            value={String(slotAssignedAppointments.length)}
            subtitle={nextAppointmentSubtitle}
            icon={<CalendarDays size={22} />}
            bg="from-cyan-400 via-sky-500 to-blue-700"
            iconBg="bg-white/20"
            glow="shadow-blue-500/25"
          />

          <StatCard
            title="Total Visits"
            value={String(appointmentList.length)}
            subtitle="All booked consultations"
            icon={<Stethoscope size={22} />}
            bg="from-fuchsia-500 via-rose-500 to-red-600"
            iconBg="bg-white/20"
            glow="shadow-rose-500/25"
          />

          <StatCard
            title="Reports"
            value={String(reportCount)}
            subtitle="Acknowledgement slips"
            icon={<FileText size={22} />}
            bg="from-indigo-500 via-purple-500 to-pink-600"
            iconBg="bg-white/20"
            glow="shadow-purple-500/25"
          />

          <StatCard
            title="Prescriptions"
            value={String(prescriptionCount)}
            subtitle="From appointment details"
            icon={<Pill size={22} />}
            bg="from-amber-400 via-orange-500 to-red-500"
            iconBg="bg-white/20"
            glow="shadow-orange-500/25"
          />

          <StatCard
            title="AI Interactions"
            value="12"
            subtitle="SymptoBot chats this month"
            icon={<Activity size={22} />}
            bg="from-emerald-400 via-teal-500 to-cyan-700"
            iconBg="bg-white/20"
            glow="shadow-emerald-500/25"
          />
        </section>

        {/* MAIN GRID */}
        <section className="grid grid-cols-1 items-start gap-6 xl:grid-cols-12">
          <div className="space-y-6 xl:col-span-8">
            <AppointmentsPanel
              loading={loading}
              appointments={slotAssignedAppointments}
              getDoctorName={getDoctorName}
              getSpecialization={getSpecialization}
              getAppointmentDate={getAppointmentDate}
              getAppointmentTime={getAppointmentTime}
              getAppointmentStatus={getAppointmentStatus}
              getStatusClass={getStatusClass}
              navigate={navigate}
            />

            <MonthwiseAppointmentGraph data={monthwiseAppointmentData} />
          </div>

          <aside className="space-y-6 xl:col-span-4 xl:pt-0">
            <NotificationPanel
              nextAppointment={nextAppointment}
              getDoctorName={getDoctorName}
              getAppointmentStatus={getAppointmentStatus}
            />

            <HealthTipCard
              tip={
                HEALTH_TIPS.length
                  ? HEALTH_TIPS[tipIndex]
                  : "Stay healthy and take care of yourself daily."
              }
            />
          </aside>
        </section>

        {/* QUICK ACTIONS + SECURITY SAME ROW */}
        <section className="grid grid-cols-1 items-stretch gap-6 xl:grid-cols-12">
          <div className="grid grid-cols-1 items-stretch gap-5 md:grid-cols-3 xl:col-span-8">
            <QuickActionCard
              icon={<FileText size={22} />}
              title="Acknowledgement Slip"
              description="Download or view your hospital visit acknowledgement slip."
              buttonText="View"
              onClick={() => navigate("/patient/my_appointments")}
              color="from-cyan-400 via-sky-500 to-blue-700"
            />

            <QuickActionCard
              icon={<FileText size={22} />}
              title="Medical Reports"
              description="View diagnostic reports and medical history."
              buttonText="View Reports"
              onClick={() => navigate("/patient/reports")}
              color="from-indigo-500 via-purple-500 to-pink-600"
            />

            <QuickActionCard
              icon={<Pill size={22} />}
              title="Prescriptions"
              description="Access prescriptions from your visits."
              buttonText="View"
              onClick={() => navigate("/patient/my_appointments")}
              color="from-amber-400 via-orange-500 to-red-500"
            />
          </div>

          <div className="xl:col-span-4">
            <SecurityCard />
          </div>
        </section>
      </div>
    </div>
  );
};

const DashboardMiniInfo = ({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: ReactNode;
}) => (
  <div className="rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur">
    <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-white/20">
      {icon}
    </div>

    <p className="text-xs font-semibold text-white/75">{label}</p>
    <p className="mt-1 text-2xl font-extrabold text-white">{value}</p>
  </div>
);

const CompactProfileCompletionCard = ({
  percentage,
  onClick,
}: {
  percentage: number;
  onClick: () => void;
}) => {
  const safePercentage = Math.min(Math.max(percentage, 0), 100);

  return (
    <div className="rounded-[26px] border border-white/25 bg-white/10 p-5 shadow-lg backdrop-blur-xl">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-white/85">
            Profile Completion
          </p>

          <h3 className="mt-1 text-3xl font-extrabold text-white">
            {safePercentage}%
          </h3>
        </div>

        <div className="rounded-2xl bg-white/20 p-3 text-white">
          <UserRound size={22} />
        </div>
      </div>

      <div className="flex items-center gap-5">
        <div className="relative flex h-28 w-28 shrink-0 items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-white/25" />

          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: `conic-gradient(
                #22d3ee 0deg,
                #38bdf8 ${safePercentage * 1.1}deg,
                #a78bfa ${safePercentage * 2.1}deg,
                #f472b6 ${safePercentage * 3}deg,
                #facc15 ${safePercentage * 3.6}deg,
                rgba(255,255,255,0.22) 0deg
              )`,
            }}
          />

          <div className="absolute inset-[14px] rounded-full bg-gray-300" />

          <div className="relative text-center">
            <h4 className="text-2xl font-extrabold text-white">
              {safePercentage}%
            </h4>
            <p className="text-[10px] font-semibold text-white/75">Done</p>
          </div>
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-sm leading-6 text-white/80">
            Complete your health profile to improve appointment and care
            recommendations.
          </p>

          <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-white/20">
            <div
              className="h-full rounded-full bg-gradient-to-r from-cyan-300 via-violet-300 to-pink-300"
              style={{
                width: `${safePercentage}%`,
              }}
            />
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={onClick}
        className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-bold text-cyan-800 shadow-md transition hover:-translate-y-0.5 hover:bg-cyan-50"
      >
        Complete Profile
        <ChevronRight size={16} />
      </button>
    </div>
  );
};

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  bg,
  iconBg,
  glow,
}) => (
  <div
    className={`relative min-h-[190px] overflow-hidden rounded-[28px] bg-gradient-to-br ${bg} p-6 text-white shadow-xl ${glow} transition duration-300 hover:-translate-y-1 hover:shadow-2xl`}
  >
    <div className="absolute -right-7 -top-7 h-28 w-28 rounded-full bg-white/18" />
    <div className="absolute right-4 top-9 h-20 w-20 rounded-full bg-white/10" />
    <div className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-white/12" />

    <div className="relative flex h-full flex-col justify-between">
      <div className="flex items-start justify-between gap-4">
        <p className="text-base font-bold text-white">{title}</p>

        <div className={`rounded-2xl ${iconBg} p-3 backdrop-blur-sm`}>
          {icon}
        </div>
      </div>

      <div className="mt-5">
        <h3 className="text-5xl font-extrabold tracking-tight">{value}</h3>

        <p className="mt-3 line-clamp-2 text-sm leading-6 text-white/90">
          {subtitle}
        </p>
      </div>
    </div>
  </div>
);

const AppointmentsPanel = ({
  loading,
  appointments,
  getDoctorName,
  getSpecialization,
  getAppointmentDate,
  getAppointmentTime,
  getAppointmentStatus,
  getStatusClass,
  navigate,
}: {
  loading: boolean;
  appointments: Appointment[];
  getDoctorName: (appointment: Appointment) => string;
  getSpecialization: (appointment: Appointment) => string;
  getAppointmentDate: (appointment: Appointment) => string;
  getAppointmentTime: (appointment: Appointment) => string;
  getAppointmentStatus: (appointment: Appointment) => string | number;
  getStatusClass: (status: string | number) => string;
  navigate: ReturnType<typeof useNavigate>;
}) => (
  <div className="rounded-[28px] border border-white/70 bg-white/90 p-6 shadow-xl shadow-cyan-900/5 backdrop-blur dark:border-slate-800 dark:bg-slate-900">
    <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-cyan-700">
          Care Schedule
        </p>

        <h2 className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">
          Upcoming Appointments
        </h2>

        <p className="text-sm text-slate-500 dark:text-slate-400">
          Today and future slot-assigned appointments.
        </p>
      </div>

      <button
        onClick={() => navigate("/patient/my_appointments")}
        className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-600 to-teal-600 px-5 py-3 text-sm font-bold text-white shadow-md transition hover:-translate-y-0.5 hover:from-cyan-700 hover:to-teal-700"
      >
        View All
        <ChevronRight size={16} />
      </button>
    </div>

    {loading ? (
      <div className="rounded-3xl border border-cyan-100 bg-cyan-50 p-8 text-center text-cyan-700">
        Loading appointments...
      </div>
    ) : appointments.length === 0 ? (
      <EmptyState
        icon={<CalendarDays size={38} />}
        title="No upcoming appointments"
        description="You do not have any slot assigned consultations for today or upcoming dates."
        buttonText="Book Appointment"
        onClick={() => navigate("/patient/appointments/")}
      />
    ) : (
      <div className="space-y-4">
        {appointments.slice(0, 4).map((appointment) => {
          const doctorName = getDoctorName(appointment);
          const specialization = getSpecialization(appointment);
          const appointmentDate = getAppointmentDate(appointment);
          const appointmentTime = getAppointmentTime(appointment);
          const appointmentStatus = getAppointmentStatus(appointment);

          return (
            <AppointmentCard
              key={appointment.appointment_id}
              appointment={appointment}
              doctorName={doctorName}
              specialization={specialization}
              appointmentDate={appointmentDate}
              appointmentTime={appointmentTime}
              appointmentStatus={appointmentStatus}
              statusClass={getStatusClass(appointmentStatus)}
              onDetails={() =>
                navigate(
                  `/patient/my_appointments/booking_details/${appointment.appointment_id}`,
                  { state: appointment }
                )
              }
            />
          );
        })}
      </div>
    )}
  </div>
);

const getDoctorInitials = (doctorName: string) => {
  if (!doctorName || doctorName === "Doctor not assigned") return "DR";

  const nameParts = doctorName.trim().split(/\s+/);

  if (nameParts.length === 1) {
    return nameParts[0].charAt(0).toUpperCase();
  }

  const firstNameInitial = nameParts[0].charAt(0).toUpperCase();
  const lastNameInitial = nameParts[nameParts.length - 1]
    .charAt(0)
    .toUpperCase();

  return `${firstNameInitial}${lastNameInitial}`;
};

const AppointmentCard = ({
  appointment,
  doctorName,
  specialization,
  appointmentDate,
  appointmentTime,
  appointmentStatus,
  statusClass,
  onDetails,
}: {
  appointment: Appointment;
  doctorName: string;
  specialization: string;
  appointmentDate: string;
  appointmentTime: string;
  appointmentStatus: string | number;
  statusClass: string;
  onDetails: () => void;
}) => (
  <div className="rounded-3xl border border-cyan-100 bg-gradient-to-r from-cyan-50 via-white to-blue-50 p-4 transition hover:-translate-y-0.5 hover:border-cyan-300 hover:shadow-md dark:border-slate-700 dark:from-slate-800 dark:via-slate-800 dark:to-slate-900">
    <div className="flex flex-col gap-4 2xl:flex-row 2xl:items-center 2xl:justify-between">
      <div className="flex items-start gap-4">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-3xl bg-gradient-to-br from-cyan-600 to-teal-500 text-xl font-bold text-white shadow-md">
        {getDoctorInitials(doctorName)}
        </div>

        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            {doctorName}
          </h3>

          <p className="text-sm text-slate-500 dark:text-slate-400">
            {specialization}
          </p>

          <div className="mt-3 flex flex-wrap gap-2 text-xs">
            <span className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 font-semibold text-blue-700 shadow-sm">
              <CalendarDays size={13} />
              {appointmentDate}
            </span>

            <span className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 font-semibold text-cyan-700 shadow-sm">
              <Clock size={13} />
              {appointmentTime}
            </span>

            {appointment.doc_slot && (
              <span className="rounded-full bg-white px-3 py-1 font-semibold text-slate-700 shadow-sm">
                {appointment.doc_slot}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <span
          className={`rounded-full px-3 py-1 text-xs font-bold ${statusClass}`}
        >
          {appointmentStatus}
        </span>

        <button
          type="button"
          onClick={onDetails}
          className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-600 to-teal-600 px-4 py-2 text-sm font-bold text-white transition hover:from-cyan-700 hover:to-teal-700"
        >
          Details
          <ChevronRight size={15} />
        </button>
      </div>
    </div>
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

  const chartWidth = Math.max(sortedData.length * 95, 720);
  const chartHeight = 280;
  const paddingTop = 35;
  const paddingBottom = 50;
  const paddingLeft = 50;
  const paddingRight = 35;

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
    <div className="rounded-[28px] border border-white/70 bg-white/90 p-6 shadow-xl shadow-cyan-900/5 backdrop-blur dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-cyan-700">
            Analytics
          </p>

          <h2 className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">
            Appointment Trend
          </h2>

          <p className="text-sm text-slate-500 dark:text-slate-400">
            Month-wise appointment volume.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-cyan-50 px-4 py-3 text-right">
            <p className="text-xs font-bold text-slate-500">Total</p>
            <p className="text-2xl font-extrabold text-cyan-700">
              {totalAppointments}
            </p>
          </div>

          <div className="rounded-2xl bg-violet-50 px-4 py-3 text-right">
            <p className="text-xs font-bold text-slate-500">Average</p>
            <p className="text-2xl font-extrabold text-violet-700">
              {average}
            </p>
          </div>
        </div>
      </div>

      {sortedData.length === 0 ? (
        <EmptyState
          icon={<BarChart3 size={38} />}
          title="No appointment data"
          description="Once appointments are available, trends will be shown here."
        />
      ) : (
        <div className="overflow-x-auto">
          <div
            className="relative"
            style={{
              width: `${chartWidth}px`,
              minWidth: "100%",
            }}
          >
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
                  <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.28" />
                  <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
                </linearGradient>
              </defs>

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
                      strokeDasharray="5 5"
                    />

                    <text
                      x={12}
                      y={y + 4}
                      className="fill-slate-400 text-[11px]"
                    >
                      {Math.round((maxCount * percent) / 100)}
                    </text>
                  </g>
                );
              })}

              <path d={areaPath} fill="url(#appointmentAreaGradient)" />

              <path
                d={linePath}
                fill="none"
                stroke="#0891b2"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {sortedData.map((item, index) => {
                const x = getX(index);
                const y = getY(item.count);

                return (
                  <g key={item.month}>
                    <circle
                      cx={x}
                      cy={y}
                      r="7"
                      fill="#ffffff"
                      stroke="#0891b2"
                      strokeWidth="3"
                    />

                    <text
                      x={x}
                      y={y - 14}
                      textAnchor="middle"
                      className="fill-slate-700 text-[12px] font-bold"
                    >
                      {item.count}
                    </text>

                    <text
                      x={x}
                      y={chartHeight - 16}
                      textAnchor="middle"
                      className="fill-slate-500 text-[12px] font-bold"
                    >
                      {item.month}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>
      )}
    </div>
  );
};

const QuickActionCard = ({
  icon,
  title,
  description,
  buttonText,
  onClick,
  color,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  buttonText: string;
  onClick?: () => void;
  color: string;
}) => (
  <div className="group flex h-full min-h-[285px] flex-col overflow-hidden rounded-[28px] border border-white/70 bg-white/90 p-6 shadow-xl shadow-cyan-900/5 backdrop-blur transition hover:-translate-y-1 hover:shadow-2xl">
    <div
      className={`mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-r ${color} text-white shadow-lg transition group-hover:scale-110`}
    >
      {icon}
    </div>

    <h3 className="text-xl font-extrabold text-slate-900">{title}</h3>

    <p className="mt-3 min-h-[72px] text-sm leading-7 text-slate-500">
      {description}
    </p>

    <button
      type="button"
      onClick={onClick}
      className={`mt-auto inline-flex w-fit items-center gap-2 rounded-2xl bg-gradient-to-r ${color} px-5 py-2.5 text-sm font-bold text-white shadow-md transition hover:-translate-y-0.5`}
    >
      {buttonText}
      <ChevronRight size={16} />
    </button>
  </div>
);

const NotificationPanel = ({
  nextAppointment,
  getDoctorName,
  getAppointmentStatus,
}: {
  nextAppointment?: Appointment;
  getDoctorName: (appointment: Appointment) => string;
  getAppointmentStatus: (appointment: Appointment) => string | number;
}) => (
  <div className="rounded-[28px] border border-white/70 bg-white/90 p-6 shadow-xl shadow-cyan-900/5 backdrop-blur dark:border-slate-800 dark:bg-slate-900">
    <div className="mb-5 flex items-center justify-between">
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          Notifications
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Latest care updates
        </p>
      </div>

      <div className="rounded-2xl bg-amber-100 p-3 text-amber-700">
        <Bell size={20} />
      </div>
    </div>

    <div className="space-y-3">
      <NotificationItem
        title="Appointment Status"
        description={
          nextAppointment
            ? `Your appointment with ${getDoctorName(
                nextAppointment
              )} is ${getAppointmentStatus(nextAppointment)}.`
            : "No upcoming appointment notification."
        }
        color="border-cyan-200 bg-cyan-50"
      />

      <NotificationItem
        title="Report Uploaded"
        description="Your latest medical reports will appear here."
        color="border-violet-200 bg-violet-50"
      />

      <NotificationItem
        title="Medicine Reminder"
        description="Prescription and medicine reminders can be checked from appointments."
        color="border-orange-200 bg-orange-50"
      />
    </div>
  </div>
);

const NotificationItem = ({
  title,
  description,
  color,
}: {
  title: string;
  description: string;
  color: string;
}) => (
  <div className={`rounded-3xl border p-4 ${color}`}>
    <p className="font-bold text-slate-900">{title}</p>
    <p className="mt-1 text-sm leading-6 text-slate-600">{description}</p>
  </div>
);

const HealthTipCard = ({ tip }: { tip: string }) => (
  <div className="rounded-[28px] bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600 p-6 text-white shadow-xl">
    <div className="mb-4 flex items-center gap-3">
      <div className="rounded-2xl bg-white/20 p-3 backdrop-blur">
        <HeartPulse size={22} />
      </div>

      <div>
        <h2 className="text-xl font-bold">Daily Health Tip</h2>
        <p className="text-sm text-white/80">Changes every 2 minutes</p>
      </div>
    </div>

    <p className="rounded-3xl bg-white/15 p-4 text-sm leading-7 text-white backdrop-blur">
      {tip}
    </p>
  </div>
);

const SecurityCard = () => (
  <div className="flex h-full min-h-[285px] flex-col justify-center rounded-[28px] bg-gradient-to-br from-slate-800 via-cyan-900 to-slate-950 p-6 text-white shadow-xl">
    <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 backdrop-blur">
      <ShieldCheck size={24} />
    </div>

    <h3 className="text-xl font-extrabold">Secure Health Data</h3>

    <p className="mt-4 text-sm leading-7 text-white/75">
      Your appointments, reports, prescriptions, and profile are managed
      securely inside SymptoNexus.
    </p>
  </div>
);

const EmptyState = ({
  icon,
  title,
  description,
  buttonText,
  onClick,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  buttonText?: string;
  onClick?: () => void;
}) => (
  <div className="rounded-3xl border border-dashed border-cyan-300 bg-cyan-50/70 p-8 text-center">
    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-white text-cyan-500 shadow-sm">
      {icon}
    </div>

    <h3 className="font-bold text-slate-800">{title}</h3>

    <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
      {description}
    </p>

    {buttonText && onClick && (
      <button
        type="button"
        onClick={onClick}
        className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-600 to-teal-600 px-5 py-3 text-sm font-bold text-white transition hover:from-cyan-700 hover:to-teal-700"
      >
        {buttonText}
        <ChevronRight size={16} />
      </button>
    )}
  </div>
);

export default Patientpage;