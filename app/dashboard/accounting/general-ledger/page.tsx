// "use client";

// import { useState, useMemo } from "react";
// import { useUser } from "@clerk/nextjs";
// import { useQuery } from "convex/react";
// import { api } from "@/convex/_generated/api";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { motion } from "framer-motion";
// import { Activity, FileText, DollarSign, Calendar } from "lucide-react";
// import { Id } from "@/convex/_generated/dataModel";
// import { formatCurrency } from "@/lib/currency";
// import { Skeleton } from "@/components/ui/skeleton";

// export default function GeneralLedgerPage() {
//   const { user } = useUser();
//   const companies = useQuery(
//     api.companies.getCompaniesByUser,
//     user?.id ? { userId: user.id } : "skip"
//   );

//   const [selectedCompanyId, setSelectedCompanyId] = useState<
//     string | undefined
//   >(companies?.[0]?._id);

//   // Fetch all invoices for the user
//   const invoices = useQuery(api.invoices.getInvoicesByUser, user ? {} : "skip");

//   // Generate ledger entries from invoices
//   // const ledgerEntries = useMemo(() => {
//   //   if (!invoices || !selectedCompanyId) return [];

//   //   const filtered = invoices.filter(
//   //     (inv) => inv.companyId === selectedCompanyId
//   //   );

//   //   // Create ledger entries from invoices
//   //   const entries: any[] = [];

//   //   filtered.forEach((invoice) => {
//   //     // Only create entries for paid invoices
//   //     if (invoice.status === "paid") {
//   //       // Debit: Accounts Receivable (or Cash if paid)
//   //       entries.push({
//   //         _id: `${invoice._id}-debit`,
//   //         date: invoice.issueDate,
//   //         account: "Accounts Receivable",
//   //         debit: invoice.total,
//   //         credit: 0,
//   //         description: `Payment received for Invoice #${invoice.invoiceNumber}`,
//   //         invoiceId: invoice._id,
//   //       });

//   //       // Credit: Revenue
//   //       entries.push({
//   //         _id: `${invoice._id}-credit`,
//   //         date: invoice.issueDate,
//   //         account: "Revenue",
//   //         debit: 0,
//   //         credit: invoice.total,
//   //         description: `Revenue from Invoice #${invoice.invoiceNumber}`,
//   //         invoiceId: invoice._id,
//   //       });

//   //       // If there's tax, create a separate entry
//   //       if (invoice.tax > 0) {
//   //         entries.push({
//   //           _id: `${invoice._id}-tax`,
//   //           date: invoice.issueDate,
//   //           account: "Tax Payable",
//   //           debit: 0,
//   //           credit: invoice.tax,
//   //           description: `Tax for Invoice #${invoice.invoiceNumber}`,
//   //           invoiceId: invoice._id,
//   //         });
//   //       }
//   //     }
//   //   });

//   //   // Sort by date (newest first)
//   //   return entries.sort(
//   //     (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
//   //   );
//   // }, [invoices, selectedCompanyId]);
//   // In convex/ledger.ts - Update the logic
//   // const ledgerEntries = useMemo(() => {
//   //   if (!invoices || !selectedCompanyId) return [];

//   //   const filtered = invoices.filter(
//   //     (inv) => inv.companyId === selectedCompanyId && inv.status !== "draft"
//   //   );

//   //   const entries: any[] = [];

//   //   filtered.forEach((invoice) => {
//   //     // Create entries for ALL non-draft invoices (sent, paid, overdue)

//   //     // Debit: Accounts Receivable when invoice is created
//   //     entries.push({
//   //       _id: `${invoice._id}-ar-debit`,
//   //       date: invoice.issueDate,
//   //       account: "Accounts Receivable",
//   //       debit: invoice.total,
//   //       credit: 0,
//   //       description: `Invoice #${invoice.invoiceNumber} - ${invoice.customer.name}`,
//   //       invoiceId: invoice._id,
//   //       status: invoice.status, // Add status for filtering
//   //     });

//   //     // Credit: Revenue (recorded when invoice is sent)
//   //     entries.push({
//   //       _id: `${invoice._id}-revenue-credit`,
//   //       date: invoice.issueDate,
//   //       account: "Revenue",
//   //       debit: 0,
//   //       credit: invoice.total,
//   //       description: `Revenue from Invoice #${invoice.invoiceNumber}`,
//   //       invoiceId: invoice._id,
//   //       status: invoice.status,
//   //     });

//   //     // When paid: Debit Cash, Credit Accounts Receivable
//   //     if (invoice.status === "paid") {
//   //       entries.push({
//   //         _id: `${invoice._id}-cash-debit`,
//   //         date: invoice.issueDate, // You might want to add a 'paidDate' field
//   //         account: "Cash",
//   //         debit: invoice.total,
//   //         credit: 0,
//   //         description: `Payment received for Invoice #${invoice.invoiceNumber}`,
//   //         invoiceId: invoice._id,
//   //         status: "paid",
//   //       });

//   //       entries.push({
//   //         _id: `${invoice._id}-ar-credit`,
//   //         date: invoice.issueDate,
//   //         account: "Accounts Receivable",
//   //         debit: 0,
//   //         credit: invoice.total,
//   //         description: `Payment received for Invoice #${invoice.invoiceNumber}`,
//   //         invoiceId: invoice._id,
//   //         status: "paid",
//   //       });
//   //     }
//   //   });

//   //   return entries.sort(
//   //     (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
//   //   );
//   // }, [invoices, selectedCompanyId]);

//   // In app/dashboard/accounting/general-ledger/page.tsx
//   // Replace the ledgerEntries useMemo with this corrected version:

//   const ledgerEntries = useMemo(() => {
//     if (!invoices || !selectedCompanyId) return [];

//     const filtered = invoices.filter(
//       (inv) => inv.companyId === selectedCompanyId && inv.status !== "draft"
//     );

//     const entries: any[] = [];

//     filtered.forEach((invoice) => {
//       // WHEN INVOICE IS SENT/OVERDUE (not yet paid)
//       // Dr. Accounts Receivable (Asset increases)
//       // Cr. Revenue (Income increases)
//       if (invoice.status === "sent" || invoice.status === "overdue") {
//         entries.push({
//           _id: `${invoice._id}-ar-debit`,
//           date: invoice.issueDate,
//           account: "Accounts Receivable",
//           debit: invoice.total,
//           credit: 0,
//           description: `Invoice #${invoice.invoiceNumber} issued to ${invoice.customer.name}`,
//           invoiceId: invoice._id,
//           status: invoice.status,
//         });

//         entries.push({
//           _id: `${invoice._id}-revenue-credit`,
//           date: invoice.issueDate,
//           account: "Revenue",
//           debit: 0,
//           credit: invoice.total,
//           description: `Revenue from Invoice #${invoice.invoiceNumber}`,
//           invoiceId: invoice._id,
//           status: invoice.status,
//         });
//       }

//       // WHEN INVOICE IS PAID
//       // Dr. Cash/Bank (Asset increases)
//       // Cr. Accounts Receivable (Asset decreases)
//       // Revenue was already recorded when sent
//       if (invoice.status === "paid") {
//         // First, record the original A/R and Revenue (if this was never "sent")
//         entries.push({
//           _id: `${invoice._id}-ar-debit`,
//           date: invoice.issueDate,
//           account: "Accounts Receivable",
//           debit: invoice.total,
//           credit: 0,
//           description: `Invoice #${invoice.invoiceNumber} issued to ${invoice.customer.name}`,
//           invoiceId: invoice._id,
//           status: "paid",
//         });

//         entries.push({
//           _id: `${invoice._id}-revenue-credit`,
//           date: invoice.issueDate,
//           account: "Revenue",
//           debit: 0,
//           credit: invoice.total,
//           description: `Revenue from Invoice #${invoice.invoiceNumber}`,
//           invoiceId: invoice._id,
//           status: "paid",
//         });

//         // Now record the payment
//         entries.push({
//           _id: `${invoice._id}-cash-debit`,
//           date: invoice.issueDate, // Should ideally be paidDate
//           account: "Cash",
//           debit: invoice.total,
//           credit: 0,
//           description: `Payment received for Invoice #${invoice.invoiceNumber}`,
//           invoiceId: invoice._id,
//           status: "paid",
//         });

//         entries.push({
//           _id: `${invoice._id}-ar-credit`,
//           date: invoice.issueDate, // Should ideally be paidDate
//           account: "Accounts Receivable",
//           debit: 0,
//           credit: invoice.total,
//           description: `Payment clears A/R for Invoice #${invoice.invoiceNumber}`,
//           invoiceId: invoice._id,
//           status: "paid",
//         });
//       }
//     });

//     return entries.sort(
//       (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
//     );
//   }, [invoices, selectedCompanyId]);

//   if (!user || !companies) {
//     return (
//       <div className="container mx-auto p-6 space-y-8 min-h-screen mt-20">
//         <Skeleton className="w-64 h-12 rounded-xl" />
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
//           {[...Array(4)].map((_, i) => (
//             <Skeleton key={i} className="h-32 rounded-2xl" />
//           ))}
//         </div>
//         <Skeleton className="w-full h-96 rounded-2xl" />
//       </div>
//     );
//   }

//   // Calculate summary statistics
//   const totalDebits = ledgerEntries.reduce(
//     (sum, entry) => sum + entry.debit,
//     0
//   );
//   const totalCredits = ledgerEntries.reduce(
//     (sum, entry) => sum + entry.credit,
//     0
//   );
//   const uniqueInvoices = new Set(ledgerEntries.map((e) => e.invoiceId)).size;

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/40 to-purple-50/30 relative overflow-hidden mt-20">
//       <div className="container mx-auto p-6 space-y-8 relative z-10">
//         {/* Header */}
//         <motion.div
//           className="flex flex-col md:flex-row md:items-center md:justify-between gap-6"
//           initial={{ opacity: 0, y: -30 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.8 }}
//         >
//           <div className="space-y-2">
//             <div className="flex items-center gap-3">
//               <motion.div
//                 animate={{ rotate: [0, 360] }}
//                 transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
//               >
//                 <FileText className="text-indigo-600" size={32} />
//               </motion.div>
//               <h1 className="text-6xl font-black bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
//                 General Ledger
//               </h1>
//             </div>
//             <p className="text-slate-600 text-lg font-medium ml-1">
//               Automatically generated from your paid invoices
//             </p>
//           </div>

//           {companies.length > 1 && (
//             <Select
//               value={selectedCompanyId}
//               onValueChange={setSelectedCompanyId}
//             >
//               <SelectTrigger className="w-[300px] h-12 border-2 border-slate-200 bg-white/90 backdrop-blur-xl focus:ring-2 focus:ring-indigo-500/40">
//                 <SelectValue placeholder="Select a company" />
//               </SelectTrigger>
//               <SelectContent>
//                 {companies.map((company) => (
//                   <SelectItem key={company._id} value={company._id}>
//                     {company.name}
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//           )}
//         </motion.div>

//         {/* Summary Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.1 }}
//           >
//             <Card className="border-0 shadow-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white">
//               <CardContent className="p-6">
//                 <div className="flex items-center gap-3 mb-2">
//                   <DollarSign size={24} />
//                   <span className="text-sm font-semibold opacity-90">
//                     Total Debits
//                   </span>
//                 </div>
//                 <div className="text-3xl font-bold">
//                   {formatCurrency(totalDebits)}
//                 </div>
//               </CardContent>
//             </Card>
//           </motion.div>

//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.2 }}
//           >
//             <Card className="border-0 shadow-xl bg-gradient-to-br from-purple-500 to-purple-600 text-white">
//               <CardContent className="p-6">
//                 <div className="flex items-center gap-3 mb-2">
//                   <DollarSign size={24} />
//                   <span className="text-sm font-semibold opacity-90">
//                     Total Credits
//                   </span>
//                 </div>
//                 <div className="text-3xl font-bold">
//                   {formatCurrency(totalCredits)}
//                 </div>
//               </CardContent>
//             </Card>
//           </motion.div>

//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.3 }}
//           >
//             <Card className="border-0 shadow-xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-white">
//               <CardContent className="p-6">
//                 <div className="flex items-center gap-3 mb-2">
//                   <FileText size={24} />
//                   <span className="text-sm font-semibold opacity-90">
//                     Paid Invoices
//                   </span>
//                 </div>
//                 <div className="text-3xl font-bold">{uniqueInvoices}</div>
//               </CardContent>
//             </Card>
//           </motion.div>
//         </div>

//         {/* Ledger Table */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.4 }}
//         >
//           <Card className="border-0 shadow-2xl bg-white/95 backdrop-blur-xl">
//             <CardHeader className="border-b border-slate-100 bg-gradient-to-r from-slate-50 to-indigo-50/30">
//               <div className="flex items-center gap-2">
//                 <div className="w-1 h-6 bg-gradient-to-b from-indigo-500 to-purple-500 rounded-full" />
//                 <CardTitle className="text-xl font-semibold">
//                   Ledger Entries ({ledgerEntries.length})
//                 </CardTitle>
//               </div>
//             </CardHeader>
//             <CardContent className="p-0">
//               {ledgerEntries.length > 0 ? (
//                 <div className="overflow-x-auto">
//                   <Table>
//                     <TableHeader>
//                       <TableRow className="bg-slate-50 hover:bg-slate-50">
//                         <TableHead className="font-semibold">Date</TableHead>
//                         <TableHead className="font-semibold">Account</TableHead>
//                         <TableHead className="font-semibold text-right">
//                           Debit
//                         </TableHead>
//                         <TableHead className="font-semibold text-right">
//                           Credit
//                         </TableHead>
//                         <TableHead className="font-semibold">
//                           Description
//                         </TableHead>
//                       </TableRow>
//                     </TableHeader>
//                     <TableBody>
//                       {ledgerEntries.map((entry, index) => (
//                         <motion.tr
//                           key={entry._id}
//                           initial={{ opacity: 0, x: -20 }}
//                           animate={{ opacity: 1, x: 0 }}
//                           transition={{ delay: index * 0.03 }}
//                           className="border-b border-slate-100 hover:bg-indigo-50/30"
//                         >
//                           <TableCell className="font-medium">
//                             {new Date(entry.date).toLocaleDateString()}
//                           </TableCell>
//                           <TableCell>
//                             <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
//                               {entry.account}
//                             </span>
//                           </TableCell>
//                           <TableCell className="text-right font-semibold text-emerald-600">
//                             {entry.debit > 0
//                               ? formatCurrency(entry.debit)
//                               : "-"}
//                           </TableCell>
//                           <TableCell className="text-right font-semibold text-blue-600">
//                             {entry.credit > 0
//                               ? formatCurrency(entry.credit)
//                               : "-"}
//                           </TableCell>
//                           <TableCell className="text-sm text-slate-600">
//                             {entry.description}
//                           </TableCell>
//                         </motion.tr>
//                       ))}
//                     </TableBody>
//                   </Table>
//                 </div>
//               ) : (
//                 <div className="text-center py-16 px-4">
//                   <motion.div
//                     initial={{ scale: 0 }}
//                     animate={{ scale: 1 }}
//                     className="inline-block p-6 bg-gradient-to-br from-slate-50 to-indigo-50 rounded-full mb-6"
//                   >
//                     <FileText size={64} className="text-slate-400" />
//                   </motion.div>
//                   <h3 className="text-xl font-semibold text-slate-900 mb-2">
//                     No Ledger Entries
//                   </h3>
//                   <p className="text-slate-500 mb-6">
//                     Ledger entries are automatically created when invoices are
//                     marked as paid.
//                   </p>
//                 </div>
//               )}
//             </CardContent>
//           </Card>
//         </motion.div>
//       </div>
//     </div>
//   );
// }

"use client";

import { useState, useMemo } from "react";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
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
import { motion } from "framer-motion";
import { Activity, FileText, DollarSign, Info } from "lucide-react";
import { Id } from "@/convex/_generated/dataModel";
import { formatCurrency } from "@/lib/currency";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function GeneralLedgerPage() {
  const { user } = useUser();
  const companies = useQuery(
    api.companies.getCompaniesByUser,
    user?.id ? { userId: user.id } : "skip"
  );

  const [selectedCompanyId, setSelectedCompanyId] = useState<
    string | undefined
  >(companies?.[0]?._id);

  const invoices = useQuery(api.invoices.getInvoicesByUser, user ? {} : "skip");

  const ledgerEntries = useMemo(() => {
    if (!invoices || !selectedCompanyId) return [];

    const filtered = invoices.filter(
      (inv) => inv.companyId === selectedCompanyId && inv.status !== "draft"
    );

    const entries: any[] = [];

    filtered.forEach((invoice) => {
      if (invoice.status === "sent" || invoice.status === "overdue") {
        entries.push({
          _id: `${invoice._id}-ar-debit`,
          date: invoice.issueDate,
          account: "Accounts Receivable",
          debit: invoice.total,
          credit: 0,
          description: `Invoice #${invoice.invoiceNumber} issued to ${invoice.customer.name}`,
          invoiceId: invoice._id,
          status: invoice.status,
        });

        entries.push({
          _id: `${invoice._id}-revenue-credit`,
          date: invoice.issueDate,
          account: "Revenue",
          debit: 0,
          credit: invoice.total,
          description: `Revenue from Invoice #${invoice.invoiceNumber}`,
          invoiceId: invoice._id,
          status: invoice.status,
        });
      }

      if (invoice.status === "paid") {
        entries.push({
          _id: `${invoice._id}-ar-debit`,
          date: invoice.issueDate,
          account: "Accounts Receivable",
          debit: invoice.total,
          credit: 0,
          description: `Invoice #${invoice.invoiceNumber} issued to ${invoice.customer.name}`,
          invoiceId: invoice._id,
          status: "paid",
        });

        entries.push({
          _id: `${invoice._id}-revenue-credit`,
          date: invoice.issueDate,
          account: "Revenue",
          debit: 0,
          credit: invoice.total,
          description: `Revenue from Invoice #${invoice.invoiceNumber}`,
          invoiceId: invoice._id,
          status: "paid",
        });

        entries.push({
          _id: `${invoice._id}-cash-debit`,
          date: invoice.issueDate,
          account: "Cash",
          debit: invoice.total,
          credit: 0,
          description: `Payment received for Invoice #${invoice.invoiceNumber}`,
          invoiceId: invoice._id,
          status: "paid",
        });

        entries.push({
          _id: `${invoice._id}-ar-credit`,
          date: invoice.issueDate,
          account: "Accounts Receivable",
          debit: 0,
          credit: invoice.total,
          description: `Payment clears A/R for Invoice #${invoice.invoiceNumber}`,
          invoiceId: invoice._id,
          status: "paid",
        });
      }
    });

    return entries.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }, [invoices, selectedCompanyId]);

  if (!user || !companies) {
    return (
      <div className="container mx-auto p-6 space-y-8 min-h-screen mt-20">
        <Skeleton className="w-64 h-12 rounded-xl" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-2xl" />
          ))}
        </div>
        <Skeleton className="w-full h-96 rounded-2xl" />
      </div>
    );
  }

  const totalDebits = ledgerEntries.reduce(
    (sum, entry) => sum + entry.debit,
    0
  );
  const totalCredits = ledgerEntries.reduce(
    (sum, entry) => sum + entry.credit,
    0
  );
  const uniqueInvoices = new Set(ledgerEntries.map((e) => e.invoiceId)).size;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/40 to-purple-50/30 relative overflow-hidden mt-20">
      <div className="container mx-auto p-6 space-y-8 relative z-10">
        {/* Header */}
        <motion.div
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-6"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              >
                <FileText className="text-indigo-600" size={32} />
              </motion.div>
              <h1 className="text-6xl font-black bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                General Ledger
              </h1>
            </div>
            <p className="text-slate-600 text-lg font-medium ml-1">
              Automatically generated from your invoices
            </p>
          </div>
          {companies.length > 1 && (
            <Select
              value={selectedCompanyId}
              onValueChange={setSelectedCompanyId}
            >
              <SelectTrigger className="w-[300px] h-12 border-2 border-slate-200 bg-white/90 backdrop-blur-xl focus:ring-2 focus:ring-indigo-500/40">
                <SelectValue placeholder="Select a company" />
              </SelectTrigger>
              <SelectContent>
                {companies.map((company) => (
                  <SelectItem key={company._id} value={company._id}>
                    {company.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </motion.div>

        {/* Instruction Alert */}
        {/* Instruction Alert */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="relative overflow-hidden rounded-2xl border-2 border-purple-200/50 bg-gradient-to-r from-purple-50/90 via-indigo-50/90 to-purple-50/90 backdrop-blur-xl shadow-lg">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-indigo-500/5" />
            <div className="relative flex items-start gap-4 p-4">
              <div className="flex-shrink-0 mt-0.5">
                <div className="rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 p-2 shadow-lg">
                  <Info className="h-4 w-4 text-white" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-purple-900 mb-1">
                  General Ledger Entry Rules
                </p>
                <p className="text-sm text-purple-800/90 leading-relaxed">
                  Only invoices marked as{" "}
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-blue-500 text-white shadow-sm">
                    Sent
                  </span>{" "}
                  or{" "}
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-green-500 text-white shadow-sm">
                    Paid
                  </span>{" "}
                  appear here. Draft invoices are excluded.
                </p>
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-indigo-500 to-purple-500" />
          </div>
        </motion.div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="border-0 shadow-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-2">
                  <DollarSign size={24} />
                  <span className="text-sm font-semibold opacity-90">
                    Total Debits
                  </span>
                </div>
                <div className="text-3xl font-bold">
                  {formatCurrency(totalDebits)}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="border-0 shadow-xl bg-gradient-to-br from-purple-500 to-purple-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-2">
                  <DollarSign size={24} />
                  <span className="text-sm font-semibold opacity-90">
                    Total Credits
                  </span>
                </div>
                <div className="text-3xl font-bold">
                  {formatCurrency(totalCredits)}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="border-0 shadow-xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-2">
                  <FileText size={24} />
                  <span className="text-sm font-semibold opacity-90">
                    Invoices Recorded
                  </span>
                </div>
                <div className="text-3xl font-bold">{uniqueInvoices}</div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Ledger Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="border-0 shadow-2xl bg-white/95 backdrop-blur-xl">
            <CardHeader className="border-b border-slate-100 bg-gradient-to-r from-slate-50 to-indigo-50/30">
              <div className="flex items-center gap-2">
                <div className="w-1 h-6 bg-gradient-to-b from-indigo-500 to-purple-500 rounded-full" />
                <CardTitle className="text-xl font-semibold">
                  Ledger Entries ({ledgerEntries.length})
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {ledgerEntries.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-slate-50 hover:bg-slate-50">
                        <TableHead className="font-semibold">Date</TableHead>
                        <TableHead className="font-semibold">Account</TableHead>
                        <TableHead className="font-semibold text-right">
                          Debit
                        </TableHead>
                        <TableHead className="font-semibold text-right">
                          Credit
                        </TableHead>
                        <TableHead className="font-semibold">
                          Description
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {ledgerEntries.map((entry, index) => (
                        <motion.tr
                          key={entry._id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.03 }}
                          className="border-b border-slate-100 hover:bg-indigo-50/30"
                        >
                          <TableCell className="font-medium">
                            {new Date(entry.date).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
                              {entry.account}
                            </span>
                          </TableCell>
                          <TableCell className="text-right font-semibold text-emerald-600">
                            {entry.debit > 0
                              ? formatCurrency(entry.debit)
                              : "-"}
                          </TableCell>
                          <TableCell className="text-right font-semibold text-blue-600">
                            {entry.credit > 0
                              ? formatCurrency(entry.credit)
                              : "-"}
                          </TableCell>
                          <TableCell className="text-sm text-slate-600">
                            {entry.description}
                          </TableCell>
                        </motion.tr>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-16 px-4">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="inline-block p-6 bg-gradient-to-br from-slate-50 to-indigo-50 rounded-full mb-6"
                  >
                    <FileText size={64} className="text-slate-400" />
                  </motion.div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">
                    No Ledger Entries
                  </h3>
                  <p className="text-slate-500 mb-6">
                    Ledger entries are automatically created when invoices are
                    marked as <strong>sent</strong> or <strong>paid</strong>.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
