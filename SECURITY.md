# Security Policy & Defensive Engineering Standards

Copyright (c) 2026 Nikhil Agrahari. All rights reserved.
Contact: [nikhilagrahari530@gmail.com](mailto:nikhilagrahari530@gmail.com)

Security is a foundational pillar of this repository and associated services. As a Full Stack & Security Engineer, I maintain rigorous defensive controls and an active vulnerability response program.

---

## 🎯 Scope & Services

This security policy applies to all repository source code, environment configurations, and deployed infrastructure:

| Scope Asset | Environment | Description |
|---|---|---|
| **Frontend Application** | Vercel | Single Page React application with client-side security sandboxes |
| **Backend REST API** | Render | Node.js (ESM) API server handling contact, admin, and payments |
| **Database Tier** | MongoDB Atlas | Encrypted cloud database cluster |
| **Payment Integration** | Cashfree Gateway | Webhook processing & payment verification engine |

---

## 🛡️ Supported Versions

Only the latest `main` branch is actively supported with security updates and patches.

| Version | Status | Security Patches |
|---|---|---|
| `main` branch | **Active** | ✅ Supported |
| Previous tags / forks | End of Life | ❌ Not Supported |

---

## 📬 Reporting a Vulnerability

If you discover a security vulnerability or weakness in this application, **please report it responsibly**. Do NOT disclose issues publicly in GitHub Issues, Pull Requests, or social media.

### Contact Details
- **Email**: [nikhilagrahari530@gmail.com](mailto:nikhilagrahari530@gmail.com)
- **Subject**: `[SECURITY VULNERABILITY REPORT] - <Target Module>`

### Report Details to Include
1. **Summary & Impact**: Concise explanation of the vulnerability and its potential risk.
2. **Affected Asset**: Specific URL endpoint, API route, or frontend component.
3. **Reproduction Steps**: Clear, step-by-step instructions or Proof of Concept (PoC).
4. **Suggested Fix**: Optional recommendation to remediate the vulnerability.

---

## ⏱️ Response SLA

- **Initial Acknowledgment**: Within **24 Hours**
- **Triage & Severity Assessment**: Within **48 Hours**
- **Patch & Deployment Window**:
  - **Critical / High**: Within **72 Hours**
  - **Medium / Low**: Within **7 Days**

---

## 🔒 Security Controls Implemented

### 1. Payment Verification Integrity
- **Timing-Safe Signatures**: Webhook signature verification uses `crypto.timingSafeEqual` with HMAC SHA-256 to prevent timing side-channel attacks.
- **Strict Payload Validation**: Payment status verification confirms amount, order ID, and signature matching before updating transactions.

### 2. API Defense & Hardening
- **Helmet HTTP Headers**: Enforces strict Content-Security-Policy (CSP), Strict-Transport-Security (HSTS), X-Content-Type-Options, and Frameguard.
- **Rate Limiting**: Custom express rate limiters applied on sensitive routes (`/api/contact`, `/api/admin/login`, `/api/payments`).
- **NoSQL & XSS Protection**: Request parameters are sanitized against MongoDB operator injection (`express-mongo-sanitize`) and cross-site scripting (`xss-clean`).

### 3. Session & Secret Management
- **Environment Isolation**: Zero secrets committed to version control. All API keys, database URIs, and JWT secrets are injected strictly via environment variables.
- **Timing-Safe Credential Auth**: Admin authentication enforces bcrypt password hashing and strong JWT verification.

---

## 🧪 Security Audit Checklist

Before releasing major features, the following validation checks are executed:

- [x] Run `npm audit` on frontend & backend dependencies.
- [x] Test CORS origin enforcement against unauthorized domains.
- [x] Validate rate limiter threshold triggers on public endpoints.
- [x] Verify timing-safe comparison on webhook verification routes.
- [x] Audit XSS sanitization on custom user input forms.

---

## ⚖️ Responsible Disclosure & Ethics

Security researchers who discover and report vulnerabilities in compliance with this policy will receive proper attribution in the repository release notes. Unauthorized access to user data, service disruption, or destruction of resources is strictly prohibited. For copyright or DMCA notices, refer to [DMCA.md](DMCA.md).

*Document Last Updated: August 2026*
