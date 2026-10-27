import {
  createBloodRequest,
  getBloodRequests,
  getMyBloodRequests,
  getSingleBloodRequest,
  updateBloodRequest,
  updateRequestStatus,
} from "@/api";
import type { IBloodRequestQuery } from "@/types";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

// -----get single blood request (only call when logged in)
export function useSingleBloodRequest(id: string, enabled: boolean) {
  return useQuery({
    queryKey: ["bloodRequest", id],
    queryFn: () => getSingleBloodRequest(id),
    enabled,
    retry: false,
  });
}

// -----edit blood request
export function useUpdateBloodRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateBloodRequest,
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["bloodRequest", id] });
      queryClient.invalidateQueries({ queryKey: ["allBloodRequests"] });
      queryClient.invalidateQueries({ queryKey: ["myBloodRequests"] });
    },
  });
}

// -----mark request fulfilled or cancelled
export function useUpdateRequestStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateRequestStatus,
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["bloodRequest", id] });
      queryClient.invalidateQueries({ queryKey: ["allBloodRequests"] });
      queryClient.invalidateQueries({ queryKey: ["myBloodRequests"] });
      // ----fulfilled adds new donations
      queryClient.invalidateQueries({ queryKey: ["publicDonation"] });
    },
  });
}

// -----create blood request
export function useCreateBloodRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createBloodRequest,
    onSuccess: () => {
      // ----old request lists are stale now
      queryClient.invalidateQueries({ queryKey: ["allBloodRequests"] });
      queryClient.invalidateQueries({ queryKey: ["myBloodRequests"] });
    },
  });
}

// -----get all blood requests (only call when logged in)
export function useBloodRequwsts(query: IBloodRequestQuery, enabled = true) {
  return useQuery({
    queryKey: ["allBloodRequests", query],
    queryFn: () => getBloodRequests(query),
    placeholderData: keepPreviousData,
    enabled,
    retry: false,
  });
}

// -----get my open blood requests (only call when logged in)
export function useMyBloodRequests(
  query: IBloodRequestQuery,
  enabled: boolean,
) {
  return useQuery({
    queryKey: ["myBloodRequests", query],
    queryFn: () => getMyBloodRequests(query),
    placeholderData: keepPreviousData,
    enabled,
    retry: false,
  });
}
