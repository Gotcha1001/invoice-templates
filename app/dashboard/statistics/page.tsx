"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "../../../lib/currency";
import {
  Bar,
  BarChart,
  Pie,
  PieChart,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Cell,
  Area,
  AreaChart,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Id } from "@/convex/_generated/dataModel";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  AlertCircle,
  DollarSign,
  FileText,
  CheckCircle,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

const COLORS = ["#6366f1", "#8b5cf6", "#ec4899", "#ef4444"];
import { easeInOut } from "framer-motion";

const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: easeInOut },
  },
};

const chartVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.6, delay: 0.2 } },
};

const StatCard = ({
  icon: Icon,
  title,
  value,
  color,
  delay,
  trend,
}: {
  icon: React.ElementType;
  title: string;
  value: string | number;
  color: string;
  delay: number;
  trend: number | null;
}) => (
  <motion.div
    variants={cardVariants}
    initial="hidden"
    animate="visible"
    whileHover={{ scale: 1.03, y: -8 }}
    transition={{ delay }}
  >
    <Card className="relative border-0 shadow-lg bg-white/90 backdrop-blur-xl hover:shadow-2xl transition-all duration-500 overflow-hidden group">
      <div
        className={`absolute inset-0 bg-gradient-to-br ${color} opacity-5 group-hover:opacity-10 transition-opacity duration-500`}
      />
      <div
        className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${color} opacity-10 blur-3xl group-hover:opacity-20 transition-opacity duration-500`}
      />

      <CardHeader className="pb-3 relative z-10">
        <div className="flex items-center justify-between">
          <div
            className={`p-3 rounded-xl bg-gradient-to-br ${color} shadow-lg`}
          >
            <Icon className="text-white" size={24} />
          </div>
          {trend && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: delay + 0.3 }}
              className="flex items-center gap-1 text-sm font-semibold"
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
        <CardTitle className="text-sm font-medium text-slate-600 mt-4">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="relative z-10">
        <motion.div
          className="text-3xl font-bold bg-gradient-to-br from-slate-900 to-slate-700 bg-clip-text text-transparent"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, delay: delay + 0.1 }}
        >
          {value}
        </motion.div>
      </CardContent>

      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
      </div>
    </Card>
  </motion.div>
);

export default function StatisticsPage() {
  const { user } = useUser();
  const companies = useQuery(
    api.companies.getCompaniesByUser,
    user?.id ? { userId: user.id } : "skip"
  );
  const [selectedCompanyId, setSelectedCompanyId] = useState<
    string | undefined
  >(companies?.[0]?._id);
  const stats = useQuery(
    api.invoices.getStatsByCompany,
    selectedCompanyId
      ? { companyId: selectedCompanyId as Id<"companies"> }
      : "skip"
  );

  if (!companies) {
    return (
      <div className="container mx-auto p-6 space-y-8 min-h-screen">
        <Skeleton className="w-64 h-12 rounded-xl" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-40 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  const statusData = Object.entries(stats?.statusCounts || {}).map(
    ([name, value]) => ({ name, value })
  );
  const monthlyData = Object.entries(stats?.monthlyRevenue || {})
    .map(([month, revenue]) => ({
      month: new Date(month + "-01").toLocaleString("default", {
        month: "short",
        year: "2-digit",
      }),
      revenue,
    }))
    .sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime());

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/40 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-400/10 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        />
      </div>

      <div className="container mx-auto p-6 space-y-8 relative z-10">
        <motion.div
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
              Analytics Dashboard
            </h1>
            <p className="text-slate-600 text-lg">
              Track your invoice performance and revenue insights
            </p>
          </div>

          <AnimatePresence mode="wait">
            {companies.length > 1 ? (
              <motion.div
                key="selector"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.4 }}
              >
                <Select
                  value={selectedCompanyId}
                  onValueChange={setSelectedCompanyId}
                >
                  <SelectTrigger className="w-[280px] h-12 border-slate-200 bg-white/80 backdrop-blur-sm focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 hover:border-slate-300 transition-all duration-200 shadow-sm">
                    <SelectValue placeholder="Select a company" />
                  </SelectTrigger>
                  <SelectContent className="bg-white/95 backdrop-blur-md shadow-xl border-slate-200">
                    {companies.map((company) => (
                      <SelectItem
                        key={company._id}
                        value={company._id}
                        className="hover:bg-indigo-50 focus:bg-indigo-50 transition-colors cursor-pointer"
                      >
                        {company.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </motion.div>
            ) : companies.length === 1 ? (
              <motion.div
                key="single-company"
                className="flex items-center gap-3 px-6 py-3 bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-slate-200"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.4 }}
              >
                <Sparkles size={20} className="text-indigo-500" />
                <span className="text-lg font-semibold text-slate-800">
                  {companies[0].name}
                </span>
              </motion.div>
            ) : (
              <motion.p
                key="no-company"
                className="text-lg text-slate-600 italic"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.4 }}
              >
                No companies found. Create one to view statistics.
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>

        {stats ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                icon={FileText}
                title="Total Invoices"
                value={stats.totalInvoices}
                color="from-blue-500 to-blue-600"
                delay={0}
                trend={null}
              />
              <StatCard
                icon={DollarSign}
                title="Total Revenue"
                value={formatCurrency(stats.totalRevenue)}
                color="from-emerald-500 to-emerald-600"
                delay={0.1}
                trend={12}
              />
              <StatCard
                icon={CheckCircle}
                title="Paid Revenue"
                value={formatCurrency(stats.paidRevenue)}
                color="from-purple-500 to-purple-600"
                delay={0.2}
                trend={8}
              />
              <StatCard
                icon={AlertCircle}
                title={`Overdue (${stats.overdueCount})`}
                value={formatCurrency(stats.overdueAmount)}
                color="from-rose-500 to-rose-600"
                delay={0.3}
                trend={null}
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <motion.div
                variants={chartVariants}
                initial="hidden"
                animate="visible"
                whileHover={{ scale: 1.01 }}
              >
                <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 overflow-hidden">
                  <CardHeader className="border-b border-slate-100 bg-gradient-to-r from-slate-50 to-indigo-50/50 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-1.5 h-8 bg-gradient-to-b from-indigo-500 to-purple-500 rounded-full" />
                      <CardTitle className="text-xl font-semibold text-slate-800">
                        Invoice Status Distribution
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="h-[400px] p-6">
                    <ChartContainer config={{}}>
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={statusData}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            outerRadius={130}
                            innerRadius={60}
                            fill="#8884d8"
                            label
                            animationDuration={800}
                            animationEasing="ease-in-out"
                            paddingAngle={2}
                          >
                            {statusData.map((entry, index) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={COLORS[index % COLORS.length]}
                              />
                            ))}
                          </Pie>
                          <ChartTooltip
                            content={
                              <ChartTooltipContent className="bg-white/95 backdrop-blur-md shadow-lg border border-slate-200" />
                            }
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                variants={chartVariants}
                initial="hidden"
                animate="visible"
                whileHover={{ scale: 1.01 }}
                transition={{ delay: 0.1 }}
              >
                <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 overflow-hidden">
                  <CardHeader className="border-b border-slate-100 bg-gradient-to-r from-slate-50 to-purple-50/50 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-1.5 h-8 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full" />
                      <CardTitle className="text-xl font-semibold text-slate-800">
                        Monthly Revenue
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="h-[400px] p-6">
                    <ChartContainer config={{}}>
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={monthlyData}>
                          <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="#e2e8f0"
                            opacity={0.5}
                          />
                          <XAxis
                            dataKey="month"
                            stroke="#64748b"
                            fontSize={12}
                          />
                          <YAxis stroke="#64748b" fontSize={12} />
                          <ChartTooltip
                            content={
                              <ChartTooltipContent className="bg-white/95 backdrop-blur-md shadow-lg border border-slate-200" />
                            }
                          />
                          <defs>
                            <linearGradient
                              id="barGradient"
                              x1="0"
                              y1="0"
                              x2="0"
                              y2="1"
                            >
                              <stop offset="0%" stopColor="#8b5cf6" />
                              <stop offset="100%" stopColor="#6366f1" />
                            </linearGradient>
                          </defs>
                          <Bar
                            dataKey="revenue"
                            fill="url(#barGradient)"
                            radius={[8, 8, 0, 0]}
                            animationDuration={800}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                variants={chartVariants}
                initial="hidden"
                animate="visible"
                whileHover={{ scale: 1.005 }}
                transition={{ delay: 0.2 }}
                className="col-span-1 lg:col-span-2"
              >
                <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 overflow-hidden">
                  <CardHeader className="border-b border-slate-100 bg-gradient-to-r from-slate-50 to-pink-50/50 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-1.5 h-8 bg-gradient-to-b from-pink-500 to-rose-500 rounded-full" />
                      <CardTitle className="text-xl font-semibold text-slate-800">
                        Revenue Trend Over Time
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="h-[400px] p-6">
                    <ChartContainer config={{}}>
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={monthlyData}>
                          <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="#e2e8f0"
                            opacity={0.5}
                          />
                          <XAxis
                            dataKey="month"
                            stroke="#64748b"
                            fontSize={12}
                          />
                          <YAxis stroke="#64748b" fontSize={12} />
                          <ChartTooltip
                            content={
                              <ChartTooltipContent className="bg-white/95 backdrop-blur-md shadow-lg border border-slate-200" />
                            }
                          />
                          <defs>
                            <linearGradient
                              id="areaGradient"
                              x1="0"
                              y1="0"
                              x2="0"
                              y2="1"
                            >
                              <stop
                                offset="0%"
                                stopColor="#ec4899"
                                stopOpacity={0.6}
                              />
                              <stop
                                offset="100%"
                                stopColor="#ec4899"
                                stopOpacity={0.05}
                              />
                            </linearGradient>
                          </defs>
                          <Area
                            type="monotone"
                            dataKey="revenue"
                            stroke="#db2777"
                            fill="url(#areaGradient)"
                            strokeWidth={3}
                            animationDuration={800}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-40 rounded-2xl" />
              ))}
            </div>
            <Skeleton className="w-full h-96 rounded-2xl" />
          </div>
        )}
      </div>
    </div>
  );
}
