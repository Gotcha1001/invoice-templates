// "use client";

// import { useState, useEffect } from "react";
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
// import { useUser } from "@clerk/nextjs";
// import { useMutation, useQuery } from "convex/react";
// import { api } from "@/convex/_generated/api";
// import { toast } from "sonner";
// import { useRouter } from "next/navigation";

// import { InvoiceItem, Customer, Company, Invoice } from "@/types/invoice";
// import { Id } from "@/convex/_generated/dataModel";

// export default function CreateInvoice() {
//   const { user } = useUser();
//   const router = useRouter();
//   const company = useQuery(api.companies.getCompanyByUser, {
//     userId: user?.id || "",
//   });
//   const templates = useQuery(api.templates.getTemplates);
//   const createInvoice = useMutation(api.invoices.createInvoice);

//   const [formCompany, setFormCompany] = useState<Company>({
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
//     templateId: "",
//   });
//   const [logoFile, setLogoFile] = useState<File | null>(null);
//   const [logoPreview, setLogoPreview] = useState<string>("");

//   useEffect(() => {
//     if (company) {
//       setFormCompany(company);
//     }
//     if (templates && templates.length > 0) {
//       const defaultTemplate =
//         templates.find((t) => t.isDefault) || templates[0];
//       setInvoiceDetails((prev) => ({
//         ...prev,
//         templateId: defaultTemplate._id,
//       }));
//     }
//   }, [company, templates]);

//   const subtotal = items.reduce((sum, item) => sum + item.total, 0);
//   const taxAmount = (subtotal * invoiceDetails.tax) / 100;
//   const total = subtotal + taxAmount;

//   useEffect(() => {
//     setItems((prevItems) =>
//       prevItems.map((item) => ({
//         ...item,
//         total: item.quantity * item.price,
//       }))
//     );
//   }, [items]);

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
//     if (!logoFile) return formCompany.logoUrl || "";
//     try {
//       const { secure_url } = await uploadImage(logoFile);
//       return secure_url;
//     } catch (error) {
//       console.error("Error uploading logo:", error);
//       return "";
//     }
//   };

//   const saveInvoice = async () => {
//     if (!company) return;
//     const logoUrl = await uploadToCloudinary();
//     const invoiceData = {
//       invoiceNumber: invoiceDetails.invoiceNumber,
//       customer,
//       items,
//       subtotal,
//       tax: taxAmount,
//       total,
//       dueDate: invoiceDetails.dueDate,
//       issueDate: invoiceDetails.issueDate,
//       status: "draft" as const,
//       templateId: invoiceDetails.templateId as Id<"templates">,
//       notes: invoiceDetails.notes,
//     };
//     try {
//       await createInvoice(invoiceData);
//       toast.success("Invoice created successfully!");
//       router.push("/dashboard/invoices");
//     } catch (error) {
//       console.error("Failed to create invoice:", error);
//       toast.error("Failed to create invoice. Please try again.");
//     }
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
//                 <Label>Company Name</Label>
//                 <Input
//                   value={formCompany.name}
//                   onChange={(e) =>
//                     setFormCompany({ ...formCompany, name: e.target.value })
//                   }
//                 />
//               </div>
//               <div>
//                 <Label>Address</Label>
//                 <Input
//                   value={formCompany.address}
//                   onChange={(e) =>
//                     setFormCompany({ ...formCompany, address: e.target.value })
//                   }
//                 />
//               </div>
//               <div>
//                 <Label>Phone</Label>
//                 <Input
//                   value={formCompany.phone}
//                   onChange={(e) =>
//                     setFormCompany({ ...formCompany, phone: e.target.value })
//                   }
//                 />
//               </div>
//               <div>
//                 <Label>Email</Label>
//                 <Input
//                   value={formCompany.email}
//                   onChange={(e) =>
//                     setFormCompany({ ...formCompany, email: e.target.value })
//                   }
//                 />
//               </div>
//               <div>
//                 <Label>Website</Label>
//                 <Input
//                   value={formCompany.website}
//                   onChange={(e) =>
//                     setFormCompany({ ...formCompany, website: e.target.value })
//                   }
//                 />
//               </div>
//             </CardContent>
//           </Card>
//         </motion.div>
//         <motion.div
//           initial={{ opacity: 0, x: 20 }}
//           animate={{ opacity: 1, x: 0 }}
//           transition={{ delay: 0.1 }}
//         >
//           <Card>
//             <CardHeader>
//               <CardTitle>Customer Information</CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-4">
//               <div>
//                 <Label>Name</Label>
//                 <Input
//                   value={customer.name}
//                   onChange={(e) =>
//                     setCustomer({ ...customer, name: e.target.value })
//                   }
//                 />
//               </div>
//               <div>
//                 <Label>Email</Label>
//                 <Input
//                   value={customer.email}
//                   onChange={(e) =>
//                     setCustomer({ ...customer, email: e.target.value })
//                   }
//                 />
//               </div>
//               <div>
//                 <Label>Address</Label>
//                 <Input
//                   value={customer.address}
//                   onChange={(e) =>
//                     setCustomer({ ...customer, address: e.target.value })
//                   }
//                 />
//               </div>
//               <div>
//                 <Label>Phone</Label>
//                 <Input
//                   value={customer.phone}
//                   onChange={(e) =>
//                     setCustomer({ ...customer, phone: e.target.value })
//                   }
//                 />
//               </div>
//             </CardContent>
//           </Card>
//         </motion.div>
//       </div>
//       <Card>
//         <CardHeader>
//           <CardTitle>Invoice Items</CardTitle>
//         </CardHeader>
//         <CardContent>
//           {items.map((item) => (
//             <motion.div
//               key={item.id}
//               className="flex space-x-4 mb-4"
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//             >
//               <div className="flex-1">
//                 <Label>Description</Label>
//                 <Input
//                   value={item.description}
//                   onChange={(e) =>
//                     updateItem(item.id, "description", e.target.value)
//                   }
//                 />
//               </div>
//               <div className="w-24">
//                 <Label>Quantity</Label>
//                 <Input
//                   type="number"
//                   value={item.quantity}
//                   onChange={(e) =>
//                     updateItem(item.id, "quantity", parseInt(e.target.value))
//                   }
//                 />
//               </div>
//               <div className="w-32">
//                 <Label>Price</Label>
//                 <Input
//                   type="number"
//                   value={item.price}
//                   onChange={(e) =>
//                     updateItem(item.id, "price", parseFloat(e.target.value))
//                   }
//                 />
//               </div>
//               <div className="w-32">
//                 <Label>Total</Label>
//                 <Input value={item.total.toFixed(2)} disabled />
//               </div>
//               <Button
//                 variant="destructive"
//                 onClick={() => removeItem(item.id)}
//                 className="mt-6"
//               >
//                 <Trash2 size={16} />
//               </Button>
//             </motion.div>
//           ))}
//           <Button onClick={addItem} className="flex items-center gap-2">
//             <Plus size={16} />
//             Add Item
//           </Button>
//         </CardContent>
//       </Card>
//       <Card>
//         <CardHeader>
//           <CardTitle>Invoice Details</CardTitle>
//         </CardHeader>
//         <CardContent className="space-y-4">
//           <div className="grid grid-cols-2 gap-4">
//             <div>
//               <Label>Invoice Number</Label>
//               <Input
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
//               <Label>Issue Date</Label>
//               <Input
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
//               <Label>Due Date</Label>
//               <Input
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
//               <Label>Tax (%)</Label>
//               <Input
//                 type="number"
//                 value={invoiceDetails.tax}
//                 onChange={(e) =>
//                   setInvoiceDetails({
//                     ...invoiceDetails,
//                     tax: parseFloat(e.target.value),
//                   })
//                 }
//               />
//             </div>
//           </div>
//           <div>
//             <Label>Template</Label>
//             <Select
//               value={invoiceDetails.templateId}
//               onValueChange={(value) =>
//                 setInvoiceDetails({ ...invoiceDetails, templateId: value })
//               }
//             >
//               <SelectTrigger>
//                 <SelectValue placeholder="Select template" />
//               </SelectTrigger>
//               <SelectContent>
//                 {templates?.map((t) => (
//                   <SelectItem key={t._id} value={t._id}>
//                     {t.name}
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//           </div>
//           <div>
//             <Label>Notes</Label>
//             <Textarea
//               value={invoiceDetails.notes}
//               onChange={(e) =>
//                 setInvoiceDetails({ ...invoiceDetails, notes: e.target.value })
//               }
//             />
//           </div>
//           <div className="flex justify-end space-x-4">
//             <div>Subtotal: ${subtotal.toFixed(2)}</div>
//             <div>Tax: ${taxAmount.toFixed(2)}</div>
//             <div>Total: ${total.toFixed(2)}</div>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }

"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, Upload, Save, Eye } from "lucide-react";
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
import { useUser } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { InvoiceItem, Customer, Company } from "@/types/invoice";
import { Id } from "@/convex/_generated/dataModel";

export default function CreateInvoice() {
  const { user } = useUser();
  const router = useRouter();
  const company = useQuery(api.companies.getCompanyByUser, {
    userId: user?.id || "",
  });
  const templates = useQuery(
    api.templates.getTemplates,
    company ? { companyId: company._id } : "skip"
  );
  const createInvoice = useMutation(api.invoices.createInvoice);

  const [formCompany, setFormCompany] = useState<Company>({
    name: "",
    address: "",
    phone: "",
    email: "",
    website: "",
    logoUrl: "",
  });
  const [customer, setCustomer] = useState<Customer>({
    name: "",
    email: "",
    address: "",
    phone: "",
  });
  const [items, setItems] = useState<InvoiceItem[]>([
    { id: "1", description: "", quantity: 1, price: 0, total: 0 },
  ]);
  const [invoiceDetails, setInvoiceDetails] = useState({
    invoiceNumber: `INV-${Date.now()}`,
    issueDate: new Date().toISOString().split("T")[0],
    dueDate: "",
    notes: "",
    tax: 0,
    templateId: "",
  });
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>("");

  useEffect(() => {
    if (company) {
      setFormCompany(company);
      setLogoPreview(company.logoUrl || "");
    }
    if (templates && templates.length > 0) {
      const defaultTemplate =
        templates.find((t) => t.isDefault) || templates[0];
      setInvoiceDetails((prev) => ({
        ...prev,
        templateId: defaultTemplate._id,
      }));
    }
  }, [company, templates]);

  const subtotal = items.reduce((sum, item) => sum + item.total, 0);
  const taxAmount = (subtotal * invoiceDetails.tax) / 100;
  const total = subtotal + taxAmount;

  useEffect(() => {
    setItems((prevItems) =>
      prevItems.map((item) => ({
        ...item,
        total: item.quantity * item.price,
      }))
    );
  }, []);

  const addItem = () => {
    const newItem: InvoiceItem = {
      id: Date.now().toString(),
      description: "",
      quantity: 1,
      price: 0,
      total: 0,
    };
    setItems([...items, newItem]);
  };

  const removeItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const updateItem = (
    id: string,
    field: keyof InvoiceItem,
    value: string | number
  ) => {
    setItems((prevItems) =>
      prevItems.map((item) => {
        if (item.id === id) {
          const updatedItem = { ...item, [field]: value };
          if (field === "quantity" || field === "price") {
            updatedItem.total = updatedItem.quantity * updatedItem.price;
          }
          return updatedItem;
        }
        return item;
      })
    );
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // ✅ FIXED: Use the API route directly instead of non-existent uploadImage function
  const uploadToCloudinary = async () => {
    if (!logoFile) return formCompany.logoUrl || "";

    const formData = new FormData();
    formData.append("file", logoFile);

    try {
      const response = await fetch("/api/upload-logo", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const data = await response.json();
      return data.secure_url;
    } catch (error) {
      console.error("Error uploading logo:", error);
      toast.error("Failed to upload logo");
      return formCompany.logoUrl || "";
    }
  };

  const saveInvoice = async () => {
    if (!company) {
      toast.error("Please set up your company first");
      return;
    }

    // Validate required fields
    if (!customer.name || !customer.email) {
      toast.error("Please fill in customer details");
      return;
    }

    if (!invoiceDetails.dueDate) {
      toast.error("Please set a due date");
      return;
    }

    if (!invoiceDetails.templateId) {
      toast.error("Please select a template");
      return;
    }

    const logoUrl = await uploadToCloudinary();

    const invoiceData = {
      invoiceNumber: invoiceDetails.invoiceNumber,
      customer,
      items,
      subtotal,
      tax: taxAmount,
      total,
      dueDate: invoiceDetails.dueDate,
      issueDate: invoiceDetails.issueDate,
      status: "draft" as const,
      templateId: invoiceDetails.templateId as Id<"templates">,
      notes: invoiceDetails.notes,
    };

    try {
      await createInvoice(invoiceData);
      toast.success("Invoice created successfully!");
      router.push("/dashboard/invoices");
    } catch (error) {
      console.error("Failed to create invoice:", error);
      toast.error("Failed to create invoice. Please try again.");
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center"
      >
        <h1 className="text-3xl font-bold">Create Invoice</h1>
        <div className="flex gap-3">
          <Button variant="outline" className="flex items-center gap-2">
            <Eye size={16} />
            Preview
          </Button>
          <Button onClick={saveInvoice} className="flex items-center gap-2">
            <Save size={16} />
            Save Invoice
          </Button>
        </div>
      </motion.div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Company Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Company Logo</Label>
                <div className="mt-2">
                  <div className="flex items-center gap-4">
                    <Button
                      variant="outline"
                      className="flex items-center gap-2"
                      onClick={() =>
                        document.getElementById("logo-upload")?.click()
                      }
                    >
                      <Upload size={16} />
                      Upload Logo
                    </Button>
                    <input
                      id="logo-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="hidden"
                    />
                    {logoPreview && (
                      <img
                        src={logoPreview}
                        alt="Logo preview"
                        className="h-12 w-12 object-contain"
                      />
                    )}
                  </div>
                </div>
              </div>
              <div>
                <Label>Company Name</Label>
                <Input
                  value={formCompany.name}
                  onChange={(e) =>
                    setFormCompany({ ...formCompany, name: e.target.value })
                  }
                />
              </div>
              <div>
                <Label>Address</Label>
                <Textarea
                  value={formCompany.address}
                  onChange={(e) =>
                    setFormCompany({ ...formCompany, address: e.target.value })
                  }
                  rows={3}
                />
              </div>
              <div>
                <Label>Phone</Label>
                <Input
                  value={formCompany.phone}
                  onChange={(e) =>
                    setFormCompany({ ...formCompany, phone: e.target.value })
                  }
                />
              </div>
              <div>
                <Label>Email</Label>
                <Input
                  value={formCompany.email}
                  onChange={(e) =>
                    setFormCompany({ ...formCompany, email: e.target.value })
                  }
                />
              </div>
              <div>
                <Label>Website</Label>
                <Input
                  value={formCompany.website}
                  onChange={(e) =>
                    setFormCompany({ ...formCompany, website: e.target.value })
                  }
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Customer Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Name *</Label>
                <Input
                  value={customer.name}
                  onChange={(e) =>
                    setCustomer({ ...customer, name: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <Label>Email *</Label>
                <Input
                  type="email"
                  value={customer.email}
                  onChange={(e) =>
                    setCustomer({ ...customer, email: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <Label>Address</Label>
                <Textarea
                  value={customer.address}
                  onChange={(e) =>
                    setCustomer({ ...customer, address: e.target.value })
                  }
                  rows={3}
                />
              </div>
              <div>
                <Label>Phone</Label>
                <Input
                  value={customer.phone}
                  onChange={(e) =>
                    setCustomer({ ...customer, phone: e.target.value })
                  }
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Invoice Items</CardTitle>
        </CardHeader>
        <CardContent>
          {items.map((item) => (
            <motion.div
              key={item.id}
              className="flex space-x-4 mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="flex-1">
                <Label>Description</Label>
                <Input
                  value={item.description}
                  onChange={(e) =>
                    updateItem(item.id, "description", e.target.value)
                  }
                />
              </div>
              <div className="w-24">
                <Label>Quantity</Label>
                <Input
                  type="number"
                  value={item.quantity}
                  onChange={(e) =>
                    updateItem(
                      item.id,
                      "quantity",
                      parseInt(e.target.value) || 0
                    )
                  }
                  min="1"
                />
              </div>
              <div className="w-32">
                <Label>Price</Label>
                <Input
                  type="number"
                  value={item.price}
                  onChange={(e) =>
                    updateItem(
                      item.id,
                      "price",
                      parseFloat(e.target.value) || 0
                    )
                  }
                  min="0"
                  step="0.01"
                />
              </div>
              <div className="w-32">
                <Label>Total</Label>
                <Input value={item.total.toFixed(2)} disabled />
              </div>
              <Button
                variant="destructive"
                onClick={() => removeItem(item.id)}
                className="mt-6"
                disabled={items.length === 1}
              >
                <Trash2 size={16} />
              </Button>
            </motion.div>
          ))}
          <Button onClick={addItem} className="flex items-center gap-2">
            <Plus size={16} />
            Add Item
          </Button>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Invoice Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Invoice Number</Label>
              <Input
                value={invoiceDetails.invoiceNumber}
                onChange={(e) =>
                  setInvoiceDetails({
                    ...invoiceDetails,
                    invoiceNumber: e.target.value,
                  })
                }
              />
            </div>
            <div>
              <Label>Issue Date</Label>
              <Input
                type="date"
                value={invoiceDetails.issueDate}
                onChange={(e) =>
                  setInvoiceDetails({
                    ...invoiceDetails,
                    issueDate: e.target.value,
                  })
                }
              />
            </div>
            <div>
              <Label>Due Date *</Label>
              <Input
                type="date"
                value={invoiceDetails.dueDate}
                onChange={(e) =>
                  setInvoiceDetails({
                    ...invoiceDetails,
                    dueDate: e.target.value,
                  })
                }
                required
              />
            </div>
            <div>
              <Label>Tax (%)</Label>
              <Input
                type="number"
                value={invoiceDetails.tax}
                onChange={(e) =>
                  setInvoiceDetails({
                    ...invoiceDetails,
                    tax: parseFloat(e.target.value) || 0,
                  })
                }
                min="0"
                step="0.1"
              />
            </div>
          </div>
          <div>
            <Label>Template *</Label>
            <Select
              value={invoiceDetails.templateId}
              onValueChange={(value) =>
                setInvoiceDetails({ ...invoiceDetails, templateId: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select template" />
              </SelectTrigger>
              <SelectContent>
                {templates?.map((t) => (
                  <SelectItem key={t._id} value={t._id}>
                    {t.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Notes</Label>
            <Textarea
              value={invoiceDetails.notes}
              onChange={(e) =>
                setInvoiceDetails({ ...invoiceDetails, notes: e.target.value })
              }
              rows={3}
            />
          </div>
          <div className="flex justify-end space-x-4 text-lg">
            <div>Subtotal: ${subtotal.toFixed(2)}</div>
            <div>Tax: ${taxAmount.toFixed(2)}</div>
            <div className="font-bold">Total: ${total.toFixed(2)}</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
