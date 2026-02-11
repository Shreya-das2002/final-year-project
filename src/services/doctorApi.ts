import { urls } from "../Environment";
import { API } from "./api";

/* ================= DOCTOR TYPE ================= */

export interface Doctor {

  doctor_id: number;

  first_name: string;
  middle_name?: string | null;
  last_name: string;

  email: string;
  phone_no: string;

  gender?: string;          // ADD THIS
  specialization?: string;  // ADD THIS

  status: string;

  created_on?: string;

}


/* ================= CREATE DOCTOR PAYLOAD ================= */

export interface CreateDoctorPayload {

  first_name: string;
  middle_name?: string;

  last_name: string;

  email: string;
  phone_no: string;

  gender: number;
  specialization: number;

  password: string;
  confirm_password: string;

}


/* ================= CREATE DOCTOR API ================= */

export const createDoctorApi = (data: CreateDoctorPayload) => {

  return API.post(
    urls.createDoctorUrl,
    data,
    {
      validateStatus: () => true,
    }
  );

};


/* ================= GET PENDING DOCTORS API ================= */

export const getPendingDoctorsApi = async (): Promise<Doctor[]> => {

  const response = await API.get(
    urls.getPendingDoctorsUrl
  );

  return response.data.data;

};
