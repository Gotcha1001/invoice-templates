// "use client";

// import { useState, useMemo } from "react";
// import { motion } from "framer-motion";
// import {
//   Calendar,
//   FileText,
//   TrendingUp,
//   Filter,
//   Search,
//   Eye,
//   Edit,
//   Trash2,
//   Download,
//   Plus,
// } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Badge } from "@/components/ui/badge";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { useQuery, useMutation } from "convex/react";
// import { api } from "@/convex/_generated/api";
// import { useRouter } from "next/navigation";
// import { useUser } from "@clerk/nextjs";
// import { toast } from "sonner";
// import jsPDF from "jspdf";
// import html2canvas from "html2canvas";
// import InvoicePreview from "@/components/invoice/InvoicePreview";
// import { Id, Doc } from "@/convex/_generated/dataModel";
// import { createRoot } from "react-dom/client";
// import { formatCurrency } from "@/lib/currency";

// // Custom hook to fetch templates for multiple company IDs
// function useTemplatesByCompanyIds(companyIds: Id<"companies">[]) {
//   // Fetch templates for all companyIds in a single query
//   const templateResults = useQuery(
//     api.templates.getTemplatesByCompanies,
//     companyIds.length > 0 ? { companyIds } : "skip"
//   );

//   // Memoize the mapping of companyIds to templates
//   return useMemo(() => {
//     const results: Record<string, Doc<"templates">[]> = {};
//     companyIds.forEach((companyId) => {
//       results[companyId] = [];
//     });
//     if (templateResults) {
//       templateResults.forEach(({ companyId, templates }) => {
//         if (companyIds.includes(companyId)) {
//           results[companyId] = templates;
//         }
//       });
//     }
//     return results;
//   }, [companyIds, templateResults]);
// }

// const getStatusColor = (status: string) => {
//   switch (status) {
//     case "paid":
//       return "bg-green-100 text-green-800 hover:bg-green-200";
//     case "sent":
//       return "bg-blue-100 text-blue-800 hover:bg-blue-200";
//     case "overdue":
//       return "bg-red-100 text-red-800 hover:bg-red-200";
//     case "draft":
//       return "bg-gray-100 text-gray-800 hover:bg-gray-200";
//     default:
//       return "bg-gray-100 text-gray-800";
//   }
// };

// export default function MonthlyInvoicesDashboard() {
//   const { user } = useUser();
//   const router = useRouter();
//   const [selectedMonth, setSelectedMonth] = useState(
//     new Date().toISOString().slice(0, 7)
//   );
//   const [statusFilter, setStatusFilter] = useState<string>("all");
//   const [searchTerm, setSearchTerm] = useState("");

//   // Fetch invoices and companies from Convex
//   const invoices = useQuery(api.invoices.getInvoicesByUser, user ? {} : "skip");
//   const companies = useQuery(
//     api.companies.getCompaniesByUser,
//     user ? {} : "skip"
//   );

//   // Get unique company IDs from invoices
//   const companyIds = useMemo(() => {
//     if (!invoices) return [];
//     return Array.from(new Set(invoices.map((invoice) => invoice.companyId)));
//   }, [invoices]);

//   // Fetch templates for each unique company ID
//   const templatesByCompany = useTemplatesByCompanyIds(companyIds);

//   const deleteInvoice = useMutation(api.invoices.deleteInvoice);

//   // Filter invoices based on month, status, and search term
//   const filteredInvoices = useMemo(() => {
//     if (!invoices) return [];
//     return invoices.filter((invoice) => {
//       const invoiceMonth = invoice.issueDate.slice(0, 7);
//       const matchesMonth = invoiceMonth === selectedMonth;
//       const matchesStatus =
//         statusFilter === "all" || invoice.status === statusFilter;
//       const matchesSearch =
//         invoice.customer.name
//           .toLowerCase()
//           .includes(searchTerm.toLowerCase()) ||
//         invoice.invoiceNumber
//           .toLowerCase()
//           .includes(searchTerm.toLowerCase()) ||
//         invoice.customer.email.toLowerCase().includes(searchTerm.toLowerCase());
//       return matchesMonth && matchesStatus && matchesSearch;
//     });
//   }, [invoices, selectedMonth, statusFilter, searchTerm]);

//   // Calculate monthly statistics
//   const monthlyStats = useMemo(() => {
//     const totalInvoices = filteredInvoices.length;
//     const totalRevenue = filteredInvoices.reduce(
//       (sum, invoice) => sum + invoice.total,
//       0
//     );
//     const paidInvoices = filteredInvoices.filter(
//       (invoice) => invoice.status === "paid"
//     );
//     const paidRevenue = paidInvoices.reduce(
//       (sum, invoice) => sum + invoice.total,
//       0
//     );
//     const overdueInvoices = filteredInvoices.filter(
//       (invoice) => invoice.status === "overdue"
//     );
//     const overdueAmount = overdueInvoices.reduce(
//       (sum, invoice) => sum + invoice.total,
//       0
//     );

//     return {
//       totalInvoices,
//       totalRevenue,
//       paidRevenue,
//       overdueCount: overdueInvoices.length,
//       overdueAmount,
//       avgInvoiceValue: totalInvoices > 0 ? totalRevenue / totalInvoices : 0,
//     };
//   }, [filteredInvoices]);

//   const handleViewInvoice = (id: string) => {
//     router.push(`/dashboard/invoices/${id}`);
//   };

//   const handleEditInvoice = (id: string) => {
//     router.push(`/dashboard/invoices/${id}/edit`);
//   };

//   const handleDeleteInvoice = async (id: string) => {
//     try {
//       await deleteInvoice({ id: id as Id<"invoices"> });
//       toast.success("Invoice deleted successfully!");
//     } catch (error) {
//       console.error("Error deleting invoice:", error);
//       toast.error("Failed to delete invoice.");
//     }
//   };

//   const handleDownloadInvoice = async (invoice: Doc<"invoices">) => {
//     // Fetch the associated template and company
//     const template = templatesByCompany[invoice.companyId]?.[0];
//     const company = companies?.find((c) => c._id === invoice.companyId);
//     if (!template || !company) {
//       toast.error("Template or company not found.");
//       return;
//     }

//     // Create a hidden div to render the InvoicePreview
//     const container = document.createElement("div");
//     container.style.position = "absolute";
//     container.style.left = "-9999px";
//     document.body.appendChild(container);

//     try {
//       const root = createRoot(container);
//       root.render(
//         <InvoicePreview
//           invoice={invoice}
//           template={template}
//           company={company}
//         />
//       );

//       // Wait for rendering to complete
//       await new Promise((resolve) => setTimeout(resolve, 500));

//       const element = container.querySelector("#invoice-preview");
//       if (!(element instanceof HTMLElement)) {
//         throw new Error(
//           "Invoice preview element not found or not an HTMLElement."
//         );
//       }

//       const canvas = await html2canvas(element, { scale: 2 });
//       const imgData = canvas.toDataURL("image/png");
//       const pdf = new jsPDF({
//         orientation: "portrait",
//         unit: "mm",
//         format: "a4",
//       });
//       const imgWidth = 210; // A4 width in mm
//       const imgHeight = (canvas.height * imgWidth) / canvas.width;
//       pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
//       pdf.save(`invoice-${invoice.invoiceNumber}.pdf`);
//     } catch (error) {
//       console.error("Error generating PDF:", error);
//       toast.error("Failed to generate PDF.");
//     } finally {
//       const root = createRoot(container); // Re-create root to ensure cleanup
//       root.unmount();
//       document.body.removeChild(container);
//     }
//   };

//   const handleCreateInvoice = () => {
//     router.push("/dashboard/invoices/create");
//   };

//   if (!user || invoices === undefined || companies === undefined) {
//     return (
//       <div className="flex justify-center items-center h-screen">
//         <FileText size={48} className="mx-auto text-gray-400 mb-4" />
//         <p>Loading invoices...</p>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-7xl mx-auto p-6 space-y-8 mt-20">
//       {/* Header */}
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         className="flex justify-between items-center"
//       >
//         <div>
//           <h1 className="text-3xl font-bold">Invoice Dashboard</h1>
//           <p className="text-gray-600 mt-1">
//             Manage and track your monthly invoices
//           </p>
//         </div>
//         <Button
//           className="flex items-center gap-2"
//           onClick={handleCreateInvoice}
//         >
//           <Plus size={16} />
//           Create Invoice
//         </Button>
//       </motion.div>

//       {/* Filters */}
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ delay: 0.1 }}
//         className="flex flex-wrap gap-4 items-center p-4 bg-white rounded-lg border"
//       >
//         <div className="flex items-center gap-2">
//           <Calendar size={16} />
//           <span className="text-sm font-medium">Month:</span>
//           <Input
//             type="month"
//             value={selectedMonth}
//             onChange={(e) => setSelectedMonth(e.target.value)}
//             className="w-40"
//           />
//         </div>

//         <div className="flex items-center gap-2">
//           <Filter size={16} />
//           <span className="text-sm font-medium">Status:</span>
//           <Select value={statusFilter} onValueChange={setStatusFilter}>
//             <SelectTrigger className="w-32">
//               <SelectValue />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="all">All</SelectItem>
//               <SelectItem value="draft">Draft</SelectItem>
//               <SelectItem value="sent">Sent</SelectItem>
//               <SelectItem value="paid">Paid</SelectItem>
//               <SelectItem value="overdue">Overdue</SelectItem>
//             </SelectContent>
//           </Select>
//         </div>

//         <div className="flex items-center gap-2 flex-1 max-w-md">
//           <Search size={16} />
//           <Input
//             placeholder="Search invoices..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//           />
//         </div>
//       </motion.div>

//       {/* Statistics Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.2 }}
//         >
//           <Card>
//             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//               <CardTitle className="text-sm font-medium">
//                 Total Invoices
//               </CardTitle>
//               <FileText className="h-4 w-4 text-muted-foreground" />
//             </CardHeader>
//             <CardContent>
//               <div className="text-2xl font-bold">
//                 {monthlyStats.totalInvoices}
//               </div>
//               <p className="text-xs text-muted-foreground">
//                 For{" "}
//                 {new Date(selectedMonth).toLocaleDateString("en-US", {
//                   month: "long",
//                   year: "numeric",
//                 })}
//               </p>
//             </CardContent>
//           </Card>
//         </motion.div>

//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.3 }}
//         >
//           <Card>
//             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//               <CardTitle className="text-sm font-medium">
//                 Total Revenue
//               </CardTitle>
//               <FileText className="h-4 w-4 text-muted-foreground" />
//             </CardHeader>
//             <CardContent>
//               <div className="text-2xl font-bold">
//                 {formatCurrency(monthlyStats.totalRevenue)}
//               </div>
//               <p className="text-xs text-muted-foreground">
//                 Avg: {formatCurrency(monthlyStats.avgInvoiceValue)} per invoice
//               </p>
//             </CardContent>
//           </Card>
//         </motion.div>

//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.4 }}
//         >
//           <Card>
//             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//               <CardTitle className="text-sm font-medium">
//                 Paid Revenue
//               </CardTitle>
//               <TrendingUp className="h-4 w-4 text-muted-foreground" />
//             </CardHeader>
//             <CardContent>
//               <div className="text-2xl font-bold text-green-600">
//                 {formatCurrency(monthlyStats.paidRevenue)}
//               </div>
//               <p className="text-xs text-muted-foreground">
//                 {monthlyStats.totalRevenue > 0
//                   ? (
//                       (monthlyStats.paidRevenue / monthlyStats.totalRevenue) *
//                       100
//                     ).toFixed(1)
//                   : 0}
//                 % of total revenue
//               </p>
//             </CardContent>
//           </Card>
//         </motion.div>

//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.5 }}
//         >
//           <Card>
//             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//               <CardTitle className="text-sm font-medium">
//                 Overdue Amount
//               </CardTitle>
//               <FileText className="h-4 w-4 text-red-500" />
//             </CardHeader>
//             <CardContent>
//               <div className="text-2xl font-bold text-red-600">
//                 {formatCurrency(monthlyStats.overdueAmount)}
//               </div>
//               <p className="text-xs text-muted-foreground">
//                 {monthlyStats.overdueCount} overdue invoice
//                 {monthlyStats.overdueCount !== 1 ? "s" : ""}
//               </p>
//             </CardContent>
//           </Card>
//         </motion.div>
//       </div>

//       {/* Invoices Table */}
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ delay: 0.6 }}
//       >
//         <Card>
//           <CardHeader>
//             <CardTitle>Invoices ({filteredInvoices.length})</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="rounded-md border">
//               <Table>
//                 <TableHeader>
//                   <TableRow>
//                     <TableHead>Invoice #</TableHead>
//                     <TableHead>Customer</TableHead>
//                     <TableHead>Amount</TableHead>
//                     <TableHead>Status</TableHead>
//                     <TableHead>Issue Date</TableHead>
//                     <TableHead>Due Date</TableHead>
//                     <TableHead>Items</TableHead>
//                     <TableHead className="text-right">Actions</TableHead>
//                   </TableRow>
//                 </TableHeader>
//                 <TableBody>
//                   {filteredInvoices.map((invoice, index) => (
//                     <motion.tr
//                       key={invoice._id}
//                       initial={{ opacity: 0, x: -20 }}
//                       animate={{ opacity: 1, x: 0 }}
//                       transition={{ delay: 0.1 * index }}
//                       className="hover:bg-gray-50"
//                     >
//                       <TableCell className="font-medium">
//                         {invoice.invoiceNumber}
//                       </TableCell>
//                       <TableCell>
//                         <div>
//                           <div className="font-medium">
//                             {invoice.customer.name}
//                           </div>
//                           <div className="text-sm text-gray-500">
//                             {invoice.customer.email}
//                           </div>
//                         </div>
//                       </TableCell>
//                       <TableCell className="font-medium">
//                         {formatCurrency(invoice.total)}
//                       </TableCell>
//                       <TableCell>
//                         <Badge className={getStatusColor(invoice.status)}>
//                           {invoice.status.charAt(0).toUpperCase() +
//                             invoice.status.slice(1)}
//                         </Badge>
//                       </TableCell>
//                       <TableCell>
//                         {new Date(invoice.issueDate).toLocaleDateString()}
//                       </TableCell>
//                       <TableCell>
//                         <span
//                           className={
//                             invoice.status === "overdue"
//                               ? "text-red-600 font-medium"
//                               : ""
//                           }
//                         >
//                           {new Date(invoice.dueDate).toLocaleDateString()}
//                         </span>
//                       </TableCell>
//                       <TableCell>
//                         {invoice.items.length} item
//                         {invoice.items.length !== 1 ? "s" : ""}
//                       </TableCell>
//                       <TableCell className="text-right">
//                         <div className="flex justify-end gap-2">
//                           <Button
//                             variant="ghost"
//                             size="icon"
//                             onClick={() => handleViewInvoice(invoice._id)}
//                             className="h-8 w-8"
//                           >
//                             <Eye size={14} />
//                           </Button>
//                           <Button
//                             variant="ghost"
//                             size="icon"
//                             onClick={() => handleEditInvoice(invoice._id)}
//                             className="h-8 w-8"
//                           >
//                             <Edit size={14} />
//                           </Button>
//                           <Button
//                             variant="ghost"
//                             size="icon"
//                             onClick={() => handleDownloadInvoice(invoice)}
//                             className="h-8 w-8"
//                           >
//                             <Download size={14} />
//                           </Button>
//                           <Button
//                             variant="ghost"
//                             size="icon"
//                             onClick={() => handleDeleteInvoice(invoice._id)}
//                             className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
//                           >
//                             <Trash2 size={14} />
//                           </Button>
//                         </div>
//                       </TableCell>
//                     </motion.tr>
//                   ))}
//                 </TableBody>
//               </Table>

//               {filteredInvoices.length === 0 && (
//                 <div className="text-center py-12">
//                   <FileText size={48} className="mx-auto text-gray-400 mb-4" />
//                   <h3 className="text-lg font-medium text-gray-900 mb-2">
//                     No invoices found
//                   </h3>
//                   <p className="text-gray-500 mb-4">
//                     {searchTerm || statusFilter !== "all"
//                       ? "Try adjusting your filters or search terms"
//                       : `No invoices for ${new Date(
//                           selectedMonth
//                         ).toLocaleDateString("en-US", {
//                           month: "long",
//                           year: "numeric",
//                         })}`}
//                   </p>
//                   <Button onClick={handleCreateInvoice}>
//                     <Plus size={16} className="mr-2" />
//                     Create Your First Invoice
//                   </Button>
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
  }, [invoices, selectedMonth, statusFilter, debouncedSearch, filters]);

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
            router.push("/dashboard/invoices/create");
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
  }, [router]);

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

  const handleCreateInvoice = () => router.push("/dashboard/invoices/create");

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
      </div>
    </div>
  );
}
