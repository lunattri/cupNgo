import { z } from "zod";

export const SignUpSchema = z
  .object({
    email: z.string().email(),
    password: z.string().min(8),
    name: z.string().min(1).max(100),
  })
  .strict();

export const SignInSchema = z
  .object({
    email: z.string().email(),
    password: z.string().min(8),
  })
  .strict();

export type SignUpInput = z.infer<typeof SignUpSchema>;
export type SignInInput = z.infer<typeof SignInSchema>;


