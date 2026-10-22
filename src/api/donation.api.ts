import apiClient from "@/lib/apiClient";

// ------prev donation data public
export function publicDonatioin() {
  return apiClient("donation/public");
}
