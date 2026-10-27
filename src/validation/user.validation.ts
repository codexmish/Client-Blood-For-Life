import z from "zod";

// -----update profile validation (empty phone/address is allowed)
export const updateProfileSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Name must be 3 characters long")
    .max(50, "Name max 50 characters long"),

  phone: z
    .string()
    .trim()
    .refine(
      (phone) => phone === "" || /^(?:\+?88)?01[3-9]\d{8}$/.test(phone),
      "Invalid phone number",
    ),

  address: z
    .string()
    .trim()
    .max(200, "Address max 200 characters long")
    .refine(
      (address) => address === "" || address.length >= 3,
      "Address must be 3 characters long",
    ),
});

// -----change password validation
export const changePasswordSchema = z
  .object({
    oldPassword: z
      .string()
      .min(8, "Password must be 8 characters long")
      .max(32, "Password max 32 characters long"),
    newPassword: z
      .string()
      .min(8, "Password must be 8 characters long")
      .max(32, "Password max 32 characters long"),
    confirmPassword: z.string(),
  })
  // ----both new password fields must match
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })
  .refine((data) => data.newPassword !== data.oldPassword, {
    message: "New password must be different",
    path: ["newPassword"],
  });
