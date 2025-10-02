// src/types/invoice.ts
export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  price: number;
  total: number;
}

export interface Customer {
  name: string;
  email: string;
  address: string;
  phone?: string;
}

export interface Company {
  name: string;
  address: string;
  phone: string;
  email: string;
  website?: string;
  logoUrl?: string;
}

export interface Invoice {
  _id: string;
  invoiceNumber: string;
  company: Company;
  customer: Customer;
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  total: number;
  dueDate: string;
  issueDate: string;
  status: "draft" | "sent" | "paid" | "overdue";
  templateId: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}
