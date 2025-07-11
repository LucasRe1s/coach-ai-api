import { z } from "zod";

export const AuthSchema = z
  .object({
    email: z.string().trim().email(),
    password: z.string(),
  })
  .strict();

export type AuthProps = z.infer<typeof AuthSchema>;
