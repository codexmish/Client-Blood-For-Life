import { getBloodRequests } from "@/api";
import { IBloodRequestQuery } from "@/types";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

// -----get all blood requests
export function useBloodRequwsts(query: IBloodRequestQuery) {
  return useQuery({
    queryKey: ["allBloodRequests", query],
    queryFn: () => getBloodRequests(query),
    placeholderData: keepPreviousData,
    retry: false,
  });
}
