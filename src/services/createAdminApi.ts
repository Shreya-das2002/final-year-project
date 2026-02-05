import { urls } from "../Environment";
import { API } from "./api";

/* ---------- Payload Type ---------- */

export interface CreateAdminPayload {
  first_name: string;
  middle_name?: string;
  last_name: string;
  email: string;
  phone_no: string;
  admin_type: number;   // 1,2,3
  gender?: number;      // domain_lookup value
  password: string;
}

/* ---------- API Call ---------- */

export const createAdminApi = (data: CreateAdminPayload) => {
  return API.post(urls.createAdminUrl, data, {
    validateStatus: () => true, // accept all status codes
  });
};

export const getAllAdminsApi = async () => {
  const response = await API.get(urls.getAllAdminsUrl);
  return response.data.data;
};
