import z from "zod";

// -----register donor validation (fields can be empty)
export const registerDonorSchema = z.object({
  weight: z
    .string()
    .trim()
    .refine(
      (weight) => weight === "" || /^\d{2,3}(\.\d{1,2})?$/.test(weight),
      "Weight must be a number in kg",
    )
    .refine(
      (weight) => weight === "" || Number(weight) >= 50,
      "Minimum weight to donate is 50 kg",
    ),

  // ----date comes as YYYY-MM-DD, so string compare works
  lastDonationDate: z
    .string()
    .refine(
      (date) => date === "" || date <= new Date().toLocaleDateString("en-CA"),
      "Last donation date can't be in the future",
    ),

  healthNote: z.string().trim().max(300, "Health note max 300 characters long"),

  agree: z.boolean().refine((value) => value, "Please confirm to continue"),
});

// -----update donor details validation (same fields, no confirm box)
export const updateDonorSchema = registerDonorSchema.omit({ agree: true });
