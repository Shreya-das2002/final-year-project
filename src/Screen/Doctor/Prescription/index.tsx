import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import logo from "../../../assets/logo_outline.png";
import dayjs from "dayjs";
import type { RootState } from "../../../../store/store";
import { generatePrescriptionApi } from "../../../services/appointmentApi";
import toast from "react-hot-toast";
import { FiGlobe, FiMail, FiMapPin, FiPhone } from "react-icons/fi";

const Prescription = () => {
  const { appointment_id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

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

  const age = appointment?.patient_dob
    ? dayjs().diff(dayjs(appointment.patient_dob), "year")
    : null;

  const [prescription, setPrescription] = useState("");
  const [isSaving, setIsSaving] = useState(false);



  const formatPrescriptionToHtml = (text: string) => {
    return text
      .split("\n")
      .map((line) => `<p style="margin:0 0 12px 0;">${line || "&nbsp;"}</p>`)
      .join("");
  };

  const buildPrescriptionHtml = () => {
  const formattedPrescription = formatPrescriptionToHtml(prescription);

  return `
    <div style="font-family: Arial, sans-serif; background:#ffffff; width:100%; margin:0; padding:0; color:#1e293b;">

      <div style="position:relative; height:178px; overflow:hidden; background:linear-gradient(to right, #7dd3fc, #0891b2, #155e75); border-radius:18px 18px 0 0;">
        
        <div style="position:absolute; left:0; top:0; height:100%; width:430px; background:linear-gradient(to bottom right, #dff4f7, #ffffff); border-bottom-right-radius:180px; padding:26px 38px; box-sizing:border-box;">
          <h2 style="margin:0; font-size:24px; font-weight:700; color:#164e63;">
            Dr. ${appointment?.doctor_name || "-"}
          </h2>

          <p style="margin:14px 0 0 0; font-size:13px; color:#334155;">
            ${appointment?.specialization || "-"}
          </p>

          <p style="margin:14px 0 0 0; font-size:12px; color:#0f172a;">
            <strong>License No:</strong> ${appointment?.license_number || "-"}
          </p>

          <p style="margin:8px 0 0 0; font-size:12px; color:#0f172a;">
            <strong>Reg No:</strong> ${appointment?.reg_no || "-"}
          </p>

          <p style="margin:14px 0 0 0; font-size:12px; line-height:1.45; color:#475569;">
            ${appointment?.doctor_bio || ""}
          </p>
        </div>

        <div style="position:absolute; inset:0; display:flex; align-items:center; justify-content:center;">
          <div style="text-align:center; color:white; margin-top:2px;">
            <div style="display:flex; align-items:center; justify-content:center; gap:12px; margin-bottom:14px;">
              <img
                src="${logo}"
                alt=""
                style="width:52px; height:52px; object-fit:contain; display:block;"
              />
              <div style="text-align:left; line-height:1.25;">
                <p style="margin:0; font-size:11px; letter-spacing:2px; text-transform:uppercase;">
                  Smart Healthcare
                </p>
                <p style="margin:0; font-size:11px; letter-spacing:2px; text-transform:uppercase;">
                  Trusted Care
                </p>
              </div>
            </div>

            <h1 style="margin:5; font-size:46px; font-family:Georgia, serif; font-weight:700; line-height:1;">
              SymptoNexus Clinic
            </h1>
          </div>
        </div>
      </div>

      <div style="padding:26px 34px; border-bottom:1px solid #22d3ee; background:#ffffff;">
        <table style="width:100%; border-collapse:collapse; table-layout:fixed;">
          <tr>
            <td style="width:12%; font-weight:700; font-size:16px; color:#0f172a; white-space:nowrap;">Patient's Name:</td>
            <td style="width:23%; border-bottom:1px solid #94a3b8; padding:0 0 6px 12px; font-size:16px; color:#334155;">
              ${appointment?.patient_name || "-"}
            </td>

            <td style="width:7%; font-weight:700; font-size:16px; color:#0f172a; white-space:nowrap; padding-left:22px;">Age:</td>
            <td style="width:8%; border-bottom:1px solid #94a3b8; padding:0 0 6px 12px; font-size:16px; color:#334155;">
              ${age ?? "-"}
            </td>

            <td style="width:9%; font-weight:700; font-size:16px; color:#0f172a; white-space:nowrap; padding-left:22px;">Gender:</td>
            <td style="width:13%; border-bottom:1px solid #94a3b8; padding:0 0 6px 12px; font-size:16px; color:#334155;">
              ${appointment?.patient_gender || "-"}
            </td>

            <td style="width:7%; font-weight:700; font-size:16px; color:#0f172a; white-space:nowrap; padding-left:22px;">Date:</td>
            <td style="width:16%; border-bottom:1px solid #94a3b8; padding:0 0 6px 12px; font-size:16px; color:#334155;">
              ${appointment?.appointment_date || "-"}
            </td>
          </tr>
        </table>
      </div>

      <div style="position:relative; min-height:420px; padding:34px 40px; font-size:18px; line-height:1.85; color:#334155; background:#ffffff;">
        ${formattedPrescription}
      </div>

      <div style="height:12px; background:linear-gradient(to right, #06b6d4, #155e75, #0891b2);"></div>
    </div>
  `;
};
  const handleSavePrescription = async () => {
    try {
      if (!appointment?.appointment_id) {
        toast("Appointment not found");
        return;
      }

      if (!prescription.trim()) {
        toast("Please write prescription first");
        return;
      }

      setIsSaving(true);

      const htmlString = buildPrescriptionHtml();

      const response = await generatePrescriptionApi({
        appointment_id: appointment.appointment_id,
        prescription: htmlString
      });

      if (response?.data?.success) {
        toast(response.data.message || "Prescription saved successfully");
        navigate("//doctor/appointments")
      } else {
        toast(response?.data?.message || "Failed to save prescription");
      }
    } catch {
      toast("Something went wrong while saving prescription");
    } finally {
      setIsSaving(false);
    }
  };

  if (!appointment) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <span className="text-lg font-semibold text-slate-700">
          No appointment data found
        </span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-200 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-end mb-4">
          <button
            onClick={() => navigate(-1)}
            className="px-5 py-2 rounded-lg bg-white border border-slate-300 hover:bg-slate-50"
          >
            Back
          </button>
        </div>

        <div className="bg-white shadow-2xl rounded-sm overflow-hidden border border-slate-300 ">
          <div className="relative h-36 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-sky-300 to-cyan-800" />

            <div className="absolute left-0 top-0 h-full w-[360px] bg-gradient-to-br from-cyan-100 to-white rounded-br-[150px] z-10 px-6 py-5">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-[22px] font-bold text-cyan-900 leading-none">
                  Dr. {appointment.doctor_name}
                </h2>
              </div>

              <div className="flex items-center gap-4 text-[11px] text-slate-700">
                <p className="text-[13px]">
                  {appointment.specialization}
                </p>
              </div>

              <div>
                <p className="text-xs">
                  <span className="font-semibold text-xs">License No:</span>{" "}
                  {appointment.license_number || "-"}
                </p>
              </div>

              <div>
                <p className="text-xs">
                  <span className="font-semibold text-xs">Reg No:</span>{" "}
                  {appointment.reg_no || "-"}
                </p>
              </div>

              <p className="mt-1 text-[11px] leading-4 text-slate-600 text-xs break-words">
                {appointment.doctor_bio || "Doctor profile information"}
              </p>
            </div>

            <div className="relative h-40 overflow-hidden bg-gradient-to-r from-sky-100 via-cyan-700 to-cyan-600">
              <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top_right,white_0,transparent_35%)]" />

              <div className="relative z-10 h-full flex items-center justify-center">
                <div className="text-center text-white flex flex-col items-center">
                  <div className="flex items-center gap-2 mb-3">
                    <img
                      src={logo}
                      alt="Logo"
                      className="w-14 h-14 object-contain"
                    />

                    <div className="text-white leading-tight ">
                      <p className="text-[10px] sm:text-xs uppercase tracking-[2px] opacity-90">
                        Smart Healthcare
                      </p>
                      <p className="text-[10px] sm:text-xs uppercase tracking-[2px] opacity-90 pr-9">
                        Trusted Care
                      </p>
                    </div>
                  </div>

                  <h1 className="text-3xl sm:text-4xl font-serif font-bold tracking-wide mb-3 pl-30">
                    SymptoNexus Clinic
                  </h1>
                </div>
              </div>
            </div>
          </div>

          <div className="px-8 py-6 border-b border-cyan-400">
            <div className="mb-4 flex items-center gap-2">
              <span className="text-sm font-semibold">Patient's Name:</span>

              <div className="border-b border-slate-400 pb-1 w-60 text-slate-700">
                {appointment.patient_name}
              </div>
              <span className="text-sm font-semibold">Age:</span>

              <div className="border-b border-slate-400 pb-1 w-30 text-slate-700">
                {age ?? "-"}
              </div>
              <span className="text-sm font-semibold">Gender:</span>

              <div className="border-b border-slate-400 pb-1 w-40 text-slate-700">
                {appointment.patient_gender}
              </div>
              <span className="text-sm font-semibold">Date:</span>

              <div className="border-b border-slate-400 pb-1 w-30 text-slate-700">
                {appointment.appointment_date}
              </div>
            </div>
          </div>

          <div className="relative px-8 py-6 min-h-[600px]">
            <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
              <img src={logo} className="w-96" alt="Watermark" />
            </div>

            <textarea
              className="w-full min-h-[500px] resize-none outline-none text-lg leading-8 text-slate-800 bg-transparent"
              placeholder="Write prescription here..."
              value={prescription}
              onChange={(e) => setPrescription(e.target.value)}
            />
          </div>

          <div className="text-white text-xs bg-gradient-to-r from-cyan-500 via-cyan-800 to-cyan-600 py-4 px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
              <div className="flex items-center gap-2">
                <FiMail /> symptonexus333@gmail.com
              </div>

              <div className="flex items-center gap-2">
                <FiMapPin /> Krishnanagar, Nadia
              </div>

              <div className="flex items-center gap-2">
                <FiPhone /> +91 98765 43210
              </div>

              <div className="flex items-center gap-2">
                <FiGlobe /> SymptoNexus
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <button
            onClick={handleSavePrescription}
            disabled={isSaving}
            className="px-6 py-3 rounded-xl bg-cyan-600 text-white hover:bg-cyan-700 shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSaving ? "Saving..." : "Save Prescription"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Prescription;