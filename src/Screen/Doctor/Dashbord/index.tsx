import React, { useCallback, useEffect, useMemo } from "react";
import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import type { RootState, AppDispatch } from "../../../../store/store";
import { fetchAppointmentsThunk } from "../../../../store/slices/appointmentSlice";

import {
  Activity,
  ArrowUpRight,
  BarChart3,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock,
  CreditCard,
  FileText,
  HeartPulse,
  MessageSquareText,
  Sparkles,
  Star,
  Stethoscope,
  UserRound,
  UsersRound,
  Wallet,
} from "lucide-react";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

import type { Appointment } from "../../../services/appointmentApi";

import {
  getAllDoctorFeedbackApi,
  type DoctorFeedback,
} from "../../../services/feedbackApi";

/* ================= TYPES ================= */

interface StatCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: ReactNode;
  bg: string;
  iconBg: string;
  glow: string;
}

interface QuickButtonProps {
  title: string;
  description: string;
  icon: ReactNode;
  color: string;
  onClick?: () => void;
}

interface AppointmentRowProps {
  appointment: Appointment;
  patient: string;
  time: string;
  problem: string;
  status: string | number;
}

interface GenderChartData {
  name: string;
  value: number;
}

interface MonthwiseAppointmentData {
  month: string;
  count: number;
  sortValue: number;
}

/* ================= CONSTANTS ================= */

const GENDER_COLORS = ["#2563eb", "#ec4899", "#8b5cf6", "#14b8a6"];

const formatCurrency = (amount: number) => {
  return `₹${amount.toLocaleString("en-IN")}`;
};

/* ================= MAIN COMPONENT ================= */

const DoctorDashboard: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const { appointments, loading } = useSelector(
    (state: RootState) => state.appointment
  );

  const user = useSelector((state: RootState) => state.auth.user);

  const [doctorFeedbacks, setDoctorFeedbacks] = React.useState<
    DoctorFeedback[]
  >([]);

  const [doctorFeedbackLoading, setDoctorFeedbackLoading] =
    React.useState(false);

  const doctorId = (user as { doctor_id?: number } | null)?.doctor_id;

  useEffect(() => {
    if (doctorId) {
      dispatch(fetchAppointmentsThunk({ doctor_id: doctorId }));
    } else {
      dispatch(fetchAppointmentsThunk());
    }
  }, [dispatch, doctorId]);

  useEffect(() => {
    const fetchDoctorFeedbacks = async () => {
      try {
        setDoctorFeedbackLoading(true);

        const response = await getAllDoctorFeedbackApi();

        if (response.data?.success) {
          setDoctorFeedbacks(response.data.data || []);
        }
      } catch (error) {
        console.error("GET DOCTOR FEEDBACK ERROR:", error);
      } finally {
        setDoctorFeedbackLoading(false);
      }
    };

    fetchDoctorFeedbacks();
  }, []);

  const appointmentList = useMemo(() => {
    return Array.isArray(appointments) ? appointments : [];
  }, [appointments]);

  const myDoctorFeedbacks = useMemo(() => {
    return doctorFeedbacks.filter((feedback) => {
      if (!doctorId) return true;

      return Number(feedback.doctor_id) === Number(doctorId);
    });
  }, [doctorFeedbacks, doctorId]);

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

  const getPatientName = useCallback((appointment: Appointment) => {
    return appointment.patient_name || "Patient";
  }, []);

  const getProblem = useCallback((appointment: Appointment) => {
    return appointment.description || appointment.experience || "Consultation";
  }, []);

  const getStatusClass = useCallback(
    (status: string | number) => {
      const normalizedStatus = normalizeStatus(status);

      if (normalizedStatus === "slot assigned") {
        return "bg-blue-100 text-blue-700 ring-1 ring-blue-200";
      }

      if (normalizedStatus === "booking confirmed") {
        return "bg-cyan-100 text-cyan-700 ring-1 ring-cyan-200";
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
        return "bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200";
      }

      return "bg-slate-100 text-slate-700 ring-1 ring-slate-200";
    },
    [normalizeStatus]
  );

  const todayAppointments = useMemo(() => {
    return appointmentList.filter((appointment) => {
      const appointmentDate = getOnlyDate(appointment.appointment_date);
      return appointmentDate?.getTime() === today.getTime();
    });
  }, [appointmentList, getOnlyDate, today]);

  const sortedTodayAppointments = useMemo<AppointmentRowProps[]>(() => {
    return todayAppointments
      .map((appointment) => ({
        appointment,
        patient: getPatientName(appointment),
        time: getAppointmentTime(appointment),
        problem: getProblem(appointment),
        status: appointment.booking_status || "Pending",
      }))
      .sort((a, b) => {
        const timeA =
          a.appointment.slot_details?.start_time ||
          a.appointment.appointment_time ||
          a.appointment.booking_time ||
          a.appointment.start_time ||
          "";

        const timeB =
          b.appointment.slot_details?.start_time ||
          b.appointment.appointment_time ||
          b.appointment.booking_time ||
          b.appointment.start_time ||
          "";

        return String(timeA).localeCompare(String(timeB));
      });
  }, [todayAppointments, getPatientName, getAppointmentTime, getProblem]);

  const completedTodayCount = useMemo(() => {
    return todayAppointments.filter((appointment) => {
      const status = normalizeStatus(appointment.booking_status);

      return (
        status === "consultation completed" ||
        status === "prescription generated"
      );
    }).length;
  }, [todayAppointments, normalizeStatus]);

  const pendingTodayCount = useMemo(() => {
    return todayAppointments.filter((appointment) => {
      const status = normalizeStatus(appointment.booking_status);

      return (
        status === "booking initiated" ||
        status === "pending" ||
        status === "slot assigned" ||
        status === "booking confirmed"
      );
    }).length;
  }, [todayAppointments, normalizeStatus]);

  const uniquePatientCount = useMemo(() => {
    const patientIds = new Set<number>();

    appointmentList.forEach((appointment) => {
      if (appointment.patient_id) {
        patientIds.add(appointment.patient_id);
      }
    });

    return patientIds.size;
  }, [appointmentList]);

  const genderData = useMemo<GenderChartData[]>(() => {
    const genderMap = new Map<string, number>();

    appointmentList.forEach((appointment) => {
      const gender = appointment.patient_gender
        ? String(appointment.patient_gender)
        : "Others";

      genderMap.set(gender, (genderMap.get(gender) || 0) + 1);
    });

    const data = Array.from(genderMap.entries()).map(([name, value]) => ({
      name,
      value,
    }));

    return data.length ? data : [{ name: "No Data", value: 1 }];
  }, [appointmentList]);

  const completedAppointments = useMemo(() => {
    return appointmentList.filter((appointment) => {
      const status = normalizeStatus(appointment.booking_status);

      return (
        status === "consultation completed" ||
        status === "prescription generated"
      );
    });
  }, [appointmentList, normalizeStatus]);

  const getFee = useCallback((appointment: Appointment) => {
    return Number(appointment.slot_details?.fee || 0);
  }, []);

  const todayIncome = useMemo(() => {
    return completedAppointments
      .filter((appointment) => {
        const appointmentDate = getOnlyDate(appointment.appointment_date);
        return appointmentDate?.getTime() === today.getTime();
      })
      .reduce((sum, appointment) => sum + getFee(appointment), 0);
  }, [completedAppointments, getOnlyDate, today, getFee]);

  const last7DaysIncome = useMemo(() => {
    const startDate = new Date(today);
    startDate.setDate(startDate.getDate() - 6);

    return completedAppointments
      .filter((appointment) => {
        const appointmentDate = getOnlyDate(appointment.appointment_date);
        return appointmentDate !== null && appointmentDate >= startDate;
      })
      .reduce((sum, appointment) => sum + getFee(appointment), 0);
  }, [completedAppointments, getOnlyDate, today, getFee]);

  const monthlyIncome = useMemo(() => {
    return completedAppointments
      .filter((appointment) => {
        const appointmentDate = getOnlyDate(appointment.appointment_date);

        if (!appointmentDate) return false;

        return (
          appointmentDate.getMonth() === today.getMonth() &&
          appointmentDate.getFullYear() === today.getFullYear()
        );
      })
      .reduce((sum, appointment) => sum + getFee(appointment), 0);
  }, [completedAppointments, getOnlyDate, today, getFee]);

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

  return (
    <main className="min-h-screen bg-gradient-to-br from-cyan-50 via-sky-50 to-indigo-100 p-4 dark:from-slate-950 dark:via-cyan-950 dark:to-slate-950 md:p-6 lg:p-8">
      <div className="mx-auto max-w-[1600px] space-y-6">
        <section className="relative overflow-hidden rounded-[30px] bg-gradient-to-r from-cyan-700 via-teal-600 to-indigo-800 p-6 text-white shadow-xl shadow-cyan-900/20 md:p-7">
          <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute -bottom-24 left-1/3 h-64 w-64 rounded-full bg-cyan-300/20 blur-3xl" />

          <div className="relative grid grid-cols-1 gap-6 xl:grid-cols-12 xl:items-center">
            <div className="xl:col-span-8">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-semibold backdrop-blur">
                <Sparkles size={16} />
                Doctor Clinical Dashboard
              </div>

              <h1 className="text-3xl font-extrabold tracking-tight md:text-5xl">
                Welcome back, {user?.first_name || "Doctor"}
              </h1>

              <p className="mt-3 max-w-3xl text-sm leading-6 text-cyan-50 md:text-base">
                Manage consultations, patient records, appointments, earnings,
                and care activity from one professional workspace.
              </p>

              <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
                <DashboardMiniInfo
                  label="Today"
                  value={String(todayAppointments.length)}
                  icon={<CalendarDays size={18} />}
                />

                <DashboardMiniInfo
                  label="Completed"
                  value={String(completedTodayCount)}
                  icon={<CheckCircle2 size={18} />}
                />

                <DashboardMiniInfo
                  label="Pending"
                  value={String(pendingTodayCount)}
                  icon={<Activity size={18} />}
                />
              </div>
            </div>

            <div className="xl:col-span-4">
              <DoctorProfileCard
                appointmentCount={todayAppointments.length}
                onViewSchedule={() =>
                  navigate("/doctor/appointment_requests")
                }
              />
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Total Patients"
            value={String(uniquePatientCount)}
            subtitle="Unique patients from appointments"
            icon={<UsersRound size={22} />}
            bg="from-cyan-400 via-sky-500 to-blue-700"
            iconBg="bg-white/20"
            glow="shadow-blue-500/25"
          />

          <StatCard
            title="Today's Appointments"
            value={String(todayAppointments.length)}
            subtitle="Fetched from appointment API"
            icon={<CalendarDays size={22} />}
            bg="from-indigo-500 via-purple-500 to-pink-600"
            iconBg="bg-white/20"
            glow="shadow-purple-500/25"
          />

          <StatCard
            title="Completed Today"
            value={String(completedTodayCount)}
            subtitle="Consultations completed today"
            icon={<CheckCircle2 size={22} />}
            bg="from-emerald-400 via-teal-500 to-cyan-700"
            iconBg="bg-white/20"
            glow="shadow-emerald-500/25"
          />

          <StatCard
            title="Pending / Upcoming"
            value={String(pendingTodayCount)}
            subtitle="Need your attention"
            icon={<Activity size={22} />}
            bg="from-amber-400 via-orange-500 to-red-500"
            iconBg="bg-white/20"
            glow="shadow-orange-500/25"
          />
        </section>

        <section className="grid grid-cols-1 items-start gap-6 xl:grid-cols-12">
          <div className="space-y-6 xl:col-span-8">
            <TodayAppointmentsCard
              loading={loading}
              appointments={sortedTodayAppointments}
              getStatusClass={getStatusClass}
              onViewAll={() => navigate("/doctor/appointment_requests")}
              onDetails={(appointment) =>
                navigate(
                  `/doctor/appointment_requests/booking_details/${appointment.appointment_id}`,
                  { state: appointment }
                )
              }
            />

            <MonthwiseAppointmentGraph data={monthwiseAppointmentData} />

            <section className="grid grid-cols-1 items-stretch gap-5 md:grid-cols-2">
              <QuickButton
                title="Appointment Requests"
                description="Review, accept, or manage patient appointment requests."
                icon={<CalendarDays size={22} />}
                color="from-cyan-400 via-sky-500 to-blue-700"
                onClick={() => navigate("/doctor/appointment_requests")}
              />

              <QuickButton
                title="Patient Records"
                description="Open patient list, consultation history, and medical details."
                icon={<FileText size={22} />}
                color="from-indigo-500 via-purple-500 to-pink-600"
                onClick={() => navigate("/doctor/patients")}
              />

              <QuickButton
                title="Update Profile"
                description="Manage professional details, specialization, and availability."
                icon={<UserRound size={22} />}
                color="from-emerald-400 via-teal-500 to-cyan-700"
                onClick={() => navigate("/doctor/profile")}
              />

              <QuickButton
                title="Earnings"
                description="Check today's income, weekly earnings, and monthly summary."
                icon={<Wallet size={22} />}
                color="from-amber-400 via-orange-500 to-red-500"
                onClick={() => navigate("/doctor/earnings")}
              />
            </section>
          </div>

          <aside className="space-y-6 xl:col-span-4">
            <GenderDistributionCard data={genderData} />

            <EarningsCard
              todayIncome={formatCurrency(todayIncome)}
              last7DaysIncome={formatCurrency(last7DaysIncome)}
              monthlyIncome={formatCurrency(monthlyIncome)}
            />

            <ClinicalReminderCard />

            <DoctorFeedbackShortcutCard
              feedbackCount={myDoctorFeedbacks.length}
              loading={doctorFeedbackLoading}
              onViewMore={() => navigate("/doctor/feedback")}
            />
          </aside>
        </section>
      </div>
    </main>
  );
};

export default DoctorDashboard;

/* ================= COMPONENTS ================= */

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

const DoctorProfileCard = ({
  appointmentCount,
  onViewSchedule,
}: {
  appointmentCount: number;
  onViewSchedule: () => void;
}) => (
  <div className="rounded-[26px] border border-white/25 bg-white/10 p-5 shadow-lg backdrop-blur-xl">
    <div className="mb-5 flex items-center justify-between">
      <div>
        <p className="text-sm font-semibold text-white/85">Doctor Profile</p>
        <h3 className="mt-1 text-3xl font-extrabold text-white">Active</h3>
      </div>

      <div className="rounded-2xl bg-white/20 p-3 text-white">
        <Stethoscope size={24} />
      </div>
    </div>

    <div className="rounded-3xl bg-white/15 p-4 backdrop-blur">
      <p className="text-sm font-semibold text-white">Today’s Consultation</p>
      <p className="mt-2 text-sm leading-6 text-white/75">
        You have {appointmentCount} appointments today. Review patient history
        before starting consultation.
      </p>
    </div>

    <button
      type="button"
      onClick={onViewSchedule}
      className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-bold text-cyan-800 shadow-md transition hover:-translate-y-0.5 hover:bg-cyan-50"
    >
      View Schedule
      <ChevronRight size={16} />
    </button>
  </div>
);

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

        {subtitle && (
          <p className="mt-3 line-clamp-2 text-sm leading-6 text-white/90">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  </div>
);

const TodayAppointmentsCard = ({
  loading,
  appointments,
  getStatusClass,
  onViewAll,
  onDetails,
}: {
  loading: boolean;
  appointments: AppointmentRowProps[];
  getStatusClass: (status: string | number) => string;
  onViewAll: () => void;
  onDetails: (appointment: Appointment) => void;
}) => (
  <section className="rounded-[28px] border border-white/70 bg-white/90 p-6 shadow-xl shadow-cyan-900/5 backdrop-blur dark:border-slate-800 dark:bg-slate-900">
    <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-cyan-700">
          Consultation Queue
        </p>

        <h2 className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">
          Today&apos;s Appointments
        </h2>

        <p className="text-sm text-slate-500 dark:text-slate-400">
          Live appointment data from appointment API.
        </p>
      </div>

      <button
        type="button"
        onClick={onViewAll}
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
      <div className="rounded-3xl border border-dashed border-cyan-300 bg-cyan-50/70 p-8 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-white text-cyan-500 shadow-sm">
          <CalendarDays size={38} />
        </div>

        <h3 className="font-bold text-slate-800">No appointments today</h3>

        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
          Your appointment queue is empty for today.
        </p>
      </div>
    ) : (
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-left">
          <thead>
            <tr className="border-b border-slate-200 text-sm text-slate-500">
              <th className="pb-4 font-bold">Patient</th>
              <th className="pb-4 font-bold">Time</th>
              <th className="pb-4 font-bold">Problem</th>
              <th className="pb-4 font-bold">Status</th>
              <th className="pb-4 text-right font-bold">Action</th>
            </tr>
          </thead>

          <tbody>
            {appointments.map((appointmentRow) => (
              <AppointmentRow
                key={appointmentRow.appointment.appointment_id}
                {...appointmentRow}
                statusClass={getStatusClass(appointmentRow.status)}
                onDetails={() => onDetails(appointmentRow.appointment)}
              />
            ))}
          </tbody>
        </table>
      </div>
    )}
  </section>
);

const AppointmentRow = ({
  patient,
  time,
  problem,
  status,
  statusClass,
  onDetails,
}: AppointmentRowProps & {
  statusClass: string;
  onDetails: () => void;
}) => (
  <tr className="border-b border-slate-100 last:border-b-0">
    <td className="py-4">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-600 to-teal-500 text-sm font-bold text-white shadow-md">
          {getPatientInitials(patient)}
        </div>

        <div>
          <p className="font-bold text-slate-900">{patient}</p>
          <p className="text-xs text-slate-500">Patient</p>
        </div>
      </div>
    </td>

    <td className="py-4">
      <span className="inline-flex items-center gap-2 rounded-full bg-cyan-50 px-3 py-1 text-xs font-bold text-cyan-700">
        <Clock size={13} />
        {time}
      </span>
    </td>

    <td className="py-4 text-sm font-medium text-slate-600">{problem}</td>

    <td className="py-4">
      <span
        className={`rounded-full px-3 py-1 text-xs font-bold ${statusClass}`}
      >
        {status}
      </span>
    </td>

    <td className="py-4 text-right">
      <button
        type="button"
        onClick={onDetails}
        className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-600 to-teal-600 px-4 py-2 text-sm font-bold text-white transition hover:from-cyan-700 hover:to-teal-700"
      >
        View
        <ChevronRight size={14} />
      </button>
    </td>
  </tr>
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
        <div className="rounded-3xl border border-dashed border-cyan-300 bg-cyan-50/70 p-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-white text-cyan-500 shadow-sm">
            <BarChart3 size={38} />
          </div>

          <h3 className="font-bold text-slate-800">No appointment data</h3>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
            Once appointments are available, trends will be shown here.
          </p>
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
            <svg
              width={chartWidth}
              height={chartHeight}
              className="overflow-visible"
            >
              <defs>
                <linearGradient
                  id="doctorAppointmentAreaGradient"
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

              <path d={areaPath} fill="url(#doctorAppointmentAreaGradient)" />

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

const getPatientInitials = (patientName: string) => {
  if (!patientName) return "PT";

  const nameParts = patientName.trim().split(/\s+/);

  if (nameParts.length === 1) {
    return nameParts[0].charAt(0).toUpperCase();
  }

  const firstNameInitial = nameParts[0].charAt(0).toUpperCase();
  const lastNameInitial = nameParts[nameParts.length - 1]
    .charAt(0)
    .toUpperCase();

  return `${firstNameInitial}${lastNameInitial}`;
};

const QuickButton: React.FC<QuickButtonProps> = ({
  title,
  description,
  icon,
  color,
  onClick,
}) => (
  <button
    type="button"
    onClick={onClick}
    className="group flex min-h-[190px] flex-col rounded-[28px] border border-white/70 bg-white/90 p-6 text-left shadow-xl shadow-cyan-900/5 backdrop-blur transition hover:-translate-y-1 hover:shadow-2xl"
  >
    <div
      className={`mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-r ${color} text-white shadow-lg transition group-hover:scale-110`}
    >
      {icon}
    </div>

    <h3 className="text-xl font-extrabold text-slate-900">{title}</h3>

    <p className="mt-3 text-sm leading-7 text-slate-500">{description}</p>

    <span
      className={`mt-auto inline-flex w-fit items-center gap-2 rounded-2xl bg-gradient-to-r ${color} px-5 py-2.5 text-sm font-bold text-white shadow-md`}
    >
      Open
      <ArrowUpRight size={15} />
    </span>
  </button>
);

const GenderDistributionCard = ({ data }: { data: GenderChartData[] }) => (
  <section className="rounded-[28px] border border-white/70 bg-white/90 p-6 shadow-xl shadow-cyan-900/5 backdrop-blur dark:border-slate-800 dark:bg-slate-900">
    <div className="mb-4 flex items-center justify-between">
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          Patient Distribution
        </h2>

        <p className="text-sm text-slate-500 dark:text-slate-400">
          By gender
        </p>
      </div>

      <div className="rounded-2xl bg-violet-100 p-3 text-violet-700">
        <BarChart3 size={20} />
      </div>
    </div>

    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius={60}
            outerRadius={90}
            paddingAngle={4}
          >
            {data.map((entry, index) => (
              <Cell
                key={entry.name}
                fill={GENDER_COLORS[index % GENDER_COLORS.length]}
              />
            ))}
          </Pie>

          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>

    <div className="mt-4 space-y-3">
      {data.map((item, index) => (
        <div
          key={item.name}
          className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3 text-sm"
        >
          <div className="flex items-center gap-3">
            <span
              className="h-3 w-3 rounded-full"
              style={{
                backgroundColor:
                  GENDER_COLORS[index % GENDER_COLORS.length],
              }}
            />

            <span className="font-semibold text-slate-700">{item.name}</span>
          </div>

          <span className="font-bold text-slate-900">{item.value}</span>
        </div>
      ))}
    </div>
  </section>
);

const EarningsCard = ({
  todayIncome,
  last7DaysIncome,
  monthlyIncome,
}: {
  todayIncome: string;
  last7DaysIncome: string;
  monthlyIncome: string;
}) => (
  <section className="rounded-[28px] bg-gradient-to-br from-slate-800 via-cyan-900 to-slate-950 p-6 text-white shadow-xl">
    <div className="mb-5 flex items-center justify-between">
      <div>
        <h2 className="text-xl font-bold">Earnings</h2>
        <p className="text-sm text-white/75">Income summary</p>
      </div>

      <div className="rounded-2xl bg-white/15 p-3 backdrop-blur">
        <CreditCard size={20} />
      </div>
    </div>

    <div className="space-y-4">
      <EarningItem label="Today Income" value={todayIncome} />
      <EarningItem label="Last 7 Days" value={last7DaysIncome} />
      <EarningItem label="This Month" value={monthlyIncome} />
    </div>
  </section>
);

const EarningItem = ({ label, value }: { label: string; value: string }) => (
  <div className="flex items-center justify-between rounded-2xl bg-white/10 px-4 py-3 backdrop-blur">
    <span className="text-sm text-white/75">{label}</span>
    <span className="text-base font-extrabold text-white">{value}</span>
  </div>
);

const ClinicalReminderCard = () => (
  <section className="rounded-[28px] bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600 p-6 text-white shadow-xl">
    <div className="mb-4 flex items-center gap-3">
      <div className="rounded-2xl bg-white/20 p-3 backdrop-blur">
        <HeartPulse size={22} />
      </div>

      <div>
        <h2 className="text-xl font-bold">Daily Reminder</h2>
        <p className="text-sm text-white/80">Clinical best practice</p>
      </div>
    </div>

    <p className="rounded-3xl bg-white/15 p-4 text-sm leading-7 text-white backdrop-blur">
      Always review patient history and previous prescriptions before starting
      consultation.
    </p>
  </section>
);

const DoctorFeedbackShortcutCard = ({
  feedbackCount,
  loading,
  onViewMore,
}: {
  feedbackCount: number;
  loading: boolean;
  onViewMore: () => void;
}) => (
  <section className="relative overflow-hidden rounded-[28px] border border-white/70 bg-white/90 p-6 shadow-xl shadow-cyan-900/5 backdrop-blur dark:border-slate-800 dark:bg-slate-900">
    <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-cyan-200/40 blur-2xl" />
    <div className="absolute -bottom-12 -left-12 h-32 w-32 rounded-full bg-indigo-200/40 blur-2xl" />

    <div className="relative">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            My Feedback
          </h2>

          <p className="text-sm text-slate-500 dark:text-slate-400">
            See your all feedback
          </p>
        </div>

        <div className="rounded-2xl bg-cyan-100 p-3 text-cyan-700">
          <MessageSquareText size={20} />
        </div>
      </div>

      <div className="rounded-3xl bg-gradient-to-r from-cyan-50 via-white to-blue-50 p-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-slate-500">
              Total Feedback
            </p>

            <h3 className="mt-1 text-4xl font-extrabold text-slate-900">
              {loading ? "..." : feedbackCount}
            </h3>
          </div>

          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-r from-cyan-500 to-teal-500 text-white shadow-lg">
            <Star size={24} className="fill-current" />
          </div>
        </div>

        <p className="mt-4 text-sm leading-6 text-slate-600">
          View all feedback submitted by you from the feedback section.
        </p>

        <button
          type="button"
          onClick={onViewMore}
          className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-600 to-teal-600 px-5 py-3 text-sm font-bold text-white shadow-md transition hover:-translate-y-0.5 hover:from-cyan-700 hover:to-teal-700"
        >
          View More
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  </section>
);