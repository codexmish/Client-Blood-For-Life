import apiClient from "@/lib/apiClient";
import type {
  BloodRequestStatus,
  IBloodRequestQuery,
  ICreateBloodRequest,
} from "@/types";

// ----get my open blood requests
export const getMyBloodRequests = (query: IBloodRequestQuery) => {
  return apiClient("/blood-request/my-requests", {
    query: query,
  });
};

// ----get single blood request
export const getSingleBloodRequest = (id: string) => {
  return apiClient(`/blood-request/request/${id}`);
};

// ----edit blood request
export const updateBloodRequest = ({
  id,
  payload,
}: {
  id: string;
  payload: Partial<ICreateBloodRequest>;
}) => {
  return apiClient(`/blood-request/request/${id}`, {
    method: "PATCH",
    body: payload,
  });
};

// ----update request status (fulfilled or cancelled)
export const updateRequestStatus = ({
  id,
  status,
}: {
  id: string;
  status: BloodRequestStatus.FULFILLED | BloodRequestStatus.CANCELLED;
}) => {
  return apiClient(`/blood-request/request/${id}/status`, {
    method: "PATCH",
    body: { status },
  });
};

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
