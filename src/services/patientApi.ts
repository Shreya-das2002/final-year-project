import { API } from "./api";

/* ---------- Types ---------- */

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

/* ---------- API Calls ---------- */

export const getPatientProfileApi = () => {
  return API.get("/patient/profile");
};

export const savePatientProfileApi = (data: PatientProfilePayload) => {
  return API.post("/patient/profile", data);
};
