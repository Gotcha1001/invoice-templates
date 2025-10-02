// import { z } from "zod";

// export interface TemplateColors {
//   primary: string;
//   secondary: string;
//   accent: string;
//   text: string;
//   background: string;
// }

// export interface TemplateLayout {
//   headerStyle: "minimal" | "bold" | "creative";
//   logoPosition: "left" | "center" | "right";
//   colorScheme: TemplateColors;
//   fontFamily: string;
//   showBorder: boolean;
//   showWatermark: boolean;
// }

// export interface InvoiceTemplate {
//   _id: string;
//   name: string;
//   description: string;
//   layout: TemplateLayout;
//   isDefault: boolean;
//   companyId: string;
//   createdAt: string;
//   updatedAt: string;
// }

// export const templateSchema = z.object({
//   name: z.string().min(1, "Name is required"),
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

export interface TemplateColors {
  primary: string;
  secondary: string;
  accent: string;
  text: string;
  background: string;
}

export interface TemplateLayout {
  headerStyle: "minimal" | "bold" | "creative";
  logoPosition: "left" | "center" | "right";
  colorScheme: TemplateColors;
  fontFamily: string;
  showBorder: boolean;
  showWatermark: boolean;
}

export interface InvoiceTemplate {
  _id: string;
  name: string;
  description: string;
  layout: TemplateLayout;
  isDefault: boolean;
  companyId: string;
}

export const templateSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  layout: z.object({
    headerStyle: z.enum(["minimal", "bold", "creative"]),
    logoPosition: z.enum(["left", "center", "right"]),
    colorScheme: z.object({
      primary: z.string(),
      secondary: z.string(),
      accent: z.string(),
      text: z.string(),
      background: z.string(),
    }),
    fontFamily: z.string(),
    showBorder: z.boolean(),
    showWatermark: z.boolean(),
  }),
  isDefault: z.boolean(),
});

export type TemplateFormData = z.infer<typeof templateSchema>;
