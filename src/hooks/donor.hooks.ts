import {
  getDonors,
  getSingleDonor,
  registerDonor,
  updateAvailability,
  updateDonor,
} from "@/api";
import type { IDonorQuery } from "@/types";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

// -----turn availability on or off
export function useUpdateAvailability() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateAvailability,
    onSuccess: () => {
      // ----user.donor.isAvailable changed, donor list changes too
      queryClient.invalidateQueries({ queryKey: ["user"] });
      queryClient.invalidateQueries({ queryKey: ["donors"] });
    },
  });
}

// -----update donor details
export function useUpdateDonor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateDonor,
    onSuccess: () => {
      // ----last donation date changes eligibility
      queryClient.invalidateQueries({ queryKey: ["user"] });
      queryClient.invalidateQueries({ queryKey: ["donors"] });
    },
  });
}

// -----register as donor
export function useRegisterDonor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: registerDonor,
    onSuccess: () => {
      // ----user now has donor data and DONOR role
      queryClient.invalidateQueries({ queryKey: ["user"] });
      queryClient.invalidateQueries({ queryKey: ["donors"] });
    },
  });
}

// -----donor list (only call when logged in)
export function useDonors(query: IDonorQuery, enabled: boolean) {
  return useQuery({
    queryKey: ["donors", query],
    queryFn: () => getDonors(query),
    placeholderData: keepPreviousData,
    enabled,
    retry: false,
  });
}

// -----single donor (only call when logged in)
export function useSingleDonor(id: string, enabled: boolean) {
  return useQuery({
    queryKey: ["donor", id],
    queryFn: () => getSingleDonor(id),
    enabled,
    retry: false,
  });
}
