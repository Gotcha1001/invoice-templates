// "use client";

// import { useQuery, useMutation } from "convex/react";
// import { api } from "@/convex/_generated/api";
// import { useParams, useRouter } from "next/navigation";
// import { Button } from "@/components/ui/button";
// import { toast } from "sonner";
// import jsPDF from "jspdf";
// import html2canvas from "html2canvas";
// import { Loader2 } from "lucide-react";
// import { Id, Doc } from "@/convex/_generated/dataModel";

// // Note: Add this query to convex/companies.ts for fetching company by ID
// // export const getCompany = query({
// //   args: { id: v.id("companies") },
// //   handler: async (ctx, args) => {
// //     const identity = await ctx.auth.getUserIdentity();
// //     if (!identity) throw new Error("Unauthorized");
// //     const userId = identity.subject;
// //     const company = await ctx.db.get(args.id);
// //     if (!company || company.userId !== userId) throw new Error("Unauthorized");
// //     return company;
// //   },
// // });

// export function InvoicePreview({
//   invoice,
//   template,
//   company,
// }: {
//   invoice: Doc<"invoices">;
//   template: Doc<"templates">;
//   company: Doc<"companies">;
// }) {
//   return (
//     <div
//       id="invoice-preview"
//       style={{
//         backgroundColor: template.layout.colorScheme.background,
//         color: template.layout.colorScheme.text,
//       }}
//     >
//       {/* Render logo, header, items table, totals, etc. based on template */}
//       {/* Example usage: */}
//       <h1>Invoice {invoice.invoiceNumber}</h1>
//       <p>Company: {company.name}</p>
//       {/* Add full rendering logic here, using company, invoice.customer, invoice.items, etc. */}
//       {/* For createdAt/updatedAt, if needed: new Date(invoice._creationTime).toISOString() */}
//     </div>
//   );
// }

// export default function InvoiceView() {
//   const { id } = useParams();
//   const router = useRouter();
//   const invoice = useQuery(api.invoices.getInvoice, {
//     id: id as Id<"invoices">,
//   });
//   const template = useQuery(
//     api.templates.getTemplate,
//     invoice ? { id: invoice.templateId } : "skip"
//   );
//   const company = useQuery(
//     api.companies.getCompany,
//     invoice ? { id: invoice.companyId } : "skip"
//   );
//   const updateInvoice = useMutation(api.invoices.updateInvoice);
//   const deleteInvoice = useMutation(api.invoices.deleteInvoice);

//   const handleDownload = async () => {
//     const element = document.getElementById("invoice-preview");
//     if (!element) return;
//     const canvas = await html2canvas(element);
//     const imgData = canvas.toDataURL("image/png");
//     const pdf = new jsPDF();
//     pdf.addImage(imgData, "PNG", 0, 0, 210, 297); // A4 size
//     pdf.save(`invoice-${invoice?.invoiceNumber}.pdf`);
//   };

//   const handleDelete = async () => {
//     try {
//       await deleteInvoice({ id: id as Id<"invoices"> });
//       toast.success("Invoice deleted!");
//       router.push("/dashboard/invoices");
//     } catch (error) {
//       toast.error("Failed to delete invoice.");
//     }
//   };

//   if (!invoice || !template || !company) {
//     return (
//       <div className="flex justify-center items-center h-screen">
//         <Loader2 className="w-8 h-8 animate-spin" />
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-7xl mx-auto p-6">
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-3xl font-bold">Invoice {invoice.invoiceNumber}</h1>
//         <div className="flex gap-3">
//           <Button onClick={handleDownload}>Download PDF</Button>
//           <Button
//             variant="outline"
//             onClick={() => router.push(`/dashboard/invoices/${id}/edit`)}
//           >
//             Edit
//           </Button>
//           <Button variant="destructive" onClick={handleDelete}>
//             Delete
//           </Button>
//         </div>
//       </div>
//       <InvoicePreview invoice={invoice} template={template} company={company} />
//     </div>
//   );
// }
"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { Loader2 } from "lucide-react";
import { Id, Doc } from "@/convex/_generated/dataModel";
import { useUser } from "@clerk/nextjs";
import InvoicePreview from "@/components/invoice/InvoicePreview";

export default function InvoiceView() {
  const { user } = useUser();
  const { id } = useParams();
  const router = useRouter();

  const invoice = useQuery(api.invoices.getInvoice, {
    id: id as Id<"invoices">,
  });

  const template = useQuery(
    api.templates.getTemplate,
    invoice ? { id: invoice.templateId } : "skip"
  );

  const company = useQuery(
    api.companies.getCompany,
    invoice ? { id: invoice.companyId } : "skip"
  );

  const deleteInvoice = useMutation(api.invoices.deleteInvoice);

  const handleDownload = async () => {
    const element = document.getElementById("invoice-preview");
    if (!element || !invoice) return;

    try {
      const canvas = await html2canvas(element, { scale: 2 });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });
      const imgWidth = 210; // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
      pdf.save(`invoice-${invoice.invoiceNumber}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Failed to generate PDF.");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteInvoice({ id: id as Id<"invoices"> });
      toast.success("Invoice deleted!");
      router.push("/dashboard/invoices");
    } catch (error) {
      console.error("Error deleting invoice:", error);
      toast.error("Failed to delete invoice.");
    }
  };

  if (
    !user ||
    invoice === undefined ||
    template === undefined ||
    company === undefined
  ) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (!invoice || !template || !company) {
    return (
      <div className="max-w-7xl mx-auto p-6 mt-20">
        <Card>
          <CardContent className="pt-6">
            <p>Invoice, template, or company not found.</p>
            <Button onClick={() => router.push("/dashboard/invoices")}>
              Back to Invoices
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 mt-20">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Invoice #{invoice.invoiceNumber}</CardTitle>
            <div className="flex gap-3">
              <Button onClick={handleDownload}>Download PDF</Button>
              <Button
                variant="outline"
                onClick={() => router.push(`/dashboard/invoices/${id}/edit`)}
              >
                Edit
              </Button>
              <Button variant="destructive" onClick={handleDelete}>
                Delete
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <InvoicePreview
            invoice={invoice}
            template={template}
            company={company}
          />
        </CardContent>
      </Card>
    </div>
  );
}
