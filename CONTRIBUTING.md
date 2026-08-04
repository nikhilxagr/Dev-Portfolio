# Contributing to Nikhil Agrahari's Portfolio & Security Sandbox

Copyright (c) 2026 Nikhil Agrahari. All rights reserved.
Contact: [nikhilagrahari530@gmail.com](mailto:nikhilagrahari530@gmail.com)

Thank you for your interest in contributing! Whether you are reporting a bug, proposing a new feature, or submitting security research, we welcome your contributions to make this portfolio and engineering sandbox better.

---

## 📜 Code of Conduct

This project adheres to the [Contributor Covenant Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code. Please report unacceptable behavior to **nikhilagrahari530@gmail.com**.

---

## 🛠️ How to Contribute

### 1. Reporting Bugs
- Check the existing GitHub Issues to avoid duplicate reports.
- If creating a new bug report, please include:
  - **Description**: Clear explanation of the issue.
  - **Steps to Reproduce**: Detailed steps to replicate the bug.
  - **Environment**: Browser version, operating system, and theme mode (Light or Dark).
  - **Screenshots / Console Output**: Relevant logs or screenshots.

### 2. Proposing Features & Improvements
- Open a GitHub Discussion or Issue describing the feature.
- Explain the use case and why it benefits the portfolio or lab modules.

### 3. Submitting Pull Requests (PRs)
1. **Fork the Repository** and clone your fork locally:
   ```bash
   git clone https://github.com/nikhilxagr/Dev-Portfolio.git
   cd Dev-Portfolio
   ```
2. **Create a Feature Branch**:
   ```bash
   git checkout -b feature/amazing-feature
   # or
   git checkout -b fix/bug-fix-name
   ```
3. **Set Up Local Development**:
   - **Frontend**:
     ```bash
     cd frontend
     npm install
     npm run dev
     ```
   - **Backend**:
     ```bash
     cd backend
     npm install
     npm run dev
     ```
4. **Make Your Changes**:
   - Ensure clean code styling (ESLint & Prettier guidelines).
   - Verify both **Light Mode** and **Dark Mode** contrast and responsive design.
   - Run `npm run build` in `frontend` to verify 0 build errors.
5. **Commit Your Changes**:
   Use conventional commit messages:
   ```bash
   git commit -m "feat(experiments): add custom payload generator"
   git commit -m "fix(theme): resolve light mode contrast in DSA lab"
   ```
6. **Push to Your Fork & Open a PR**:
   ```bash
   git push origin feature/amazing-feature
   ```
   Open a Pull Request against the `main` branch with a concise title and description of your changes.

---

## 🎨 Coding & Architectural Guidelines

- **Frontend Stack**: React 18, Vite, TailwindCSS, Framer Motion, Lucide Icons.
- **Backend Stack**: Node.js (ESM), Express.js, MongoDB Atlas, Cashfree SDK.
- **Theme Awareness**: All UI components must support theme-switching using Tailwind `dark:` classes or explicit high-contrast theme tokens.
- **Performance**: Keep components modular, avoid unnecessary re-renders, and ensure fast page load times.

---

## 🛡️ Security Vulnerabilities & DMCA

- **Security Policy**: If you discover a security vulnerability, please follow our [Security Policy](SECURITY.md) and report it directly to **nikhilagrahari530@gmail.com**.
- **DMCA Notices**: For copyright or DMCA inquiries, please refer to [DMCA.md](DMCA.md) or contact **nikhilagrahari530@gmail.com**.

---

Thank you for helping build a better portfolio & security learning hub! 🚀
