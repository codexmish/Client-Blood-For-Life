import { publicDonatioin } from "@/api";
import { useQuery } from "@tanstack/react-query";

// -----get me
export function usePublicDonation() {
  return useQuery({
    queryKey: ["publicDonation"],
    queryFn: publicDonatioin,
    retry: false,
  });
}
