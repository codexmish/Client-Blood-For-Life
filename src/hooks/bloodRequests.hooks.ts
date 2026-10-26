import { createBloodRequest, getBloodRequests } from "@/api";
import { IBloodRequestQuery } from "@/types";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

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
