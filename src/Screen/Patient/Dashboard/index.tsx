import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  CalendarDays,
  FileText,
  HeartPulse,
  Pill,
  ChevronRight,
  MessageCircle,
  Stethoscope,
  Star,
  Bell,
  TrendingUp,
  Clock3,
} from "lucide-react";
import { HEALTH_TIPS } from "../../../Environment";

interface StatCardProps {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ReactNode;
  accent: string;
}

interface QuickButtonProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  onclick?: () => void;
}

interface Appointment {
  doctor: string;
  specialty: string;
  date: string;
  time: string;
  status: "Confirmed" | "Pending";
}

const appointments: Appointment[] = [
  {
    doctor: "Dr. ULULU Sharma",
    specialty: "Cardiologist",
    date: "10 Jan 2026",
    time: "10:30 AM",
    status: "Confirmed",
  },
  {
    doctor: "Dr. Kamchor Basak",
    specialty: "Dentist",
    date: "15 Jan 2026",
    time: "02:00 PM",
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
    <main className="flex-1 min-h-screen bg-slate-50 p-4 md:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <section className="mb-8 flex flex-col gap-4 rounded-2xl bg-white p-6 shadow-sm border border-slate-200 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Welcome back</h1>
            <p className="mt-1 text-slate-600">
              Here’s your health summary for today
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-slate-500">
              <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-emerald-700">
                <Clock3 size={16} />
                Last updated 2 hours ago
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-blue-700">
                <TrendingUp size={16} />
                Health improving this week
              </span>
            </div>
          </div>

          <button className="inline-flex h-12 w-12 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100">
            <Bell size={20} />
          </button>
        </section>

        {/* Stats */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4 mb-8">
          <StatCard
            title="Health Score"
            value="85%"
            subtitle="Up by 5% from last week"
            icon={<HeartPulse size={22} />}
            accent="from-emerald-500 to-green-600"
          />
          <StatCard
            title="Upcoming Appointments"
            value="2"
            subtitle="Next: 10 Jan, 10:30 AM"
            icon={<CalendarDays size={22} />}
            accent="from-blue-500 to-indigo-600"
          />
          <StatCard
            title="Recent Reports"
            value="5"
            subtitle="Last uploaded 2 days ago"
            icon={<FileText size={22} />}
            accent="from-violet-500 to-fuchsia-600"
          />
          <StatCard
            title="Prescriptions"
            value="3"
            subtitle="1 refill due soon"
            icon={<Pill size={22} />}
            accent="from-orange-500 to-amber-500"
          />
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 mb-8">
          {/* Appointments */}
          <section className="lg:col-span-2 rounded-2xl bg-white p-6 shadow-sm border border-slate-200">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-semibold text-slate-900">
                  Upcoming Appointments
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Keep track of your scheduled consultations
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px] text-left">
                <thead>
                  <tr className="border-b border-slate-200 text-sm font-semibold text-slate-500">
                    <th className="pb-3">Doctor</th>
                    <th className="pb-3">Specialty</th>
                    <th className="pb-3">Date</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map((item, index) => (
                    <tr
                      key={index}
                      className="border-b border-slate-100 last:border-b-0"
                    >
                      <td className="py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-teal-100 text-teal-700 font-semibold">
                            {item.doctor.charAt(3)}
                          </div>
                          <div>
                            <p className="font-medium text-slate-900">
                              {item.doctor}
                            </p>
                            <p className="text-sm text-slate-500">
                              {item.time}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 text-slate-700">{item.specialty}</td>
                      <td className="py-4 text-slate-700">{item.date}</td>
                      <td className="py-4">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                            item.status === "Confirmed"
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-amber-100 text-amber-700"
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td className="py-4 text-right">
                        <button className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-teal-700">
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Quick Access */}
          <section className="rounded-2xl bg-white p-6 shadow-sm border border-slate-200">
            <h2 className="text-2xl font-semibold text-slate-900 mb-1">
              Quick Access
            </h2>
            <p className="text-sm text-slate-500 mb-5">
              Common actions you may need right now
            </p>

            <div className="space-y-4">
              <QuickButton
                title="Check Your Symptoms"
                description="AI-guided symptom checker"
                icon={<Stethoscope size={20} />}
                onclick={() => navigate("/patient/symptom_checker")}
              />
              <QuickButton
                title="Chat with AI"
                description="Ask health-related questions instantly"
                icon={<MessageCircle size={20} />}
                onclick={() => navigate("/patient/chatbot")}
              />
              <QuickButton
                title="Give Feedback"
                description="Help us improve your experience"
                icon={<Star size={20} />}
                onclick={() => navigate("/patient/feedback")}
              />
            </div>
          </section>
        </div>

        {/* Bottom section */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Health Tip */}
          <section className="lg:col-span-2 rounded-2xl bg-white p-6 shadow-sm border border-slate-200">
            <h2 className="text-xl font-semibold text-slate-900 mb-2">
              Daily Health Tip
            </h2>
            <p className="text-slate-600 leading-7">{HEALTH_TIPS[tipIndex]}</p>
          </section>

          {/* Simple medication / reminder card */}
          <section className="rounded-2xl bg-white p-6 shadow-sm border border-slate-200">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">
              Medication Reminder
            </h2>

            <div className="space-y-3">
              <div className="rounded-xl border border-slate-200 p-4">
                <p className="font-medium text-slate-900">Morning Tablet</p>
                <p className="text-sm text-slate-500">08:00 AM • Taken</p>
              </div>

              <div className="rounded-xl border border-slate-200 p-4">
                <p className="font-medium text-slate-900">Afternoon Tablet</p>
                <p className="text-sm text-slate-500">02:00 PM • Pending</p>
              </div>

              <div className="rounded-xl border border-slate-200 p-4">
                <p className="font-medium text-slate-900">Night Tablet</p>
                <p className="text-sm text-slate-500">09:00 PM • Pending</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
};

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  accent,
}) => (
  <div
    className={`rounded-2xl bg-gradient-to-r ${accent} p-6 text-white shadow-md`}
  >
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm font-medium text-white/90">{title}</p>
        <h3 className="mt-3 text-4xl font-bold tracking-tight">{value}</h3>
        <p className="mt-2 text-sm text-white/85">{subtitle}</p>
      </div>

      <div className="rounded-xl bg-white/20 p-3 backdrop-blur-sm">{icon}</div>
    </div>
  </div>
);

const QuickButton: React.FC<QuickButtonProps> = ({
  title,
  description,
  icon,
  onclick,
}) => (
  <button
    onClick={onclick}
    className="w-full rounded-xl border border-slate-200 p-4 text-left transition hover:border-teal-300 hover:bg-teal-50"
  >
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-start gap-3">
        <div className="rounded-lg bg-slate-100 p-2 text-slate-700">{icon}</div>
        <div>
          <p className="font-medium text-slate-900">{title}</p>
          <p className="mt-1 text-sm text-slate-500">{description}</p>
        </div>
      </div>

      <ChevronRight size={18} className="text-slate-400" />
    </div>
  </button>
);

export default Patientpage;