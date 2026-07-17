import React from "react";
import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";

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
  patient: string;
  doctor: string;
  date: string;
  time: string;
  status: "Upcoming" | "Completed" | "Pending" | "Cancelled";
}

interface QuickActionProps {
  title: string;
  description: string;
  icon: ReactNode;
  color: string;
  onClick?: () => void;
}

/* ================= MOCK DATA ================= */

const recentAppointments: AppointmentRowProps[] = [
  {
    patient: "Rohit Sharma",
    doctor: "Dr. Mehta",
    date: "04 Feb 2026",
    time: "10:30 AM",
    status: "Upcoming",
  },
  {
    patient: "Ananya Sen",
    doctor: "Dr. Roy",
    date: "04 Feb 2026",
    time: "11:45 AM",
    status: "Completed",
  },
  {
    patient: "Amit Das",
    doctor: "Dr. Banerjee",
    date: "04 Feb 2026",
    time: "01:00 PM",
    status: "Pending",
  },
  {
    patient: "Sneha Paul",
    doctor: "Dr. Ghosh",
    date: "03 Feb 2026",
    time: "04:15 PM",
    status: "Cancelled",
  },
];

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
                  value="32"
                  icon={<CalendarDays size={18} />}
                />

                <MiniInfo
                  label="Completed"
                  value="18"
                  icon={<CheckCircle2 size={18} />}
                />

                <MiniInfo
                  label="Pending"
                  value="6"
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
            value="1,240"
            subtitle="Registered patient accounts"
            icon={<UsersRound size={22} />}
            bg="from-cyan-400 via-sky-500 to-blue-700"
            iconBg="bg-white/20"
            glow="shadow-blue-500/25"
          />

          <StatCard
            title="Total Doctors"
            value="85"
            subtitle="Active doctors onboarded"
            icon={<Stethoscope size={22} />}
            bg="from-indigo-500 via-purple-500 to-pink-600"
            iconBg="bg-white/20"
            glow="shadow-purple-500/25"
          />

          <StatCard
            title="Today’s Appointments"
            value="32"
            subtitle="Scheduled consultations today"
            icon={<CalendarDays size={22} />}
            bg="from-emerald-400 via-teal-500 to-cyan-700"
            iconBg="bg-white/20"
            glow="shadow-emerald-500/25"
          />

          <StatCard
            title="Pending Approvals"
            value="6"
            subtitle="Doctor and user approvals"
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
              appointments={recentAppointments}
              onViewAll={() => navigate("/admin/appointments")}
            />

            <section className="grid grid-cols-1 items-stretch gap-5 md:grid-cols-3">
              <QuickActionCard
                title="Add Doctor"
                description="Create a new doctor profile and assign specialization."
                icon={<UserPlus size={22} />}
                color="from-cyan-400 via-sky-500 to-blue-700"
                onClick={() => navigate("/admin/doctors/add")}
              />

              <QuickActionCard
                title="View Appointments"
                description="Track all patient appointments and booking statuses."
                icon={<CalendarDays size={22} />}
                color="from-indigo-500 via-purple-500 to-pink-600"
                onClick={() => navigate("/admin/appointments")}
              />

              <QuickActionCard
                title="Manage Users"
                description="Manage patient, doctor, and admin user accounts."
                icon={<UsersRound size={22} />}
                color="from-emerald-400 via-teal-500 to-cyan-700"
                onClick={() => navigate("/admin/users")}
              />
            </section>
          </div>

          <aside className="space-y-6 xl:col-span-4">
            <ActivitySummaryCard />

            <RecentActivityCard />

            <ReportsShortcutCard onViewReports={() => navigate("/admin/reports")} />
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
  appointments,
  onViewAll,
}: {
  appointments: AppointmentRowProps[];
  onViewAll: () => void;
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
          Latest patient appointment records.
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
          {appointments.map((appointment, index) => (
            <AppointmentRow key={index} {...appointment} />
          ))}
        </tbody>
      </table>
    </div>
  </section>
);

const AppointmentRow: React.FC<AppointmentRowProps> = ({
  patient,
  doctor,
  date,
  time,
  status,
}) => {
  const statusClasses =
    status === "Completed"
      ? "bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200"
      : status === "Pending"
      ? "bg-amber-100 text-amber-700 ring-1 ring-amber-200"
      : status === "Cancelled"
      ? "bg-red-100 text-red-700 ring-1 ring-red-200"
      : "bg-blue-100 text-blue-700 ring-1 ring-blue-200";

  return (
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
        <span className={`rounded-full px-3 py-1 text-xs font-bold ${statusClasses}`}>
          {status}
        </span>
      </td>

      <td className="py-4 text-right">
        <button className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-600 to-teal-600 px-4 py-2 text-sm font-bold text-white transition hover:from-cyan-700 hover:to-teal-700">
          View
          <ChevronRight size={14} />
        </button>
      </td>
    </tr>
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

const ActivitySummaryCard = () => (
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
      <SummaryItem label="Active Patients" value="1,180" />
      <SummaryItem label="Active Doctors" value="78" />
      <SummaryItem label="Reports Generated" value="420" />
      <SummaryItem label="Open Tickets" value="12" />
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
        <div key={index} className="rounded-2xl bg-white/10 px-4 py-3 backdrop-blur">
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