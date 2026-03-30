# Build Journal

## Purpose

This file tracks the portfolio build journey day by day so the process can be shared on GitHub, LinkedIn, and later as proof of consistent work.

## Daily Journal Template

- Date:
- Day:
- Main goal:
- What I built:
- Problems faced:
- What I learned:
- What I will do next:
- Screenshot or proof:

## Day 1 Entry

- Date: 2026-03-30
- Day: 1
- Main goal: Finalize project direction, sitemap, stack, and planning documents.
- What I built:
  - locked portfolio identity and content direction
  - created Day 1 project brief
  - created sitemap
  - decided final stack
  - created project checklist
- Problems faced:
  - needed to align full stack portfolio goals with cyber security positioning
  - needed a safe payment rule for security testing service
- What I learned:
  - a strong portfolio needs clear scope before UI work starts
  - legal and ethical boundaries matter when offering security-related services
- What I will do next:
  - start Day 2 content preparation and content file planning
- Screenshot or proof:
  - planning docs committed in repository

## Day 2 Entry

- Date: 2026-03-30
- Day: 2
- Main goal: Prepare reusable portfolio content before frontend setup.
- What I built:
  - created a dedicated content system
  - added structured data for profile, pages, projects, practicals, services, blogs, stats, and testimonials
  - separated reusable content from future frontend components
  - documented remaining TBD inputs clearly
- Problems faced:
  - some content was complete while a few important fields were still missing
  - service wording needed to stay clear, professional, and ethically safe
- What I learned:
  - content-first planning makes the frontend easier to build
  - structured data reduces confusion when features grow later
- What I will do next:
  - start wireframes and frontend project setup
- Screenshot or proof:
  - content files added in the `content` folder

## Day 3 Entry

- Date: 2026-03-30
- Day: 3
- Main goal: Lock page wireframes, visual direction, and update the remaining content inputs.
- What I built:
  - added profile image to project assets
  - updated stats and Medium links
  - created structured wireframe documentation for all main pages
  - created a visual system document with colors, typography, and motion direction
- Problems faced:
  - needed to keep the developer and cyber security identity balanced
  - needed to avoid fake social proof because testimonials are not available yet
- What I learned:
  - a strong wireframe saves time during component building
  - visual consistency matters more than adding many effects
- What I will do next:
  - initialize the frontend and backend project structure
- Screenshot or proof:
  - Day 3 docs created and content files updated

## Day 4 Entry

- Date: 2026-03-30
- Day: 4
- Main goal: Initialize the actual frontend and backend codebase with a clean structure.
- What I built:
  - created root scripts and shared config files
  - initialized the Next.js frontend in `frontend`
  - built a branded starter homepage and route structure
  - added reusable layout and shared components
  - initialized the Express backend in `backend`
  - added middleware, health route, error handling, and env scaffolding
  - copied the profile photo into the frontend public assets
- Problems faced:
  - needed to clean up generated template files and default assets
  - needed to fix a monorepo root warning in Next.js
- What I learned:
  - setting structure early prevents messy refactors later
  - a shared content layer works well with server-side file reads in Next.js
- What I will do next:
  - continue with shared UI components and page implementation
- Screenshot or proof:
  - frontend lint passed
  - frontend production build passed
  - backend health route returned `ok`
