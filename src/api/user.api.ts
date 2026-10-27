import apiClient from "@/lib/apiClient";
import type { IChangePassword, IUpdateProfile } from "@/types";

// -----update name, phone, address
export function updateProfile(payload: IUpdateProfile) {
  return apiClient("/user/update", { method: "PATCH", body: payload });
}

// -----upload avatar (multipart, field name "avater")
export function uploadAvatar(file: File) {
  const formData = new FormData();
  formData.append("avater", file);

  return apiClient("/user/avater", { method: "PATCH", body: formData });
}

// -----change password
export function changePassword(payload: IChangePassword) {
  return apiClient("/auth/change-password", { method: "PATCH", body: payload });
}
