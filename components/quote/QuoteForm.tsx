"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api"; // Adjust path as needed
import { Id } from "@/convex/_generated/dataModel";
import { quoteSchema, QuoteFormData } from "@/types/quotes"; // From Step 2
import { useRouter, useParams } from "next/navigation";
import { useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Button } from "../ui/button";
// Import UI components (e.g., Input, Select, Button) from your shadcn setup

export default function QuoteForm() {
  const params = useParams();
  const router = useRouter();
  const createQuote = useMutation(api.quotes.createQuote);
  const updateQuote = useMutation(api.quotes.updateQuote);
  const quoteId = params.id ? (params.id as string) : undefined; // String from URL
  const quote = useQuery(
    api.quotes.getQuote,
    quoteId ? { id: quoteId as Id<"quotes"> } : "skip"
  ); // Cast to Id

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
      status: "draft", // Fix: Required, default to "draft"
      notes: "",
      discount: 0,
      discountType: "percentage",
    },
  });

  useEffect(() => {
    if (quote) {
      form.reset({
        ...quote,
        companyId: quote.companyId, // Already Id, but treat as string for form
        templateId: quote.templateId,
      });
    }
  }, [quote, form]);

  const onSubmit = async (data: QuoteFormData) => {
    try {
      if (quoteId) {
        // Update
        await updateQuote({
          id: quoteId as Id<"quotes">, // Fix: Cast string to Id
          ...data,
          templateId: data.templateId as Id<"templates">, // Fix: Cast to Id
        });
      } else {
        // Create
        await createQuote({
          ...data,
          companyId: data.companyId as Id<"companies">, // Fix: Cast to Id
          templateId: data.templateId as Id<"templates">, // Fix: Cast to Id
        });
      }
      router.push("/quotes"); // Redirect after success
    } catch (error) {
      console.error("Error saving quote:", error);
      // Handle error (e.g., toast)
    }
  };

  // Render form fields with Controller
  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      {/* Example field: Status */}
      <Controller
        name="status"
        control={form.control}
        render={({ field }) => (
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="sent">Sent</SelectItem>
              <SelectItem value="accepted">Accepted</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
              <SelectItem value="expired">Expired</SelectItem>
              <SelectItem value="converted">Converted</SelectItem>
            </SelectContent>
          </Select>
        )}
      />
      {/* Add other fields similarly: quoteNumber, customer.name, items, etc. */}
      <Button type="submit">Save Quote</Button>
    </form>
  );
}
