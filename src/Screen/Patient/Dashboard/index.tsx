import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
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

interface StatCardProps {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ReactNode;
  bg: string;
}


interface Appointment {
  doctor: string;
  specialty: string;
  date: string;
  time: string;
  mode: "Online" | "Clinic";
  status: "Confirmed" | "Pending";
}

const appointments: Appointment[] = [
  {
    doctor: "Dr. ULULU Sharma",
    specialty: "Cardiologist",
    date: "10 Jan 2026",
    time: "10:30 AM",
    mode: "Clinic",
    status: "Confirmed",
  },
  {
    doctor: "Dr. Kamchor Basak",
    specialty: "Dentist",
    date: "15 Jan 2026",
    time: "02:00 PM",
    mode: "Online",
    status: "Pending",
  },
];

const Patientpage: React.FC = () => {
  const navigate = useNavigate();
  const [tipIndex, setTipIndex] = useState(0);
  const hasStarted = useRef(false);

  useEffect(() => {
    if (hasStarted.current) return;
    hasStarted.current = true;

    const interval = setInterval(() => {
      setTipIndex((prev) => (prev + 1) % HEALTH_TIPS.length);
    }, 300000);

    return () => clearInterval(interval);
  }, []);

  return (
    <main className="min-h-screen flex-1p-6 bg-gradient-to-r from-slate-300 via-cyan-100 to-slate-300 dark:from-cyan-900 dark:via-slate-700 dark:to-cyan-900 md:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Top Header */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-cyan-700 dark:text-gray-300">
              Welcome Back, Name
            </h2>
          </div>
        </section>

        {/* Stats */}
        <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Upcoming Appointments"
            value="2"
            subtitle="Next: 10 Jan, 10:30 AM"
            icon={<CalendarDays size={24} />}
            bg="from-blue-500 to-indigo-600"
          />

          <StatCard
            title="Total Appointments"
            value="13"
            subtitle="Next: 10 Jan, 10:30 AM"
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
                    Manage your scheduled doctor consultations.
                  </p>
                </div>

                <button
                  onClick={() => navigate("/patient/appointments")}
                  className="hidden rounded-xl bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-700 md:block"
                >
                  View All
                </button>
              </div>

              <div className="space-y-4">
                {appointments.map((item, index) => (
                  <div
                    key={index}
                    className="rounded-2xl border border-slate-200 p-4 transition hover:border-teal-300 hover:bg-teal-50/40"
                  >
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-100 text-lg font-bold text-teal-700">
                          {item.doctor
                            .split(" ")
                            .filter(Boolean)
                            .slice(-1)[0]
                            ?.charAt(0)}
                        </div>

                        <div>
                          <h3 className="font-semibold text-slate-900">
                            {item.doctor}
                          </h3>
                          <p className="text-sm text-slate-500">
                            {item.specialty}
                          </p>

                          <div className="mt-2 flex flex-wrap gap-2 text-xs">
                            <span className="rounded-full bg-blue-50 px-3 py-1 text-blue-700">
                              {item.date}
                            </span>
                            <span className="rounded-full bg-cyan-50 px-3 py-1 text-cyan-700">
                              {item.time}
                            </span>
                            <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-700">
                              {item.mode}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            item.status === "Confirmed"
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-amber-100 text-amber-700"
                          }`}
                        >
                          {item.status}
                        </span>

                        <button className="rounded-xl bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-700">
                          Details
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
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
                    Personalized wellness guidance
                  </p>
                </div>
              </div>

              <p className="leading-7 text-slate-600">
                {HEALTH_TIPS[tipIndex]}
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
                  title="Appointment Confirmed"
                  description="Your cardiology appointment is confirmed."
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
    </main>
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