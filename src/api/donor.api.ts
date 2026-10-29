import apiClient from "@/lib/apiClient";
import type { IRegisterDonor } from "@/types";

// -----register as donor (only recipient, needs phone and address)
export function registerDonor(payload: IRegisterDonor) {
  return apiClient("/donor/register", { method: "POST", body: payload });
}
