<div align="center">

![Header](https://capsule-render.vercel.app/api?type=waving&color=0:00C2FF,100:00E5A8&height=220&section=header&text=Developer%20Portfolio&fontSize=52&fontColor=ffffff&animation=fadeIn&fontAlignY=35&desc=Full%20Stack%20%7C%20Cyber%20Security%20%7C%20Production-Ready&descAlignY=56&descSize=19)

<img src="https://readme-typing-svg.demolab.com?font=Fira+Code&weight=600&size=22&duration=2400&pause=900&color=00C2FF&center=true&vCenter=true&width=900&lines=React+%2B+Vite+%2B+Tailwind+%2B+Framer+Motion;Node.js+%2B+Express+%2B+MongoDB+Atlas;JWT+Auth+%7C+Secure+API+%7C+Admin+Dashboard" alt="Typing animation" />

### Building elegant UI and secure backend systems, one feature at a time

![Frontend](https://img.shields.io/badge/Frontend-React%20%2B%20Vite-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Backend](https://img.shields.io/badge/Backend-Node.js%20%2B%20Express-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Database](https://img.shields.io/badge/Database-MongoDB%20Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Auth](https://img.shields.io/badge/Auth-JWT%20%2B%20bcryptjs-F57C00?style=for-the-badge)
![Security](https://img.shields.io/badge/Security-Helmet%20%7C%20Rate%20Limit%20%7C%20Validation-7B1FA2?style=for-the-badge)

</div>

---

## About This Project

This is a production-ready **full-stack portfolio** project designed for a BCA 2nd year student with a strong focus on:

- Modern frontend experience
- Secure and scalable backend APIs
- Clean architecture and maintainable code
- Real-world deployment readiness

---

## Tech Stack

### Frontend

- React (Vite)
- Tailwind CSS
- Framer Motion
- React Router
- Axios

### Backend

- Node.js
- Express.js
- Mongoose
- JWT (jsonwebtoken)
- bcryptjs
- express-validator
- dotenv

### Database

- MongoDB Atlas

### Security and Middleware

- Helmet security headers
- CORS allowlist
- express-rate-limit (general, auth, contact)
- express-mongo-sanitize (NoSQL injection protection)
- XSS sanitization middleware
- JWT auth for protected routes
- Centralized error handling

### Deployment and Tooling

- Vercel (frontend)
- Render (backend)
- npm scripts
- Nodemon for development

---

## Project Structure

```text
Developer Portfolio/
|-- frontend/
|   |-- src/
|   |   |-- components/
|   |   |-- pages/
|   |   |-- services/
|   |   |-- hooks/
|   |   |-- context/
|   |-- public/
|
|-- backend/
|   |-- src/
|   |   |-- controllers/
|   |   |-- routes/
|   |   |-- models/
|   |   |-- middleware/
|   |   |-- config/
|   |   |-- utils/
|   |-- scripts/
```

---

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

### 3) Generate admin password hash

```bash
node -e "import bcrypt from 'bcryptjs'; bcrypt.hash('ChangeMe@123', 12).then(console.log)"
```

Copy the generated hash into `ADMIN_PASSWORD_HASH`.

### 4) Seed data (optional)

```bash
cd backend
npm run seed
```

### 5) Run applications

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

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5000`

### 6) Admin access

- Login: `http://localhost:5173/admin/login`
- Dashboard: `http://localhost:5173/admin`

Use `ADMIN_EMAIL` and the plaintext password that matches `ADMIN_PASSWORD_HASH`.

---

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

---

## Security Practices Included

| Area             | Implementation                              |
| ---------------- | ------------------------------------------- |
| Headers          | Helmet                                      |
| CORS             | Origin allowlist                            |
| Abuse prevention | Rate limiter on auth/contact/general routes |
| Input safety     | express-validator                           |
| NoSQL injection  | express-mongo-sanitize                      |
| XSS mitigation   | XSS sanitization middleware                 |
| Authorization    | JWT-based protected routes                  |
| Error handling   | Centralized API error middleware            |

---

## Deployment Notes

### Backend on Render (Web Service)

- Root Directory: `backend`
- Build Command: `npm install`
- Start Command: `npm start`
- Health Check Path: `/api/health`

Set these environment variables in Render:

- `NODE_ENV=production`
- `PORT=10000` (or keep empty and let Render inject `PORT`)
- `MONGODB_URI=<your_mongodb_atlas_connection_string>`
- `JWT_SECRET=<minimum_32_character_secret>`
- `JWT_EXPIRES_IN=1d`
- `ADMIN_EMAIL=<your_admin_email>`
- `ADMIN_PASSWORD_HASH=<bcrypt_hash>`
- `ALLOWED_ORIGINS=https://your-vercel-domain.vercel.app,https://your-custom-domain.com`
- `DB_MAX_POOL_SIZE=25`
- `DB_MIN_POOL_SIZE=5`

Optional (recommended if you use many Vercel preview URLs):

- `ALLOWED_ORIGIN_REGEX=^https://.*\\.vercel\\.app$`

### Frontend on Vercel

- Project Root Directory: `frontend`
- Install Command: `npm install`
- Build Command: `npm run build`
- Output Directory: `dist`

Set this environment variable in Vercel:

- `VITE_API_BASE_URL=https://your-backend-service.onrender.com/api`

Important:

- Keep `/api` at the end of `VITE_API_BASE_URL`.
- Do not add a trailing `/` after `/api`.
- `frontend/vercel.json` is included to rewrite SPA routes (React Router) to `index.html`.

---

## Optional Phase 2

- Dark/light mode toggle
- Rich markdown blog editor
- Blog image upload and optimization
- Analytics dashboard for admin

---

## Connect With Me

<div align="center">

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/)
[![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/)

</div>

---

<div align="center">

### Star this repo if you find it useful

### Built with focus, consistency, and secure engineering

![Footer](https://capsule-render.vercel.app/api?type=waving&color=0:00C2FF,100:00E5A8&height=120&section=footer)

</div>
