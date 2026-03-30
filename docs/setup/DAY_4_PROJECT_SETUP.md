# Day 4 Project Setup

## Goal

Initialize the real full stack codebase with a clean structure that can grow without major rewrites.

## What Was Set Up

### Root

- monorepo-style root scripts
- shared formatting config
- shared ignore files
- basic project-level package scripts

### Frontend

- Next.js app in `frontend/`
- TypeScript
- Tailwind CSS
- route structure for all main pages
- reusable layout components
- branded starter homepage
- content loading from the shared `content/` folder
- profile image wired into the frontend

### Backend

- Express app in `backend/`
- middleware setup
- environment config
- MongoDB connection scaffold
- health route
- base error handling

## Folder Structure

```text
.
├─ assets/
├─ frontend/
│  ├─ public/
│  └─ src/
├─ content/
├─ docs/
├─ backend/
│  └─ src/
└─ package.json
```

## Important Frontend Decisions

- The homepage is now a real branded starter, not the default Next.js template.
- Main routes already exist, so navigation works from day one.
- Shared content is read from the root `content/` folder using server-side file reads.
- The design system follows the Day 3 visual direction with light green sections and dark blue cards.

## Important Backend Decisions

- The backend starts even if MongoDB is not configured yet.
- A health route is available at `/api/health`.
- Environment variables are documented in `backend/.env.example`.
- The structure is ready for future modules like projects, blogs, services, contact, orders, and payments.

## Root Commands

- `npm run dev` -> run frontend and backend together
- `npm run dev:frontend` -> run only Next.js
- `npm run dev:backend` -> run only Express
- `npm run build` -> production build for the frontend
- `npm run lint` -> lint the frontend

## Verification Completed

- frontend lint passed
- frontend production build passed
- backend health route responded successfully

## Day 4 Outcome

Day 4 is complete when:

- frontend and backend folders exist
- root scripts exist
- env examples exist
- basic routes work
- the codebase feels ready for feature work instead of still feeling like setup
