import { urls } from "../Environment";
import { API } from "./api";


/* ================= PATIENT FEEDBACK TYPE ================= */

export interface PatientFeedback {

  patient_feedback_id: number;

  patient_id: number;

  appointment_id: number | null;

  experience: number;

  booking: number | null;

  doc_communication: number | null;

  doc_professionalism: number | null;

  waiting: number | null;

  quality: number | null;

  staff: number | null;

  ai_accuracy: number;

  website: number;

  recommendation: boolean;

  consultation: boolean;

  desc: string | null;

}


/* ================= CREATE PATIENT FEEDBACK PAYLOAD ================= */

export interface CreatePatientFeedbackPayload {

  /*
   * Optional because the backend can get patient_id
   * from the authenticated user's req.user.ref_id.
   */
  patient_id?: number;

  appointment_id: number | null;

  experience: number;

  booking: number | null;

  doc_communication: number | null;

  doc_professionalism: number | null;

  waiting: number | null;

  quality: number | null;

  staff: number | null;

  ai_accuracy: number;

  website: number;

  recommendation: boolean;

  consultation: boolean;

  desc: string | null;

}


/* ================= PATIENT FEEDBACK API RESPONSE ================= */

export interface PatientFeedbackApiResponse {

  success: boolean;

  message: string;

  data: PatientFeedback | null;

  errorCode?: string | null;

}


/* ================= CREATE PATIENT FEEDBACK API ================= */

export const createPatientFeedbackApi = (
  data: CreatePatientFeedbackPayload
) => {

  return API.post<PatientFeedbackApiResponse>(
    urls.createPatientFeedbackUrl,
    data,
    {
      validateStatus: () => true,
    }
  );

};