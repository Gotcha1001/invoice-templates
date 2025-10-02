// import { v } from "convex/values";
// import { mutation, query } from "./_generated/server";

// export const upsertUser = mutation({
//   args: {
//     clerkId: v.string(),
//     email: v.string(),
//     firstName: v.optional(v.string()),
//     lastName: v.optional(v.string()),
//   },
//   handler: async (ctx, args) => {
//     const existingUser = await ctx.db
//       .query("users")
//       .withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId))
//       .first();

//     const now = new Date().toISOString();
//     const userData = {
//       clerkId: args.clerkId,
//       email: args.email,
//       firstName: args.firstName,
//       lastName: args.lastName,
//       createdAt: now,
//       updatedAt: now,
//     };

//     let userId;
//     if (existingUser) {
//       await ctx.db.patch(existingUser._id, userData);
//       userId = existingUser._id;
//     } else {
//       userId = await ctx.db.insert("users", userData);
//       const companyId = await ctx.db.insert("companies", {
//         name: `${args.firstName || "User"}'s Company`,
//         address: "",
//         phone: "",
//         email: args.email,
//         userId: args.clerkId,
//       });
//       await ctx.db.insert("templates", {
//         name: "Default Template",
//         description: "Default professional invoice template",
//         layout: {
//           headerStyle: "minimal",
//           logoPosition: "left",
//           colorScheme: {
//             primary: "#2563eb",
//             secondary: "#64748b",
//             accent: "#0ea5e9",
//             text: "#1e293b",
//             background: "#ffffff",
//           },
//           fontFamily: "Inter, sans-serif",
//           showBorder: false,
//           showWatermark: false,
//         },
//         isDefault: true,
//         companyId,
//       });
//     }
//     return userId;
//   },
// });

// export const getUser = query({
//   args: { clerkId: v.string() },
//   handler: async (ctx, args) => {
//     return await ctx.db
//       .query("users")
//       .withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId))
//       .first();
//   },
// });

import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const upsertUser = mutation({
  args: {
    clerkId: v.string(),
    email: v.string(),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId))
      .first();

    const now = new Date().toISOString();
    const userData = {
      clerkId: args.clerkId,
      email: args.email,
      firstName: args.firstName,
      lastName: args.lastName,
      createdAt: now,
      updatedAt: now,
    };

    let userId;
    if (existingUser) {
      await ctx.db.patch(existingUser._id, userData);
      userId = existingUser._id;
    } else {
      userId = await ctx.db.insert("users", userData);
      const companyId = await ctx.db.insert("companies", {
        name: `${args.firstName || "User"}'s Company`,
        address: "Default Address",
        phone: "123-456-7890",
        email: args.email,
        userId: args.clerkId,
      });

      await ctx.db.insert("templates", {
        name: "Default Template",
        description: "Default professional invoice template",
        layout: {
          headerStyle: "minimal",
          logoPosition: "left",
          colorScheme: {
            primary: "#2563eb",
            secondary: "#64748b",
            accent: "#0ea5e9",
            text: "#1e293b",
            background: "#ffffff",
          },
          fontFamily: "Inter, sans-serif",
          showBorder: false,
          showWatermark: false,
        },
        isDefault: true,
        companyId,
      });
    }

    return userId;
  },
});

export const getUser = query({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId))
      .first();
  },
});
