import apiClient from "@/lib/apiClient";
import type { IOtpVerify, IResetPassword, ISignIn, ISignup } from "@/types";

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

// -------forget password (sends reset code to email)
export function forgetPassword(email: string) {
  return apiClient("/auth/forget-password", { method: "POST", body: { email } });
}

// -------reset password with code
export function resetPassword(payload: IResetPassword) {
  return apiClient("/auth/reset-password", { method: "POST", body: payload });
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
