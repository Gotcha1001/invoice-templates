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

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, Upload, Save, Eye, FileText } from "lucide-react";
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
}

export default function InvoiceCreationForm() {
  const { user } = useUser();
  const router = useRouter();
  const [company, setCompany] = useState<Company>({
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
    {
      id: Date.now().toString(),
      description: "",
      quantity: 1,
      price: 0,
    },
  ]);
  const [invoiceDetails, setInvoiceDetails] = useState({
    invoiceNumber: `INV-${Date.now()}`,
    issueDate: new Date().toISOString().split("T")[0],
    dueDate: "",
    notes: "",
    tax: 0,
    templateId: "" as Id<"templates">,
  });
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>("");
  const [showPreview, setShowPreview] = useState(false);

  // Fetch companies first
  const companies = useQuery(
    api.companies.getCompaniesByUser,
    user ? {} : "skip"
  );

  // Fetch templates only if a company is selected
  const selectedCompany = companies?.find(
    (c: Doc<"companies">) => c.name === company.name
  );
  const templates = useQuery(
    api.templates.getTemplatesByCompany,
    selectedCompany ? { companyId: selectedCompany._id } : "skip"
  );

  const createInvoice = useMutation(api.invoices.createInvoice);

  // Auto-select default template and company
  useEffect(() => {
    if (companies && companies.length > 0 && !company.name) {
      const defaultCompany = companies[0];
      setCompany({
        name: defaultCompany.name,
        address: defaultCompany.address,
        phone: defaultCompany.phone,
        email: defaultCompany.email,
        website: defaultCompany.website || "",
        logoUrl: defaultCompany.logoUrl || "",
      });
      setLogoPreview(defaultCompany.logoUrl || "");
    }
  }, [companies]);

  useEffect(() => {
    if (templates && templates.length > 0 && !invoiceDetails.templateId) {
      const defaultTemplate =
        templates.find((t: Doc<"templates">) => t.isDefault) || templates[0];
      setInvoiceDetails((prev) => ({
        ...prev,
        templateId: defaultTemplate._id,
      }));
    }
  }, [templates, invoiceDetails.templateId]);

  // Calculate totals
  const subtotal = items.reduce(
    (sum, item) => sum + item.quantity * item.price,
    0
  );
  const taxAmount = (subtotal * invoiceDetails.tax) / 100;
  const total = subtotal + taxAmount;

  const addItem = () => {
    const newItem: InvoiceItem = {
      id: Date.now().toString(),
      description: "",
      quantity: 1,
      price: 0,
    };
    setItems([...items, newItem]);
  };

  const removeItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const updateItem = (
    id: string,
    field: keyof Omit<InvoiceItem, "id">,
    value: string | number
  ) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
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

  const uploadToCloudinary = async () => {
    if (!logoFile) return company.logoUrl || "";

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
    if (!company.name || !company.address || !company.email) {
      toast.error("Please fill in all required company details.");
      return false;
    }
    if (!customer.name || !customer.email || !customer.address) {
      toast.error("Please fill in all required customer details.");
      return false;
    }
    if (!invoiceDetails.templateId) {
      toast.error("Please select a template.");
      return false;
    }
    if (!invoiceDetails.dueDate) {
      toast.error("Please set a due date.");
      return false;
    }
    if (
      items.some(
        (item) => !item.description || item.quantity <= 0 || item.price < 0
      )
    ) {
      toast.error("Please fill in all item details correctly.");
      return false;
    }
    return true;
  };

  const saveInvoice = async () => {
    if (!validateForm()) return;

    if (!selectedCompany) {
      toast.error("Please select a valid company.");
      return;
    }

    try {
      const logoUrl = await uploadToCloudinary();
      const companyData = { ...company, logoUrl };
      const invoiceData = {
        invoiceNumber: invoiceDetails.invoiceNumber,
        companyId: selectedCompany._id,
        templateId: invoiceDetails.templateId,
        customer,
        items: items.map((item) => ({
          id: item.id,
          description: item.description,
          quantity: item.quantity,
          price: item.price,
          total: item.quantity * item.price,
        })),
        subtotal,
        tax: taxAmount,
        total,
        status: "draft" as const,
        issueDate: invoiceDetails.issueDate,
        dueDate: invoiceDetails.dueDate,
        notes: invoiceDetails.notes,
        currency: "ZAR",
      };

      const invoiceId = await createInvoice(invoiceData);
      toast.success("Invoice created successfully!");
      router.push(`/dashboard/invoices/${invoiceId}`);
    } catch (error) {
      console.error("Error saving invoice:", error);
      toast.error("Failed to save invoice.");
    }
  };

  if (!user || companies === undefined) {
    return (
      <div className="flex justify-center items-center h-screen">
        <FileText size={48} className="mx-auto text-gray-400 mb-4" />
        <p>Loading...</p>
      </div>
    );
  }

  const selectedTemplate = templates?.find(
    (t: Doc<"templates">) => t._id === invoiceDetails.templateId
  );
  const previewInvoice: Doc<"invoices"> = {
    _id: "preview" as Id<"invoices">,
    _creationTime: Date.now(),
    invoiceNumber: invoiceDetails.invoiceNumber,
    companyId: selectedCompany?._id || ("" as Id<"companies">),
    templateId: invoiceDetails.templateId,
    customer,
    items: items.map((item) => ({
      id: item.id,
      description: item.description,
      quantity: item.quantity,
      price: item.price,
      total: item.quantity * item.price,
    })),
    subtotal,
    tax: taxAmount,
    total,
    status: "draft",
    issueDate: invoiceDetails.issueDate,
    dueDate: invoiceDetails.dueDate,
    notes: invoiceDetails.notes,
    currency: "ZAR",
  };
  const previewCompany: Doc<"companies"> = {
    _id: selectedCompany?._id || ("" as Id<"companies">),
    _creationTime: Date.now(),
    ...company,
    userId: user?.id || "",
    bankingDetails: selectedCompany?.bankingDetails || {
      bankName: "",
      accountNumber: "",
      branchCode: "",
      accountHolder: "",
    },
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8 mt-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center"
      >
        <h1 className="text-3xl font-bold">Create Invoice</h1>
        <div className="flex gap-3">
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={() => setShowPreview(!showPreview)}
          >
            <Eye size={16} />
            {showPreview ? "Hide Preview" : "Show Preview"}
          </Button>
          <Button onClick={saveInvoice} className="flex items-center gap-2">
            <Save size={16} />
            Save Invoice
          </Button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Company Information */}
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
                <Label>Company</Label>
                <Select
                  value={company.name}
                  onValueChange={(value) => {
                    const selectedCompany = companies?.find(
                      (c: Doc<"companies">) => c.name === value
                    );
                    if (selectedCompany) {
                      setCompany({
                        name: selectedCompany.name,
                        address: selectedCompany.address,
                        phone: selectedCompany.phone,
                        email: selectedCompany.email,
                        website: selectedCompany.website || "",
                        logoUrl: selectedCompany.logoUrl || "",
                      });
                      setLogoPreview(selectedCompany.logoUrl || "");
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a company" />
                  </SelectTrigger>
                  <SelectContent>
                    {companies?.map((c: Doc<"companies">) => (
                      <SelectItem key={c._id} value={c.name}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
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
                <Label htmlFor="company-address">Address</Label>
                <Textarea
                  id="company-address"
                  value={company.address}
                  onChange={(e) =>
                    setCompany({ ...company, address: e.target.value })
                  }
                  placeholder="Company Address"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="company-phone">Phone</Label>
                  <Input
                    id="company-phone"
                    value={company.phone}
                    onChange={(e) =>
                      setCompany({ ...company, phone: e.target.value })
                    }
                    placeholder="Phone Number"
                  />
                </div>
                <div>
                  <Label htmlFor="company-email">Email</Label>
                  <Input
                    id="company-email"
                    type="email"
                    value={company.email}
                    onChange={(e) =>
                      setCompany({ ...company, email: e.target.value })
                    }
                    placeholder="email@company.com"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="company-website">Website (Optional)</Label>
                <Input
                  id="company-website"
                  value={company.website}
                  onChange={(e) =>
                    setCompany({ ...company, website: e.target.value })
                  }
                  placeholder="www.company.com"
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Customer Information */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Customer Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="customer-name">Customer Name</Label>
                <Input
                  id="customer-name"
                  value={customer.name}
                  onChange={(e) =>
                    setCustomer({ ...customer, name: e.target.value })
                  }
                  placeholder="Customer Name"
                />
              </div>
              <div>
                <Label htmlFor="customer-email">Email</Label>
                <Input
                  id="customer-email"
                  type="email"
                  value={customer.email}
                  onChange={(e) =>
                    setCustomer({ ...customer, email: e.target.value })
                  }
                  placeholder="customer@email.com"
                />
              </div>
              <div>
                <Label htmlFor="customer-address">Address</Label>
                <Textarea
                  id="customer-address"
                  value={customer.address}
                  onChange={(e) =>
                    setCustomer({ ...customer, address: e.target.value })
                  }
                  placeholder="Customer Address"
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="customer-phone">Phone</Label>
                <Input
                  id="customer-phone"
                  value={customer.phone}
                  onChange={(e) =>
                    setCustomer({ ...customer, phone: e.target.value })
                  }
                  placeholder="Phone Number"
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Invoice Details */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Invoice Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div>
                <Label htmlFor="invoice-number">Invoice Number</Label>
                <Input
                  id="invoice-number"
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
                <Label htmlFor="issue-date">Issue Date</Label>
                <Input
                  id="issue-date"
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
                <Label htmlFor="due-date">Due Date</Label>
                <Input
                  id="due-date"
                  type="date"
                  value={invoiceDetails.dueDate}
                  onChange={(e) =>
                    setInvoiceDetails({
                      ...invoiceDetails,
                      dueDate: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <Label htmlFor="tax">Tax Rate (%)</Label>
                <Input
                  id="tax"
                  type="number"
                  value={invoiceDetails.tax}
                  onChange={(e) =>
                    setInvoiceDetails({
                      ...invoiceDetails,
                      tax: Number(e.target.value),
                    })
                  }
                  min="0"
                  step="0.1"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="template">Template</Label>
              <Select
                value={invoiceDetails.templateId}
                onValueChange={(value) =>
                  setInvoiceDetails({
                    ...invoiceDetails,
                    templateId: value as Id<"templates">,
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a template" />
                </SelectTrigger>
                <SelectContent>
                  {templates?.map((t: Doc<"templates">) => (
                    <SelectItem key={t._id} value={t._id}>
                      {t.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Items */}
            <div className="space-y-4 mt-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Items</h3>
                <Button
                  onClick={addItem}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <Plus size={16} />
                  Add Item
                </Button>
              </div>

              <div className="space-y-3">
                <AnimatePresence>
                  {items.map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="grid grid-cols-12 gap-3 items-center p-4 border rounded-lg"
                    >
                      <div className="col-span-5">
                        <Input
                          placeholder="Item description"
                          value={item.description}
                          onChange={(e) =>
                            updateItem(item.id, "description", e.target.value)
                          }
                        />
                      </div>
                      <div className="col-span-2">
                        <Input
                          type="number"
                          placeholder="Qty"
                          value={item.quantity}
                          onChange={(e) =>
                            updateItem(
                              item.id,
                              "quantity",
                              Number(e.target.value)
                            )
                          }
                          min="1"
                        />
                      </div>
                      <div className="col-span-2">
                        <Input
                          type="number"
                          placeholder="Price"
                          value={item.price}
                          onChange={(e) =>
                            updateItem(item.id, "price", Number(e.target.value))
                          }
                          min="0"
                          step="0.01"
                        />
                      </div>
                      <div className="col-span-2">
                        <Input
                          value={formatCurrency(item.quantity * item.price)}
                          readOnly
                          className="bg-gray-50"
                        />
                      </div>
                      <div className="col-span-1 flex justify-end">
                        {items.length > 1 && (
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => removeItem(item.id)}
                            className="h-8 w-8"
                          >
                            <Trash2 size={14} />
                          </Button>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Totals */}
              <div className="flex justify-end">
                <div className="w-80 space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax ({invoiceDetails.tax}%):</span>
                    <span>{formatCurrency(taxAmount)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-semibold border-t pt-2">
                    <span>Total:</span>
                    <span>{formatCurrency(total)}</span>
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  value={invoiceDetails.notes}
                  onChange={(e) =>
                    setInvoiceDetails({
                      ...invoiceDetails,
                      notes: e.target.value,
                    })
                  }
                  placeholder="Additional notes or payment terms"
                  rows={3}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Preview */}
      {showPreview && selectedTemplate && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Invoice Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <InvoicePreview
                invoice={previewInvoice}
                template={selectedTemplate}
                company={previewCompany}
              />
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
