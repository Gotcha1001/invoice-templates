import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getQuotesByUser = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const companies = await ctx.db
      .query("companies")
      .filter((q) => q.eq(q.field("userId"), identity.subject))
      .collect();

    const companyIds = companies.map((company) => company._id);

    const quotes = await Promise.all(
      companyIds.map((companyId) =>
        ctx.db
          .query("quotes")
          .withIndex("by_company", (q) => q.eq("companyId", companyId))
          .collect()
      )
    );

    return quotes.flat();
  },
});

export const getQuote = query({
  args: { id: v.id("quotes") },
  handler: async (ctx, args) => {
    const quote = await ctx.db.get(args.id);
    if (!quote) return null;

    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const company = await ctx.db.get(quote.companyId);
    if (!company || company.userId !== identity.subject) {
      throw new Error("Unauthorized");
    }

    return quote;
  },
});

export const createQuote = mutation({
  args: {
    quoteNumber: v.string(),
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
      v.literal("accepted"),
      v.literal("rejected"),
      v.literal("expired"),
      v.literal("converted")
    ),
    issueDate: v.string(),
    validUntil: v.string(),
    notes: v.optional(v.string()),
    currency: v.string(),
    discount: v.optional(v.number()),
    discountType: v.optional(
      v.union(v.literal("percentage"), v.literal("fixed"))
    ),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const company = await ctx.db.get(args.companyId);
    if (!company || company.userId !== identity.subject) {
      throw new Error("Unauthorized: Invalid company");
    }

    const template = await ctx.db.get(args.templateId);
    if (!template || template.companyId !== args.companyId) {
      throw new Error("Unauthorized: Invalid template");
    }

    const quoteId = await ctx.db.insert("quotes", {
      ...args,
    });

    return quoteId;
  },
});

export const updateQuote = mutation({
  args: {
    id: v.id("quotes"),
    quoteNumber: v.optional(v.string()),
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
        v.literal("accepted"),
        v.literal("rejected"),
        v.literal("expired"),
        v.literal("converted")
      )
    ),
    issueDate: v.optional(v.string()),
    validUntil: v.optional(v.string()),
    notes: v.optional(v.string()),
    templateId: v.optional(v.id("templates")),
    currency: v.optional(v.string()),
    discount: v.optional(v.number()),
    discountType: v.optional(
      v.union(v.literal("percentage"), v.literal("fixed"))
    ),
    convertedInvoiceId: v.optional(v.id("invoices")),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const quote = await ctx.db.get(args.id);
    if (!quote) throw new Error("Quote not found");

    const company = await ctx.db.get(quote.companyId);
    if (!company || company.userId !== identity.subject) {
      throw new Error("Unauthorized");
    }

    const { id, ...updates } = args;

    if (updates.templateId) {
      const template = await ctx.db.get(updates.templateId);
      if (!template || template.companyId !== quote.companyId) {
        throw new Error("Invalid template");
      }
    }

    await ctx.db.patch(id, updates);
  },
});

export const deleteQuote = mutation({
  args: { id: v.id("quotes") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const quote = await ctx.db.get(args.id);
    if (!quote) {
      throw new Error("Quote not found");
    }

    const company = await ctx.db.get(quote.companyId);
    if (!company || company.userId !== identity.subject) {
      throw new Error("Unauthorized");
    }

    await ctx.db.delete(args.id);
  },
});

export const convertQuoteToInvoice = mutation({
  args: { quoteId: v.id("quotes") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const quote = await ctx.db.get(args.quoteId);
    if (!quote) throw new Error("Quote not found");

    const company = await ctx.db.get(quote.companyId);
    if (!company || company.userId !== identity.subject) {
      throw new Error("Unauthorized");
    }

    // Generate new invoice number
    const invoiceNumber = `INV-${Date.now()}`;

    // Create invoice from quote
    const invoiceId = await ctx.db.insert("invoices", {
      invoiceNumber,
      companyId: quote.companyId,
      templateId: quote.templateId,
      customer: quote.customer,
      items: quote.items,
      subtotal: quote.subtotal,
      tax: quote.tax,
      total: quote.total,
      status: "draft",
      issueDate: new Date().toISOString().split("T")[0],
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      notes: quote.notes,
      currency: quote.currency,
    });

    // Update quote status
    await ctx.db.patch(args.quoteId, {
      status: "converted",
      convertedInvoiceId: invoiceId,
    });

    return invoiceId;
  },
});

export const getStatsByCompany = query({
  args: { companyId: v.id("companies") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const company = await ctx.db.get(args.companyId);
    if (!company || company.userId !== identity.subject) {
      throw new Error("Unauthorized");
    }

    const quotes = await ctx.db
      .query("quotes")
      .withIndex("by_company", (q) => q.eq("companyId", args.companyId))
      .collect();

    const statusCounts = quotes.reduce(
      (acc, quote) => {
        acc[quote.status] = (acc[quote.status] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    const totalValue = quotes.reduce((sum, quote) => sum + quote.total, 0);
    const acceptedValue = quotes
      .filter((q) => q.status === "accepted")
      .reduce((sum, quote) => sum + quote.total, 0);

    return {
      statusCounts,
      totalQuotes: quotes.length,
      totalValue,
      acceptedValue,
      conversionRate:
        quotes.length > 0
          ? ((statusCounts.converted || 0) / quotes.length) * 100
          : 0,
    };
  },
});
