// import { z } from "zod";

// export const templateSchema = z.object({
//   name: z.string().min(1, "Template name is required"),
//   description: z.string().optional(),
//   layout: z.object({
//     headerStyle: z.enum(["minimal", "bold", "creative"]),
//     logoPosition: z.enum(["left", "center", "right"]),
//     colorScheme: z.object({
//       primary: z.string(),
//       secondary: z.string(),
//       accent: z.string(),
//       text: z.string(),
//       background: z.string(),
//     }),
//     fontFamily: z.string(),
//     showBorder: z.boolean(),
//     showWatermark: z.boolean(),
//   }),
//   isDefault: z.boolean(),
// });

// export type TemplateFormData = z.infer<typeof templateSchema>;

import { z } from "zod";

export const templateSchema = z.object({
  name: z.string().min(1, "Template name is required"),
  description: z.string().optional(),
  layout: z.object({
    headerStyle: z.enum(["minimal", "bold", "creative"]),
    logoPosition: z.enum(["left", "center", "right"]),
    colorScheme: z.object({
      primary: z
        .string()
        .regex(
          /^#([0-9A-Fa-f]{6}|[0-9A-Fa-f]{3})$/,
          "Must be a valid hex color (e.g., #ffffff or #fff)"
        ),
      secondary: z
        .string()
        .regex(
          /^#([0-9A-Fa-f]{6}|[0-9A-Fa-f]{3})$/,
          "Must be a valid hex color (e.g., #ffffff or #fff)"
        ),
      accent: z
        .string()
        .regex(
          /^#([0-9A-Fa-f]{6}|[0-9A-Fa-f]{3})$/,
          "Must be a valid hex color (e.g., #ffffff or #fff)"
        ),
      text: z
        .string()
        .regex(
          /^#([0-9A-Fa-f]{6}|[0-9A-Fa-f]{3})$/,
          "Must be a valid hex color (e.g., #ffffff or #fff)"
        ),
      background: z
        .string()
        .regex(
          /^#([0-9A-Fa-f]{6}|[0-9A-Fa-f]{3})$/,
          "Must be a valid hex color (e.g., #ffffff or #fff)"
        ),
    }),
    fontFamily: z.string(),
    showBorder: z.boolean(),
    showWatermark: z.boolean(),
  }),
  isDefault: z.boolean(),
});

export type TemplateFormData = z.infer<typeof templateSchema>;
