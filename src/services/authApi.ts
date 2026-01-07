import { API } from "./api";

/* ---------- Types ---------- */

export interface LoginPayload {
  email: string;
  password: string;
}

export interface SignupPayload {
  first_name: string;
  middle_name?: string;
  last_name: string;
  email: string;
  phone: string;
  password: string;
  confirm_password: string;
  gender: string;
}

/* ---------- API Calls ---------- */

export const loginApi = (data: LoginPayload) => {
  return API.post("/auth/login", data);
};

export const signupApi = (data: SignupPayload) => {
  return API.post("/auth/signup", data);
};
