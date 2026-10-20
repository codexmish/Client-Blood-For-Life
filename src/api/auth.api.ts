import apiClient from "@/lib/apiClient";
import { ISignIn, ISignup } from "@/types";

export function userSignIn(payload: ISignIn) {
  return apiClient("/auth/signin", { method: "POST", body: payload });
}


export function userSignUp(payload: ISignup){
  return apiClient("/auth/signup", { method: "POST", body: payload });
}
