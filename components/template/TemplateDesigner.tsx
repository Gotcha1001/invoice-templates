// "use client";

// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { templateSchema, TemplateFormData } from "@/types/template";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Switch } from "@/components/ui/switch";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
// import { Separator } from "@/components/ui/separator";
// import { motion } from "framer-motion";
// import {
//   Palette,
//   Type,
//   Layout,
//   Save,
//   RotateCcw,
//   AlignLeft,
//   AlignCenter,
//   AlignRight,
// } from "lucide-react";
// import { Company } from "@/types/invoice";

// interface TemplateDesignerProps {
//   onSubmit: (data: TemplateFormData) => void;
//   defaultValues?: TemplateFormData;
//   companyData: Company;
// }

// const colorPresets = [
//   {
//     name: "Professional Blue",
//     colors: {
//       primary: "#2563eb",
//       secondary: "#64748b",
//       accent: "#0ea5e9",
//       text: "#1e293b",
//       background: "#ffffff",
//     },
//   },
//   {
//     name: "Modern Green",
//     colors: {
//       primary: "#059669",
//       secondary: "#6b7280",
//       accent: "#10b981",
//       text: "#111827",
//       background: "#ffffff",
//     },
//   },
//   {
//     name: "Elegant Purple",
//     colors: {
//       primary: "#7c3aed",
//       secondary: "#64748b",
//       accent: "#8b5cf6",
//       text: "#1e293b",
//       background: "#ffffff",
//     },
//   },
//   {
//     name: "Warm Orange",
//     colors: {
//       primary: "#ea580c",
//       secondary: "#6b7280",
//       accent: "#f97316",
//       text: "#111827",
//       background: "#ffffff",
//     },
//   },
// ];

// const fontOptions = [
//   { label: "Inter", value: "Inter, sans-serif" },
//   { label: "Helvetica", value: "Helvetica, Arial, sans-serif" },
//   { label: "Times New Roman", value: "Times New Roman, serif" },
//   { label: "Roboto", value: "Roboto, sans-serif" },
//   { label: "Open Sans", value: "Open Sans, sans-serif" },
// ];

// export default function TemplateDesigner({
//   onSubmit,
//   defaultValues,
//   companyData,
// }: TemplateDesignerProps) {
//   const form = useForm<TemplateFormData>({
//     resolver: zodResolver(templateSchema),
//     defaultValues: defaultValues || {
//       name: "",
//       description: "",
//       layout: {
//         headerStyle: "minimal",
//         logoPosition: "left",
//         colorScheme: {
//           primary: "#2563eb",
//           secondary: "#64748b",
//           accent: "#0ea5e9",
//           text: "#1e293b",
//           background: "#ffffff",
//         },
//         fontFamily: "Inter, sans-serif",
//         showBorder: false,
//         showWatermark: false,
//       },
//       isDefault: false,
//     },
//   });

//   const layout = form.watch("layout");
//   const colorScheme = form.watch("layout.colorScheme");
//   const templateName = form.watch("name");
//   const templateDescription = form.watch("description");

//   const applyColorPreset = (colors: (typeof colorPresets)[0]["colors"]) => {
//     form.setValue("layout.colorScheme", colors);
//   };

//   const resetTemplate = () => {
//     form.reset();
//   };

//   return (
//     <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//       {/* Design Controls */}
//       <motion.div
//         initial={{ opacity: 0, x: -20 }}
//         animate={{ opacity: 1, x: 0 }}
//         className="lg:col-span-1 space-y-6"
//       >
//         <Card>
//           <CardHeader>
//             <CardTitle className="flex items-center gap-2">
//               <Type size={18} />
//               Template Settings
//             </CardTitle>
//           </CardHeader>
//           <CardContent className="space-y-4">
//             <div>
//               <Label htmlFor="name">Template Name</Label>
//               <Input
//                 id="name"
//                 {...form.register("name")}
//                 placeholder="My Custom Template"
//               />
//             </div>
//             <div>
//               <Label htmlFor="description">Description</Label>
//               <Input
//                 id="description"
//                 {...form.register("description")}
//                 placeholder="A professional invoice template"
//               />
//             </div>
//           </CardContent>
//         </Card>

//         <Tabs defaultValue="colors" className="w-full">
//           <TabsList className="grid w-full grid-cols-3">
//             <TabsTrigger value="colors">Colors</TabsTrigger>
//             <TabsTrigger value="layout">Layout</TabsTrigger>
//             <TabsTrigger value="styling">Styling</TabsTrigger>
//           </TabsList>

//           <TabsContent value="colors" className="space-y-4">
//             <Card>
//               <CardHeader>
//                 <CardTitle className="flex items-center gap-2">
//                   <Palette size={18} />
//                   Color Scheme
//                 </CardTitle>
//               </CardHeader>
//               <CardContent className="space-y-4">
//                 <div className="grid grid-cols-2 gap-3">
//                   {colorPresets.map((preset, index) => (
//                     <Button
//                       key={index}
//                       type="button"
//                       variant="outline"
//                       className="h-auto p-3 flex flex-col items-start"
//                       onClick={() => applyColorPreset(preset.colors)}
//                     >
//                       <div className="flex gap-2 mb-2">
//                         <div
//                           className="w-4 h-4 rounded"
//                           style={{ backgroundColor: preset.colors.primary }}
//                         />
//                         <div
//                           className="w-4 h-4 rounded"
//                           style={{ backgroundColor: preset.colors.accent }}
//                         />
//                       </div>
//                       <span className="text-sm">{preset.name}</span>
//                     </Button>
//                   ))}
//                 </div>
//                 <Separator />
//                 <div className="space-y-3">
//                   {Object.entries(colorScheme).map(([key, value]) => (
//                     <div key={key}>
//                       <Label className="capitalize">
//                         {key.replace(/([A-Z])/g, " $1").trim()}
//                       </Label>
//                       <div className="flex gap-2 items-center mt-1">
//                         <Input
//                           type="color"
//                           value={value}
//                           onChange={(e) =>
//                             form.setValue(
//                               `layout.colorScheme.${key}` as any,
//                               e.target.value
//                             )
//                           }
//                           className="w-12 h-8 p-1 border"
//                         />
//                         <Input
//                           value={value}
//                           onChange={(e) =>
//                             form.setValue(
//                               `layout.colorScheme.${key}` as any,
//                               e.target.value
//                             )
//                           }
//                           className="flex-1 text-sm"
//                         />
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </CardContent>
//             </Card>
//           </TabsContent>

//           <TabsContent value="layout" className="space-y-4">
//             <Card>
//               <CardHeader>
//                 <CardTitle className="flex items-center gap-2">
//                   <Layout size={18} />
//                   Layout Options
//                 </CardTitle>
//               </CardHeader>
//               <CardContent className="space-y-4">
//                 <div>
//                   <Label>Header Style</Label>
//                   <Select
//                     value={layout.headerStyle}
//                     onValueChange={(value) =>
//                       form.setValue("layout.headerStyle", value as any)
//                     }
//                   >
//                     <SelectTrigger>
//                       <SelectValue />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="minimal">Minimal</SelectItem>
//                       <SelectItem value="bold">Bold</SelectItem>
//                       <SelectItem value="creative">Creative</SelectItem>
//                     </SelectContent>
//                   </Select>
//                 </div>
//                 <div>
//                   <Label>Logo Position</Label>
//                   <div className="flex gap-2 mt-2">
//                     {[
//                       { value: "left", icon: AlignLeft, label: "Left" },
//                       { value: "center", icon: AlignCenter, label: "Center" },
//                       { value: "right", icon: AlignRight, label: "Right" },
//                     ].map(({ value, icon: Icon, label }) => (
//                       <Button
//                         key={value}
//                         type="button"
//                         variant={
//                           layout.logoPosition === value ? "default" : "outline"
//                         }
//                         size="sm"
//                         onClick={() =>
//                           form.setValue("layout.logoPosition", value as any)
//                         }
//                         className="flex items-center gap-1"
//                       >
//                         <Icon size={14} />
//                         {label}
//                       </Button>
//                     ))}
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//           </TabsContent>

//           <TabsContent value="styling" className="space-y-4">
//             <Card>
//               <CardHeader>
//                 <CardTitle className="flex items-center gap-2">
//                   <Type size={18} />
//                   Typography & Style
//                 </CardTitle>
//               </CardHeader>
//               <CardContent className="space-y-4">
//                 <div>
//                   <Label>Font Family</Label>
//                   <Select
//                     value={layout.fontFamily}
//                     onValueChange={(value) =>
//                       form.setValue("layout.fontFamily", value)
//                     }
//                   >
//                     <SelectTrigger>
//                       <SelectValue />
//                     </SelectTrigger>
//                     <SelectContent>
//                       {fontOptions.map((font) => (
//                         <SelectItem key={font.value} value={font.value}>
//                           {font.label}
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                 </div>
//                 <div className="space-y-3">
//                   <div className="flex items-center justify-between">
//                     <Label htmlFor="show-border">Show Border</Label>
//                     <Switch
//                       id="show-border"
//                       checked={layout.showBorder}
//                       onCheckedChange={(checked) =>
//                         form.setValue("layout.showBorder", checked)
//                       }
//                     />
//                   </div>
//                   <div className="flex items-center justify-between">
//                     <Label htmlFor="show-watermark">Show Watermark</Label>
//                     <Switch
//                       id="show-watermark"
//                       checked={layout.showWatermark}
//                       onCheckedChange={(checked) =>
//                         form.setValue("layout.showWatermark", checked)
//                       }
//                     />
//                   </div>
//                   <div className="flex items-center justify-between">
//                     <Label htmlFor="is-default">Set as Default</Label>
//                     <Switch
//                       id="is-default"
//                       checked={form.watch("isDefault")}
//                       onCheckedChange={(checked) =>
//                         form.setValue("isDefault", checked)
//                       }
//                     />
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//           </TabsContent>
//         </Tabs>

//         <div className="flex gap-3">
//           <Button
//             type="button"
//             onClick={resetTemplate}
//             variant="outline"
//             className="flex-1"
//           >
//             <RotateCcw size={16} className="mr-2" />
//             Reset
//           </Button>
//           <Button onClick={form.handleSubmit(onSubmit)} className="flex-1">
//             <Save size={16} className="mr-2" />
//             Save
//           </Button>
//         </div>
//       </motion.div>

//       {/* Live Preview */}
//       <motion.div
//         initial={{ opacity: 0, x: 20 }}
//         animate={{ opacity: 1, x: 0 }}
//         className="lg:col-span-2"
//       >
//         <Card className="overflow-hidden">
//           <CardHeader>
//             <CardTitle>Live Preview</CardTitle>
//           </CardHeader>
//           <CardContent className="p-0">
//             <div className="p-4 bg-blue-50 border-b border-blue-200">
//               <div className="text-sm font-medium text-blue-900">
//                 <strong>Template:</strong> {templateName || "Untitled Template"}
//               </div>
//               {templateDescription && (
//                 <div className="text-sm text-blue-700 mt-1">
//                   {templateDescription}
//                 </div>
//               )}
//               <div className="text-xs text-blue-600 mt-2">
//                 This preview shows how your template will look. Company details
//                 will be filled when creating invoices.
//               </div>
//             </div>

//             <div
//               className="min-h-[800px] bg-white p-8"
//               style={{
//                 fontFamily: layout.fontFamily,
//                 color: layout.colorScheme.text,
//                 border: layout.showBorder
//                   ? `2px solid ${layout.colorScheme.primary}`
//                   : "none",
//               }}
//             >
//               <div
//                 className={`mb-8 ${
//                   layout.headerStyle === "bold"
//                     ? "bg-gradient-to-r p-6 rounded-lg"
//                     : layout.headerStyle === "creative"
//                       ? "relative overflow-hidden p-6 rounded-xl"
//                       : "pb-6 border-b-2"
//                 }`}
//                 style={{
//                   backgroundColor:
//                     layout.headerStyle !== "minimal"
//                       ? layout.colorScheme.primary
//                       : "transparent",
//                   borderColor:
//                     layout.headerStyle === "minimal"
//                       ? layout.colorScheme.primary
//                       : "transparent",
//                   color:
//                     layout.headerStyle !== "minimal"
//                       ? "#ffffff"
//                       : layout.colorScheme.text,
//                 }}
//               >
//                 {layout.headerStyle === "creative" && (
//                   <div
//                     className="absolute -top-10 -right-10 w-32 h-32 rounded-full opacity-20"
//                     style={{ backgroundColor: layout.colorScheme.accent }}
//                   />
//                 )}
//                 <div
//                   className={`flex items-start ${
//                     layout.logoPosition === "center"
//                       ? "flex-col items-center text-center"
//                       : layout.logoPosition === "right"
//                         ? "flex-row-reverse justify-between"
//                         : "justify-between"
//                   }`}
//                 >
//                   <div
//                     className={
//                       layout.logoPosition === "center" ? "order-2 mt-4" : ""
//                     }
//                   >
//                     <h1 className="text-3xl font-bold mb-2">
//                       {companyData.name}
//                     </h1>
//                     <div className="text-sm opacity-90 whitespace-pre-line">
//                       {companyData.address}
//                     </div>
//                     <div className="text-sm mt-2 opacity-90">
//                       {companyData.phone} • {companyData.email}
//                     </div>
//                     {companyData.bankingDetails && (
//                       <div className="text-sm mt-2 opacity-90">
//                         <div>
//                           <strong>Bank Name:</strong>{" "}
//                           {companyData.bankingDetails.bankName}
//                         </div>
//                         <div>
//                           <strong>Account Number:</strong>{" "}
//                           {companyData.bankingDetails.accountNumber}
//                         </div>
//                         <div>
//                           <strong>Branch Code:</strong>{" "}
//                           {companyData.bankingDetails.branchCode}
//                         </div>
//                         <div>
//                           <strong>Account Holder:</strong>{" "}
//                           {companyData.bankingDetails.accountHolder}
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                   <div
//                     className={
//                       layout.logoPosition === "center" ? "order-1" : ""
//                     }
//                   >
//                     {companyData.logoUrl ? (
//                       <img
//                         src={companyData.logoUrl}
//                         alt="Company logo"
//                         className="h-20 w-20 object-contain rounded-lg"
//                       />
//                     ) : (
//                       <div
//                         className="w-20 h-20 rounded-lg flex items-center justify-center text-xs font-medium"
//                         style={{
//                           backgroundColor:
//                             layout.headerStyle !== "minimal"
//                               ? "rgba(255,255,255,0.2)"
//                               : layout.colorScheme.accent,
//                           color: "#ffffff",
//                         }}
//                       >
//                         LOGO
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               </div>

//               <div className="grid grid-cols-2 gap-8 mb-8">
//                 <div>
//                   <h2
//                     className="text-lg font-semibold mb-4"
//                     style={{ color: layout.colorScheme.primary }}
//                   >
//                     Bill To:
//                   </h2>
//                   <div className="space-y-1">
//                     <div className="font-medium">Customer Name</div>
//                     <div className="text-sm whitespace-pre-line">
//                       Customer Address
//                     </div>
//                     <div className="text-sm">customer@example.com</div>
//                   </div>
//                 </div>
//                 <div className="text-right">
//                   <h1
//                     className="text-4xl font-bold mb-2"
//                     style={{ color: layout.colorScheme.primary }}
//                   >
//                     INVOICE
//                   </h1>
//                   <div className="text-sm space-y-1">
//                     <div>
//                       <strong>Invoice #:</strong> INV-XXXX-001
//                     </div>
//                     <div>
//                       <strong>Date:</strong> YYYY-MM-DD
//                     </div>
//                     <div>
//                       <strong>Due Date:</strong> YYYY-MM-DD
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               <div className="mb-8">
//                 <table className="w-full">
//                   <thead>
//                     <tr
//                       style={{
//                         backgroundColor: layout.colorScheme.primary,
//                         color: "#ffffff",
//                       }}
//                     >
//                       <th className="text-left p-3 font-semibold">
//                         Description
//                       </th>
//                       <th className="text-center p-3 font-semibold">Qty</th>
//                       <th className="text-right p-3 font-semibold">Price</th>
//                       <th className="text-right p-3 font-semibold">Total</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     <tr
//                       style={{
//                         backgroundColor: `${layout.colorScheme.accent}10`,
//                       }}
//                     >
//                       <td className="p-3 border-b border-gray-200">
//                         Sample Item
//                       </td>
//                       <td className="p-3 border-b border-gray-200 text-center">
//                         1
//                       </td>
//                       <td className="p-3 border-b border-gray-200 text-right">
//                         R 0.00
//                       </td>
//                       <td className="p-3 border-b border-gray-200 text-right font-medium">
//                         R 0.00
//                       </td>
//                     </tr>
//                   </tbody>
//                 </table>
//               </div>

//               <div className="flex justify-end mb-8">
//                 <div className="w-80">
//                   <div className="space-y-2">
//                     <div className="flex justify-between py-2">
//                       <span>Subtotal:</span>
//                       <span>R 0.00</span>
//                     </div>
//                     <div className="flex justify-between py-2">
//                       <span>Tax:</span>
//                       <span>R 0.00</span>
//                     </div>
//                     <div
//                       className="flex justify-between py-3 border-t-2 text-xl font-bold"
//                       style={{
//                         borderColor: layout.colorScheme.primary,
//                         color: layout.colorScheme.primary,
//                       }}
//                     >
//                       <span>Total:</span>
//                       <span>R 0.00</span>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               <div
//                 className="text-center text-sm"
//                 style={{ color: layout.colorScheme.secondary }}
//               >
//                 <div className="mb-2">Thank you for your business!</div>
//                 <div>Payment is due within 30 days of invoice date.</div>
//               </div>

//               {layout.showWatermark && (
//                 <div
//                   className="absolute inset-0 flex items-center justify-center pointer-events-none"
//                   style={{
//                     fontSize: "120px",
//                     fontWeight: "bold",
//                     color: `${layout.colorScheme.primary}05`,
//                     transform: "rotate(-45deg)",
//                     zIndex: 0,
//                   }}
//                 >
//                   PREVIEW
//                 </div>
//               )}
//             </div>
//           </CardContent>
//         </Card>
//       </motion.div>
//     </div>
//   );
// }
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { templateSchema, TemplateFormData } from "@/types/template";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { motion } from "framer-motion";
import {
  Palette,
  Type,
  Layout,
  Save,
  RotateCcw,
  AlignLeft,
  AlignCenter,
  AlignRight,
} from "lucide-react";
import { Company } from "@/types/invoice";

interface TemplateDesignerProps {
  onSubmit: (data: TemplateFormData) => void;
  defaultValues?: TemplateFormData;
  companyData: Company;
}

const colorPresets = [
  {
    name: "Professional Blue",
    colors: {
      primary: "#2563eb",
      secondary: "#64748b",
      accent: "#0ea5e9",
      text: "#1e293b",
      background: "#ffffff",
    },
  },
  {
    name: "Modern Green",
    colors: {
      primary: "#059669",
      secondary: "#6b7280",
      accent: "#10b981",
      text: "#111827",
      background: "#ffffff",
    },
  },
  {
    name: "Elegant Purple",
    colors: {
      primary: "#7c3aed",
      secondary: "#64748b",
      accent: "#8b5cf6",
      text: "#1e293b",
      background: "#ffffff",
    },
  },
  {
    name: "Warm Orange",
    colors: {
      primary: "#ea580c",
      secondary: "#6b7280",
      accent: "#f97316",
      text: "#111827",
      background: "#ffffff",
    },
  },
];

const fontOptions = [
  { label: "Inter", value: "Inter, sans-serif" },
  { label: "Helvetica", value: "Helvetica, Arial, sans-serif" },
  { label: "Times New Roman", value: "Times New Roman, serif" },
  { label: "Roboto", value: "Roboto, sans-serif" },
  { label: "Open Sans", value: "Open Sans, sans-serif" },
];

export default function TemplateDesigner({
  onSubmit,
  defaultValues,
  companyData,
}: TemplateDesignerProps) {
  const form = useForm<TemplateFormData>({
    resolver: zodResolver(templateSchema),
    defaultValues: defaultValues || {
      name: "",
      description: "",
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
      isDefault: false,
    },
  });

  const layout = form.watch("layout");
  const colorScheme = form.watch("layout.colorScheme");
  const templateName = form.watch("name");
  const templateDescription = form.watch("description");

  const applyColorPreset = (colors: (typeof colorPresets)[0]["colors"]) => {
    form.setValue("layout.colorScheme", colors);
  };

  const resetTemplate = () => {
    form.reset();
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Design Controls */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="lg:col-span-1 space-y-6"
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Type size={18} />
              Template Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">Template Name</Label>
              <Input
                id="name"
                {...form.register("name")}
                placeholder="My Custom Template"
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                {...form.register("description")}
                placeholder="A professional invoice template"
              />
            </div>
          </CardContent>
        </Card>
        <Tabs defaultValue="colors" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="colors">Colors</TabsTrigger>
            <TabsTrigger value="layout">Layout</TabsTrigger>
            <TabsTrigger value="styling">Styling</TabsTrigger>
          </TabsList>
          <TabsContent value="colors" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette size={18} />
                  Color Scheme
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  {colorPresets.map((preset, index) => (
                    <Button
                      key={index}
                      type="button"
                      variant="outline"
                      className="h-auto p-3 flex flex-col items-start"
                      onClick={() => applyColorPreset(preset.colors)}
                    >
                      <div className="flex gap-2 mb-2">
                        <div
                          className="w-4 h-4 rounded"
                          style={{ backgroundColor: preset.colors.primary }}
                        />
                        <div
                          className="w-4 h-4 rounded"
                          style={{ backgroundColor: preset.colors.accent }}
                        />
                      </div>
                      <span className="text-sm">{preset.name}</span>
                    </Button>
                  ))}
                </div>
                <Separator />
                <div className="space-y-3">
                  {Object.entries(colorScheme).map(([key, value]) => (
                    <div key={key}>
                      <Label className="capitalize">
                        {key.replace(/([A-Z])/g, " $1").trim()}
                      </Label>
                      <div className="flex gap-2 items-center mt-1">
                        <Input
                          type="color"
                          value={value}
                          onChange={(e) =>
                            form.setValue(
                              `layout.colorScheme.${key}` as any,
                              e.target.value
                            )
                          }
                          className="w-12 h-8 p-1 border"
                        />
                        <Input
                          value={value}
                          onChange={(e) =>
                            form.setValue(
                              `layout.colorScheme.${key}` as any,
                              e.target.value
                            )
                          }
                          className="flex-1 text-sm"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="layout" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Layout size={18} />
                  Layout Options
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Header Style</Label>
                  <Select
                    value={layout.headerStyle}
                    onValueChange={(value) =>
                      form.setValue("layout.headerStyle", value as any)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="minimal">Minimal</SelectItem>
                      <SelectItem value="bold">Bold</SelectItem>
                      <SelectItem value="creative">Creative</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Logo Position</Label>
                  <div className="flex gap-2 mt-2">
                    {[
                      { value: "left", icon: AlignLeft, label: "Left" },
                      { value: "center", icon: AlignCenter, label: "Center" },
                      { value: "right", icon: AlignRight, label: "Right" },
                    ].map(({ value, icon: Icon, label }) => (
                      <Button
                        key={value}
                        type="button"
                        variant={
                          layout.logoPosition === value ? "default" : "outline"
                        }
                        size="sm"
                        onClick={() =>
                          form.setValue("layout.logoPosition", value as any)
                        }
                        className="flex items-center gap-1"
                      >
                        <Icon size={14} />
                        {label}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="styling" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Type size={18} />
                  Typography & Style
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Font Family</Label>
                  <Select
                    value={layout.fontFamily}
                    onValueChange={(value) =>
                      form.setValue("layout.fontFamily", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {fontOptions.map((font) => (
                        <SelectItem key={font.value} value={font.value}>
                          {font.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="show-border">Show Border</Label>
                    <Switch
                      id="show-border"
                      checked={layout.showBorder}
                      onCheckedChange={(checked) =>
                        form.setValue("layout.showBorder", checked)
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="show-watermark">Show Watermark</Label>
                    <Switch
                      id="show-watermark"
                      checked={layout.showWatermark}
                      onCheckedChange={(checked) =>
                        form.setValue("layout.showWatermark", checked)
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="is-default">Set as Default</Label>
                    <Switch
                      id="is-default"
                      checked={form.watch("isDefault")}
                      onCheckedChange={(checked) =>
                        form.setValue("isDefault", checked)
                      }
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        <div className="flex gap-3">
          <Button
            type="button"
            onClick={resetTemplate}
            variant="outline"
            className="flex-1"
          >
            <RotateCcw size={16} className="mr-2" />
            Reset
          </Button>
          <Button onClick={form.handleSubmit(onSubmit)} className="flex-1">
            <Save size={16} className="mr-2" />
            Save
          </Button>
        </div>
      </motion.div>
      {/* Live Preview */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="lg:col-span-2"
      >
        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle>Live Preview</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="p-4 bg-blue-50 border-b border-blue-200">
              <div className="text-sm font-medium text-blue-900">
                <strong>Template:</strong> {templateName || "Untitled Template"}
              </div>
              {templateDescription && (
                <div className="text-sm text-blue-700 mt-1">
                  {templateDescription}
                </div>
              )}
              <div className="text-xs text-blue-600 mt-2">
                This preview shows how your template will look. Company details
                will be filled when creating invoices.
              </div>
            </div>
            <div
              className="min-h-[800px] p-8"
              style={{
                fontFamily: layout.fontFamily,
                color: layout.colorScheme.text,
                backgroundColor: layout.colorScheme.background, // ✅ FIXED: Added background color
                border: layout.showBorder
                  ? `2px solid ${layout.colorScheme.primary}`
                  : "none",
              }}
            >
              <div
                className={`mb-8 ${
                  layout.headerStyle === "bold"
                    ? "bg-gradient-to-r p-6 rounded-lg"
                    : layout.headerStyle === "creative"
                      ? "relative overflow-hidden p-6 rounded-xl"
                      : "pb-6 border-b-2"
                }`}
                style={{
                  backgroundColor:
                    layout.headerStyle !== "minimal"
                      ? layout.colorScheme.primary
                      : "transparent",
                  borderColor:
                    layout.headerStyle === "minimal"
                      ? layout.colorScheme.primary
                      : "transparent",
                  color:
                    layout.headerStyle !== "minimal"
                      ? "#ffffff"
                      : layout.colorScheme.text,
                }}
              >
                {layout.headerStyle === "creative" && (
                  <div
                    className="absolute -top-10 -right-10 w-32 h-32 rounded-full opacity-20"
                    style={{ backgroundColor: layout.colorScheme.accent }}
                  />
                )}
                <div
                  className={`flex items-start ${
                    layout.logoPosition === "center"
                      ? "flex-col items-center text-center"
                      : layout.logoPosition === "right"
                        ? "flex-row-reverse justify-between"
                        : "justify-between"
                  }`}
                >
                  <div
                    className={
                      layout.logoPosition === "center" ? "order-2 mt-4" : ""
                    }
                  >
                    <h1 className="text-3xl font-bold mb-2">
                      {companyData.name}
                    </h1>
                    <div className="text-sm opacity-90 whitespace-pre-line">
                      {companyData.address}
                    </div>
                    <div className="text-sm mt-2 opacity-90">
                      {companyData.phone} • {companyData.email}
                    </div>
                    {companyData.bankingDetails && (
                      <div className="text-sm mt-2 opacity-90">
                        <div>
                          <strong>Bank Name:</strong>{" "}
                          {companyData.bankingDetails.bankName}
                        </div>
                        <div>
                          <strong>Account Number:</strong>{" "}
                          {companyData.bankingDetails.accountNumber}
                        </div>
                        <div>
                          <strong>Branch Code:</strong>{" "}
                          {companyData.bankingDetails.branchCode}
                        </div>
                        <div>
                          <strong>Account Holder:</strong>{" "}
                          {companyData.bankingDetails.accountHolder}
                        </div>
                      </div>
                    )}
                  </div>
                  <div
                    className={
                      layout.logoPosition === "center" ? "order-1" : ""
                    }
                  >
                    {companyData.logoUrl ? (
                      <img
                        src={companyData.logoUrl}
                        alt="Company logo"
                        className="h-20 w-20 object-contain rounded-lg"
                      />
                    ) : (
                      <div
                        className="w-20 h-20 rounded-lg flex items-center justify-center text-xs font-medium"
                        style={{
                          backgroundColor:
                            layout.headerStyle !== "minimal"
                              ? "rgba(255,255,255,0.2)"
                              : layout.colorScheme.accent,
                          color: "#ffffff",
                        }}
                      >
                        LOGO
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-8 mb-8">
                <div>
                  <h2
                    className="text-lg font-semibold mb-4"
                    style={{ color: layout.colorScheme.primary }}
                  >
                    Bill To:
                  </h2>
                  <div className="space-y-1">
                    <div className="font-medium">Customer Name</div>
                    <div className="text-sm whitespace-pre-line">
                      Customer Address
                    </div>
                    <div className="text-sm">customer@example.com</div>
                  </div>
                </div>
                <div className="text-right">
                  <h1
                    className="text-4xl font-bold mb-2"
                    style={{ color: layout.colorScheme.primary }}
                  >
                    INVOICE
                  </h1>
                  <div className="text-sm space-y-1">
                    <div>
                      <strong>Invoice #:</strong> INV-XXXX-001
                    </div>
                    <div>
                      <strong>Date:</strong> YYYY-MM-DD
                    </div>
                    <div>
                      <strong>Due Date:</strong> YYYY-MM-DD
                    </div>
                  </div>
                </div>
              </div>
              <div className="mb-8">
                <table className="w-full">
                  <thead>
                    <tr
                      style={{
                        backgroundColor: layout.colorScheme.primary,
                        color: "#ffffff",
                      }}
                    >
                      <th className="text-left p-3 font-semibold">
                        Description
                      </th>
                      <th className="text-center p-3 font-semibold">Qty</th>
                      <th className="text-right p-3 font-semibold">Price</th>
                      <th className="text-right p-3 font-semibold">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      style={{
                        backgroundColor: `${layout.colorScheme.accent}10`,
                      }}
                    >
                      <td className="p-3 border-b border-gray-200">
                        Sample Item
                      </td>
                      <td className="p-3 border-b border-gray-200 text-center">
                        1
                      </td>
                      <td className="p-3 border-b border-gray-200 text-right">
                        R 0.00
                      </td>
                      <td className="p-3 border-b border-gray-200 text-right font-medium">
                        R 0.00
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="flex justify-end mb-8">
                <div className="w-80">
                  <div className="space-y-2">
                    <div className="flex justify-between py-2">
                      <span>Subtotal:</span>
                      <span>R 0.00</span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span>Tax:</span>
                      <span>R 0.00</span>
                    </div>
                    <div
                      className="flex justify-between py-3 border-t-2 text-xl font-bold"
                      style={{
                        borderColor: layout.colorScheme.primary,
                        color: layout.colorScheme.primary,
                      }}
                    >
                      <span>Total:</span>
                      <span>R 0.00</span>
                    </div>
                  </div>
                </div>
              </div>
              <div
                className="text-center text-sm"
                style={{ color: layout.colorScheme.secondary }}
              >
                <div className="mb-2">Thank you for your business!</div>
                <div>Payment is due within 30 days of invoice date.</div>
              </div>
              {layout.showWatermark && (
                <div
                  className="absolute inset-0 flex items-center justify-center pointer-events-none"
                  style={{
                    fontSize: "120px",
                    fontWeight: "bold",
                    color: `${layout.colorScheme.primary}05`,
                    transform: "rotate(-45deg)",
                    zIndex: 0,
                  }}
                >
                  PREVIEW
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
