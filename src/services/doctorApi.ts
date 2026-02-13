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

export interface HomepageDoctor {

  doctor_id: number;

  name: string;

  specialization: string;

}

export interface UpdateDoctorStatusPayload {
  doctor_id: number;
  status: "Active" | "Rejected";
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

/* ================= UPDATE DOCTOR STATUS ================= */

export const updateDoctorStatusApi = (
  data: UpdateDoctorStatusPayload
) => {
  return API.put(
    urls.updateDoctorStatusUrl,
    data,
    {
      validateStatus: () => true
    }
  );
};

/* ================= GET DOCTOR LIST API ================= */

export const getDoctorListApi = async (): Promise<Doctor[]> => {

  const response = await API.get(
    urls.getDoctorListUrl
  );

  return response.data.data;

};

/* ================= GET HOMEPAGE DOCTORS ================= */

export const getHomepageDoctorsApi = async () => {

  const response = await API.get(
    urls.getHomepageDoctorsUrl
  );

  return response.data.data;

};