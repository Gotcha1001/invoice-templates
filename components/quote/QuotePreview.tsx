"use client";

import React from "react";
import { Doc } from "@/convex/_generated/dataModel";
import { formatCurrency } from "@/lib/currency";

interface QuotePreviewProps {
  quote: Doc<"quotes">;
  template: Doc<"templates">;
  company: Doc<"companies">;
}

function QuotePreview({ quote, template, company }: QuotePreviewProps) {
  const { layout } = template;

  // Calculate discount amount
  const discountAmount = quote.discount
    ? quote.discountType === "percentage"
      ? (quote.subtotal * quote.discount) / 100
      : quote.discount
    : 0;

  return (
    <div
      id="quote-preview"
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
      {/* Header */}
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

      {/* Quote Title */}
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
        QUOTE #{quote.quoteNumber}
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
            Quote For:
          </h3>
          <p style={{ fontWeight: "bold" }}>{quote.customer.name}</p>
          <p>{quote.customer.email}</p>
          <p>{quote.customer.address}</p>
          {quote.customer.phone && <p>{quote.customer.phone}</p>}
        </div>
      </div>

      {/* Quote Details */}
      <div style={{ marginTop: "30px" }}>
        <p>Issue Date: {quote.issueDate}</p>
        <p>Valid Until: {quote.validUntil}</p>
        <p
          style={{
            color:
              quote.status === "accepted"
                ? "#10b981"
                : quote.status === "rejected" || quote.status === "expired"
                  ? "#ef4444"
                  : layout.colorScheme.text,
            fontWeight: "bold",
          }}
        >
          Status: {quote.status.charAt(0).toUpperCase() + quote.status.slice(1)}
        </p>
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
          {quote.items.map((item) => (
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
                {formatCurrency(item.price, quote.currency)}
              </td>
              <td style={{ padding: "10px", textAlign: "right" }}>
                {formatCurrency(item.total, quote.currency)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Totals */}
      <div style={{ marginTop: "20px", textAlign: "right" }}>
        <p>Subtotal: {formatCurrency(quote.subtotal, quote.currency)}</p>
        {quote.discount && discountAmount > 0 && (
          <p style={{ color: layout.colorScheme.accent }}>
            Discount (
            {quote.discountType === "percentage"
              ? `${quote.discount}%`
              : "Fixed"}
            ): -{formatCurrency(discountAmount, quote.currency)}
          </p>
        )}
        <p>
          Tax (
          {(quote.subtotal !== 0
            ? (quote.tax / quote.subtotal) * 100
            : 0
          ).toFixed(1)}
          %): {formatCurrency(quote.tax, quote.currency)}
        </p>
        <p style={{ fontWeight: "bold", color: layout.colorScheme.primary }}>
          Total: {formatCurrency(quote.total, quote.currency)}
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
      {quote.notes && (
        <div style={{ marginTop: "20px" }}>
          <h3 style={{ color: layout.colorScheme.secondary }}>Notes</h3>
          <p>{quote.notes}</p>
        </div>
      )}

      {/* Quote Validity Notice */}
      <div
        style={{
          marginTop: "30px",
          padding: "15px",
          backgroundColor: `${layout.colorScheme.accent}20`,
          borderRadius: "8px",
        }}
      >
        <p style={{ fontSize: "0.9rem", textAlign: "center" }}>
          This quote is valid until{" "}
          {new Date(quote.validUntil).toLocaleDateString()}. Please contact us
          if you have any questions.
        </p>
      </div>

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
          QUOTE
        </div>
      )}
    </div>
  );
}

export default QuotePreview;
