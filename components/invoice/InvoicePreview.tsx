"use client";

import React from "react";
import { Doc } from "@/convex/_generated/dataModel";
import { formatCurrency } from "@/lib/currency";

interface InvoicePreviewProps {
  invoice: Doc<"invoices">;
  template: Doc<"templates">;
  company: Doc<"companies">;
}

function InvoicePreview({ invoice, template, company }: InvoicePreviewProps) {
  const { layout } = template;

  return (
    <div
      id="invoice-preview"
      style={{
        backgroundColor: layout.colorScheme.background,
        color: layout.colorScheme.text,
        fontFamily: layout.fontFamily,
        border: layout.showBorder
          ? `1px solid ${layout.colorScheme.accent}`
          : "none",
        padding: "30px",
        maxWidth: "800px",
        margin: "0 auto",
      }}
    >
      {/* Header with Logo */}
      <div
        style={{
          display: "flex",
          justifyContent:
            layout.logoPosition === "left"
              ? "flex-start"
              : layout.logoPosition === "right"
                ? "flex-end"
                : "center",
          marginBottom: "20px",
        }}
      >
        {company.logoUrl && (
          <img
            src={company.logoUrl}
            alt={`${company.name} logo`}
            style={{
              maxHeight: "100px",
              maxWidth: "200px",
              objectFit: "contain",
            }}
          />
        )}
      </div>

      {/* Invoice Title */}
      <h1
        style={{
          fontSize:
            layout.headerStyle === "bold"
              ? "2rem"
              : layout.headerStyle === "creative"
                ? "1.8rem"
                : "1.5rem",
          fontWeight: layout.headerStyle === "bold" ? "bold" : "normal",
          textAlign: "center",
          color: layout.colorScheme.primary,
          marginBottom: "20px",
        }}
      >
        Invoice #{invoice.invoiceNumber}
      </h1>

      {/* Company and Customer Details */}
      <div
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}
      >
        <div>
          <h3
            style={{
              color: layout.colorScheme.secondary,
              marginBottom: "10px",
            }}
          >
            From:
          </h3>
          <p style={{ fontWeight: "bold" }}>{company.name}</p>
          <p>{company.address}</p>
          <p>{company.email}</p>
          <p>{company.phone}</p>
          {company.website && (
            <p>
              <a
                href={company.website}
                style={{ color: layout.colorScheme.accent }}
              >
                {company.website}
              </a>
            </p>
          )}
        </div>
        <div>
          <h3
            style={{
              color: layout.colorScheme.secondary,
              marginBottom: "10px",
            }}
          >
            Billed To:
          </h3>
          <p style={{ fontWeight: "bold" }}>{invoice.customer.name}</p>
          <p>{invoice.customer.email}</p>
          <p>{invoice.customer.address}</p>
          {invoice.customer.phone && <p>{invoice.customer.phone}</p>}
        </div>
      </div>

      {/* Invoice Details */}
      <div style={{ marginTop: "30px" }}>
        <p>Issue Date: {invoice.issueDate}</p>
        <p>Due Date: {invoice.dueDate}</p>
      </div>

      {/* Items Table */}
      <table
        style={{
          width: "100%",
          marginTop: "20px",
          borderCollapse: "collapse",
          backgroundColor: layout.colorScheme.background,
        }}
      >
        <thead>
          <tr
            style={{ borderBottom: `1px solid ${layout.colorScheme.accent}` }}
          >
            <th style={{ padding: "10px", textAlign: "left" }}>Description</th>
            <th style={{ padding: "10px", textAlign: "right" }}>Quantity</th>
            <th style={{ padding: "10px", textAlign: "right" }}>Price</th>
            <th style={{ padding: "10px", textAlign: "right" }}>Total</th>
          </tr>
        </thead>
        <tbody>
          {invoice.items.map((item) => (
            <tr
              key={item.id}
              style={{
                borderBottom: `1px solid ${layout.colorScheme.secondary}40`,
              }}
            >
              <td style={{ padding: "10px" }}>{item.description}</td>
              <td style={{ padding: "10px", textAlign: "right" }}>
                {item.quantity}
              </td>
              <td style={{ padding: "10px", textAlign: "right" }}>
                {formatCurrency(item.price)}
              </td>
              <td style={{ padding: "10px", textAlign: "right" }}>
                {formatCurrency(item.total)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Totals */}
      <div style={{ marginTop: "20px", textAlign: "right" }}>
        <p>Subtotal: {formatCurrency(invoice.subtotal)}</p>
        <p>
          Tax (
          {(invoice.subtotal !== 0
            ? (invoice.tax / invoice.subtotal) * 100
            : 0
          ).toFixed(1)}
          %): {formatCurrency(invoice.tax)}
        </p>
        <p style={{ fontWeight: "bold", color: layout.colorScheme.primary }}>
          Total: {formatCurrency(invoice.total)}
        </p>
      </div>

      {/* Banking Details */}
      {company.bankingDetails && (
        <div style={{ marginTop: "20px" }}>
          <h3 style={{ color: layout.colorScheme.secondary }}>
            Payment Information
          </h3>
          <p>Bank: {company.bankingDetails.bankName}</p>
          <p>Account Number: {company.bankingDetails.accountNumber}</p>
          <p>Branch Code: {company.bankingDetails.branchCode}</p>
          <p>Account Holder: {company.bankingDetails.accountHolder}</p>
        </div>
      )}

      {/* Notes */}
      {invoice.notes && (
        <div style={{ marginTop: "20px" }}>
          <h3 style={{ color: layout.colorScheme.secondary }}>Notes</h3>
          <p>{invoice.notes}</p>
        </div>
      )}

      {/* Watermark */}
      {layout.showWatermark && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%) rotate(-45deg)",
            opacity: 0.1,
            fontSize: "4rem",
            color: layout.colorScheme.accent,
            pointerEvents: "none",
          }}
        >
          InvoicePro
        </div>
      )}
    </div>
  );
}

export default InvoicePreview;
