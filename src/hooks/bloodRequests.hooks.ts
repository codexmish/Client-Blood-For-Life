import { getBloodRequests } from "@/api";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

// -----get me
export function useBloodRequwsts(page: number) {
  return useQuery({
    queryKey: ["allBloodRequests", page],
    queryFn: ()=>getBloodRequests(page),
    placeholderData: keepPreviousData,
    retry: false,
  });
}

