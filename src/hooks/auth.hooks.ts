import { userSignIn, userSignUp } from "@/api";
import { useMutation } from "@tanstack/react-query";

export function useSignin(){
    return useMutation({
        mutationFn: userSignIn
    })
}

export function useSignup(){
    return useMutation({
        mutationFn: userSignUp
    })
}