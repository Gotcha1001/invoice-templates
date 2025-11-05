// convex/schema.ts
// Corrected to include quotes inside the defineSchema object
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  ledgerEntries: defineTable({
    companyId: v.id("companies"),
    account: v.string(), // e.g., "Assets", "Liabilities"
    debit: v.number(),
    credit: v.number(),
    date: v.string(),
    description: v.optional(v.string()), // Change to optional
    invoiceId: v.optional(v.id("invoices")),
  }).index("by_company", ["companyId"]),

  users: defineTable({
    clerkId: v.string(), // Clerk user ID
    email: v.string(),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    createdAt: v.string(), // ISO date string
    updatedAt: v.string(),
  }).index("by_clerkId", ["clerkId"]), // Index for fast lookup

  companies: defineTable({
    name: v.string(),
    address: v.string(),
    phone: v.string(),
    email: v.string(),
    website: v.optional(v.string()),
    logoUrl: v.optional(v.string()),
    userId: v.string(), // References users.clerkId
    bankingDetails: v.object({
      bankName: v.string(),
      accountNumber: v.string(),
      branchCode: v.string(),
      accountHolder: v.string(),
    }),
  }).index("by_user", ["userId"]),

  templates: defineTable({
    name: v.string(),
    description: v.string(),
    currency: v.optional(v.string()),
    layout: v.object({
      headerStyle: v.union(
        v.literal("minimal"),
        v.literal("bold"),
        v.literal("creative")
      ),
      logoPosition: v.union(
        v.literal("left"),
        v.literal("center"),
        v.literal("right")
      ),
      colorScheme: v.object({
        primary: v.string(),
        secondary: v.string(),
        accent: v.string(),
        text: v.string(),
        background: v.string(),
      }),
      fontFamily: v.string(),
      showBorder: v.boolean(),
      showWatermark: v.boolean(),
    }),
    isDefault: v.boolean(),
    companyId: v.id("companies"),
  }).index("by_company", ["companyId"]),

  invoices: defineTable({
    invoiceNumber: v.string(),
    companyId: v.id("companies"),
    customer: v.object({
      name: v.string(),
      email: v.string(),
      address: v.string(),
      phone: v.optional(v.string()),
    }),
    items: v.array(
      v.object({
        id: v.string(),
        description: v.string(),
        quantity: v.number(),
        price: v.number(),
        total: v.number(),
      })
    ),
    subtotal: v.number(),
    tax: v.number(),
    total: v.number(),
    dueDate: v.string(),
    issueDate: v.string(),
    paidDate: v.optional(v.string()),
    status: v.union(
      v.literal("draft"),
      v.literal("sent"),
      v.literal("paid"),
      v.literal("overdue")
    ),
    templateId: v.id("templates"),
    notes: v.optional(v.string()),
    currency: v.string(), // Added currency field
  })
    .index("by_company", ["companyId"])
    .index("by_status", ["status"])
    .index("by_date", ["issueDate"]),

  quotes: defineTable({
    quoteNumber: v.string(),
    companyId: v.id("companies"),
    customer: v.object({
      name: v.string(),
      email: v.string(),
      address: v.string(),
      phone: v.optional(v.string()),
    }),
    items: v.array(
      v.object({
        id: v.string(),
        description: v.string(),
        quantity: v.number(),
        price: v.number(),
        total: v.number(),
      })
    ),
    subtotal: v.number(),
    tax: v.number(),
    total: v.number(),
    validUntil: v.string(),
    issueDate: v.string(),
    status: v.union(
      v.literal("draft"),
      v.literal("sent"),
      v.literal("accepted"),
      v.literal("rejected"),
      v.literal("expired"),
      v.literal("converted") // When converted to invoice
    ),
    templateId: v.id("templates"),
    notes: v.optional(v.string()),
    currency: v.string(),
    discount: v.optional(v.number()), // For bulk discounts
    discountType: v.optional(
      v.union(v.literal("percentage"), v.literal("fixed"))
    ),
    convertedInvoiceId: v.optional(v.id("invoices")),
  })
    .index("by_company", ["companyId"])
    .index("by_status", ["status"])
    .index("by_date", ["issueDate"]),
});
