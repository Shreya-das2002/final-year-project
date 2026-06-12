import React from "react";
import { useNavigate } from "react-router-dom";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

/* ================= TYPES ================= */

interface StatCardProps {
  title: string;
  value: string;
  subtitle?: string;
}

interface QuickButtonProps {
  title: string;
  onClick?: () => void;
}

interface AppointmentRowProps {
  patient: string;
  time: string;
  problem: string;
  status: "Upcoming" | "Completed" | "Pending" | "Cancelled";
}

/* ================= MOCK DATA ================= */

const genderData = [
  { name: "Male", value: 120 },
  { name: "Female", value: 100 },
  { name: "Others", value: 25 },
];

const GENDER_COLORS = ["#2563eb", "#ec4899", "#8b5cf6"];

const todayAppointments = [
  {
    patient: "Rahul Das",
    time: "10:30 AM",
    problem: "Chest Pain",
    status: "Upcoming" as const,
  },
  {
    patient: "Priya Sharma",
    time: "11:45 AM",
    problem: "Tooth Pain",
    status: "Completed" as const,
  },
  {
    patient: "Amit Roy",
    time: "01:00 PM",
    problem: "Headache",
    status: "Pending" as const,
  },
  {
    patient: "Sneha Paul",
    time: "09:15 AM",
    problem: "Fever",
    status: "Completed" as const,
  },
  {
    patient: "Rakesh Sen",
    time: "02:30 PM",
    problem: "Back Pain",
    status: "Upcoming" as const,
  },
];

const earningsData = {
  today: "₹2,500",
  last7Days: "₹14,800",
  monthly: "₹56,000",
};

const totalPatients = genderData.reduce((sum, item) => sum + item.value, 0);

/* ================= HELPERS ================= */

const parseTimeToMinutes = (time: string) => {
  const [timePart, modifier] = time.split(" ");
  let [hours] = timePart.split(":").map(Number);
  const[minutes] = timePart.split(":").map(Number);

  if (modifier === "PM" && hours !== 12) hours += 12;
  if (modifier === "AM" && hours === 12) hours = 0;

  return hours * 60 + minutes;
};

const sortedAppointments = [...todayAppointments].sort(
  (a, b) => parseTimeToMinutes(a.time) - parseTimeToMinutes(b.time)
);

const completedCount = todayAppointments.filter(
  (item) => item.status === "Completed"
).length;

const upcomingCount = todayAppointments.filter(
  (item) => item.status === "Upcoming"
).length;

const pendingCount = todayAppointments.filter(
  (item) => item.status === "Pending"
).length;

/* ================= MAIN COMPONENT ================= */

const DoctorDashboard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <main className="flex-1 p-6 md:p-8 bg-gray-100 min-h-screen">
      {/* Header */}
      <section className="mb-8">
        <h1 className="text-3xl font-semibold text-gray-900 mb-1">
          Welcome back, Doctor
        </h1>
        <p className="text-gray-600">
          Here is your patient summary, earnings, and today’s appointments.
        </p>
      </section>

      {/* Top Stats */}
      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Patients"
          value={String(totalPatients)}
          subtitle="All registered patients"
        />
        <StatCard
          title="Today's Appointments"
          value={String(todayAppointments.length)}
          subtitle="Sorted by appointment time"
        />
        <StatCard
          title="Completed Today"
          value={String(completedCount)}
          subtitle="Successfully completed"
        />
        <StatCard
          title="Pending / Upcoming"
          value={`${pendingCount + upcomingCount}`}
          subtitle="Need your attention"
        />
      </section>

      {/* Main Grid */}
      <section className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
        {/* Left Side */}
        <div className="xl:col-span-2 space-y-6">
          <TodayAppointmentsCard appointments={sortedAppointments} />

          <section className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Quick Actions
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <QuickButton
                title="View All Appointments"
                onClick={() => navigate("/doctor/appointment_requests")}
              />
              <QuickButton
                title="View Patient List"
                onClick={() => navigate("/doctor/patients")}
              />
              <QuickButton
                title="Update Profile"
                onClick={() => navigate("/doctor/profile")}
              />
              <QuickButton
                title="Check Earnings"
                onClick={() => navigate("/doctor/earnings")}
              />
            </div>
          </section>
        </div>

        {/* Right Side */}
        <div className="space-y-6">
          <GenderDistributionCard />
          <EarningsCard />
          <section className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              Daily Reminder
            </h2>
            <p className="text-gray-600 text-sm leading-6">
              Always review patient history and previous prescriptions before
              starting consultation.
            </p>
          </section>
        </div>
      </section>
    </main>
  );
};

export default DoctorDashboard;

/* ================= COMPONENTS ================= */

const StatCard: React.FC<StatCardProps> = ({ title, value, subtitle }) => (
  <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
    <p className="text-sm text-gray-500">{title}</p>
    <h3 className="text-3xl font-bold text-gray-900 mt-2">{value}</h3>
    {subtitle && <p className="text-sm text-gray-500 mt-2">{subtitle}</p>}
  </div>
);

const QuickButton: React.FC<QuickButtonProps> = ({ title, onClick }) => (
  <button
    onClick={onClick}
    className="w-full p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition text-left text-gray-800 font-medium"
  >
    {title}
  </button>
);

const TodayAppointmentsCard: React.FC<{
  appointments: AppointmentRowProps[];
}> = ({ appointments }) => (
  <section className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-xl font-semibold text-gray-900">
        Today&apos;s Appointments
      </h2>
      <span className="text-sm text-gray-500">Sorted by time</span>
    </div>

    <div className="overflow-x-auto">
      <table className="w-full text-left min-w-[700px]">
        <thead>
          <tr className="border-b border-gray-200 text-gray-500 text-sm">
            <th className="pb-3 font-medium">Patient</th>
            <th className="pb-3 font-medium">Time</th>
            <th className="pb-3 font-medium">Problem</th>
            <th className="pb-3 font-medium">Status</th>
            <th className="pb-3 font-medium text-right">Action</th>
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
  time,
  problem,
  status,
}) => {
  const statusClasses =
    status === "Completed"
      ? "bg-green-100 text-green-700"
      : status === "Pending"
      ? "bg-orange-100 text-orange-700"
      : status === "Cancelled"
      ? "bg-red-100 text-red-700"
      : "bg-blue-100 text-blue-700";

  return (
    <tr className="border-b border-gray-100 last:border-b-0">
      <td className="py-4 text-gray-900 font-medium">{patient}</td>
      <td className="py-4 text-gray-700">{time}</td>
      <td className="py-4 text-gray-700">{problem}</td>
      <td className="py-4">
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusClasses}`}>
          {status}
        </span>
      </td>
      <td className="py-4 text-right">
        <button className="bg-teal-600 hover:bg-teal-700 transition text-white px-4 py-2 rounded-lg text-sm font-medium">
          View
        </button>
      </td>
    </tr>
  );
};

const GenderDistributionCard: React.FC = () => (
  <section className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-lg font-semibold text-gray-900">
        Patient Distribution
      </h2>
      <span className="text-sm text-gray-500">By gender</span>
    </div>

    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={genderData}
            dataKey="value"
            nameKey="name"
            innerRadius={60}
            outerRadius={90}
            paddingAngle={4}
          >
            {genderData.map((entry, index) => (
              <Cell key={entry.name} fill={GENDER_COLORS[index]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>

    <div className="space-y-3 mt-4">
      {genderData.map((item, index) => (
        <div
          key={item.name}
          className="flex items-center justify-between text-sm"
        >
          <div className="flex items-center gap-3">
            <span
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: GENDER_COLORS[index] }}
            />
            <span className="text-gray-700">{item.name}</span>
          </div>
          <span className="font-medium text-gray-900">{item.value}</span>
        </div>
      ))}
    </div>
  </section>
);

const EarningsCard: React.FC = () => (
  <section className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-lg font-semibold text-gray-900">Earnings</h2>
      <span className="text-sm text-gray-500">Income summary</span>
    </div>

    <div className="space-y-4">
      <div className="flex items-center justify-between border-b border-gray-100 pb-3">
        <span className="text-gray-600">Today Income</span>
        <span className="text-gray-900 font-semibold">{earningsData.today}</span>
      </div>

      <div className="flex items-center justify-between border-b border-gray-100 pb-3">
        <span className="text-gray-600">Last 7 Days</span>
        <span className="text-gray-900 font-semibold">
          {earningsData.last7Days}
        </span>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-gray-600">This Month</span>
        <span className="text-gray-900 font-semibold">
          {earningsData.monthly}
        </span>
      </div>
    </div>
  </section>
);