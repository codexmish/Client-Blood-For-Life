import z from "zod";

// ------user signin validation
export const userSignInSchema = z.object({
	email: z.email("Invalid email address").toLowerCase(),
	password: z
		.string("Password is required")
		.min(8, "password must be 8 caracters long")
		.max(32, "password max 32 caracters long"),
});