# Security Policy

## Scope

This policy covers the full repository and deployed services:

- Frontend: Vercel deployment
- Backend API: Render deployment
- Data and payment flow: MongoDB Atlas and Cashfree integration

## Supported Versions

| Version               | Security Updates |
| --------------------- | ---------------- |
| Current main branch   | Yes              |
| Older snapshots/forks | No               |

## Reporting A Vulnerability

- Email: nikhilagrahari530@gmail.com
- Subject: Security Report - Developer Portfolio
- Include: impact, reproduction steps, affected endpoint/page, and proof of concept

Do not post security vulnerabilities in public issues, discussions, or social media.

## Response SLA

- Acknowledgement: within 24 hours
- First status update: within 3 days
- Ongoing updates: every 3 days until closure

## Disclosure Process

1. Report is received and triaged.
2. Severity is assigned (Critical, High, Medium, Low).
3. Mitigation or fix is prepared and tested.
4. Fix is deployed.
5. Reporter is notified when resolved.

## Security Controls In This Repository

- HTTP hardening middleware and structured CORS policy
- Input validation on public and admin APIs
- Request sanitization for XSS and NoSQL-style key abuse
- Route-specific rate limiting
- JWT-based admin authentication (phase-2 migration planned to secure cookies)
- Payment/webhook signature verification with timing-safe comparison
- Centralized API error handling

## Secret Handling Rules

- Never commit real secrets.
- Use environment variables only.
- Rotate secrets immediately if exposure is suspected.
- Required rotation targets:
  - JWT secret
  - Admin password hash
  - Cashfree secret key
  - Cashfree webhook secret

## Security Testing Expectations

Before production deployment:

1. Run dependency vulnerability checks for frontend and backend.
2. Verify CORS behavior for allowed and blocked origins.
3. Verify rate-limit behavior for auth and payment routes.
4. Verify webhook signature failure path.
5. Verify admin route access control and token/session expiry behavior.

## Incident Response (Minimum)

1. Contain: disable affected flow or route.
2. Rotate potentially exposed credentials.
3. Assess scope: logs, affected records, and time window.
4. Fix and redeploy.
5. Document root cause and prevention action.

## Anti-Copy And Ownership Notice

Code, design, text, and media are proprietary unless explicitly stated otherwise. Reuse, redistribution, or derivative publication requires written permission.

## Policy Maintenance

This document is reviewed when:

- authentication model changes
- payment flow changes
- deployment platform changes
- any Critical or High incident occurs
