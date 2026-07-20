import React, { useCallback, useEffect, useMemo } from "react";
import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import type { RootState, AppDispatch } from "../../../../store/store";
import { fetchAppointmentsThunk } from "../../../../store/slices/appointmentSlice";
import type { Appointment } from "../../../services/appointmentApi";

import {
  Activity,
  ArrowUpRight,
  BarChart3,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock,
  FileText,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  UserPlus,
  UsersRound,
} from "lucide-react";

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

interface AppointmentRowProps {
  appointment: Appointment;
  patient: string;
  doctor: string;
  date: string;
  time: string;
  status: string | number;
}

interface QuickActionProps {
  title: string;
  description: string;
  icon: ReactNode;
  color: string;
  onClick?: () => void;
}

interface MonthwiseAppointmentData {
  month: string;
  count: number;
  sortValue: number;
}

/* ================= MOCK ONLY FOR ACTIVITY ================= */

const adminActivity = [
  {
    title: "New doctor registration submitted",
    time: "10 minutes ago",
  },
  {
    title: "Appointment slot updated",
    time: "35 minutes ago",
  },
  {
    title: "Patient feedback received",
    time: "1 hour ago",
  },
];

/* ================= MAIN COMPONENT ================= */

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const { appointments, loading } = useSelector(
    (state: RootState) => state.appointment
  );

  const adminRole = useSelector(
    (state: RootState) => state.auth.role
  );

  const normalizedAdminRole = useMemo(() => {
    return String(adminRole || "")
      .trim()
      .toLowerCase();
  }, [adminRole]);

  useEffect(() => {
    dispatch(fetchAppointmentsThunk());
  }, [dispatch]);

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

  const getBookingStatusLabel = useCallback(
    (status?: string | number | null) => {
      const value = String(status || "").trim();

      const statusMap: Record<string, string> = {
        "1": "Booking Initiated",
        "2": "Booking Confirmed",
        "3": "Booking Rejected",
        "4": "Slot Assigned",
        "5": "Consultation Completed",
        "6": "Prescription Generated",
        "7": "Canceled By Doctor",
        "8": "Canceled By Patient",
        "9": "Consultation Missed",
      };

      if (statusMap[value]) return statusMap[value];

      const normalized = normalizeStatus(value);

      if (!normalized) return "Pending";

      return normalized
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
    },
    [normalizeStatus]
  );

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

  const formatDisplayDate = useCallback(
    (dateValue?: string | null) => {
      const date = getOnlyDate(dateValue);

      if (!date) return "-";

      return date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    },
    [getOnlyDate]
  );

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

  const getStatusClass = useCallback(
    (status: string | number) => {
      const normalizedStatus = normalizeStatus(status);

      if (
        normalizedStatus === "consultation completed" ||
        normalizedStatus === "prescription generated" ||
        normalizedStatus === "completed"
      ) {
        return "bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200";
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
        normalizedStatus === "consultation missed" ||
        normalizedStatus === "cancelled" ||
        normalizedStatus === "canceled"
      ) {
        return "bg-red-100 text-red-700 ring-1 ring-red-200";
      }

      return "bg-blue-100 text-blue-700 ring-1 ring-blue-200";
    },
    [normalizeStatus]
  );

  const todayAppointments = useMemo(() => {
    return appointmentList.filter((appointment) => {
      const appointmentDate = getOnlyDate(appointment.appointment_date);
      return appointmentDate?.getTime() === today.getTime();
    });
  }, [appointmentList, getOnlyDate, today]);

  const completedTodayCount = useMemo(() => {
    return todayAppointments.filter((appointment) => {
      const status = normalizeStatus(appointment.booking_status);

      return (
        status === "consultation completed" ||
        status === "prescription generated" ||
        status === "completed"
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

  const totalPatients = useMemo(() => {
    const patientIds = new Set<number>();

    appointmentList.forEach((appointment) => {
      if (appointment.patient_id) {
        patientIds.add(Number(appointment.patient_id));
      }
    });

    return patientIds.size;
  }, [appointmentList]);

  const totalDoctors = useMemo(() => {
    const doctorIds = new Set<number>();

    appointmentList.forEach((appointment) => {
      if (appointment.doctor_id) {
        doctorIds.add(Number(appointment.doctor_id));
      }
    });

    return doctorIds.size;
  }, [appointmentList]);

  const pendingApprovalsCount = useMemo(() => {
    return appointmentList.filter((appointment) => {
      const status = normalizeStatus(appointment.booking_status);

      return status === "booking initiated" || status === "pending";
    }).length;
  }, [appointmentList, normalizeStatus]);

  const recentAppointments = useMemo<AppointmentRowProps[]>(() => {
    return [...appointmentList]
      .sort((a, b) => {
        const dateA = getOnlyDate(a.appointment_date)?.getTime() || 0;
        const dateB = getOnlyDate(b.appointment_date)?.getTime() || 0;

        return dateB - dateA;
      })
      .slice(0, 5)
      .map((appointment) => ({
        appointment,
        patient: appointment.patient_name || "Patient",
        doctor: appointment.doctor_name || "Doctor not assigned",
        date: formatDisplayDate(appointment.appointment_date),
        time: getAppointmentTime(appointment),
        status: appointment.booking_status || "Pending",
      }));
  }, [
    appointmentList,
    getOnlyDate,
    formatDisplayDate,
    getAppointmentTime,
  ]);

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
        {/* HERO SECTION */}
        <section className="relative overflow-hidden rounded-[30px] bg-gradient-to-r from-cyan-700 via-teal-600 to-indigo-800 p-6 text-white shadow-xl shadow-cyan-900/20 md:p-7">
          <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute -bottom-24 left-1/3 h-64 w-64 rounded-full bg-cyan-300/20 blur-3xl" />

          <div className="relative grid grid-cols-1 gap-6 xl:grid-cols-12 xl:items-center">
            <div className="xl:col-span-8">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-semibold backdrop-blur">
                <Sparkles size={16} />
                Admin Control Dashboard
              </div>

              <h1 className="text-3xl font-extrabold tracking-tight md:text-5xl">
                Welcome back, Admin
              </h1>

              <p className="mt-3 max-w-3xl text-sm leading-6 text-cyan-50 md:text-base">
                Monitor patients, doctors, appointments, approvals, reports,
                and platform activities from one central workspace.
              </p>

              <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
                <MiniInfo
                  label="Today Appointments"
                  value={String(todayAppointments.length)}
                  icon={<CalendarDays size={18} />}
                />

                <MiniInfo
                  label="Completed"
                  value={String(completedTodayCount)}
                  icon={<CheckCircle2 size={18} />}
                />

                <MiniInfo
                  label="Pending"
                  value={String(pendingTodayCount)}
                  icon={<Activity size={18} />}
                />
              </div>
            </div>

            <div className="xl:col-span-4">
              <AdminProfileCard onManage={() => navigate("/admin/users")} />
            </div>
          </div>
        </section>

        {/* KPI CARDS */}
        <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Total Patients"
            value={String(totalPatients)}
            subtitle="Unique patients from appointments"
            icon={<UsersRound size={22} />}
            bg="from-cyan-400 via-sky-500 to-blue-700"
            iconBg="bg-white/20"
            glow="shadow-blue-500/25"
          />

          <StatCard
            title="Total Doctors"
            value={String(totalDoctors)}
            subtitle="Unique doctors from appointments"
            icon={<Stethoscope size={22} />}
            bg="from-indigo-500 via-purple-500 to-pink-600"
            iconBg="bg-white/20"
            glow="shadow-purple-500/25"
          />

          <StatCard
            title="Today’s Appointments"
            value={String(todayAppointments.length)}
            subtitle="Scheduled consultations today"
            icon={<CalendarDays size={22} />}
            bg="from-emerald-400 via-teal-500 to-cyan-700"
            iconBg="bg-white/20"
            glow="shadow-emerald-500/25"
          />

          <StatCard
            title="Pending Approvals"
            value={String(pendingApprovalsCount)}
            subtitle="Booking requests awaiting action"
            icon={<ShieldCheck size={22} />}
            bg="from-amber-400 via-orange-500 to-red-500"
            iconBg="bg-white/20"
            glow="shadow-orange-500/25"
          />
        </section>

        {/* MAIN GRID */}
        <section className="grid grid-cols-1 items-start gap-6 xl:grid-cols-12">
          <div className="space-y-6 xl:col-span-8">
            <RecentAppointmentsCard
              loading={loading}
              appointments={recentAppointments}
              getStatusClass={getStatusClass}
              getBookingStatusLabel={getBookingStatusLabel}
              onViewAll={() => navigate("/admin/appointments")}
              onDetails={(appointment) =>
                navigate(
                  `/admin/appointments/booking_details/${appointment.appointment_id}`,
                  { state: appointment }
                )
              }
            />

            <MonthwiseAppointmentGraph data={monthwiseAppointmentData} />

            <section className="grid grid-cols-1 items-stretch gap-5 md:grid-cols-2">
              {normalizedAdminRole === "super admin" && (
                <>
                  <QuickActionCard
                    title="Create Admin"
                    description="Create a new admin account and assign the required access."
                    icon={<UserPlus size={22} />}
                    color="from-cyan-400 via-sky-500 to-blue-700"
                    onClick={() => navigate("/admin/create_admin")}
                  />

                  <QuickActionCard
                    title="View Appointments"
                    description="Track all patient appointments and booking statuses."
                    icon={<CalendarDays size={22} />}
                    color="from-indigo-500 via-purple-500 to-pink-600"
                    onClick={() => navigate("/admin/appointments")}
                  />
                </>
              )}

              {normalizedAdminRole === "guest admin" && (
                <>
                  <QuickActionCard
                    title="Add Doctor"
                    description="Create a new doctor profile and assign specialization."
                    icon={<UserPlus size={22} />}
                    color="from-cyan-400 via-sky-500 to-blue-700"
                    onClick={() => navigate("/admin/add_doctor")}
                  />

                  <QuickActionCard
                    title="View Appointments"
                    description="Track all patient appointments and booking statuses."
                    icon={<CalendarDays size={22} />}
                    color="from-indigo-500 via-purple-500 to-pink-600"
                    onClick={() => navigate("/admin/appointments")}
                  />
                </>
              )}

              {normalizedAdminRole === "standard admin" && (
                <>
                  <QuickActionCard
                    title="Manage Doctor"
                    description="View and manage registered doctor profiles."
                    icon={<Stethoscope size={22} />}
                    color="from-emerald-400 via-teal-500 to-cyan-700"
                    onClick={() => navigate("/admin/doctor_list")}
                  />

                  <QuickActionCard
                    title="View Appointments"
                    description="Track all patient appointments and booking statuses."
                    icon={<CalendarDays size={22} />}
                    color="from-indigo-500 via-purple-500 to-pink-600"
                    onClick={() => navigate("/admin/appointments")}
                  />
                </>
              )}
            </section>
          </div>

          <aside className="space-y-6 xl:col-span-4">
            <ActivitySummaryCard
              activePatients={totalPatients}
              activeDoctors={totalDoctors}
              totalAppointments={appointmentList.length}
              pendingApprovals={pendingApprovalsCount}
            />

            <RecentActivityCard />

            <ReportsShortcutCard
              onViewReports={() => navigate("/admin/reports")}
            />
          </aside>
        </section>
      </div>
    </main>
  );
};

export default AdminDashboard;

/* ================= COMPONENTS ================= */

const MiniInfo = ({
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

const AdminProfileCard = ({ onManage }: { onManage: () => void }) => (
  <div className="rounded-[26px] border border-white/25 bg-white/10 p-5 shadow-lg backdrop-blur-xl">
    <div className="mb-5 flex items-center justify-between">
      <div>
        <p className="text-sm font-semibold text-white/85">Admin Access</p>
        <h3 className="mt-1 text-3xl font-extrabold text-white">Active</h3>
      </div>

      <div className="rounded-2xl bg-white/20 p-3 text-white">
        <ShieldCheck size={24} />
      </div>
    </div>

    <div className="rounded-3xl bg-white/15 p-4 backdrop-blur">
      <p className="text-sm font-semibold text-white">System Control</p>
      <p className="mt-2 text-sm leading-6 text-white/75">
        Manage hospital users, doctors, appointments, approvals, reports, and
        system activity.
      </p>
    </div>

    <button
      type="button"
      onClick={onManage}
      className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-bold text-cyan-800 shadow-md transition hover:-translate-y-0.5 hover:bg-cyan-50"
    >
      Manage Users
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

const RecentAppointmentsCard = ({
  loading,
  appointments,
  getStatusClass,
  getBookingStatusLabel,
  onViewAll,
  onDetails,
}: {
  loading: boolean;
  appointments: AppointmentRowProps[];
  getStatusClass: (status: string | number) => string;
  getBookingStatusLabel: (status?: string | number | null) => string;
  onViewAll: () => void;
  onDetails: (appointment: Appointment) => void;
}) => (
  <section className="rounded-[28px] border border-white/70 bg-white/90 p-6 shadow-xl shadow-cyan-900/5 backdrop-blur dark:border-slate-800 dark:bg-slate-900">
    <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-cyan-700">
          Appointment Queue
        </p>

        <h2 className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">
          Recent Appointments
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

        <h3 className="font-bold text-slate-800">No appointments found</h3>

        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
          Appointment records will appear here once available.
        </p>
      </div>
    ) : (
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-left">
          <thead>
            <tr className="border-b border-slate-200 text-sm text-slate-500">
              <th className="pb-4 font-bold">Patient</th>
              <th className="pb-4 font-bold">Doctor</th>
              <th className="pb-4 font-bold">Date</th>
              <th className="pb-4 font-bold">Time</th>
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
                statusLabel={getBookingStatusLabel(appointmentRow.status)}
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
  doctor,
  date,
  time,
  statusClass,
  statusLabel,
  onDetails,
}: AppointmentRowProps & {
  statusClass: string;
  statusLabel: string;
  onDetails: () => void;
}) => (
  <tr className="border-b border-slate-100 last:border-b-0">
    <td className="py-4">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-600 to-teal-500 text-sm font-bold text-white shadow-md">
          {getInitials(patient)}
        </div>

        <div>
          <p className="font-bold text-slate-900">{patient}</p>
          <p className="text-xs text-slate-500">Patient</p>
        </div>
      </div>
    </td>

    <td className="py-4 text-sm font-semibold text-slate-700">{doctor}</td>

    <td className="py-4 text-sm font-medium text-slate-600">{date}</td>

    <td className="py-4">
      <span className="inline-flex items-center gap-2 rounded-full bg-cyan-50 px-3 py-1 text-xs font-bold text-cyan-700">
        <Clock size={13} />
        {time}
      </span>
    </td>

    <td className="py-4">
      <span className={`rounded-full px-3 py-1 text-xs font-bold ${statusClass}`}>
        {statusLabel}
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
                  id="adminAppointmentAreaGradient"
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

              <path d={areaPath} fill="url(#adminAppointmentAreaGradient)" />

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

const QuickActionCard: React.FC<QuickActionProps> = ({
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

const ActivitySummaryCard = ({
  activePatients,
  activeDoctors,
  totalAppointments,
  pendingApprovals,
}: {
  activePatients: number;
  activeDoctors: number;
  totalAppointments: number;
  pendingApprovals: number;
}) => (
  <section className="rounded-[28px] border border-white/70 bg-white/90 p-6 shadow-xl shadow-cyan-900/5 backdrop-blur dark:border-slate-800 dark:bg-slate-900">
    <div className="mb-5 flex items-center justify-between">
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          Platform Summary
        </h2>

        <p className="text-sm text-slate-500 dark:text-slate-400">
          Current activity overview
        </p>
      </div>

      <div className="rounded-2xl bg-violet-100 p-3 text-violet-700">
        <BarChart3 size={20} />
      </div>
    </div>

    <div className="space-y-4">
      <SummaryItem label="Active Patients" value={String(activePatients)} />
      <SummaryItem label="Active Doctors" value={String(activeDoctors)} />
      <SummaryItem
        label="Total Appointments"
        value={String(totalAppointments)}
      />
      <SummaryItem label="Pending Approvals" value={String(pendingApprovals)} />
    </div>
  </section>
);

const SummaryItem = ({ label, value }: { label: string; value: string }) => (
  <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3 text-sm">
    <span className="font-semibold text-slate-600">{label}</span>
    <span className="font-extrabold text-slate-900">{value}</span>
  </div>
);

const RecentActivityCard = () => (
  <section className="rounded-[28px] bg-gradient-to-br from-slate-800 via-cyan-900 to-slate-950 p-6 text-white shadow-xl">
    <div className="mb-5 flex items-center justify-between">
      <div>
        <h2 className="text-xl font-bold">Recent Activity</h2>
        <p className="text-sm text-white/75">Latest system updates</p>
      </div>

      <div className="rounded-2xl bg-white/15 p-3 backdrop-blur">
        <Activity size={20} />
      </div>
    </div>

    <div className="space-y-4">
      {adminActivity.map((activity, index) => (
        <div
          key={index}
          className="rounded-2xl bg-white/10 px-4 py-3 backdrop-blur"
        >
          <p className="text-sm font-semibold text-white">{activity.title}</p>
          <p className="mt-1 text-xs text-white/65">{activity.time}</p>
        </div>
      ))}
    </div>
  </section>
);

const ReportsShortcutCard = ({
  onViewReports,
}: {
  onViewReports: () => void;
}) => (
  <section className="relative overflow-hidden rounded-[28px] border border-white/70 bg-white/90 p-6 shadow-xl shadow-cyan-900/5 backdrop-blur dark:border-slate-800 dark:bg-slate-900">
    <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-cyan-200/40 blur-2xl" />
    <div className="absolute -bottom-12 -left-12 h-32 w-32 rounded-full bg-indigo-200/40 blur-2xl" />

    <div className="relative">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Reports
          </h2>

          <p className="text-sm text-slate-500 dark:text-slate-400">
            View analytics and MIS reports
          </p>
        </div>

        <div className="rounded-2xl bg-cyan-100 p-3 text-cyan-700">
          <FileText size={20} />
        </div>
      </div>

      <div className="rounded-3xl bg-gradient-to-r from-cyan-50 via-white to-blue-50 p-5">
        <p className="text-sm leading-6 text-slate-600">
          Check appointment reports, patient records, doctor performance, and
          platform analytics.
        </p>

        <button
          type="button"
          onClick={onViewReports}
          className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-600 to-teal-600 px-5 py-3 text-sm font-bold text-white shadow-md transition hover:-translate-y-0.5 hover:from-cyan-700 hover:to-teal-700"
        >
          View Reports
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  </section>
);

const getInitials = (name: string) => {
  if (!name) return "NA";

  const nameParts = name.trim().split(/\s+/);

  if (nameParts.length === 1) {
    return nameParts[0].charAt(0).toUpperCase();
  }

  return `${nameParts[0].charAt(0)}${nameParts[nameParts.length - 1].charAt(
    0
  )}`.toUpperCase();
};