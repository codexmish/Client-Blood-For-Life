import { registerDonor } from "@/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

// -----register as donor
export function useRegisterDonor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: registerDonor,
    onSuccess: () => {
      // ----user now has donor data and DONOR role
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });
}
