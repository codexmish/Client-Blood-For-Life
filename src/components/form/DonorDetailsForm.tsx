"use client";

import { useUpdateDonor } from "@/hooks";
import type { IRegisterDonor, IUserDonor } from "@/types";
import { errorMessage } from "@/utils";
import { updateDonorSchema } from "@/validation";
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

const DonorDetailsForm = ({ donor }: { donor: IUserDonor }) => {
  // -----tanstack query data destracture
  const { mutate: update, isPending: updatePending } = useUpdateDonor();

  // ------tanstack form
  const form = useForm({
    defaultValues: {
      weight: donor.weight ?? "",
      // ----date input needs YYYY-MM-DD
      lastDonationDate: donor.lastDonationDate?.slice(0, 10) ?? "",
      healthNote: donor.healthNote ?? "",
    },
    validators: {
      onSubmit: updateDonorSchema,
    },
    onSubmit: (data) => {
      const donorData: IRegisterDonor = {
        // ----empty fields are not sent
        weight: data.value.weight.trim() || undefined,
        lastDonationDate: data.value.lastDonationDate || undefined,
        healthNote: data.value.healthNote.trim() || undefined,
      };

      // ----backend needs at least one field
      if (Object.values(donorData).every((value) => value === undefined)) {
        toast.add({
          title: "Nothing to save",
          description: "Fill in at least one field",
          type: "error",
        });
        return;
      }

      update(donorData, {
        onSuccess: () =>
          toast.add({ title: "Donor details saved", type: "success" }),
        onError: (err) =>
          toast.add({
            title: "Details not saved",
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
        {/* -------------weight */}
        <form.Field name="weight">
          {(field) => {
            const isValid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <div className="flex flex-col gap-1.5">
                <label htmlFor="ds-weight" className={labelClass}>
                  Weight (kg)
                </label>
                <input
                  id="ds-weight"
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
                <label htmlFor="ds-last" className={labelClass}>
                  Last donation date
                </label>
                <input
                  id="ds-last"
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
                    Donated somewhere else? Update it here.
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
              <label htmlFor="ds-note" className={labelClass}>
                Health note
              </label>
              <textarea
                id="ds-note"
                name={field.name}
                rows={3}
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
                className={`${inputClass(isValid)} h-auto resize-y py-2.5`}
              />
              {isValid ? (
                <FieldError
                  className="text-[13px]"
                  errors={field.state.meta.errors}
                />
              ) : (
                <p className={hintClass}>Up to 300 characters.</p>
              )}
            </div>
          );
        }}
      </form.Field>

      {/* -------------footer */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-[#5B616E]">
          Total donations:{" "}
          <strong className="text-[#15171C]">{donor.totalDonations}</strong> —
          updated automatically.
        </p>
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
            "Save details"
          )}
        </Button>
      </div>
    </form>
  );
};

export default DonorDetailsForm;
