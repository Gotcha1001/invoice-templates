// import { v } from "convex/values";
// import { mutation, query } from "./_generated/server";
// import { Id } from "./_generated/dataModel";
// import { TemplateFormData } from "@/types/template";

// // Type for templates table, matching updated schema.ts
// type TemplateTableData = {
//   name: string;
//   description: string; // Non-optional
//   layout: TemplateFormData["layout"];
//   isDefault: boolean;
//   companyId: Id<"companies">;
// };

// export const createTemplate = mutation({
//   args: {
//     name: v.string(),
//     description: v.optional(v.string()),
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
//   },
//   handler: async (ctx, args) => {
//     const identity = await ctx.auth.getUserIdentity();
//     if (!identity) throw new Error("Unauthorized");

//     const userId = identity.subject;
//     const company = await ctx.db
//       .query("companies")
//       .withIndex("by_user", (q) => q.eq("userId", userId))
//       .first();
//     if (!company) throw new Error("No company found for user");

//     const templateData: TemplateTableData = {
//       name: args.name,
//       description: args.description ?? "", // Ensure non-optional string
//       layout: args.layout,
//       isDefault: args.isDefault,
//       companyId: company._id,
//     };

//     const templateId = await ctx.db.insert("templates", templateData);

//     // If isDefault is true, update other templates to set isDefault to false
//     if (args.isDefault) {
//       const existingTemplates = await ctx.db
//         .query("templates")
//         .withIndex("by_company", (q) => q.eq("companyId", company._id))
//         .collect();
//       for (const template of existingTemplates) {
//         if (template._id !== templateId && template.isDefault) {
//           await ctx.db.patch(template._id, { isDefault: false });
//         }
//       }
//     }

//     return templateId;
//   },
// });

// export const getTemplates = query({
//   handler: async (ctx) => {
//     const identity = await ctx.auth.getUserIdentity();
//     if (!identity) throw new Error("Unauthorized");

//     const userId = identity.subject;
//     const company = await ctx.db
//       .query("companies")
//       .withIndex("by_user", (q) => q.eq("userId", userId))
//       .first();
//     if (!company) return [];

//     return await ctx.db
//       .query("templates")
//       .withIndex("by_company", (q) => q.eq("companyId", company._id))
//       .collect();
//   },
// });

// export const getTemplate = query({
//   args: { id: v.id("templates") },
//   handler: async (ctx, args) => {
//     const identity = await ctx.auth.getUserIdentity();
//     if (!identity) throw new Error("Unauthorized");
//     const userId = identity.subject;

//     const template = await ctx.db.get(args.id);
//     if (!template) throw new Error("Template not found");

//     const company = await ctx.db.get(template.companyId);
//     if (!company || company.userId !== userId)
//       throw new Error("Unauthorized access to template");

//     return template;
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
//   },
//   handler: async (ctx, args) => {
//     const identity = await ctx.auth.getUserIdentity();
//     if (!identity) throw new Error("Unauthorized");
//     const userId = identity.subject;

//     const { id, ...updates } = args;

//     const template = await ctx.db.get(id);
//     if (!template) throw new Error("Template not found");

//     const company = await ctx.db.get(template.companyId);
//     if (!company || company.userId !== userId)
//       throw new Error("Unauthorized access to template");

//     if (updates.isDefault) {
//       const existingTemplates = await ctx.db
//         .query("templates")
//         .withIndex("by_company", (q) => q.eq("companyId", template.companyId))
//         .collect();
//       for (const existingTemplate of existingTemplates) {
//         if (existingTemplate._id !== id && existingTemplate.isDefault) {
//           await ctx.db.patch(existingTemplate._id, { isDefault: false });
//         }
//       }
//     }

//     await ctx.db.patch(id, {
//       ...updates,
//       description: updates.description ?? template.description, // Ensure non-optional
//     });
//   },
// });

// export const deleteTemplate = mutation({
//   args: { id: v.id("templates") },
//   handler: async (ctx, args) => {
//     const identity = await ctx.auth.getUserIdentity();
//     if (!identity) throw new Error("Unauthorized");
//     const userId = identity.subject;

//     const template = await ctx.db.get(args.id);
//     if (!template) throw new Error("Template not found");

//     const company = await ctx.db.get(template.companyId);
//     if (!company || company.userId !== userId)
//       throw new Error("Unauthorized access to template");

//     await ctx.db.delete(args.id);
//   },
// });

import { v } from "convex/values";
import { mutation, query } from "./\_generated/server";
import { Id } from "./\_generated/dataModel";
import { TemplateFormData } from "@/types/template";

// Type for templates table, matching updated schema.ts
type TemplateTableData = {
  name: string;
  description: string;
  layout: TemplateFormData["layout"];
  isDefault: boolean;
  companyId: Id<"companies">;
};

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
    companyId: v.id("companies"), // Pass companyId from client
  },
  handler: async (ctx, args) => {
    const templateData: TemplateTableData = {
      name: args.name,
      description: args.description ?? "",
      layout: args.layout,
      isDefault: args.isDefault,
      companyId: args.companyId,
    };

    const templateId = await ctx.db.insert("templates", templateData);

    // If isDefault is true, update other templates to set isDefault to false
    if (args.isDefault) {
      const existingTemplates = await ctx.db
        .query("templates")
        .withIndex("by_company", (q) => q.eq("companyId", args.companyId))
        .collect();

      for (const template of existingTemplates) {
        if (template._id !== templateId && template.isDefault) {
          await ctx.db.patch(template._id, { isDefault: false });
        }
      }
    }

    return templateId;
  },
});

export const getTemplates = query({
  args: {
    companyId: v.id("companies"), // Make companyId required
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("templates")
      .withIndex("by_company", (q) => q.eq("companyId", args.companyId))
      .collect();
  },
});

export const getTemplate = query({
  args: { id: v.id("templates") },
  handler: async (ctx, args) => {
    const template = await ctx.db.get(args.id);
    if (!template) throw new Error("Template not found");
    return template;
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
    companyId: v.id("companies"), // Add companyId for authorization check
  },
  handler: async (ctx, args) => {
    const { id, companyId, ...updates } = args;
    const template = await ctx.db.get(id);

    if (!template) throw new Error("Template not found");
    if (template.companyId !== companyId)
      throw new Error("Unauthorized access to template");

    if (updates.isDefault) {
      const existingTemplates = await ctx.db
        .query("templates")
        .withIndex("by_company", (q) => q.eq("companyId", template.companyId))
        .collect();

      for (const existingTemplate of existingTemplates) {
        if (existingTemplate._id !== id && existingTemplate.isDefault) {
          await ctx.db.patch(existingTemplate._id, { isDefault: false });
        }
      }
    }

    await ctx.db.patch(id, {
      ...updates,
      description: updates.description ?? template.description,
    });
  },
});

export const deleteTemplate = mutation({
  args: {
    id: v.id("templates"),
    companyId: v.id("companies"), // Add for authorization
  },
  handler: async (ctx, args) => {
    const template = await ctx.db.get(args.id);
    if (!template) throw new Error("Template not found");
    if (template.companyId !== args.companyId)
      throw new Error("Unauthorized access to template");

    await ctx.db.delete(args.id);
  },
});
