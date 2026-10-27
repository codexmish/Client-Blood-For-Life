"use client";

import { useForgetPassword } from "@/hooks";
import { errorMessage } from "@/utils";
import { forgetPasswordSchema } from "@/validation";
import { useForm } from "@tanstack/react-form";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { FieldError } from "../ui/field";
import { Spinner } from "../ui/spinner";
import { toast } from "../ui/toast";

const ForgotPasswordForm = () => {
  // -----router
  const router = useRouter();

  // -----tanstack query data destracture
  const { mutate: sendCode, isPending: sendPending } = useForgetPassword();

  // ------tanstack form
  const form = useForm({
    defaultValues: {
      email: "",
    },
    validators: {
      onSubmit: forgetPasswordSchema,
    },
    onSubmit: (data) => {
      const email = data.value.email.trim().toLowerCase();

      sendCode(email, {
        onSuccess: () => {
          toast.add({
            title: "Reset code sent",
            description: "Check your email",
            type: "success",
          });
          router.push(`/reset-password?email=${encodeURIComponent(email)}`);
        },
        onError: (err) => {
          toast.add({
            title: "Code not sent",
            description: errorMessage(err),
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
        <span className="text-[13px] font-bold tracking-[0.05em] text-[#8E1A20]">
          STEP 1 OF 2
        </span>
        <h1 className="text-[28px] font-bold leading-tight tracking-tight text-[#15171C]">
          Forgot your password?
        </h1>
        <p className="text-[15px] leading-normal text-[#5B616E]">
          Enter the email you signed up with. We will send a 6-digit code to
          reset it.
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
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="fp-email"
                  className="text-sm font-semibold text-[#15171C]"
                >
                  Email
                </label>
                <input
                  id="fp-email"
                  name={field.name}
                  type="email"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  placeholder="you@example.com"
                  autoComplete="email"
                  className={`h-[46px] w-full rounded-[10px] border bg-white px-3 text-[15px] text-[#15171C] outline-none placeholder:text-[#8A909B] focus:border-[#B4232A] focus:ring-3 focus:ring-[#B4232A]/20 ${
                    isValid ? "border-red-500" : "border-[#D5D8DE]"
                  }`}
                />
                {isValid && (
                  <FieldError
                    className="text-[13px]"
                    errors={field.state.meta.errors}
                  />
                )}
              </div>
            );
          }}
        </form.Field>

        <Button
          type="submit"
          disabled={sendPending}
          className="mt-1 h-12 w-full gap-2 rounded-[10px] bg-[#B4232A] text-[15px] font-semibold text-white hover:bg-[#951C22]"
        >
          {sendPending ? (
            <>
              Sending code <Spinner />
            </>
          ) : (
            "Send reset code"
          )}
        </Button>
      </form>

      {/* -------------footer */}
      <p className="text-center text-sm text-[#5B616E]">
        Remembered it?{" "}
        <Link
          href="/signin"
          className="font-semibold text-[#B4232A] hover:text-[#8E1A20]"
        >
          Back to sign in
        </Link>
      </p>
    </div>
  );
};

export default ForgotPasswordForm;
