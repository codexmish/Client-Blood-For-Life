import { userSignIn, userSignUp, userVerify } from "@/api";
import { useMutation } from "@tanstack/react-query";

// ------user sign in
export function useSignin() {
  return useMutation({
    mutationFn: userSignIn,
  });
}

// ------user sign up
export function useSignup() {
  return useMutation({
    mutationFn: userSignUp,
  });
}

// ------otp verify
export function useOtpVerify() {
  return useMutation({
    mutationFn: userVerify,
  });
}
