// convex/companies.ts
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const createCompany = mutation({
  args: {
    name: v.string(),
    address: v.string(),
    phone: v.string(),
    email: v.string(),
    website: v.optional(v.string()),
    logoUrl: v.optional(v.string()),
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("companies", args);
  },
});

export const updateCompany = mutation({
  args: {
    id: v.id("companies"),
    name: v.optional(v.string()),
    address: v.optional(v.string()),
    phone: v.optional(v.string()),
    email: v.optional(v.string()),
    website: v.optional(v.string()),
    logoUrl: v.optional(v.string()),
    userId: v.string(), // For auth check
  },
  handler: async (ctx, args) => {
    const { id, userId, ...updates } = args;
    const company = await ctx.db.get(id);
    if (!company || company.userId !== userId) throw new Error("Unauthorized");
    await ctx.db.patch(id, updates);
  },
});

export const getCompaniesByUser = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("companies")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();
  },
});

export const getCompany = query({
  args: { id: v.id("companies") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const deleteCompany = mutation({
  args: {
    id: v.id("companies"),
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const company = await ctx.db.get(args.id);

    if (!company || company.userId !== args.userId) {
      throw new Error("Unauthorized");
    }

    // Check if there are any invoices associated with this company
    const invoices = await ctx.db
      .query("invoices")
      .withIndex("by_company", (q) => q.eq("companyId", args.id))
      .first();

    if (invoices) {
      throw new Error("Cannot delete company with existing invoices");
    }

    // Delete all templates associated with this company
    const templates = await ctx.db
      .query("templates")
      .withIndex("by_company", (q) => q.eq("companyId", args.id))
      .collect();

    for (const template of templates) {
      await ctx.db.delete(template._id);
    }

    await ctx.db.delete(args.id);
  },
});

export const getCompanyByUser = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const companies = await ctx.db
      .query("companies")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .first();

    return companies;
  },
});
