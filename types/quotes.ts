import { z } from "zod";

export const quoteSchema = z.object({
  quoteNumber: z.string().min(1, "Quote number is required"),
  companyId: z.string().min(1, "Company is required"), // Handle as Id later
  templateId: z.string().min(1, "Template is required"), // Handle as Id later
  customer: z.object({
    name: z.string().min(1, "Customer name is required"),
    email: z.string().email("Invalid email"),
    address: z.string().min(1, "Address is required"),
    phone: z.string().optional(),
  }),
  items: z
    .array(
      z.object({
        id: z.string().min(1),
        description: z.string().min(1, "Description is required"),
        quantity: z.number().positive("Quantity must be positive"),
        price: z.number().positive("Price must be positive"),
        total: z.number().positive("Total must be positive"),
      })
    )
    .min(1, "At least one item is required"),
  subtotal: z.number().nonnegative(),
  tax: z.number().nonnegative().optional(),
  taxRate: z.number().min(0).max(1).optional(),
  isVatRegistered: z.boolean(),
  total: z.number().nonnegative(),
  issueDate: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), { message: "Invalid date" }),
  validUntil: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), { message: "Invalid date" }),
  currency: z.string().min(1, "Currency is required"),
  status: z.enum([
    "draft",
    "sent",
    "accepted",
    "rejected",
    "expired",
    "converted",
  ]),
  notes: z.string().optional(),
  discount: z.number().nonnegative().optional(),
  discountType: z.enum(["percentage", "fixed"]).optional(),
});

export type QuoteFormData = z.infer<typeof quoteSchema>;
