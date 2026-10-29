import { getAllDonations } from "@/api";
import type { IAdminDonationQuery } from "@/types";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

// -----donation report (page only renders for admin)
export function useAllDonations(query: IAdminDonationQuery) {
  return useQuery({
    queryKey: ["adminDonations", query],
    queryFn: () => getAllDonations(query),
    placeholderData: keepPreviousData,
    retry: false,
  });
}
