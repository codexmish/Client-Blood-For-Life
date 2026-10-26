import apiClient from "@/lib/apiClient";
import { IBloodRequestQuery, ICreateBloodRequest } from "@/types";

// ----create blood request
export const createBloodRequest = (payload: ICreateBloodRequest) => {
  return apiClient("/blood-request/create", { method: "POST", body: payload });
};

// ----get all blood requests
export const getBloodRequests = (query: IBloodRequestQuery) => {
  return apiClient("/blood-request/requests", {
    query: query,
  });
};
