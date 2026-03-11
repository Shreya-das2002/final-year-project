import { urls } from "../Environment";
import { API } from "./api";

/* ================= DASHBOARD COUNT TYPE ================= */

export interface DashboardCount {

  patientCount: number;

  doctorCount: number;

}

/* ================= GET DASHBOARD COUNT API ================= */

export const getDashboardCountApi = async (): Promise<DashboardCount> => {

  const response = await API.get(
    urls.dashboardCountUrl
  );

  return response.data.data;

};