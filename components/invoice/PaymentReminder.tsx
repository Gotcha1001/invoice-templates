import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Bell, Download, X, Mail } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { formatCurrency } from "@/lib/currency";

interface PaymentReminderProps {
  invoice: any;
  template: any;
  company: any;
}

const PaymentReminder: React.FC<PaymentReminderProps> = ({
  invoice,
  template,
  company,
}) => {
  const [showReminder, setShowReminder] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const reminderRef = useRef<HTMLDivElement>(null);

  const { layout } = template;

  // Calculate days overdue or days until due
  const calculateDaysDifference = () => {
    const today = new Date();
    const dueDate = new Date(invoice.dueDate);
    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysDiff = calculateDaysDifference();
  const isOverdue = daysDiff < 0;
  const daysText = isOverdue
    ? `${Math.abs(daysDiff)} day${Math.abs(daysDiff) !== 1 ? "s" : ""} overdue`
    : `due in ${daysDiff} day${daysDiff !== 1 ? "s" : ""}`;

  const getReminderMessage = () => {
    if (isOverdue) {
      return {
        greeting: "Gentle Reminder",
        message: `We hope this message finds you well. We wanted to kindly remind you that invoice #${invoice.invoiceNumber} is now ${daysText}.`,
        urgency:
          "We understand that oversights happen, and we appreciate your prompt attention to this matter.",
      };
    } else if (daysDiff <= 3) {
      return {
        greeting: "Friendly Reminder",
        message: `We hope you're doing well! This is a friendly reminder that invoice #${invoice.invoiceNumber} is ${daysText}.`,
        urgency:
          "We wanted to give you a heads up to help you stay on top of your payments.",
      };
    } else {
      return {
        greeting: "Payment Reminder",
        message: `Thank you for your continued business! This is a courtesy reminder that invoice #${invoice.invoiceNumber} is ${daysText}.`,
        urgency:
          "Please feel free to reach out if you have any questions or concerns.",
      };
    }
  };

  const reminderContent = getReminderMessage();

  const handleDownloadReminder = async () => {
    if (!reminderRef.current) return;

    setIsDownloading(true);
    try {
      const canvas = await html2canvas(reminderRef.current, { scale: 2 });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
      pdf.save(`payment-reminder-${invoice.invoiceNumber}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <>
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Button
          onClick={() => setShowReminder(true)}
          className="group relative overflow-hidden bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent pointer-events-none"
            initial={{ x: "-100%" }}
            whileHover={{ x: "100%" }}
            transition={{ duration: 0.5 }}
          />
          <Bell
            size={16}
            className="mr-2 group-hover:rotate-12 transition-transform duration-300"
          />
          Generate Payment Reminder
        </Button>
      </motion.div>

      <AnimatePresence>
        {showReminder && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowReminder(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-auto"
            >
              <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center z-10">
                <h2 className="text-2xl font-bold text-slate-900">
                  Payment Reminder
                </h2>
                <div className="flex gap-2">
                  <Button
                    onClick={handleDownloadReminder}
                    disabled={isDownloading}
                    className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
                  >
                    <Download size={16} className="mr-2" />
                    {isDownloading ? "Generating..." : "Download PDF"}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowReminder(false)}
                    className="hover:bg-rose-50 hover:text-rose-600"
                  >
                    <X size={20} />
                  </Button>
                </div>
              </div>

              <div className="p-8">
                <div
                  ref={reminderRef}
                  style={{
                    backgroundColor: layout.colorScheme.background,
                    color: layout.colorScheme.text,
                    fontFamily: layout.fontFamily,
                    border: layout.showBorder
                      ? `2px solid ${layout.colorScheme.primary}`
                      : "none",
                    padding: "40px",
                    borderRadius: "8px",
                  }}
                >
                  {/* Header */}
                  <div
                    style={{
                      borderBottom: `3px solid ${layout.colorScheme.primary}`,
                      paddingBottom: "24px",
                      marginBottom: "32px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    {company.logoUrl && (
                      <img
                        src={company.logoUrl}
                        alt={`${company.name} logo`}
                        style={{
                          maxHeight: "80px",
                          maxWidth: "200px",
                          objectFit: "contain",
                        }}
                      />
                    )}
                    <div style={{ textAlign: "right" }}>
                      <h1
                        style={{
                          fontSize: "2rem",
                          fontWeight: "bold",
                          color: layout.colorScheme.primary,
                          margin: 0,
                        }}
                      >
                        {reminderContent.greeting}
                      </h1>
                      <p style={{ margin: "8px 0 0 0", opacity: 0.7 }}>
                        {new Date().toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  </div>

                  {/* Greeting */}
                  <div style={{ marginBottom: "32px" }}>
                    <p
                      style={{
                        fontSize: "1.1rem",
                        marginBottom: "24px",
                        lineHeight: "1.6",
                      }}
                    >
                      Dear {invoice.customer.name},
                    </p>
                    <p
                      style={{
                        fontSize: "1rem",
                        marginBottom: "16px",
                        lineHeight: "1.6",
                      }}
                    >
                      {reminderContent.message}
                    </p>
                    <p
                      style={{
                        fontSize: "1rem",
                        marginBottom: "24px",
                        lineHeight: "1.6",
                      }}
                    >
                      {reminderContent.urgency}
                    </p>
                  </div>

                  {/* Invoice Details Box */}
                  <div
                    style={{
                      backgroundColor: `${layout.colorScheme.primary}15`,
                      border: `2px solid ${layout.colorScheme.primary}`,
                      borderRadius: "8px",
                      padding: "24px",
                      marginBottom: "32px",
                    }}
                  >
                    <h2
                      style={{
                        fontSize: "1.3rem",
                        fontWeight: "bold",
                        color: layout.colorScheme.primary,
                        marginBottom: "16px",
                      }}
                    >
                      Invoice Details
                    </h2>
                    <div style={{ display: "grid", gap: "12px" }}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <span style={{ fontWeight: "600" }}>
                          Invoice Number:
                        </span>
                        <span>{invoice.invoiceNumber}</span>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <span style={{ fontWeight: "600" }}>Invoice Date:</span>
                        <span>
                          {new Date(invoice.issueDate).toLocaleDateString()}
                        </span>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <span style={{ fontWeight: "600" }}>Due Date:</span>
                        <span
                          style={{
                            color: isOverdue
                              ? "#dc2626"
                              : layout.colorScheme.text,
                            fontWeight: isOverdue ? "bold" : "normal",
                          }}
                        >
                          {new Date(invoice.dueDate).toLocaleDateString()}
                        </span>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          paddingTop: "12px",
                          borderTop: `1px solid ${layout.colorScheme.primary}40`,
                        }}
                      >
                        <span
                          style={{ fontWeight: "bold", fontSize: "1.1rem" }}
                        >
                          Amount Due:
                        </span>
                        <span
                          style={{
                            fontWeight: "bold",
                            fontSize: "1.3rem",
                            color: layout.colorScheme.primary,
                          }}
                        >
                          {formatCurrency(invoice.total, invoice.currency)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Payment Information */}
                  {company.bankingDetails && (
                    <div style={{ marginBottom: "32px" }}>
                      <h2
                        style={{
                          fontSize: "1.2rem",
                          fontWeight: "bold",
                          color: layout.colorScheme.primary,
                          marginBottom: "16px",
                        }}
                      >
                        Payment Information
                      </h2>
                      <div
                        style={{
                          display: "grid",
                          gap: "8px",
                          fontSize: "0.95rem",
                        }}
                      >
                        <p>
                          <strong>Bank Name:</strong>{" "}
                          {company.bankingDetails.bankName}
                        </p>
                        <p>
                          <strong>Account Number:</strong>{" "}
                          {company.bankingDetails.accountNumber}
                        </p>
                        <p>
                          <strong>Branch Code:</strong>{" "}
                          {company.bankingDetails.branchCode}
                        </p>
                        <p>
                          <strong>Account Holder:</strong>{" "}
                          {company.bankingDetails.accountHolder}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Closing */}
                  <div style={{ marginBottom: "32px" }}>
                    <p style={{ marginBottom: "16px", lineHeight: "1.6" }}>
                      If you have already made this payment, please disregard
                      this reminder. If you have any questions or concerns
                      regarding this invoice, please don't hesitate to contact
                      us.
                    </p>
                    <p style={{ marginBottom: "24px", lineHeight: "1.6" }}>
                      Thank you for your prompt attention to this matter. We
                      truly value your business and look forward to continuing
                      our partnership.
                    </p>
                    <p style={{ fontWeight: "600" }}>Best regards,</p>
                    <p
                      style={{
                        fontWeight: "bold",
                        color: layout.colorScheme.primary,
                      }}
                    >
                      {company.name}
                    </p>
                  </div>

                  {/* Footer */}
                  <div
                    style={{
                      borderTop: `2px solid ${layout.colorScheme.primary}`,
                      paddingTop: "24px",
                      textAlign: "center",
                      fontSize: "0.9rem",
                      opacity: 0.8,
                    }}
                  >
                    <p style={{ marginBottom: "8px" }}>{company.address}</p>
                    <p style={{ marginBottom: "8px" }}>
                      {company.phone} • {company.email}
                    </p>
                    {company.website && <p>{company.website}</p>}
                  </div>

                  {/* Watermark */}
                  {layout.showWatermark && (
                    <div
                      style={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%) rotate(-45deg)",
                        opacity: 0.05,
                        fontSize: "4rem",
                        color: layout.colorScheme.primary,
                        fontWeight: "bold",
                        pointerEvents: "none",
                      }}
                    >
                      REMINDER
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default PaymentReminder;
