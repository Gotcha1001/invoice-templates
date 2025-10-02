"use client";
import { jsPDF } from "jspdf";

import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  DollarSign,
  FileText,
  TrendingUp,
  Filter,
  Search,
  Eye,
  Edit,
  Trash2,
  Download,
  Plus,
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
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Invoice {
  id: string;
  invoiceNumber: string;
  customerName: string;
  customerEmail: string;
  total: number;
  status: "draft" | "sent" | "paid" | "overdue";
  issueDate: string;
  dueDate: string;
  items: number; // number of items
}

// Mock data - Replace with Convex query
const mockInvoices: Invoice[] = [
  {
    id: "1",
    invoiceNumber: "INV-2024-001",
    customerName: "John Doe",
    customerEmail: "john@example.com",
    total: 1250.0,
    status: "paid",
    issueDate: "2024-01-15",
    dueDate: "2024-02-15",
    items: 3,
  },
  {
    id: "2",
    invoiceNumber: "INV-2024-002",
    customerName: "Jane Smith",
    customerEmail: "jane@company.com",
    total: 850.5,
    status: "sent",
    issueDate: "2024-01-20",
    dueDate: "2024-02-20",
    items: 2,
  },
  {
    id: "3",
    invoiceNumber: "INV-2024-003",
    customerName: "Acme Corp",
    customerEmail: "billing@acme.com",
    total: 2100.75,
    status: "overdue",
    issueDate: "2024-01-10",
    dueDate: "2024-02-10",
    items: 5,
  },
  {
    id: "4",
    invoiceNumber: "INV-2024-004",
    customerName: "Tech Solutions",
    customerEmail: "accounts@tech.com",
    total: 675.25,
    status: "draft",
    issueDate: "2024-01-25",
    dueDate: "2024-02-25",
    items: 1,
  },
  {
    id: "5",
    invoiceNumber: "INV-2024-005",
    customerName: "Design Studio",
    customerEmail: "hello@design.com",
    total: 1450.0,
    status: "sent",
    issueDate: "2024-01-28",
    dueDate: "2024-02-28",
    items: 4,
  },
];

const getStatusColor = (status: Invoice["status"]) => {
  switch (status) {
    case "paid":
      return "bg-green-100 text-green-800 hover:bg-green-200";
    case "sent":
      return "bg-blue-100 text-blue-800 hover:bg-blue-200";
    case "overdue":
      return "bg-red-100 text-red-800 hover:bg-red-200";
    case "draft":
      return "bg-gray-100 text-gray-800 hover:bg-gray-200";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export default function MonthlyInvoicesDashboard() {
  const [selectedMonth, setSelectedMonth] = useState(
    new Date().toISOString().slice(0, 7)
  );
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Filter invoices based on month, status, and search term
  const filteredInvoices = useMemo(() => {
    return mockInvoices.filter((invoice) => {
      const invoiceMonth = invoice.issueDate.slice(0, 7);
      const matchesMonth = invoiceMonth === selectedMonth;
      const matchesStatus =
        statusFilter === "all" || invoice.status === statusFilter;
      const matchesSearch =
        invoice.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.invoiceNumber
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        invoice.customerEmail.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesMonth && matchesStatus && matchesSearch;
    });
  }, [selectedMonth, statusFilter, searchTerm]);

  // Calculate monthly statistics
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

  const handleViewInvoice = (id: string) => {
    // Navigate to invoice detail page
    console.log("View invoice:", id);
  };

  const handleEditInvoice = (id: string) => {
    // Navigate to edit invoice page
    console.log("Edit invoice:", id);
  };

  const handleDeleteInvoice = (id: string) => {
    // Delete invoice logic
    console.log("Delete invoice:", id);
  };

  const handleDownloadInvoice = (invoice: Invoice) => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Invoice", 20, 20);
    doc.setFontSize(12);
    doc.text(`Invoice #: ${invoice.invoiceNumber}`, 20, 30);
    doc.text(`Customer: ${invoice.customerName}`, 20, 40);
    doc.text(`Total: $${invoice.total.toFixed(2)}`, 20, 50);
    doc.save(`invoice-${invoice.invoiceNumber}.pdf`);
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8 mt-20">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center"
      >
        <div>
          <h1 className="text-3xl font-bold">Invoice Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Manage and track your monthly invoices
          </p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus size={16} />
          Create Invoice
        </Button>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-wrap gap-4 items-center p-4 bg-white rounded-lg border"
      >
        <div className="flex items-center gap-2">
          <Calendar size={16} />
          <span className="text-sm font-medium">Month:</span>
          <Input
            type="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="w-40"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter size={16} />
          <span className="text-sm font-medium">Status:</span>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="sent">Sent</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="overdue">Overdue</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2 flex-1 max-w-md">
          <Search size={16} />
          <Input
            placeholder="Search invoices..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </motion.div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Invoices
              </CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {monthlyStats.totalInvoices}
              </div>
              <p className="text-xs text-muted-foreground">
                For{" "}
                {new Date(selectedMonth).toLocaleDateString("en-US", {
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Revenue
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${monthlyStats.totalRevenue.toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground">
                Avg: ${monthlyStats.avgInvoiceValue.toFixed(2)} per invoice
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Paid Revenue
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                ${monthlyStats.paidRevenue.toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground">
                {monthlyStats.totalRevenue > 0
                  ? (
                      (monthlyStats.paidRevenue / monthlyStats.totalRevenue) *
                      100
                    ).toFixed(1)
                  : 0}
                % of total revenue
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Overdue Amount
              </CardTitle>
              <FileText className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                ${monthlyStats.overdueAmount.toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground">
                {monthlyStats.overdueCount} overdue invoice
                {monthlyStats.overdueCount !== 1 ? "s" : ""}
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Invoices Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Invoices ({filteredInvoices.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice #</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Issue Date</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInvoices.map((invoice, index) => (
                    <motion.tr
                      key={invoice.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * index }}
                      className="hover:bg-gray-50"
                    >
                      <TableCell className="font-medium">
                        {invoice.invoiceNumber}
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">
                            {invoice.customerName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {invoice.customerEmail}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">
                        ${invoice.total.toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(invoice.status)}>
                          {invoice.status.charAt(0).toUpperCase() +
                            invoice.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(invoice.issueDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <span
                          className={
                            invoice.status === "overdue"
                              ? "text-red-600 font-medium"
                              : ""
                          }
                        >
                          {new Date(invoice.dueDate).toLocaleDateString()}
                        </span>
                      </TableCell>
                      <TableCell>
                        {invoice.items} item{invoice.items !== 1 ? "s" : ""}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleViewInvoice(invoice.id)}
                            className="h-8 w-8"
                          >
                            <Eye size={14} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditInvoice(invoice.id)}
                            className="h-8 w-8"
                          >
                            <Edit size={14} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDownloadInvoice(invoice)}
                            className="h-8 w-8"
                          >
                            <Download size={14} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteInvoice(invoice.id)}
                            className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 size={14} />
                          </Button>
                        </div>
                      </TableCell>
                    </motion.tr>
                  ))}
                </TableBody>
              </Table>

              {filteredInvoices.length === 0 && (
                <div className="text-center py-12">
                  <FileText size={48} className="mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No invoices found
                  </h3>
                  <p className="text-gray-500 mb-4">
                    {searchTerm || statusFilter !== "all"
                      ? "Try adjusting your filters or search terms"
                      : `No invoices for ${new Date(selectedMonth).toLocaleDateString("en-US", { month: "long", year: "numeric" })}`}
                  </p>
                  <Button>
                    <Plus size={16} className="mr-2" />
                    Create Your First Invoice
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
