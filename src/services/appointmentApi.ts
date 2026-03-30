import { urls } from "../Environment";
import { API } from "./api";

export interface AppointmentRequestPayload {
  patient_id: number;
  doctor_id: number;
  doctor_availability_id: number;
  booking_date: string;   
}

export const appointmentRequestApi = (
  data: AppointmentRequestPayload
) => {
  return API.post(urls.appointmentRequestUrl, data, {
    validateStatus: () => true,
  });
};