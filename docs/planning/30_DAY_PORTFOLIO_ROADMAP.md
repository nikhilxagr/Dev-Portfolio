# 30-Day Full Stack Portfolio Roadmap

## Goal

Build a real portfolio that shows you as:

- a React / full stack developer
- a cybersecurity learner with practical lab work
- a student who can design, build, deploy, secure, and document a production-style project

This roadmap is designed for a BCA 2nd year student who can give around 3 focused hours on weekdays and 4 to 6 hours on weekends.

## Final Project Vision

By the end of 30 days, your portfolio should include:

- Home page
- About / Skills page
- Projects page
- Practicals / Labs page
- Services page
- Blog page
- Contact page
- Payment flow with Razorpay
- Backend APIs for contact, blog, projects, services, and orders
- SEO setup
- Deployment on Vercel and Render
- Analytics and search monitoring

## Best Stack For This Project

Use this stack to keep the project realistic and SEO friendly:

- Frontend: Next.js with React and TypeScript
- Styling: Tailwind CSS
- Animations: Framer Motion
- Backend: Node.js + Express
- Database: MongoDB Atlas
- Validation: Zod
- Forms: React Hook Form
- Payments: Razorpay Standard Checkout
- Frontend deploy: Vercel
- Backend deploy: Render
- Monitoring: Google Search Console, Google Analytics, Vercel Analytics, Vercel Speed Insights

## Important Reality Check

- Use Next.js instead of a plain React SPA. It is still React, but SEO is much easier.
- Vercel is good for deployment, analytics, and performance monitoring.
- Google Search Console is what shows search queries, indexing, and click data. Vercel does not replace Search Console for that.
- As of March 30, 2026, Render free web services still spin down after inactivity. If you want the backend to stay awake continuously, plan for a paid instance.
- For Razorpay, never trust only the frontend success response. Always verify payment on the backend.

## Scope You Should Finish In Month 1

Must-have:

- Responsive UI
- Strong personal branding
- Project and lab showcase
- Contact form
- Services with pricing cards
- Razorpay payment for at least one paid service
- Blog listing and blog detail pages
- Admin-controlled content source
- SEO basics
- Deployment

Nice-to-have if time remains:

- Admin dashboard
- Testimonials
- Downloadable resume
- Dark mode toggle
- Email notifications
- Webhook event logs

## Content Structure

Create content for these sections before you start building:

- Short intro
- Long about me
- Tech stack list
- 3 to 5 projects
- 3 to 6 practicals or labs
- 3 to 5 services
- 2 to 4 blog posts
- Contact links
- Resume link

## Suggested Pages

- `/`
- `/about`
- `/skills`
- `/projects`
- `/practicals`
- `/services`
- `/blog`
- `/blog/[slug]`
- `/contact`
- `/privacy-policy`
- `/terms`

## Suggested Backend Modules

- Auth for admin
- Projects CRUD
- Blogs CRUD
- Services CRUD
- Contact form submissions
- Orders and payment verification
- Health check route

## Suggested Starter Pricing

This part is an inference for a student or beginner freelancer in India, not a live market quote. Validate it by checking at least 10 competitor profiles on LinkedIn, Fiverr, Instagram, and local freelance pages before publishing.

- 1:1 mentorship call, 45 to 60 min: INR 299 to INR 799
- Resume review / resume build: INR 499 to INR 1499
- Frontend mini project: INR 3000 to INR 9000
- Full stack mini project or MVP: INR 8000 to INR 25000
- Basic website security review with written permission only: INR 2000 to INR 8000

Do not underprice so much that your work looks fake. Do not overpromise security testing. Only test systems you have explicit permission to assess.

## Daily Work Pattern

Follow this routine every day:

1. Work for 2 to 3 focused sessions.
2. Push code at least once.
3. Write a small progress note in GitHub commits, README, or a build log.
4. Capture one screenshot for future LinkedIn and portfolio posts.
5. End the day by writing tomorrow's first task.

## Week 1: Planning, Design, and Frontend Foundation

### Day 1

Define the project properly.

- Finalize pages, features, and visual direction
- Create a rough sitemap
- Decide the stack
- Create a build journal file
- Create a GitHub project board or simple checklist

Deliverable:

- project scope locked
- folder strategy decided

### Day 2

Plan your content.

- Write your hero section text
- Write your about me text
- Collect LinkedIn, GitHub, WhatsApp, resume, and profile links
- List your projects, labs, and skills
- Write short descriptions for each

Deliverable:

- all core content prepared in notes or markdown

### Day 3

Create UI references and layout plan.

- Collect 3 to 5 portfolio inspirations
- Sketch navbar, footer, homepage, services page, and blog layout
- Decide colors, fonts, spacing, and card style
- Define brand tone: developer + cyber security analyst

Deliverable:

- basic wireframes ready

### Day 4

Set up the project structure.

- Initialize frontend with Next.js and TypeScript
- Initialize backend with Express
- Create `frontend` and `backend` folders if using one repo
- Set up ESLint, Prettier, environment variable files, and scripts
- Push first clean project structure

Deliverable:

- project boots successfully

### Day 5

Build shared frontend layout.

- Navbar
- Footer
- global styles
- page container
- reusable section heading
- reusable button and card components

Deliverable:

- reusable design system started

### Day 6

Build the homepage.

- Hero section
- short about section
- key stats section
- featured projects preview
- call to action

For stats like LeetCode, GFG, and TryHackMe, start with manual values stored in a config file. Do not waste week 1 trying to automate every external platform.

Deliverable:

- home page looks presentable on desktop and mobile

### Day 7

Build core public pages.

- Skills page
- Projects page
- Practicals page
- Contact page skeleton

Deliverable:

- all main routes exist with placeholder or real content

## Week 2: Backend, Data, and Real Functionality

### Day 8

Set up the backend base.

- Express server
- CORS
- env config
- MongoDB connection
- health route
- error middleware

Deliverable:

- backend runs locally and connects to database

### Day 9

Design your database models.

- Admin user
- Project
- Blog post
- Service
- Contact message
- Order or payment record

Deliverable:

- schemas or models created

### Day 10

Set up admin authentication.

- basic admin login
- password hashing
- JWT or session auth
- route protection for admin routes

Keep this simple. One admin account is enough for month 1.

Deliverable:

- protected admin routes working

### Day 11

Create content APIs.

- projects API
- services API
- blogs API
- contact submission API

Deliverable:

- CRUD or read APIs available for portfolio content

### Day 12

Connect frontend to backend.

- fetch projects from API
- fetch services from API
- fetch blogs from API
- submit contact form to backend
- show success and error states

Deliverable:

- frontend displays real backend data

### Day 13

Build the blog system.

- blog listing page
- blog details page by slug
- blog card UI
- reading time, tags, publish date

You can write blogs yourself and store them in the database, or start with markdown content and expose metadata through the backend.

Deliverable:

- blog pages working with real content

### Day 14

Polish week 2 and test everything.

- check API routes in Postman
- fix validation issues
- clean folder names
- improve empty states and loading states
- push a stable version

Deliverable:

- usable full stack MVP without payment

## Week 3: Payments, Security, and SEO

### Day 15

Prepare services and pricing flow.

- finalize services
- write service descriptions
- define what each package includes
- define booking flow

Deliverable:

- clear pricing cards and service scope

### Day 16

Integrate Razorpay on the backend.

- create order API
- store order data in database
- keep Razorpay keys in env files
- test order creation

Deliverable:

- backend can create Razorpay orders

### Day 17

Integrate Razorpay on the frontend.

- checkout button
- open Razorpay checkout
- pass service amount and metadata
- handle success and failure states

Deliverable:

- checkout opens from the services page

### Day 18

Verify payments securely.

- verify Razorpay signature on backend
- update order status after successful verification
- store payment id, order id, and timestamps
- add webhook support if possible

Deliverable:

- payment is not only visually successful, but actually verified

### Day 19

Secure the backend and forms.

- use Helmet
- rate limit contact and payment routes
- validate all inputs
- sanitize data
- hide secrets in env
- add proper HTTP status handling

Deliverable:

- basic production security in place

### Day 20

Implement SEO foundations.

- metadata for every page
- title and description strategy
- Open Graph image strategy
- `robots.txt`
- `sitemap.xml`
- canonical URLs
- schema markup for person, website, and blog post where relevant

Deliverable:

- site is technically SEO ready

### Day 21

Polish the cyber security angle.

- add practical lab cards
- write lab summaries
- add tools you use: Kali, Nmap, Burp Suite, Wireshark, etc.
- add ethics note: testing only on legal targets and labs

Deliverable:

- portfolio clearly shows your cyber learning track

## Week 4: Deployment, Analytics, Content, and Launch

### Day 22

Deploy backend.

- deploy Express backend to Render
- add environment variables
- test public API endpoints
- confirm CORS for frontend domain

Deliverable:

- backend live

Note:

- If you use Render free and it sleeps, mention it honestly in your documentation or move to a paid always-on instance.

### Day 23

Deploy frontend.

- deploy Next.js frontend to Vercel
- connect environment variables
- test all pages in production
- test API calls and payment flow carefully

Deliverable:

- frontend live

### Day 24

Connect monitoring and search tools.

- add Google Search Console
- submit sitemap
- inspect indexing
- add Google Analytics
- enable Vercel Analytics
- enable Vercel Speed Insights

Deliverable:

- you can monitor traffic, indexing, and performance

### Day 25

Improve performance and mobile UX.

- compress images
- lazy load heavy sections
- test Core Web Vitals
- fix layout shift
- improve button sizes and spacing on mobile

Deliverable:

- fast and mobile friendly site

### Day 26

Improve content quality.

- write 2 polished blog posts
- improve project case studies
- add practical screenshots
- improve service FAQs

Deliverable:

- site feels real, not empty

### Day 27

Improve repository quality.

- better README
- screenshots
- architecture diagram
- tech stack explanation
- setup instructions
- API endpoints list

Deliverable:

- GitHub repo looks serious and impressive

### Day 28

Create proof-of-work content.

- record a short demo video
- write a LinkedIn post
- write a Medium article about the build process
- prepare a project carousel or screenshots for social sharing

Deliverable:

- public proof that you built this step by step

### Day 29

Run final testing.

- test forms
- test invalid payment flow
- test successful payment flow
- test responsiveness
- test broken links
- test SEO tags
- test 404 page

Deliverable:

- launch candidate

### Day 30

Launch day.

- push final fixes
- announce the project
- add it to your resume and LinkedIn
- submit site to Search Console if not already done
- create version 2 backlog

Deliverable:

- live portfolio with full stack proof

## What To Post On GitHub Every Week

Week 1:

- wireframes
- folder structure
- first UI components
- first public pages

Week 2:

- API setup
- MongoDB models
- frontend and backend integration
- working blog and contact forms

Week 3:

- services page
- Razorpay integration
- payment verification
- security and SEO setup

Week 4:

- deployment
- Search Console setup
- analytics
- performance fixes
- final launch

## Build Journal Template

Use this daily template in commits, issues, or a markdown journal:

- What I built today
- What problem I faced
- How I solved it
- What I will build tomorrow

## Smart Decisions That Save Time

- Start with manual content, then automate later
- Use real screenshots for practicals and labs
- Use one admin account only
- Build one payment flow first, not all services at once
- Focus on one strong theme instead of too many design experiments
- Keep the first launch clean and honest

## Things You Should Not Do In Month 1

- Do not build too many features at once
- Do not fake stats, reviews, or client work
- Do not scrape platforms aggressively for profile data
- Do not offer advanced pentesting if you are not qualified
- Do not skip backend payment verification
- Do not wait for perfection before deployment

## Recommended Version 2 After Launch

- Admin dashboard UI
- Booking calendar for mentorship
- Email notifications
- Resume download analytics
- Testimonial system
- Case study pages
- Search and filter on blogs and projects
- More advanced dashboards for your learning stats

## Success Target After 30 Days

If you complete this roadmap properly, your portfolio should prove that you can:

- build with React in a production-friendly way
- create a backend API
- connect frontend to backend
- integrate payments
- deploy a full stack app
- apply basic web security practices
- think about SEO and performance
- document your learning publicly

That combination is already strong for a 2nd year student.
