"use client";

import { useUpdateProfile } from "@/hooks";
import type { IUpdateProfile, IUser } from "@/types";
import { bloodGroupLabel, errorMessage } from "@/utils";
import { updateProfileSchema } from "@/validation";
import { useForm } from "@tanstack/react-form";
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
const readOnlyClass =
  "h-[46px] w-full rounded-[10px] border border-[#D5D8DE] bg-[#F4F5F7] px-3 text-[15px] text-[#4A505C] outline-none";

const ProfileForm = ({ user }: { user: IUser }) => {
  // -----tanstack query data destracture
  const { mutate: update, isPending: updatePending } = useUpdateProfile();

  // ------tanstack form
  const form = useForm({
    defaultValues: {
      name: user.name,
      phone: user.phone ?? "",
      address: user.address ?? "",
    },
    validators: {
      onSubmit: updateProfileSchema,
    },
    onSubmit: (data) => {
      const profileData: IUpdateProfile = {
        name: data.value.name.trim(),
        // ----empty field is not sent
        phone: data.value.phone.trim() || undefined,
        address: data.value.address.trim() || undefined,
      };

      update(profileData, {
        onSuccess: () =>
          toast.add({ title: "Profile updated", type: "success" }),
        onError: (err) =>
          toast.add({
            title: "Profile not updated",
            description: errorMessage(err),
            type: "error",
          }),
      });
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
      <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-[18px]">
        {/* -------------name */}
        <form.Field name="name">
          {(field) => {
            const isValid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <div className="flex flex-col gap-1.5">
                <label htmlFor="pf-name" className={labelClass}>
                  Full name
                </label>
                <input
                  id="pf-name"
                  name={field.name}
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  autoComplete="name"
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

        {/* -------------phone */}
        <form.Field name="phone">
          {(field) => {
            const isValid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <div className="flex flex-col gap-1.5">
                <label htmlFor="pf-phone" className={labelClass}>
                  Phone
                </label>
                <input
                  id="pf-phone"
                  name={field.name}
                  type="tel"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  placeholder="01XXXXXXXXX"
                  autoComplete="tel"
                  className={inputClass(isValid)}
                />
                {isValid ? (
                  <FieldError
                    className="text-[13px]"
                    errors={field.state.meta.errors}
                  />
                ) : (
                  <p className={hintClass}>Needed to become a donor.</p>
                )}
              </div>
            );
          }}
        </form.Field>
      </div>

      {/* -------------address */}
      <form.Field name="address">
        {(field) => {
          const isValid =
            field.state.meta.isTouched && !field.state.meta.isValid;
          return (
            <div className="flex flex-col gap-1.5">
              <label htmlFor="pf-address" className={labelClass}>
                Address
              </label>
              <input
                id="pf-address"
                name={field.name}
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
                placeholder="Area, city — e.g. Mirpur 10, Dhaka"
                autoComplete="street-address"
                className={inputClass(isValid)}
              />
              {isValid ? (
                <FieldError
                  className="text-[13px]"
                  errors={field.state.meta.errors}
                />
              ) : (
                <p className={hintClass}>
                  Donors are found by area. Needed to become a donor.
                </p>
              )}
            </div>
          );
        }}
      </form.Field>

      {/* -------------email and blood group (can't change) */}
      <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-[18px]">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="pf-email" className={labelClass}>
            Email
          </label>
          <input
            id="pf-email"
            value={user.email}
            readOnly
            className={readOnlyClass}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="pf-group" className={labelClass}>
            Blood group
          </label>
          <input
            id="pf-group"
            value={bloodGroupLabel[user.bloodGroup] ?? user.bloodGroup}
            readOnly
            className={readOnlyClass}
          />
        </div>
      </div>

      {/* -------------button */}
      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={updatePending}
          className="h-[46px] gap-2 rounded-[10px] bg-[#B4232A] px-[18px] text-[15px] font-semibold text-white hover:bg-[#951C22]"
        >
          {updatePending ? (
            <>
              Saving <Spinner />
            </>
          ) : (
            "Save changes"
          )}
        </Button>
      </div>
    </form>
  );
};

export default ProfileForm;
