# Stack Decision

## Final Stack For Version 1

- Frontend: Next.js with TypeScript
- Styling: Tailwind CSS
- Motion: Framer Motion with minimal usage
- Backend: Node.js with Express
- Database: MongoDB Atlas
- Forms: React Hook Form
- Validation: Zod on frontend and backend validation layer
- Payment Gateway: Razorpay
- Frontend Deployment: Vercel
- Backend Deployment: Render

## Why This Stack Fits The Project

### Next.js Instead Of Plain React SPA

- it is still React
- routing is clean
- SEO is much better
- metadata, sitemap, and structured pages are easier to manage
- deployment on Vercel is straightforward

### Express For Backend

- easy to learn and explain in interviews
- enough for portfolio APIs, contact forms, services, and payments
- good fit for Razorpay integration and custom logic

### MongoDB Atlas

- flexible for portfolio content
- fast setup for student projects
- easy to store projects, blogs, services, contact submissions, and payment records

## Recommended Folder Strategy

Use a single repository with two apps:

- `frontend` for Next.js frontend
- `backend` for Express backend

Suggested top-level structure:

- `frontend`
- `backend`
- `docs`
- `assets`

## Core Packages To Use

### Frontend

- `next`
- `react`
- `react-dom`
- `tailwindcss`
- `framer-motion`
- `react-hook-form`
- `zod`
- `axios`
- `lucide-react`

### Backend

- `express`
- `mongoose`
- `dotenv`
- `cors`
- `helmet`
- `morgan`
- `express-rate-limit`
- `jsonwebtoken`
- `bcryptjs`
- `razorpay`
- `zod`

## Suggested Data Models

- `User`
- `Project`
- `Blog`
- `Service`
- `ContactMessage`
- `Order`

## Payment Logic Decision

Use Razorpay as the only payment gateway in version 1.

Required payment flow:

- create order on backend
- launch Razorpay checkout on frontend
- verify payment signature on backend
- store order and payment details
- show success page
- allow acknowledgement or receipt download

## SEO Decision

SEO will be handled on the frontend with:

- page metadata
- Open Graph data
- sitemap
- robots.txt
- structured data
- Google Search Console
- Google Analytics
- Vercel Analytics
- Vercel Speed Insights

## Deployment Decision

- frontend on Vercel
- backend on Render

Important note:

- if Render free plan sleeps, the production portfolio documentation should state that clearly
- if always-on backend is needed, use a paid Render instance

## Out Of Scope For Version 1

- complex admin dashboard UI
- advanced booking calendar
- full CRM system
- automatic stat scraping from all learning platforms
- enterprise pentesting workflow
