import { BloodGroupList } from "@/types";
import z from "zod";

// ------user signin validation
export const userSignInSchema = z.object({
	email: z.email("Invalid email address").toLowerCase(),
	password: z
		.string("Password is required")
		.min(8, "password must be 8 caracters long")
		.max(32, "password max 32 caracters long"),
});


// -----user signup validation
export const userSignupSchema = z.object({
	name: z.string("Name is required").min(3, "name must be 3 caracters long"),

	email: z.email("Invalid email address").toLowerCase(),

	bloodGroup: z.enum(BloodGroupList, "Invalid blood group"),
	password: z
		.string("Password is required")
		.min(8, "password must be 8 caracters long")
		.max(32, "password max 32 caracters long"),
});