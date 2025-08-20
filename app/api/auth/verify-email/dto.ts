import * as z from "zod";


export const emailVerifyDto = z.object({
  email: z.email("Invalid email format"),
  code: z.string().min(6, "Password must be at least 6 characters"),

});

export type EmailVerifyInput = z.infer<typeof emailVerifyDto>;