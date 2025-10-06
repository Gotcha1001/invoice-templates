// "use client";

// import { TemplateLayout } from "@/types/template";

// interface TemplatePreviewProps {
//   layout: TemplateLayout;
// }

// export default function TemplatePreview({ layout }: TemplatePreviewProps) {
//   const styles = {
//     backgroundColor: layout.colorScheme.background,
//     color: layout.colorScheme.text,
//     fontFamily: layout.fontFamily,
//     border: layout.showBorder ? "1px solid black" : "none",
//     // Apply other styles...
//   };

//   return (
//     <div style={styles} className="p-4 border rounded">
//       <h2 style={{ color: layout.colorScheme.primary }}>
//         Mock Invoice Header ({layout.headerStyle})
//       </h2>
//       <p>Logo Position: {layout.logoPosition}</p>
//       {layout.showWatermark && <div style={{ opacity: 0.5 }}>Watermark</div>}
//       {/* Add mock company address, items, total */}
//       <p>Company Address (from company table)</p>
//       <ul>
//         <li>Item 1 - $10</li>
//       </ul>
//       <p>Total: $10</p>
//     </div>
//   );
// }
// "use client";

// import { TemplateLayout } from "@/types/template";
// import { useQuery } from "convex/react";
// import { api } from "@/convex/_generated/api";
// import { useUser } from "@clerk/nextjs";
// import { Loader2 } from "lucide-react";

// interface TemplatePreviewProps {
//   layout: TemplateLayout;
//   companyName?: string;
//   description?: string;
// }

// export default function TemplatePreview({
//   layout,
//   companyName = "",
//   description = "",
// }: TemplatePreviewProps) {
//   const { user } = useUser();

//   // Fetch actual company data
//   const company = useQuery(api.companies.getCompanyByUser, {
//     userId: user?.id || "",
//   });

//   if (!user || company === undefined) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <Loader2 className="w-8 h-8 animate-spin" />
//       </div>
//     );
//   }

//   // Use company data or fallback to placeholder
//   const displayCompany = {
//     name: company?.name || companyName || "Your Company Name",
//     address: company?.address || "123 Business Street\nCity, State 12345",
//     phone: company?.phone || "+1 (555) 123-4567",
//     email: company?.email || "hello@company.com",
//     logoUrl: company?.logoUrl || "",
//   };

//   // Mock customer and items for preview (with ZERO amounts)
//   const mockPreviewData = {
//     invoiceNumber: "INV-XXXX-XXX",
//     customer: {
//       name: "Customer Name",
//       address: "Customer Address\nCity, State ZIP",
//       email: "customer@example.com",
//     },
//     items: [
//       {
//         description: "Sample Service/Product",
//         quantity: 1,
//         price: 0,
//         total: 0,
//       },
//       {
//         description: "Another Item",
//         quantity: 2,
//         price: 0,
//         total: 0,
//       },
//     ],
//     subtotal: 0,
//     tax: 0,
//     total: 0,
//     issueDate: new Date().toISOString().split("T")[0],
//     dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
//       .toISOString()
//       .split("T")[0],
//   };

//   return (
//     <div
//       className="min-h-[800px] bg-white p-8 rounded-lg"
//       style={{
//         fontFamily: layout.fontFamily,
//         color: layout.colorScheme.text,
//         border: layout.showBorder
//           ? `2px solid ${layout.colorScheme.primary}`
//           : "none",
//       }}
//     >
//       {/* Template Info Banner */}
//       <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800">
//         <strong>Template Preview:</strong> This shows your invoice design.
//         Actual amounts will appear when creating invoices.
//         {description && <div className="mt-1 text-blue-600">{description}</div>}
//       </div>

//       {/* Header */}
//       <div
//         className={`mb-8 ${
//           layout.headerStyle === "bold"
//             ? "bg-gradient-to-r p-6 rounded-lg"
//             : layout.headerStyle === "creative"
//               ? "relative overflow-hidden p-6 rounded-xl"
//               : "pb-6 border-b-2"
//         }`}
//         style={{
//           backgroundColor:
//             layout.headerStyle !== "minimal"
//               ? layout.colorScheme.primary
//               : "transparent",
//           borderColor:
//             layout.headerStyle === "minimal"
//               ? layout.colorScheme.primary
//               : "transparent",
//           color:
//             layout.headerStyle !== "minimal"
//               ? "#ffffff"
//               : layout.colorScheme.text,
//         }}
//       >
//         {layout.headerStyle === "creative" && (
//           <div
//             className="absolute -top-10 -right-10 w-32 h-32 rounded-full opacity-20"
//             style={{ backgroundColor: layout.colorScheme.accent }}
//           />
//         )}
//         <div
//           className={`flex items-start ${
//             layout.logoPosition === "center"
//               ? "flex-col items-center text-center"
//               : layout.logoPosition === "right"
//                 ? "flex-row-reverse justify-between"
//                 : "justify-between"
//           }`}
//         >
//           <div
//             className={layout.logoPosition === "center" ? "order-2 mt-4" : ""}
//           >
//             <h1 className="text-3xl font-bold mb-2">{displayCompany.name}</h1>
//             <div className="text-sm opacity-90 whitespace-pre-line">
//               {displayCompany.address}
//             </div>
//             <div className="text-sm mt-2 opacity-90">
//               {displayCompany.phone} • {displayCompany.email}
//             </div>
//           </div>

//           {/* Logo */}
//           <div className={layout.logoPosition === "center" ? "order-1" : ""}>
//             {displayCompany.logoUrl ? (
//               <img
//                 src={displayCompany.logoUrl}
//                 alt="Company logo"
//                 className="h-20 w-20 object-contain"
//               />
//             ) : (
//               <div
//                 className="w-20 h-20 rounded-lg flex items-center justify-center text-xs font-medium"
//                 style={{
//                   backgroundColor:
//                     layout.headerStyle !== "minimal"
//                       ? "rgba(255,255,255,0.2)"
//                       : layout.colorScheme.accent,
//                   color: "#ffffff",
//                 }}
//               >
//                 LOGO
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Invoice Details */}
//       <div className="grid grid-cols-2 gap-8 mb-8">
//         <div>
//           <h2
//             className="text-lg font-semibold mb-4"
//             style={{ color: layout.colorScheme.primary }}
//           >
//             Bill To:
//           </h2>
//           <div className="space-y-1">
//             <div className="font-medium">{mockPreviewData.customer.name}</div>
//             <div className="text-sm whitespace-pre-line">
//               {mockPreviewData.customer.address}
//             </div>
//             <div className="text-sm">{mockPreviewData.customer.email}</div>
//           </div>
//         </div>
//         <div className="text-right">
//           <h1
//             className="text-4xl font-bold mb-2"
//             style={{ color: layout.colorScheme.primary }}
//           >
//             INVOICE
//           </h1>
//           <div className="text-sm space-y-1">
//             <div>
//               <strong>Invoice #:</strong> {mockPreviewData.invoiceNumber}
//             </div>
//             <div>
//               <strong>Date:</strong> {mockPreviewData.issueDate}
//             </div>
//             <div>
//               <strong>Due Date:</strong> {mockPreviewData.dueDate}
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Items Table */}
//       <div className="mb-8">
//         <table className="w-full">
//           <thead>
//             <tr
//               style={{
//                 backgroundColor: layout.colorScheme.primary,
//                 color: "#ffffff",
//               }}
//             >
//               <th className="text-left p-3 font-semibold">Description</th>
//               <th className="text-center p-3 font-semibold">Qty</th>
//               <th className="text-right p-3 font-semibold">Price</th>
//               <th className="text-right p-3 font-semibold">Total</th>
//             </tr>
//           </thead>
//           <tbody>
//             {mockPreviewData.items.map((item, index) => (
//               <tr
//                 key={index}
//                 style={{
//                   backgroundColor:
//                     index % 2 === 0
//                       ? `${layout.colorScheme.accent}10`
//                       : "transparent",
//                 }}
//               >
//                 <td className="p-3 border-b border-gray-200">
//                   {item.description}
//                 </td>
//                 <td className="p-3 border-b border-gray-200 text-center">
//                   {item.quantity}
//                 </td>
//                 <td className="p-3 border-b border-gray-200 text-right">
//                   ${item.price.toFixed(2)}
//                 </td>
//                 <td className="p-3 border-b border-gray-200 text-right font-medium">
//                   ${item.total.toFixed(2)}
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {/* Totals */}
//       <div className="flex justify-end mb-8">
//         <div className="w-80">
//           <div className="space-y-2">
//             <div className="flex justify-between py-2">
//               <span>Subtotal:</span>
//               <span>${mockPreviewData.subtotal.toFixed(2)}</span>
//             </div>
//             <div className="flex justify-between py-2">
//               <span>Tax:</span>
//               <span>${mockPreviewData.tax.toFixed(2)}</span>
//             </div>
//             <div
//               className="flex justify-between py-3 border-t-2 text-xl font-bold"
//               style={{
//                 borderColor: layout.colorScheme.primary,
//                 color: layout.colorScheme.primary,
//               }}
//             >
//               <span>Total:</span>
//               <span>${mockPreviewData.total.toFixed(2)}</span>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Footer */}
//       <div
//         className="text-center text-sm"
//         style={{ color: layout.colorScheme.secondary }}
//       >
//         <div className="mb-2">Thank you for your business!</div>
//         <div>Payment is due within 30 days of invoice date.</div>
//       </div>

//       {/* Watermark */}
//       {layout.showWatermark && (
//         <div
//           className="absolute inset-0 flex items-center justify-center pointer-events-none"
//           style={{
//             fontSize: "120px",
//             fontWeight: "bold",
//             color: `${layout.colorScheme.primary}05`,
//             transform: "rotate(-45deg)",
//             zIndex: 0,
//           }}
//         >
//           PREVIEW
//         </div>
//       )}
//     </div>
//   );
// }
"use client";

import { TemplateLayout } from "@/types/template";
import { Loader2 } from "lucide-react";

interface TemplatePreviewProps {
  layout: TemplateLayout;
  companyName?: string;
  description?: string;
  companyData?: {
    name: string;
    address: string;
    phone: string;
    email: string;
    logoUrl: string;
  };
}

export default function TemplatePreview({
  layout,
  companyName = "",
  description = "",
  companyData,
}: TemplatePreviewProps) {
  // Use provided companyData or fallback
  const displayCompany = {
    name: companyData?.name || companyName || "Your Company Name",
    address: companyData?.address || "123 Business Street\nCity, State 12345",
    phone: companyData?.phone || "+1 (555) 123-4567",
    email: companyData?.email || "hello@company.com",
    logoUrl: companyData?.logoUrl || "",
  };

  // Mock customer and items for preview (with ZERO amounts)
  const mockPreviewData = {
    invoiceNumber: "INV-XXXX-XXX",
    customer: {
      name: "Customer Name",
      address: "Customer Address\nCity, State ZIP",
      email: "customer@example.com",
    },
    items: [
      {
        description: "Sample Service/Product",
        quantity: 1,
        price: 0,
        total: 0,
      },
      {
        description: "Another Item",
        quantity: 2,
        price: 0,
        total: 0,
      },
    ],
    subtotal: 0,
    tax: 0,
    total: 0,
    issueDate: new Date().toISOString().split("T")[0],
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
  };

  if (!displayCompany) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div
      className="min-h-[800px] bg-white p-8 rounded-lg"
      style={{
        fontFamily: layout.fontFamily,
        color: layout.colorScheme.text,
        border: layout.showBorder
          ? `2px solid ${layout.colorScheme.primary}`
          : "none",
      }}
    >
      {/* Template Info Banner */}
      <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800">
        <strong>Template Preview:</strong> This shows your invoice design.
        Actual amounts will appear when creating invoices.
        {description && <div className="mt-1 text-blue-600">{description}</div>}
      </div>

      {/* Header */}
      <div
        className={`mb-8 ${
          layout.headerStyle === "bold"
            ? "bg-gradient-to-r p-6 rounded-lg"
            : layout.headerStyle === "creative"
              ? "relative overflow-hidden p-6 rounded-xl"
              : "pb-6 border-b-2"
        }`}
        style={{
          backgroundColor:
            layout.headerStyle !== "minimal"
              ? layout.colorScheme.primary
              : "transparent",
          borderColor:
            layout.headerStyle === "minimal"
              ? layout.colorScheme.primary
              : "transparent",
          color:
            layout.headerStyle !== "minimal"
              ? "#ffffff"
              : layout.colorScheme.text,
        }}
      >
        {layout.headerStyle === "creative" && (
          <div
            className="absolute -top-10 -right-10 w-32 h-32 rounded-full opacity-20"
            style={{ backgroundColor: layout.colorScheme.accent }}
          />
        )}
        <div
          className={`flex items-start ${
            layout.logoPosition === "center"
              ? "flex-col items-center text-center"
              : layout.logoPosition === "right"
                ? "flex-row-reverse justify-between"
                : "justify-between"
          }`}
        >
          <div
            className={layout.logoPosition === "center" ? "order-2 mt-4" : ""}
          >
            <h1 className="text-3xl font-bold mb-2">{displayCompany.name}</h1>
            <div className="text-sm opacity-90 whitespace-pre-line">
              {displayCompany.address}
            </div>
            <div className="text-sm mt-2 opacity-90">
              {displayCompany.phone} • {displayCompany.email}
            </div>
          </div>

          {/* Logo */}
          <div className={layout.logoPosition === "center" ? "order-1" : ""}>
            {displayCompany.logoUrl ? (
              <img
                src={displayCompany.logoUrl}
                alt="Company logo"
                className="h-20 w-20 object-contain"
              />
            ) : (
              <div
                className="w-20 h-20 rounded-lg flex items-center justify-center text-xs font-medium"
                style={{
                  backgroundColor:
                    layout.headerStyle !== "minimal"
                      ? "rgba(255,255,255,0.2)"
                      : layout.colorScheme.accent,
                  color: "#ffffff",
                }}
              >
                LOGO
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Invoice Details */}
      <div className="grid grid-cols-2 gap-8 mb-8">
        <div>
          <h2
            className="text-lg font-semibold mb-4"
            style={{ color: layout.colorScheme.primary }}
          >
            Bill To:
          </h2>
          <div className="space-y-1">
            <div className="font-medium">{mockPreviewData.customer.name}</div>
            <div className="text-sm whitespace-pre-line">
              {mockPreviewData.customer.address}
            </div>
            <div className="text-sm">{mockPreviewData.customer.email}</div>
          </div>
        </div>
        <div className="text-right">
          <h1
            className="text-4xl font-bold mb-2"
            style={{ color: layout.colorScheme.primary }}
          >
            INVOICE
          </h1>
          <div className="text-sm space-y-1">
            <div>
              <strong>Invoice #:</strong> {mockPreviewData.invoiceNumber}
            </div>
            <div>
              <strong>Date:</strong> {mockPreviewData.issueDate}
            </div>
            <div>
              <strong>Due Date:</strong> {mockPreviewData.dueDate}
            </div>
          </div>
        </div>
      </div>

      {/* Items Table */}
      <div className="mb-8">
        <table className="w-full">
          <thead>
            <tr
              style={{
                backgroundColor: layout.colorScheme.primary,
                color: "#ffffff",
              }}
            >
              <th className="text-left p-3 font-semibold">Description</th>
              <th className="text-center p-3 font-semibold">Qty</th>
              <th className="text-right p-3 font-semibold">Price</th>
              <th className="text-right p-3 font-semibold">Total</th>
            </tr>
          </thead>
          <tbody>
            {mockPreviewData.items.map((item, index) => (
              <tr
                key={index}
                style={{
                  backgroundColor:
                    index % 2 === 0
                      ? `${layout.colorScheme.accent}10`
                      : "transparent",
                }}
              >
                <td className="p-3 border-b border-gray-200">
                  {item.description}
                </td>
                <td className="p-3 border-b border-gray-200 text-center">
                  {item.quantity}
                </td>
                <td className="p-3 border-b border-gray-200 text-right">
                  ${item.price.toFixed(2)}
                </td>
                <td className="p-3 border-b border-gray-200 text-right font-medium">
                  ${item.total.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Totals */}
      <div className="flex justify-end mb-8">
        <div className="w-80">
          <div className="space-y-2">
            <div className="flex justify-between py-2">
              <span>Subtotal:</span>
              <span>${mockPreviewData.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between py-2">
              <span>Tax:</span>
              <span>${mockPreviewData.tax.toFixed(2)}</span>
            </div>
            <div
              className="flex justify-between py-3 border-t-2 text-xl font-bold"
              style={{
                borderColor: layout.colorScheme.primary,
                color: layout.colorScheme.primary,
              }}
            >
              <span>Total:</span>
              <span>${mockPreviewData.total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div
        className="text-center text-sm"
        style={{ color: layout.colorScheme.secondary }}
      >
        <div className="mb-2">Thank you for your business!</div>
        <div>Payment is due within 30 days of invoice date.</div>
      </div>

      {/* Watermark */}
      {layout.showWatermark && (
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          style={{
            fontSize: "120px",
            fontWeight: "bold",
            color: `${layout.colorScheme.primary}05`,
            transform: "rotate(-45deg)",
            zIndex: 0,
          }}
        >
          PREVIEW
        </div>
      )}
    </div>
  );
}
