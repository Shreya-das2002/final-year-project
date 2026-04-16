import { useLocation, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useMemo, useRef } from "react";
import type { RootState } from "../../../../store/store";
import dayjs from "dayjs";

const DocAppointmentDetails = () => {
  const { appointment_id } = useParams();
  const location = useLocation();
  const prescriptionRef = useRef<HTMLDivElement | null>(null);

  const appointmentFromState = location.state;
  const appointmentFromStore = useSelector(
    (state: RootState) => state.appointment.appointments
  );

  const appointment = useMemo(() => {
    return (
      appointmentFromStore.find(
        (a) => a.appointment_id === Number(appointment_id)
      ) || appointmentFromState
    );
  }, [appointmentFromStore, appointmentFromState, appointment_id]);

  const dob = appointment?.patient_dob || null;
  const age = dob ? dayjs().diff(dayjs(dob), "year") : null;

  const formatBoolean = (value: unknown) => {
    if (
      value === true ||
      value === 1 ||
      value === "1" ||
      value === "true" ||
      value === "yes" ||
      value === "Yes"
    ) {
      return "Yes";
    }
    return "No";
  };

  const handleViewPrescription = () => {
    prescriptionRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  if (!appointment) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#eef7f9]">
        <span className="text-xl font-semibold text-slate-700">
          No appointment data found
        </span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#eef7f9] border-t-[6px] border-[#0b87a5] px-6 py-8 md:px-10">
      <div className="mx-auto w-full">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between mb-10">
          <div>
            <h1 className="text-4xl leading-tight font-extrabold text-cyan-900">
              Appointment Details
            </h1>
            <p className="mt-2 text-lg text-slate-500">
              View appointment summary and patient profile
            </p>
          </div>

          <button
            type="button"
            onClick={handleViewPrescription}
            className="bg-[#0891b2] hover:bg-[#0e7c98] text-white text-[17px] font-semibold px-6 py-4 rounded-2xl shadow-md transition"
          >
            View Generated Prescription
          </button>
        </div>

        {/* Main Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Appointment Summary */}
          <div className="xl:col-span-1 rounded-[22px] border border-slate-200 bg-white/70 shadow-[0_8px_30px_rgba(15,23,42,0.08)] px-7 py-8">
            <div className="mb-7">
              <h2 className="text-2xl font-bold text-cyan-700">
                Appointment Summary
              </h2>
              <div className="mt-3 h-[6px] w-20 rounded-full bg-[#0ea5c6]" />
            </div>

            <div className="grid grid-cols-1 gap-5">
              <div className="rounded-2xl border border-slate-200 bg-[#f7f9fc] px-5 py-6">
                <span className="block text-[15px] text-slate-500">
                  Appointment ID
                </span>
                <span className="mt-2 block text-[17px] font-bold text-slate-700">
                  {appointment.appointment_no || "Not Generated"}
                </span>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-[#f7f9fc] px-5 py-6">
                <span className="block text-[15px] text-slate-500">Date</span>
                <span className="mt-2 block text-[17px] font-bold text-slate-700">
                  {appointment.appointment_date || "-"}
                </span>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-[#f7f9fc] px-5 py-6">
                <span className="block text-[15px] text-slate-500">Time</span>
                <span className="mt-2 block text-[17px] font-bold text-slate-700">
                  {appointment.appointment_time || "-"}
                </span>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-[#f7f9fc] px-5 py-6">
                <span className="block text-[15px] text-slate-500">Status</span>
                <span className="mt-2 block text-[17px] font-bold text-slate-700">
                  {appointment.booking_status || "-"}
                </span>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-[#f7f9fc] px-5 py-6">
                <span className="block text-[15px] text-slate-500">Fees</span>
                <span className="mt-2 block text-[17px] font-bold text-slate-700">
                  {appointment.fees || "-"}
                </span>
              </div>
            </div>
          </div>

          {/* Patient Details */}
          <div className="xl:col-span-2 rounded-[22px] border border-slate-200 bg-white/70 shadow-[0_8px_30px_rgba(15,23,42,0.08)] px-7 py-8">
            <div className="mb-7">
              <h2 className="text-2xl font-bold text-cyan-700">
                Patient Details
              </h2>
              <div className="mt-3 h-[6px] w-20 rounded-full bg-[#0ea5c6]" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-5">
              <div className="rounded-2xl border border-slate-200 bg-[#f7f9fc] px-5 py-6">
                <span className="block text-[15px] text-slate-500">Name</span>
                <span className="mt-2 block text-[17px] font-bold text-slate-700">
                  {appointment.patient_name || "-"}
                </span>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-[#f7f9fc] px-5 py-6">
                <span className="block text-[15px] text-slate-500">Gender</span>
                <span className="mt-2 block text-[17px] font-bold text-slate-700">
                  {appointment.patient_gender || "-"}
                </span>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-[#f7f9fc] px-5 py-6">
                <span className="block text-[15px] text-slate-500">DOB</span>
                <span className="mt-2 block text-[17px] font-bold text-slate-700">
                  {appointment.patient_dob || "-"}
                </span>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-[#f7f9fc] px-5 py-6">
                <span className="block text-[15px] text-slate-500">Age</span>
                <span className="mt-2 block text-[17px] font-bold text-slate-700">
                  {age ?? "-"}
                </span>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-[#f7f9fc] px-5 py-6">
                <span className="block text-[15px] text-slate-500">Phone</span>
                <span className="mt-2 block text-[17px] font-bold text-slate-700">
                  {appointment.patient_phone || "-"}
                </span>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-[#f7f9fc] px-5 py-6">
                <span className="block text-[15px] text-slate-500">Email</span>
                <span className="mt-2 block text-[17px] font-bold text-slate-700 break-words">
                  {appointment.patient_email || "-"}
                </span>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-[#f7f9fc] px-5 py-6">
                <span className="block text-[15px] text-slate-500">
                  Blood Group
                </span>
                <span className="mt-2 block text-[17px] font-bold text-slate-700">
                  {appointment.patient_blood_group || "-"}
                </span>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-[#f7f9fc] px-5 py-6">
                <span className="block text-[15px] text-slate-500">Height</span>
                <span className="mt-2 block text-[17px] font-bold text-slate-700">
                  {appointment.patient_height ? `${appointment.patient_height} cm` : "-"}
                </span>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-[#f7f9fc] px-5 py-6">
                <span className="block text-[15px] text-slate-500">Weight</span>
                <span className="mt-2 block text-[17px] font-bold text-slate-700">
                  {appointment.patient_weight ? `${appointment.patient_weight} kg` : "-"}
                </span>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-[#f7f9fc] px-5 py-6">
                <span className="block text-[15px] text-slate-500">
                  Occupation
                </span>
                <span className="mt-2 block text-[17px] font-bold text-slate-700">
                  {appointment.patient_occupation || "-"}
                </span>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-[#f7f9fc] px-5 py-6">
                <span className="block text-[15px] text-slate-500">
                  Allergies
                </span>
                <div className="mt-3 flex flex-wrap gap-3">
                  {appointment.patient_allergies?.length > 0 ? (
                    appointment.patient_allergies.map((allergy: string, index: number) => (
                      <span
                        key={index}
                        className="px-4 py-1.5 rounded-full text-sm font-semibold bg-rose-100 text-rose-600"
                      >
                        {allergy}
                      </span>
                    ))
                  ) : (
                    <span className="px-4 py-1.5 rounded-full text-sm font-semibold bg-emerald-100 text-emerald-700">
                      None
                    </span>
                  )}
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-[#f7f9fc] px-5 py-6">
                <span className="block text-[15px] text-slate-500">Smoking</span>
                <span
                  className={`mt-3 inline-flex items-center rounded-full px-4 py-1.5 text-[15px] font-bold ${
                    formatBoolean(appointment.patient_smooking) === "Yes"
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-rose-100 text-rose-600"
                  }`}
                >
                  {formatBoolean(appointment.patient_smooking)}
                </span>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-[#f7f9fc] px-5 py-6">
                <span className="block text-[15px] text-slate-500">Alcohol</span>
                <span
                  className={`mt-3 inline-flex items-center rounded-full px-4 py-1.5 text-[15px] font-bold ${
                    formatBoolean(appointment.patient_alcohol) === "Yes"
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-rose-100 text-rose-600"
                  }`}
                >
                  {formatBoolean(appointment.patient_alcohol)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Generated Prescription */}
        <div
          ref={prescriptionRef}
          className="mt-8 rounded-[22px] border border-slate-200 bg-white/80 shadow-[0_8px_30px_rgba(15,23,42,0.08)] px-7 py-8"
        >
          <div className="mb-7">
            <h2 className="text-2xl font-bold text-cyan-700">
              Generated Prescription
            </h2>
            <div className="mt-3 h-[6px] w-20 rounded-full bg-[#0ea5c6]" />
          </div>

          {appointment.prescription ? (
            <div
              className="rounded-2xl border border-slate-200 bg-white overflow-auto"
              dangerouslySetInnerHTML={{ __html: appointment.prescription }}
            />
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-[#f8fbfc] px-6 py-10 text-center text-slate-500 text-lg font-medium">
              No generated prescription found
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocAppointmentDetails;