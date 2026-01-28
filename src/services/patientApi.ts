import { urls } from "../Environment";
import { API } from "./api";


/* ================= FETCH PROFILE TYPE ================= */
export interface PatientProfilePayload {
  firstName: string;
  middleName: string;
  lastName: string;
  email: string;
  phone: string;
  gender: string;
  age: string;
  password: string;
  dob: string;
  bloodGroup: string;
  allergies: string[];
  medicalCondition: string[];
  height: string;
  weight: string;
  currentAddress: string;
  permanentAddress: string;
  occupation: string;
  maritalStatus: string;
  alcohol: string;
  smoking: string;
}

/* ================= SAVE PROFILE TYPE ================= */
export interface SavePatientProfilePayload {
  dob: string;
  bloodGroup: string;
  height: string;
  weight: string;
  currentAddress: string;
  permanentAddress: string;
}

/* ================= APIs ================= */

export const getPatientProfileApi = () => {
  return API.get(urls.profileurl);
};

export const savePatientProfileApi = (
  payload: SavePatientProfilePayload
) => {
  return API.post(urls.profileurl, payload);
};
