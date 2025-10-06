//RED RABBIT ++++++++++++++++++++++
// "use client";

// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { templateSchema } from "@/types/template";
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
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
// import z from "zod";

// type TemplateFormData = z.infer<typeof templateSchema>;

// interface TemplateDesignerProps {
//   onSubmit: (data: TemplateFormData) => void;
//   defaultValues?: TemplateFormData;
//   companyData?: {
//     name: string;
//     address: string;
//     phone: string;
//     email: string;
//     logoUrl?: string;
//   };
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

//   // Use actual company data or fallback to mock data
//   const companyInfo = companyData || {
//     name: "Your Company Name",
//     address: "123 Business Street\nCity, State 12345",
//     phone: "+1 (555) 123-4567",
//     email: "hello@company.com",
//     logoUrl: "",
//   };

//   // Mock invoice data for preview
//   const mockInvoiceData = {
//     invoiceNumber: "INV-2024-001",
//     customer: {
//       name: "John Doe",
//       address: "456 Customer Ave\nCustomer City, State 67890",
//       email: "john@example.com",
//     },
//     items: [
//       {
//         description: "Web Design Services",
//         quantity: 1,
//         price: 1500,
//         total: 1500,
//       },
//       { description: "Logo Design", quantity: 2, price: 250, total: 500 },
//     ],
//     subtotal: 2000,
//     tax: 200,
//     total: 2200,
//     issueDate: "2024-01-15",
//     dueDate: "2024-02-15",
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
//             {/* Template Info Banner */}
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
//               {/* Header */}
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
//                       {companyInfo.name}
//                     </h1>
//                     <div className="text-sm opacity-90 whitespace-pre-line">
//                       {companyInfo.address}
//                     </div>
//                     <div className="text-sm mt-2 opacity-90">
//                       {companyInfo.phone} • {companyInfo.email}
//                     </div>
//                   </div>
//                   <div
//                     className={
//                       layout.logoPosition === "center" ? "order-1" : ""
//                     }
//                   >
//                     {companyInfo.logoUrl ? (
//                       <img
//                         src={companyInfo.logoUrl}
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

//               {/* Invoice Details */}
//               <div className="grid grid-cols-2 gap-8 mb-8">
//                 <div>
//                   <h2
//                     className="text-lg font-semibold mb-4"
//                     style={{ color: layout.colorScheme.primary }}
//                   >
//                     Bill To:
//                   </h2>
//                   <div className="space-y-1">
//                     <div className="font-medium">
//                       {mockInvoiceData.customer.name}
//                     </div>
//                     <div className="text-sm whitespace-pre-line">
//                       {mockInvoiceData.customer.address}
//                     </div>
//                     <div className="text-sm">
//                       {mockInvoiceData.customer.email}
//                     </div>
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
//                       <strong>Invoice #:</strong>{" "}
//                       {mockInvoiceData.invoiceNumber}
//                     </div>
//                     <div>
//                       <strong>Date:</strong> {mockInvoiceData.issueDate}
//                     </div>
//                     <div>
//                       <strong>Due Date:</strong> {mockInvoiceData.dueDate}
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Items Table */}
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
//                     {mockInvoiceData.items.map((item, index) => (
//                       <tr
//                         key={index}
//                         style={{
//                           backgroundColor:
//                             index % 2 === 0
//                               ? `${layout.colorScheme.accent}10`
//                               : "transparent",
//                         }}
//                       >
//                         <td className="p-3 border-b border-gray-200">
//                           {item.description}
//                         </td>
//                         <td className="p-3 border-b border-gray-200 text-center">
//                           {item.quantity}
//                         </td>
//                         <td className="p-3 border-b border-gray-200 text-right">
//                           ${item.price.toFixed(2)}
//                         </td>
//                         <td className="p-3 border-b border-gray-200 text-right font-medium">
//                           ${item.total.toFixed(2)}
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>

//               {/* Totals */}
//               <div className="flex justify-end mb-8">
//                 <div className="w-80">
//                   <div className="space-y-2">
//                     <div className="flex justify-between py-2">
//                       <span>Subtotal:</span>
//                       <span>${mockInvoiceData.subtotal.toFixed(2)}</span>
//                     </div>
//                     <div className="flex justify-between py-2">
//                       <span>Tax:</span>
//                       <span>${mockInvoiceData.tax.toFixed(2)}</span>
//                     </div>
//                     <div
//                       className="flex justify-between py-3 border-t-2 text-xl font-bold"
//                       style={{
//                         borderColor: layout.colorScheme.primary,
//                         color: layout.colorScheme.primary,
//                       }}
//                     >
//                       <span>Total:</span>
//                       <span>${mockInvoiceData.total.toFixed(2)}</span>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Footer */}
//               <div
//                 className="text-center text-sm"
//                 style={{ color: layout.colorScheme.secondary }}
//               >
//                 <div className="mb-2">Thank you for your business!</div>
//                 <div>Payment is due within 30 days of invoice date.</div>
//               </div>

//               {/* Watermark */}
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
// "use client";

// import { useState, useEffect } from "react";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { z } from "zod";
// import { templateSchema, TemplateFormData } from "@/types/template";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Switch } from "@/components/ui/switch";
// import { Company } from "@/types/invoice";
// import { toast } from "sonner";
// import { Eye } from "lucide-react";

// interface TemplateDesignerProps {
//   onSubmit: (
//     data: TemplateFormData & {
//       defaultItems?: Array<{
//         description: string;
//         quantity: number;
//         price: number;
//       }>;
//     }
//   ) => void;
//   defaultValues?: TemplateFormData;
//   companyData: Company;
// }

// export default function TemplateDesigner({
//   onSubmit,
//   defaultValues,
//   companyData,
// }: TemplateDesignerProps) {
//   const {
//     register,
//     handleSubmit,
//     watch,
//     setValue,
//     formState: { errors },
//   } = useForm<TemplateFormData>({
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
//       isDefault: true,
//     },
//   });

//   const [defaultItems, setDefaultItems] = useState<
//     Array<{ description: string; quantity: number; price: number }>
//   >([{ description: "Sample Item", quantity: 1, price: 0 }]);

//   const layout = watch("layout");

//   const addDefaultItem = () => {
//     setDefaultItems([
//       ...defaultItems,
//       { description: "", quantity: 1, price: 0 },
//     ]);
//   };

//   const updateDefaultItem = (
//     index: number,
//     field: keyof { description: string; quantity: number; price: number },
//     value: string | number
//   ) => {
//     const updatedItems = [...defaultItems];
//     updatedItems[index] = { ...updatedItems[index], [field]: value };
//     setDefaultItems(updatedItems);
//   };

//   const removeDefaultItem = (index: number) => {
//     setDefaultItems(defaultItems.filter((_, i) => i !== index));
//   };

//   const onFormSubmit = (data: TemplateFormData) => {
//     onSubmit({ ...data, defaultItems });
//   };

//   return (
//     <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//       <Card>
//         <CardHeader>
//           <CardTitle>Template Designer</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
//             <div>
//               <Label>Template Name</Label>
//               <Input {...register("name")} />
//               {errors.name && (
//                 <p className="text-red-500 text-sm">{errors.name.message}</p>
//               )}
//             </div>
//             <div>
//               <Label>Description</Label>
//               <Input {...register("description")} />
//             </div>
//             <div>
//               <Label>Header Style</Label>
//               <Select
//                 value={layout.headerStyle}
//                 onValueChange={(value) =>
//                   setValue(
//                     "layout.headerStyle",
//                     value as "minimal" | "bold" | "creative"
//                   )
//                 }
//               >
//                 <SelectTrigger>
//                   <SelectValue />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="minimal">Minimal</SelectItem>
//                   <SelectItem value="bold">Bold</SelectItem>
//                   <SelectItem value="creative">Creative</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>
//             <div>
//               <Label>Logo Position</Label>
//               <Select
//                 value={layout.logoPosition}
//                 onValueChange={(value) =>
//                   setValue(
//                     "layout.logoPosition",
//                     value as "left" | "center" | "right"
//                   )
//                 }
//               >
//                 <SelectTrigger>
//                   <SelectValue />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="left">Left</SelectItem>
//                   <SelectItem value="center">Center</SelectItem>
//                   <SelectItem value="right">Right</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>
//             <div className="grid grid-cols-2 gap-4">
//               <div>
//                 <Label>Primary Color</Label>
//                 <Input
//                   type="color"
//                   {...register("layout.colorScheme.primary")}
//                 />
//               </div>
//               <div>
//                 <Label>Secondary Color</Label>
//                 <Input
//                   type="color"
//                   {...register("layout.colorScheme.secondary")}
//                 />
//               </div>
//               <div>
//                 <Label>Accent Color</Label>
//                 <Input
//                   type="color"
//                   {...register("layout.colorScheme.accent")}
//                 />
//               </div>
//               <div>
//                 <Label>Text Color</Label>
//                 <Input type="color" {...register("layout.colorScheme.text")} />
//               </div>
//               <div>
//                 <Label>Background Color</Label>
//                 <Input
//                   type="color"
//                   {...register("layout.colorScheme.background")}
//                 />
//               </div>
//             </div>
//             <div>
//               <Label>Font Family</Label>
//               <Input {...register("layout.fontFamily")} />
//             </div>
//             <div className="flex items-center space-x-2">
//               <Switch
//                 checked={layout.showBorder}
//                 onCheckedChange={(checked) =>
//                   setValue("layout.showBorder", checked)
//                 }
//               />
//               <Label>Show Border</Label>
//             </div>
//             <div className="flex items-center space-x-2">
//               <Switch
//                 checked={layout.showWatermark}
//                 onCheckedChange={(checked) =>
//                   setValue("layout.showWatermark", checked)
//                 }
//               />
//               <Label>Show Watermark</Label>
//             </div>
//             <div>
//               <Label>Default Items</Label>
//               {defaultItems.map((item, index) => (
//                 <div key={index} className="flex space-x-4 mb-4">
//                   <div className="flex-1">
//                     <Input
//                       value={item.description}
//                       onChange={(e) =>
//                         updateDefaultItem(index, "description", e.target.value)
//                       }
//                       placeholder="Item description"
//                     />
//                   </div>
//                   <div className="w-24">
//                     <Input
//                       type="number"
//                       value={item.quantity}
//                       onChange={(e) =>
//                         updateDefaultItem(
//                           index,
//                           "quantity",
//                           parseInt(e.target.value) || 1
//                         )
//                       }
//                       min="1"
//                     />
//                   </div>
//                   <div className="w-32">
//                     <Input
//                       type="number"
//                       value={item.price}
//                       onChange={(e) =>
//                         updateDefaultItem(
//                           index,
//                           "price",
//                           parseFloat(e.target.value) || 0
//                         )
//                       }
//                       min="0"
//                       step="0.01"
//                     />
//                   </div>
//                   <Button
//                     variant="destructive"
//                     onClick={() => removeDefaultItem(index)}
//                     disabled={defaultItems.length === 1}
//                   >
//                     Remove
//                   </Button>
//                 </div>
//               ))}
//               <Button type="button" onClick={addDefaultItem} className="mt-2">
//                 Add Item
//               </Button>
//             </div>
//             <Button type="submit">Save Template</Button>
//           </form>
//         </CardContent>
//       </Card>
//       <Card>
//         <CardHeader>
//           <CardTitle>Preview</CardTitle>
//         </CardHeader>
//         <CardContent
//           style={{
//             backgroundColor: layout.colorScheme.background,
//             color: layout.colorScheme.text,
//             fontFamily: layout.fontFamily,
//             border: layout.showBorder
//               ? `1px solid ${layout.colorScheme.primary}`
//               : "none",
//           }}
//         >
//           <div style={{ textAlign: layout.logoPosition }}>
//             {companyData.logoUrl && (
//               <img
//                 src={companyData.logoUrl}
//                 alt="Company Logo"
//                 style={{ maxWidth: "100px", marginBottom: "1rem" }}
//               />
//             )}
//           </div>
//           <h2
//             style={{
//               fontWeight: layout.headerStyle === "bold" ? "bold" : "normal",
//             }}
//           >
//             Invoice Template Preview
//           </h2>
//           <p>{companyData.name}</p>
//           <p>{companyData.address}</p>
//           <p>{companyData.phone}</p>
//           <p>{companyData.email}</p>
//           {companyData.bankingDetails && (
//             <div>
//               <p>
//                 <strong>Bank Name:</strong>{" "}
//                 {companyData.bankingDetails.bankName}
//               </p>
//               <p>
//                 <strong>Account Number:</strong>{" "}
//                 {companyData.bankingDetails.accountNumber}
//               </p>
//               <p>
//                 <strong>Branch Code:</strong>{" "}
//                 {companyData.bankingDetails.branchCode}
//               </p>
//               <p>
//                 <strong>Account Holder:</strong>{" "}
//                 {companyData.bankingDetails.accountHolder}
//               </p>
//             </div>
//           )}
//           <table style={{ width: "100%", marginTop: "1rem" }}>
//             <thead>
//               <tr
//                 style={{
//                   backgroundColor: layout.colorScheme.secondary,
//                   color: layout.colorScheme.text,
//                 }}
//               >
//                 <th>Description</th>
//                 <th>Quantity</th>
//                 <th>Price</th>
//                 <th>Total</th>
//               </tr>
//             </thead>
//             <tbody>
//               {defaultItems.map((item, index) => (
//                 <tr key={index}>
//                   <td>{item.description || "Sample Item"}</td>
//                   <td>{item.quantity}</td>
//                   <td>R {item.price.toFixed(2)}</td>
//                   <td>R {(item.quantity * item.price).toFixed(2)}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//           <div style={{ marginTop: "1rem", textAlign: "right" }}>
//             <p>Subtotal: R 0.00</p>
//             <p>Tax: R 0.00</p>
//             <p>
//               <strong>Total: R 0.00</strong>
//             </p>
//           </div>
//           {layout.showWatermark && (
//             <p style={{ opacity: 0.5, textAlign: "center" }}>Watermark</p>
//           )}
//         </CardContent>
//       </Card>
//     </div>
//   );
// }
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
              className="min-h-[800px] bg-white p-8"
              style={{
                fontFamily: layout.fontFamily,
                color: layout.colorScheme.text,
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
