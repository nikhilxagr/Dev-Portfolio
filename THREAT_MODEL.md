# Threat Model Summary

## Assets

- Admin session and admin write routes
- Payment transactions and receipts
- Contact submissions
- Project and blog content integrity
- Environment secrets

## Primary Threats

1. Unauthorized admin access
2. Payment verification abuse or webhook spoof attempts
3. Input abuse: XSS or malicious query payloads
4. Automated scraping and content reuse
5. Credential exposure or weak secret management

## Trust Boundaries

- Browser to frontend deployment
- Frontend to backend API
- Backend to payment provider
- Backend to database

## High-Risk Flows

### Admin Authentication

- Entry point: auth login route
- Risk: credential stuffing and token theft
- Controls: validation, rate limiting, JWT verification
- Planned improvement: secure cookie session model

### Payment Verification And Webhook Handling

- Entry point: payment verify route and webhook route
- Risk: forged callback payloads, replay attempts, mismatch data
- Controls: signature verification, idempotency handling, rate limits
- Planned improvement: strict amount/currency/order consistency checks

### Receipt Access Flow

- Entry point: access code request and code verification
- Risk: brute-force OTP attempts
- Controls: OTP attempt cap, rate limiting, scoped tokens

## Residual Risk

No public web application can fully prevent copying of client-side code. Risk is reduced through legal ownership terms, deterrence, and operational monitoring.

## Security Priorities

1. Prevent unauthorized writes and payment abuse.
2. Reduce secret exposure risk.
3. Add anti-copy deterrence and evidence trail.
4. Improve incident response readiness.
