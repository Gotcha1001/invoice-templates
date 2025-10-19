// convex/ledger.ts
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getLedgerEntries = query({
  args: { companyId: v.id("companies") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("ledgerEntries")
      .withIndex("by_company", (q) => q.eq("companyId", args.companyId))
      .order("desc") // By date, assuming date is sortable
      .collect();
  },
});

export const createLedgerEntry = mutation({
  args: {
    companyId: v.id("companies"),
    account: v.string(),
    debit: v.number(),
    credit: v.number(),
    date: v.string(),
    description: v.optional(v.string()), // Change to optional
    invoiceId: v.optional(v.id("invoices")), // Already optional
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("ledgerEntries", args);
  },
});

export const getTrialBalance = query({
  args: { companyId: v.id("companies") },
  handler: async (ctx, args) => {
    const entries = await ctx.db
      .query("ledgerEntries")
      .withIndex("by_company", (q) => q.eq("companyId", args.companyId))
      .collect();

    const balance: Record<string, { debit: number; credit: number }> = {};

    for (const entry of entries) {
      if (!balance[entry.account]) {
        balance[entry.account] = { debit: 0, credit: 0 };
      }
      balance[entry.account].debit += entry.debit;
      balance[entry.account].credit += entry.credit;
    }

    return balance;
  },
});
