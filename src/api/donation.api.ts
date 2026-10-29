import apiClient from "@/lib/apiClient";

// ------prev donation data public
export function publicDonatioin() {
  return apiClient("donation/public");
}

// ------my open commitments (donor only)
export function getMyCommitments() {
  return apiClient("/donation/my-commitments", { query: { limit: 50 } });
}

// ------join a request as donor
export function donateToRequest(requestId: string) {
  return apiClient(`/donation/${requestId}`, { method: "POST" });
}

// ------leave a request (step back)
export function leaveRequest(requestId: string) {
  return apiClient(`/donation/${requestId}`, { method: "DELETE" });
}

// ------my completed donations
export function getMyDonations(page: number) {
  return apiClient("/donation/my-donations", { query: { page } });
}
