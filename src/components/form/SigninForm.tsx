"use client";
import { useForm } from "@tanstack/react-form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Field, FieldError, FieldLabel } from "../ui/field";
import { userSignInSchema } from "@/validation";
import { useState } from "react";
import { EyeClosed, EyeIcon } from "lucide-react";
import { useSignin } from "@/hooks";
import { useRouter } from "next/navigation";
import { toast } from "../ui/toast";
import { Spinner } from "../ui/spinner";
import Link from "next/link";

const SigninForm = () => {
  // -----pass show state
  const [showPass, setShowPass] = useState(false);
  // -----router
  const router = useRouter();

  // -----tanstack query data destracture
  const { mutate: signIn, isPending: signinPending } = useSignin();

  // ------tanstack form
  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    validators: {
      onSubmit: userSignInSchema,
    },
    onSubmit: (data) => {
      const loginData = {
        email: data.value.email,
        password: data.value.password,
      };

      signIn(loginData, {
        onSuccess: (res) => {
          toast.add({
            title: "SignIn successfull",
            description: "Welcome Back",
            type: "success",
          });
          router.push("/");
        },
        onError: (err) => {
          toast.add({
            title: "Authorization failed",
            description: "Something Went Wrong",
            type: "error",
          });
        },
      });
    },
  });

  return (
    <div className="flex flex-col gap-6 rounded-[20px] border border-[#E3E5EA] bg-white p-6 sm:p-8">
      {/* -------------heading */}
      <div className="flex flex-col gap-1.5">
        <h1 className="text-[28px] font-bold leading-tight tracking-tight text-[#15171C]">
          Welcome back
        </h1>
        <p className="text-[15px] text-[#5B616E]">
          Sign in to post requests or respond to them.
        </p>
      </div>

      <form
        className="flex flex-col gap-[18px]"
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
      >
        {/* -------------email */}
        <form.Field name="email">
          {(field) => {
            const isValid =
              field.state.meta.isTouched && !field.state.meta.isValid;

            return (
              <Field className="gap-1.5">
                <FieldLabel
                  htmlFor={field.name}
                  className="text-sm font-semibold text-[#15171C]"
                >
                  Email
                </FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  onChange={(e) => field.handleChange(e.target.value)}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  autoComplete="off"
                  placeholder="you@example.com"
                  className={`h-[46px] rounded-[10px] border-[#D5D8DE] bg-white px-3 text-[15px] text-[#15171C] placeholder:text-[#8A909B] focus-visible:border-[#B4232A] focus-visible:ring-[#B4232A]/20 md:text-[15px] ${isValid ? "border-red-500" : ""}`}
                />
                {isValid && (
                  <FieldError
                    className="text-[13px]"
                    errors={field.state.meta.errors}
                  />
                )}
              </Field>
            );
          }}
        </form.Field>

        {/* ----------password */}
        <form.Field name="password">
          {(field) => {
            const isValid =
              field.state.meta.isTouched && !field.state.meta.isValid;

            return (
              <Field className="gap-1.5">
                <FieldLabel
                  htmlFor={field.name}
                  className="text-sm font-semibold text-[#15171C]"
                >
                  Password
                </FieldLabel>
                <div className="relative">
                  <Input
                    id={field.name}
                    name={field.name}
                    onChange={(e) => field.handleChange(e.target.value)}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    autoComplete="off"
                    placeholder="Your password"
                    className={`h-[46px] rounded-[10px] border-[#D5D8DE] bg-white pl-3 pr-12 text-[15px] text-[#15171C] placeholder:text-[#8A909B] focus-visible:border-[#B4232A] focus-visible:ring-[#B4232A]/20 md:text-[15px] ${isValid ? "border-red-500" : ""}`}
                    type={showPass ? "text" : "password"}
                  />
                  <button
                    className="absolute right-1 top-1/2 flex size-10 -translate-y-1/2 items-center justify-center rounded-lg text-[#5B616E] transition-colors hover:bg-[#F0F1F4] hover:text-[#15171C]"
                    type="button"
                    aria-label={showPass ? "Hide password" : "Show password"}
                    onClick={() => setShowPass(!showPass)}
                  >
                    {showPass ? (
                      <EyeClosed className="size-[18px]" />
                    ) : (
                      <EyeIcon className="size-[18px]" />
                    )}
                  </button>
                </div>
                {isValid && (
                  <FieldError
                    className="text-[13px]"
                    errors={field.state.meta.errors}
                  />
                )}
              </Field>
            );
          }}
        </form.Field>

        <Button
          disabled={signinPending}
          type="submit"
          className="mt-1 h-12 w-full gap-2 rounded-[10px] bg-[#B4232A] text-[15px] font-semibold text-white hover:bg-[#951C22]"
        >
          {signinPending ? (
            <>
              Signing in <Spinner />
            </>
          ) : (
            "Sign in"
          )}
        </Button>
      </form>

      {/* -------------footer */}
      <p className="text-center text-sm text-[#5B616E]">
        New here?{" "}
        <Link
          href="/signup"
          className="font-semibold text-[#B4232A] hover:text-[#8E1A20]"
        >
          Create an account
        </Link>
      </p>
    </div>
  );
};

export default SigninForm;
