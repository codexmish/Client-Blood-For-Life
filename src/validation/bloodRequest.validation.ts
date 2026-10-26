import { BloodGroupList, UrgencyList } from "@/types";
import z from "zod";

// -----create blood request validation
export const createBloodRequestSchema = z.object({
  bloodGroup: z.enum(BloodGroupList, "Select a blood group"),

  patientName: z
    .string()
    .trim()
    .min(3, "Patient name must be 3 characters long")
    .max(50, "Patient name max 50 characters long"),

  bagsNeeded: z
    .number()
    .int()
    .min(1, "At least 1 bag is required")
    .max(5, "Maximum 5 bags allowed"),

  hospitalName: z
    .string()
    .trim()
    .min(3, "Hospital name must be 3 characters long")
    .max(100, "Hospital name max 100 characters long"),

  address: z
    .string()
    .trim()
    .min(3, "Address must be 3 characters long")
    .max(200, "Address max 200 characters long"),

  // ----date comes as YYYY-MM-DD, so string compare works
  needAt: z
    .string()
    .min(1, "Select the date blood is needed")
    .refine(
      (date) => date >= new Date().toLocaleDateString("en-CA"),
      "Needed date can't be in the past",
    ),

  phoneNumber: z
    .string()
    .trim()
    .regex(/^(?:\+?88)?01[3-9]\d{8}$/, "Invalid phone number"),

  urgency: z.enum(UrgencyList),

  // ----optional, but if given it must be 3 characters long
  note: z
    .string()
    .trim()
    .max(200, "Note max 200 characters long")
    .refine(
      (note) => note.length === 0 || note.length >= 3,
      "Note must be 3 characters long",
    ),
});
