import PDFDocument from "pdfkit";
import { env } from "../config/env.js";

const formatCurrency = (amountInr) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
  }).format(amountInr);

const formatDateTime = (value) => {
  if (!value) {
    return "-";
  }

  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
};

export const buildReceiptPdfBuffer = (transaction) =>
  new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      size: "A4",
      margin: 48,
      info: {
        Title: `Receipt ${transaction.receiptNumber}`,
        Author: env.paymentBusinessName,
      },
    });

    const chunks = [];

    doc.on("data", (chunk) => chunks.push(chunk));
    doc.on("error", reject);
    doc.on("end", () => resolve(Buffer.concat(chunks)));

    doc
      .fontSize(22)
      .fillColor("#0f172a")
      .text(env.paymentBusinessName, { align: "left" });

    doc
      .fontSize(10)
      .fillColor("#334155")
      .text("Official Payment Receipt", { align: "left" })
      .moveDown(1.5);

    doc
      .lineWidth(1)
      .strokeColor("#cbd5e1")
      .moveTo(48, doc.y)
      .lineTo(547, doc.y)
      .stroke()
      .moveDown(1.2);

    const rows = [
      ["Receipt Number", transaction.receiptNumber],
      ["Service", transaction.serviceName],
      ["Amount Paid", formatCurrency(transaction.amountInr)],
      ["Currency", transaction.currency],
      ["Payment Status", transaction.status.toUpperCase()],
      ["Paid At", formatDateTime(transaction.paidAt)],
      ["Order ID", transaction.razorpayOrderId || "-"],
      ["Payment ID", transaction.razorpayPaymentId || "-"],
      ["Customer Name", transaction.customerName],
      ["Customer Email", transaction.customerEmail],
      ["Customer Phone", transaction.customerPhone || "-"],
    ];

    rows.forEach(([label, value]) => {
      doc
        .font("Helvetica-Bold")
        .fontSize(10)
        .fillColor("#0f172a")
        .text(label, { continued: true, width: 180 })
        .font("Helvetica")
        .fillColor("#334155")
        .text(`: ${value}`)
        .moveDown(0.4);
    });

    doc.moveDown(1.4);
    doc
      .font("Helvetica-Bold")
      .fontSize(11)
      .fillColor("#0f172a")
      .text("Support and Policy")
      .moveDown(0.4)
      .font("Helvetica")
      .fontSize(10)
      .fillColor("#334155")
      .text(`Support Email: ${env.paymentSupportEmail}`)
      .text("Refund Policy: 7-day request window from payment date.")
      .text(`Policy URL: ${env.paymentRefundPolicyUrl}`)
      .moveDown(0.8)
      .fontSize(9)
      .fillColor("#64748b")
      .text(
        "This is a system-generated receipt for a successful payment processed via Cashfree.",
      );

    doc.end();
  });
