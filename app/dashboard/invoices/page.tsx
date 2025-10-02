"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import InvoiceList from "@/components/invoice/InvoiceList";
import { Loader2 } from "lucide-react";

export default function Invoices() {
  const { user } = useUser();
  const company = useQuery(api.companies.getCompanyByUser, {
    userId: user?.id || "",
  });

  if (!user || company === undefined) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (!company) {
    return <div>Please set up your company first</div>;
  }

  return <InvoiceList />;
}
