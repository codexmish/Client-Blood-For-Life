import {
  createBloodRequest,
  getBloodRequests,
  getSingleBloodRequest,
  updateBloodRequest,
  updateRequestStatus,
} from "@/api";
import { IBloodRequestQuery } from "@/types";
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
      // ----old request list is stale now
      queryClient.invalidateQueries({ queryKey: ["allBloodRequests"] });
    },
  });
}

// -----get all blood requests
export function useBloodRequwsts(query: IBloodRequestQuery) {
  return useQuery({
    queryKey: ["allBloodRequests", query],
    queryFn: () => getBloodRequests(query),
    placeholderData: keepPreviousData,
    retry: false,
  });
}
