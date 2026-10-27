"use client";

import { useForgetPassword, useResetPassword } from "@/hooks";
import { errorMessage } from "@/utils";
import { resetPasswordSchema } from "@/validation";
import { useForm } from "@tanstack/react-form";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { FieldError } from "../ui/field";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "../ui/input-otp";
import { Spinner } from "../ui/spinner";
import { toast } from "../ui/toast";

// -----design classes
const labelClass = "text-sm font-semibold text-[#15171C]";
const inputClass = (invalid: boolean) =>
  `h-[46px] w-full rounded-[10px] border bg-white px-3 text-[15px] text-[#15171C] outline-none placeholder:text-[#8A909B] focus:border-[#B4232A] focus:ring-3 focus:ring-[#B4232A]/20 ${
    invalid ? "border-red-500" : "border-[#D5D8DE]"
  }`;

const ResetPasswordForm = () => {
  // -----email from url
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? "";

  // -----router
  const router = useRouter();

  // -----tanstack query data destracture
  const { mutate: reset, isPending: resetPending } = useResetPassword();
  const { mutate: resend, isPending: resendPending } = useForgetPassword();

  // -----resend countdown (code was just sent, so start at 60)
  const [secondsLeft, setSecondsLeft] = useState(60);

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const timer = setTimeout(() => setSecondsLeft(secondsLeft - 1), 1000);
    return () => clearTimeout(timer);
  }, [secondsLeft]);

  // ------tanstack form
  const form = useForm({
    defaultValues: {
      otp: "",
      newPassword: "",
      confirmPassword: "",
    },
    validators: {
      onSubmit: resetPasswordSchema,
    },
    onSubmit: (data) => {
      reset(
        { email, otp: data.value.otp, newPassword: data.value.newPassword },
        {
          onSuccess: () => {
            toast.add({
              title: "Password reset",
              description: "Sign in with your new password",
              type: "success",
            });
            router.push("/signin");
          },
          onError: (err) => {
            toast.add({
              title: "Password not reset",
              description: errorMessage(err),
              type: "error",
            });
          },
        },
      );
    },
  });

  // -----send a new code (same api as step 1)
  const handleResend = () => {
    resend(email, {
      onSuccess: () => {
        toast.add({
          title: "New code sent",
          description: "Check your email",
          type: "success",
        });
        setSecondsLeft(60);
        form.setFieldValue("otp", "");
      },
      onError: (err) => {
        toast.add({
          title: "Code not sent",
          description: errorMessage(err),
          type: "error",
        });
      },
    });
  };

  // -----0:45 style
  const countdown = `${Math.floor(secondsLeft / 60)}:${String(secondsLeft % 60).padStart(2, "0")}`;

  // -----no email in url
  if (!email) {
    return (
      <div className="flex flex-col items-start gap-4 rounded-[20px] border border-[#E3E5EA] bg-white p-6 sm:p-8">
        <h1 className="text-[28px] font-bold leading-tight tracking-tight text-[#15171C]">
          Start from step 1
        </h1>
        <p className="text-[15px] text-[#5B616E]">
          We need your email to send a reset code.
        </p>
        <Link
          href="/forgot-password"
          className="inline-flex h-12 items-center justify-center rounded-[10px] bg-[#B4232A] px-[22px] text-[15px] font-semibold text-white transition-colors hover:bg-[#951C22]"
        >
          Forgot password
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 rounded-[20px] border border-[#E3E5EA] bg-white p-6 sm:p-8">
      {/* -------------heading */}
      <div className="flex flex-col gap-1.5">
        <span className="text-[13px] font-bold tracking-[0.05em] text-[#8E1A20]">
          STEP 2 OF 2
        </span>
        <h1 className="text-[28px] font-bold leading-tight tracking-tight text-[#15171C]">
          Set a new password
        </h1>
        <p className="text-[15px] leading-normal text-[#5B616E]">
          We sent a code to{" "}
          <strong className="break-words font-semibold text-[#15171C]">
            {email}
          </strong>
          . It expires in 5 minutes.
        </p>
      </div>

      <form
        className="flex flex-col gap-[18px]"
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
      >
        {/* -------------code */}
        <form.Field name="otp">
          {(field) => {
            const isValid =
              field.state.meta.isTouched && !field.state.meta.isValid;

            // -----same style for all 6 boxes
            const slotClass = `h-14 w-auto flex-1 rounded-[12px] border border-[#D5D8DE] bg-white text-2xl font-bold text-[#15171C] first:rounded-[12px] first:border-l last:rounded-[12px] data-[active=true]:border-[#B4232A] data-[active=true]:ring-3 data-[active=true]:ring-[#B4232A]/20 sm:h-[60px] ${isValid ? "border-red-500" : ""}`;

            return (
              <fieldset className="flex flex-col">
                <legend className={`${labelClass} mb-1.5`}>Reset code</legend>
                <InputOTP
                  maxLength={6}
                  name={field.name}
                  value={field.state.value}
                  onChange={(value) => field.handleChange(value)}
                  onBlur={field.handleBlur}
                  autoComplete="one-time-code"
                  containerClassName="w-full"
                >
                  <InputOTPGroup className="w-full gap-2">
                    {[0, 1, 2, 3, 4, 5].map((index) => (
                      <InputOTPSlot
                        key={index}
                        index={index}
                        className={slotClass}
                      />
                    ))}
                  </InputOTPGroup>
                </InputOTP>
                {isValid && (
                  <FieldError
                    className="mt-1.5 text-[13px]"
                    errors={field.state.meta.errors}
                  />
                )}
              </fieldset>
            );
          }}
        </form.Field>

        {/* -------------new password */}
        <form.Field name="newPassword">
          {(field) => {
            const isValid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <div className="flex flex-col gap-1.5">
                <label htmlFor="rp-new" className={labelClass}>
                  New password
                </label>
                <input
                  id="rp-new"
                  name={field.name}
                  type="password"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  placeholder="8–32 characters"
                  autoComplete="new-password"
                  className={inputClass(isValid)}
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

        {/* -------------confirm password */}
        <form.Field name="confirmPassword">
          {(field) => {
            const isValid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <div className="flex flex-col gap-1.5">
                <label htmlFor="rp-confirm" className={labelClass}>
                  Confirm new password
                </label>
                <input
                  id="rp-confirm"
                  name={field.name}
                  type="password"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  placeholder="Type it again"
                  autoComplete="new-password"
                  className={inputClass(isValid)}
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
          disabled={resetPending}
          className="mt-1 h-12 w-full gap-2 rounded-[10px] bg-[#B4232A] text-[15px] font-semibold text-white hover:bg-[#951C22]"
        >
          {resetPending ? (
            <>
              Resetting <Spinner />
            </>
          ) : (
            "Reset password"
          )}
        </Button>
      </form>

      {/* -------------resend */}
      <div className="flex items-center justify-between gap-3 text-sm text-[#5B616E]">
        <span>Didn’t get it?</span>
        <button
          type="button"
          onClick={handleResend}
          disabled={secondsLeft > 0 || resendPending}
          className="inline-flex min-h-11 cursor-pointer items-center gap-2 text-sm font-semibold text-[#B4232A] hover:text-[#8E1A20] disabled:cursor-not-allowed disabled:text-[#5B616E]"
        >
          {resendPending ? (
            <>
              Sending <Spinner />
            </>
          ) : secondsLeft > 0 ? (
            `Resend in ${countdown}`
          ) : (
            "Resend code"
          )}
        </button>
      </div>

      <p className="rounded-[10px] bg-[#E6F2EC] px-3.5 py-3 text-sm font-medium text-[#1D5E40]">
        After resetting, sign in with your new password.
      </p>
    </div>
  );
};

export default ResetPasswordForm;
