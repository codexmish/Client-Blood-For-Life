import apiClient from "@/lib/apiClient";
import type { IDonorQuery, IRegisterDonor } from "@/types";

// -----register as donor (only recipient, needs phone and address)
export function registerDonor(payload: IRegisterDonor) {
  return apiClient("/donor/register", { method: "POST", body: payload });
}

// -----available and eligible donors
export function getDonors(query: IDonorQuery) {
  return apiClient("/donor/donors", { query: query });
}

// -----single donor
export function getSingleDonor(id: string) {
  return apiClient(`/donor/${id}`);
}

// -----turn availability on or off
export function updateAvailability(isAvailable: boolean) {
  return apiClient("/donor/me/availability", {
    method: "PATCH",
    body: { isAvailable },
  });
}

// -----update weight, last donation date, health note
export function updateDonor(payload: IRegisterDonor) {
  return apiClient("/donor/me", { method: "PATCH", body: payload });
}
