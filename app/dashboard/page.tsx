"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DollarSign,
  FileText,
  Calendar,
  Users,
  TrendingUp,
  CheckCircle,
  Sparkles,
} from "lucide-react";
import { motion } from "framer-motion";

export default function Dashboard() {
  const { user } = useUser();

  // Pass userId from client instead of relying on server auth
  const company = useQuery(api.companies.getCompanyByUser, {
    userId: user?.id || "",
  });

  // Render loading state with skeletons
  if (!user || company === undefined) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/20">
        <div className="max-w-7xl mx-auto p-6 space-y-8">
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

  // Handle case where no company is set up
  if (company === null) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/20">
        <div className="max-w-7xl mx-auto p-6 space-y-8 pt-24 text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col items-center gap-4"
          >
            <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Welcome!
            </h1>
            <p className="text-slate-600 mt-2 text-sm sm:text-base max-w-md">
              Please set up your company details to get started.
            </p>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link href="/dashboard/settings">
                <Button className="group relative overflow-hidden bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300">
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent pointer-events-none"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: "100%" }}
                    transition={{ duration: 0.5 }}
                  />
                  Go to Settings
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/20">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8 pt-24 pb-16 mt-20">
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
                Welcome back, {user?.firstName || user?.fullName}!
              </h1>
              <p className="text-slate-600 mt-2 text-sm sm:text-base">
                Here's what's happening with your business today.
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
            <Link href="/dashboard/invoices/create">
              <Button
                size="lg"
                className="group relative overflow-hidden bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent pointer-events-none"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "100%" }}
                  transition={{ duration: 0.5 }}
                />
                <FileText
                  size={16}
                  className="mr-2 group-hover:rotate-90 transition-transform duration-300"
                />
                New Invoice
              </Button>
            </Link>
          </motion.div>
        </motion.div>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            whileHover={{ y: -8, scale: 1.02 }}
          >
            <Link href="/dashboard/invoices">
              <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white hover:shadow-2xl transition-all duration-300 overflow-hidden group h-full">
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                <CardContent className="p-6 relative flex flex-col h-full">
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
                    className="text-2xl font-bold mb-1"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3, type: "spring" }}
                  >
                    Manage Invoices
                  </motion.h3>
                  <p className="text-blue-100 text-sm font-medium">
                    View, edit, and send invoices
                  </p>
                </CardContent>
              </Card>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            whileHover={{ y: -8, scale: 1.02 }}
          >
            <Link href="/dashboard/templates">
              <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-500 to-purple-600 text-white hover:shadow-2xl transition-all duration-300 overflow-hidden group h-full">
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                <CardContent className="p-6 relative flex flex-col h-full">
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
                      <Users size={24} />
                    </div>
                    <DollarSign size={20} className="opacity-70" />
                  </div>
                  <motion.h3
                    className="text-2xl font-bold mb-1"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.4, type: "spring" }}
                  >
                    Templates
                  </motion.h3>
                  <p className="text-purple-100 text-sm font-medium">
                    Customize your invoice designs
                  </p>
                </CardContent>
              </Card>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.5 }}
            whileHover={{ y: -8, scale: 1.02 }}
          >
            <Link href="/dashboard/settings">
              <Card className="border-0 shadow-lg bg-gradient-to-br from-emerald-500 to-emerald-600 text-white hover:shadow-2xl transition-all duration-300 overflow-hidden group h-full">
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                <CardContent className="p-6 relative flex flex-col h-full">
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
                      <TrendingUp size={24} />
                    </div>
                    <CheckCircle size={20} className="opacity-70" />
                  </div>
                  <motion.h3
                    className="text-2xl font-bold mb-1"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.45, type: "spring" }}
                  >
                    Settings
                  </motion.h3>
                  <p className="text-emerald-100 text-sm font-medium">
                    Update company details
                  </p>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
