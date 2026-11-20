import z from "zod";

export const checkoutSchema = z.object({
  details: z.string().min(3, "Please enter your street address / details"),
  phone: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .regex(/^[0-9+]+$/, "Phone must contain only numbers"),
  city: z.string().min(2, "Please enter your city"),
  postalCode: z.string().optional(),
});

export type CheckoutFormValues = z.infer<typeof checkoutSchema>;

