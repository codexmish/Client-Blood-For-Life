import apiClient from "@/lib/apiClient";
import type { IAdminDonationQuery } from "@/types";

// -----all donations with full details (admin only)
export function getAllDonations(query: IAdminDonationQuery) {
  return apiClient("/donation/", { query: query });
}
