"use client";
import { useForm } from "@tanstack/react-form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Field, FieldError, FieldLabel } from "../ui/field";
import { userSignInSchema } from "@/validation";
import { useState } from "react";
import { EyeClosed, EyeIcon } from "lucide-react";
import { useSignin } from "@/hooks";
import { useRouter } from "next/navigation";
import { toast } from "../ui/toast";
import { Spinner } from "../ui/spinner";

const SigninForm = () => {
  // -----pass show state
  const [showPass, setShowPass] = useState(false);
  // -----router
  const router = useRouter();

  // -----tanstack query data destracture
  const { mutate: signIn, isPending: signinPending } = useSignin();

  // ------tanstack form
  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    validators: {
      onSubmit: userSignInSchema,
    },
    onSubmit: (data) => {
      const loginData = {
        email: data.value.email,
        password: data.value.password,
      };

      signIn(loginData, {
        onSuccess: (res) => {
          toast.add({
            title: "SignIn successfull",
            description: "Welcome Back",
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
      <p>Login Your Account</p>

      <form
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
              <Field>
                <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  onChange={(e) => field.handleChange(e.target.value)}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  autoComplete="off"
                  className={`${isValid && "border-red-500"}`}
                />
                {isValid && <FieldError errors={field.state.meta.errors} />}
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
              <Field>
                <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                <div className="relative">
                  <Input
                    id={field.name}
                    name={field.name}
                    onChange={(e) => field.handleChange(e.target.value)}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    autoComplete="off"
                    className={`${isValid && "border-red-500"}`}
                    type={showPass ? "text" : "password"}
                  />
                  <button
                    className=" absolute right-3 top-1/2 -translate-y-1/2"
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                  >
                    {showPass ? (
                      <EyeClosed className="size-4" />
                    ) : (
                      <EyeIcon className="size-4" />
                    )}
                  </button>
                </div>
                {isValid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        </form.Field>

        <Button disabled={signinPending} type="submit">
          {signinPending ? (
            <>
              Submitting.. <Spinner />
            </>
          ) : (
            "Submit"
          )}
        </Button>
      </form>
    </div>
  );
};

export default SigninForm;
