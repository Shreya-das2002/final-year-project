import { urls } from "../Environment";
import { API } from "./api";

export interface deleteAcoountPayload {
  admin_user_id: number;
  status: "Active" | "Inactive";
}

export const deleteAccountApi = async (data: deleteAcoountPayload ) => {
  return API.put(urls.deleteAcoountUrl, data, { 
    validateStatus: () => true, 
  });
}