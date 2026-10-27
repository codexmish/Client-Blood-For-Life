import { changePassword, updateProfile, uploadAvatar } from "@/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

// -----update profile
export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateProfile,
    onSuccess: () => {
      // ----navbar and profile show new data
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });
}

// -----upload avatar
export function useUploadAvatar() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: uploadAvatar,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });
}

// -----change password
export function useChangePassword() {
  return useMutation({
    mutationFn: changePassword,
  });
}
