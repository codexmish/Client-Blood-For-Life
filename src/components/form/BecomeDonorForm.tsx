"use client";

import { useRegisterDonor } from "@/hooks";
import type { IRegisterDonor } from "@/types";
import { errorMessage } from "@/utils";
import { registerDonorSchema } from "@/validation";
import { useForm } from "@tanstack/react-form";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { FieldError } from "../ui/field";
import { Spinner } from "../ui/spinner";
import { toast } from "../ui/toast";

// -----design classes
const labelClass = "text-sm font-semibold text-[#15171C]";
const hintClass = "text-[13px] text-[#5B616E]";
const inputClass = (invalid: boolean) =>
  `h-[46px] w-full rounded-[10px] border bg-white px-3 text-[15px] text-[#15171C] outline-none placeholder:text-[#8A909B] focus:border-[#B4232A] focus:ring-3 focus:ring-[#B4232A]/20 ${
    invalid ? "border-red-500" : "border-[#D5D8DE]"
  }`;

// -----canSubmit false = phone or address missing
const BecomeDonorForm = ({ canSubmit }: { canSubmit: boolean }) => {
  // -----router
  const router = useRouter();

  // -----tanstack query data destracture
  const { mutate: register, isPending: registerPending } = useRegisterDonor();

  // ------tanstack form
  const form = useForm({
    defaultValues: {
      weight: "",
      lastDonationDate: "",
      healthNote: "",
      agree: false,
    },
    validators: {
      onSubmit: registerDonorSchema,
    },
    onSubmit: (data) => {
      const donorData: IRegisterDonor = {
        // ----empty fields are not sent
        weight: data.value.weight.trim() || undefined,
        lastDonationDate: data.value.lastDonationDate || undefined,
        healthNote: data.value.healthNote.trim() || undefined,
      };

      register(donorData, {
        onSuccess: () => {
          toast.add({
            title: "You are a donor now",
            description: "Thank you for joining",
            type: "success",
          });
          router.push("/dashboard/profile");
        },
        onError: (err) => {
          toast.add({
            title: "Not registered",
            description: errorMessage(err),
            type: "error",
          });
        },
      });
    },
  });

  return (
    <form
      className="flex flex-col gap-[18px] border-t border-[#E3E5EA] pt-[22px]"
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
    >
      <p className="text-sm text-[#5B616E]">
        All fields are optional — you can fill them in later.
      </p>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-[18px]">
        {/* -------------weight */}
        <form.Field name="weight">
          {(field) => {
            const isValid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <div className="flex flex-col gap-1.5">
                <label htmlFor="bd-weight" className={labelClass}>
                  Weight (kg)
                </label>
                <input
                  id="bd-weight"
                  name={field.name}
                  inputMode="decimal"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  placeholder="e.g. 62"
                  autoComplete="off"
                  className={inputClass(isValid)}
                />
                {isValid ? (
                  <FieldError
                    className="text-[13px]"
                    errors={field.state.meta.errors}
                  />
                ) : (
                  <p className={hintClass}>At least 50 kg.</p>
                )}
              </div>
            );
          }}
        </form.Field>

        {/* -------------last donation date */}
        <form.Field name="lastDonationDate">
          {(field) => {
            const isValid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <div className="flex flex-col gap-1.5">
                <label htmlFor="bd-last" className={labelClass}>
                  Last donation date
                </label>
                <input
                  id="bd-last"
                  name={field.name}
                  type="date"
                  max={new Date().toLocaleDateString("en-CA")}
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  className={inputClass(isValid)}
                />
                {isValid ? (
                  <FieldError
                    className="text-[13px]"
                    errors={field.state.meta.errors}
                  />
                ) : (
                  <p className={hintClass}>
                    Leave empty if you have never donated.
                  </p>
                )}
              </div>
            );
          }}
        </form.Field>
      </div>

      {/* -------------health note */}
      <form.Field name="healthNote">
        {(field) => {
          const isValid =
            field.state.meta.isTouched && !field.state.meta.isValid;
          return (
            <div className="flex flex-col gap-1.5">
              <label htmlFor="bd-note" className={labelClass}>
                Health note
              </label>
              <textarea
                id="bd-note"
                name={field.name}
                rows={3}
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
                placeholder="Anything a requester should know (up to 300 characters)"
                className={`${inputClass(isValid)} h-auto resize-y py-2.5`}
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

      {/* -------------confirm */}
      <form.Field name="agree">
        {(field) => {
          const isValid =
            field.state.meta.isTouched && !field.state.meta.isValid;
          return (
            <div className="flex flex-col gap-1.5">
              <label className="flex min-h-11 cursor-pointer items-start gap-2.5 text-[15px] leading-normal text-[#15171C]">
                <input
                  type="checkbox"
                  name={field.name}
                  checked={field.state.value}
                  onChange={(e) => field.handleChange(e.target.checked)}
                  onBlur={field.handleBlur}
                  className="mt-0.5 size-5 flex-none accent-[#B4232A]"
                />
                I am healthy and weigh at least 50 kg. I will only donate when
                four months have passed since my last donation.
              </label>
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

      {/* -------------buttons */}
      <div className="flex flex-wrap justify-end gap-3">
        <Link
          href="/dashboard/profile"
          className="inline-flex h-12 items-center justify-center rounded-[10px] border border-[#D5D8DE] bg-white px-[22px] text-[15px] font-semibold text-[#15171C] transition-colors hover:bg-[#F0F1F4]"
        >
          Not now
        </Link>
        <Button
          type="submit"
          disabled={!canSubmit || registerPending}
          className="h-12 gap-2 rounded-[10px] bg-[#B4232A] px-[22px] text-[15px] font-semibold text-white hover:bg-[#951C22]"
        >
          {registerPending ? (
            <>
              Registering <Spinner />
            </>
          ) : (
            "Register as a donor"
          )}
        </Button>
      </div>
    </form>
  );
};

export default BecomeDonorForm;
