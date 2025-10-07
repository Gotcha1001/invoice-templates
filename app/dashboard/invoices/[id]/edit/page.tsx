// "use client";

// import { use, useState, useEffect } from "react";
// import { useQuery, useMutation } from "convex/react";
// import { api } from "@/convex/_generated/api";
// import { useParams, useRouter } from "next/navigation";
// import { useUser } from "@clerk/nextjs";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { toast } from "sonner";
// import { Loader2, Plus, Trash2, Save } from "lucide-react";
// import { Id } from "@/convex/_generated/dataModel";
// import { formatCurrency } from "@/lib/currency";
// import { motion, AnimatePresence } from "framer-motion";

// interface InvoiceItem {
//   id: string;
//   description: string;
//   quantity: number;
//   price: number;
// }

// export default function EditInvoice() {
//   const { user } = useUser();
//   const { id } = useParams();
//   const router = useRouter();

//   const invoice = useQuery(api.invoices.getInvoice, {
//     id: id as Id<"invoices">,
//   });

//   const company = useQuery(
//     api.companies.getCompany,
//     invoice ? { id: invoice.companyId } : "skip"
//   );

//   const updateInvoice = useMutation(api.invoices.updateInvoice);

//   const [customer, setCustomer] = useState({
//     name: "",
//     email: "",
//     address: "",
//     phone: "",
//   });

//   const [items, setItems] = useState<InvoiceItem[]>([]);

//   const [invoiceDetails, setInvoiceDetails] = useState({
//     invoiceNumber: "",
//     issueDate: "",
//     dueDate: "",
//     notes: "",
//     tax: 0,
//   });

//   // Load invoice data when available
//   useEffect(() => {
//     if (invoice) {
//       setCustomer({
//         name: invoice.customer.name,
//         email: invoice.customer.email,
//         address: invoice.customer.address,
//         phone: invoice.customer.phone || "", // Handle optional phone
//       });
//       setItems(
//         invoice.items.map((item) => ({
//           id: item.id,
//           description: item.description,
//           quantity: item.quantity,
//           price: item.price,
//         }))
//       );
//       setInvoiceDetails({
//         invoiceNumber: invoice.invoiceNumber,
//         issueDate: invoice.issueDate,
//         dueDate: invoice.dueDate,
//         notes: invoice.notes || "",
//         tax:
//           invoice.subtotal !== 0 ? (invoice.tax / invoice.subtotal) * 100 : 0,
//       });
//     }
//   }, [invoice]);

//   const subtotal = items.reduce(
//     (sum, item) => sum + item.quantity * item.price,
//     0
//   );
//   const taxAmount = (subtotal * invoiceDetails.tax) / 100;
//   const total = subtotal + taxAmount;

//   const addItem = () => {
//     setItems([
//       ...items,
//       {
//         id: Date.now().toString(),
//         description: "",
//         quantity: 1,
//         price: 0,
//       },
//     ]);
//   };

//   const removeItem = (id: string) => {
//     setItems(items.filter((item) => item.id !== id));
//   };

//   const updateItem = (
//     id: string,
//     field: keyof Omit<InvoiceItem, "id">,
//     value: string | number
//   ) => {
//     setItems((prevItems) =>
//       prevItems.map((item) =>
//         item.id === id ? { ...item, [field]: value } : item
//       )
//     );
//   };

//   const handleSave = async () => {
//     if (!invoice) return;

//     try {
//       await updateInvoice({
//         id: invoice._id,
//         invoiceNumber: invoiceDetails.invoiceNumber,
//         customer: {
//           name: customer.name,
//           email: customer.email,
//           address: customer.address,
//           phone: customer.phone || undefined,
//         },
//         items: items.map((item) => ({
//           id: item.id,
//           description: item.description,
//           quantity: item.quantity,
//           price: item.price,
//           total: item.quantity * item.price,
//         })),
//         subtotal,
//         tax: taxAmount,
//         total,
//         issueDate: invoiceDetails.issueDate,
//         dueDate: invoiceDetails.dueDate,
//         notes: invoiceDetails.notes || undefined,
//       });

//       toast.success("Invoice updated successfully!");
//       router.push(`/dashboard/invoices/${id}`);
//     } catch (error) {
//       console.error("Error updating invoice:", error);
//       toast.error("Failed to update invoice.");
//     }
//   };

//   if (!user || invoice === undefined || company === undefined) {
//     return (
//       <div className="flex justify-center items-center h-screen">
//         <Loader2 className="w-8 h-8 animate-spin" />
//       </div>
//     );
//   }

//   if (!invoice || !company) {
//     return (
//       <div className="max-w-7xl mx-auto p-6 mt-20">
//         <Card>
//           <CardContent className="pt-6">
//             <p>Invoice not found.</p>
//             <Button onClick={() => router.push("/dashboard/invoices")}>
//               Back to Invoices
//             </Button>
//           </CardContent>
//         </Card>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-6xl mx-auto p-6 space-y-8 mt-20">
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         className="flex justify-between items-center"
//       >
//         <h1 className="text-3xl font-bold">
//           Edit Invoice #{invoice.invoiceNumber}
//         </h1>
//         <div className="flex gap-3">
//           <Button
//             variant="outline"
//             onClick={() => router.push(`/dashboard/invoices/${id}`)}
//           >
//             Cancel
//           </Button>
//           <Button onClick={handleSave} className="flex items-center gap-2">
//             <Save size={16} />
//             Save Changes
//           </Button>
//         </div>
//       </motion.div>

//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//         {/* Company Information (Read-only) */}
//         <Card>
//           <CardHeader>
//             <CardTitle>Company Information</CardTitle>
//           </CardHeader>
//           <CardContent className="space-y-2">
//             <p>
//               <strong>Name:</strong> {company.name}
//             </p>
//             <p>
//               <strong>Address:</strong> {company.address}
//             </p>
//             <p>
//               <strong>Phone:</strong> {company.phone}
//             </p>
//             <p>
//               <strong>Email:</strong> {company.email}
//             </p>
//           </CardContent>
//         </Card>

//         {/* Customer Information */}
//         <Card>
//           <CardHeader>
//             <CardTitle>Customer Information</CardTitle>
//           </CardHeader>
//           <CardContent className="space-y-4">
//             <div>
//               <Label htmlFor="customer-name">Customer Name</Label>
//               <Input
//                 id="customer-name"
//                 value={customer.name}
//                 onChange={(e) =>
//                   setCustomer({ ...customer, name: e.target.value })
//                 }
//               />
//             </div>
//             <div>
//               <Label htmlFor="customer-email">Email</Label>
//               <Input
//                 id="customer-email"
//                 type="email"
//                 value={customer.email}
//                 onChange={(e) =>
//                   setCustomer({ ...customer, email: e.target.value })
//                 }
//               />
//             </div>
//             <div>
//               <Label htmlFor="customer-address">Address</Label>
//               <Textarea
//                 id="customer-address"
//                 value={customer.address}
//                 onChange={(e) =>
//                   setCustomer({ ...customer, address: e.target.value })
//                 }
//                 rows={3}
//               />
//             </div>
//             <div>
//               <Label htmlFor="customer-phone">Phone</Label>
//               <Input
//                 id="customer-phone"
//                 value={customer.phone || ""}
//                 onChange={(e) =>
//                   setCustomer({ ...customer, phone: e.target.value })
//                 }
//               />
//             </div>
//           </CardContent>
//         </Card>
//       </div>

//       {/* Invoice Details */}
//       <Card>
//         <CardHeader>
//           <CardTitle>Invoice Details</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
//             <div>
//               <Label htmlFor="invoice-number">Invoice Number</Label>
//               <Input
//                 id="invoice-number"
//                 value={invoiceDetails.invoiceNumber}
//                 onChange={(e) =>
//                   setInvoiceDetails({
//                     ...invoiceDetails,
//                     invoiceNumber: e.target.value,
//                   })
//                 }
//               />
//             </div>
//             <div>
//               <Label htmlFor="issue-date">Issue Date</Label>
//               <Input
//                 id="issue-date"
//                 type="date"
//                 value={invoiceDetails.issueDate}
//                 onChange={(e) =>
//                   setInvoiceDetails({
//                     ...invoiceDetails,
//                     issueDate: e.target.value,
//                   })
//                 }
//               />
//             </div>
//             <div>
//               <Label htmlFor="due-date">Due Date</Label>
//               <Input
//                 id="due-date"
//                 type="date"
//                 value={invoiceDetails.dueDate}
//                 onChange={(e) =>
//                   setInvoiceDetails({
//                     ...invoiceDetails,
//                     dueDate: e.target.value,
//                   })
//                 }
//               />
//             </div>
//             <div>
//               <Label htmlFor="tax">Tax Rate (%)</Label>
//               <Input
//                 id="tax"
//                 type="number"
//                 value={invoiceDetails.tax}
//                 onChange={(e) =>
//                   setInvoiceDetails({
//                     ...invoiceDetails,
//                     tax: Number(e.target.value),
//                   })
//                 }
//                 min="0"
//                 step="0.1"
//               />
//             </div>
//           </div>

//           {/* Items */}
//           <div className="space-y-4">
//             <div className="flex justify-between items-center">
//               <h3 className="text-lg font-semibold">Items</h3>
//               <Button
//                 onClick={addItem}
//                 variant="outline"
//                 size="sm"
//                 className="flex items-center gap-2"
//               >
//                 <Plus size={16} />
//                 Add Item
//               </Button>
//             </div>
//             <div className="space-y-3">
//               <AnimatePresence>
//                 {items.map((item) => (
//                   <motion.div
//                     key={item.id}
//                     initial={{ opacity: 0, height: 0 }}
//                     animate={{ opacity: 1, height: "auto" }}
//                     exit={{ opacity: 0, height: 0 }}
//                     className="grid grid-cols-12 gap-3 items-center p-4 border rounded-lg"
//                   >
//                     <div className="col-span-5">
//                       <Input
//                         placeholder="Item description"
//                         value={item.description}
//                         onChange={(e) =>
//                           updateItem(item.id, "description", e.target.value)
//                         }
//                       />
//                     </div>
//                     <div className="col-span-2">
//                       <Input
//                         type="number"
//                         placeholder="Qty"
//                         value={item.quantity}
//                         onChange={(e) =>
//                           updateItem(
//                             item.id,
//                             "quantity",
//                             Number(e.target.value)
//                           )
//                         }
//                         min="1"
//                       />
//                     </div>
//                     <div className="col-span-2">
//                       <Input
//                         type="number"
//                         placeholder="Price"
//                         value={item.price}
//                         onChange={(e) =>
//                           updateItem(item.id, "price", Number(e.target.value))
//                         }
//                         min="0"
//                         step="0.01"
//                       />
//                     </div>
//                     <div className="col-span-2">
//                       <Input
//                         value={formatCurrency(item.quantity * item.price)}
//                         readOnly
//                         className="bg-gray-50"
//                       />
//                     </div>
//                     <div className="col-span-1 flex justify-end">
//                       {items.length > 1 && (
//                         <Button
//                           variant="outline"
//                           size="icon"
//                           onClick={() => removeItem(item.id)}
//                           className="h-8 w-8"
//                         >
//                           <Trash2 size={14} />
//                         </Button>
//                       )}
//                     </div>
//                   </motion.div>
//                 ))}
//               </AnimatePresence>
//             </div>

//             {/* Totals */}
//             <div className="flex justify-end">
//               <div className="w-80 space-y-2">
//                 <div className="flex justify-between">
//                   <span>Subtotal:</span>
//                   <span>{formatCurrency(subtotal)}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span>Tax ({invoiceDetails.tax}%):</span>
//                   <span>{formatCurrency(taxAmount)}</span>
//                 </div>
//                 <div className="flex justify-between text-lg font-semibold border-t pt-2">
//                   <span>Total:</span>
//                   <span>{formatCurrency(total)}</span>
//                 </div>
//               </div>
//             </div>

//             <div>
//               <Label htmlFor="notes">Notes (Optional)</Label>
//               <Textarea
//                 id="notes"
//                 value={invoiceDetails.notes}
//                 onChange={(e) =>
//                   setInvoiceDetails({
//                     ...invoiceDetails,
//                     notes: e.target.value,
//                   })
//                 }
//                 placeholder="Additional notes or payment terms"
//                 rows={3}
//               />
//             </div>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }
// app/dashboard/invoices/[id]/edit/page.tsx
// app/dashboard/invoices/[id]/edit/page.tsx
"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import InvoiceForm from "@/components/invoice/InvoiceForm";
import { Id } from "@/convex/_generated/dataModel";

export default function InvoiceEditPage() {
  const { id } = useParams();
  const invoice = useQuery(api.invoices.getInvoice, {
    id: id as Id<"invoices">,
  });

  if (invoice === undefined) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (!invoice) {
    return <div>Invoice not found.</div>;
  }

  return (
    <div className="mt-20">
      <InvoiceForm initialData={invoice} />;
    </div>
  );
}
