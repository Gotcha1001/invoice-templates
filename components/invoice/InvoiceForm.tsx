"use client";

import React, { useState, useEffect } from "react";
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

interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  price: number;
  total: number;
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
    { id: "1", description: "", quantity: 1, price: 0, total: 0 },
  ]);

  const [invoiceDetails, setInvoiceDetails] = useState({
    invoiceNumber: `INV-${Date.now()}`,
    issueDate: new Date().toISOString().split("T")[0],
    dueDate: "",
    notes: "",
    tax: 0,
  });

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>("");

  // Calculate totals
  const subtotal = items.reduce((sum, item) => sum + item.total, 0);
  const taxAmount = (subtotal * invoiceDetails.tax) / 100;
  const total = subtotal + taxAmount;

  // Update item total when quantity or price changes
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

  const uploadToCloudinary = async () => {
    if (!logoFile) return "";

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
      return "";
    }
  };

  const saveInvoice = async () => {
    let logoUrl = company.logoUrl;

    if (logoFile) {
      logoUrl = await uploadToCloudinary();
    }

    const invoiceData = {
      ...invoiceDetails,
      company: { ...company, logoUrl },
      customer,
      items,
      subtotal,
      tax: taxAmount,
      total,
      status: "draft" as const,
    };

    // Here you would save to Convex
    console.log("Saving invoice:", invoiceData);
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
                <Label htmlFor="company-name">Company Name</Label>
                <Input
                  id="company-name"
                  value={company.name}
                  onChange={(e) =>
                    setCompany({ ...company, name: e.target.value })
                  }
                  placeholder="Your Company Name"
                />
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

            {/* Items */}
            <div className="space-y-4">
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
                  {items.map((item, index) => (
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
                          value={item.total.toFixed(2)}
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
                    <span>R{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax ({invoiceDetails.tax}%):</span>
                    <span>R{taxAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-semibold border-t pt-2">
                    <span>Total:</span>
                    <span>R{total.toFixed(2)}</span>
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
    </div>
  );
}
