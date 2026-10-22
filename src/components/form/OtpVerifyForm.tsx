import { otpVerifySchema } from "@/validation";
import { useForm } from "@tanstack/react-form";
import { Field, FieldError, FieldLabel } from "../ui/field";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "../ui/input-otp";
import { Button } from "../ui/button";
import { IOtpVerify } from "@/types";
import { useRouter, useSearchParams } from "next/navigation";
import { useOtpVerify } from "@/hooks";
import { toast } from "../ui/toast";
import { Spinner } from "../ui/spinner";

const OtpVerifyForm = () => {
  // -----getting eamil from params
  const searchParams = useSearchParams();
  const otpEmail = searchParams.get("email");

  // -----tanstack query data destracture
  const { mutate: verify, isPending: verifyPending } = useOtpVerify();

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
      console.log(verifyData);
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
    <div>
      <form
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
            return (
              <Field>
                <FieldLabel htmlFor={field.name}>OTP</FieldLabel>
                <InputOTP
                  maxLength={6}
                  id={field.name}
                  name={field.name}
                  onChange={(value) => field.handleChange(value)}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  autoComplete="off"
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                  </InputOTPGroup>
                  <InputOTPSeparator />
                  <InputOTPGroup>
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
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
              Verifing <Spinner />
            </>
          ) : (
            "Verify"
          )}
        </Button>
      </form>
    </div>
  );
};

export default OtpVerifyForm;
