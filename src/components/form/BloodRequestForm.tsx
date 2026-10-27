"use client";

import { useCreateBloodRequest, useUpdateBloodRequest } from "@/hooks";
import {
  BloodGroupList,
  type ICreateBloodRequest,
  type ISingleBloodRequest,
  UrgencyList,
} from "@/types";
import { createBloodRequestSchema } from "@/validation";
import { useForm } from "@tanstack/react-form";
import { Minus, Plus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { FieldError } from "../ui/field";
import { Spinner } from "../ui/spinner";
import { toast } from "../ui/toast";

// -----blood group data
const bloodGroupItems = [
  { label: "A+", value: BloodGroupList.A_POSITIVE },
  { label: "A−", value: BloodGroupList.A_NEGATIVE },
  { label: "B+", value: BloodGroupList.B_POSITIVE },
  { label: "B−", value: BloodGroupList.B_NEGATIVE },
  { label: "AB+", value: BloodGroupList.AB_POSITIVE },
  { label: "AB−", value: BloodGroupList.AB_NEGATIVE },
  { label: "O+", value: BloodGroupList.O_POSITIVE },
  { label: "O−", value: BloodGroupList.O_NEGATIVE },
];

// -----urgency data
const urgencyItems = [
  {
    label: "Normal",
    hint: "Planned surgery or a later date",
    value: UrgencyList.NORMAL,
  },
  {
    label: "Urgent",
    hint: "Needed within a day or two",
    value: UrgencyList.URGENT,
  },
  { label: "Emergency", hint: "Needed today", value: UrgencyList.EMERGENCY },
];

// -----design classes
const labelClass = "text-sm font-semibold text-[#15171C]";
const hintClass = "text-[13px] text-[#5B616E]";
const inputClass = (invalid: boolean) =>
  `h-[46px] w-full rounded-[10px] border bg-white px-3 text-[15px] text-[#15171C] outline-none placeholder:text-[#8A909B] focus:border-[#B4232A] focus:ring-3 focus:ring-[#B4232A]/20 ${
    invalid ? "border-red-500" : "border-[#D5D8DE]"
  }`;

// -----backend message (ofetch keeps it in err.data)
const errorMessage = (err: unknown) =>
  (err as { data?: { message?: string } }).data?.message ??
  "Something Went Wrong";

// -----editRequest given = edit mode, not given = create mode
const BloodRequestForm = ({
  editRequest,
}: {
  editRequest?: ISingleBloodRequest;
}) => {
  const isEdit = !!editRequest;

  // -----donors already joined (edit mode)
  const joined = editRequest?._count.donors ?? 0;

  // -----router
  const router = useRouter();

  // -----tanstack query data destracture
  const { mutate: createRequest, isPending: createPending } =
    useCreateBloodRequest();
  const { mutate: updateRequest, isPending: updatePending } =
    useUpdateBloodRequest();
  const isPending = createPending || updatePending;

  // ------tanstack form
  const form = useForm({
    defaultValues: {
      bloodGroup: editRequest?.bloodGroup ?? ("" as BloodGroupList),
      patientName: editRequest?.patientName ?? "",
      bagsNeeded: editRequest?.bagsNeeded ?? 1,
      hospitalName: editRequest?.hospitalName ?? "",
      address: editRequest?.address ?? "",
      // ----date input needs YYYY-MM-DD
      needAt: editRequest?.needAt.slice(0, 10) ?? "",
      phoneNumber: editRequest?.phoneNumber ?? "",
      urgency: editRequest?.urgency ?? UrgencyList.NORMAL,
      note: editRequest?.note ?? "",
    },
    validators: {
      onSubmit: createBloodRequestSchema,
    },
    onSubmit: (data) => {
      const requestData: ICreateBloodRequest = {
        bloodGroup: data.value.bloodGroup,
        patientName: data.value.patientName,
        bagsNeeded: data.value.bagsNeeded,
        hospitalName: data.value.hospitalName,
        address: data.value.address,
        needAt: data.value.needAt,
        phoneNumber: data.value.phoneNumber,
        urgency: data.value.urgency,
        // ----empty note is not sent
        note: data.value.note.trim() || undefined,
      };

      // ----edit mode
      if (editRequest) {
        updateRequest(
          { id: editRequest.id, payload: requestData },
          {
            onSuccess: () => {
              toast.add({ title: "Request updated", type: "success" });
              router.push(`/blood-request/${editRequest.id}`);
            },
            onError: (err) => {
              toast.add({
                title: "Request not updated",
                description: errorMessage(err),
                type: "error",
              });
            },
          },
        );
        return;
      }

      // ----create mode
      createRequest(requestData, {
        onSuccess: () => {
          toast.add({
            title: "Request posted",
            description: "Matching donors can see it now",
            type: "success",
          });
          router.push("/blood-request");
        },
        onError: (err) => {
          toast.add({
            title: "Request not posted",
            description: errorMessage(err),
            type: "error",
          });
        },
      });
    },
  });

  return (
    <form
      className="flex min-w-0 flex-[999_1_600px] flex-col gap-[26px] rounded-[20px] border border-[#E3E5EA] bg-white p-6 sm:p-8"
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
    >
      {/* -------------heading */}
      <div className="flex flex-col gap-1.5">
        <h1 className="text-[28px] font-bold tracking-[-0.02em] text-[#15171C] sm:text-[34px]">
          {isEdit ? "Edit blood request" : "Post a blood request"}
        </h1>
        <p className="text-[#5B616E]">
          {isEdit
            ? "Donors see the new details right away."
            : "Matching donors see it in their feed right away."}
        </p>
      </div>

      {/* -------------blood group */}
      <form.Field name="bloodGroup">
        {(field) => {
          const isValid =
            field.state.meta.isTouched && !field.state.meta.isValid;

          return (
            <fieldset className="flex flex-col gap-1.5">
              <legend className={`${labelClass} mb-1.5`}>
                Blood group needed
              </legend>
              <div className="flex flex-wrap gap-2">
                {bloodGroupItems.map((item) => {
                  const selected = field.state.value === item.value;
                  return (
                    <button
                      key={item.value}
                      type="button"
                      aria-pressed={selected}
                      disabled={joined > 0}
                      onClick={() => field.handleChange(item.value)}
                      className={`h-12 min-w-14 cursor-pointer rounded-xl border px-3 text-[17px] font-bold transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${
                        selected
                          ? "border-[#B4232A] bg-[#B4232A] text-white"
                          : "border-[#D5D8DE] bg-white text-[#15171C] hover:border-[#B4232A]"
                      }`}
                    >
                      {item.label}
                    </button>
                  );
                })}
              </div>
              {isValid && (
                <FieldError
                  className="text-[13px]"
                  errors={field.state.meta.errors}
                />
              )}
              {joined > 0 && (
                <p className={hintClass}>
                  Donors already joined, so the blood group can’t change.
                </p>
              )}
            </fieldset>
          );
        }}
      </form.Field>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-[18px]">
        {/* -------------patient name */}
        <form.Field name="patientName">
          {(field) => {
            const isValid =
              field.state.meta.isTouched && !field.state.meta.isValid;

            return (
              <div className="flex flex-col gap-1.5">
                <label htmlFor={field.name} className={labelClass}>
                  Patient name
                </label>
                <input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  placeholder="Rahim Uddin"
                  autoComplete="off"
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

        {/* -------------bags needed */}
        <form.Field name="bagsNeeded">
          {(field) => (
            <fieldset className="flex flex-col">
              <legend className={`${labelClass} mb-1.5`}>Bags needed</legend>
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  aria-label="Fewer bags"
                  disabled={field.state.value <= Math.max(1, joined)}
                  onClick={() => field.handleChange(field.state.value - 1)}
                  className="inline-flex size-12 cursor-pointer items-center justify-center rounded-[10px] border border-[#D5D8DE] bg-white text-[#15171C] transition-colors hover:bg-[#F0F1F4] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Minus className="size-5" />
                </button>
                <output className="min-w-10 text-center text-2xl font-bold text-[#15171C]">
                  {field.state.value}
                </output>
                <button
                  type="button"
                  aria-label="More bags"
                  disabled={field.state.value >= 5}
                  onClick={() => field.handleChange(field.state.value + 1)}
                  className="inline-flex size-12 cursor-pointer items-center justify-center rounded-[10px] border border-[#D5D8DE] bg-white text-[#15171C] transition-colors hover:bg-[#F0F1F4] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Plus className="size-5" />
                </button>
                <span className={hintClass}>
                  {joined > 0 ? `${joined}–5 bags` : "1–5 bags"}
                </span>
              </div>
            </fieldset>
          )}
        </form.Field>
      </div>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-[18px]">
        {/* -------------hospital */}
        <form.Field name="hospitalName">
          {(field) => {
            const isValid =
              field.state.meta.isTouched && !field.state.meta.isValid;

            return (
              <div className="flex flex-col gap-1.5">
                <label htmlFor={field.name} className={labelClass}>
                  Hospital
                </label>
                <input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  placeholder="Dhaka Medical College Hospital"
                  autoComplete="off"
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

        {/* -------------address */}
        <form.Field name="address">
          {(field) => {
            const isValid =
              field.state.meta.isTouched && !field.state.meta.isValid;

            return (
              <div className="flex flex-col gap-1.5">
                <label htmlFor={field.name} className={labelClass}>
                  Address
                </label>
                <input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  placeholder="Area, city"
                  autoComplete="off"
                  className={inputClass(isValid)}
                />
                {isValid ? (
                  <FieldError
                    className="text-[13px]"
                    errors={field.state.meta.errors}
                  />
                ) : (
                  <p className={hintClass}>
                    Donors search by area, so include it.
                  </p>
                )}
              </div>
            );
          }}
        </form.Field>
      </div>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-[18px]">
        {/* -------------needed on */}
        <form.Field name="needAt">
          {(field) => {
            const isValid =
              field.state.meta.isTouched && !field.state.meta.isValid;

            return (
              <div className="flex flex-col gap-1.5">
                <label htmlFor={field.name} className={labelClass}>
                  Needed on
                </label>
                <input
                  id={field.name}
                  name={field.name}
                  type="date"
                  min={new Date().toLocaleDateString("en-CA")}
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
                  <p className={hintClass}>Today or a later date.</p>
                )}
              </div>
            );
          }}
        </form.Field>

        {/* -------------phone */}
        <form.Field name="phoneNumber">
          {(field) => {
            const isValid =
              field.state.meta.isTouched && !field.state.meta.isValid;

            return (
              <div className="flex flex-col gap-1.5">
                <label htmlFor={field.name} className={labelClass}>
                  Contact phone
                </label>
                <input
                  id={field.name}
                  name={field.name}
                  type="tel"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  placeholder="01XXXXXXXXX"
                  autoComplete="off"
                  className={inputClass(isValid)}
                />
                {isValid ? (
                  <FieldError
                    className="text-[13px]"
                    errors={field.state.meta.errors}
                  />
                ) : (
                  <p className={hintClass}>
                    Shown on the request so donors can call.
                  </p>
                )}
              </div>
            );
          }}
        </form.Field>
      </div>

      {/* -------------urgency */}
      <form.Field name="urgency">
        {(field) => (
          <fieldset className="flex flex-col">
            <legend className={`${labelClass} mb-1.5`}>
              How urgent is it?
            </legend>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-2.5">
              {urgencyItems.map((item) => {
                const selected = field.state.value === item.value;
                return (
                  <label
                    key={item.value}
                    className={`flex min-h-12 cursor-pointer flex-col gap-1 rounded-xl border p-3.5 transition-colors ${
                      selected
                        ? "border-[#B4232A] bg-[#FBEAEA]/50"
                        : "border-[#D5D8DE] bg-white hover:border-[#B4232A]"
                    }`}
                  >
                    <span className="flex items-center gap-2 font-semibold text-[#15171C]">
                      <input
                        type="radio"
                        name={field.name}
                        value={item.value}
                        checked={selected}
                        onChange={() => field.handleChange(item.value)}
                        className="size-[18px] accent-[#B4232A]"
                      />
                      {item.label}
                    </span>
                    <span className={hintClass}>{item.hint}</span>
                  </label>
                );
              })}
            </div>
          </fieldset>
        )}
      </form.Field>

      {/* -------------note */}
      <form.Field name="note">
        {(field) => {
          const isValid =
            field.state.meta.isTouched && !field.state.meta.isValid;

          return (
            <div className="flex flex-col gap-1.5">
              <label htmlFor={field.name} className={labelClass}>
                Note{" "}
                <span className="font-normal text-[#5B616E]">(optional)</span>
              </label>
              <textarea
                id={field.name}
                name={field.name}
                rows={3}
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
                placeholder="Ward, floor, best time to call…"
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

      {/* -------------buttons */}
      <div className="flex flex-wrap justify-end gap-3 border-t border-[#E3E5EA] pt-5">
        <Link
          href={isEdit ? `/blood-request/${editRequest.id}` : "/blood-request"}
          className="inline-flex h-12 items-center justify-center rounded-[10px] border border-[#D5D8DE] bg-white px-[22px] text-[15px] font-semibold text-[#15171C] transition-colors hover:bg-[#F0F1F4]"
        >
          Cancel
        </Link>
        <Button
          type="submit"
          disabled={isPending}
          className="h-12 gap-2 rounded-[10px] bg-[#B4232A] px-[22px] text-[15px] font-semibold text-white hover:bg-[#951C22]"
        >
          {isPending ? (
            <>
              {isEdit ? "Saving" : "Posting"} <Spinner />
            </>
          ) : isEdit ? (
            "Save changes"
          ) : (
            "Post request"
          )}
        </Button>
      </div>
    </form>
  );
};

export default BloodRequestForm;
