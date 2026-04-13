# Deployment Security Checklist

## Target Platforms

- Frontend: Vercel
- Backend: Render

## Pre-Deploy Backend Checklist

1. NODE_ENV set to production.
2. JWT_SECRET set and at least 32 characters.
3. ADMIN_EMAIL and ADMIN_PASSWORD_HASH set.
4. MONGODB_URI set and connectivity verified.
5. ALLOWED_ORIGINS set to explicit domains.
6. CASHFREE_APP_ID and CASHFREE_SECRET_KEY set together when payments are enabled.
7. CASHFREE_WEBHOOK_SECRET set when webhook route is enabled.
8. PAYMENT_RECEIPT_TOKEN_SECRET set.
9. ALLOW_START_WITHOUT_DB set to false for production.

## Pre-Deploy Frontend Checklist

1. VITE_API_BASE_URL points to production API endpoint over HTTPS.
2. Security headers configured in vercel.json.
3. Build generated without production sourcemaps.
4. robots.txt and sitemap.xml generated and reviewed.

## Post-Deploy Verification

1. Health endpoint responds successfully.
2. Admin login and protected route checks pass.
3. Payment order creation and verify flow pass.
4. Webhook invalid signature is rejected.
5. CORS rejects unapproved origin.
6. Rate limiting returns expected 429 on abuse.

## Secret Rotation Playbook

When rotating JWT or admin credentials:

1. Update environment values.
2. Redeploy backend.
3. Verify admin re-authentication behavior.

When rotating Cashfree secrets:

1. Update API secret and webhook secret.
2. Redeploy backend.
3. Verify create-order, verify, and webhook handling.

## Rollback Conditions

Rollback if any of the following occurs after deployment:

- authentication or admin authorization regression
- payment verification mismatch errors spike
- valid CORS origins are blocked unexpectedly
- webhook processing failure on valid signed events
