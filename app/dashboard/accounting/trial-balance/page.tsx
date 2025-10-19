// // app/dashboard/accounting/trial-balance.tsx
// "use client";
// import { useState } from "react";
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
// import { Skeleton } from "@/components/ui/skeleton";
// import { formatCurrency } from "@/lib/currency";
// import {
//   Bar,
//   BarChart,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   ResponsiveContainer,
//   Tooltip,
// } from "recharts";
// import { motion } from "framer-motion";
// import { Activity } from "lucide-react";
// import { Id } from "@/convex/_generated/dataModel";

// const COLORS = ["#6366f1", "#8b5cf6"];

// const cardVariants = {
//   hidden: { opacity: 0, y: 20, scale: 0.95 },
//   visible: {
//     opacity: 1,
//     y: 0,
//     scale: 1,
//     transition: { duration: 0.6 },
//   },
// };

// const chartVariants = {
//   hidden: { opacity: 0, scale: 0.9, y: 30 },
//   visible: {
//     opacity: 1,
//     scale: 1,
//     y: 0,
//     transition: { duration: 0.8 },
//   },
// };

// const CustomTooltip = ({ active, payload, label }: any) => {
//   if (active && payload && payload.length) {
//     return (
//       <motion.div
//         initial={{ opacity: 0, y: 10 }}
//         animate={{ opacity: 1, y: 0 }}
//         className="bg-gradient-to-br from-slate-900 to-slate-800 text-white p-4 rounded-2xl shadow-2xl border border-white/10 backdrop-blur-xl"
//       >
//         <p className="font-semibold text-sm mb-2 text-slate-300">{label}</p>
//         {payload.map((entry: any, index: number) => (
//           <p key={index} className="text-lg font-bold">
//             {entry.name}: {formatCurrency(entry.value)}
//           </p>
//         ))}
//       </motion.div>
//     );
//   }
//   return null;
// };

// export default function TrialBalancePage() {
//   const { user } = useUser();
//   const companies = useQuery(
//     api.companies.getCompaniesByUser,
//     user?.id ? { userId: user.id } : "skip"
//   );
//   const [selectedCompanyId, setSelectedCompanyId] = useState<
//     string | undefined
//   >(companies?.[0]?._id);

//   const balance = useQuery(
//     api.ledger.getTrialBalance,
//     selectedCompanyId
//       ? { companyId: selectedCompanyId as Id<"companies"> }
//       : "skip"
//   ) as Record<string, { debit: number; credit: number }> | undefined;

//   if (!companies) {
//     return (
//       <div className="container mx-auto p-6 space-y-8 min-h-screen">
//         <Skeleton className="w-64 h-12 rounded-xl" />
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
//           {[...Array(4)].map((_, i) => (
//             <Skeleton key={i} className="h-40 rounded-2xl" />
//           ))}
//         </div>
//       </div>
//     );
//   }

//   const balanceData = Object.entries(balance || {}).map(([account, val]) => {
//     const { debit, credit } = val as { debit: number; credit: number };
//     return {
//       account,
//       debit,
//       credit,
//       net: debit - credit,
//     };
//   });

//   const totalDebit = balanceData.reduce((sum, item) => sum + item.debit, 0);
//   const totalCredit = balanceData.reduce((sum, item) => sum + item.credit, 0);

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/40 to-purple-50/30 relative overflow-hidden mt-20">
//       <div className="container mx-auto p-6 space-y-8 relative z-10">
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
//                 <Activity className="text-indigo-600" size={32} />
//               </motion.div>
//               <h1 className="text-6xl font-black bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
//                 Trial Balance
//               </h1>
//             </div>
//             <p className="text-slate-600 text-lg font-medium ml-1">
//               Overview of debits and credits per account
//             </p>
//           </div>
//           {companies.length > 1 && (
//             <Select
//               value={selectedCompanyId}
//               onValueChange={setSelectedCompanyId}
//             >
//               <SelectTrigger className="w-[300px]">
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
//         {balance ? (
//           <>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <motion.div
//                 variants={cardVariants}
//                 initial="hidden"
//                 animate="visible"
//               >
//                 <Card>
//                   <CardHeader>
//                     <CardTitle>
//                       Total Debit: {formatCurrency(totalDebit)}
//                     </CardTitle>
//                   </CardHeader>
//                 </Card>
//               </motion.div>
//               <motion.div
//                 variants={cardVariants}
//                 initial="hidden"
//                 animate="visible"
//               >
//                 <Card>
//                   <CardHeader>
//                     <CardTitle>
//                       Total Credit: {formatCurrency(totalCredit)}
//                     </CardTitle>
//                   </CardHeader>
//                 </Card>
//               </motion.div>
//             </div>
//             <motion.div
//               variants={chartVariants}
//               initial="hidden"
//               animate="visible"
//             >
//               <Card className="border-0 shadow-2xl bg-gradient-to-br from-white/95 to-white/90 backdrop-blur-xl">
//                 <CardHeader>
//                   <CardTitle>Debits vs Credits by Account</CardTitle>
//                 </CardHeader>
//                 <CardContent className="h-[420px] p-8">
//                   <ResponsiveContainer width="100%" height="100%">
//                     <BarChart data={balanceData}>
//                       <CartesianGrid strokeDasharray="3 3" />
//                       <XAxis dataKey="account" />
//                       <YAxis />
//                       <Tooltip content={<CustomTooltip />} />
//                       <Bar dataKey="debit" fill={COLORS[0]} />
//                       <Bar dataKey="credit" fill={COLORS[1]} />
//                     </BarChart>
//                   </ResponsiveContainer>
//                 </CardContent>
//               </Card>
//             </motion.div>
//           </>
//         ) : (
//           <Skeleton className="w-full h-96 rounded-2xl" />
//         )}
//       </div>
//     </div>
//   );
// }

// app/dashboard/accounting/trial-balance/page.tsx
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
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/lib/currency";
import {
  Bar,
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { motion } from "framer-motion";
import { Activity, TrendingUp, AlertCircle } from "lucide-react";

const COLORS = ["#6366f1", "#8b5cf6"];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-slate-900 to-slate-800 text-white p-4 rounded-2xl shadow-2xl border border-white/10 backdrop-blur-xl"
      >
        <p className="font-semibold text-sm mb-2 text-slate-300">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-lg font-bold">
            {entry.name}: {formatCurrency(entry.value)}
          </p>
        ))}
      </motion.div>
    );
  }
  return null;
};

export default function TrialBalancePage() {
  const { user } = useUser();
  const companies = useQuery(
    api.companies.getCompaniesByUser,
    user?.id ? { userId: user.id } : "skip"
  );

  const [selectedCompanyId, setSelectedCompanyId] = useState<
    string | undefined
  >(companies?.[0]?._id);

  // Fetch all invoices for the user
  const invoices = useQuery(api.invoices.getInvoicesByUser, user ? {} : "skip");

  // Calculate trial balance from invoices
  // const balance = useMemo(() => {
  //   if (!invoices || !selectedCompanyId) return {};

  //   const filtered = invoices.filter(
  //     (inv) => inv.companyId === selectedCompanyId && inv.status === "paid"
  //   );

  //   const balanceMap: Record<string, { debit: number; credit: number }> = {};

  //   filtered.forEach((invoice) => {
  //     // Accounts Receivable (Debit)
  //     if (!balanceMap["Accounts Receivable"]) {
  //       balanceMap["Accounts Receivable"] = { debit: 0, credit: 0 };
  //     }
  //     balanceMap["Accounts Receivable"].debit += invoice.total;

  //     // Revenue (Credit)
  //     if (!balanceMap["Revenue"]) {
  //       balanceMap["Revenue"] = { debit: 0, credit: 0 };
  //     }
  //     balanceMap["Revenue"].credit += invoice.total;

  //     // Tax Payable (Credit) if applicable
  //     if (invoice.tax > 0) {
  //       if (!balanceMap["Tax Payable"]) {
  //         balanceMap["Tax Payable"] = { debit: 0, credit: 0 };
  //       }
  //       balanceMap["Tax Payable"].credit += invoice.tax;
  //     }
  //   });

  //   return balanceMap;
  // }, [invoices, selectedCompanyId]);
  // In app/dashboard/accounting/trial-balance/page.tsx
  // const balance = useMemo(() => {
  //   if (!invoices || !selectedCompanyId) return {};

  //   const filtered = invoices.filter(
  //     (inv) => inv.companyId === selectedCompanyId && inv.status !== "draft"
  //   );

  //   const balanceMap: Record<string, { debit: number; credit: number }> = {};

  //   filtered.forEach((invoice) => {
  //     // Accounts Receivable
  //     if (!balanceMap["Accounts Receivable"]) {
  //       balanceMap["Accounts Receivable"] = { debit: 0, credit: 0 };
  //     }

  //     // Revenue
  //     if (!balanceMap["Revenue"]) {
  //       balanceMap["Revenue"] = { debit: 0, credit: 0 };
  //     }

  //     // Cash
  //     if (!balanceMap["Cash"]) {
  //       balanceMap["Cash"] = { debit: 0, credit: 0 };
  //     }

  //     if (invoice.status === "paid") {
  //       // For paid invoices: Cash increases, A/R decreases
  //       balanceMap["Cash"].debit += invoice.total;
  //       balanceMap["Revenue"].credit += invoice.total;
  //     } else {
  //       // For unpaid invoices: A/R stays high
  //       balanceMap["Accounts Receivable"].debit += invoice.total;
  //       balanceMap["Revenue"].credit += invoice.total;
  //     }
  //   });

  //   return balanceMap;
  // }, [invoices, selectedCompanyId]);

  // In app/dashboard/accounting/trial-balance/page.tsx
  // Replace the balance useMemo with this:

  const balance = useMemo(() => {
    if (!invoices || !selectedCompanyId) return {};

    const filtered = invoices.filter(
      (inv) => inv.companyId === selectedCompanyId && inv.status !== "draft"
    );

    const balanceMap: Record<string, { debit: number; credit: number }> = {
      "Accounts Receivable": { debit: 0, credit: 0 },
      Revenue: { debit: 0, credit: 0 },
      Cash: { debit: 0, credit: 0 },
    };

    filtered.forEach((invoice) => {
      if (invoice.status === "sent" || invoice.status === "overdue") {
        // Outstanding invoices:
        // Dr. A/R, Cr. Revenue
        balanceMap["Accounts Receivable"].debit += invoice.total;
        balanceMap["Revenue"].credit += invoice.total;
      } else if (invoice.status === "paid") {
        // Paid invoices:
        // Net effect: Dr. Cash, Cr. Revenue
        // (A/R debited then credited, so nets to zero)
        balanceMap["Cash"].debit += invoice.total;
        balanceMap["Revenue"].credit += invoice.total;
      }
    });

    return balanceMap;
  }, [invoices, selectedCompanyId]);

  if (!companies || !invoices) {
    return (
      <div className="container mx-auto p-6 space-y-8 min-h-screen mt-20">
        <Skeleton className="w-64 h-12 rounded-xl" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-40 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  const balanceData = Object.entries(balance).map(([account, val]) => {
    const { debit, credit } = val as { debit: number; credit: number };
    return {
      account,
      debit,
      credit,
      net: debit - credit,
    };
  });

  const totalDebit = balanceData.reduce((sum, item) => sum + item.debit, 0);
  const totalCredit = balanceData.reduce((sum, item) => sum + item.credit, 0);
  const isBalanced = Math.abs(totalDebit - totalCredit) < 0.01;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/40 to-purple-50/30 relative overflow-hidden mt-20">
      <div className="container mx-auto p-6 space-y-8 relative z-10">
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
                <Activity className="text-indigo-600" size={32} />
              </motion.div>
              <h1 className="text-6xl font-black bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Trial Balance
              </h1>
            </div>
            <p className="text-slate-600 text-lg font-medium ml-1">
              Overview of debits and credits per account
            </p>
          </div>

          {companies.length > 1 && (
            <Select
              value={selectedCompanyId}
              onValueChange={setSelectedCompanyId}
            >
              <SelectTrigger className="w-[300px]">
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

        {/* instructions */}
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
                  <Activity className="h-4 w-4 text-white" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-purple-900 mb-1">
                  Trial Balance Calculation
                </p>
                <p className="text-sm text-purple-800/90 leading-relaxed">
                  Trial balance includes only{" "}
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-blue-500 text-white shadow-sm">
                    Sent
                  </span>
                  ,{" "}
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-orange-500 text-white shadow-sm">
                    Overdue
                  </span>
                  , and{" "}
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-green-500 text-white shadow-sm">
                    Paid
                  </span>{" "}
                  invoices. Draft invoices are not reflected.
                </p>
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-indigo-500 to-purple-500" />
          </div>
        </motion.div>

        {/* Summary Cards */}
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="border-0 shadow-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold opacity-90">
                  Total Debit
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {formatCurrency(totalDebit)}
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
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold opacity-90">
                  Total Credit
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {formatCurrency(totalCredit)}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card
              className={`border-0 shadow-xl bg-gradient-to-br ${
                isBalanced
                  ? "from-emerald-500 to-emerald-600"
                  : "from-rose-500 to-rose-600"
              } text-white`}
            >
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold opacity-90 flex items-center gap-2">
                  {isBalanced ? (
                    <TrendingUp size={16} />
                  ) : (
                    <AlertCircle size={16} />
                  )}
                  Balance Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {isBalanced ? "Balanced" : "Unbalanced"}
                </div>
                {!isBalanced && (
                  <p className="text-sm mt-1 opacity-90">
                    Difference:{" "}
                    {formatCurrency(Math.abs(totalDebit - totalCredit))}
                  </p>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Chart */}
        {balanceData.length > 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="border-0 shadow-2xl bg-gradient-to-br from-white/95 to-white/90 backdrop-blur-xl">
              <CardHeader>
                <CardTitle>Debits vs Credits by Account</CardTitle>
              </CardHeader>
              <CardContent className="h-[420px] p-8">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={balanceData}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#e2e8f0"
                      opacity={0.6}
                    />
                    <XAxis dataKey="account" stroke="#64748b" fontSize={12} />
                    <YAxis stroke="#64748b" fontSize={12} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Bar
                      dataKey="debit"
                      fill={COLORS[0]}
                      name="Debit"
                      radius={[8, 8, 0, 0]}
                    />
                    <Bar
                      dataKey="credit"
                      fill={COLORS[1]}
                      name="Credit"
                      radius={[8, 8, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="border-0 shadow-xl bg-white/95 backdrop-blur-xl">
              <CardContent className="text-center py-16">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="inline-block p-6 bg-gradient-to-br from-slate-50 to-indigo-50 rounded-full mb-6"
                >
                  <Activity size={64} className="text-slate-400" />
                </motion.div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">
                  No Trial Balance Data
                </h3>
                <p className="text-slate-500">
                  Trial balance is automatically generated from paid invoices.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}
