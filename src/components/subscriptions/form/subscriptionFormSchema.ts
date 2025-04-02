
import { z } from "zod";

export const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  amount: z.coerce.number().positive({ message: "Amount must be positive" }),
  billingCycle: z.enum(["weekly", "monthly", "quarterly", "biannually", "yearly"]),
  nextBillingDate: z.date(),
  category: z.string().default("other"),
  website: z.string().url({ message: "Please enter a valid URL" }).optional().or(z.literal("")),
  logo: z.string().optional(),
});

export type FormValues = z.infer<typeof formSchema>;
