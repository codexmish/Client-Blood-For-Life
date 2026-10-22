import apiClient from "@/lib/apiClient";
import { IOtpVerify, ISignIn, ISignup } from "@/types";


// ------user sign in
export function userSignIn(payload: ISignIn) {
  return apiClient("/auth/signin", { method: "POST", body: payload });
}

// --------user sign up
export function userSignUp(payload: ISignup){
  return apiClient("/auth/signup", { method: "POST", body: payload });
}


// -------otp verify
export function userVerify(payload: IOtpVerify){
  return apiClient("/auth/otp-verify", {method: "POST", body: payload})
}
