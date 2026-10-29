import {
  donateToRequest,
  getMyCommitments,
  getMyDonations,
  leaveRequest,
  publicDonatioin,
} from "@/api";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

// -----my completed donations (only call when user is donor)
export function useMyDonations(page: number, enabled: boolean) {
  return useQuery({
    queryKey: ["myDonations", page],
    queryFn: () => getMyDonations(page),
    placeholderData: keepPreviousData,
    enabled,
    retry: false,
  });
}

// -----public donations
export function usePublicDonation() {
  return useQuery({
    queryKey: ["publicDonation"],
    queryFn: publicDonatioin,
    retry: false,
  });
}

// -----my open commitments (only call when user is donor)
export function useMyCommitments(enabled: boolean) {
  return useQuery({
    queryKey: ["myCommitments"],
    queryFn: getMyCommitments,
    enabled,
    retry: false,
  });
}

// -----refresh everything that shows donors of a request
const useRefreshRequest = () => {
  const queryClient = useQueryClient();

  return (requestId: string) => {
    queryClient.invalidateQueries({ queryKey: ["bloodRequest", requestId] });
    queryClient.invalidateQueries({ queryKey: ["myCommitments"] });
    queryClient.invalidateQueries({ queryKey: ["allBloodRequests"] });
  };
};

// -----join a request
export function useDonateToRequest() {
  const refreshRequest = useRefreshRequest();

  return useMutation({
    mutationFn: donateToRequest,
    onSuccess: (_, requestId) => refreshRequest(requestId),
  });
}

// -----leave a request
export function useLeaveRequest() {
  const refreshRequest = useRefreshRequest();

  return useMutation({
    mutationFn: leaveRequest,
    onSuccess: (_, requestId) => refreshRequest(requestId),
  });
}
