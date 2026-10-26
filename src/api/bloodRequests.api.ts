import apiClient from "@/lib/apiClient";
import { IBloodRequestQuery } from "@/types";

// ----get all blood requests
export const getBloodRequests = (query: IBloodRequestQuery) => {
  return apiClient("/blood-request/requests", {
    query: query,
  });
};
