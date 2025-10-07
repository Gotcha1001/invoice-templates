import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Doc, Id } from "./_generated/dataModel";

export const getInvoicesByUser = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    // Fetch companies owned by the user
    const companies = await ctx.db
      .query("companies")
      .filter((q) => q.eq(q.field("userId"), identity.subject))
      .collect();

    const companyIds = companies.map((company) => company._id);

    // Fetch invoices for all companies owned by the user
    const invoices = await Promise.all(
      companyIds.map((companyId) =>
        ctx.db
          .query("invoices")
          .withIndex("by_company", (q) => q.eq("companyId", companyId))
          .collect()
      )
    );

    return invoices.flat();
  },
});

export const getInvoice = query({
  args: { id: v.id("invoices") },
  handler: async (ctx, args) => {
    const invoice = await ctx.db.get(args.id);
    if (!invoice) return null;

    // Verify the user owns the company associated with the invoice
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const company = await ctx.db.get(invoice.companyId);
    if (!company || company.userId !== identity.subject) {
      throw new Error("Unauthorized");
    }

    return invoice;
  },
});

export const createInvoice = mutation({
  args: {
    invoiceNumber: v.string(),
    companyId: v.id("companies"),
    templateId: v.id("templates"),
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
    status: v.union(
      v.literal("draft"),
      v.literal("sent"),
      v.literal("paid"),
      v.literal("overdue")
    ),
    issueDate: v.string(),
    dueDate: v.string(),
    notes: v.optional(v.string()),
    currency: v.string(), // Add currency field to match the schema
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    // Verify the user owns the company
    const company = await ctx.db.get(args.companyId);
    if (!company || company.userId !== identity.subject) {
      throw new Error("Unauthorized: Invalid company");
    }

    // Verify the template belongs to the company
    const template = await ctx.db.get(args.templateId);
    if (!template || template.companyId !== args.companyId) {
      throw new Error("Unauthorized: Invalid template");
    }

    const invoiceId = await ctx.db.insert("invoices", {
      ...args,
    });
    return invoiceId;
  },
});

export const deleteInvoice = mutation({
  args: { id: v.id("invoices") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const invoice = await ctx.db.get(args.id);
    if (!invoice) {
      throw new Error("Invoice not found");
    }

    const company = await ctx.db.get(invoice.companyId);
    if (!company || company.userId !== identity.subject) {
      throw new Error("Unauthorized");
    }

    await ctx.db.delete(args.id);
  },
});

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
    status: v.optional(
      v.union(
        v.literal("draft"),
        v.literal("sent"),
        v.literal("paid"),
        v.literal("overdue")
      )
    ),
    issueDate: v.optional(v.string()),
    dueDate: v.optional(v.string()),
    notes: v.optional(v.string()),
    templateId: v.optional(v.id("templates")),
    currency: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const invoice = await ctx.db.get(args.id);
    if (!invoice) throw new Error("Invoice not found");

    const company = await ctx.db.get(invoice.companyId);
    if (!company || company.userId !== identity.subject) {
      throw new Error("Unauthorized");
    }

    const { id, ...updates } = args;

    if (updates.templateId) {
      const template = await ctx.db.get(updates.templateId);
      if (!template || template.companyId !== invoice.companyId) {
        throw new Error("Invalid template");
      }
    }

    await ctx.db.patch(id, updates);
  },
});

// New query for stats
export const getStatsByCompany = query({
  args: { companyId: v.id("companies") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const company = await ctx.db.get(args.companyId);
    if (!company || company.userId !== identity.subject) {
      throw new Error("Unauthorized");
    }

    const invoices = await ctx.db
      .query("invoices")
      .withIndex("by_company", (q) => q.eq("companyId", args.companyId))
      .collect();

    const statusCounts = invoices.reduce(
      (acc, inv) => {
        acc[inv.status] = (acc[inv.status] || 0) + 1;
        return acc;
      },
      {} as Record<"draft" | "sent" | "paid" | "overdue", number>
    );

    const monthlyRevenue = invoices.reduce(
      (acc, inv) => {
        const date = new Date(inv.issueDate);
        const monthKey = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}`;
        acc[monthKey] = (acc[monthKey] || 0) + inv.total;
        return acc;
      },
      {} as Record<string, number>
    );

    const totalRevenue = invoices.reduce((sum, inv) => sum + inv.total, 0);
    const paidRevenue = invoices
      .filter((inv) => inv.status === "paid")
      .reduce((sum, inv) => sum + inv.total, 0);
    const overdueAmount = invoices
      .filter((inv) => inv.status === "overdue")
      .reduce((sum, inv) => sum + inv.total, 0);
    const overdueCount = statusCounts.overdue || 0;

    return {
      statusCounts,
      monthlyRevenue,
      totalRevenue,
      paidRevenue,
      overdueAmount,
      overdueCount,
      totalInvoices: invoices.length,
    };
  },
});
