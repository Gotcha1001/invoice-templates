"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { quoteSchema, QuoteFormData } from "@/types/quotes";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useMemo } from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "../ui/checkbox";

export default function QuoteForm() {
  const params = useParams();
  const router = useRouter();

  const createQuote = useMutation(api.quotes.createQuote);
  const updateQuote = useMutation(api.quotes.updateQuote);

  const quoteId = params.id ? (params.id as string) : undefined;
  const quote = useQuery(
    api.quotes.getQuote,
    quoteId ? { id: quoteId as Id<"quotes"> } : "skip"
  );

  const form = useForm<QuoteFormData>({
    resolver: zodResolver(quoteSchema),
    defaultValues: {
      quoteNumber: "",
      companyId: "",
      templateId: "",
      customer: { name: "", email: "", address: "", phone: "" },
      items: [
        {
          id: crypto.randomUUID(),
          description: "",
          quantity: 1,
          price: 0,
          total: 0,
        },
      ],
      subtotal: 0,
      tax: 0,
      total: 0,
      issueDate: new Date().toISOString().split("T")[0],
      validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      currency: "ZAR",
      status: "draft",
      notes: "",
      discount: 0,
      discountType: "percentage",
      isVatRegistered: true,
      taxRate: 0.15,
    },
  });

  // Load existing quote
  useEffect(() => {
    if (quote) {
      form.reset({
        ...quote,
        companyId: quote.companyId as any,
        templateId: quote.templateId as any,
        isVatRegistered: quote.isVatRegistered ?? true,
        taxRate: quote.taxRate ?? 0.15,
        discount: quote.discount ?? 0,
        discountType: quote.discountType ?? "percentage",
      });
    }
  }, [quote, form]);

  // Watch form values
  const watched = form.watch();

  // Totals calculation — SAFE
  const totals = useMemo(() => {
    const lineTotal = watched.items.reduce(
      (s, i) => s + i.quantity * i.price,
      0
    );

    const discountValue =
      watched.discountType === "percentage"
        ? (lineTotal * (watched.discount ?? 0)) / 100
        : (watched.discount ?? 0);

    const subtotal = lineTotal;
    const afterDiscount = subtotal - discountValue;
    const tax = watched.isVatRegistered
      ? afterDiscount * (watched.taxRate ?? 0.15)
      : 0;
    const total = afterDiscount + tax;

    return {
      subtotal,
      discount: discountValue,
      afterDiscount,
      tax,
      total,
    };
  }, [
    watched.items,
    watched.discount,
    watched.discountType,
    watched.isVatRegistered,
    watched.taxRate,
  ]);

  // Submit
  const onSubmit = async (data: QuoteFormData) => {
    try {
      const payload = {
        ...data,
        items: data.items.map((i) => ({
          ...i,
          total: i.quantity * i.price,
        })),
        subtotal: totals.subtotal,
        tax: totals.tax,
        total: totals.total,
        taxRate: data.isVatRegistered ? data.taxRate : undefined,
      };

      if (quoteId) {
        await updateQuote({
          id: quoteId as Id<"quotes">,
          ...payload,
          templateId: data.templateId as Id<"templates">,
        });
      } else {
        await createQuote({
          ...payload,
          companyId: data.companyId as Id<"companies">,
          templateId: data.templateId as Id<"templates">,
        });
      }

      router.push("/quotes");
    } catch (e) {
      console.error(e);
    }
  };

  // Add / Remove items
  const addItem = () => {
    form.setValue("items", [
      ...form.getValues("items"),
      {
        id: crypto.randomUUID(),
        description: "",
        quantity: 1,
        price: 0,
        total: 0,
      },
    ]);
  };

  const removeItem = (id: string) => {
    form.setValue(
      "items",
      form.getValues("items").filter((i) => i.id !== id)
    );
  };

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="max-w-4xl mx-auto p-6 space-y-8"
    >
      {/* BASIC INFO */}
      <section className="grid md:grid-cols-2 gap-4">
        <div>
          <Label>Quote #</Label>
          <Controller
            name="quoteNumber"
            control={form.control}
            render={({ field }) => (
              <Input {...field} placeholder="QUO-123" className="mt-1" />
            )}
          />
        </div>

        <div>
          <Label>Status</Label>
          <Controller
            name="status"
            control={form.control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[
                    "draft",
                    "sent",
                    "accepted",
                    "rejected",
                    "expired",
                    "converted",
                  ].map((s) => (
                    <SelectItem key={s} value={s}>
                      {s.charAt(0).toUpperCase() + s.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>
      </section>

      {/* CUSTOMER */}
      <section className="space-y-4">
        <h3 className="font-semibold text-indigo-700">Customer</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <Controller
            name="customer.name"
            control={form.control}
            render={({ field }) => (
              <div>
                <Label>Name *</Label>
                <Input {...field} placeholder="Jane Doe" className="mt-1" />
              </div>
            )}
          />
          <Controller
            name="customer.email"
            control={form.control}
            render={({ field }) => (
              <div>
                <Label>Email *</Label>
                <Input
                  {...field}
                  type="email"
                  placeholder="jane@example.com"
                  className="mt-1"
                />
              </div>
            )}
          />
          <Controller
            name="customer.address"
            control={form.control}
            render={({ field }) => (
              <div>
                <Label>Address</Label>
                <Input {...field} placeholder="123 Main St" className="mt-1" />
              </div>
            )}
          />
          <Controller
            name="customer.phone"
            control={form.control}
            render={({ field }) => (
              <div>
                <Label>Phone</Label>
                <Input
                  {...field}
                  placeholder="+27 82 123 4567"
                  className="mt-1"
                />
              </div>
            )}
          />
        </div>
      </section>

      {/* LINE ITEMS */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-indigo-700">Line Items</h3>
          <Button type="button" variant="outline" size="sm" onClick={addItem}>
            Add Item
          </Button>
        </div>

        {watched.items.map((it, idx) => (
          <div
            key={it.id}
            className="grid md:grid-cols-12 gap-3 items-center p-4 border rounded-xl bg-gradient-to-r from-slate-50 to-indigo-50"
          >
            <div className="md:col-span-5">
              <Controller
                name={`items.${idx}.description`}
                control={form.control}
                render={({ field }) => (
                  <Input {...field} placeholder="Description" />
                )}
              />
            </div>

            <div className="md:col-span-2">
              <Controller
                name={`items.${idx}.quantity`}
                control={form.control}
                render={({ field }) => (
                  <Input
                    {...field}
                    type="number"
                    min={1}
                    value={field.value}
                    onChange={(e) =>
                      field.onChange(Number(e.target.value) || 1)
                    }
                  />
                )}
              />
            </div>

            <div className="md:col-span-2">
              <Controller
                name={`items.${idx}.price`}
                control={form.control}
                render={({ field }) => (
                  <Input
                    {...field}
                    type="number"
                    min={0}
                    step={0.01}
                    value={field.value}
                    onChange={(e) =>
                      field.onChange(Number(e.target.value) || 0)
                    }
                  />
                )}
              />
            </div>

            <div className="md:col-span-2 text-right font-medium text-indigo-700">
              R {(it.quantity * it.price).toFixed(2)}
            </div>

            <div className="md:col-span-1 text-center">
              {watched.items.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeItem(it.id)}
                  className="text-red-600"
                >
                  Trash
                </Button>
              )}
            </div>
          </div>
        ))}
      </section>

      {/* DISCOUNT */}
      <section className="space-y-4">
        <h3 className="font-semibold text-indigo-700">Discount (optional)</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <Controller
            name="discount"
            control={form.control}
            render={({ field }) => (
              <div>
                <Label>Amount</Label>
                <Input
                  {...field}
                  type="number"
                  min={0}
                  placeholder="0"
                  value={field.value ?? 0}
                  onChange={(e) => field.onChange(Number(e.target.value) || 0)}
                  className="mt-1"
                />
              </div>
            )}
          />
          <Controller
            name="discountType"
            control={form.control}
            render={({ field }) => (
              <div>
                <Label>Type</Label>
                <Select
                  onValueChange={field.onChange}
                  value={field.value ?? "percentage"}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">Percentage %</SelectItem>
                    <SelectItem value="fixed">Fixed Amount</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          />
        </div>
      </section>

      {/* VAT SETTINGS */}
      <section className="space-y-4">
        <h3 className="font-semibold text-indigo-700">VAT</h3>

        <Controller
          name="isVatRegistered"
          control={form.control}
          render={({ field }) => (
            <Label className="flex items-center gap-2 cursor-pointer">
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
              />
              Company is VAT-registered
            </Label>
          )}
        />

        {watched.isVatRegistered && (
          <Controller
            name="taxRate"
            control={form.control}
            render={({ field }) => (
              <div className="max-w-xs">
                <Label>VAT rate (%)</Label>
                <Input
                  type="number"
                  min={0}
                  max={100}
                  step={0.1}
                  value={field.value ? (field.value * 100).toFixed(1) : "15.0"}
                  onChange={(e) => field.onChange(Number(e.target.value) / 100)}
                  className="mt-1"
                />
              </div>
            )}
          />
        )}
      </section>

      {/* TOTALS */}
      <section className="flex justify-end">
        <div className="w-full max-w-md p-5 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl shadow-inner space-y-2">
          <div className="flex justify-between text-sm">
            <span>Subtotal</span>
            <span className="font-medium">
              {totals.subtotal.toFixed(2)} ZAR
            </span>
          </div>

          {totals.discount > 0 && (
            <div className="flex justify-between text-sm text-red-600">
              <span>
                Discount (
                {watched.discountType === "percentage"
                  ? `${watched.discount ?? 0}%`
                  : "fixed"}
                )
              </span>
              <span>-{totals.discount.toFixed(2)} ZAR</span>
            </div>
          )}

          {watched.isVatRegistered && totals.tax > 0 && (
            <div className="flex justify-between text-sm">
              <span>VAT ({((watched.taxRate ?? 0.15) * 100).toFixed(1)}%)</span>
              <span className="font-medium">{totals.tax.toFixed(2)} ZAR</span>
            </div>
          )}

          <div className="flex justify-between pt-2 border-t border-indigo-200 font-bold text-lg">
            <span>Total</span>
            <span className="text-indigo-700">
              {totals.total.toFixed(2)} ZAR
            </span>
          </div>
        </div>
      </section>

      {/* NOTES */}
      <section>
        <Label>Notes (optional)</Label>
        <Controller
          name="notes"
          control={form.control}
          render={({ field }) => (
            <Textarea
              {...field}
              rows={3}
              placeholder="Payment terms, delivery..."
              className="mt-1"
            />
          )}
        />
      </section>

      {/* ACTIONS */}
      <div className="flex justify-end gap-3 pt-6 border-t">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button type="submit">Save Quote</Button>
      </div>
    </form>
  );
}
