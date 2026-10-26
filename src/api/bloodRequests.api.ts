import apiClient from "@/lib/apiClient";

// ----get all blood requests
export const getBloodRequests = () => {
  return apiClient("/blood-request/requests");
};


