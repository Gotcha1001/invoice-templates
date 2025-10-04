"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils"; // Assume you have a cn utility from shadcn

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

export const StatusBadge = ({ status }: { status: string }) => (
  <motion.div
    initial={{ scale: 0.8, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    className={cn(
      "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
      getStatusColor(status),
      status === "overdue" && "animate-pulse"
    )}
  >
    {status.charAt(0).toUpperCase() + status.slice(1)}
  </motion.div>
);
