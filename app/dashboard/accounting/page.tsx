// "use client";
// import { useState, useMemo } from "react";
// import { useUser } from "@clerk/nextjs";
// import { useQuery } from "convex/react";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { motion } from "framer-motion";
// import {
//   DollarSign,
//   TrendingUp,
//   TrendingDown,
//   Calendar,
//   FileText,
//   BarChart3,
//   Sparkles,
//   ArrowUpRight,
//   ArrowDownRight,
//   Activity,
// } from "lucide-react";
// import {
//   AreaChart,
//   Area,
//   BarChart,
//   Bar,
//   PieChart,
//   Pie,
//   Cell,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
//   Legend,
// } from "recharts";
// import { formatCurrency } from "@/lib/currency";

// const COLORS = ["#6366f1", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981"];

// // Custom Tooltip Component
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
//             {typeof entry.value === "number" && entry.value > 1000
//               ? formatCurrency(entry.value)
//               : entry.value}
//           </p>
//         ))}
//       </motion.div>
//     );
//   }
//   return null;
// };

// // Stat Card Component
// const StatCard = ({
//   icon: Icon,
//   title,
//   value,
//   color,
//   delay,
//   trend,
//   subtitle,
// }: {
//   icon: any;
//   title: string;
//   value: string | number;
//   color: string;
//   delay: number;
//   trend?: number | null;
//   subtitle?: string;
// }) => (
//   <motion.div
//     initial={{ opacity: 0, y: 20, scale: 0.95 }}
//     animate={{ opacity: 1, y: 0, scale: 1 }}
//     transition={{ duration: 0.6, delay }}
//     whileHover={{
//       scale: 1.05,
//       y: -12,
//       transition: { duration: 0.3 },
//     }}
//   >
//     <Card className="relative border-0 shadow-xl bg-gradient-to-br from-white/95 to-white/80 backdrop-blur-2xl hover:shadow-2xl transition-all duration-700 overflow-hidden group">
//       <div
//         className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-15 transition-opacity duration-700`}
//       />
//       <motion.div
//         className={`absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br ${color} rounded-full blur-3xl`}
//         initial={{ opacity: 0.1, scale: 0.8 }}
//         whileHover={{ opacity: 0.25, scale: 1.2 }}
//         transition={{ duration: 0.8 }}
//       />
//       <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
//         <motion.div
//           className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
//           animate={{
//             x: ["-100%", "100%"],
//           }}
//           transition={{
//             duration: 1.5,
//             repeat: Infinity,
//             repeatDelay: 3,
//             ease: "easeInOut",
//           }}
//         />
//       </div>
//       <CardHeader className="pb-3 relative z-10">
//         <div className="flex items-center justify-between">
//           <motion.div
//             className={`p-3.5 rounded-2xl bg-gradient-to-br ${color} shadow-xl relative overflow-hidden`}
//             whileHover={{ rotate: [0, -5, 5, -5, 0], scale: 1.1 }}
//             transition={{ duration: 0.6 }}
//           >
//             <motion.div
//               className="absolute inset-0 bg-white/20"
//               animate={{
//                 scale: [1, 1.5, 1],
//                 opacity: [0.5, 0, 0.5],
//               }}
//               transition={{
//                 duration: 2,
//                 repeat: Infinity,
//                 ease: "easeInOut",
//               }}
//             />
//             <Icon className="text-white relative z-10" size={24} />
//           </motion.div>
//           {trend !== undefined && trend !== null && (
//             <motion.div
//               initial={{ opacity: 0, x: -10, scale: 0.8 }}
//               animate={{ opacity: 1, x: 0, scale: 1 }}
//               transition={{
//                 delay: delay + 0.3,
//                 type: "spring",
//                 stiffness: 200,
//               }}
//               className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-bold bg-white/80 backdrop-blur-sm shadow-md"
//             >
//               {trend > 0 ? (
//                 <>
//                   <ArrowUpRight size={16} className="text-emerald-500" />
//                   <span className="text-emerald-600">+{trend}%</span>
//                 </>
//               ) : trend < 0 ? (
//                 <>
//                   <ArrowDownRight size={16} className="text-rose-500" />
//                   <span className="text-rose-600">{trend}%</span>
//                 </>
//               ) : null}
//             </motion.div>
//           )}
//         </div>
//         <CardTitle className="text-sm font-semibold text-slate-500 mt-5 tracking-wide uppercase">
//           {title}
//         </CardTitle>
//       </CardHeader>
//       <CardContent className="relative z-10">
//         <motion.div
//           className="text-3xl font-black bg-gradient-to-br from-slate-900 via-slate-800 to-slate-600 bg-clip-text text-transparent"
//           initial={{ scale: 0.5, opacity: 0 }}
//           animate={{ scale: 1, opacity: 1 }}
//           transition={{
//             type: "spring",
//             stiffness: 150,
//             damping: 15,
//             delay: delay + 0.2,
//           }}
//         >
//           {value}
//         </motion.div>
//         {subtitle && (
//           <p className="text-xs text-slate-500 mt-2 font-medium">{subtitle}</p>
//         )}
//       </CardContent>
//       <motion.div
//         className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${color}`}
//         initial={{ scaleX: 0 }}
//         animate={{ scaleX: 1 }}
//         transition={{ delay: delay + 0.4, duration: 0.6 }}
//       />
//     </Card>
//   </motion.div>
// );

// export default function AccountingPage() {
//   const { user } = useUser();
//   const [selectedPeriod, setSelectedPeriod] = useState("thisMonth");
//   const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(
//     null
//   );

//   // Mock data - Replace with actual Convex queries
//   const invoices = useQuery(
//     {} as any, // api.invoices.getInvoicesByUser
//     user ? {} : "skip"
//   );

//   const companies = useQuery(
//     {} as any, // api.companies.getCompaniesByUser
//     user ? {} : "skip"
//   );

//   // Calculate accounting metrics
//   const accountingData = useMemo(() => {
//     if (!invoices) return null;

//     const now = new Date();
//     let filteredInvoices = invoices;

//     // Filter by period
//     if (selectedPeriod === "thisMonth") {
//       filteredInvoices = invoices.filter((inv: any) => {
//         const date = new Date(inv.issueDate);
//         return (
//           date.getMonth() === now.getMonth() &&
//           date.getFullYear() === now.getFullYear()
//         );
//       });
//     } else if (selectedPeriod === "lastMonth") {
//       const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1);
//       filteredInvoices = invoices.filter((inv: any) => {
//         const date = new Date(inv.issueDate);
//         return (
//           date.getMonth() === lastMonth.getMonth() &&
//           date.getFullYear() === lastMonth.getFullYear()
//         );
//       });
//     } else if (selectedPeriod === "thisYear") {
//       filteredInvoices = invoices.filter((inv: any) => {
//         const date = new Date(inv.issueDate);
//         return date.getFullYear() === now.getFullYear();
//       });
//     }

//     // Filter by company
//     if (selectedCompanyId) {
//       filteredInvoices = filteredInvoices.filter(
//         (inv: any) => inv.companyId === selectedCompanyId
//       );
//     }

//     const totalRevenue = filteredInvoices.reduce(
//       (sum: number, inv: any) => sum + inv.total,
//       0
//     );
//     const paidRevenue = filteredInvoices
//       .filter((inv: any) => inv.status === "paid")
//       .reduce((sum: number, inv: any) => sum + inv.total, 0);
//     const pendingRevenue = filteredInvoices
//       .filter((inv: any) => inv.status === "sent")
//       .reduce((sum: number, inv: any) => sum + inv.total, 0);
//     const overdueRevenue = filteredInvoices
//       .filter((inv: any) => inv.status === "overdue")
//       .reduce((sum: number, inv: any) => sum + inv.total, 0);
//     const draftRevenue = filteredInvoices
//       .filter((inv: any) => inv.status === "draft")
//       .reduce((sum: number, inv: any) => sum + inv.total, 0);

//     const totalTax = filteredInvoices.reduce(
//       (sum: number, inv: any) => sum + inv.tax,
//       0
//     );
//     const netRevenue = paidRevenue - totalTax;

//     // Monthly breakdown
//     const monthlyData = filteredInvoices.reduce((acc: any, inv: any) => {
//       const date = new Date(inv.issueDate);
//       const monthKey = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}`;
//       if (!acc[monthKey]) {
//         acc[monthKey] = { revenue: 0, tax: 0, net: 0 };
//       }
//       acc[monthKey].revenue += inv.total;
//       acc[monthKey].tax += inv.tax;
//       acc[monthKey].net += inv.total - inv.tax;
//       return acc;
//     }, {});

//     const chartData = Object.entries(monthlyData)
//       .map(([month, data]: [string, any]) => ({
//         month: new Date(month + "-01").toLocaleString("default", {
//           month: "short",
//           year: "2-digit",
//         }),
//         revenue: data.revenue,
//         tax: data.tax,
//         net: data.net,
//       }))
//       .sort(
//         (a, b) => new Date(a.month).getTime() - new Date(b.month).getTime()
//       );

//     // Status distribution
//     const statusData = [
//       { name: "Paid", value: paidRevenue },
//       { name: "Pending", value: pendingRevenue },
//       { name: "Overdue", value: overdueRevenue },
//       { name: "Draft", value: draftRevenue },
//     ].filter((item) => item.value > 0);

//     return {
//       totalRevenue,
//       paidRevenue,
//       pendingRevenue,
//       overdueRevenue,
//       totalTax,
//       netRevenue,
//       chartData,
//       statusData,
//       invoiceCount: filteredInvoices.length,
//     };
//   }, [invoices, selectedPeriod, selectedCompanyId]);

//   if (!user || !invoices || !companies) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/20 flex items-center justify-center">
//         <motion.div
//           animate={{ rotate: 360 }}
//           transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
//         >
//           <Activity className="text-indigo-600" size={48} />
//         </motion.div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/40 to-purple-50/30 relative overflow-hidden mt-20">
//       {/* Animated background elements */}
//       <div className="absolute inset-0 overflow-hidden pointer-events-none">
//         <motion.div
//           className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-400/10 rounded-full blur-3xl"
//           animate={{
//             scale: [1, 1.2, 1],
//             x: [0, 50, 0],
//             y: [0, 30, 0],
//           }}
//           transition={{
//             duration: 8,
//             repeat: Infinity,
//             ease: "easeInOut",
//           }}
//         />
//         <motion.div
//           className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl"
//           animate={{
//             scale: [1, 1.3, 1],
//             x: [0, -50, 0],
//             y: [0, -30, 0],
//           }}
//           transition={{
//             duration: 10,
//             repeat: Infinity,
//             ease: "easeInOut",
//             delay: 1,
//           }}
//         />
//       </div>

//       <div className="container mx-auto p-6 space-y-8 relative z-10">
//         {/* Header */}
//         <motion.div
//           className="flex flex-col md:flex-row md:items-center md:justify-between gap-6"
//           initial={{ opacity: 0, y: -30 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.8 }}
//         >
//           <div className="space-y-2">
//             <motion.div
//               initial={{ opacity: 0, x: -20 }}
//               animate={{ opacity: 1, x: 0 }}
//               transition={{ delay: 0.2, duration: 0.6 }}
//               className="flex items-center gap-3"
//             >
//               <motion.div
//                 animate={{ rotate: [0, 360] }}
//                 transition={{
//                   duration: 3,
//                   repeat: Infinity,
//                   ease: "linear",
//                 }}
//               >
//                 <BarChart3 className="text-indigo-600" size={32} />
//               </motion.div>
//               <h1 className="text-6xl font-black bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
//                 Accounting
//               </h1>
//             </motion.div>
//             <motion.p
//               initial={{ opacity: 0, x: -20 }}
//               animate={{ opacity: 1, x: 0 }}
//               transition={{ delay: 0.3, duration: 0.6 }}
//               className="text-slate-600 text-lg font-medium ml-1"
//             >
//               Track your financial performance and metrics
//             </motion.p>
//           </div>

//           <div className="flex gap-4">
//             <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
//               <SelectTrigger className="w-[200px] h-12 border-2 border-slate-200 bg-white/90 backdrop-blur-xl focus:ring-2 focus:ring-indigo-500/40">
//                 <SelectValue />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="thisMonth">This Month</SelectItem>
//                 <SelectItem value="lastMonth">Last Month</SelectItem>
//                 <SelectItem value="thisYear">This Year</SelectItem>
//                 <SelectItem value="all">All Time</SelectItem>
//               </SelectContent>
//             </Select>

//             {companies && companies.length > 1 && (
//               <Select
//                 value={selectedCompanyId || "all"}
//                 onValueChange={(value) =>
//                   setSelectedCompanyId(value === "all" ? null : value)
//                 }
//               >
//                 <SelectTrigger className="w-[250px] h-12 border-2 border-slate-200 bg-white/90 backdrop-blur-xl">
//                   <SelectValue placeholder="All Companies" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="all">All Companies</SelectItem>
//                   {companies.map((company: any) => (
//                     <SelectItem key={company._id} value={company._id}>
//                       {company.name}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             )}
//           </div>
//         </motion.div>

//         {/* Stats Grid */}
//         {accountingData && (
//           <>
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//               <StatCard
//                 icon={DollarSign}
//                 title="Total Revenue"
//                 value={formatCurrency(accountingData.totalRevenue)}
//                 color="from-blue-500 to-indigo-600"
//                 delay={0}
//                 trend={12}
//                 subtitle={`${accountingData.invoiceCount} invoices`}
//               />
//               <StatCard
//                 icon={TrendingUp}
//                 title="Paid Revenue"
//                 value={formatCurrency(accountingData.paidRevenue)}
//                 color="from-emerald-500 to-teal-600"
//                 delay={0.1}
//                 trend={8}
//               />
//               <StatCard
//                 icon={TrendingUp}
//                 title="Net Revenue"
//                 value={formatCurrency(accountingData.netRevenue)}
//                 color="from-purple-500 to-pink-600"
//                 delay={0.2}
//                 subtitle="After tax deductions"
//               />
//               <StatCard
//                 icon={FileText}
//                 title="Total Tax"
//                 value={formatCurrency(accountingData.totalTax)}
//                 color="from-orange-500 to-red-600"
//                 delay={0.3}
//               />
//             </div>

//             {/* Charts */}
//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//               {/* Revenue Breakdown Chart */}
//               <motion.div
//                 initial={{ opacity: 0, y: 30 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ delay: 0.4, duration: 0.6 }}
//                 whileHover={{ scale: 1.02, y: -8 }}
//               >
//                 <Card className="border-0 shadow-2xl bg-gradient-to-br from-white/95 to-white/90 backdrop-blur-xl hover:shadow-3xl transition-all duration-500 overflow-hidden group">
//                   <CardHeader className="border-b border-slate-100/50 bg-gradient-to-r from-slate-50/50 to-indigo-50/30 pb-5">
//                     <div className="flex items-center gap-3">
//                       <motion.div
//                         className="w-2 h-10 bg-gradient-to-b from-indigo-500 via-purple-500 to-pink-500 rounded-full shadow-lg"
//                         animate={{ scaleY: [1, 1.2, 1] }}
//                         transition={{ duration: 2, repeat: Infinity }}
//                       />
//                       <CardTitle className="text-2xl font-bold">
//                         Revenue by Status
//                       </CardTitle>
//                     </div>
//                   </CardHeader>
//                   <CardContent className="h-[400px] p-8">
//                     <ResponsiveContainer width="100%" height="100%">
//                       <PieChart>
//                         <Pie
//                           data={accountingData.statusData}
//                           dataKey="value"
//                           nameKey="name"
//                           cx="50%"
//                           cy="50%"
//                           outerRadius={120}
//                           innerRadius={60}
//                           label={({ name, percent }) =>
//                             `${name} ${(percent * 100).toFixed(0)}%`
//                           }
//                           animationDuration={1200}
//                           paddingAngle={3}
//                         >
//                           {accountingData.statusData.map(
//                             (entry: any, index: number) => (
//                               <Cell
//                                 key={`cell-${index}`}
//                                 fill={COLORS[index % COLORS.length]}
//                               />
//                             )
//                           )}
//                         </Pie>
//                         <Tooltip content={<CustomTooltip />} />
//                       </PieChart>
//                     </ResponsiveContainer>
//                   </CardContent>
//                 </Card>
//               </motion.div>

//               {/* Monthly Trend Chart */}
//               <motion.div
//                 initial={{ opacity: 0, y: 30 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ delay: 0.5, duration: 0.6 }}
//                 whileHover={{ scale: 1.02, y: -8 }}
//               >
//                 <Card className="border-0 shadow-2xl bg-gradient-to-br from-white/95 to-white/90 backdrop-blur-xl hover:shadow-3xl transition-all duration-500 overflow-hidden group">
//                   <CardHeader className="border-b border-slate-100/50 bg-gradient-to-r from-slate-50/50 to-purple-50/30 pb-5">
//                     <div className="flex items-center gap-3">
//                       <motion.div
//                         className="w-2 h-10 bg-gradient-to-b from-purple-500 via-pink-500 to-rose-500 rounded-full shadow-lg"
//                         animate={{ scaleY: [1, 1.2, 1] }}
//                         transition={{
//                           duration: 2,
//                           repeat: Infinity,
//                           delay: 0.5,
//                         }}
//                       />
//                       <CardTitle className="text-2xl font-bold">
//                         Monthly Breakdown
//                       </CardTitle>
//                     </div>
//                   </CardHeader>
//                   <CardContent className="h-[400px] p-8">
//                     <ResponsiveContainer width="100%" height="100%">
//                       <BarChart data={accountingData.chartData}>
//                         <CartesianGrid
//                           strokeDasharray="3 3"
//                           stroke="#e2e8f0"
//                           opacity={0.6}
//                         />
//                         <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
//                         <YAxis stroke="#64748b" fontSize={12} />
//                         <Tooltip content={<CustomTooltip />} />
//                         <Legend />
//                         <Bar
//                           dataKey="revenue"
//                           fill="#8b5cf6"
//                           radius={[8, 8, 0, 0]}
//                           name="Revenue"
//                         />
//                         <Bar
//                           dataKey="tax"
//                           fill="#f59e0b"
//                           radius={[8, 8, 0, 0]}
//                           name="Tax"
//                         />
//                         <Bar
//                           dataKey="net"
//                           fill="#10b981"
//                           radius={[8, 8, 0, 0]}
//                           name="Net"
//                         />
//                       </BarChart>
//                     </ResponsiveContainer>
//                   </CardContent>
//                 </Card>
//               </motion.div>

//               {/* Full Width Revenue Trend */}
//               <motion.div
//                 initial={{ opacity: 0, y: 30 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ delay: 0.6, duration: 0.6 }}
//                 whileHover={{ scale: 1.01, y: -8 }}
//                 className="col-span-1 lg:col-span-2"
//               >
//                 <Card className="border-0 shadow-2xl bg-gradient-to-br from-white/95 to-white/90 backdrop-blur-xl hover:shadow-3xl transition-all duration-500 overflow-hidden group">
//                   <CardHeader className="border-b border-slate-100/50 bg-gradient-to-r from-slate-50/50 to-pink-50/30 pb-5">
//                     <div className="flex items-center gap-3">
//                       <motion.div
//                         className="w-2 h-10 bg-gradient-to-b from-pink-500 via-rose-500 to-red-500 rounded-full shadow-lg"
//                         animate={{ scaleY: [1, 1.2, 1] }}
//                         transition={{ duration: 2, repeat: Infinity, delay: 1 }}
//                       />
//                       <CardTitle className="text-2xl font-bold">
//                         Revenue Trend Over Time
//                       </CardTitle>
//                     </div>
//                   </CardHeader>
//                   <CardContent className="h-[400px] p-8">
//                     <ResponsiveContainer width="100%" height="100%">
//                       <AreaChart data={accountingData.chartData}>
//                         <defs>
//                           <linearGradient
//                             id="revenueGradient"
//                             x1="0"
//                             y1="0"
//                             x2="0"
//                             y2="1"
//                           >
//                             <stop
//                               offset="0%"
//                               stopColor="#8b5cf6"
//                               stopOpacity={0.8}
//                             />
//                             <stop
//                               offset="100%"
//                               stopColor="#8b5cf6"
//                               stopOpacity={0.1}
//                             />
//                           </linearGradient>
//                         </defs>
//                         <CartesianGrid
//                           strokeDasharray="3 3"
//                           stroke="#e2e8f0"
//                           opacity={0.6}
//                         />
//                         <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
//                         <YAxis stroke="#64748b" fontSize={12} />
//                         <Tooltip content={<CustomTooltip />} />
//                         <Area
//                           type="monotone"
//                           dataKey="revenue"
//                           stroke="#8b5cf6"
//                           fill="url(#revenueGradient)"
//                           strokeWidth={3}
//                           animationDuration={1500}
//                         />
//                       </AreaChart>
//                     </ResponsiveContainer>
//                   </CardContent>
//                 </Card>
//               </motion.div>
//             </div>
//           </>
//         )}
//       </div>
//     </div>
//   );
// }

// "use client";

// import { useState, useMemo } from "react";
// import { useUser } from "@clerk/nextjs";
// import { useQuery } from "convex/react";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { motion } from "framer-motion";
// import {
//   DollarSign,
//   TrendingUp,
//   TrendingDown,
//   Calendar,
//   FileText,
//   BarChart3,
//   Sparkles,
//   ArrowUpRight,
//   ArrowDownRight,
//   Activity,
// } from "lucide-react";
// import {
//   AreaChart,
//   Area,
//   BarChart,
//   Bar,
//   PieChart,
//   Pie,
//   Cell,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
//   Legend,
// } from "recharts";
// import { formatCurrency } from "@/lib/currency";
// import { api } from "@/convex/_generated/api";

// const COLORS = ["#6366f1", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981"];

// // Custom Tooltip Component
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
//             {typeof entry.value === "number" && entry.value > 1000
//               ? formatCurrency(entry.value)
//               : entry.value}
//           </p>
//         ))}
//       </motion.div>
//     );
//   }
//   return null;
// };

// // Stat Card Component
// const StatCard = ({
//   icon: Icon,
//   title,
//   value,
//   color,
//   delay,
//   trend,
//   subtitle,
// }: {
//   icon: any;
//   title: string;
//   value: string | number;
//   color: string;
//   delay: number;
//   trend?: number | null;
//   subtitle?: string;
// }) => (
//   <motion.div
//     initial={{ opacity: 0, y: 20, scale: 0.95 }}
//     animate={{ opacity: 1, y: 0, scale: 1 }}
//     transition={{ duration: 0.6, delay }}
//     whileHover={{
//       scale: 1.05,
//       y: -12,
//       transition: { duration: 0.3 },
//     }}
//   >
//     <Card className="relative border-0 shadow-xl bg-gradient-to-br from-white/95 to-white/80 backdrop-blur-2xl hover:shadow-2xl transition-all duration-700 overflow-hidden group">
//       <div
//         className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-15 transition-opacity duration-700`}
//       />
//       <motion.div
//         className={`absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br ${color} rounded-full blur-3xl`}
//         initial={{ opacity: 0.1, scale: 0.8 }}
//         whileHover={{ opacity: 0.25, scale: 1.2 }}
//         transition={{ duration: 0.8 }}
//       />
//       <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
//         <motion.div
//           className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
//           animate={{
//             x: ["-100%", "100%"],
//           }}
//           transition={{
//             duration: 1.5,
//             repeat: Infinity,
//             repeatDelay: 3,
//             ease: "easeInOut",
//           }}
//         />
//       </div>
//       <CardHeader className="pb-3 relative z-10">
//         <div className="flex items-center justify-between">
//           <motion.div
//             className={`p-3.5 rounded-2xl bg-gradient-to-br ${color} shadow-xl relative overflow-hidden`}
//             whileHover={{ rotate: [0, -5, 5, -5, 0], scale: 1.1 }}
//             transition={{ duration: 0.6 }}
//           >
//             <motion.div
//               className="absolute inset-0 bg-white/20"
//               animate={{
//                 scale: [1, 1.5, 1],
//                 opacity: [0.5, 0, 0.5],
//               }}
//               transition={{
//                 duration: 2,
//                 repeat: Infinity,
//                 ease: "easeInOut",
//               }}
//             />
//             <Icon className="text-white relative z-10" size={24} />
//           </motion.div>
//           {trend !== undefined && trend !== null && (
//             <motion.div
//               initial={{ opacity: 0, x: -10, scale: 0.8 }}
//               animate={{ opacity: 1, x: 0, scale: 1 }}
//               transition={{
//                 delay: delay + 0.3,
//                 type: "spring",
//                 stiffness: 200,
//               }}
//               className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-bold bg-white/80 backdrop-blur-sm shadow-md"
//             >
//               {trend > 0 ? (
//                 <>
//                   <ArrowUpRight size={16} className="text-emerald-500" />
//                   <span className="text-emerald-600">+{trend}%</span>
//                 </>
//               ) : trend < 0 ? (
//                 <>
//                   <ArrowDownRight size={16} className="text-rose-500" />
//                   <span className="text-rose-600">{trend}%</span>
//                 </>
//               ) : null}
//             </motion.div>
//           )}
//         </div>
//         <CardTitle className="text-sm font-semibold text-slate-500 mt-5 tracking-wide uppercase">
//           {title}
//         </CardTitle>
//       </CardHeader>
//       <CardContent className="relative z-10">
//         <motion.div
//           className="text-3xl font-black bg-gradient-to-br from-slate-900 via-slate-800 to-slate-600 bg-clip-text text-transparent"
//           initial={{ scale: 0.5, opacity: 0 }}
//           animate={{ scale: 1, opacity: 1 }}
//           transition={{
//             type: "spring",
//             stiffness: 150,
//             damping: 15,
//             delay: delay + 0.2,
//           }}
//         >
//           {value}
//         </motion.div>
//         {subtitle && (
//           <p className="text-xs text-slate-500 mt-2 font-medium">{subtitle}</p>
//         )}
//       </CardContent>
//       <motion.div
//         className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${color}`}
//         initial={{ scaleX: 0 }}
//         animate={{ scaleX: 1 }}
//         transition={{ delay: delay + 0.4, duration: 0.6 }}
//       />
//     </Card>
//   </motion.div>
// );

// export default function AccountingPage() {
//   const { user } = useUser();
//   const [selectedPeriod, setSelectedPeriod] = useState("thisMonth");
//   const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(
//     null
//   );

//   const invoices = useQuery(api.invoices.getInvoicesByUser, user ? {} : "skip");

//   const companies = useQuery(
//     api.companies.getCompaniesByUser,
//     user ? {} : "skip"
//   );

//   // Calculate accounting metrics
//   const accountingData = useMemo(() => {
//     if (!invoices) return null;

//     const now = new Date();
//     let filteredInvoices = invoices;

//     // Filter by period
//     if (selectedPeriod === "thisMonth") {
//       filteredInvoices = invoices.filter((inv: any) => {
//         const date = new Date(inv.issueDate);
//         return (
//           date.getMonth() === now.getMonth() &&
//           date.getFullYear() === now.getFullYear()
//         );
//       });
//     } else if (selectedPeriod === "lastMonth") {
//       const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1);
//       filteredInvoices = invoices.filter((inv: any) => {
//         const date = new Date(inv.issueDate);
//         return (
//           date.getMonth() === lastMonth.getMonth() &&
//           date.getFullYear() === lastMonth.getFullYear()
//         );
//       });
//     } else if (selectedPeriod === "thisYear") {
//       filteredInvoices = invoices.filter((inv: any) => {
//         const date = new Date(inv.issueDate);
//         return date.getFullYear() === now.getFullYear();
//       });
//     }

//     // Filter by company
//     if (selectedCompanyId) {
//       filteredInvoices = filteredInvoices.filter(
//         (inv: any) => inv.companyId === selectedCompanyId
//       );
//     }

//     const totalRevenue = filteredInvoices.reduce(
//       (sum: number, inv: any) => sum + inv.total,
//       0
//     );
//     const paidRevenue = filteredInvoices
//       .filter((inv: any) => inv.status === "paid")
//       .reduce((sum: number, inv: any) => sum + inv.total, 0);
//     const pendingRevenue = filteredInvoices
//       .filter((inv: any) => inv.status === "sent")
//       .reduce((sum: number, inv: any) => sum + inv.total, 0);
//     const overdueRevenue = filteredInvoices
//       .filter((inv: any) => inv.status === "overdue")
//       .reduce((sum: number, inv: any) => sum + inv.total, 0);
//     const draftRevenue = filteredInvoices
//       .filter((inv: any) => inv.status === "draft")
//       .reduce((sum: number, inv: any) => sum + inv.total, 0);

//     const totalTax = filteredInvoices.reduce(
//       (sum: number, inv: any) => sum + inv.tax,
//       0
//     );
//     const netRevenue = paidRevenue - totalTax;

//     // Monthly breakdown
//     const monthlyData = filteredInvoices.reduce((acc: any, inv: any) => {
//       const date = new Date(inv.issueDate);
//       const monthKey = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}`;
//       if (!acc[monthKey]) {
//         acc[monthKey] = { revenue: 0, tax: 0, net: 0 };
//       }
//       acc[monthKey].revenue += inv.total;
//       acc[monthKey].tax += inv.tax;
//       acc[monthKey].net += inv.total - inv.tax;
//       return acc;
//     }, {});

//     const chartData = Object.entries(monthlyData)
//       .map(([month, data]: [string, any]) => ({
//         month: new Date(month + "-01").toLocaleString("default", {
//           month: "short",
//           year: "2-digit",
//         }),
//         revenue: data.revenue,
//         tax: data.tax,
//         net: data.net,
//       }))
//       .sort(
//         (a, b) => new Date(a.month).getTime() - new Date(b.month).getTime()
//       );

//     // Status distribution
//     const statusData = [
//       { name: "Paid", value: paidRevenue },
//       { name: "Pending", value: pendingRevenue },
//       { name: "Overdue", value: overdueRevenue },
//       { name: "Draft", value: draftRevenue },
//     ].filter((item) => item.value > 0);

//     return {
//       totalRevenue,
//       paidRevenue,
//       pendingRevenue,
//       overdueRevenue,
//       totalTax,
//       netRevenue,
//       chartData,
//       statusData,
//       invoiceCount: filteredInvoices.length,
//     };
//   }, [invoices, selectedPeriod, selectedCompanyId]);

//   if (!user || !invoices || !companies) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/20 flex items-center justify-center">
//         <motion.div
//           animate={{ rotate: 360 }}
//           transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
//         >
//           <Activity className="text-indigo-600" size={48} />
//         </motion.div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/40 to-purple-50/30 relative overflow-hidden mt-20">
//       {/* Animated background elements */}
//       <div className="absolute inset-0 overflow-hidden pointer-events-none">
//         <motion.div
//           className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-400/10 rounded-full blur-3xl"
//           animate={{
//             scale: [1, 1.2, 1],
//             x: [0, 50, 0],
//             y: [0, 30, 0],
//           }}
//           transition={{
//             duration: 8,
//             repeat: Infinity,
//             ease: "easeInOut",
//           }}
//         />
//         <motion.div
//           className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl"
//           animate={{
//             scale: [1, 1.3, 1],
//             x: [0, -50, 0],
//             y: [0, -30, 0],
//           }}
//           transition={{
//             duration: 10,
//             repeat: Infinity,
//             ease: "easeInOut",
//             delay: 1,
//           }}
//         />
//       </div>

//       <div className="container mx-auto p-6 space-y-8 relative z-10">
//         {/* Header */}
//         <motion.div
//           className="flex flex-col md:flex-row md:items-center md:justify-between gap-6"
//           initial={{ opacity: 0, y: -30 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.8 }}
//         >
//           <div className="space-y-2">
//             <motion.div
//               initial={{ opacity: 0, x: -20 }}
//               animate={{ opacity: 1, x: 0 }}
//               transition={{ delay: 0.2, duration: 0.6 }}
//               className="flex items-center gap-3"
//             >
//               <motion.div
//                 animate={{ rotate: [0, 360] }}
//                 transition={{
//                   duration: 3,
//                   repeat: Infinity,
//                   ease: "linear",
//                 }}
//               >
//                 <BarChart3 className="text-indigo-600" size={32} />
//               </motion.div>
//               <h1 className="text-6xl font-black bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
//                 Accounting
//               </h1>
//             </motion.div>
//             <motion.p
//               initial={{ opacity: 0, x: -20 }}
//               animate={{ opacity: 1, x: 0 }}
//               transition={{ delay: 0.3, duration: 0.6 }}
//               className="text-slate-600 text-lg font-medium ml-1"
//             >
//               Track your financial performance and metrics
//             </motion.p>
//           </div>

//           <div className="flex gap-4">
//             <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
//               <SelectTrigger className="w-[200px] h-12 border-2 border-slate-200 bg-white/90 backdrop-blur-xl focus:ring-2 focus:ring-indigo-500/40">
//                 <SelectValue />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="thisMonth">This Month</SelectItem>
//                 <SelectItem value="lastMonth">Last Month</SelectItem>
//                 <SelectItem value="thisYear">This Year</SelectItem>
//                 <SelectItem value="all">All Time</SelectItem>
//               </SelectContent>
//             </Select>

//             {companies && companies.length > 1 && (
//               <Select
//                 value={selectedCompanyId || "all"}
//                 onValueChange={(value) =>
//                   setSelectedCompanyId(value === "all" ? null : value)
//                 }
//               >
//                 <SelectTrigger className="w-[250px] h-12 border-2 border-slate-200 bg-white/90 backdrop-blur-xl">
//                   <SelectValue placeholder="All Companies" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="all">All Companies</SelectItem>
//                   {companies.map((company: any) => (
//                     <SelectItem key={company._id} value={company._id}>
//                       {company.name}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             )}
//           </div>
//         </motion.div>

//         {/* Stats Grid */}
//         {accountingData && (
//           <>
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//               <StatCard
//                 icon={DollarSign}
//                 title="Total Revenue"
//                 value={formatCurrency(accountingData.totalRevenue)}
//                 color="from-blue-500 to-indigo-600"
//                 delay={0}
//                 trend={12}
//                 subtitle={`${accountingData.invoiceCount} invoices`}
//               />
//               <StatCard
//                 icon={TrendingUp}
//                 title="Paid Revenue"
//                 value={formatCurrency(accountingData.paidRevenue)}
//                 color="from-emerald-500 to-teal-600"
//                 delay={0.1}
//                 trend={8}
//               />
//               <StatCard
//                 icon={TrendingUp}
//                 title="Net Revenue"
//                 value={formatCurrency(accountingData.netRevenue)}
//                 color="from-purple-500 to-pink-600"
//                 delay={0.2}
//                 subtitle="After tax deductions"
//               />
//               <StatCard
//                 icon={FileText}
//                 title="Total Tax"
//                 value={formatCurrency(accountingData.totalTax)}
//                 color="from-orange-500 to-red-600"
//                 delay={0.3}
//               />
//             </div>

//             {/* Charts */}
//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//               {/* Revenue Breakdown Chart */}
//               <motion.div
//                 initial={{ opacity: 0, y: 30 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ delay: 0.4, duration: 0.6 }}
//                 whileHover={{ scale: 1.02, y: -8 }}
//               >
//                 <Card className="border-0 shadow-2xl bg-gradient-to-br from-white/95 to-white/90 backdrop-blur-xl hover:shadow-3xl transition-all duration-500 overflow-hidden group">
//                   <CardHeader className="border-b border-slate-100/50 bg-gradient-to-r from-slate-50/50 to-indigo-50/30 pb-5">
//                     <div className="flex items-center gap-3">
//                       <motion.div
//                         className="w-2 h-10 bg-gradient-to-b from-indigo-500 via-purple-500 to-pink-500 rounded-full shadow-lg"
//                         animate={{ scaleY: [1, 1.2, 1] }}
//                         transition={{ duration: 2, repeat: Infinity }}
//                       />
//                       <CardTitle className="text-2xl font-bold">
//                         Revenue by Status
//                       </CardTitle>
//                     </div>
//                   </CardHeader>
//                   <CardContent className="h-[400px] p-8">
//                     <ResponsiveContainer width="100%" height="100%">
//                       <PieChart>
//                         <Pie
//                           data={accountingData.statusData}
//                           dataKey="value"
//                           nameKey="name"
//                           cx="50%"
//                           cy="50%"
//                           outerRadius={120}
//                           innerRadius={60}
//                           label={({ name, percent }) =>
//                             `${name} ${(percent * 100).toFixed(0)}%`
//                           }
//                           animationDuration={1200}
//                           paddingAngle={3}
//                         >
//                           {accountingData.statusData.map(
//                             (entry: any, index: number) => (
//                               <Cell
//                                 key={`cell-${index}`}
//                                 fill={COLORS[index % COLORS.length]}
//                               />
//                             )
//                           )}
//                         </Pie>
//                         <Tooltip content={<CustomTooltip />} />
//                       </PieChart>
//                     </ResponsiveContainer>
//                   </CardContent>
//                 </Card>
//               </motion.div>

//               {/* Monthly Trend Chart */}
//               <motion.div
//                 initial={{ opacity: 0, y: 30 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ delay: 0.5, duration: 0.6 }}
//                 whileHover={{ scale: 1.02, y: -8 }}
//               >
//                 <Card className="border-0 shadow-2xl bg-gradient-to-br from-white/95 to-white/90 backdrop-blur-xl hover:shadow-3xl transition-all duration-500 overflow-hidden group">
//                   <CardHeader className="border-b border-slate-100/50 bg-gradient-to-r from-slate-50/50 to-purple-50/30 pb-5">
//                     <div className="flex items-center gap-3">
//                       <motion.div
//                         className="w-2 h-10 bg-gradient-to-b from-purple-500 via-pink-500 to-rose-500 rounded-full shadow-lg"
//                         animate={{ scaleY: [1, 1.2, 1] }}
//                         transition={{
//                           duration: 2,
//                           repeat: Infinity,
//                           delay: 0.5,
//                         }}
//                       />
//                       <CardTitle className="text-2xl font-bold">
//                         Monthly Breakdown
//                       </CardTitle>
//                     </div>
//                   </CardHeader>
//                   <CardContent className="h-[400px] p-8">
//                     <ResponsiveContainer width="100%" height="100%">
//                       <BarChart data={accountingData.chartData}>
//                         <CartesianGrid
//                           strokeDasharray="3 3"
//                           stroke="#e2e8f0"
//                           opacity={0.6}
//                         />
//                         <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
//                         <YAxis stroke="#64748b" fontSize={12} />
//                         <Tooltip content={<CustomTooltip />} />
//                         <Legend />
//                         <Bar
//                           dataKey="revenue"
//                           fill="#8b5cf6"
//                           radius={[8, 8, 0, 0]}
//                           name="Revenue"
//                         />
//                         <Bar
//                           dataKey="tax"
//                           fill="#f59e0b"
//                           radius={[8, 8, 0, 0]}
//                           name="Tax"
//                         />
//                         <Bar
//                           dataKey="net"
//                           fill="#10b981"
//                           radius={[8, 8, 0, 0]}
//                           name="Net"
//                         />
//                       </BarChart>
//                     </ResponsiveContainer>
//                   </CardContent>
//                 </Card>
//               </motion.div>

//               {/* Full Width Revenue Trend */}
//               <motion.div
//                 initial={{ opacity: 0, y: 30 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ delay: 0.6, duration: 0.6 }}
//                 whileHover={{ scale: 1.01, y: -8 }}
//                 className="col-span-1 lg:col-span-2"
//               >
//                 <Card className="border-0 shadow-2xl bg-gradient-to-br from-white/95 to-white/90 backdrop-blur-xl hover:shadow-3xl transition-all duration-500 overflow-hidden group">
//                   <CardHeader className="border-b border-slate-100/50 bg-gradient-to-r from-slate-50/50 to-pink-50/30 pb-5">
//                     <div className="flex items-center gap-3">
//                       <motion.div
//                         className="w-2 h-10 bg-gradient-to-b from-pink-500 via-rose-500 to-red-500 rounded-full shadow-lg"
//                         animate={{ scaleY: [1, 1.2, 1] }}
//                         transition={{ duration: 2, repeat: Infinity, delay: 1 }}
//                       />
//                       <CardTitle className="text-2xl font-bold">
//                         Revenue Trend Over Time
//                       </CardTitle>
//                     </div>
//                   </CardHeader>
//                   <CardContent className="h-[400px] p-8">
//                     <ResponsiveContainer width="100%" height="100%">
//                       <AreaChart data={accountingData.chartData}>
//                         <defs>
//                           <linearGradient
//                             id="revenueGradient"
//                             x1="0"
//                             y1="0"
//                             x2="0"
//                             y2="1"
//                           >
//                             <stop
//                               offset="0%"
//                               stopColor="#8b5cf6"
//                               stopOpacity={0.8}
//                             />
//                             <stop
//                               offset="100%"
//                               stopColor="#8b5cf6"
//                               stopOpacity={0.1}
//                             />
//                           </linearGradient>
//                         </defs>
//                         <CartesianGrid
//                           strokeDasharray="3 3"
//                           stroke="#e2e8f0"
//                           opacity={0.6}
//                         />
//                         <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
//                         <YAxis stroke="#64748b" fontSize={12} />
//                         <Tooltip content={<CustomTooltip />} />
//                         <Area
//                           type="monotone"
//                           dataKey="revenue"
//                           stroke="#8b5cf6"
//                           fill="url(#revenueGradient)"
//                           strokeWidth={3}
//                           animationDuration={1500}
//                         />
//                       </AreaChart>
//                     </ResponsiveContainer>
//                   </CardContent>
//                 </Card>
//               </motion.div>
//             </div>
//           </>
//         )}
//       </div>
//     </div>
//   );
// }

"use client";

import { useState, useMemo, useRef } from "react";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Calendar,
  FileText,
  BarChart3,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Download,
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { formatCurrency } from "@/lib/currency";
import { api } from "@/convex/_generated/api";

const COLORS = ["#6366f1", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981"];

// Custom Tooltip Component
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
            {typeof entry.value === "number" && entry.value > 1000
              ? formatCurrency(entry.value)
              : entry.value}
          </p>
        ))}
      </motion.div>
    );
  }
  return null;
};

// Stat Card Component
const StatCard = ({
  icon: Icon,
  title,
  value,
  color,
  delay,
  trend,
  subtitle,
}: {
  icon: any;
  title: string;
  value: string | number;
  color: string;
  delay: number;
  trend?: number | null;
  subtitle?: string;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20, scale: 0.95 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    transition={{ duration: 0.6, delay }}
    whileHover={{
      scale: 1.05,
      y: -12,
      transition: { duration: 0.3 },
    }}
  >
    <Card className="relative border-0 shadow-xl bg-gradient-to-br from-white/95 to-white/80 backdrop-blur-2xl hover:shadow-2xl transition-all duration-700 overflow-hidden group">
      <div
        className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-15 transition-opacity duration-700`}
      />
      <motion.div
        className={`absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br ${color} rounded-full blur-3xl`}
        initial={{ opacity: 0.1, scale: 0.8 }}
        whileHover={{ opacity: 0.25, scale: 1.2 }}
        transition={{ duration: 0.8 }}
      />
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
          animate={{
            x: ["-100%", "100%"],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            repeatDelay: 3,
            ease: "easeInOut",
          }}
        />
      </div>
      <CardHeader className="pb-3 relative z-10">
        <div className="flex items-center justify-between">
          <motion.div
            className={`p-3.5 rounded-2xl bg-gradient-to-br ${color} shadow-xl relative overflow-hidden`}
            whileHover={{ rotate: [0, -5, 5, -5, 0], scale: 1.1 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              className="absolute inset-0 bg-white/20"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 0, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            <Icon className="text-white relative z-10" size={24} />
          </motion.div>
          {trend !== undefined && trend !== null && (
            <motion.div
              initial={{ opacity: 0, x: -10, scale: 0.8 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{
                delay: delay + 0.3,
                type: "spring",
                stiffness: 200,
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-bold bg-white/80 backdrop-blur-sm shadow-md"
            >
              {trend > 0 ? (
                <>
                  <ArrowUpRight size={16} className="text-emerald-500" />
                  <span className="text-emerald-600">+{trend}%</span>
                </>
              ) : trend < 0 ? (
                <>
                  <ArrowDownRight size={16} className="text-rose-500" />
                  <span className="text-rose-600">{trend}%</span>
                </>
              ) : null}
            </motion.div>
          )}
        </div>
        <CardTitle className="text-sm font-semibold text-slate-500 mt-5 tracking-wide uppercase">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="relative z-10">
        <motion.div
          className="text-3xl font-black bg-gradient-to-br from-slate-900 via-slate-800 to-slate-600 bg-clip-text text-transparent"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            type: "spring",
            stiffness: 150,
            damping: 15,
            delay: delay + 0.2,
          }}
        >
          {value}
        </motion.div>
        {subtitle && (
          <p className="text-xs text-slate-500 mt-2 font-medium">{subtitle}</p>
        )}
      </CardContent>
      <motion.div
        className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${color}`}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: delay + 0.4, duration: 0.6 }}
      />
    </Card>
  </motion.div>
);

export default function AccountingPage() {
  const { user } = useUser();
  const [selectedPeriod, setSelectedPeriod] = useState("thisMonth");
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(
    null
  );

  const invoices = useQuery(api.invoices.getInvoicesByUser, user ? {} : "skip");

  const companies = useQuery(
    api.companies.getCompaniesByUser,
    user ? {} : "skip"
  );

  const statsRef = useRef<HTMLDivElement>(null);
  const pieChartRef = useRef<HTMLDivElement>(null);
  const barChartRef = useRef<HTMLDivElement>(null);
  const areaChartRef = useRef<HTMLDivElement>(null);

  // Calculate accounting metrics
  const accountingData = useMemo(() => {
    if (!invoices) return null;

    const now = new Date();
    let filteredInvoices = invoices;

    // Filter by period
    if (selectedPeriod === "thisMonth") {
      filteredInvoices = invoices.filter((inv: any) => {
        const date = new Date(inv.issueDate);
        return (
          date.getMonth() === now.getMonth() &&
          date.getFullYear() === now.getFullYear()
        );
      });
    } else if (selectedPeriod === "lastMonth") {
      const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1);
      filteredInvoices = invoices.filter((inv: any) => {
        const date = new Date(inv.issueDate);
        return (
          date.getMonth() === lastMonth.getMonth() &&
          date.getFullYear() === lastMonth.getFullYear()
        );
      });
    } else if (selectedPeriod === "thisYear") {
      filteredInvoices = invoices.filter((inv: any) => {
        const date = new Date(inv.issueDate);
        return date.getFullYear() === now.getFullYear();
      });
    }

    // Filter by company
    if (selectedCompanyId) {
      filteredInvoices = filteredInvoices.filter(
        (inv: any) => inv.companyId === selectedCompanyId
      );
    }

    const totalRevenue = filteredInvoices.reduce(
      (sum: number, inv: any) => sum + inv.total,
      0
    );
    const paidRevenue = filteredInvoices
      .filter((inv: any) => inv.status === "paid")
      .reduce((sum: number, inv: any) => sum + inv.total, 0);
    const pendingRevenue = filteredInvoices
      .filter((inv: any) => inv.status === "sent")
      .reduce((sum: number, inv: any) => sum + inv.total, 0);
    const overdueRevenue = filteredInvoices
      .filter((inv: any) => inv.status === "overdue")
      .reduce((sum: number, inv: any) => sum + inv.total, 0);
    const draftRevenue = filteredInvoices
      .filter((inv: any) => inv.status === "draft")
      .reduce((sum: number, inv: any) => sum + inv.total, 0);

    const totalTax = filteredInvoices.reduce(
      (sum: number, inv: any) => sum + inv.tax,
      0
    );
    const netRevenue = paidRevenue - totalTax;

    // Monthly breakdown
    const monthlyData = filteredInvoices.reduce((acc: any, inv: any) => {
      const date = new Date(inv.issueDate);
      const monthKey = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}`;
      if (!acc[monthKey]) {
        acc[monthKey] = { revenue: 0, tax: 0, net: 0 };
      }
      acc[monthKey].revenue += inv.total;
      acc[monthKey].tax += inv.tax;
      acc[monthKey].net += inv.total - inv.tax;
      return acc;
    }, {});

    const chartData = Object.entries(monthlyData)
      .map(([month, data]: [string, any]) => ({
        month: new Date(month + "-01").toLocaleString("default", {
          month: "short",
          year: "2-digit",
        }),
        revenue: data.revenue,
        tax: data.tax,
        net: data.net,
      }))
      .sort(
        (a, b) => new Date(a.month).getTime() - new Date(b.month).getTime()
      );

    // Status distribution
    const statusData = [
      { name: "Paid", value: paidRevenue },
      { name: "Pending", value: pendingRevenue },
      { name: "Overdue", value: overdueRevenue },
      { name: "Draft", value: draftRevenue },
    ].filter((item) => item.value > 0);

    return {
      totalRevenue,
      paidRevenue,
      pendingRevenue,
      overdueRevenue,
      draftRevenue,
      totalTax,
      netRevenue,
      chartData,
      statusData,
      invoiceCount: filteredInvoices.length,
    };
  }, [invoices, selectedPeriod, selectedCompanyId]);

  const downloadPDF = async () => {
    if (!accountingData) return;

    const pdf = new jsPDF("p", "mm", "a4");
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    let y = 20; // Starting y position

    // Header
    pdf.setFontSize(20);
    pdf.text("Accounting Statistics", 20, y);
    y += 10;

    pdf.setFontSize(12);
    pdf.text(
      `Period: ${selectedPeriod.replace(/([A-Z])/g, " $1").trim()}`,
      20,
      y
    );
    y += 10;

    if (selectedCompanyId) {
      const company = companies?.find((c: any) => c._id === selectedCompanyId);
      pdf.text(`Company: ${company?.name || "Unknown"}`, 20, y);
      y += 10;
    }

    pdf.text(`Generated: ${new Date().toLocaleDateString()}`, 20, y);
    y += 20;

    // Stats as text
    pdf.setFontSize(14);
    pdf.text("Key Metrics:", 20, y);
    y += 10;

    pdf.setFontSize(12);
    pdf.text(
      `Total Revenue: ${formatCurrency(accountingData.totalRevenue)} (${accountingData.invoiceCount} invoices)`,
      20,
      y
    );
    y += 8;
    pdf.text(
      `Paid Revenue: ${formatCurrency(accountingData.paidRevenue)}`,
      20,
      y
    );
    y += 8;
    pdf.text(
      `Net Revenue: ${formatCurrency(accountingData.netRevenue)} (After tax)`,
      20,
      y
    );
    y += 8;
    pdf.text(`Total Tax: ${formatCurrency(accountingData.totalTax)}`, 20, y);
    y += 8;
    pdf.text(
      `Pending: ${formatCurrency(accountingData.pendingRevenue)}`,
      20,
      y
    );
    y += 8;
    pdf.text(
      `Overdue: ${formatCurrency(accountingData.overdueRevenue)}`,
      20,
      y
    );
    y += 8;
    pdf.text(`Draft: ${formatCurrency(accountingData.draftRevenue)}`, 20, y);
    y += 20;

    // Add charts as images
    const addImageToPdf = async (
      ref: React.RefObject<HTMLDivElement | null>,
      title: string
    ) => {
      if (ref.current) {
        if (y > pageHeight - 120) {
          pdf.addPage();
          y = 20;
        }
        pdf.setFontSize(14);
        pdf.text(title, 20, y);
        y += 10;

        const canvas = await html2canvas(ref.current, { scale: 2 });
        const imgData = canvas.toDataURL("image/png");
        const imgWidth = canvas.width / 2; // Scale down from higher res
        const imgHeight = canvas.height / 2;
        const ratio = Math.min((pageWidth - 40) / imgWidth, 100 / imgHeight);
        pdf.addImage(
          imgData,
          "PNG",
          20,
          y,
          imgWidth * ratio,
          imgHeight * ratio
        );
        y += imgHeight * ratio + 20;
      }
    };

    await addImageToPdf(pieChartRef, "Revenue by Status");
    await addImageToPdf(barChartRef, "Monthly Breakdown");
    await addImageToPdf(areaChartRef, "Revenue Trend Over Time");

    pdf.save("accounting_statistics.pdf");
  };

  if (!user || !invoices || !companies) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/20 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <Activity className="text-indigo-600" size={48} />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/40 to-purple-50/30 relative overflow-hidden mt-20">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-400/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            x: [0, -50, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        />
      </div>

      <div className="container mx-auto p-6 space-y-8 relative z-10">
        {/* Header */}
        <motion.div
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-6"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="space-y-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="flex items-center gap-3"
            >
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "linear",
                }}
              >
                <BarChart3 className="text-indigo-600" size={32} />
              </motion.div>
              <h1 className="text-6xl font-black bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Accounting
              </h1>
            </motion.div>
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-slate-600 text-lg font-medium ml-1"
            >
              Track your financial performance and metrics
            </motion.p>
          </div>

          <div className="flex gap-4 items-center">
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-[200px] h-12 border-2 border-slate-200 bg-white/90 backdrop-blur-xl focus:ring-2 focus:ring-indigo-500/40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="thisMonth">This Month</SelectItem>
                <SelectItem value="lastMonth">Last Month</SelectItem>
                <SelectItem value="thisYear">This Year</SelectItem>
                <SelectItem value="all">All Time</SelectItem>
              </SelectContent>
            </Select>

            {companies && companies.length > 1 && (
              <Select
                value={selectedCompanyId || "all"}
                onValueChange={(value) =>
                  setSelectedCompanyId(value === "all" ? null : value)
                }
              >
                <SelectTrigger className="w-[250px] h-12 border-2 border-slate-200 bg-white/90 backdrop-blur-xl">
                  <SelectValue placeholder="All Companies" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Companies</SelectItem>
                  {companies.map((company: any) => (
                    <SelectItem key={company._id} value={company._id}>
                      {company.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            <Button variant="outline" onClick={downloadPDF}>
              <Download className="mr-2 h-4 w-4" /> Download PDF
            </Button>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div ref={statsRef}>
          {accountingData && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                icon={DollarSign}
                title="Total Revenue"
                value={formatCurrency(accountingData.totalRevenue)}
                color="from-blue-500 to-indigo-600"
                delay={0}
                trend={12}
                subtitle={`${accountingData.invoiceCount} invoices`}
              />
              <StatCard
                icon={TrendingUp}
                title="Paid Revenue"
                value={formatCurrency(accountingData.paidRevenue)}
                color="from-emerald-500 to-teal-600"
                delay={0.1}
                trend={8}
              />
              <StatCard
                icon={TrendingUp}
                title="Net Revenue"
                value={formatCurrency(accountingData.netRevenue)}
                color="from-purple-500 to-pink-600"
                delay={0.2}
                subtitle="After tax deductions"
              />
              <StatCard
                icon={FileText}
                title="Total Tax"
                value={formatCurrency(accountingData.totalTax)}
                color="from-orange-500 to-red-600"
                delay={0.3}
              />
            </div>
          )}
        </div>

        {/* Charts */}
        {accountingData && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue Breakdown Chart */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              whileHover={{ scale: 1.02, y: -8 }}
              ref={pieChartRef}
            >
              <Card className="border-0 shadow-2xl bg-gradient-to-br from-white/95 to-white/90 backdrop-blur-xl hover:shadow-3xl transition-all duration-500 overflow-hidden group">
                <CardHeader className="border-b border-slate-100/50 bg-gradient-to-r from-slate-50/50 to-indigo-50/30 pb-5">
                  <div className="flex items-center gap-3">
                    <motion.div
                      className="w-2 h-10 bg-gradient-to-b from-indigo-500 via-purple-500 to-pink-500 rounded-full shadow-lg"
                      animate={{ scaleY: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                    <CardTitle className="text-2xl font-bold">
                      Revenue by Status
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="h-[400px] p-8">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={accountingData.statusData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={120}
                        innerRadius={60}
                        label={({ name, percent }) =>
                          `${name} ${(percent * 100).toFixed(0)}%`
                        }
                        animationDuration={1200}
                        paddingAngle={3}
                      >
                        {accountingData.statusData.map(
                          (entry: any, index: number) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={COLORS[index % COLORS.length]}
                            />
                          )
                        )}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </motion.div>

            {/* Monthly Trend Chart */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              whileHover={{ scale: 1.02, y: -8 }}
              ref={barChartRef}
            >
              <Card className="border-0 shadow-2xl bg-gradient-to-br from-white/95 to-white/90 backdrop-blur-xl hover:shadow-3xl transition-all duration-500 overflow-hidden group">
                <CardHeader className="border-b border-slate-100/50 bg-gradient-to-r from-slate-50/50 to-purple-50/30 pb-5">
                  <div className="flex items-center gap-3">
                    <motion.div
                      className="w-2 h-10 bg-gradient-to-b from-purple-500 via-pink-500 to-rose-500 rounded-full shadow-lg"
                      animate={{ scaleY: [1, 1.2, 1] }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: 0.5,
                      }}
                    />
                    <CardTitle className="text-2xl font-bold">
                      Monthly Breakdown
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="h-[400px] p-8">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={accountingData.chartData}>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="#e2e8f0"
                        opacity={0.6}
                      />
                      <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
                      <YAxis stroke="#64748b" fontSize={12} />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                      <Bar
                        dataKey="revenue"
                        fill="#8b5cf6"
                        radius={[8, 8, 0, 0]}
                        name="Revenue"
                      />
                      <Bar
                        dataKey="tax"
                        fill="#f59e0b"
                        radius={[8, 8, 0, 0]}
                        name="Tax"
                      />
                      <Bar
                        dataKey="net"
                        fill="#10b981"
                        radius={[8, 8, 0, 0]}
                        name="Net"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </motion.div>

            {/* Full Width Revenue Trend */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              whileHover={{ scale: 1.01, y: -8 }}
              className="col-span-1 lg:col-span-2"
              ref={areaChartRef}
            >
              <Card className="border-0 shadow-2xl bg-gradient-to-br from-white/95 to-white/90 backdrop-blur-xl hover:shadow-3xl transition-all duration-500 overflow-hidden group">
                <CardHeader className="border-b border-slate-100/50 bg-gradient-to-r from-slate-50/50 to-pink-50/30 pb-5">
                  <div className="flex items-center gap-3">
                    <motion.div
                      className="w-2 h-10 bg-gradient-to-b from-pink-500 via-rose-500 to-red-500 rounded-full shadow-lg"
                      animate={{ scaleY: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                    />
                    <CardTitle className="text-2xl font-bold">
                      Revenue Trend Over Time
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="h-[400px] p-8">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={accountingData.chartData}>
                      <defs>
                        <linearGradient
                          id="revenueGradient"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="0%"
                            stopColor="#8b5cf6"
                            stopOpacity={0.8}
                          />
                          <stop
                            offset="100%"
                            stopColor="#8b5cf6"
                            stopOpacity={0.1}
                          />
                        </linearGradient>
                      </defs>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="#e2e8f0"
                        opacity={0.6}
                      />
                      <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
                      <YAxis stroke="#64748b" fontSize={12} />
                      <Tooltip content={<CustomTooltip />} />
                      <Area
                        type="monotone"
                        dataKey="revenue"
                        stroke="#8b5cf6"
                        fill="url(#revenueGradient)"
                        strokeWidth={3}
                        animationDuration={1500}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
