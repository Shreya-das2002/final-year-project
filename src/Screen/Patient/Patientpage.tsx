import React from "react";

interface StatCardProps {
  title: string;
  value: string;
  color: string;
}

interface QuickButtonProps {
  title: string;
}

const Patientpage: React.FC = () => {
  return (

      <main className="flex-1 p-8">

        <h1 className="text-3xl font-semibold mb-1">
          Welcome back
        </h1>
        <p className="text-gray-600 mb-8">Here’s your health summary for today</p>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard title="Health Score" value="85%" color="bg-green-500" />
          <StatCard title="Upcoming Appointments" value="2" color="bg-blue-500" />
          <StatCard title="Recent Reports" value="5" color="bg-purple-500" />
          <StatCard title="Prescriptions" value="3" color="bg-orange-500" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">

          <section className="lg:col-span-2 bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Upcoming Appointments</h2>

            <table className="w-full text-left">
              <thead>
                <tr className="border-b text-gray-500">
                  <th className="pb-2">Doctor</th>
                  <th>Specialty</th>
                  <th>Date</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-3">Dr. Anil Sharma</td>
                  <td>Cardiologist</td>
                  <td>10 Jan 2026</td>
                  <td>
                    <button className="bg-teal-600 text-white px-4 py-1 rounded">
                      View Details
                    </button>
                  </td>
                </tr>
                <tr>
                  <td className="py-3">Dr. Meena Das</td>
                  <td>Dentist</td>
                  <td>15 Jan 2026</td>
                  <td>
                    <button className="bg-teal-600 text-white px-4 py-1 rounded">
                      View Details
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </section>

          <section className="bg-white rounded-xl shadow p-6 space-y-4">
            <h2 className="text-xl font-semibold">Quick Access</h2>

            <QuickButton title="Start Symptom Check" />
            <QuickButton title="Chat with AI Assistant" />
            <QuickButton title="Give Feedback" />
          </section>
        </div>

        <section className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-semibold mb-2">Daily Health Tip</h2>
          <p className="text-gray-600">
            💡 Drink at least 8 glasses of water to stay hydrated and healthy.
          </p>
        </section>

      </main>
  );
};

const StatCard: React.FC<StatCardProps> = ({ title, value, color }) => (
  <div className={`rounded-xl p-6 text-white shadow ${color}`}>
    <p>{title}</p>
    <h3 className="text-3xl font-bold mt-2">{value}</h3>
  </div>
);

const QuickButton: React.FC<QuickButtonProps> = ({ title }) => (
  <button className="w-full p-4 border rounded-lg hover:bg-gray-100 text-left">
    {title}
  </button>
);

export default Patientpage;
