// "use client";

// import React, { useState, useEffect } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { Plus, Trash2, Upload, Save, Eye } from "lucide-react";
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

// interface InvoiceItem {
//   id: string;
//   description: string;
//   quantity: number;
//   price: number;
//   total: number;
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
// }

// export default function InvoiceCreationForm() {
//   const [company, setCompany] = useState<Company>({
//     name: "",
//     address: "",
//     phone: "",
//     email: "",
//     website: "",
//     logoUrl: "",
//   });

//   const [customer, setCustomer] = useState<Customer>({
//     name: "",
//     email: "",
//     address: "",
//     phone: "",
//   });

//   const [items, setItems] = useState<InvoiceItem[]>([
//     { id: "1", description: "", quantity: 1, price: 0, total: 0 },
//   ]);

//   const [invoiceDetails, setInvoiceDetails] = useState({
//     invoiceNumber: `INV-${Date.now()}`,
//     issueDate: new Date().toISOString().split("T")[0],
//     dueDate: "",
//     notes: "",
//     tax: 0,
//   });

//   const [logoFile, setLogoFile] = useState<File | null>(null);
//   const [logoPreview, setLogoPreview] = useState<string>("");

//   // Calculate totals
//   const subtotal = items.reduce((sum, item) => sum + item.total, 0);
//   const taxAmount = (subtotal * invoiceDetails.tax) / 100;
//   const total = subtotal + taxAmount;

//   // Update item total when quantity or price changes
//   useEffect(() => {
//     setItems((prevItems) =>
//       prevItems.map((item) => ({
//         ...item,
//         total: item.quantity * item.price,
//       }))
//     );
//   }, []);

//   const addItem = () => {
//     const newItem: InvoiceItem = {
//       id: Date.now().toString(),
//       description: "",
//       quantity: 1,
//       price: 0,
//       total: 0,
//     };
//     setItems([...items, newItem]);
//   };

//   const removeItem = (id: string) => {
//     setItems(items.filter((item) => item.id !== id));
//   };

//   const updateItem = (
//     id: string,
//     field: keyof InvoiceItem,
//     value: string | number
//   ) => {
//     setItems((prevItems) =>
//       prevItems.map((item) => {
//         if (item.id === id) {
//           const updatedItem = { ...item, [field]: value };
//           if (field === "quantity" || field === "price") {
//             updatedItem.total = updatedItem.quantity * updatedItem.price;
//           }
//           return updatedItem;
//         }
//         return item;
//       })
//     );
//   };

//   const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       setLogoFile(file);
//       const reader = new FileReader();
//       reader.onload = () => {
//         setLogoPreview(reader.result as string);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const uploadToCloudinary = async () => {
//     if (!logoFile) return "";

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
//       return "";
//     }
//   };

//   const saveInvoice = async () => {
//     let logoUrl = company.logoUrl;

//     if (logoFile) {
//       logoUrl = await uploadToCloudinary();
//     }

//     const invoiceData = {
//       ...invoiceDetails,
//       company: { ...company, logoUrl },
//       customer,
//       items,
//       subtotal,
//       tax: taxAmount,
//       total,
//       status: "draft" as const,
//     };

//     // Here you would save to Convex
//     console.log("Saving invoice:", invoiceData);
//   };

//   return (
//     <div className="max-w-6xl mx-auto p-6 space-y-8">
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         className="flex justify-between items-center"
//       >
//         <h1 className="text-3xl font-bold">Create Invoice</h1>
//         <div className="flex gap-3">
//           <Button variant="outline" className="flex items-center gap-2">
//             <Eye size={16} />
//             Preview
//           </Button>
//           <Button onClick={saveInvoice} className="flex items-center gap-2">
//             <Save size={16} />
//             Save Invoice
//           </Button>
//         </div>
//       </motion.div>

//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//         {/* Company Information */}
//         <motion.div
//           initial={{ opacity: 0, x: -20 }}
//           animate={{ opacity: 1, x: 0 }}
//           transition={{ delay: 0.1 }}
//         >
//           <Card>
//             <CardHeader>
//               <CardTitle>Company Information</CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-4">
//               <div>
//                 <Label>Company Logo</Label>
//                 <div className="mt-2">
//                   <div className="flex items-center gap-4">
//                     <Button
//                       variant="outline"
//                       className="flex items-center gap-2"
//                       onClick={() =>
//                         document.getElementById("logo-upload")?.click()
//                       }
//                     >
//                       <Upload size={16} />
//                       Upload Logo
//                     </Button>
//                     <input
//                       id="logo-upload"
//                       type="file"
//                       accept="image/*"
//                       onChange={handleLogoUpload}
//                       className="hidden"
//                     />
//                     {logoPreview && (
//                       <img
//                         src={logoPreview}
//                         alt="Logo preview"
//                         className="h-12 w-12 object-contain"
//                       />
//                     )}
//                   </div>
//                 </div>
//               </div>

//               <div>
//                 <Label htmlFor="company-name">Company Name</Label>
//                 <Input
//                   id="company-name"
//                   value={company.name}
//                   onChange={(e) =>
//                     setCompany({ ...company, name: e.target.value })
//                   }
//                   placeholder="Your Company Name"
//                 />
//               </div>

//               <div>
//                 <Label htmlFor="company-address">Address</Label>
//                 <Textarea
//                   id="company-address"
//                   value={company.address}
//                   onChange={(e) =>
//                     setCompany({ ...company, address: e.target.value })
//                   }
//                   placeholder="Company Address"
//                   rows={3}
//                 />
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div>
//                   <Label htmlFor="company-phone">Phone</Label>
//                   <Input
//                     id="company-phone"
//                     value={company.phone}
//                     onChange={(e) =>
//                       setCompany({ ...company, phone: e.target.value })
//                     }
//                     placeholder="Phone Number"
//                   />
//                 </div>
//                 <div>
//                   <Label htmlFor="company-email">Email</Label>
//                   <Input
//                     id="company-email"
//                     type="email"
//                     value={company.email}
//                     onChange={(e) =>
//                       setCompany({ ...company, email: e.target.value })
//                     }
//                     placeholder="email@company.com"
//                   />
//                 </div>
//               </div>

//               <div>
//                 <Label htmlFor="company-website">Website (Optional)</Label>
//                 <Input
//                   id="company-website"
//                   value={company.website}
//                   onChange={(e) =>
//                     setCompany({ ...company, website: e.target.value })
//                   }
//                   placeholder="www.company.com"
//                 />
//               </div>
//             </CardContent>
//           </Card>
//         </motion.div>

//         {/* Customer Information */}
//         <motion.div
//           initial={{ opacity: 0, x: 20 }}
//           animate={{ opacity: 1, x: 0 }}
//           transition={{ delay: 0.2 }}
//         >
//           <Card>
//             <CardHeader>
//               <CardTitle>Customer Information</CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-4">
//               <div>
//                 <Label htmlFor="customer-name">Customer Name</Label>
//                 <Input
//                   id="customer-name"
//                   value={customer.name}
//                   onChange={(e) =>
//                     setCustomer({ ...customer, name: e.target.value })
//                   }
//                   placeholder="Customer Name"
//                 />
//               </div>

//               <div>
//                 <Label htmlFor="customer-email">Email</Label>
//                 <Input
//                   id="customer-email"
//                   type="email"
//                   value={customer.email}
//                   onChange={(e) =>
//                     setCustomer({ ...customer, email: e.target.value })
//                   }
//                   placeholder="customer@email.com"
//                 />
//               </div>

//               <div>
//                 <Label htmlFor="customer-address">Address</Label>
//                 <Textarea
//                   id="customer-address"
//                   value={customer.address}
//                   onChange={(e) =>
//                     setCustomer({ ...customer, address: e.target.value })
//                   }
//                   placeholder="Customer Address"
//                   rows={3}
//                 />
//               </div>

//               <div>
//                 <Label htmlFor="customer-phone">Phone</Label>
//                 <Input
//                   id="customer-phone"
//                   value={customer.phone}
//                   onChange={(e) =>
//                     setCustomer({ ...customer, phone: e.target.value })
//                   }
//                   placeholder="Phone Number"
//                 />
//               </div>
//             </CardContent>
//           </Card>
//         </motion.div>
//       </div>

//       {/* Invoice Details */}
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ delay: 0.3 }}
//       >
//         <Card>
//           <CardHeader>
//             <CardTitle>Invoice Details</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
//               <div>
//                 <Label htmlFor="invoice-number">Invoice Number</Label>
//                 <Input
//                   id="invoice-number"
//                   value={invoiceDetails.invoiceNumber}
//                   onChange={(e) =>
//                     setInvoiceDetails({
//                       ...invoiceDetails,
//                       invoiceNumber: e.target.value,
//                     })
//                   }
//                 />
//               </div>
//               <div>
//                 <Label htmlFor="issue-date">Issue Date</Label>
//                 <Input
//                   id="issue-date"
//                   type="date"
//                   value={invoiceDetails.issueDate}
//                   onChange={(e) =>
//                     setInvoiceDetails({
//                       ...invoiceDetails,
//                       issueDate: e.target.value,
//                     })
//                   }
//                 />
//               </div>
//               <div>
//                 <Label htmlFor="due-date">Due Date</Label>
//                 <Input
//                   id="due-date"
//                   type="date"
//                   value={invoiceDetails.dueDate}
//                   onChange={(e) =>
//                     setInvoiceDetails({
//                       ...invoiceDetails,
//                       dueDate: e.target.value,
//                     })
//                   }
//                 />
//               </div>
//               <div>
//                 <Label htmlFor="tax">Tax Rate (%)</Label>
//                 <Input
//                   id="tax"
//                   type="number"
//                   value={invoiceDetails.tax}
//                   onChange={(e) =>
//                     setInvoiceDetails({
//                       ...invoiceDetails,
//                       tax: Number(e.target.value),
//                     })
//                   }
//                   min="0"
//                   step="0.1"
//                 />
//               </div>
//             </div>

//             {/* Items */}
//             <div className="space-y-4">
//               <div className="flex justify-between items-center">
//                 <h3 className="text-lg font-semibold">Items</h3>
//                 <Button
//                   onClick={addItem}
//                   variant="outline"
//                   size="sm"
//                   className="flex items-center gap-2"
//                 >
//                   <Plus size={16} />
//                   Add Item
//                 </Button>
//               </div>

//               <div className="space-y-3">
//                 <AnimatePresence>
//                   {items.map((item, index) => (
//                     <motion.div
//                       key={item.id}
//                       initial={{ opacity: 0, height: 0 }}
//                       animate={{ opacity: 1, height: "auto" }}
//                       exit={{ opacity: 0, height: 0 }}
//                       className="grid grid-cols-12 gap-3 items-center p-4 border rounded-lg"
//                     >
//                       <div className="col-span-5">
//                         <Input
//                           placeholder="Item description"
//                           value={item.description}
//                           onChange={(e) =>
//                             updateItem(item.id, "description", e.target.value)
//                           }
//                         />
//                       </div>
//                       <div className="col-span-2">
//                         <Input
//                           type="number"
//                           placeholder="Qty"
//                           value={item.quantity}
//                           onChange={(e) =>
//                             updateItem(
//                               item.id,
//                               "quantity",
//                               Number(e.target.value)
//                             )
//                           }
//                           min="1"
//                         />
//                       </div>
//                       <div className="col-span-2">
//                         <Input
//                           type="number"
//                           placeholder="Price"
//                           value={item.price}
//                           onChange={(e) =>
//                             updateItem(item.id, "price", Number(e.target.value))
//                           }
//                           min="0"
//                           step="0.01"
//                         />
//                       </div>
//                       <div className="col-span-2">
//                         <Input
//                           value={item.total.toFixed(2)}
//                           readOnly
//                           className="bg-gray-50"
//                         />
//                       </div>
//                       <div className="col-span-1 flex justify-end">
//                         {items.length > 1 && (
//                           <Button
//                             variant="outline"
//                             size="icon"
//                             onClick={() => removeItem(item.id)}
//                             className="h-8 w-8"
//                           >
//                             <Trash2 size={14} />
//                           </Button>
//                         )}
//                       </div>
//                     </motion.div>
//                   ))}
//                 </AnimatePresence>
//               </div>

//               {/* Totals */}
//               <div className="flex justify-end">
//                 <div className="w-80 space-y-2">
//                   <div className="flex justify-between">
//                     <span>Subtotal:</span>
//                     <span>R{subtotal.toFixed(2)}</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span>Tax ({invoiceDetails.tax}%):</span>
//                     <span>R{taxAmount.toFixed(2)}</span>
//                   </div>
//                   <div className="flex justify-between text-lg font-semibold border-t pt-2">
//                     <span>Total:</span>
//                     <span>R{total.toFixed(2)}</span>
//                   </div>
//                 </div>
//               </div>

//               <div>
//                 <Label htmlFor="notes">Notes (Optional)</Label>
//                 <Textarea
//                   id="notes"
//                   value={invoiceDetails.notes}
//                   onChange={(e) =>
//                     setInvoiceDetails({
//                       ...invoiceDetails,
//                       notes: e.target.value,
//                     })
//                   }
//                   placeholder="Additional notes or payment terms"
//                   rows={3}
//                 />
//               </div>
//             </div>
//           </CardContent>
//         </Card>
//       </motion.div>
//     </div>
//   );
// }
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
//   X, // Add close icon
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

// interface InvoiceCreationFormProps {
//   defaultCompanyId?: Id<"companies">;
//   onClose: () => void;
// }

// export default function InvoiceCreationForm({
//   defaultCompanyId,
//   onClose,
// }: InvoiceCreationFormProps) {
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
//     if (companies && companies.length > 0) {
//       let initialCompany: Doc<"companies"> | undefined;
//       if (defaultCompanyId) {
//         initialCompany = companies.find(
//           (c: Doc<"companies">) => c._id === defaultCompanyId
//         );
//       } else if (!watchedValues.company.name) {
//         initialCompany = companies[0];
//       }
//       if (initialCompany) {
//         setValue("company", {
//           name: initialCompany.name,
//           address: initialCompany.address,
//           phone: initialCompany.phone,
//           email: initialCompany.email,
//           website: initialCompany.website || "",
//           logoUrl: initialCompany.logoUrl || "",
//           bankingDetails: initialCompany.bankingDetails,
//         });
//         setLogoPreview(initialCompany.logoUrl || "");
//       }
//     }
//   }, [companies, defaultCompanyId, setValue, watchedValues.company.name]);

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
//       if (!templates.find((t: Doc<"templates">) => t._id === currentId)) {
//         setValue(
//           "invoiceDetails.templateId",
//           templates.length > 0
//             ? (
//                 templates.find((t: Doc<"templates">) => t.isDefault) ||
//                 templates[0]
//               )._id
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
//       onClose(); // Close the form
//       // Optionally refresh or update local state
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
//     <div className="relative">
//       <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
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
//             <Button
//               variant="ghost"
//               size="icon"
//               onClick={onClose}
//               className="hover:bg-rose-50 hover:text-rose-600"
//             >
//               <X size={20} />
//             </Button>
//           </motion.div>
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
//                 <motion.div whileTap={{ scale: 0.98 }}>
//                   <Label className="mb-2 text-sm font-medium text-slate-700">
//                     Company
//                   </Label>
//                   <Select
//                     value={watchedValues.company.name}
//                     onValueChange={(value) => {
//                       const selectedCompany = companies?.find(
//                         (c: Doc<"companies">) => c.name === value
//                       );
//                       if (selectedCompany) {
//                         setValue("company", {
//                           name: selectedCompany.name,
//                           address: selectedCompany.address,
//                           phone: selectedCompany.phone,
//                           email: selectedCompany.email,
//                           website: selectedCompany.website || "",
//                           logoUrl: selectedCompany.logoUrl || "",
//                           bankingDetails: selectedCompany.bankingDetails,
//                         });
//                         setLogoPreview(selectedCompany.logoUrl || "");
//                       }
//                     }}
//                   >
//                     <SelectTrigger className="border-slate-200 focus:ring-2 focus:ring-indigo-500/20 hover:border-indigo-300 transition-all duration-200">
//                       <SelectValue placeholder="Select a company" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       {companies?.map((c: Doc<"companies">) => (
//                         <SelectItem
//                           key={c._id}
//                           value={c.name}
//                           className="hover:bg-indigo-50 transition-colors"
//                         >
//                           {c.name}
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                 </motion.div>
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
//                                 watchedValues.items[index]?.price || 0,
//                               watchedValues.invoiceDetails.currency
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
//                         {formatCurrency(
//                           subtotal,
//                           watchedValues.invoiceDetails.currency
//                         )}
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
//                         {formatCurrency(
//                           taxAmount,
//                           watchedValues.invoiceDetails.currency
//                         )}
//                       </span>
//                     </motion.div>
//                     <div className="h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent" />
//                     <motion.div
//                       className="flex justify-between items-center text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent pt-2"
//                       whileHover={{ scale: 1.02 }}
//                       transition={{ duration: 0.2 }}
//                     >
//                       <span>Total:</span>
//                       <span>
//                         {formatCurrency(
//                           total,
//                           watchedValues.invoiceDetails.currency
//                         )}
//                       </span>
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
//       </form>
//     </div>
//   );
// }

// components/invoice/InvoiceForm.tsx
"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Trash2,
  Upload,
  Save,
  Eye,
  FileText,
  Sparkles,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import InvoicePreview from "@/components/invoice/InvoicePreview";
import { Id, Doc } from "@/convex/_generated/dataModel";
import { formatCurrency } from "@/lib/currency";
import { useForm, useFieldArray } from "react-hook-form";

interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  price: number;
}

interface Customer {
  name: string;
  email: string;
  address: string;
  phone: string;
}

interface Company {
  name: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  logoUrl: string;
  bankingDetails: {
    bankName: string;
    accountNumber: string;
    branchCode: string;
    accountHolder: string;
  };
}

interface FormData {
  company: Company;
  customer: Customer;
  items: InvoiceItem[];
  invoiceDetails: {
    invoiceNumber: string;
    issueDate: string;
    dueDate: string;
    notes: string;
    tax: number;
    templateId: Id<"templates">;
    currency: string;
    status: "draft" | "sent" | "paid" | "overdue";
  };
  logoFile?: File | null;
}

interface InvoiceFormProps {
  initialData?: Doc<"invoices">;
  defaultCompanyId?: Id<"companies">;
  onClose?: () => void;
}

export default function InvoiceForm({
  initialData,
  defaultCompanyId,
  onClose,
}: InvoiceFormProps) {
  const isEditMode = !!initialData;
  const { user } = useUser();
  const router = useRouter();
  const { control, register, watch, reset, setValue, handleSubmit } =
    useForm<FormData>({
      defaultValues: initialData
        ? {
            company: {
              name: "",
              address: "",
              phone: "",
              email: "",
              website: "",
              logoUrl: "",
              bankingDetails: {
                bankName: "",
                accountNumber: "",
                branchCode: "",
                accountHolder: "",
              },
            },
            customer: initialData.customer,
            items: initialData.items.map((item) => ({
              id: item.id,
              description: item.description,
              quantity: item.quantity,
              price: item.price,
            })),
            invoiceDetails: {
              invoiceNumber: initialData.invoiceNumber,
              issueDate: initialData.issueDate,
              dueDate: initialData.dueDate,
              notes: initialData.notes || "",
              tax: (initialData.tax / initialData.subtotal) * 100 || 0,
              templateId: initialData.templateId,
              currency: initialData.currency,
              status: initialData.status,
            },
          }
        : {
            company: {
              name: "",
              address: "",
              phone: "",
              email: "",
              website: "",
              logoUrl: "",
              bankingDetails: {
                bankName: "",
                accountNumber: "",
                branchCode: "",
                accountHolder: "",
              },
            },
            customer: {
              name: "",
              email: "",
              address: "",
              phone: "",
            },
            items: [
              {
                id: Date.now().toString(),
                description: "",
                quantity: 1,
                price: 0,
              },
            ],
            invoiceDetails: {
              invoiceNumber: `INV-${Date.now()}`,
              issueDate: new Date().toISOString().split("T")[0],
              dueDate: "",
              notes: "",
              tax: 0,
              templateId: "" as Id<"templates">,
              currency: "ZAR",
              status: "draft",
            },
          },
    });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  const watchedValues = watch();
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>("");
  const [showPreview, setShowPreview] = useState(false);

  const companies = useQuery(
    api.companies.getCompaniesByUser,
    user ? {} : "skip"
  );
  const selectedCompany = companies?.find(
    (c: Doc<"companies">) => c.name === watchedValues.company.name
  );
  const templates = useQuery(
    api.templates.getTemplatesByCompany,
    selectedCompany ? { companyId: selectedCompany._id } : "skip"
  );
  const createInvoice = useMutation(api.invoices.createInvoice);
  const updateInvoice = useMutation(api.invoices.updateInvoice);
  const updateCompany = useMutation(api.companies.updateCompany);

  const company = useQuery(
    api.companies.getCompany,
    initialData ? { id: initialData.companyId } : "skip"
  );

  useEffect(() => {
    if (isEditMode && company) {
      setValue("company", {
        name: company.name,
        address: company.address,
        phone: company.phone,
        email: company.email,
        website: company.website || "",
        logoUrl: company.logoUrl || "",
        bankingDetails: company.bankingDetails,
      });
      setLogoPreview(company.logoUrl || "");
    }
  }, [company, isEditMode, setValue]);

  useEffect(() => {
    const timer = setTimeout(() => {
      localStorage.setItem("invoice-draft", JSON.stringify(watchedValues));
    }, 1000);
    return () => clearTimeout(timer);
  }, [watchedValues]);

  useEffect(() => {
    const draft = localStorage.getItem("invoice-draft");
    if (draft && !isEditMode) {
      const shouldRestore = confirm("Restore previous draft?");
      if (shouldRestore) {
        const data = JSON.parse(draft);
        reset(data);
      }
    }
  }, [reset, isEditMode]);

  useEffect(() => {
    if (companies && companies.length > 0 && !watchedValues.company.name) {
      let initialCompany: Doc<"companies"> | undefined;
      if (defaultCompanyId) {
        initialCompany = companies.find(
          (c: Doc<"companies">) => c._id === defaultCompanyId
        );
      } else {
        initialCompany = companies[0];
      }
      if (initialCompany) {
        setValue("company", {
          name: initialCompany.name,
          address: initialCompany.address,
          phone: initialCompany.phone,
          email: initialCompany.email,
          website: initialCompany.website || "",
          logoUrl: initialCompany.logoUrl || "",
          bankingDetails: initialCompany.bankingDetails,
        });
        setLogoPreview(initialCompany.logoUrl || "");
      }
    }
  }, [companies, defaultCompanyId, setValue, watchedValues.company.name]);

  useEffect(() => {
    if (
      templates &&
      templates.length > 0 &&
      !watchedValues.invoiceDetails.templateId
    ) {
      const defaultTemplate =
        templates.find((t: Doc<"templates">) => t.isDefault) || templates[0];
      setValue("invoiceDetails.templateId", defaultTemplate._id);
    }
  }, [templates, setValue, watchedValues.invoiceDetails.templateId]);

  useEffect(() => {
    if (templates && watchedValues.invoiceDetails.templateId) {
      const currentId = watchedValues.invoiceDetails.templateId;
      if (!templates.find((t: Doc<"templates">) => t._id === currentId)) {
        setValue(
          "invoiceDetails.templateId",
          templates.length > 0
            ? (
                templates.find((t: Doc<"templates">) => t.isDefault) ||
                templates[0]
              )._id
            : ("" as Id<"templates">)
        );
      }
    }
  }, [templates, watchedValues.invoiceDetails.templateId, setValue]);

  const subtotal = watchedValues.items.reduce(
    (sum, item) => sum + item.quantity * item.price,
    0
  );
  const taxAmount = (subtotal * watchedValues.invoiceDetails.tax) / 100;
  const total = subtotal + taxAmount;

  const addItem = () => {
    append({
      id: Date.now().toString(),
      description: "",
      quantity: 1,
      price: 0,
    });
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onload = () => setLogoPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const uploadToCloudinary = async () => {
    if (!logoFile) return watchedValues.company.logoUrl || "";

    const formData = new FormData();
    formData.append("file", logoFile);
    formData.append("upload_preset", "invoice_logos");

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await response.json();
      return data.secure_url;
    } catch (error) {
      console.error("Error uploading logo:", error);
      toast.error("Failed to upload logo.");
      return "";
    }
  };

  const validateForm = () => {
    if (
      !watchedValues.company.name ||
      !watchedValues.company.address ||
      !watchedValues.company.email
    ) {
      toast.error("Please fill in all required company details.");
      return false;
    }

    if (
      !watchedValues.customer.name ||
      !watchedValues.customer.email ||
      !watchedValues.customer.address
    ) {
      toast.error("Please fill in all required customer details.");
      return false;
    }

    if (!watchedValues.invoiceDetails.templateId) {
      toast.error("Please select a template.");
      return false;
    }

    if (!watchedValues.invoiceDetails.dueDate) {
      toast.error("Please set a due date.");
      return false;
    }

    if (
      watchedValues.items.some(
        (item) => !item.description || item.quantity <= 0 || item.price < 0
      )
    ) {
      toast.error("Please fill in all item details correctly.");
      return false;
    }

    return true;
  };

  const onSubmit = async (data: FormData) => {
    if (!validateForm()) return;
    if (!selectedCompany) {
      toast.error("Please select a valid company.");
      return;
    }

    try {
      const logoUrl = await uploadToCloudinary();

      await updateCompany({
        id: selectedCompany._id,
        name: data.company.name,
        address: data.company.address,
        phone: data.company.phone,
        email: data.company.email,
        website: data.company.website,
        logoUrl: logoUrl || data.company.logoUrl,
        bankingDetails: data.company.bankingDetails,
        userId: user!.id,
      });

      const invoiceData = {
        invoiceNumber: data.invoiceDetails.invoiceNumber,
        companyId: selectedCompany._id,
        templateId: data.invoiceDetails.templateId,
        customer: data.customer,
        items: data.items.map((item) => ({
          id: item.id,
          description: item.description,
          quantity: item.quantity,
          price: item.price,
          total: item.quantity * item.price,
        })),
        subtotal,
        tax: taxAmount,
        total,
        status: data.invoiceDetails.status,
        issueDate: data.invoiceDetails.issueDate,
        dueDate: data.invoiceDetails.dueDate,
        notes: data.invoiceDetails.notes,
        currency: data.invoiceDetails.currency,
      };

      let invoiceId;
      if (isEditMode) {
        const { companyId, templateId, currency, ...updateData } = invoiceData;
        await updateInvoice({ id: initialData!._id, ...updateData });
        invoiceId = initialData!._id;
        toast.success("Invoice updated successfully!");
      } else {
        invoiceId = await createInvoice(invoiceData);
        toast.success("Invoice created successfully!");
      }

      localStorage.removeItem("invoice-draft");
      if (onClose) {
        onClose();
      } else {
        router.push(`/dashboard/invoices/${invoiceId}`);
      }
    } catch (error) {
      console.error("Error saving invoice:", error);
      toast.error("Failed to save invoice.");
    }
  };

  if (!user || companies === undefined) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <FileText size={64} className="mx-auto text-indigo-500 mb-4" />
          <p className="text-slate-600 text-lg font-medium">Loading...</p>
        </motion.div>
      </div>
    );
  }

  const selectedTemplate = templates?.find(
    (t: Doc<"templates">) => t._id === watchedValues.invoiceDetails.templateId
  );

  const previewInvoice: Doc<"invoices"> = {
    _id: initialData?._id || ("preview" as Id<"invoices">),
    _creationTime: Date.now(),
    invoiceNumber: watchedValues.invoiceDetails.invoiceNumber,
    companyId: selectedCompany?._id || ("" as Id<"companies">),
    templateId: watchedValues.invoiceDetails.templateId,
    customer: watchedValues.customer,
    items: watchedValues.items.map((item) => ({
      id: item.id,
      description: item.description,
      quantity: item.quantity,
      price: item.price,
      total: item.quantity * item.price,
    })),
    subtotal,
    tax: taxAmount,
    total,
    status: watchedValues.invoiceDetails.status,
    issueDate: watchedValues.invoiceDetails.issueDate,
    dueDate: watchedValues.invoiceDetails.dueDate,
    notes: watchedValues.invoiceDetails.notes,
    currency: watchedValues.invoiceDetails.currency,
  };

  const previewCompany: Doc<"companies"> = {
    _id: selectedCompany?._id || ("" as Id<"companies">),
    _creationTime: Date.now(),
    ...watchedValues.company,
    userId: user?.id || "",
  };

  const datePresets = [
    { label: "Today", days: 0 },
    { label: "7 days", days: 7 },
    { label: "14 days", days: 14 },
    { label: "30 days", days: 30 },
    { label: "60 days", days: 60 },
  ];

  const currencies = [
    { code: "ZAR", symbol: "R", name: "South African Rand" },
    { code: "USD", symbol: "$", name: "US Dollar" },
    { code: "EUR", symbol: "€", name: "Euro" },
    { code: "GBP", symbol: "£", name: "British Pound" },
  ];

  return (
    <div className="relative">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8"
        >
          <div className="relative">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                {isEditMode ? "Edit Invoice" : "Create Invoice"}
              </h1>
              <p className="text-slate-500 mt-2 text-sm sm:text-base">
                {isEditMode
                  ? "Update your invoice details"
                  : "Build professional invoices in seconds"}
              </p>
            </motion.div>
            <motion.div
              className="absolute -top-6 -right-6 text-yellow-400"
              animate={{
                rotate: [0, 10, -10, 10, 0],
                scale: [1, 1.1, -1, 1.1, 1],
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
            className="flex gap-3"
          >
            <Button
              type="button"
              variant="outline"
              className="group relative overflow-hidden border-2 border-slate-200 hover:border-indigo-300 transition-all duration-300 shadow-sm hover:shadow-md"
              onClick={() => setShowPreview(!showPreview)}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10"
                initial={{ x: "-100%" }}
                whileHover={{ x: "100%" }}
                transition={{ duration: 0.5 }}
              />
              <Eye
                size={16}
                className="mr-2 group-hover:scale-110 transition-transform"
              />
              {showPreview ? "Hide Preview" : "Show Preview"}
            </Button>
            <Button
              type="submit"
              className="group relative overflow-hidden bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"
                initial={{ x: "-100%" }}
                whileHover={{ x: "100%" }}
                transition={{ duration: 0.5 }}
              />
              <Save
                size={16}
                className="mr-2 group-hover:scale-110 transition-transform"
              />
              {isEditMode ? "Update Invoice" : "Save Invoice"}
            </Button>
            {onClose && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="hover:bg-rose-50 hover:text-rose-600"
              >
                <X size={20} />
              </Button>
            )}
          </motion.div>
        </motion.div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Company Information */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              delay: 0.15,
              duration: 0.6,
              ease: [0.22, 1, 0.36, 1],
            }}
            whileHover={{ y: -4 }}
            className="transition-all duration-300"
          >
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <CardHeader className="border-b border-slate-100 bg-gradient-to-r from-slate-50 to-indigo-50/30 relative">
                <CardTitle className="text-xl font-semibold text-slate-800 flex items-center gap-2">
                  <div className="w-1 h-6 bg-gradient-to-b from-indigo-500 to-purple-500 rounded-full" />
                  Company Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-5 pt-6 relative">
                <motion.div whileTap={{ scale: 0.98 }}>
                  <Label className="mb-2 text-sm font-medium text-slate-700">
                    Company
                  </Label>
                  <Select
                    value={watchedValues.company.name}
                    onValueChange={(value) => {
                      const selectedCompany = companies?.find(
                        (c: Doc<"companies">) => c.name === value
                      );
                      if (selectedCompany) {
                        setValue("company", {
                          name: selectedCompany.name,
                          address: selectedCompany.address,
                          phone: selectedCompany.phone,
                          email: selectedCompany.email,
                          website: selectedCompany.website || "",
                          logoUrl: selectedCompany.logoUrl || "",
                          bankingDetails: selectedCompany.bankingDetails,
                        });
                        setLogoPreview(selectedCompany.logoUrl || "");
                      }
                    }}
                  >
                    <SelectTrigger className="border-slate-200 focus:ring-2 focus:ring-indigo-500/20 hover:border-indigo-300 transition-all duration-200">
                      <SelectValue placeholder="Select a company" />
                    </SelectTrigger>
                    <SelectContent>
                      {companies?.map((c: Doc<"companies">) => (
                        <SelectItem
                          key={c._id}
                          value={c.name}
                          className="hover:bg-indigo-50 transition-colors"
                        >
                          {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </motion.div>
                <div>
                  <Label className="mb-2 text-sm font-medium text-slate-700">
                    Company Logo
                  </Label>
                  <div className="mt-2">
                    <div className="flex items-center gap-4">
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button
                          type="button"
                          variant="outline"
                          className="border-2 border-dashed border-slate-300 hover:border-indigo-400 hover:bg-indigo-50/50 transition-all duration-200"
                          onClick={() =>
                            document.getElementById("logo-upload")?.click()
                          }
                        >
                          <Upload size={16} className="mr-2" />
                          Upload Logo
                        </Button>
                      </motion.div>
                      <input
                        id="logo-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleLogoUpload}
                        className="hidden"
                      />
                      <AnimatePresence>
                        {logoPreview && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className="relative group/logo"
                          >
                            <img
                              src={logoPreview}
                              alt="Logo preview"
                              className="h-16 w-16 object-contain rounded-lg border-2 border-slate-200 p-1 bg-white shadow-md group-hover/logo:shadow-lg transition-all duration-200"
                            />
                            <div className="absolute inset-0 bg-indigo-500/10 rounded-lg opacity-0 group-hover/logo:opacity-100 transition-opacity" />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </div>
                <motion.div whileTap={{ scale: 0.98 }}>
                  <Label
                    htmlFor="company-address"
                    className="mb-2 text-sm font-medium text-slate-700"
                  >
                    Address
                  </Label>
                  <Textarea
                    id="company-address"
                    placeholder="Company Address"
                    rows={3}
                    className="border-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 hover:border-slate-300 transition-all duration-200 resize-none"
                    {...register("company.address")}
                  />
                </motion.div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <motion.div whileTap={{ scale: 0.98 }}>
                    <Label
                      htmlFor="company-phone"
                      className="mb-2 text-sm font-medium text-slate-700"
                    >
                      Phone
                    </Label>
                    <Input
                      id="company-phone"
                      placeholder="Phone Number"
                      className="border-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 hover:border-slate-300 transition-all duration-200"
                      {...register("company.phone")}
                    />
                  </motion.div>
                  <motion.div whileTap={{ scale: 0.98 }}>
                    <Label
                      htmlFor="company-email"
                      className="mb-2 text-sm font-medium text-slate-700"
                    >
                      Email
                    </Label>
                    <Input
                      id="company-email"
                      type="email"
                      placeholder="email@company.com"
                      className="border-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 hover:border-slate-300 transition-all duration-200"
                      {...register("company.email")}
                    />
                  </motion.div>
                </div>
                <motion.div whileTap={{ scale: 0.98 }}>
                  <Label
                    htmlFor="company-website"
                    className="mb-2 text-sm font-medium text-slate-700"
                  >
                    Website{" "}
                    <span className="text-slate-400 text-xs">(Optional)</span>
                  </Label>
                  <Input
                    id="company-website"
                    placeholder="www.company.com"
                    className="border-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 hover:border-slate-300 transition-all duration-200"
                    {...register("company.website")}
                  />
                </motion.div>
                {/* Banking Details */}
                <div className="space-y-4 pt-4 border-t border-slate-200">
                  <h4 className="text-md font-semibold text-slate-800">
                    Banking Details
                  </h4>
                  <motion.div whileTap={{ scale: 0.98 }}>
                    <Label
                      htmlFor="bank-name"
                      className="mb-2 text-sm font-medium text-slate-700"
                    >
                      Bank Name
                    </Label>
                    <Input
                      id="bank-name"
                      placeholder="Bank Name"
                      className="border-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 hover:border-slate-300 transition-all duration-200"
                      {...register("company.bankingDetails.bankName")}
                    />
                  </motion.div>
                  <motion.div whileTap={{ scale: 0.98 }}>
                    <Label
                      htmlFor="account-number"
                      className="mb-2 text-sm font-medium text-slate-700"
                    >
                      Account Number
                    </Label>
                    <Input
                      id="account-number"
                      placeholder="Account Number"
                      className="border-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 hover:border-slate-300 transition-all duration-200"
                      {...register("company.bankingDetails.accountNumber")}
                    />
                  </motion.div>
                  <motion.div whileTap={{ scale: 0.98 }}>
                    <Label
                      htmlFor="branch-code"
                      className="mb-2 text-sm font-medium text-slate-700"
                    >
                      Branch Code
                    </Label>
                    <Input
                      id="branch-code"
                      placeholder="Branch Code"
                      className="border-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 hover:border-slate-300 transition-all duration-200"
                      {...register("company.bankingDetails.branchCode")}
                    />
                  </motion.div>
                  <motion.div whileTap={{ scale: 0.98 }}>
                    <Label
                      htmlFor="account-holder"
                      className="mb-2 text-sm font-medium text-slate-700"
                    >
                      Account Holder
                    </Label>
                    <Input
                      id="account-holder"
                      placeholder="Account Holder"
                      className="border-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 hover:border-slate-300 transition-all duration-200"
                      {...register("company.bankingDetails.accountHolder")}
                    />
                  </motion.div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
          {/* Customer Information */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              delay: 0.25,
              duration: 0.6,
              ease: [0.22, 1, 0.36, 1],
            }}
            whileHover={{ y: -4 }}
            className="transition-all duration-300"
          >
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <CardHeader className="border-b border-slate-100 bg-gradient-to-r from-slate-50 to-purple-50/30 relative">
                <CardTitle className="text-xl font-semibold text-slate-800 flex items-center gap-2">
                  <div className="w-1 h-6 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full" />
                  Customer Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-5 pt-6 relative">
                <motion.div whileTap={{ scale: 0.98 }}>
                  <Label
                    htmlFor="customer-name"
                    className="mb-2 text-sm font-medium text-slate-700"
                  >
                    Customer Name
                  </Label>
                  <Input
                    id="customer-name"
                    placeholder="Customer Name"
                    className="border-slate-200 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-400 hover:border-slate-300 transition-all duration-200"
                    {...register("customer.name")}
                  />
                </motion.div>
                <motion.div whileTap={{ scale: 0.98 }}>
                  <Label
                    htmlFor="customer-email"
                    className="mb-2 text-sm font-medium text-slate-700"
                  >
                    Email
                  </Label>
                  <Input
                    id="customer-email"
                    type="text"
                    placeholder="customer@email.com or 'not applicable'"
                    className="border-slate-200 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-400 hover:border-slate-300 transition-all duration-200"
                    {...register("customer.email")}
                  />
                </motion.div>
                <motion.div whileTap={{ scale: 0.98 }}>
                  <Label
                    htmlFor="customer-address"
                    className="mb-2 text-sm font-medium text-slate-700"
                  >
                    Address
                  </Label>
                  <Textarea
                    id="customer-address"
                    placeholder="Customer Address"
                    rows={3}
                    className="border-slate-200 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-400 hover:border-slate-300 transition-all duration-200 resize-none"
                    {...register("customer.address")}
                  />
                </motion.div>
                <motion.div whileTap={{ scale: 0.98 }}>
                  <Label
                    htmlFor="customer-phone"
                    className="mb-2 text-sm font-medium text-slate-700"
                  >
                    Phone
                  </Label>
                  <Input
                    id="customer-phone"
                    placeholder="Phone Number"
                    className="border-slate-200 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-400 hover:border-slate-300 transition-all duration-200"
                    {...register("customer.phone")}
                  />
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
        {/* Invoice Details */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          whileHover={{ y: -4 }}
          className="transition-all duration-300"
        >
          <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <CardHeader className="border-b border-slate-100 bg-gradient-to-r from-slate-50 to-blue-50/30 relative">
              <CardTitle className="text-xl font-semibold text-slate-800 flex items-center gap-2">
                <div className="w-1 h-6 bg-gradient-to-b from-blue-500 to-cyan-500 rounded-full" />
                Invoice Details
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 relative">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
                <motion.div whileTap={{ scale: 0.98 }}>
                  <Label
                    htmlFor="invoice-number"
                    className="mb-2 text-sm font-medium text-slate-700"
                  >
                    Invoice Number
                  </Label>
                  <Input
                    id="invoice-number"
                    className="border-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 hover:border-slate-300 transition-all duration-200 font-mono"
                    {...register("invoiceDetails.invoiceNumber")}
                  />
                </motion.div>
                <motion.div whileTap={{ scale: 0.98 }}>
                  <Label
                    htmlFor="issue-date"
                    className="mb-2 text-sm font-medium text-slate-700"
                  >
                    Issue Date
                  </Label>
                  <Input
                    id="issue-date"
                    type="date"
                    className="border-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 hover:border-slate-300 transition-all duration-200"
                    {...register("invoiceDetails.issueDate")}
                  />
                </motion.div>
                <motion.div whileTap={{ scale: 0.98 }}>
                  <Label
                    htmlFor="due-date"
                    className="mb-2 text-sm font-medium text-slate-700"
                  >
                    Due Date
                  </Label>
                  <Input
                    id="due-date"
                    type="date"
                    className="border-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 hover:border-slate-300 transition-all duration-200"
                    {...register("invoiceDetails.dueDate")}
                  />
                </motion.div>
                <motion.div whileTap={{ scale: 0.98 }}>
                  <Label
                    htmlFor="tax"
                    className="mb-2 text-sm font-medium text-slate-700"
                  >
                    Tax Rate (%)
                  </Label>
                  <Input
                    id="tax"
                    type="number"
                    min="0"
                    step="0.1"
                    className="border-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 hover:border-slate-300 transition-all duration-200"
                    {...register("invoiceDetails.tax", { valueAsNumber: true })}
                  />
                </motion.div>
                <motion.div whileTap={{ scale: 0.98 }}>
                  <Label className="mb-2 text-sm font-medium text-slate-700">
                    Currency
                  </Label>
                  <Select
                    value={watchedValues.invoiceDetails.currency}
                    onValueChange={(value) =>
                      setValue("invoiceDetails.currency", value)
                    }
                  >
                    <SelectTrigger className="border-slate-200 focus:ring-2 focus:ring-blue-500/20 hover:border-blue-300 transition-all duration-200">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {currencies.map((curr) => (
                        <SelectItem
                          key={curr.code}
                          value={curr.code}
                          className="hover:bg-blue-50 transition-colors"
                        >
                          {curr.symbol} {curr.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </motion.div>
              </div>
              <div className="flex flex-wrap gap-2 mb-6">
                {datePresets.map((preset, index) => (
                  <motion.div
                    key={preset.label}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 + index * 0.05 }}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="border-slate-200 hover:border-indigo-300 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 transition-all duration-200 shadow-sm hover:shadow-md"
                      onClick={() => {
                        const date = new Date();
                        date.setDate(date.getDate() + preset.days);
                        setValue(
                          "invoiceDetails.dueDate",
                          date.toISOString().split("T")[0]
                        );
                      }}
                    >
                      {preset.label}
                    </Button>
                  </motion.div>
                ))}
              </div>
              <motion.div whileTap={{ scale: 0.98 }}>
                <Label
                  htmlFor="template"
                  className="mb-2 text-sm font-medium text-slate-700"
                >
                  Template
                </Label>
                <Select
                  value={watchedValues.invoiceDetails.templateId}
                  onValueChange={(value) =>
                    setValue(
                      "invoiceDetails.templateId",
                      value as Id<"templates">
                    )
                  }
                >
                  <SelectTrigger className="border-slate-200 focus:ring-2 focus:ring-blue-500/20 hover:border-blue-300 transition-all duration-200">
                    <SelectValue placeholder="Select a template" />
                  </SelectTrigger>
                  <SelectContent>
                    {templates?.map((t: Doc<"templates">) => (
                      <SelectItem
                        key={t._id}
                        value={t._id}
                        className="hover:bg-blue-50 transition-colors"
                      >
                        {t.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </motion.div>
              <motion.div whileTap={{ scale: 0.98 }} className="mt-4">
                <Label className="mb-2 text-sm font-medium text-slate-700">
                  Status
                </Label>
                <Select
                  value={watchedValues.invoiceDetails.status}
                  onValueChange={(value) =>
                    setValue(
                      "invoiceDetails.status",
                      value as "draft" | "sent" | "paid" | "overdue"
                    )
                  }
                >
                  <SelectTrigger className="border-slate-200 focus:ring-2 focus:ring-blue-500/20 hover:border-blue-300 transition-all duration-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="sent">Sent</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="overdue">Overdue</SelectItem>
                  </SelectContent>
                </Select>
              </motion.div>
              {/* Items */}
              <div className="space-y-6 mt-8">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                    <div className="w-1 h-5 bg-gradient-to-b from-emerald-500 to-teal-500 rounded-full" />
                    Invoice Items
                  </h3>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      type="button"
                      onClick={addItem}
                      variant="outline"
                      size="sm"
                      className="border-2 border-emerald-200 hover:border-emerald-400 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-teal-50 transition-all duration-200 shadow-sm hover:shadow-md"
                    >
                      <Plus size={16} className="mr-1" />
                      Add Item
                    </Button>
                  </motion.div>
                </div>
                <div className="space-y-3">
                  <AnimatePresence mode="popLayout">
                    {fields.map((item, index) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, height: 0, scale: 0.8 }}
                        animate={{ opacity: 1, height: "auto", scale: 1 }}
                        exit={{ opacity: 0, height: 0, scale: 0.8 }}
                        transition={{
                          duration: 0.3,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                        whileHover={{ scale: 1.01, y: -2 }}
                        className="grid grid-cols-12 gap-3 items-center p-5 border-2 border-slate-200 rounded-xl bg-gradient-to-br from-white to-slate-50/50 hover:border-emerald-300 hover:shadow-lg transition-all duration-300 group/item"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-teal-500/5 opacity-0 group-hover/item:opacity-100 rounded-xl transition-opacity duration-300" />
                        <div className="col-span-12 sm:col-span-5 relative">
                          <Input
                            placeholder="Item description"
                            className="border-slate-200 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400 hover:border-slate-300 transition-all duration-200"
                            {...register(`items.${index}.description`)}
                          />
                        </div>
                        <div className="col-span-4 sm:col-span-2 relative">
                          <Input
                            type="number"
                            placeholder="Qty"
                            min="1"
                            className="border-slate-200 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400 hover:border-slate-300 transition-all duration-200"
                            {...register(`items.${index}.quantity`, {
                              valueAsNumber: true,
                            })}
                          />
                        </div>
                        <div className="col-span-4 sm:col-span-2 relative">
                          <Input
                            type="number"
                            placeholder="Price"
                            min="0"
                            step="0.01"
                            className="border-slate-200 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400 hover:border-slate-300 transition-all duration-200"
                            {...register(`items.${index}.price`, {
                              valueAsNumber: true,
                            })}
                          />
                        </div>
                        <div className="col-span-3 sm:col-span-2 relative">
                          <Input
                            value={formatCurrency(
                              watchedValues.items[index]?.quantity *
                                watchedValues.items[index]?.price || 0,
                              watchedValues.invoiceDetails.currency
                            )}
                            readOnly
                            className="bg-gradient-to-br from-slate-50 to-emerald-50/30 border-slate-200 font-semibold text-slate-700"
                          />
                        </div>
                        <div className="col-span-1 flex justify-end relative">
                          {fields.length > 1 && (
                            <motion.div
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                onClick={() => remove(index)}
                                className="h-9 w-9 border-2 border-rose-200 hover:border-rose-400 hover:bg-rose-50 transition-all duration-200 group/delete"
                              >
                                <Trash2
                                  size={14}
                                  className="text-rose-500 group-hover/delete:scale-110 transition-transform"
                                />
                              </Button>
                            </motion.div>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
                {/* Totals */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="flex justify-end mt-6"
                >
                  <div className="w-full sm:w-96 space-y-3 p-6 rounded-xl bg-gradient-to-br from-slate-50 to-indigo-50/30 border-2 border-slate-200 shadow-lg">
                    <motion.div
                      className="flex justify-between items-center text-slate-600"
                      whileHover={{ x: 4 }}
                      transition={{ duration: 0.2 }}
                    >
                      <span className="font-medium">Subtotal:</span>
                      <span className="font-semibold">
                        {formatCurrency(
                          subtotal,
                          watchedValues.invoiceDetails.currency
                        )}
                      </span>
                    </motion.div>
                    <motion.div
                      className="flex justify-between items-center text-slate-600"
                      whileHover={{ x: 4 }}
                      transition={{ duration: 0.2 }}
                    >
                      <span className="font-medium">
                        Tax ({watchedValues.invoiceDetails.tax}%):
                      </span>
                      <span className="font-semibold">
                        {formatCurrency(
                          taxAmount,
                          watchedValues.invoiceDetails.currency
                        )}
                      </span>
                    </motion.div>
                    <div className="h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent" />
                    <motion.div
                      className="flex justify-between items-center text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent pt-2"
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.2 }}
                    >
                      <span>Total:</span>
                      <span>
                        {formatCurrency(
                          total,
                          watchedValues.invoiceDetails.currency
                        )}
                      </span>
                    </motion.div>
                  </div>
                </motion.div>
                <motion.div whileTap={{ scale: 0.98 }}>
                  <Label
                    htmlFor="notes"
                    className="mb-2 text-sm font-medium text-slate-700"
                  >
                    Notes{" "}
                    <span className="text-slate-400 text-xs">(Optional)</span>
                  </Label>
                  <Textarea
                    id="notes"
                    placeholder="Additional notes or payment terms"
                    rows={4}
                    className="border-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 hover:border-slate-300 transition-all duration-200 resize-none"
                    {...register("invoiceDetails.notes")}
                  />
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        {/* Preview */}
        <AnimatePresence>
          {showPreview && selectedTemplate && (
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -30, scale: 0.95 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <Card className="border-0 shadow-2xl bg-white/90 backdrop-blur-md overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-purple-500/5 to-pink-500/5" />
                <CardHeader className="border-b border-slate-100 bg-gradient-to-r from-slate-50 via-indigo-50/30 to-purple-50/30 relative">
                  <CardTitle className="text-xl font-semibold text-slate-800 flex items-center gap-2">
                    <div className="w-1 h-6 bg-gradient-to-b from-indigo-500 via-purple-500 to-pink-500 rounded-full" />
                    Invoice Preview
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      className="ml-auto"
                    >
                      <Eye size={20} className="text-indigo-500" />
                    </motion.div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8 relative">
                  <div className="bg-white rounded-lg shadow-inner p-4">
                    <InvoicePreview
                      invoice={previewInvoice}
                      template={selectedTemplate}
                      company={previewCompany}
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </form>
    </div>
  );
}
