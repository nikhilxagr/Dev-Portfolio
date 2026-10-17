import nodemailer from "nodemailer";
import dns from "node:dns";
import { env } from "../config/env.js";

// Ensure IPv4 is resolved first to avoid cloud host (Render/Docker) IPv6 timeouts on smtp.gmail.com
try {
  dns.setDefaultResultOrder("ipv4first");
} catch {
  // node < 17 fallback
}

let cachedTransporter = null;

const getTransporter = () => {
  if (cachedTransporter) return cachedTransporter;

  const rawPass = env.smtpPass ? String(env.smtpPass).trim() : "";
  const cleanedPass = rawPass.replace(/\s+/g, "");

  if (!cleanedPass) {
    return null;
  }

  // Use Nodemailer with explicit IPv4 and robust cloud timeouts
  if (
    (env.smtpHost && env.smtpHost.includes("gmail")) ||
    (env.smtpUser && env.smtpUser.includes("@gmail.com"))
  ) {
    cachedTransporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: env.smtpUser,
        pass: cleanedPass,
      },
      tls: {
        rejectUnauthorized: false,
      },
      family: 4, // Forces IPv4 to bypass Render's IPv6 ENETUNREACH issues
      connectionTimeout: 15000,
      greetingTimeout: 10000,
      socketTimeout: 20000,
    });
  } else {
    cachedTransporter = nodemailer.createTransport({
      host: env.smtpHost,
      port: env.smtpPort,
      secure: env.smtpSecure,
      auth: {
        user: env.smtpUser,
        pass: cleanedPass,
      },
      tls: {
        rejectUnauthorized: false,
      },
      family: 4,
      connectionTimeout: 15000,
      greetingTimeout: 10000,
      socketTimeout: 20000,
    });
  }

  return cachedTransporter;
};

// Common base email HTML wrapper
const createEmailLayout = ({
  title,
  preheader,
  eyebrow = "// NIKHIL AGRAHARI",
  headerTitle = "Nikhil Agrahari",
  headerSubtitle = "Full-Stack Engineer & System Architecture",
  contentHtml,
}) => {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #0b0f19;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      color: #e2e8f0;
      -webkit-font-smoothing: antialiased;
    }
    .wrapper {
      width: 100%;
      background-color: #0b0f19;
      padding: 36px 16px;
    }
    .container {
      max-width: 580px;
      margin: 0 auto;
      background-color: #111827;
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 16px 40px rgba(0, 0, 0, 0.45);
    }
    .header {
      background: #0f172a;
      padding: 28px 28px 22px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.06);
      text-align: center;
    }
    .brand-eyebrow {
      font-family: 'Courier New', Courier, monospace;
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.18em;
      color: #94a3b8;
      margin-bottom: 6px;
    }
    .brand-title {
      font-size: 22px;
      font-weight: 800;
      letter-spacing: -0.01em;
      color: #ffffff;
      margin: 0 0 4px;
    }
    .brand-sub {
      font-size: 12px;
      color: #64748b;
      margin: 0;
    }
    .content {
      padding: 32px 28px 28px;
    }
    .greeting {
      font-size: 20px;
      font-weight: 700;
      color: #ffffff;
      margin-bottom: 14px;
      letter-spacing: -0.01em;
    }
    .paragraph {
      font-size: 14px;
      line-height: 1.65;
      color: #94a3b8;
      margin: 0 0 18px;
    }
    .section-eyebrow {
      font-family: 'Courier New', Courier, monospace;
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.16em;
      color: #cbd5e1;
      margin: 24px 0 12px;
    }
    .card-link {
      background-color: rgba(255, 255, 255, 0.025);
      border: 1px solid rgba(255, 255, 255, 0.07);
      border-radius: 12px;
      padding: 14px 16px;
      margin-bottom: 10px;
      text-decoration: none;
      display: block;
    }
    .card-label {
      font-size: 11px;
      font-weight: 700;
      color: #38bdf8;
      margin-bottom: 3px;
      text-transform: uppercase;
      letter-spacing: 0.06em;
    }
    .card-title {
      font-size: 14px;
      font-weight: 700;
      color: #ffffff;
      margin: 0 0 4px;
    }
    .card-desc {
      font-size: 12px;
      color: #94a3b8;
      margin: 0;
      line-height: 1.5;
    }
    .btn-container {
      text-align: center;
      margin: 28px 0 18px;
    }
    .btn {
      display: inline-block;
      background-color: #ffffff;
      color: #0b0f19 !important;
      font-weight: 700;
      font-size: 13px;
      padding: 12px 30px;
      border-radius: 8px;
      text-decoration: none;
      letter-spacing: 0.02em;
    }
    .footer {
      background-color: #0b0f19;
      padding: 22px 24px;
      border-top: 1px solid rgba(255, 255, 255, 0.06);
      text-align: center;
      font-size: 12px;
      color: #64748b;
    }
    .footer a {
      color: #94a3b8;
      text-decoration: none;
      margin: 0 8px;
    }
    .footer a:hover {
      color: #ffffff;
    }
  </style>
</head>
<body>
  <div style="display:none;font-size:1px;color:#333;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;">
    ${preheader || title}
  </div>
  <div class="wrapper">
    <div class="container">
      <div class="header">
        <div class="brand-eyebrow">${eyebrow}</div>
        <h1 class="brand-title">${headerTitle}</h1>
        ${headerSubtitle ? `<p class="brand-sub">${headerSubtitle}</p>` : ""}
      </div>
      <div class="content">
        ${contentHtml}
      </div>
      <div class="footer">
        <p style="margin: 0 0 10px;">
          <strong>Nikhil Agrahari</strong> • Full-Stack Web Development &amp; System Architecture
        </p>
        <div>
          <a href="${env.frontendUrl}">Portfolio</a>
          <span>•</span>
          <a href="${env.frontendUrl}/projects">Projects</a>
          <span>•</span>
          <a href="${env.frontendUrl}/journey">Journey</a>
          <span>•</span>
          <a href="${env.frontendUrl}/blog">Engineering Docs</a>
          <span>•</span>
          <a href="https://github.com/nikhilxagr">GitHub</a>
        </div>
        <p style="margin: 14px 0 0; font-size: 11px; color: #475569;">
          &copy; ${new Date().getFullYear()} Nikhil Agrahari. All rights reserved.
        </p>
      </div>
    </div>
  </div>
</body>
</html>`;
};

// 1. Send Newsletter Welcome / Confirmation Email
export const sendNewsletterWelcomeEmail = async ({ email }) => {
  const title = "You're subscribed to Engineering Docs 🚀";
  const preheader = "Welcome to Nikhil's Engineering Docs! Check out these curated system design blueprints.";

  const contentHtml = `
    <div class="greeting">You're officially subscribed! 🚀</div>
    <p class="paragraph">
      Thank you for joining the <strong>Engineering Docs</strong> newsletter. You'll receive practical breakdowns on distributed systems, database scaling, system architectures, and modern web engineering.
    </p>
    
    <div class="section-eyebrow">
      // FEATURED BLUEPRINTS TO EXPLORE
    </div>

    <a href="${env.frontendUrl}/blog/url-shortener" class="card-link">
      <div class="card-label">System Design • 8 Min Read</div>
      <h3 class="card-title">URL Shortener System Design: Base62 Math, Redis LRU &amp; KGS Architecture</h3>
      <p class="card-desc">
        Deep dive into TinyURL scaling: 3.52 Trillion key generation, zero-collision Key Generation Service, and sub-2ms Redis caching.
      </p>
    </a>

    <a href="${env.frontendUrl}/blog/learning-cybersecurity-web-development-and-ai-together" class="card-link">
      <div class="card-label">Engineering Roadmap • 5 Min Read</div>
      <h3 class="card-title">How I'm Learning Cybersecurity, Web Development, and AI Together</h3>
      <p class="card-desc">
        A realistic roadmap: balancing multiple tech disciplines through hands-on projects and consistent build cycles.
      </p>
    </a>

    <a href="${env.frontendUrl}/blog/how-metro-systems-work" class="card-link">
      <div class="card-label">Transit Systems • 6 Min Read</div>
      <h3 class="card-title">How Metro Systems Work: Token Allocation &amp; Driverless Trains</h3>
      <p class="card-desc">
        A technical exploration of smart transit infrastructure, RFID token validation, and automated rail signalling.
      </p>
    </a>

    <div class="btn-container">
      <a href="${env.frontendUrl}/blog" class="btn">Explore All Engineering Docs →</a>
    </div>

    <p class="paragraph" style="margin-top: 24px; font-size: 13px; color: #64748b; text-align: center;">
      Have questions or architecture topics you'd like covered? Simply reply directly to this email!
    </p>
  `;

  const html = createEmailLayout({
    title,
    preheader,
    eyebrow: "// ENGINEERING DISPATCH",
    headerTitle: "Engineering Docs",
    headerSubtitle: "Architecture Notes & Technical Blueprints",
    contentHtml,
  });

  return sendMail({
    to: email,
    subject: "Welcome to Nikhil's Engineering Docs! 🚀",
    html,
  });
};

// 2. Send New User First-Time Welcome Email
export const sendNewUserWelcomeEmail = async ({ email, name }) => {
  const displayName = name ? name.split(" ")[0] : "Friend";
  const title = `Welcome to Nikhil's Portfolio, ${displayName}! 🚀`;
  const preheader = `Hi ${displayName}, thank you for joining! Here is what you can discover.`;

  const contentHtml = `
    <div class="greeting">Welcome aboard, ${displayName}! 🚀</div>
    <p class="paragraph">
      Thank you for creating an account on my developer portfolio. I'm really excited to connect with you!
    </p>
    <p class="paragraph">
      I'm a full-stack engineer passionate about building resilient systems, interactive developer tools, and clean digital experiences. Here is a quick guide to what you can explore:
    </p>

    <div class="section-eyebrow">
      // WHERE TO START
    </div>

    <a href="${env.frontendUrl}/projects" class="card-link">
      <div class="card-label">Production Work</div>
      <h3 class="card-title">Featured Projects &amp; Live Demos</h3>
      <p class="card-desc">
        Explore production-grade full-stack applications, modern architectures, and open-source software with live deployments.
      </p>
    </a>

    <a href="${env.frontendUrl}/dsa" class="card-link">
      <div class="card-label">Interactive Experience</div>
      <h3 class="card-title">DSA Visualizers &amp; Terminal Simulator</h3>
      <p class="card-desc">
        Step through algorithm simulations visually or run custom commands in the interactive browser terminal.
      </p>
    </a>

    <a href="${env.frontendUrl}/journey" class="card-link">
      <div class="card-label">Background &amp; Story</div>
      <h3 class="card-title">Professional Journey &amp; Milestones</h3>
      <p class="card-desc">
        Learn about my engineering trajectory, hackathons, open-source work, and certifications.
      </p>
    </a>

    <a href="${env.frontendUrl}/services" class="card-link">
      <div class="card-label">Collaboration</div>
      <h3 class="card-title">Services &amp; Consultation</h3>
      <p class="card-desc">
        Looking for a full-stack developer or technical consulting? Check out my stack and let's work together.
      </p>
    </a>

    <div class="btn-container">
      <a href="${env.frontendUrl}" class="btn">Start Exploring →</a>
    </div>

    <div style="margin-top: 26px; padding-top: 18px; border-top: 1px solid rgba(255, 255, 255, 0.06); font-size: 13px; color: #94a3b8; line-height: 1.6;">
      <p style="margin: 0 0 10px;">
        If you ever want to brainstorm ideas, collaborate on a project, or just chat about tech, feel free to reply directly to this email.
      </p>
      <p style="margin: 0; color: #cbd5e1; font-weight: 600;">
        Best regards,<br>
        <span style="color: #ffffff;">Nikhil Agrahari</span>
      </p>
    </div>
  `;

  const html = createEmailLayout({
    title,
    preheader,
    eyebrow: "// WELCOME ABOARD",
    headerTitle: "Nikhil Agrahari",
    headerSubtitle: "Developer Portfolio & Ecosystem",
    contentHtml,
  });

  return sendMail({
    to: email,
    subject: `Welcome to Nikhil's Portfolio & Tech Ecosystem 🚀`,
    html,
  });
};

// 3. Send Existing User Welcome Back Email
export const sendUserWelcomeBackEmail = async ({ email, name }) => {
  const displayName = name ? name.split(" ")[0] : "Friend";
  const title = `Welcome Back to the Portfolio, ${displayName}! 👋`;
  const preheader = `Glad to have you back, ${displayName}! Here are a few spaces to explore.`;

  const contentHtml = `
    <div class="greeting">Welcome back, ${displayName}! 👋</div>
    <p class="paragraph">
      It is great to see you back on my developer portfolio. Your sign-in was successful.
    </p>
    <p class="paragraph">
      Whether you're here to check out my latest production work, experiment with interactive tools, or connect for technical collaboration, I'm glad you're here.
    </p>

    <div class="section-eyebrow">
      // EXPLORE THE ECOSYSTEM
    </div>

    <a href="${env.frontendUrl}/projects" class="card-link">
      <div class="card-label">Featured Work</div>
      <h3 class="card-title">Production Projects &amp; Case Studies</h3>
      <p class="card-desc">
        Full-stack web applications, AI utilities, and secure architectures with live demos and source code.
      </p>
    </a>

    <a href="${env.frontendUrl}/dsa" class="card-link">
      <div class="card-label">Interactive Labs</div>
      <h3 class="card-title">Algorithm Visualizer &amp; Web Terminal</h3>
      <p class="card-desc">
        Explore interactive data structure animations and test out the simulated developer terminal.
      </p>
    </a>

    <a href="${env.frontendUrl}/journey" class="card-link">
      <div class="card-label">Timeline &amp; Growth</div>
      <h3 class="card-title">Professional Journey &amp; Hackathons</h3>
      <p class="card-desc">
        Recent hackathon participations, certifications, and technical career milestones.
      </p>
    </a>

    <div class="btn-container">
      <a href="${env.frontendUrl}" class="btn">Explore Portfolio →</a>
    </div>

    <div style="margin-top: 26px; padding-top: 18px; border-top: 1px solid rgba(255, 255, 255, 0.06); font-size: 13px; color: #94a3b8; line-height: 1.6;">
      <p style="margin: 0 0 6px;">
        Have a question or looking to build something together? Simply reply directly to this email anytime.
      </p>
      <p style="margin: 10px 0 0; color: #64748b; font-size: 11px;">
        Signed in on ${new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}.
      </p>
    </div>
  `;

  const html = createEmailLayout({
    title,
    preheader,
    eyebrow: "// PORTFOLIO SESSION",
    headerTitle: "Nikhil Agrahari",
    headerSubtitle: "Developer Portfolio & Ecosystem",
    contentHtml,
  });

  return sendMail({
    to: email,
    subject: `Welcome Back to Nikhil's Portfolio! 👋`,
    html,
  });
};

// 4. Send Admin Login Notification Email
export const sendAdminLoginNotificationEmail = async ({ email, ip, userAgent }) => {
  const title = `Admin Login Detected - Dev Portfolio 🛡️`;
  const preheader = `Security Alert: Admin session started for ${email}.`;
  const timestamp = new Date().toLocaleString("en-US", {
    timeZone: "Asia/Kolkata",
    dateStyle: "medium",
    timeStyle: "short",
  });

  const contentHtml = `
    <div class="greeting">Welcome Back, Nikhil! 🛡️</div>
    <p class="paragraph">
      This is a security confirmation that your <strong>Administrator Dashboard</strong> account was just accessed.
    </p>

    <div style="background-color: rgba(255, 255, 255, 0.025); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 12px; padding: 18px; margin: 20px 0;">
      <div class="section-eyebrow" style="margin-top: 0;">
        // SESSION AUDIT DETAILS
      </div>
      <p style="margin: 6px 0; font-size: 13px; color: #cbd5e1;">
        <strong>Account:</strong> ${email}
      </p>
      <p style="margin: 6px 0; font-size: 13px; color: #cbd5e1;">
        <strong>Timestamp:</strong> ${timestamp} IST
      </p>
      <p style="margin: 6px 0; font-size: 13px; color: #cbd5e1;">
        <strong>IP Address:</strong> ${ip || "Localhost / Internal"}
      </p>
      ${userAgent ? `<p style="margin: 6px 0; font-size: 12px; color: #94a3b8; word-break: break-all;"><strong>Client:</strong> ${userAgent}</p>` : ""}
    </div>

    <div class="btn-container">
      <a href="${env.frontendUrl}/admin" class="btn">Open Admin Dashboard →</a>
    </div>

    <p class="paragraph" style="margin-top: 24px; font-size: 12px; color: #64748b; text-align: center;">
      If you did not initiate this login session, please inspect your server logs and rotate your ADMIN_PASSWORD_HASH immediately.
    </p>
  `;

  const html = createEmailLayout({
    title,
    preheader,
    eyebrow: "// ADMIN SECURITY",
    headerTitle: "Security Alert",
    headerSubtitle: "Administrator Session Notice",
    contentHtml,
  });

  return sendMail({
    to: email,
    subject: `🔐 Admin Login Detected - Dev Portfolio`,
    html,
  });
};

// Base sendMail function
export const sendMail = async ({ to, subject, html, attachments = [] }) => {
  const transporter = getTransporter();

  if (!transporter) {
    console.warn(
      `[Mailer] ⚠️ REAL EMAIL NOT SENT: 'SMTP_PASS' is empty in backend/.env. Simulated dispatch to: ${to} (Subject: "${subject}"). Set a 16-char Google App Password in backend/.env to deliver real emails to inboxes.`,
    );
    return {
      sent: true,
      simulated: true,
      message: "Simulated email delivery (SMTP_PASS not configured in .env)",
    };
  }

  try {
    const info = await transporter.sendMail({
      from: env.emailFrom || `"Nikhil Agrahari" <${env.smtpUser}>`,
      to,
      subject,
      html,
      attachments,
    });

    console.log(`[Mailer] Real email sent to: ${to} | MessageId: ${info.messageId}`);
    return {
      sent: true,
      simulated: false,
      messageId: info.messageId,
    };
  } catch (error) {
    console.error(`[Mailer] Error sending email to ${to}:`, error.message);
    return {
      sent: false,
      error: error.message,
    };
  }
};
