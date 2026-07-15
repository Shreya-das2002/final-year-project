import { urls } from "../Environment";
import { API } from "./api";

/* ================= CONTACT MESSAGE PAYLOAD ================= */

export interface SendContactMessagePayload {
  name: string;
  email: string;
  message: string;
}

/* ================= CONTACT MESSAGE RESPONSE ================= */

export interface SendContactMessageResponse {
  success: boolean;
  message: string;
  data?: Record<string, unknown>;
  errorCode?: string | null;
}

/* ================= SEND CONTACT MESSAGE API ================= */

export const sendContactMessageApi = (data: SendContactMessagePayload) => {
  return API.post<SendContactMessageResponse>(
    urls.sendContactMessageUrl,
    data,
    {
      validateStatus: () => true,
    }
  );
};