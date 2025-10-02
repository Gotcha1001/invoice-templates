// convex/invoices.ts
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Create a new invoice
export const createInvoice = mutation({
  args: {
    invoiceNumber: v.string(),
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
    status: v.union(
      v.literal("draft"),
      v.literal("sent"),
      v.literal("paid"),
      v.literal("overdue")
    ),
    templateId: v.id("templates"),
    notes: v.optional(v.string()),
    // Remove companyId from args; we'll fetch it server-side
  },
  handler: async (ctx, args) => {
    // Get authenticated user identity from the token
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }
    const userId = identity.subject; // Clerk user ID from token

    // Fetch the user's company (assuming one company per user)
    const company = await ctx.db
      .query("companies")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (!company) {
      throw new Error("No company found for user");
    }

    const companyId = company._id;

    const invoiceId = await ctx.db.insert("invoices", { ...args, companyId });
    return invoiceId;
  },
});

// Get all invoices for a company
export const getInvoices = query({
  args: { companyId: v.id("companies") }, // Keep for client-side filtering, but validate server-side
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }
    const userId = identity.subject;

    // Verify the company belongs to the user
    const company = await ctx.db.get(args.companyId);
    if (!company || company.userId !== userId) {
      throw new Error("Unauthorized access to company");
    }

    const invoices = await ctx.db
      .query("invoices")
      .withIndex("by_company", (q) => q.eq("companyId", args.companyId))
      .order("desc")
      .collect();
    return invoices;
  },
});

// Get invoices by month
export const getInvoicesByMonth = query({
  args: {
    companyId: v.id("companies"),
    year: v.number(),
    month: v.number(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }
    const userId = identity.subject;

    // Verify the company belongs to the user
    const company = await ctx.db.get(args.companyId);
    if (!company || company.userId !== userId) {
      throw new Error("Unauthorized access to company");
    }

    const startDate = new Date(args.year, args.month - 1, 1).toISOString();
    const endDate = new Date(args.year, args.month, 0).toISOString();

    const invoices = await ctx.db
      .query("invoices")
      .withIndex("by_company", (q) => q.eq("companyId", args.companyId))
      .filter((q) =>
        q.and(
          q.gte(q.field("issueDate"), startDate),
          q.lte(q.field("issueDate"), endDate)
        )
      )
      .collect();
    return invoices;
  },
});

// Get single invoice
export const getInvoice = query({
  args: { id: v.id("invoices") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }
    const userId = identity.subject;

    const invoice = await ctx.db.get(args.id);
    if (!invoice) {
      throw new Error("Invoice not found");
    }

    // Verify the invoice's company belongs to the user
    const company = await ctx.db.get(invoice.companyId);
    if (!company || company.userId !== userId) {
      throw new Error("Unauthorized access to invoice");
    }

    return invoice;
  },
});

// Update invoice
export const updateInvoice = mutation({
  args: {
    id: v.id("invoices"),
    invoiceNumber: v.optional(v.string()),
    customer: v.optional(
      v.object({
        name: v.string(),
        email: v.string(),
        address: v.string(),
        phone: v.optional(v.string()),
      })
    ),
    items: v.optional(
      v.array(
        v.object({
          id: v.string(),
          description: v.string(),
          quantity: v.number(),
          price: v.number(),
          total: v.number(),
        })
      )
    ),
    subtotal: v.optional(v.number()),
    tax: v.optional(v.number()),
    total: v.optional(v.number()),
    dueDate: v.optional(v.string()),
    status: v.optional(
      v.union(
        v.literal("draft"),
        v.literal("sent"),
        v.literal("paid"),
        v.literal("overdue")
      )
    ),
    templateId: v.optional(v.id("templates")),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }
    const userId = identity.subject;

    const { id, ...updates } = args;

    const invoice = await ctx.db.get(id);
    if (!invoice) {
      throw new Error("Invoice not found");
    }

    // Verify the invoice's company belongs to the user
    const company = await ctx.db.get(invoice.companyId);
    if (!company || company.userId !== userId) {
      throw new Error("Unauthorized access to invoice");
    }

    await ctx.db.patch(id, updates);
  },
});

// Delete invoice
export const deleteInvoice = mutation({
  args: { id: v.id("invoices") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }
    const userId = identity.subject;

    const invoice = await ctx.db.get(args.id);
    if (!invoice) {
      throw new Error("Invoice not found");
    }

    // Verify the invoice's company belongs to the user
    const company = await ctx.db.get(invoice.companyId);
    if (!company || company.userId !== userId) {
      throw new Error("Unauthorized access to invoice");
    }

    await ctx.db.delete(args.id);
  },
});

// Get invoice statistics
export const getInvoiceStats = query({
  args: {
    companyId: v.id("companies"),
    year: v.optional(v.number()),
    month: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }
    const userId = identity.subject;

    // Verify the company belongs to the user
    const company = await ctx.db.get(args.companyId);
    if (!company || company.userId !== userId) {
      throw new Error("Unauthorized access to company");
    }

    let invoicesQuery = ctx.db
      .query("invoices")
      .withIndex("by_company", (q) => q.eq("companyId", args.companyId));

    if (args.year && args.month) {
      const startDate = new Date(args.year, args.month - 1, 1).toISOString();
      const endDate = new Date(args.year, args.month, 0).toISOString();

      invoicesQuery = invoicesQuery.filter((q) =>
        q.and(
          q.gte(q.field("issueDate"), startDate),
          q.lte(q.field("issueDate"), endDate)
        )
      );
    }

    const invoices = await invoicesQuery.collect();

    const stats = {
      totalInvoices: invoices.length,
      totalRevenue: invoices.reduce((sum, inv) => sum + inv.total, 0),
      paidRevenue: invoices
        .filter((inv) => inv.status === "paid")
        .reduce((sum, inv) => sum + inv.total, 0),
      overdueCount: invoices.filter((inv) => inv.status === "overdue").length,
      overdueAmount: invoices
        .filter((inv) => inv.status === "overdue")
        .reduce((sum, inv) => sum + inv.total, 0),
      draftCount: invoices.filter((inv) => inv.status === "draft").length,
      sentCount: invoices.filter((inv) => inv.status === "sent").length,
    };

    return stats;
  },
});
