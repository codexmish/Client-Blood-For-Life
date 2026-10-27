"use client";

import { useChangePassword } from "@/hooks";
import { errorMessage } from "@/utils";
import { changePasswordSchema } from "@/validation";
import { useForm } from "@tanstack/react-form";
import Link from "next/link";
import { Button } from "../ui/button";
import { FieldError } from "../ui/field";
import { Spinner } from "../ui/spinner";
import { toast } from "../ui/toast";

// -----design classes
const labelClass = "text-sm font-semibold text-[#15171C]";
const inputClass = (invalid: boolean) =>
  `h-[46px] w-full rounded-[10px] border bg-white px-3 text-[15px] text-[#15171C] outline-none placeholder:text-[#8A909B] focus:border-[#B4232A] focus:ring-3 focus:ring-[#B4232A]/20 ${
    invalid ? "border-red-500" : "border-[#D5D8DE]"
  }`;

// -----the three password fields
const passwordFields = [
  {
    name: "oldPassword",
    label: "Current password",
    autoComplete: "current-password",
    placeholder: "",
  },
  {
    name: "newPassword",
    label: "New password",
    autoComplete: "new-password",
    placeholder: "8–32 characters",
  },
  {
    name: "confirmPassword",
    label: "Confirm new password",
    autoComplete: "new-password",
    placeholder: "",
  },
] as const;

const ChangePasswordForm = () => {
  // -----tanstack query data destracture
  const { mutate: change, isPending: changePending } = useChangePassword();

  // ------tanstack form
  const form = useForm({
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    validators: {
      onSubmit: changePasswordSchema,
    },
    onSubmit: (data) => {
      change(
        {
          oldPassword: data.value.oldPassword,
          newPassword: data.value.newPassword,
        },
        {
          onSuccess: () => {
            toast.add({ title: "Password updated", type: "success" });
            form.reset();
          },
          onError: (err) =>
            toast.add({
              title: "Password not updated",
              description: errorMessage(err),
              type: "error",
            }),
        },
      );
    },
  });

  return (
    <form
      className="flex flex-col gap-[18px]"
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
    >
      {passwordFields.map((item, index) => (
        <form.Field key={item.name} name={item.name}>
          {(field) => {
            const isValid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <div
                className={`flex flex-col gap-1.5 ${index === 0 ? "max-w-[420px]" : ""}`}
              >
                <label htmlFor={`cp-${item.name}`} className={labelClass}>
                  {item.label}
                </label>
                <input
                  id={`cp-${item.name}`}
                  name={field.name}
                  type="password"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  placeholder={item.placeholder}
                  autoComplete={item.autoComplete}
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
      ))}

      {/* -------------footer */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/forgot-password"
          className="text-sm font-semibold text-[#B4232A] hover:text-[#8E1A20]"
        >
          Forgot your current password?
        </Link>
        <Button
          type="submit"
          disabled={changePending}
          className="h-[46px] gap-2 rounded-[10px] bg-[#B4232A] px-[18px] text-[15px] font-semibold text-white hover:bg-[#951C22]"
        >
          {changePending ? (
            <>
              Updating <Spinner />
            </>
          ) : (
            "Update password"
          )}
        </Button>
      </div>
    </form>
  );
};

export default ChangePasswordForm;
