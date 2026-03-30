# Developer Portfolio (Full Stack + Cyber Security)

Production-ready portfolio project for a BCA 2nd year student using:

- Frontend: React (Vite), Tailwind CSS, Framer Motion
- Backend: Node.js, Express.js
- Database: MongoDB Atlas (Mongoose)
- Auth: JWT with env-based single admin credentials

## Project Structure

- frontend: UI app with pages, components, hooks, and services
- backend: API with controllers, routes, models, middleware, and config

## Quick Start

### 1) Install dependencies

```bash
cd frontend
npm install
cd ../backend
npm install
```

### 2) Configure environment variables

- Copy `frontend/.env.example` to `frontend/.env`
- Copy `backend/.env.example` to `backend/.env`

Set required backend values:

- `MONGODB_URI`
- `JWT_SECRET` (minimum 32 chars)
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD_HASH` (bcrypt hash)
- `ALLOWED_ORIGINS`

### 3) Create admin password hash

Run in backend directory:

```bash
node -e "import bcrypt from 'bcryptjs'; bcrypt.hash('ChangeMe@123', 12).then(console.log)"
```

Copy output into `ADMIN_PASSWORD_HASH`.

### 4) Seed initial projects/blogs (optional)

```bash
cd backend
npm run seed
```

### 5) Run apps

Backend:

```bash
cd backend
npm run dev
```

Frontend:

```bash
cd frontend
npm run dev
```

- Frontend default: `http://localhost:5173`
- Backend default: `http://localhost:5000`

### 6) Access admin dashboard

- Admin login UI: `http://localhost:5173/admin/login`
- Admin dashboard UI: `http://localhost:5173/admin`

Use your `ADMIN_EMAIL` and plaintext password that matches the configured `ADMIN_PASSWORD_HASH`.

## API Endpoints

### Auth

- `POST /api/auth/login`
- `GET /api/auth/verify` (Bearer token)

### Projects

- `GET /api/projects`
- `GET /api/projects/:slug`
- `POST /api/projects` (admin)
- `PUT /api/projects/:id` (admin)
- `DELETE /api/projects/:id` (admin)

### Blogs

- `GET /api/blogs`
- `GET /api/blogs/:slug`
- `POST /api/blogs` (admin)
- `PUT /api/blogs/:id` (admin)
- `DELETE /api/blogs/:id` (admin)

### Contact

- `POST /api/contact`

### Admin Contacts

- `GET /api/admin/contacts` (admin)
- `PATCH /api/admin/contacts/:id/read` (admin)

## Security Practices Included

- Helmet security headers
- CORS allowlist
- Rate limiting (general, auth, contact)
- Input validation via express-validator
- NoSQL injection protection via express-mongo-sanitize
- XSS sanitization middleware
- JWT auth on write routes
- Centralized error handling with HTTP status codes

## Deployment Notes

- Frontend target: Vercel
- Backend target: Render
- Database: MongoDB Atlas

Set production frontend domain in backend `ALLOWED_ORIGINS`.

## Optional Phase 2

- Dark/light mode toggle
- Rich markdown blog editor
