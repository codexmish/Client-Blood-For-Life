import { userSignIn } from "@/api";
import { useMutation } from "@tanstack/react-query";

export function useSignin(){
    return useMutation({
        mutationFn: userSignIn
    })
}