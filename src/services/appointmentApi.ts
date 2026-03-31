import { urls } from "../Environment";
import { API } from "./api";

/* ================= APPOINTMENT TYPE ================= */

export interface AppointmentRequestPayload {
  patient_id: number;
  doctor_id: number;
  doctor_availability_id: number;
  booking_date: string;
}

export interface AppointmentSlotDetails {
  date: string | null;
  start_time: string | null;
  end_time: string | null;
  fee: number | null;
  slots: number | null;
}

  export interface slot_details {
    date?: string | null;
    start_time?: string | null;
    end_time?: string | null;
    fee?: number | null;
    slots?: number | null;
  } 

export interface Appointment{
  appointment_id: number;
  patient_id: number;
  doctor_id: number;
  doctor_availability_id: number;
  booking_date: string;
  booking_time?: string | null;
  description?: string | null;
  document_id?: number | null;
  booking_status: number;
  slot_details?: slot_details | null;
  created_on?: string | null;
  created_by?: number | null;
  updated_on?: string | null;
  updated_by?: number | null;
  doctor_name?: string;
  specialization?: string;
};

export interface PendingAppointment {
  doctor_gender: string;
  doctor_email: string;
  doctor_phone: string;
  patient_gender: string;
  patient_email: string;
  appointment_id: number;
  patient_id: number;
  doctor_id: number;
  doctor_availability_id: number;
  doctor_name: string;
  specialization: number | string | null;
  booking_date: string;
  booking_time?: string | null;
  description?: string | null;
  document_id?: number | null;
  booking_status: number;
  booking_status_name?: string;
  doctor_slot?: string | null;
  fees?: number | null;
  created_on?: string | null;
  created_by?: number | null;
  patient_name: string;
  name: string;
  patient_phone: string;

}

export interface GetAppointmentsParams {
  patient_id?: number;
  doctor_id?: number;
  booking_date?: string;
  booking_status?: number;
}

/* ================= CREATE APPOINTMENT API ================= */

export const appointmentRequestApi = (
  data: AppointmentRequestPayload
) => {
  return API.post(
    urls.appointmentRequestUrl,
    data,
    {
      validateStatus: () => true,
    }
  );
};

/* ================= GET APPOINTMENTS API ================= */

export const getAppointmentsApi = async (
  params?: GetAppointmentsParams
): Promise<Appointment[]> => {
  const response = await API.get(
    urls.appointmentsListUrl,
    {
      params,
      validateStatus: () => true,
    }
  );

  return response.data?.data || [];
};

/* ================= GET PENDING APPOINTMENTS FOR STANDARD ADMIN ================= */

export const getPendingAppointmentsApi = async (): Promise<PendingAppointment[]> => {
  const response = await API.get(
    urls.pendingAppoinmentsUrl,
    {
      validateStatus: () => true,
    }
  );

  return response.data?.data || [];
};