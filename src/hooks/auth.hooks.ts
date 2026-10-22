import { getMe, userLogout, userSignIn, userSignUp, userVerify } from "@/api";
import { useMutation, useQuery } from "@tanstack/react-query";

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

// -----get me
export function useGetMe() {
  return useQuery({
    queryKey: ["user"],
    queryFn: getMe,
    retry: false,
  });
}

// -------logout
export function useLogout() {
  return useMutation({
    mutationFn: userLogout,
  });
}
