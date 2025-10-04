"use client";

import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Doc } from "@/convex/_generated/dataModel";
import { formatCurrency } from "@/lib/currency";

interface InvoiceAnalyticsProps {
  invoices: Doc<"invoices">[];
}

export const InvoiceAnalytics = ({ invoices }: InvoiceAnalyticsProps) => {
  const analytics = useMemo(
    () => ({
      totalRevenue: invoices.reduce((sum, inv) => sum + inv.total, 0),
      avgInvoiceValue:
        invoices.length > 0
          ? invoices.reduce((sum, inv) => sum + inv.total, 0) / invoices.length
          : 0,
      paymentRate:
        invoices.length > 0
          ? (invoices.filter((inv) => inv.status === "paid").length /
              invoices.length) *
            100
          : 0,
      topCustomers: Object.entries(
        invoices.reduce(
          (acc, inv) => {
            acc[inv.customer.name] = (acc[inv.customer.name] || 0) + inv.total;
            return acc;
          },
          {} as Record<string, number>
        )
      )
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5),
    }),
    [invoices]
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
      <Card>
        <CardHeader>
          <CardTitle>Total Revenue</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">
            {formatCurrency(analytics.totalRevenue)}
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Avg Invoice Value</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">
            {formatCurrency(analytics.avgInvoiceValue)}
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Payment Rate</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">
            {analytics.paymentRate.toFixed(1)}%
          </p>
        </CardContent>
      </Card>
      <Card className="col-span-1 md:col-span-3">
        <CardHeader>
          <CardTitle>Top Customers</CardTitle>
        </CardHeader>
        <CardContent>
          <ul>
            {analytics.topCustomers.map(([name, amount]) => (
              <li key={name} className="flex justify-between">
                <span>{name}</span>
                <span>{formatCurrency(amount)}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};
