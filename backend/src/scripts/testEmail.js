import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const user = process.env.SMTP_USER || "nikhilagrahari530@gmail.com";
const rawPass = process.env.SMTP_PASS || "";
const pass = rawPass.replace(/\s+/g, ""); // strip any spaces in app password
const targetEmail = process.argv[2] || user;

console.log("==========================================");
console.log(" 📧 Nodemailer / Gmail SMTP Diagnostics");
console.log("==========================================");
console.log(`SMTP_USER: "${user}"`);
console.log(`SMTP_PASS: ${pass ? `[Set: ${pass.length} chars]` : "[NOT SET / EMPTY]"}`);
console.log(`Target Email: "${targetEmail}"`);
console.log("------------------------------------------");

if (!pass) {
  console.error("❌ ERROR: SMTP_PASS is missing or empty in backend/.env!");
  console.log("\nTo send real emails using your Gmail account:");
  console.log("1. Enable 2-Step Verification on your Google Account: https://myaccount.google.com/security");
  console.log("2. Generate a 16-character App Password at: https://myaccount.google.com/apppasswords");
  console.log("   (Name it 'Portfolio')");
  console.log("3. Paste the 16 characters into backend/.env as:");
  console.log("   SMTP_PASS=xxxx yyyy zzzz wwww");
  console.log("==========================================\n");
  process.exit(1);
}

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: { user, pass },
});

console.log("Connecting to Gmail SMTP servers...");

transporter.verify((error, success) => {
  if (error) {
    console.error("❌ SMTP Verification Failed:", error.message);
    if (error.message.includes("Username and Password not accepted") || error.message.includes("Invalid login")) {
      console.log("\n💡 Hint: Gmail rejected your credentials.");
      console.log("- Make sure you are using a 16-character Google 'App Password', NOT your standard Gmail login password.");
      console.log("- Create one here: https://myaccount.google.com/apppasswords");
    }
    process.exit(1);
  }

  console.log("✅ Gmail SMTP connection verified successfully!");
  console.log(`Sending test email to ${targetEmail}...`);

  transporter.sendMail({
    from: `"Nikhil Agrahari" <${user}>`,
    to: targetEmail,
    subject: "✅ Test Email from Portfolio Nodemailer",
    html: `
      <div style="font-family: sans-serif; background: #030d07; color: #fff; padding: 30px; border-radius: 12px;">
        <h2 style="color: #a3e635;">Nodemailer is Working! 🚀</h2>
        <p>This is a test email sent from your Dev Portfolio backend using Gmail SMTP.</p>
        <p style="color: #94a3b8; font-size: 13px;">Time: ${new Date().toISOString()}</p>
      </div>
    `,
  }, (err, info) => {
    if (err) {
      console.error("❌ Failed to send email:", err.message);
      process.exit(1);
    }
    console.log("🎉 Test email delivered successfully!");
    console.log("Message ID:", info.messageId);
    console.log("==========================================");
    process.exit(0);
  });
});
