// import { v } from "convex/values";
// import { mutation, query } from "./_generated/server";

// export const createTemplate = mutation({
//   args: {
//     name: v.string(),
//     description: v.string(),
//     layout: v.object({
//       headerStyle: v.union(
//         v.literal("minimal"),
//         v.literal("bold"),
//         v.literal("creative")
//       ),
//       logoPosition: v.union(
//         v.literal("left"),
//         v.literal("center"),
//         v.literal("right")
//       ),
//       colorScheme: v.object({
//         primary: v.string(),
//         secondary: v.string(),
//         accent: v.string(),
//         text: v.string(),
//         background: v.string(),
//       }),
//       fontFamily: v.string(),
//       showBorder: v.boolean(),
//       showWatermark: v.boolean(),
//     }),
//     isDefault: v.boolean(),
//     companyId: v.id("companies"),
//   },
//   handler: async (ctx, args) => {
//     const identity = await ctx.auth.getUserIdentity();
//     if (!identity) throw new Error("Unauthorized");

//     const userId = identity.subject;
//     const company = await ctx.db.get(args.companyId);
//     if (!company || company.userId !== userId) throw new Error("Unauthorized");

//     const existingTemplates = await ctx.db
//       .query("templates")
//       .withIndex("by_company", (q) => q.eq("companyId", args.companyId))
//       .collect();

//     if (existingTemplates.length >= 1) {
//       throw new Error("Only one template per company is allowed");
//     }

//     return await ctx.db.insert("templates", args);
//   },
// });

// export const updateTemplate = mutation({
//   args: {
//     id: v.id("templates"),
//     name: v.optional(v.string()),
//     description: v.optional(v.string()),
//     layout: v.optional(
//       v.object({
//         headerStyle: v.union(
//           v.literal("minimal"),
//           v.literal("bold"),
//           v.literal("creative")
//         ),
//         logoPosition: v.union(
//           v.literal("left"),
//           v.literal("center"),
//           v.literal("right")
//         ),
//         colorScheme: v.object({
//           primary: v.string(),
//           secondary: v.string(),
//           accent: v.string(),
//           text: v.string(),
//           background: v.string(),
//         }),
//         fontFamily: v.string(),
//         showBorder: v.boolean(),
//         showWatermark: v.boolean(),
//       })
//     ),
//     isDefault: v.optional(v.boolean()),
//     companyId: v.id("companies"),
//   },
//   handler: async (ctx, args) => {
//     const identity = await ctx.auth.getUserIdentity();
//     if (!identity) throw new Error("Unauthorized");

//     const userId = identity.subject;
//     const template = await ctx.db.get(args.id);
//     if (!template || template.companyId !== args.companyId) {
//       throw new Error("Unauthorized or template not found");
//     }

//     const company = await ctx.db.get(args.companyId);
//     if (!company || company.userId !== userId) throw new Error("Unauthorized");

//     const { id, companyId, ...updates } = args;
//     await ctx.db.patch(id, updates);
//   },
// });

// export const getTemplate = query({
//   args: { id: v.id("templates") },
//   handler: async (ctx, args) => {
//     const identity = await ctx.auth.getUserIdentity();
//     if (!identity) return null;

//     const userId = identity.subject;
//     const template = await ctx.db.get(args.id);
//     if (!template) return null;

//     const company = await ctx.db.get(template.companyId);
//     if (!company || company.userId !== userId) return null;

//     return template;
//   },
// });

// export const getTemplatesByCompany = query({
//   args: { companyId: v.id("companies") },
//   handler: async (ctx, args) => {
//     const identity = await ctx.auth.getUserIdentity();
//     if (!identity) return [];

//     const userId = identity.subject;
//     const company = await ctx.db.get(args.companyId);
//     if (!company || company.userId !== userId) return [];

//     return await ctx.db
//       .query("templates")
//       .withIndex("by_company", (q) => q.eq("companyId", args.companyId))
//       .collect();
//   },
// });

// export const getTemplatesByCompanies = query({
//   args: { companyIds: v.array(v.id("companies")) },
//   handler: async (ctx, args) => {
//     const identity = await ctx.auth.getUserIdentity();
//     if (!identity) return [];

//     const userId = identity.subject;
//     // Fetch companies to verify user ownership
//     const companies = await Promise.all(
//       args.companyIds.map((companyId) => ctx.db.get(companyId))
//     );
//     const authorizedCompanyIds = companies
//       .filter((company): company is NonNullable<typeof company> => !!company)
//       .filter((company) => company.userId === userId)
//       .map((company) => company._id);

//     // Fetch templates for authorized companies
//     const templates = await Promise.all(
//       authorizedCompanyIds.map(async (companyId) => {
//         const companyTemplates = await ctx.db
//           .query("templates")
//           .withIndex("by_company", (q) => q.eq("companyId", companyId))
//           .collect();
//         return { companyId, templates: companyTemplates };
//       })
//     );

//     return templates;
//   },
// });

// export const deleteTemplate = mutation({
//   args: {
//     id: v.id("templates"),
//     companyId: v.id("companies"),
//   },
//   handler: async (ctx, args) => {
//     const identity = await ctx.auth.getUserIdentity();
//     if (!identity) throw new Error("Unauthorized");

//     const userId = identity.subject;
//     const template = await ctx.db.get(args.id);
//     if (!template || template.companyId !== args.companyId) {
//       throw new Error("Unauthorized or template not found");
//     }

//     const company = await ctx.db.get(args.companyId);
//     if (!company || company.userId !== userId) throw new Error("Unauthorized");

//     const invoicesUsingTemplate = await ctx.db
//       .query("invoices")
//       .filter((q) => q.eq(q.field("templateId"), args.id))
//       .first();
//     if (invoicesUsingTemplate) {
//       throw new Error("Cannot delete template used by invoices");
//     }

//     await ctx.db.delete(args.id);
//   },
// });

import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { templateSchema } from "../types/template"; // Adjust path if needed
import { z } from "zod";

// Helper to normalize colors (adapt your ensureHexColor if needed)
function normalizeColor(color: string): string {
  if (/^#([0-9A-Fa-f]{6}|[0-9A-Fa-f]{3})$/.test(color)) return color;
  if (color === "white") return "#ffffff";
  if (color === "black") return "#000000";
  // Fallback for unsupported formats like 'lab(...)'
  return "#ffffff";
}

export const createTemplate = mutation({
  args: {
    name: v.string(),
    description: v.optional(v.string()),
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
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const userId = identity.subject;
    const company = await ctx.db.get(args.companyId);
    if (!company || company.userId !== userId) throw new Error("Unauthorized");

    const existingTemplates = await ctx.db
      .query("templates")
      .withIndex("by_company", (q) => q.eq("companyId", args.companyId))
      .collect();

    if (existingTemplates.length >= 1) {
      throw new Error("Only one template per company is allowed");
    }

    // Normalize and validate colors using Zod schema
    try {
      const validated = templateSchema.parse({
        name: args.name,
        description: args.description,
        layout: {
          ...args.layout,
          colorScheme: {
            primary: normalizeColor(args.layout.colorScheme.primary),
            secondary: normalizeColor(args.layout.colorScheme.secondary),
            accent: normalizeColor(args.layout.colorScheme.accent),
            text: normalizeColor(args.layout.colorScheme.text),
            background: normalizeColor(args.layout.colorScheme.background),
          },
        },
        isDefault: args.isDefault,
      });

      return await ctx.db.insert("templates", {
        ...args,
        name: validated.name,
        description: validated.description ?? "",
        layout: validated.layout,
        isDefault: validated.isDefault,
        companyId: args.companyId,
      });
    } catch (error) {
      const errorMessage =
        error instanceof z.ZodError ? error.message : String(error);
      throw new Error(`Validation failed: ${errorMessage}`);
    }
  },
});

export const updateTemplate = mutation({
  args: {
    id: v.id("templates"),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    layout: v.optional(
      v.object({
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
      })
    ),
    isDefault: v.optional(v.boolean()),
    companyId: v.id("companies"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const userId = identity.subject;
    const template = await ctx.db.get(args.id);
    if (!template || template.companyId !== args.companyId) {
      throw new Error("Unauthorized or template not found");
    }

    const company = await ctx.db.get(args.companyId);
    if (!company || company.userId !== userId) throw new Error("Unauthorized");

    const { id, companyId, ...updates } = args;

    // Normalize and validate if layout is provided
    if (updates.layout) {
      try {
        const partialSchema = templateSchema.partial(); // For partial updates
        const validated = partialSchema.parse({
          layout: {
            ...updates.layout,
            colorScheme: {
              primary: normalizeColor(updates.layout.colorScheme.primary),
              secondary: normalizeColor(updates.layout.colorScheme.secondary),
              accent: normalizeColor(updates.layout.colorScheme.accent),
              text: normalizeColor(updates.layout.colorScheme.text),
              background: normalizeColor(updates.layout.colorScheme.background),
            },
          },
        });

        updates.layout = validated.layout;
      } catch (error) {
        const errorMessage =
          error instanceof z.ZodError ? error.message : String(error);
        throw new Error(`Validation failed: ${errorMessage}`);
      }
    }

    await ctx.db.patch(id, updates);
  },
});

export const getTemplate = query({
  args: { id: v.id("templates") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    const userId = identity.subject;
    const template = await ctx.db.get(args.id);
    if (!template) return null;

    const company = await ctx.db.get(template.companyId);
    if (!company || company.userId !== userId) return null;

    return template;
  },
});

export const getTemplatesByCompany = query({
  args: { companyId: v.id("companies") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    const userId = identity.subject;
    const company = await ctx.db.get(args.companyId);
    if (!company || company.userId !== userId) return [];

    return await ctx.db
      .query("templates")
      .withIndex("by_company", (q) => q.eq("companyId", args.companyId))
      .collect();
  },
});

export const getTemplatesByCompanies = query({
  args: { companyIds: v.array(v.id("companies")) },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    const userId = identity.subject;
    // Fetch companies to verify user ownership
    const companies = await Promise.all(
      args.companyIds.map((companyId) => ctx.db.get(companyId))
    );
    const authorizedCompanyIds = companies
      .filter((company): company is NonNullable<typeof company> => !!company)
      .filter((company) => company.userId === userId)
      .map((company) => company._id);

    // Fetch templates for authorized companies
    const templates = await Promise.all(
      authorizedCompanyIds.map(async (companyId) => {
        const companyTemplates = await ctx.db
          .query("templates")
          .withIndex("by_company", (q) => q.eq("companyId", companyId))
          .collect();
        return { companyId, templates: companyTemplates };
      })
    );

    return templates;
  },
});

export const deleteTemplate = mutation({
  args: {
    id: v.id("templates"),
    companyId: v.id("companies"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const userId = identity.subject;
    const template = await ctx.db.get(args.id);
    if (!template || template.companyId !== args.companyId) {
      throw new Error("Unauthorized or template not found");
    }

    const company = await ctx.db.get(args.companyId);
    if (!company || company.userId !== userId) throw new Error("Unauthorized");

    const invoicesUsingTemplate = await ctx.db
      .query("invoices")
      .filter((q) => q.eq(q.field("templateId"), args.id))
      .first();
    if (invoicesUsingTemplate) {
      throw new Error("Cannot delete template used by invoices");
    }

    await ctx.db.delete(args.id);
  },
});
