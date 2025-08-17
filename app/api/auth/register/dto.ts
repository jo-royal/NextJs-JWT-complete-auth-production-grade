import * as z from "zod";


export const userSchema = z.object({
  email: z.email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  fname: z.string().min(1, "First name is required"),
  lname: z.string().min(1, "Last name is required"),

});

export type EventInput = z.infer<typeof userSchema>;

// For PATCH requests (all optional)
export const userUpdateSchema = userSchema.partial();