import apiClient from "@/lib/apiClient";

export function userSignIn(payload: { email: string; password: string }) {
  return apiClient("/auth/signin", { method: "POST", body: payload });
}
