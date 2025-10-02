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
} from "lucide-react";

export default function Dashboard() {
  const { user } = useUser();

  // Pass userId from client instead of relying on server auth
  const company = useQuery(api.companies.getCompanyByUser, {
    userId: user?.id || "",
  });

  // Render loading state with skeletons
  if (!user || company === undefined) {
    return (
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        <Skeleton className="h-10 w-1/3" />
        <Skeleton className="h-6 w-2/3" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // Handle case where no company is set up
  if (company === null) {
    return (
      <div className="p-6 text-center">
        <h1 className="text-2xl font-bold mb-4">Welcome!</h1>
        <p className="mb-4">
          Please set up your company details to get started.
        </p>
        <Link href="/dashboard/settings">
          <Button>Go to Settings</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">
            Welcome back, {user?.firstName || user?.fullName}!
          </h1>
          <p className="text-gray-600">
            Here's what's happening with your business today.
          </p>
        </div>
        <div className="flex gap-4">
          <Link href="/dashboard/invoices/create">
            <Button size="lg">
              <FileText className="w-4 h-4 mr-2" />
              New Invoice
            </Button>
          </Link>
        </div>
      </div>

      {/* Rest of your dashboard content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link href="/dashboard/invoices">
          <Card className="h-full p-6 hover:shadow-lg transition-shadow cursor-pointer">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Manage Invoices</h3>
                <p className="text-sm text-gray-600">
                  View, edit, and send invoices
                </p>
              </div>
            </div>
          </Card>
        </Link>

        <Link href="/dashboard/templates">
          <Card className="h-full p-6 hover:shadow-lg transition-shadow cursor-pointer">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-secondary/10 rounded-lg">
                <Users className="h-6 w-6 text-secondary" />
              </div>
              <div>
                <h3 className="font-semibold">Templates</h3>
                <p className="text-sm text-gray-600">
                  Customize your invoice designs
                </p>
              </div>
            </div>
          </Card>
        </Link>

        <Link href="/dashboard/settings">
          <Card className="h-full p-6 hover:shadow-lg transition-shadow cursor-pointer">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-accent/10 rounded-lg">
                <TrendingUp className="h-6 w-6 text-accent" />
              </div>
              <div>
                <h3 className="font-semibold">Settings</h3>
                <p className="text-sm text-gray-600">Update company details</p>
              </div>
            </div>
          </Card>
        </Link>
      </div>
    </div>
  );
}
