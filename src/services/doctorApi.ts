import { urls } from "../Environment";
import { API } from "./api";

/* ================= DOCTOR TYPE ================= */

export interface Address {
  address_line_1: string | null;
  address_line_2: string | null;
  city: string | null;
  district: string | null;
  state: string | null;
  country: string | null;
  pin: string ;

}

export interface Experience {
  organization_name: string | null;
  designation: string | null;
  start_date: string | null;
  end_date: string | null;
  responsibilities: string | null;
}
export interface Doctor {

  doctor_id: number;

  first_name: string;
  middle_name?: string | null;
  last_name: string;
  dob?: string | null;


  email: string;
  phone_no: string;

  gender?: string;    
  doctor_no?: string;
  license_number?: string;
  registration_number?: string;
  experience?: number;      
  specialization?: string;
  bio?: string;  
  status: string;
  current_address: Address | null;
  permanent_address: Address | null;
  doctor_experiences?: Experience[];
  created_on?: string;

}


export interface HomepageDoctor {

  doctor_id: number;

  name: string;

  specialization: string;

  bio?: string;

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

export const getDoctorListApi = async (
  specializationId?: number
): Promise<Doctor[]> => {

  const response = await API.get(
    urls.getDoctorListUrl,
    {
      params: {
        specializationId
      }
    }
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