import { getBloodRequests } from "@/api";
import { useQuery } from "@tanstack/react-query";

// -----get me
export function useBloodRequwsts() {
  return useQuery({
    queryKey: ["allBloodRequests"],
    queryFn: getBloodRequests,
    retry: false,
  });
}

