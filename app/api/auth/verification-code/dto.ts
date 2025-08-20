import * as z from "zod";


export const emailCodeDto = z.object({
  email: z.email("Invalid email format"),
});

export type EmailCodeInput = z.infer<typeof emailCodeDto>;