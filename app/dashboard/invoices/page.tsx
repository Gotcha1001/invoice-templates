"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
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

// Custom hook to fetch templates for multiple company IDs
function useTemplatesByCompanyIds(companyIds: Id<"companies">[]) {
  // Fetch templates for all companyIds in a single query
  const templateResults = useQuery(
    api.templates.getTemplatesByCompanies,
    companyIds.length > 0 ? { companyIds } : "skip"
  );

  // Memoize the mapping of companyIds to templates
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

const getStatusColor = (status: string) => {
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
  const { user } = useUser();
  const router = useRouter();
  const [selectedMonth, setSelectedMonth] = useState(
    new Date().toISOString().slice(0, 7)
  );
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch invoices and companies from Convex
  const invoices = useQuery(api.invoices.getInvoicesByUser, user ? {} : "skip");
  const companies = useQuery(
    api.companies.getCompaniesByUser,
    user ? {} : "skip"
  );

  // Get unique company IDs from invoices
  const companyIds = useMemo(() => {
    if (!invoices) return [];
    return Array.from(new Set(invoices.map((invoice) => invoice.companyId)));
  }, [invoices]);

  // Fetch templates for each unique company ID
  const templatesByCompany = useTemplatesByCompanyIds(companyIds);

  const deleteInvoice = useMutation(api.invoices.deleteInvoice);

  // Filter invoices based on month, status, and search term
  const filteredInvoices = useMemo(() => {
    if (!invoices) return [];
    return invoices.filter((invoice) => {
      const invoiceMonth = invoice.issueDate.slice(0, 7);
      const matchesMonth = invoiceMonth === selectedMonth;
      const matchesStatus =
        statusFilter === "all" || invoice.status === statusFilter;
      const matchesSearch =
        invoice.customer.name
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        invoice.invoiceNumber
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        invoice.customer.email.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesMonth && matchesStatus && matchesSearch;
    });
  }, [invoices, selectedMonth, statusFilter, searchTerm]);

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
    router.push(`/dashboard/invoices/${id}`);
  };

  const handleEditInvoice = (id: string) => {
    router.push(`/dashboard/invoices/${id}/edit`);
  };

  const handleDeleteInvoice = async (id: string) => {
    try {
      await deleteInvoice({ id: id as Id<"invoices"> });
      toast.success("Invoice deleted successfully!");
    } catch (error) {
      console.error("Error deleting invoice:", error);
      toast.error("Failed to delete invoice.");
    }
  };

  const handleDownloadInvoice = async (invoice: Doc<"invoices">) => {
    // Fetch the associated template and company
    const template = templatesByCompany[invoice.companyId]?.[0];
    const company = companies?.find((c) => c._id === invoice.companyId);
    if (!template || !company) {
      toast.error("Template or company not found.");
      return;
    }

    // Create a hidden div to render the InvoicePreview
    const container = document.createElement("div");
    container.style.position = "absolute";
    container.style.left = "-9999px";
    document.body.appendChild(container);

    try {
      const root = createRoot(container);
      root.render(
        <InvoicePreview
          invoice={invoice}
          template={template}
          company={company}
        />
      );

      // Wait for rendering to complete
      await new Promise((resolve) => setTimeout(resolve, 500));

      const element = container.querySelector("#invoice-preview");
      if (!(element instanceof HTMLElement)) {
        throw new Error(
          "Invoice preview element not found or not an HTMLElement."
        );
      }

      const canvas = await html2canvas(element, { scale: 2 });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });
      const imgWidth = 210; // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
      pdf.save(`invoice-${invoice.invoiceNumber}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Failed to generate PDF.");
    } finally {
      const root = createRoot(container); // Re-create root to ensure cleanup
      root.unmount();
      document.body.removeChild(container);
    }
  };

  const handleCreateInvoice = () => {
    router.push("/dashboard/invoices/create");
  };

  if (!user || invoices === undefined || companies === undefined) {
    return (
      <div className="flex justify-center items-center h-screen">
        <FileText size={48} className="mx-auto text-gray-400 mb-4" />
        <p>Loading invoices...</p>
      </div>
    );
  }

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
        <Button
          className="flex items-center gap-2"
          onClick={handleCreateInvoice}
        >
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
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(monthlyStats.totalRevenue)}
              </div>
              <p className="text-xs text-muted-foreground">
                Avg: {formatCurrency(monthlyStats.avgInvoiceValue)} per invoice
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
                {formatCurrency(monthlyStats.paidRevenue)}
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
                {formatCurrency(monthlyStats.overdueAmount)}
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
                      key={invoice._id}
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
                            {invoice.customer.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {invoice.customer.email}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">
                        {formatCurrency(invoice.total)}
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
                        {invoice.items.length} item
                        {invoice.items.length !== 1 ? "s" : ""}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleViewInvoice(invoice._id)}
                            className="h-8 w-8"
                          >
                            <Eye size={14} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditInvoice(invoice._id)}
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
                            onClick={() => handleDeleteInvoice(invoice._id)}
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
                      : `No invoices for ${new Date(
                          selectedMonth
                        ).toLocaleDateString("en-US", {
                          month: "long",
                          year: "numeric",
                        })}`}
                  </p>
                  <Button onClick={handleCreateInvoice}>
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
