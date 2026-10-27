import apiClient from "@/lib/apiClient";
import type { IOtpVerify, ISignIn, ISignup } from "@/types";

// ------user sign in
export function userSignIn(payload: ISignIn) {
  return apiClient("/auth/signin", { method: "POST", body: payload });
}

// --------user sign up
export function userSignUp(payload: ISignup) {
  return apiClient("/auth/signup", { method: "POST", body: payload });
}

// -------otp verify
export function userVerify(payload: IOtpVerify) {
  return apiClient("/auth/otp-verify", { method: "POST", body: payload });
}

// -------resend otp (1 minute cooldown in backend)
export function resendOtp(email: string) {
  return apiClient("/auth/resend-otp", { method: "POST", body: { email } });
}

// ----get me
export const getMe = () => {
  return apiClient("/auth/me");
};

// -----logout
export const userLogout = () => {
  return apiClient("/auth/logout", {
    method: "POST",
  });
};
