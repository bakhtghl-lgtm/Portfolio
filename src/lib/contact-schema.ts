import { z } from "zod";

export const contactFormSchema = z
  .object({
    full_name: z.string().trim().min(1, "Name is required").max(200),
    email: z.string().trim().email("Invalid email").max(320),
    phone: z
      .string()
      .trim()
      .max(50)
      .transform((s) => (s.length ? s : undefined)),
    subject: z.string().trim().min(1, "Subject is required").max(300),
    budget: z
      .string()
      .trim()
      .max(200)
      .transform((s) => (s.length ? s : undefined)),
    message: z
      .string()
      .trim()
      .max(5000)
      .transform((s) => (s.length ? s : undefined)),
    company_website: z.string().optional(),
  })
  .refine((d) => !d.company_website?.trim(), {
    message: "Invalid submission",
    path: ["company_website"],
  });

export type ContactFormInput = z.input<typeof contactFormSchema>;
export type ContactFormData = z.output<typeof contactFormSchema>;
