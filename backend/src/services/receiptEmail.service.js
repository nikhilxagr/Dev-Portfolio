import { Resend } from "resend";
import { env } from "../config/env.js";
import { sendMail } from "./mailer.service.js";

const resendClient = env.resendApiKey ? new Resend(env.resendApiKey) : null;

const escapeHtml = (value) =>
  String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

export const isReceiptEmailEnabled = () =>
  Boolean(
    (env.smtpUser && env.smtpPass) ||
      (resendClient && env.paymentReceiptEmailEnabled && env.paymentFromEmail),
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

  const subject = `Official Payment Receipt #${receiptNumber} | ${env.paymentBusinessName}`;

  const html = `
    <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;background-color:#090d16;color:#e2e8f0;padding:32px 16px;line-height:1.6;">
      <div style="max-width:580px;margin:0 auto;background:#111827;border:1px solid rgba(255,255,255,0.1);border-radius:16px;overflow:hidden;box-shadow:0 12px 36px rgba(0,0,0,0.5);">
        <div style="background:#0f172a;padding:24px 28px;border-bottom:1px solid rgba(255,255,255,0.06);text-align:center;">
          <div style="font-size:11px;font-weight:700;letter-spacing:2px;color:#10b981;text-transform:uppercase;margin-bottom:6px;">
            // PAYMENT CONFIRMED &amp; VERIFIED
          </div>
          <h1 style="margin:0;font-size:22px;color:#ffffff;font-weight:800;">${escapeHtml(env.paymentBusinessName)}</h1>
        </div>
        <div style="padding:32px 28px;">
          <h2 style="margin:0 0 10px;font-size:18px;color:#f8fafc;font-weight:700;">
            Thank you for your payment, ${escapeHtml(customerName)}!
          </h2>
          <p style="margin:0 0 20px;font-size:14px;color:#94a3b8;">
            Your payment for <strong>${escapeHtml(serviceName)}</strong> has been successfully processed and verified. Attached to this email is your official PDF tax invoice &amp; receipt.
          </p>

          <table style="width:100%;border-collapse:collapse;margin:20px 0;background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.06);border-radius:12px;overflow:hidden;">
            <tr style="border-bottom:1px solid rgba(255,255,255,0.06);">
              <td style="padding:12px 16px;color:#64748b;font-size:13px;">Receipt Number</td>
              <td style="padding:12px 16px;font-weight:700;color:#38bdf8;font-size:13px;font-family:monospace;">${escapeHtml(receiptNumber)}</td>
            </tr>
            <tr style="border-bottom:1px solid rgba(255,255,255,0.06);">
              <td style="padding:12px 16px;color:#64748b;font-size:13px;">Service / Item</td>
              <td style="padding:12px 16px;color:#f1f5f9;font-size:13px;">${escapeHtml(serviceName)}</td>
            </tr>
            <tr style="border-bottom:1px solid rgba(255,255,255,0.06);">
              <td style="padding:12px 16px;color:#64748b;font-size:13px;">Amount Paid</td>
              <td style="padding:12px 16px;font-weight:800;color:#10b981;font-size:16px;">${escapeHtml(amountText)}</td>
            </tr>
            <tr>
              <td style="padding:12px 16px;color:#64748b;font-size:13px;">Date &amp; Time</td>
              <td style="padding:12px 16px;color:#f1f5f9;font-size:13px;">${escapeHtml(paidAtText)}</td>
            </tr>
          </table>

          <div style="text-align:center;margin:28px 0;">
            <a href="${escapeHtml(downloadUrl)}" style="display:inline-block;background:#10b981;color:#090d16;font-weight:700;font-size:14px;padding:12px 28px;border-radius:10px;text-decoration:none;">
              Download PDF Receipt &darr;
            </a>
          </div>

          <p style="margin:0;font-size:12px;color:#64748b;text-align:center;">
            The PDF receipt is also attached directly to this email for your bookkeeping.
          </p>
        </div>
        <div style="background:#090d16;padding:18px 24px;text-align:center;font-size:12px;color:#64748b;border-top:1px solid rgba(255,255,255,0.06);">
          Support: <a href="mailto:${escapeHtml(env.paymentSupportEmail)}" style="color:#38bdf8;text-decoration:none;">${escapeHtml(env.paymentSupportEmail)}</a> | Refund Policy: <a href="${escapeHtml(env.paymentRefundPolicyUrl)}" style="color:#38bdf8;text-decoration:none;">Terms</a>
        </div>
      </div>
    </div>
  `;

  if (env.smtpUser && env.smtpPass) {
    const result = await sendMail({
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
      sent: Boolean(result.sent && !result.simulated),
      skipped: false,
      id: result.messageId || "",
    };
  }

  if (resendClient && env.paymentReceiptEmailEnabled && env.paymentFromEmail) {
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
  }

  return { sent: false, skipped: true, reason: "no-configured-sender" };
};

export const sendReceiptAccessCodeEmail = async ({ email, code }) => {
  if (!isReceiptEmailEnabled()) {
    return { sent: false, skipped: true, reason: "email-disabled" };
  }

  const html = `
    <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;background-color:#090d16;color:#e2e8f0;padding:32px 16px;line-height:1.6;">
      <div style="max-width:560px;margin:0 auto;background:#111827;border:1px solid rgba(255,255,255,0.1);border-radius:16px;overflow:hidden;box-shadow:0 12px 36px rgba(0,0,0,0.5);">
        <div style="background:#0f172a;padding:24px 28px;border-bottom:1px solid rgba(255,255,255,0.06);text-align:center;">
          <div style="font-size:11px;font-weight:700;letter-spacing:2px;color:#38bdf8;text-transform:uppercase;margin-bottom:6px;">
            // VERIFIED RECEIPT PORTAL
          </div>
          <h1 style="margin:0;font-size:22px;color:#ffffff;font-weight:800;">${escapeHtml(env.paymentBusinessName)}</h1>
        </div>
        <div style="padding:32px 28px;">
          <h2 style="margin:0 0 10px;font-size:18px;color:#f8fafc;font-weight:700;">Receipt Verification Code</h2>
          <p style="margin:0 0 20px;font-size:14px;color:#94a3b8;">
            Use the 6-digit security code below to access and download your verified payment receipts:
          </p>
          <div style="text-align:center;margin:28px 0;padding:20px;background:rgba(6,182,212,0.08);border:1px dashed #06b6d4;border-radius:12px;">
            <span style="font-size:36px;font-weight:800;letter-spacing:10px;color:#38bdf8;font-family:monospace;display:inline-block;">
              ${escapeHtml(code)}
            </span>
          </div>
          <p style="margin:0 0 8px;font-size:13px;color:#64748b;">
            • This code expires in <strong>${env.paymentAccessCodeTtlMinutes} minutes</strong>.
          </p>
          <p style="margin:0 0 24px;font-size:13px;color:#64748b;">
            • If you did not request this receipt access code, you can safely ignore this email.
          </p>
          <div style="text-align:center;padding-top:12px;border-top:1px solid rgba(255,255,255,0.06);">
            <a href="${env.frontendUrl}/receipts" style="display:inline-block;background:#06b6d4;color:#090d16;font-weight:700;font-size:14px;padding:12px 28px;border-radius:10px;text-decoration:none;">
              Open Receipt Portal &rarr;
            </a>
          </div>
        </div>
        <div style="background:#090d16;padding:18px 24px;text-align:center;font-size:12px;color:#64748b;border-top:1px solid rgba(255,255,255,0.06);">
          Support: <a href="mailto:${escapeHtml(env.paymentSupportEmail)}" style="color:#38bdf8;text-decoration:none;">${escapeHtml(env.paymentSupportEmail)}</a>
        </div>
      </div>
    </div>
  `;

  if (env.smtpUser && env.smtpPass) {
    const result = await sendMail({
      to: email,
      subject: `Your Receipt Verification Code: ${code} | ${env.paymentBusinessName}`,
      html,
    });
    return {
      sent: Boolean(result.sent && !result.simulated),
      skipped: false,
      id: result.messageId || "",
    };
  }

  if (resendClient && env.paymentReceiptEmailEnabled && env.paymentFromEmail) {
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
  }

  return { sent: false, skipped: true, reason: "no-configured-sender" };
};
