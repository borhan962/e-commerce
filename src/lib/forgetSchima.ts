import z from "zod";

export const forgetSchima = z.object({
  email: z.string().email("Please enter a valid email address"),
});

export type ForgetFormValues = z.infer<typeof forgetSchima>;
