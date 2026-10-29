import {
  forgetPassword,
  getMe,
  resendOtp,
  resetPassword,
  userLogout,
  userSignIn,
  userSignUp,
  userVerify,
} from "@/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// ------user sign in
export function useSignin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: userSignIn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
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
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: userVerify,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });
}

// ------resend otp
export function useResendOtp() {
  return useMutation({
    mutationFn: resendOtp,
  });
}

// ------forget password
export function useForgetPassword() {
  return useMutation({
    mutationFn: forgetPassword,
  });
}

// ------reset password
export function useResetPassword() {
  return useMutation({
    mutationFn: resetPassword,
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
