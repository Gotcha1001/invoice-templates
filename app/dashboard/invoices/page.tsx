// "use client";

// import React, { useState, useEffect } from "react";

// import { motion, AnimatePresence } from "framer-motion";

// import {
//   Plus,
//   Trash2,
//   Upload,
//   Save,
//   Eye,
//   FileText,
//   Sparkles,
// } from "lucide-react";

// import { Button } from "@/components/ui/button";

// import { Input } from "@/components/ui/input";

// import { Label } from "@/components/ui/label";

// import { Textarea } from "@/components/ui/textarea";

// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";

// import { useMutation, useQuery } from "convex/react";

// import { api } from "@/convex/_generated/api";

// import { useUser } from "@clerk/nextjs";

// import { toast } from "sonner";

// import { useRouter } from "next/navigation";

// import InvoicePreview from "@/components/invoice/InvoicePreview";

// import { Id, Doc } from "@/convex/_generated/dataModel";

// import { formatCurrency } from "@/lib/currency";

// import { useForm, useFieldArray } from "react-hook-form";

// interface InvoiceItem {
//   id: string;
//   description: string;
//   quantity: number;
//   price: number;
// }

// interface Customer {
//   name: string;
//   email: string;
//   address: string;
//   phone: string;
// }

// interface Company {
//   name: string;
//   address: string;
//   phone: string;
//   email: string;
//   website: string;
//   logoUrl: string;
//   bankingDetails: {
//     bankName: string;
//     accountNumber: string;
//     branchCode: string;
//     accountHolder: string;
//   };
// }

// interface FormData {
//   company: Company;
//   customer: Customer;
//   items: InvoiceItem[];
//   invoiceDetails: {
//     invoiceNumber: string;
//     issueDate: string;
//     dueDate: string;
//     notes: string;
//     tax: number;
//     templateId: Id<"templates">;
//     currency: string;
//   };
//   logoFile?: File | null;
// }

// export default function InvoiceCreationForm() {
//   const { user } = useUser();
//   const router = useRouter();
//   const { control, register, watch, reset, setValue, handleSubmit } =
//     useForm<FormData>({
//       defaultValues: {
//         company: {
//           name: "",
//           address: "",
//           phone: "",
//           email: "",
//           website: "",
//           logoUrl: "",
//           bankingDetails: {
//             bankName: "",
//             accountNumber: "",
//             branchCode: "",
//             accountHolder: "",
//           },
//         },
//         customer: {
//           name: "",
//           email: "",
//           address: "",
//           phone: "",
//         },
//         items: [
//           {
//             id: Date.now().toString(),
//             description: "",
//             quantity: 1,
//             price: 0,
//           },
//         ],
//         invoiceDetails: {
//           invoiceNumber: `INV-${Date.now()}`,
//           issueDate: new Date().toISOString().split("T")[0],
//           dueDate: "",
//           notes: "",
//           tax: 0,
//           templateId: "" as Id<"templates">,
//           currency: "ZAR",
//         },
//       },
//     });
//   const { fields, append, remove } = useFieldArray({
//     control,
//     name: "items",
//   });

//   const watchedValues = watch();
//   const [logoFile, setLogoFile] = useState<File | null>(null);
//   const [logoPreview, setLogoPreview] = useState<string>("");
//   const [showPreview, setShowPreview] = useState(false);

//   const companies = useQuery(
//     api.companies.getCompaniesByUser,
//     user ? {} : "skip"
//   );
//   const selectedCompany = companies?.find(
//     (c: Doc<"companies">) => c.name === watchedValues.company.name
//   );
//   const templates = useQuery(
//     api.templates.getTemplatesByCompany,
//     selectedCompany ? { companyId: selectedCompany._id } : "skip"
//   );
//   const createInvoice = useMutation(api.invoices.createInvoice);
//   const updateCompany = useMutation(api.companies.updateCompany);

//   useEffect(() => {
//     const timer = setTimeout(() => {
//       localStorage.setItem("invoice-draft", JSON.stringify(watchedValues));
//     }, 1000);
//     return () => clearTimeout(timer);
//   }, [watchedValues]);

//   useEffect(() => {
//     const draft = localStorage.getItem("invoice-draft");
//     if (draft) {
//       const shouldRestore = confirm("Restore previous draft?");
//       if (shouldRestore) {
//         const data = JSON.parse(draft);
//         reset(data);
//       }
//     }
//   }, [reset]);

//   useEffect(() => {
//     if (companies && companies.length > 0 && !watchedValues.company.name) {
//       const defaultCompany = companies[0];
//       setValue("company", {
//         name: defaultCompany.name,
//         address: defaultCompany.address,
//         phone: defaultCompany.phone,
//         email: defaultCompany.email,
//         website: defaultCompany.website || "",
//         logoUrl: defaultCompany.logoUrl || "",
//         bankingDetails: defaultCompany.bankingDetails,
//       });
//       setLogoPreview(defaultCompany.logoUrl || "");
//     }
//   }, [companies, setValue, watchedValues.company.name]);

//   useEffect(() => {
//     if (
//       templates &&
//       templates.length > 0 &&
//       !watchedValues.invoiceDetails.templateId
//     ) {
//       const defaultTemplate =
//         templates.find((t: Doc<"templates">) => t.isDefault) || templates[0];
//       setValue("invoiceDetails.templateId", defaultTemplate._id);
//     }
//   }, [templates, setValue, watchedValues.invoiceDetails.templateId]);

//   // Validate templateId when templates change
//   useEffect(() => {
//     if (templates && watchedValues.invoiceDetails.templateId) {
//       const currentId = watchedValues.invoiceDetails.templateId;
//       if (!templates.find((t) => t._id === currentId)) {
//         setValue(
//           "invoiceDetails.templateId",
//           templates.length > 0
//             ? (templates.find((t) => t.isDefault) || templates[0])._id
//             : ("" as Id<"templates">)
//         );
//       }
//     }
//   }, [templates, watchedValues.invoiceDetails.templateId, setValue]);

//   const subtotal = watchedValues.items.reduce(
//     (sum, item) => sum + item.quantity * item.price,
//     0
//   );
//   const taxAmount = (subtotal * watchedValues.invoiceDetails.tax) / 100;
//   const total = subtotal + taxAmount;

//   const addItem = () => {
//     append({
//       id: Date.now().toString(),
//       description: "",
//       quantity: 1,
//       price: 0,
//     });
//   };

//   const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       setLogoFile(file);
//       const reader = new FileReader();
//       reader.onload = () => setLogoPreview(reader.result as string);
//       reader.readAsDataURL(file);
//     }
//   };

//   const uploadToCloudinary = async () => {
//     if (!logoFile) return watchedValues.company.logoUrl || "";

//     const formData = new FormData();
//     formData.append("file", logoFile);
//     formData.append("upload_preset", "invoice_logos");

//     try {
//       const response = await fetch(
//         `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
//         {
//           method: "POST",
//           body: formData,
//         }
//       );
//       const data = await response.json();
//       return data.secure_url;
//     } catch (error) {
//       console.error("Error uploading logo:", error);
//       toast.error("Failed to upload logo.");
//       return "";
//     }
//   };

//   const validateForm = () => {
//     if (
//       !watchedValues.company.name ||
//       !watchedValues.company.address ||
//       !watchedValues.company.email
//     ) {
//       toast.error("Please fill in all required company details.");
//       return false;
//     }

//     if (
//       !watchedValues.customer.name ||
//       !watchedValues.customer.email ||
//       !watchedValues.customer.address
//     ) {
//       toast.error("Please fill in all required customer details.");
//       return false;
//     }

//     if (!watchedValues.invoiceDetails.templateId) {
//       toast.error("Please select a template.");
//       return false;
//     }

//     if (!watchedValues.invoiceDetails.dueDate) {
//       toast.error("Please set a due date.");
//       return false;
//     }

//     if (
//       watchedValues.items.some(
//         (item) => !item.description || item.quantity <= 0 || item.price < 0
//       )
//     ) {
//       toast.error("Please fill in all item details correctly.");
//       return false;
//     }

//     return true;
//   };

//   const onSubmit = async (data: FormData) => {
//     if (!validateForm()) return;
//     if (!selectedCompany) {
//       toast.error("Please select a valid company.");
//       return;
//     }

//     try {
//       const logoUrl = await uploadToCloudinary();

//       // Update company with any changes, including new logo if uploaded
//       await updateCompany({
//         id: selectedCompany._id,
//         name: data.company.name,
//         address: data.company.address,
//         phone: data.company.phone,
//         email: data.company.email,
//         website: data.company.website,
//         logoUrl: logoUrl || data.company.logoUrl,
//         bankingDetails: data.company.bankingDetails,
//         userId: user!.id,
//       });

//       const invoiceData = {
//         invoiceNumber: data.invoiceDetails.invoiceNumber,
//         companyId: selectedCompany._id,
//         templateId: data.invoiceDetails.templateId,
//         customer: data.customer,
//         items: data.items.map((item) => ({
//           id: item.id,
//           description: item.description,
//           quantity: item.quantity,
//           price: item.price,
//           total: item.quantity * item.price,
//         })),
//         subtotal,
//         tax: taxAmount,
//         total,
//         status: "draft" as const,
//         issueDate: data.invoiceDetails.issueDate,
//         dueDate: data.invoiceDetails.dueDate,
//         notes: data.invoiceDetails.notes,
//         currency: data.invoiceDetails.currency,
//       };

//       const invoiceId = await createInvoice(invoiceData);
//       localStorage.removeItem("invoice-draft");
//       toast.success("Invoice created successfully!");
//       router.push(`/dashboard/invoices/${invoiceId}`);
//     } catch (error) {
//       console.error("Error saving invoice:", error);
//       toast.error("Failed to save invoice.");
//     }
//   };

//   if (!user || companies === undefined) {
//     return (
//       <div className="flex flex-col justify-center items-center h-screen bg-gradient-to-br from-slate-50 to-slate-100">
//         <motion.div
//           initial={{ opacity: 0, scale: 0.9 }}
//           animate={{ opacity: 1, scale: 1 }}
//           transition={{ duration: 0.5 }}
//         >
//           <FileText size={64} className="mx-auto text-indigo-500 mb-4" />
//           <p className="text-slate-600 text-lg font-medium">Loading...</p>
//         </motion.div>
//       </div>
//     );
//   }

//   const selectedTemplate = templates?.find(
//     (t: Doc<"templates">) => t._id === watchedValues.invoiceDetails.templateId
//   );

//   const previewInvoice: Doc<"invoices"> = {
//     _id: "preview" as Id<"invoices">,
//     _creationTime: Date.now(),
//     invoiceNumber: watchedValues.invoiceDetails.invoiceNumber,
//     companyId: selectedCompany?._id || ("" as Id<"companies">),
//     templateId: watchedValues.invoiceDetails.templateId,
//     customer: watchedValues.customer,
//     items: watchedValues.items.map((item) => ({
//       id: item.id,
//       description: item.description,
//       quantity: item.quantity,
//       price: item.price,
//       total: item.quantity * item.price,
//     })),
//     subtotal,
//     tax: taxAmount,
//     total,
//     status: "draft",
//     issueDate: watchedValues.invoiceDetails.issueDate,
//     dueDate: watchedValues.invoiceDetails.dueDate,
//     notes: watchedValues.invoiceDetails.notes,
//     currency: watchedValues.invoiceDetails.currency,
//   };

//   const previewCompany: Doc<"companies"> = {
//     _id: selectedCompany?._id || ("" as Id<"companies">),
//     _creationTime: Date.now(),
//     ...watchedValues.company,
//     userId: user?.id || "",
//   };

//   const datePresets = [
//     { label: "Today", days: 0 },
//     { label: "7 days", days: 7 },
//     { label: "14 days", days: 14 },
//     { label: "30 days", days: 30 },
//     { label: "60 days", days: 60 },
//   ];

//   const currencies = [
//     { code: "ZAR", symbol: "R", name: "South African Rand" },
//     { code: "USD", symbol: "$", name: "US Dollar" },
//     { code: "EUR", symbol: "€", name: "Euro" },
//     { code: "GBP", symbol: "£", name: "British Pound" },
//   ];

//   return (
//     <form
//       onSubmit={handleSubmit(onSubmit)}
//       className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/20 mt-24"
//     >
//       <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8 pt-24 pb-16">
//         {/* Header */}
//         <motion.div
//           initial={{ opacity: 0, y: -20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
//           className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8"
//         >
//           <div className="relative">
//             <motion.div
//               initial={{ opacity: 0, x: -20 }}
//               animate={{ opacity: 1, x: 0 }}
//               transition={{ delay: 0.2, duration: 0.5 }}
//             >
//               <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
//                 Create Invoice
//               </h1>
//               <p className="text-slate-500 mt-2 text-sm sm:text-base">
//                 Build professional invoices in seconds
//               </p>
//             </motion.div>
//             <motion.div
//               className="absolute -top-6 -right-6 text-yellow-400"
//               animate={{
//                 rotate: [0, 10, -10, 10, 0],
//                 scale: [1, 1.1, 1, 1.1, 1],
//               }}
//               transition={{
//                 duration: 2,
//                 repeat: Infinity,
//                 repeatDelay: 3,
//               }}
//             >
//               <Sparkles size={24} />
//             </motion.div>
//           </div>
//           <motion.div
//             initial={{ opacity: 0, x: 20 }}
//             animate={{ opacity: 1, x: 0 }}
//             transition={{ delay: 0.3, duration: 0.5 }}
//             className="flex gap-3"
//           >
//             <Button
//               type="button"
//               variant="outline"
//               className="group relative overflow-hidden border-2 border-slate-200 hover:border-indigo-300 transition-all duration-300 shadow-sm hover:shadow-md"
//               onClick={() => setShowPreview(!showPreview)}
//             >
//               <motion.div
//                 className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10"
//                 initial={{ x: "-100%" }}
//                 whileHover={{ x: "100%" }}
//                 transition={{ duration: 0.5 }}
//               />
//               <Eye
//                 size={16}
//                 className="mr-2 group-hover:scale-110 transition-transform"
//               />
//               {showPreview ? "Hide Preview" : "Show Preview"}
//             </Button>
//             <Button
//               type="submit"
//               className="group relative overflow-hidden bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300"
//             >
//               <motion.div
//                 className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"
//                 initial={{ x: "-100%" }}
//                 whileHover={{ x: "100%" }}
//                 transition={{ duration: 0.5 }}
//               />
//               <Save
//                 size={16}
//                 className="mr-2 group-hover:scale-110 transition-transform"
//               />
//               Save Invoice
//             </Button>
//           </motion.div>
//         </motion.div>

//         {/* Company Selector at the Top */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.1, duration: 0.5 }}
//           className="max-w-md"
//         >
//           <Label className="mb-2 text-sm font-medium text-slate-700">
//             Select Company
//           </Label>
//           <Select
//             value={watchedValues.company.name}
//             onValueChange={(value) => {
//               const selectedCompany = companies?.find(
//                 (c: Doc<"companies">) => c.name === value
//               );
//               if (selectedCompany) {
//                 setValue("company", {
//                   name: selectedCompany.name,
//                   address: selectedCompany.address,
//                   phone: selectedCompany.phone,
//                   email: selectedCompany.email,
//                   website: selectedCompany.website || "",
//                   logoUrl: selectedCompany.logoUrl || "",
//                   bankingDetails: selectedCompany.bankingDetails,
//                 });
//                 setLogoPreview(selectedCompany.logoUrl || "");
//                 setValue("invoiceDetails.templateId", "" as Id<"templates">);
//               }
//             }}
//           >
//             <SelectTrigger className="border-slate-200 focus:ring-2 focus:ring-indigo-500/20 hover:border-indigo-300 transition-all duration-200">
//               <SelectValue placeholder="Select a company" />
//             </SelectTrigger>
//             <SelectContent>
//               {companies?.map((c: Doc<"companies">) => (
//                 <SelectItem
//                   key={c._id}
//                   value={c.name}
//                   className="hover:bg-indigo-50 transition-colors"
//                 >
//                   {c.name}
//                 </SelectItem>
//               ))}
//             </SelectContent>
//           </Select>
//         </motion.div>

//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//           {/* Company Information */}
//           <motion.div
//             initial={{ opacity: 0, x: -30 }}
//             animate={{ opacity: 1, x: 0 }}
//             transition={{
//               delay: 0.15,
//               duration: 0.6,
//               ease: [0.22, 1, 0.36, 1],
//             }}
//             whileHover={{ y: -4 }}
//             className="transition-all duration-300"
//           >
//             <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 overflow-hidden group">
//               <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
//               <CardHeader className="border-b border-slate-100 bg-gradient-to-r from-slate-50 to-indigo-50/30 relative">
//                 <CardTitle className="text-xl font-semibold text-slate-800 flex items-center gap-2">
//                   <div className="w-1 h-6 bg-gradient-to-b from-indigo-500 to-purple-500 rounded-full" />
//                   Company Information
//                 </CardTitle>
//               </CardHeader>
//               <CardContent className="space-y-5 pt-6 relative">
//                 <div>
//                   <Label className="mb-2 text-sm font-medium text-slate-700">
//                     Company Logo
//                   </Label>
//                   <div className="mt-2">
//                     <div className="flex items-center gap-4">
//                       <motion.div
//                         whileHover={{ scale: 1.02 }}
//                         whileTap={{ scale: 0.98 }}
//                       >
//                         <Button
//                           type="button"
//                           variant="outline"
//                           className="border-2 border-dashed border-slate-300 hover:border-indigo-400 hover:bg-indigo-50/50 transition-all duration-200"
//                           onClick={() =>
//                             document.getElementById("logo-upload")?.click()
//                           }
//                         >
//                           <Upload size={16} className="mr-2" />
//                           Upload Logo
//                         </Button>
//                       </motion.div>
//                       <input
//                         id="logo-upload"
//                         type="file"
//                         accept="image/*"
//                         onChange={handleLogoUpload}
//                         className="hidden"
//                       />
//                       <AnimatePresence>
//                         {logoPreview && (
//                           <motion.div
//                             initial={{ opacity: 0, scale: 0.8 }}
//                             animate={{ opacity: 1, scale: 1 }}
//                             exit={{ opacity: 0, scale: 0.8 }}
//                             className="relative group/logo"
//                           >
//                             <img
//                               src={logoPreview}
//                               alt="Logo preview"
//                               className="h-16 w-16 object-contain rounded-lg border-2 border-slate-200 p-1 bg-white shadow-md group-hover/logo:shadow-lg transition-all duration-200"
//                             />
//                             <div className="absolute inset-0 bg-indigo-500/10 rounded-lg opacity-0 group-hover/logo:opacity-100 transition-opacity" />
//                           </motion.div>
//                         )}
//                       </AnimatePresence>
//                     </div>
//                   </div>
//                 </div>
//                 <motion.div whileTap={{ scale: 0.98 }}>
//                   <Label
//                     htmlFor="company-address"
//                     className="mb-2 text-sm font-medium text-slate-700"
//                   >
//                     Address
//                   </Label>
//                   <Textarea
//                     id="company-address"
//                     placeholder="Company Address"
//                     rows={3}
//                     className="border-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 hover:border-slate-300 transition-all duration-200 resize-none"
//                     {...register("company.address")}
//                   />
//                 </motion.div>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <motion.div whileTap={{ scale: 0.98 }}>
//                     <Label
//                       htmlFor="company-phone"
//                       className="mb-2 text-sm font-medium text-slate-700"
//                     >
//                       Phone
//                     </Label>
//                     <Input
//                       id="company-phone"
//                       placeholder="Phone Number"
//                       className="border-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 hover:border-slate-300 transition-all duration-200"
//                       {...register("company.phone")}
//                     />
//                   </motion.div>
//                   <motion.div whileTap={{ scale: 0.98 }}>
//                     <Label
//                       htmlFor="company-email"
//                       className="mb-2 text-sm font-medium text-slate-700"
//                     >
//                       Email
//                     </Label>
//                     <Input
//                       id="company-email"
//                       type="email"
//                       placeholder="email@company.com"
//                       className="border-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 hover:border-slate-300 transition-all duration-200"
//                       {...register("company.email")}
//                     />
//                   </motion.div>
//                 </div>
//                 <motion.div whileTap={{ scale: 0.98 }}>
//                   <Label
//                     htmlFor="company-website"
//                     className="mb-2 text-sm font-medium text-slate-700"
//                   >
//                     Website{" "}
//                     <span className="text-slate-400 text-xs">(Optional)</span>
//                   </Label>
//                   <Input
//                     id="company-website"
//                     placeholder="www.company.com"
//                     className="border-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 hover:border-slate-300 transition-all duration-200"
//                     {...register("company.website")}
//                   />
//                 </motion.div>
//                 {/* Banking Details */}
//                 <div className="space-y-4 pt-4 border-t border-slate-200">
//                   <h4 className="text-md font-semibold text-slate-800">
//                     Banking Details
//                   </h4>
//                   <motion.div whileTap={{ scale: 0.98 }}>
//                     <Label
//                       htmlFor="bank-name"
//                       className="mb-2 text-sm font-medium text-slate-700"
//                     >
//                       Bank Name
//                     </Label>
//                     <Input
//                       id="bank-name"
//                       placeholder="Bank Name"
//                       className="border-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 hover:border-slate-300 transition-all duration-200"
//                       {...register("company.bankingDetails.bankName")}
//                     />
//                   </motion.div>
//                   <motion.div whileTap={{ scale: 0.98 }}>
//                     <Label
//                       htmlFor="account-number"
//                       className="mb-2 text-sm font-medium text-slate-700"
//                     >
//                       Account Number
//                     </Label>
//                     <Input
//                       id="account-number"
//                       placeholder="Account Number"
//                       className="border-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 hover:border-slate-300 transition-all duration-200"
//                       {...register("company.bankingDetails.accountNumber")}
//                     />
//                   </motion.div>
//                   <motion.div whileTap={{ scale: 0.98 }}>
//                     <Label
//                       htmlFor="branch-code"
//                       className="mb-2 text-sm font-medium text-slate-700"
//                     >
//                       Branch Code
//                     </Label>
//                     <Input
//                       id="branch-code"
//                       placeholder="Branch Code"
//                       className="border-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 hover:border-slate-300 transition-all duration-200"
//                       {...register("company.bankingDetails.branchCode")}
//                     />
//                   </motion.div>
//                   <motion.div whileTap={{ scale: 0.98 }}>
//                     <Label
//                       htmlFor="account-holder"
//                       className="mb-2 text-sm font-medium text-slate-700"
//                     >
//                       Account Holder
//                     </Label>
//                     <Input
//                       id="account-holder"
//                       placeholder="Account Holder"
//                       className="border-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 hover:border-slate-300 transition-all duration-200"
//                       {...register("company.bankingDetails.accountHolder")}
//                     />
//                   </motion.div>
//                 </div>
//               </CardContent>
//             </Card>
//           </motion.div>
//           {/* Customer Information */}
//           <motion.div
//             initial={{ opacity: 0, x: 30 }}
//             animate={{ opacity: 1, x: 0 }}
//             transition={{
//               delay: 0.25,
//               duration: 0.6,
//               ease: [0.22, 1, 0.36, 1],
//             }}
//             whileHover={{ y: -4 }}
//             className="transition-all duration-300"
//           >
//             <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 overflow-hidden group">
//               <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
//               <CardHeader className="border-b border-slate-100 bg-gradient-to-r from-slate-50 to-purple-50/30 relative">
//                 <CardTitle className="text-xl font-semibold text-slate-800 flex items-center gap-2">
//                   <div className="w-1 h-6 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full" />
//                   Customer Information
//                 </CardTitle>
//               </CardHeader>
//               <CardContent className="space-y-5 pt-6 relative">
//                 <motion.div whileTap={{ scale: 0.98 }}>
//                   <Label
//                     htmlFor="customer-name"
//                     className="mb-2 text-sm font-medium text-slate-700"
//                   >
//                     Customer Name
//                   </Label>
//                   <Input
//                     id="customer-name"
//                     placeholder="Customer Name"
//                     className="border-slate-200 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-400 hover:border-slate-300 transition-all duration-200"
//                     {...register("customer.name")}
//                   />
//                 </motion.div>
//                 <motion.div whileTap={{ scale: 0.98 }}>
//                   <Label
//                     htmlFor="customer-email"
//                     className="mb-2 text-sm font-medium text-slate-700"
//                   >
//                     Email
//                   </Label>
//                   <Input
//                     id="customer-email"
//                     type="email"
//                     placeholder="customer@email.com"
//                     className="border-slate-200 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-400 hover:border-slate-300 transition-all duration-200"
//                     {...register("customer.email")}
//                   />
//                 </motion.div>
//                 <motion.div whileTap={{ scale: 0.98 }}>
//                   <Label
//                     htmlFor="customer-address"
//                     className="mb-2 text-sm font-medium text-slate-700"
//                   >
//                     Address
//                   </Label>
//                   <Textarea
//                     id="customer-address"
//                     placeholder="Customer Address"
//                     rows={3}
//                     className="border-slate-200 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-400 hover:border-slate-300 transition-all duration-200 resize-none"
//                     {...register("customer.address")}
//                   />
//                 </motion.div>
//                 <motion.div whileTap={{ scale: 0.98 }}>
//                   <Label
//                     htmlFor="customer-phone"
//                     className="mb-2 text-sm font-medium text-slate-700"
//                   >
//                     Phone
//                   </Label>
//                   <Input
//                     id="customer-phone"
//                     placeholder="Phone Number"
//                     className="border-slate-200 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-400 hover:border-slate-300 transition-all duration-200"
//                     {...register("customer.phone")}
//                   />
//                 </motion.div>
//               </CardContent>
//             </Card>
//           </motion.div>
//         </div>
//         {/* Invoice Details */}
//         <motion.div
//           initial={{ opacity: 0, y: 30 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.35, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
//           whileHover={{ y: -4 }}
//           className="transition-all duration-300"
//         >
//           <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 overflow-hidden group">
//             <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
//             <CardHeader className="border-b border-slate-100 bg-gradient-to-r from-slate-50 to-blue-50/30 relative">
//               <CardTitle className="text-xl font-semibold text-slate-800 flex items-center gap-2">
//                 <div className="w-1 h-6 bg-gradient-to-b from-blue-500 to-cyan-500 rounded-full" />
//                 Invoice Details
//               </CardTitle>
//             </CardHeader>
//             <CardContent className="pt-6 relative">
//               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
//                 <motion.div whileTap={{ scale: 0.98 }}>
//                   <Label
//                     htmlFor="invoice-number"
//                     className="mb-2 text-sm font-medium text-slate-700"
//                   >
//                     Invoice Number
//                   </Label>
//                   <Input
//                     id="invoice-number"
//                     className="border-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 hover:border-slate-300 transition-all duration-200 font-mono"
//                     {...register("invoiceDetails.invoiceNumber")}
//                   />
//                 </motion.div>
//                 <motion.div whileTap={{ scale: 0.98 }}>
//                   <Label
//                     htmlFor="issue-date"
//                     className="mb-2 text-sm font-medium text-slate-700"
//                   >
//                     Issue Date
//                   </Label>
//                   <Input
//                     id="issue-date"
//                     type="date"
//                     className="border-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 hover:border-slate-300 transition-all duration-200"
//                     {...register("invoiceDetails.issueDate")}
//                   />
//                 </motion.div>
//                 <motion.div whileTap={{ scale: 0.98 }}>
//                   <Label
//                     htmlFor="due-date"
//                     className="mb-2 text-sm font-medium text-slate-700"
//                   >
//                     Due Date
//                   </Label>
//                   <Input
//                     id="due-date"
//                     type="date"
//                     className="border-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 hover:border-slate-300 transition-all duration-200"
//                     {...register("invoiceDetails.dueDate")}
//                   />
//                 </motion.div>
//                 <motion.div whileTap={{ scale: 0.98 }}>
//                   <Label
//                     htmlFor="tax"
//                     className="mb-2 text-sm font-medium text-slate-700"
//                   >
//                     Tax Rate (%)
//                   </Label>
//                   <Input
//                     id="tax"
//                     type="number"
//                     min="0"
//                     step="0.1"
//                     className="border-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 hover:border-slate-300 transition-all duration-200"
//                     {...register("invoiceDetails.tax", { valueAsNumber: true })}
//                   />
//                 </motion.div>
//                 <motion.div whileTap={{ scale: 0.98 }}>
//                   <Label className="mb-2 text-sm font-medium text-slate-700">
//                     Currency
//                   </Label>
//                   <Select
//                     value={watchedValues.invoiceDetails.currency}
//                     onValueChange={(value) =>
//                       setValue("invoiceDetails.currency", value)
//                     }
//                   >
//                     <SelectTrigger className="border-slate-200 focus:ring-2 focus:ring-blue-500/20 hover:border-blue-300 transition-all duration-200">
//                       <SelectValue />
//                     </SelectTrigger>
//                     <SelectContent>
//                       {currencies.map((curr) => (
//                         <SelectItem
//                           key={curr.code}
//                           value={curr.code}
//                           className="hover:bg-blue-50 transition-colors"
//                         >
//                           {curr.symbol} {curr.name}
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                 </motion.div>
//               </div>
//               <div className="flex flex-wrap gap-2 mb-6">
//                 {datePresets.map((preset, index) => (
//                   <motion.div
//                     key={preset.label}
//                     initial={{ opacity: 0, scale: 0.8 }}
//                     animate={{ opacity: 1, scale: 1 }}
//                     transition={{ delay: 0.4 + index * 0.05 }}
//                     whileHover={{ scale: 1.05, y: -2 }}
//                     whileTap={{ scale: 0.95 }}
//                   >
//                     <Button
//                       type="button"
//                       variant="outline"
//                       size="sm"
//                       className="border-slate-200 hover:border-indigo-300 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 transition-all duration-200 shadow-sm hover:shadow-md"
//                       onClick={() => {
//                         const date = new Date();
//                         date.setDate(date.getDate() + preset.days);
//                         setValue(
//                           "invoiceDetails.dueDate",
//                           date.toISOString().split("T")[0]
//                         );
//                       }}
//                     >
//                       {preset.label}
//                     </Button>
//                   </motion.div>
//                 ))}
//               </div>
//               <motion.div whileTap={{ scale: 0.98 }}>
//                 <Label
//                   htmlFor="template"
//                   className="mb-2 text-sm font-medium text-slate-700"
//                 >
//                   Template
//                 </Label>
//                 <Select
//                   value={watchedValues.invoiceDetails.templateId}
//                   onValueChange={(value) =>
//                     setValue(
//                       "invoiceDetails.templateId",
//                       value as Id<"templates">
//                     )
//                   }
//                 >
//                   <SelectTrigger className="border-slate-200 focus:ring-2 focus:ring-blue-500/20 hover:border-blue-300 transition-all duration-200">
//                     <SelectValue placeholder="Select a template" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     {templates?.map((t: Doc<"templates">) => (
//                       <SelectItem
//                         key={t._id}
//                         value={t._id}
//                         className="hover:bg-blue-50 transition-colors"
//                       >
//                         {t.name}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//               </motion.div>
//               {/* Items */}
//               <div className="space-y-6 mt-8">
//                 <div className="flex justify-between items-center">
//                   <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
//                     <div className="w-1 h-5 bg-gradient-to-b from-emerald-500 to-teal-500 rounded-full" />
//                     Invoice Items
//                   </h3>
//                   <motion.div
//                     whileHover={{ scale: 1.05 }}
//                     whileTap={{ scale: 0.95 }}
//                   >
//                     <Button
//                       type="button"
//                       onClick={addItem}
//                       variant="outline"
//                       size="sm"
//                       className="border-2 border-emerald-200 hover:border-emerald-400 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-teal-50 transition-all duration-200 shadow-sm hover:shadow-md"
//                     >
//                       <Plus size={16} className="mr-1" />
//                       Add Item
//                     </Button>
//                   </motion.div>
//                 </div>
//                 <div className="space-y-3">
//                   <AnimatePresence mode="popLayout">
//                     {fields.map((item, index) => (
//                       <motion.div
//                         key={item.id}
//                         initial={{ opacity: 0, height: 0, scale: 0.8 }}
//                         animate={{ opacity: 1, height: "auto", scale: 1 }}
//                         exit={{ opacity: 0, height: 0, scale: 0.8 }}
//                         transition={{
//                           duration: 0.3,
//                           ease: [0.22, 1, 0.36, 1],
//                         }}
//                         whileHover={{ scale: 1.01, y: -2 }}
//                         className="grid grid-cols-12 gap-3 items-center p-5 border-2 border-slate-200 rounded-xl bg-gradient-to-br from-white to-slate-50/50 hover:border-emerald-300 hover:shadow-lg transition-all duration-300 group/item"
//                       >
//                         <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-teal-500/5 opacity-0 group-hover/item:opacity-100 rounded-xl transition-opacity duration-300" />
//                         <div className="col-span-12 sm:col-span-5 relative">
//                           <Input
//                             placeholder="Item description"
//                             className="border-slate-200 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400 hover:border-slate-300 transition-all duration-200"
//                             {...register(`items.${index}.description`)}
//                           />
//                         </div>
//                         <div className="col-span-4 sm:col-span-2 relative">
//                           <Input
//                             type="number"
//                             placeholder="Qty"
//                             min="1"
//                             className="border-slate-200 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400 hover:border-slate-300 transition-all duration-200"
//                             {...register(`items.${index}.quantity`, {
//                               valueAsNumber: true,
//                             })}
//                           />
//                         </div>
//                         <div className="col-span-4 sm:col-span-2 relative">
//                           <Input
//                             type="number"
//                             placeholder="Price"
//                             min="0"
//                             step="0.01"
//                             className="border-slate-200 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400 hover:border-slate-300 transition-all duration-200"
//                             {...register(`items.${index}.price`, {
//                               valueAsNumber: true,
//                             })}
//                           />
//                         </div>
//                         <div className="col-span-3 sm:col-span-2 relative">
//                           <Input
//                             value={formatCurrency(
//                               watchedValues.items[index]?.quantity *
//                                 watchedValues.items[index]?.price || 0
//                             )}
//                             readOnly
//                             className="bg-gradient-to-br from-slate-50 to-emerald-50/30 border-slate-200 font-semibold text-slate-700"
//                           />
//                         </div>
//                         <div className="col-span-1 flex justify-end relative">
//                           {fields.length > 1 && (
//                             <motion.div
//                               whileHover={{ scale: 1.1 }}
//                               whileTap={{ scale: 0.9 }}
//                             >
//                               <Button
//                                 type="button"
//                                 variant="outline"
//                                 size="icon"
//                                 onClick={() => remove(index)}
//                                 className="h-9 w-9 border-2 border-rose-200 hover:border-rose-400 hover:bg-rose-50 transition-all duration-200 group/delete"
//                               >
//                                 <Trash2
//                                   size={14}
//                                   className="text-rose-500 group-hover/delete:scale-110 transition-transform"
//                                 />
//                               </Button>
//                             </motion.div>
//                           )}
//                         </div>
//                       </motion.div>
//                     ))}
//                   </AnimatePresence>
//                 </div>
//                 {/* Totals */}
//                 <motion.div
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ delay: 0.5 }}
//                   className="flex justify-end mt-6"
//                 >
//                   <div className="w-full sm:w-96 space-y-3 p-6 rounded-xl bg-gradient-to-br from-slate-50 to-indigo-50/30 border-2 border-slate-200 shadow-lg">
//                     <motion.div
//                       className="flex justify-between items-center text-slate-600"
//                       whileHover={{ x: 4 }}
//                       transition={{ duration: 0.2 }}
//                     >
//                       <span className="font-medium">Subtotal:</span>
//                       <span className="font-semibold">
//                         {formatCurrency(subtotal)}
//                       </span>
//                     </motion.div>
//                     <motion.div
//                       className="flex justify-between items-center text-slate-600"
//                       whileHover={{ x: 4 }}
//                       transition={{ duration: 0.2 }}
//                     >
//                       <span className="font-medium">
//                         Tax ({watchedValues.invoiceDetails.tax}%):
//                       </span>
//                       <span className="font-semibold">
//                         {formatCurrency(taxAmount)}
//                       </span>
//                     </motion.div>
//                     <div className="h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent" />
//                     <motion.div
//                       className="flex justify-between items-center text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent pt-2"
//                       whileHover={{ scale: 1.02 }}
//                       transition={{ duration: 0.2 }}
//                     >
//                       <span>Total:</span>
//                       <span>{formatCurrency(total)}</span>
//                     </motion.div>
//                   </div>
//                 </motion.div>
//                 <motion.div whileTap={{ scale: 0.98 }}>
//                   <Label
//                     htmlFor="notes"
//                     className="mb-2 text-sm font-medium text-slate-700"
//                   >
//                     Notes{" "}
//                     <span className="text-slate-400 text-xs">(Optional)</span>
//                   </Label>
//                   <Textarea
//                     id="notes"
//                     placeholder="Additional notes or payment terms"
//                     rows={4}
//                     className="border-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 hover:border-slate-300 transition-all duration-200 resize-none"
//                     {...register("invoiceDetails.notes")}
//                   />
//                 </motion.div>
//               </div>
//             </CardContent>
//           </Card>
//         </motion.div>
//         {/* Preview */}
//         <AnimatePresence>
//           {showPreview && selectedTemplate && (
//             <motion.div
//               initial={{ opacity: 0, y: 30, scale: 0.95 }}
//               animate={{ opacity: 1, y: 0, scale: 1 }}
//               exit={{ opacity: 0, y: -30, scale: 0.95 }}
//               transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
//             >
//               <Card className="border-0 shadow-2xl bg-white/90 backdrop-blur-md overflow-hidden">
//                 <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-purple-500/5 to-pink-500/5" />
//                 <CardHeader className="border-b border-slate-100 bg-gradient-to-r from-slate-50 via-indigo-50/30 to-purple-50/30 relative">
//                   <CardTitle className="text-xl font-semibold text-slate-800 flex items-center gap-2">
//                     <div className="w-1 h-6 bg-gradient-to-b from-indigo-500 via-purple-500 to-pink-500 rounded-full" />
//                     Invoice Preview
//                     <motion.div
//                       animate={{ rotate: 360 }}
//                       transition={{
//                         duration: 2,
//                         repeat: Infinity,
//                         ease: "linear",
//                       }}
//                       className="ml-auto"
//                     >
//                       <Eye size={20} className="text-indigo-500" />
//                     </motion.div>
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent className="p-8 relative">
//                   <div className="bg-white rounded-lg shadow-inner p-4">
//                     <InvoicePreview
//                       invoice={previewInvoice}
//                       template={selectedTemplate}
//                       company={previewCompany}
//                     />
//                   </div>
//                 </CardContent>
//               </Card>
//             </motion.div>
//           )}
//         </AnimatePresence>
//       </div>
//     </form>
//   );
// }

// app/invoices/page.tsx
"use client";

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  FileText,
  TrendingUp,
  Filter,
  Search,
  Eye,
  Edit,
  Trash2,
  Download,
  Plus,
  DollarSign,
  AlertCircle,
  CheckCircle,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import InvoicePreview from "@/components/invoice/InvoicePreview";
import { Id, Doc } from "@/convex/_generated/dataModel";
import { createRoot } from "react-dom/client";
import { formatCurrency } from "@/lib/currency";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { StatusBadge } from "@/components/invoice/StatusBadge";
import { InvoiceAnalytics } from "@/components/invoice/InvoiceAnalytics";
import { Label } from "@/components/ui/label";
import InvoiceCreationForm from "@/components/invoice/InvoiceForm"; // Adjust path if needed

const tableVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.03,
    },
  },
};

const rowVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      type: "spring" as const,
      stiffness: 100,
    },
  },
};

function useTemplatesByCompanyIds(companyIds: Id<"companies">[]) {
  const templateResults = useQuery(
    api.templates.getTemplatesByCompanies,
    companyIds.length > 0 ? { companyIds } : "skip"
  );
  return useMemo(() => {
    const results: Record<string, Doc<"templates">[]> = {};
    companyIds.forEach((companyId) => {
      results[companyId] = [];
    });
    if (templateResults) {
      templateResults.forEach(({ companyId, templates }) => {
        if (companyIds.includes(companyId)) {
          results[companyId] = templates;
        }
      });
    }
    return results;
  }, [companyIds, templateResults]);
}

export default function MonthlyInvoicesDashboard() {
  const { user } = useUser();
  const router = useRouter();
  const [selectedMonth, setSelectedMonth] = useState(
    new Date().toISOString().slice(0, 7)
  );
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedInvoices, setSelectedInvoices] = useState<Set<string>>(
    new Set()
  );
  const [filters, setFilters] = useState({
    minAmount: 0,
    maxAmount: Infinity,
    dateRange: { start: "", end: "" },
  });
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [selectedCompanyId, setSelectedCompanyId] =
    useState<Id<"companies"> | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const debouncedSearch = useDebouncedValue(searchTerm, 300);

  const invoices = useQuery(api.invoices.getInvoicesByUser, user ? {} : "skip");
  const companies = useQuery(
    api.companies.getCompaniesByUser,
    user ? {} : "skip"
  );
  const companyIds = useMemo(() => {
    if (!invoices) return [];
    return Array.from(new Set(invoices.map((invoice) => invoice.companyId)));
  }, [invoices]);
  const templatesByCompany = useTemplatesByCompanyIds(companyIds);
  const deleteInvoice = useMutation(api.invoices.deleteInvoice);
  const updateInvoice = useMutation(api.invoices.updateInvoice);
  const createInvoice = useMutation(api.invoices.createInvoice);

  // Auto-select first company if none selected
  useEffect(() => {
    if (!selectedCompanyId && companies && companies.length > 0) {
      setSelectedCompanyId(companies[0]._id);
    }
  }, [companies, selectedCompanyId]);

  const filteredInvoices = useMemo(() => {
    if (!invoices) return [];
    return invoices.filter((invoice) => {
      if (selectedCompanyId && invoice.companyId !== selectedCompanyId)
        return false;
      const invoiceMonth = invoice.issueDate.slice(0, 7);
      const matchesMonth = invoiceMonth === selectedMonth;
      const matchesStatus =
        statusFilter === "all" || invoice.status === statusFilter;
      const matchesSearch =
        invoice.customer.name
          .toLowerCase()
          .includes(debouncedSearch.toLowerCase()) ||
        invoice.invoiceNumber
          .toLowerCase()
          .includes(debouncedSearch.toLowerCase()) ||
        invoice.customer.email
          .toLowerCase()
          .includes(debouncedSearch.toLowerCase());
      const matchesAmount =
        invoice.total >= filters.minAmount &&
        invoice.total <= filters.maxAmount;
      return matchesMonth && matchesStatus && matchesSearch && matchesAmount;
    });
  }, [
    invoices,
    selectedCompanyId,
    selectedMonth,
    statusFilter,
    debouncedSearch,
    filters,
  ]);

  const monthlyStats = useMemo(() => {
    const totalInvoices = filteredInvoices.length;
    const totalRevenue = filteredInvoices.reduce(
      (sum, invoice) => sum + invoice.total,
      0
    );
    const paidInvoices = filteredInvoices.filter(
      (invoice) => invoice.status === "paid"
    );
    const paidRevenue = paidInvoices.reduce(
      (sum, invoice) => sum + invoice.total,
      0
    );
    const overdueInvoices = filteredInvoices.filter(
      (invoice) => invoice.status === "overdue"
    );
    const overdueAmount = overdueInvoices.reduce(
      (sum, invoice) => sum + invoice.total,
      0
    );
    return {
      totalInvoices,
      totalRevenue,
      paidRevenue,
      overdueCount: overdueInvoices.length,
      overdueAmount,
      avgInvoiceValue: totalInvoices > 0 ? totalRevenue / totalInvoices : 0,
    };
  }, [filteredInvoices]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case "n":
            e.preventDefault();
            setShowCreateForm(true);
            break;
          case "f":
            e.preventDefault();
            document.getElementById("search-input")?.focus();
            break;
        }
      }
    };
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, []);

  const handleBulkDelete = async () => {
    await Promise.all(
      Array.from(selectedInvoices).map((id) =>
        deleteInvoice({ id: id as Id<"invoices"> })
      )
    );
    setSelectedInvoices(new Set());
    toast.success(`${selectedInvoices.size} invoices deleted`);
  };

  const handleBulkStatusChange = async (newStatus: string) => {
    await Promise.all(
      Array.from(selectedInvoices).map((id) =>
        updateInvoice({ id: id as Id<"invoices">, status: newStatus as any })
      )
    );
    setSelectedInvoices(new Set());
    toast.success(`${selectedInvoices.size} invoices updated`);
  };

  const handleDuplicate = async (invoice: Doc<"invoices">) => {
    const duplicatedInvoice = {
      ...invoice,
      invoiceNumber: `${invoice.invoiceNumber}-COPY`,
      status: "draft" as const,
      issueDate: new Date().toISOString().split("T")[0],
    };
    const newId = await createInvoice(duplicatedInvoice);
    toast.success("Invoice duplicated!");
    router.push(`/dashboard/invoices/${newId}/edit`);
  };

  const handleViewInvoice = (id: string) =>
    router.push(`/dashboard/invoices/${id}`);
  const handleEditInvoice = (id: string) =>
    router.push(`/dashboard/invoices/${id}/edit`);

  const handleDeleteInvoice = async (id: string) => {
    try {
      await deleteInvoice({ id: id as Id<"invoices"> });
      toast.success("Invoice deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete invoice.");
    }
  };

  const handleDownloadInvoice = async (invoice: Doc<"invoices">) => {
    setDownloadProgress(10);
    const template = templatesByCompany[invoice.companyId]?.[0];
    const company = companies?.find((c) => c._id === invoice.companyId);
    if (!template || !company) {
      toast.error("Template or company not found.");
      setDownloadProgress(0);
      return;
    }
    setDownloadProgress(30);
    const container = document.createElement("div");
    container.style.position = "absolute";
    container.style.left = "-9999px";
    document.body.appendChild(container);
    try {
      setDownloadProgress(60);
      const root = createRoot(container);
      root.render(
        <InvoicePreview
          invoice={invoice}
          template={template}
          company={company}
        />
      );
      await new Promise((resolve) => setTimeout(resolve, 500));
      const element = container.querySelector(
        "#invoice-preview"
      ) as HTMLElement;
      if (!element) throw new Error("Preview not found");
      setDownloadProgress(90);
      const canvas = await html2canvas(element, { scale: 2 });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });
      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
      pdf.save(`invoice-${invoice.invoiceNumber}.pdf`);
      setDownloadProgress(100);
      setTimeout(() => setDownloadProgress(0), 1000);
    } catch (error) {
      toast.error("Failed to generate PDF.");
      setDownloadProgress(0);
    } finally {
      createRoot(container).unmount();
      document.body.removeChild(container);
    }
  };

  const handleCreateInvoice = () => setShowCreateForm(true);

  const handleCloseCreateForm = () => setShowCreateForm(false);

  if (!user || invoices === undefined || companies === undefined) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/20">
        <div className="max-w-7xl mx-auto p-6 space-y-8 pt-24">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <div className="h-12 w-1/2 bg-gradient-to-r from-slate-200 to-slate-300 rounded-lg animate-pulse" />
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className="h-32 bg-gradient-to-br from-white to-slate-100 rounded-xl shadow-lg animate-pulse"
                />
              ))}
            </div>
            <div className="h-96 bg-gradient-to-br from-white to-slate-100 rounded-xl shadow-lg animate-pulse" />
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/20 mt-20">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8 pt-24 pb-16">
        {/* Company Selector */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
            <CardHeader className="border-b border-slate-100 bg-gradient-to-r from-slate-50 to-indigo-50/30">
              <CardTitle className="text-xl font-semibold text-slate-800 flex items-center gap-2">
                <div className="w-1 h-6 bg-gradient-to-b from-indigo-500 to-purple-500 rounded-full" />
                Select Company
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <Select
                value={selectedCompanyId || ""}
                onValueChange={(value) =>
                  setSelectedCompanyId(value as Id<"companies">)
                }
              >
                <SelectTrigger className="border-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 hover:border-slate-300 transition-all duration-200">
                  <SelectValue placeholder="Select a company" />
                </SelectTrigger>
                <SelectContent>
                  {companies.map((company: Doc<"companies">) => (
                    <SelectItem key={company._id} value={company._id}>
                      {company.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
        >
          <div className="relative">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Invoice Dashboard
              </h1>
              <p className="text-slate-600 mt-2 text-sm sm:text-base">
                Manage and track your monthly invoices
              </p>
            </motion.div>
            <motion.div
              className="absolute -top-6 -right-6 text-yellow-400"
              animate={{
                rotate: [0, 10, -10, 10, 0],
                scale: [1, 1.1, 1, 1.1, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatDelay: 3,
              }}
            >
              <Sparkles size={24} />
            </motion.div>
          </div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              className="group relative overflow-hidden bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300"
              onClick={handleCreateInvoice}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent pointer-events-none"
                initial={{ x: "-100%" }}
                whileHover={{ x: "100%" }}
                transition={{ duration: 0.5 }}
              />
              <Plus
                size={16}
                className="mr-2 group-hover:rotate-90 transition-transform duration-300"
              />
              Create Invoice
            </Button>
          </motion.div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.6 }}
          whileHover={{ y: -2 }}
          className="transition-all duration-300"
        >
          <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            <CardContent className="p-6">
              <div className="flex flex-wrap gap-4 items-end relative">
                <motion.div className="flex-shrink-0">
                  <Label className="text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                    <Calendar size={16} className="text-indigo-500" />
                    Month
                  </Label>
                  <Input
                    type="month"
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    className="w-40 border-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 hover:border-slate-300 transition-all duration-200"
                  />
                </motion.div>

                <motion.div className="flex-shrink-0">
                  <Label className="text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                    <Filter size={16} className="text-purple-500" />
                    Status
                  </Label>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-36 border-slate-200 focus:ring-2 focus:ring-purple-500/20 hover:border-purple-300 transition-all duration-200">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all" className="hover:bg-purple-50">
                        All
                      </SelectItem>
                      <SelectItem value="draft" className="hover:bg-purple-50">
                        Draft
                      </SelectItem>
                      <SelectItem value="sent" className="hover:bg-purple-50">
                        Sent
                      </SelectItem>
                      <SelectItem value="paid" className="hover:bg-purple-50">
                        Paid
                      </SelectItem>
                      <SelectItem
                        value="overdue"
                        className="hover:bg-purple-50"
                      >
                        Overdue
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </motion.div>

                <motion.div className="flex-1 min-w-[200px]">
                  <Label className="text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                    <Search size={16} className="text-blue-500" />
                    Search
                  </Label>
                  <Input
                    id="search-input"
                    placeholder="Search invoices..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="border-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 hover:border-slate-300 transition-all duration-200"
                  />
                </motion.div>

                <motion.div className="flex-shrink-0">
                  <Label className="text-sm font-medium text-slate-700 mb-2">
                    Min Amount
                  </Label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={filters.minAmount || ""}
                    onChange={(e) =>
                      setFilters({
                        ...filters,
                        minAmount: Number(e.target.value) || 0,
                      })
                    }
                    className="w-28 border-slate-200 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400 hover:border-slate-300 transition-all duration-200"
                  />
                </motion.div>

                <motion.div className="flex-shrink-0">
                  <Label className="text-sm font-medium text-slate-700 mb-2">
                    Max Amount
                  </Label>
                  <Input
                    type="number"
                    placeholder="∞"
                    value={
                      filters.maxAmount === Infinity ? "" : filters.maxAmount
                    }
                    onChange={(e) =>
                      setFilters({
                        ...filters,
                        maxAmount: e.target.value
                          ? Number(e.target.value)
                          : Infinity,
                      })
                    }
                    className="w-28 border-slate-200 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400 hover:border-slate-300 transition-all duration-200"
                  />
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            whileHover={{ y: -8, scale: 1.02 }}
          >
            <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white hover:shadow-2xl transition-all duration-300 overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              <CardContent className="p-6 relative">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
                    <FileText size={24} />
                  </div>
                  <motion.div
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      repeatDelay: 3,
                    }}
                  >
                    <TrendingUp size={20} className="opacity-70" />
                  </motion.div>
                </div>
                <motion.h3
                  className="text-3xl font-bold mb-1"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3, type: "spring" }}
                >
                  {monthlyStats.totalInvoices}
                </motion.h3>
                <p className="text-blue-100 text-sm font-medium">
                  Total Invoices
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.5 }}
            whileHover={{ y: -8, scale: 1.02 }}
          >
            <Card className="border-0 shadow-lg bg-gradient-to-br from-emerald-500 to-emerald-600 text-white hover:shadow-2xl transition-all duration-300 overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              <CardContent className="p-6 relative">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
                    <DollarSign size={24} />
                  </div>
                  <CheckCircle size={20} className="opacity-70" />
                </div>
                <motion.h3
                  className="text-3xl font-bold mb-1"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.35, type: "spring" }}
                >
                  {formatCurrency(monthlyStats.totalRevenue)}
                </motion.h3>
                <p className="text-emerald-100 text-sm font-medium">
                  Total Revenue
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            whileHover={{ y: -8, scale: 1.02 }}
          >
            <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-500 to-purple-600 text-white hover:shadow-2xl transition-all duration-300 overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

              <CardContent className="p-6 relative">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
                    <CheckCircle size={24} />
                  </div>
                  <DollarSign size={20} className="opacity-70" />
                </div>
                <motion.h3
                  className="text-3xl font-bold mb-1"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.4, type: "spring" }}
                >
                  {formatCurrency(monthlyStats.paidRevenue)}
                </motion.h3>
                <p className="text-purple-100 text-sm font-medium">
                  Paid Revenue
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.5 }}
            whileHover={{ y: -8, scale: 1.02 }}
          >
            <Card className="border-0 shadow-lg bg-gradient-to-br from-rose-500 to-rose-600 text-white hover:shadow-2xl transition-all duration-300 overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              <CardContent className="p-6 relative">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
                    <AlertCircle size={24} />
                  </div>
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <AlertCircle size={20} className="opacity-70" />
                  </motion.div>
                </div>
                <motion.h3
                  className="text-3xl font-bold mb-1"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.45, type: "spring" }}
                >
                  {formatCurrency(monthlyStats.overdueAmount)}
                </motion.h3>
                <p className="text-rose-100 text-sm font-medium">
                  Overdue ({monthlyStats.overdueCount})
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Analytics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <InvoiceAnalytics invoices={filteredInvoices} />
        </motion.div>

        {/* Invoices Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.6 }}
          whileHover={{ y: -4 }}
          className="transition-all duration-300"
        >
          <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            <CardHeader className="border-b border-slate-100 bg-gradient-to-r from-slate-50 to-indigo-50/30 relative">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <CardTitle className="text-xl font-semibold text-slate-800 flex items-center gap-2">
                  <div className="w-1 h-6 bg-gradient-to-b from-indigo-500 to-purple-500 rounded-full" />
                  Invoices ({filteredInvoices.length})
                </CardTitle>
                <AnimatePresence>
                  {selectedInvoices.size > 0 && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8, x: 20 }}
                      animate={{ opacity: 1, scale: 1, x: 0 }}
                      exit={{ opacity: 0, scale: 0.8, x: 20 }}
                      className="flex gap-2 flex-wrap"
                    >
                      <Button
                        onClick={handleBulkDelete}
                        variant="destructive"
                        size="sm"
                        className="shadow-md hover:shadow-lg transition-all"
                      >
                        <Trash2 size={14} className="mr-1" />
                        Delete ({selectedInvoices.size})
                      </Button>
                      <Select onValueChange={handleBulkStatusChange}>
                        <SelectTrigger className="w-40 border-slate-200">
                          <SelectValue placeholder="Change Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="draft">Draft</SelectItem>
                          <SelectItem value="sent">Sent</SelectItem>
                          <SelectItem value="paid">Paid</SelectItem>
                          <SelectItem value="overdue">Overdue</SelectItem>
                        </SelectContent>
                      </Select>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </CardHeader>
            <CardContent className="p-0 relative">
              <motion.div
                variants={tableVariants}
                initial="hidden"
                animate="visible"
                className="overflow-x-auto"
              >
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50 hover:bg-slate-50 border-b-2 border-slate-200">
                      <TableHead className="font-semibold text-slate-700">
                        <Input
                          type="checkbox"
                          checked={
                            selectedInvoices.size === filteredInvoices.length &&
                            filteredInvoices.length > 0
                          }
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedInvoices(
                                new Set(filteredInvoices.map((inv) => inv._id))
                              );
                            } else {
                              setSelectedInvoices(new Set());
                            }
                          }}
                          className="w-4 h-4"
                        />
                      </TableHead>
                      <TableHead className="font-semibold text-slate-700">
                        Invoice #
                      </TableHead>
                      <TableHead className="font-semibold text-slate-700">
                        Customer
                      </TableHead>
                      <TableHead className="font-semibold text-slate-700">
                        Amount
                      </TableHead>
                      <TableHead className="font-semibold text-slate-700">
                        Status
                      </TableHead>
                      <TableHead className="font-semibold text-slate-700">
                        Issue Date
                      </TableHead>
                      <TableHead className="font-semibold text-slate-700">
                        Due Date
                      </TableHead>
                      <TableHead className="font-semibold text-slate-700">
                        Items
                      </TableHead>
                      <TableHead className="text-right font-semibold text-slate-700">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <AnimatePresence mode="popLayout">
                      {filteredInvoices.map((invoice, index) => (
                        <motion.tr
                          key={invoice._id}
                          variants={rowVariants}
                          initial="hidden"
                          animate="visible"
                          exit={{ opacity: 0, x: -20 }}
                          custom={index}
                          whileHover={{
                            backgroundColor: "rgba(99, 102, 241, 0.03)",
                            scale: 1.005,
                          }}
                          className="border-b border-slate-100 transition-colors"
                        >
                          <TableCell>
                            <motion.div whileTap={{ scale: 0.9 }}>
                              <Input
                                type="checkbox"
                                checked={selectedInvoices.has(invoice._id)}
                                onChange={(e) => {
                                  const newSet = new Set(selectedInvoices);
                                  if (e.target.checked) newSet.add(invoice._id);
                                  else newSet.delete(invoice._id);
                                  setSelectedInvoices(newSet);
                                }}
                                onClick={(e) => e.stopPropagation()}
                                className="w-4 h-4"
                              />
                            </motion.div>
                          </TableCell>
                          <TableCell className="font-mono font-semibold text-slate-900">
                            {invoice.invoiceNumber}
                          </TableCell>
                          <TableCell>
                            <div className="space-y-0.5">
                              <div className="font-medium text-slate-900">
                                {invoice.customer.name}
                              </div>
                              <div className="text-xs text-slate-500">
                                {invoice.customer.email}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className="font-semibold text-slate-900 text-base">
                              {formatCurrency(invoice.total)}
                            </span>
                          </TableCell>
                          <TableCell>
                            <StatusBadge status={invoice.status} />
                          </TableCell>
                          <TableCell className="text-slate-600">
                            {new Date(invoice.issueDate).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <span
                              className={
                                invoice.status === "overdue"
                                  ? "text-rose-600 font-semibold"
                                  : "text-slate-600"
                              }
                            >
                              {new Date(invoice.dueDate).toLocaleDateString()}
                            </span>
                          </TableCell>
                          <TableCell className="text-slate-600">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
                              {invoice.items.length} item
                              {invoice.items.length !== 1 ? "s" : ""}
                            </span>
                          </TableCell>
                          <TableCell>
                            <div className="flex justify-end gap-1">
                              <motion.div
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                              >
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleViewInvoice(invoice._id)}
                                  className="h-8 w-8 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                                >
                                  <Eye size={14} />
                                </Button>
                              </motion.div>
                              <motion.div
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                              >
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleEditInvoice(invoice._id)}
                                  className="h-8 w-8 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                                >
                                  <Edit size={14} />
                                </Button>
                              </motion.div>
                              <motion.div
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                              >
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleDownloadInvoice(invoice)}
                                  className="h-8 w-8 hover:bg-emerald-50 hover:text-emerald-600 transition-colors"
                                >
                                  <Download size={14} />
                                </Button>
                              </motion.div>
                              <motion.div
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                              >
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleDuplicate(invoice)}
                                  className="h-8 w-8 hover:bg-purple-50 hover:text-purple-600 transition-colors"
                                >
                                  <FileText size={14} />
                                </Button>
                              </motion.div>
                              <motion.div
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                              >
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() =>
                                    handleDeleteInvoice(invoice._id)
                                  }
                                  className="h-8 w-8 hover:bg-rose-50 hover:text-rose-600 transition-colors"
                                >
                                  <Trash2 size={14} />
                                </Button>
                              </motion.div>
                            </div>
                          </TableCell>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </TableBody>
                </Table>
              </motion.div>

              {/* Empty State */}
              <AnimatePresence>
                {filteredInvoices.length === 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="text-center py-16 px-4"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, type: "spring" }}
                      className="inline-block p-6 bg-gradient-to-br from-slate-50 to-indigo-50 rounded-full mb-6"
                    >
                      <FileText size={64} className="text-slate-400" />
                    </motion.div>
                    <motion.h3
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="text-xl font-semibold text-slate-900 mb-2"
                    >
                      No invoices found
                    </motion.h3>
                    <motion.p
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="text-slate-500 mb-6 max-w-md mx-auto"
                    >
                      {searchTerm || statusFilter !== "all"
                        ? "Try adjusting your filters or search terms"
                        : `No invoices for ${new Date(selectedMonth).toLocaleDateString("en-US", { month: "long", year: "numeric" })}`}
                    </motion.p>
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        onClick={handleCreateInvoice}
                        className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all"
                      >
                        <Plus size={16} className="mr-2" />
                        Create Your First Invoice
                      </Button>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </motion.div>

        {/* Download Progress */}
        <AnimatePresence>
          {downloadProgress > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.9 }}
              className="fixed bottom-6 right-6 z-50"
            >
              <Card className="border-0 shadow-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white overflow-hidden">
                <CardContent className="p-4 flex items-center gap-3 min-w-[250px]">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  >
                    <Download size={20} />
                  </motion.div>
                  <div className="flex-1">
                    <div className="text-sm font-medium mb-1">
                      Downloading PDF...
                    </div>
                    <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-white rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${downloadProgress}%` }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                  </div>
                  <div className="text-lg font-bold">{downloadProgress}%</div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Creation Form */}
        <AnimatePresence>
          {showCreateForm && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              transition={{ duration: 0.5 }}
            >
              <InvoiceCreationForm
                defaultCompanyId={selectedCompanyId ?? undefined}
                onClose={handleCloseCreateForm}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
