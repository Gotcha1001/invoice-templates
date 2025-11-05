// // app/dashboard/quotes/[id]/page.tsx
// "use client";
// import { useQuery } from "convex/react";
// import { api } from "../../../../convex/_generated/api";
// import { useParams } from "next/navigation";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { formatCurrency } from "@/lib/currency";
// import jsPDF from "jspdf";
// import html2canvas from "html2canvas";
// import { Download } from "lucide-react";
// import { Id } from "../../../../convex/_generated/dataModel";

// export default function QuoteViewPage() {
//   const { id } = useParams();
//   const quoteId = typeof id === "string" ? (id as Id<"quotes">) : undefined;
//   const quote = useQuery(
//     api.quotes.getQuote,
//     quoteId ? { id: quoteId } : "skip"
//   );

//   if (!quoteId) return <div>Invalid ID</div>;
//   if (!quote) return <div>Loading...</div>;

//   const handleDownloadPDF = async () => {
//     const element = document.getElementById("quote-content"); // Add this ID to your rendered quote
//     if (!element) return;

//     const canvas = await html2canvas(element);
//     const imgData = canvas.toDataURL("image/png");
//     const pdf = new jsPDF();
//     pdf.addImage(
//       imgData,
//       "PNG",
//       0,
//       0,
//       pdf.internal.pageSize.getWidth(),
//       pdf.internal.pageSize.getHeight()
//     );
//     pdf.save(`quote-${quote.quoteNumber}.pdf`);
//   };

//   return (
//     <div className="container mx-auto p-6 mt-48">
//       <Card>
//         <CardHeader>
//           <CardTitle>Quote: {quote.quoteNumber}</CardTitle>
//           <Button onClick={handleDownloadPDF}>
//             <Download size={16} className="mr-2" /> Download PDF
//           </Button>
//         </CardHeader>
//         <CardContent id="quote-content">
//           {" "}
//           {/* For PDF capture */}
//           <p>Customer: {quote.customer.name}</p>
//           <p>Total: {formatCurrency(quote.total, quote.currency)}</p>
//           {/* Render full quote details, items table, etc. Use template layout from quote.templateId */}
//           {/* Fetch template via useQuery(api.templates.getTemplate, { id: quote.templateId }) and apply styles */}
//         </CardContent>
//       </Card>
//     </div>
//   );
// }

// app/dashboard/quotes/[id]/page.tsx
"use client";

import { useParams } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id, Doc } from "@/convex/_generated/dataModel";
import QuotePreview from "@/components/quote/QuotePreview";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, ArrowLeft } from "lucide-react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { useRef } from "react";

export default function QuoteDetail() {
  const { id } = useParams();
  const quoteId = id as Id<"quotes">;

  const quote = useQuery(api.quotes.getQuote, { id: quoteId });
  const company = useQuery(
    api.companies.getCompany,
    quote ? { id: quote.companyId } : "skip"
  );
  const template = useQuery(
    api.templates.getTemplate,
    quote ? { id: quote.templateId } : "skip"
  );

  const printRef = useRef<HTMLDivElement>(null);

  const downloadPDF = async () => {
    if (!printRef.current) return;
    const canvas = await html2canvas(printRef.current, { scale: 2 });
    const img = canvas.toDataURL("image/png");
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = pageWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(img, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(img, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save(`quote-${quote?.quoteNumber}.pdf`);
  };

  if (!quote || !company || !template) return <p className="p-8">Loading…</p>;

  return (
    <div className="container mx-auto p-6 mt-20">
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => window.history.back()}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-3xl font-bold">Quote #{quote.quoteNumber}</h1>
        <Button className="ml-auto" onClick={downloadPDF}>
          <Download className="mr-2 h-4 w-4" /> PDF
        </Button>
      </div>

      <Card className="overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
          <CardTitle className="text-2xl">Quote Preview</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div ref={printRef} className="p-8 bg-white">
            <QuotePreview quote={quote} template={template} company={company} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
