import { urls } from "../Environment";
import { API } from "./api";

/* ================= ADMIN TYPE ================= */

export interface Admin {
  admin_user_id: number;
  first_name: string;
  middle_name?: string | null;
  last_name: string;
  email: string;
  phone_no: string;

  role: string;   //  IMPORTANT (fixes your error)

  created_on: string;
}

/* ================= CREATE ADMIN PAYLOAD ================= */

export interface CreateAdminPayload {
  first_name: string;
  middle_name?: string;
  last_name: string;
  email: string;
  phone_no: string;
  admin_type: number;   // 1,2,3
  gender?: number;
  password: string;
}

/* ================= CREATE ADMIN API ================= */

export const createAdminApi = (data: CreateAdminPayload) => {
  return API.post(urls.createAdminUrl, data, {
    validateStatus: () => true,
  });
};

/* ================= GET ALL ADMINS API ================= */

export const getAllAdminsApi = async (): Promise<Admin[]> => {
  const response = await API.get(urls.getAllAdminsUrl);

  return response.data.data.data;
};
