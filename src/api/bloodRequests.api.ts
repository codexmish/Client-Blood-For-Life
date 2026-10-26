import apiClient from "@/lib/apiClient";

// ----get all blood requests
export const getBloodRequests = (page: number) => {
  return apiClient("/blood-request/requests", {
    query: {page}
  });
};


