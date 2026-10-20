"use client";

import { userSignupSchema } from "@/validation";
import { useForm } from "@tanstack/react-form";
import { Field, FieldError, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { useState } from "react";
import { EyeClosed, EyeIcon } from "lucide-react";
import { useSignup } from "@/hooks";
import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";
import { useRouter } from "next/navigation";
import { BloodGroupList, ISignup } from "@/types";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { toast } from "../ui/toast";

const SignupForm = () => {
  // -----pass show state
  const [showPass, setShowPass] = useState(false);

  // -----router
  const router = useRouter();

  // -----blood group data
  const bloodGroupItems = [
    { label: "Select blood group", value: null },
    { label: "A+", value: BloodGroupList.A_POSITIVE },
    { label: "A−", value: BloodGroupList.A_NEGATIVE },
    { label: "B+", value: BloodGroupList.B_POSITIVE },
    { label: "B−", value: BloodGroupList.B_NEGATIVE },
    { label: "AB+", value: BloodGroupList.AB_POSITIVE },
    { label: "AB−", value: BloodGroupList.AB_NEGATIVE },
    { label: "O+", value: BloodGroupList.O_POSITIVE },
    { label: "O−", value: BloodGroupList.O_NEGATIVE },
  ];

  // -----tanstack query data destracture
  const { mutate: signup, isPending: signupPending } = useSignup();

  // ------tanstack form
  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      bloodGroup: "" as BloodGroupList,
      password: "",
    },
    validators: {
      onSubmit: userSignupSchema,
    },
    onSubmit: (data) => {
      const signupData: ISignup = {
        name: data.value.name,
        email: data.value.email,
        bloodGroup: data.value.bloodGroup,
        password: data.value.password,
      };
      signup(signupData, {
        onSuccess: (res) => {
          toast.add({
            title: "SignUp successfull",
            description: "Pleache Check Your email and verify otp",
            type: "success",
          });

          router.push("/otp-verify");
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
        {/* -------------name */}
        <form.Field name="name">
          {(field) => {
            const isValid =
              field.state.meta.isTouched && !field.state.meta.isValid;

            return (
              <Field className="gap-1.5">
                <FieldLabel
                  htmlFor={field.name}
                  className="text-sm font-semibold text-[#15171C]"
                >
                  Name
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

        {/* -------------Blood Group */}
        <form.Field name="bloodGroup">
          {(field) => {
            const isValid =
              field.state.meta.isTouched && !field.state.meta.isValid;

            return (
              <Field className="gap-1.5">
                <FieldLabel
                  htmlFor={field.name}
                  className="text-sm font-semibold text-[#15171C]"
                >
                  Blood Group
                </FieldLabel>

                <Select
                  items={bloodGroupItems}
                  name={field.name}
                  onValueChange={(value) =>
                    field.handleChange(value as BloodGroupList)
                  }
                  value={field.state.value}
                  autoComplete="off"
                >
                  <SelectTrigger className="w-full max-w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Fruits</SelectLabel>
                      {bloodGroupItems.map((item) => (
                        <SelectItem key={item.value} value={item.value}>
                          {item.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>

                {/* <Input
                  id={field.name}
                  name={field.name}
                  onChange={(e) => field.handleChange(e.target.value)}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  autoComplete="off"
                  placeholder="you@example.com"
                  className={`h-[46px] rounded-[10px] border-[#D5D8DE] bg-white px-3 text-[15px] text-[#15171C] placeholder:text-[#8A909B] focus-visible:border-[#B4232A] focus-visible:ring-[#B4232A]/20 md:text-[15px] ${isValid ? "border-red-500" : ""}`}
                /> */}
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

        {/* ---------button */}
        <Button
          disabled={signupPending}
          type="submit"
          className="mt-1 h-12 w-full gap-2 rounded-[10px] bg-[#B4232A] text-[15px] font-semibold text-white hover:bg-[#951C22]"
        >
          {signupPending ? (
            <>
              Signing up <Spinner />
            </>
          ) : (
            "Sign up"
          )}
        </Button>
      </form>
    </div>
  );
};

export default SignupForm;
