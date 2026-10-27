import { otpVerifySchema } from "@/validation";
import { useForm } from "@tanstack/react-form";
import { Field, FieldError, FieldLabel } from "../ui/field";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "../ui/input-otp";
import { Button } from "../ui/button";
import type { IOtpVerify } from "@/types";
import { useRouter, useSearchParams } from "next/navigation";
import { useOtpVerify, useResendOtp } from "@/hooks";
import { toast } from "../ui/toast";
import { Spinner } from "../ui/spinner";
import Link from "next/link";
import { useEffect, useState } from "react";
import { errorMessage } from "@/utils";

const OtpVerifyForm = () => {
  // -----getting eamil from params
  const searchParams = useSearchParams();
  const otpEmail = searchParams.get("email");

  // -----tanstack query data destracture
  const { mutate: verify, isPending: verifyPending } = useOtpVerify();
  const { mutate: resend, isPending: resendPending } = useResendOtp();

  // -----resend countdown (code was just sent, so start at 60)
  const [secondsLeft, setSecondsLeft] = useState(60);

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const timer = setTimeout(() => setSecondsLeft(secondsLeft - 1), 1000);
    return () => clearTimeout(timer);
  }, [secondsLeft]);

  // -----resend code
  const handleResend = () => {
    if (!otpEmail) return;

    resend(otpEmail, {
      onSuccess: () => {
        toast.add({
          title: "New code sent",
          description: "Check your email",
          type: "success",
        });
        setSecondsLeft(60);
        // ----old code doesn't work anymore
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

  const router = useRouter();

  // --------tanstack form
  const form = useForm({
    defaultValues: {
      email: otpEmail ?? "",
      otp: "",
    },
    validators: {
      onSubmit: otpVerifySchema,
    },
    onSubmit: (data) => {
      console.log(data);
      const verifyData: IOtpVerify = {
        email: otpEmail as string,
        otp: data.value.otp,
      };
      verify(verifyData, {
        onSuccess: (res) => {
          toast.add({
            title: "otp verified successfull",
            description: "Welcome",
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
        <span className="text-[13px] font-bold tracking-[0.05em] text-[#8E1A20]">
          STEP 2 OF 2
        </span>
        <h1 className="text-[28px] font-bold leading-tight tracking-tight text-[#15171C]">
          Check your email
        </h1>
        <p className="text-[15px] text-[#5B616E]">
          Enter the 6-digit code we sent to{" "}
          <strong className="break-words font-semibold text-[#15171C]">
            {otpEmail}
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
        {/* -------otp */}
        <form.Field name="otp">
          {(field) => {
            const isValid =
              field.state.meta.isTouched && !field.state.meta.isValid;

            // -----same style for all 6 boxes
            const slotClass = `h-14 w-auto flex-1 rounded-[12px] border border-[#D5D8DE] bg-white text-2xl font-bold text-[#15171C] first:rounded-[12px] first:border-l last:rounded-[12px] data-[active=true]:border-[#B4232A] data-[active=true]:ring-3 data-[active=true]:ring-[#B4232A]/20 sm:h-[60px] ${isValid ? "border-red-500" : ""}`;

            return (
              <Field className="gap-1.5">
                <FieldLabel
                  htmlFor={field.name}
                  className="text-sm font-semibold text-[#15171C]"
                >
                  Verification code
                </FieldLabel>
                <InputOTP
                  maxLength={6}
                  id={field.name}
                  name={field.name}
                  onChange={(value) => field.handleChange(value)}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  autoComplete="off"
                  containerClassName="w-full"
                >
                  <InputOTPGroup className="w-full gap-2">
                    <InputOTPSlot index={0} className={slotClass} />
                    <InputOTPSlot index={1} className={slotClass} />
                    <InputOTPSlot index={2} className={slotClass} />
                    <InputOTPSlot index={3} className={slotClass} />
                    <InputOTPSlot index={4} className={slotClass} />
                    <InputOTPSlot index={5} className={slotClass} />
                  </InputOTPGroup>
                </InputOTP>

                {/* ----error */}
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
          disabled={verifyPending}
          type="submit"
          className="mt-1 h-12 w-full gap-2 rounded-[10px] bg-[#B4232A] text-[15px] font-semibold text-white hover:bg-[#951C22]"
        >
          {verifyPending ? (
            <>
              Verifying <Spinner />
            </>
          ) : (
            "Verify and continue"
          )}
        </Button>
      </form>

      {/* -------------resend */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-3 text-sm text-[#5B616E]">
          <span>Didn’t get it?</span>
          <button
            type="button"
            onClick={handleResend}
            disabled={secondsLeft > 0 || resendPending || !otpEmail}
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
        <p className="rounded-[10px] bg-[#F4F5F7] px-3.5 py-3 text-[13.5px] text-[#4A505C]">
          You can ask for a new code once a minute. The old code stops working
          when a new one is sent.
        </p>
      </div>

      {/* -------------footer */}
      <p className="text-center text-sm text-[#5B616E]">
        Wrong email?{" "}
        <Link
          href="/signup"
          className="font-semibold text-[#B4232A] hover:text-[#8E1A20]"
        >
          Sign up again
        </Link>
      </p>
    </div>
  );
};

export default OtpVerifyForm;
