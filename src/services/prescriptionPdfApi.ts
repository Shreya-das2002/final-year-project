import type { AxiosResponse } from "axios";
import { urls } from "../Environment";
import { API } from "./api";

export interface prescriptionPdfPayload {
  appointment_id: number;
  patient_id: number;
}

export const getprescriptionPdfApi = (
  data: prescriptionPdfPayload
): Promise<AxiosResponse<Blob>> => {
  return API.post(urls.prescriptionPdfUrl, data, {
    responseType: "blob",
    validateStatus: () => true,
  });
};