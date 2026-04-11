import { Resend } from "resend";
import { env } from "../config/env.js";

const resendClient = env.resendApiKey ? new Resend(env.resendApiKey) : null;

const escapeHtml = (value) =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

export const isReceiptEmailEnabled = () =>
  Boolean(
    resendClient && env.paymentReceiptEmailEnabled && env.paymentFromEmail,
  );

export const sendReceiptEmail = async ({
  customerName,
  customerEmail,
  receiptNumber,
  serviceName,
  amountInr,
  paidAt,
  downloadUrl,
  pdfBuffer,
}) => {
  if (!isReceiptEmailEnabled()) {
    return { sent: false, skipped: true, reason: "email-disabled" };
  }

  const paidAtText = new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(paidAt));

  const amountText = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
  }).format(amountInr);

  const subject = `Payment Receipt ${receiptNumber} | ${env.paymentBusinessName}`;

  const html = `
    <div style="font-family:Arial,sans-serif;line-height:1.5;color:#0f172a;max-width:620px;margin:0 auto;padding:16px;">
      <h2 style="margin:0 0 8px;">Payment Confirmed</h2>
      <p style="margin:0 0 14px;">Hi ${escapeHtml(customerName)}, your payment has been confirmed.</p>
      <table style="width:100%;border-collapse:collapse;margin:0 0 16px;">
        <tr><td style="padding:6px 0;color:#475569;">Receipt Number</td><td style="padding:6px 0;font-weight:600;">${escapeHtml(receiptNumber)}</td></tr>
        <tr><td style="padding:6px 0;color:#475569;">Service</td><td style="padding:6px 0;">${escapeHtml(serviceName)}</td></tr>
        <tr><td style="padding:6px 0;color:#475569;">Amount Paid</td><td style="padding:6px 0;">${escapeHtml(amountText)}</td></tr>
        <tr><td style="padding:6px 0;color:#475569;">Paid At</td><td style="padding:6px 0;">${escapeHtml(paidAtText)}</td></tr>
      </table>
      <p style="margin:0 0 16px;">
        Download receipt: <a href="${escapeHtml(downloadUrl)}" target="_blank" rel="noreferrer">Open receipt link</a>
      </p>
      <p style="margin:0;color:#64748b;font-size:12px;">Support: ${escapeHtml(env.paymentSupportEmail)}</p>
      <p style="margin:0;color:#64748b;font-size:12px;">Refund Policy: <a href="${escapeHtml(env.paymentRefundPolicyUrl)}">${escapeHtml(env.paymentRefundPolicyUrl)}</a></p>
    </div>
  `;

  const response = await resendClient.emails.send({
    from: env.paymentFromEmail,
    to: customerEmail,
    subject,
    html,
    attachments: [
      {
        filename: `${receiptNumber}.pdf`,
        content: pdfBuffer,
      },
    ],
  });

  return {
    sent: true,
    skipped: false,
    id: response?.data?.id || "",
  };
};

export const sendReceiptAccessCodeEmail = async ({ email, code }) => {
  if (!isReceiptEmailEnabled()) {
    return { sent: false, skipped: true, reason: "email-disabled" };
  }

  const html = `
    <div style="font-family:Arial,sans-serif;line-height:1.5;color:#0f172a;max-width:620px;margin:0 auto;padding:16px;">
      <h2 style="margin:0 0 8px;">Receipt Access Code</h2>
      <p style="margin:0 0 12px;">Use the code below to open your receipt history.</p>
      <p style="margin:0 0 12px;font-size:28px;font-weight:700;letter-spacing:4px;">${escapeHtml(code)}</p>
      <p style="margin:0;color:#64748b;font-size:12px;">This code expires in ${env.paymentAccessCodeTtlMinutes} minutes.</p>
      <p style="margin:0;color:#64748b;font-size:12px;">If you did not request this code, please ignore this message.</p>
    </div>
  `;

  const response = await resendClient.emails.send({
    from: env.paymentFromEmail,
    to: email,
    subject: `Receipt access code | ${env.paymentBusinessName}`,
    html,
  });

  return {
    sent: true,
    skipped: false,
    id: response?.data?.id || "",
  };
};
