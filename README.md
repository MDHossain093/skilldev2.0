<div align="center">

# ⚡ SkillDev

### *Accelerate Your Developer Career with AI*

A full-stack career platform that helps developers **track skills**, **showcase projects**, and **get personalized AI mentorship** — built with the modern web stack end-to-end.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-skilldev2--0.vercel.app-7c3aed?style=for-the-badge&logo=vercel)](https://skilldev2-0-8yljymvv3-mdhossain093s-projects.vercel.app)
[![API](https://img.shields.io/badge/API-skilldev2--0.onrender.com-0ea5e9?style=for-the-badge&logo=render)](https://skilldev2-0.onrender.com)
[![License](https://img.shields.io/badge/License-MIT-22c55e?style=for-the-badge)](LICENSE)

**Next.js 16** · **React 19** · **Express 5** · **Prisma 6** · **PostgreSQL** · **LangChain** · **Google Gemini**

</div>

---

## 🎯 What is SkillDev?

SkillDev is a **production-grade full-stack SaaS** for developers who want to grow their careers with data, not guesswork. It combines:

- 🤖 **AI Career Mentor** — Gemini-powered skill gap analysis, career roadmaps, and tailored advice
- 🧠 **Skill Tracker** — Visualize your tech stack and identify growth areas
- 💼 **Project Portfolio** — Rich project cards with GitHub links, live demos, and tech badges
- 👥 **Team Matching** — Find complementary developers via AI suggestions
- 🌐 **Public Portfolio Pages** — Auto-generated `/p/<username>` sites anyone can view

Every feature is wired through a **REST API** with JWT auth, a **PostgreSQL** database, and **server-side AI orchestration** using LangChain.

---

## ✨ Highlights

| Area | What's Built |
|---|---|
| **Auth** | JWT-based register/login with bcrypt-hashed passwords |
| **Database** | 5+ Prisma models (User, Profile, Skill, Project, UserSkill) with relations |
| **AI Layer** | LangChain + Google Gemini integration with structured prompts |
| **Frontend** | Next.js 16 App Router, React 19, Server Components, React Compiler |
| **State** | Zustand v5 with SSR-safe persist + rehydration |
| **UI/UX** | shadcn/ui primitives, Radix UI, Tailwind v4, Framer Motion, dark mode |
| **Real-time** | Optimistic updates, debounced mutations, error boundaries |
| **Deployment** | Vercel (frontend) + Render (backend) + Neon (Postgres) |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (Vercel)                        │
│  Next.js 16 · React 19 · Tailwind v4 · Zustand · shadcn/ui  │
└────────────────────┬────────────────────────────────────────┘
                     │  /api/*  (REST + JWT)
┌────────────────────▼────────────────────────────────────────┐
│                   Backend (Render)                          │
│   Express 5 · JWT Auth · LangChain · Google Gemini API      │
└────────────────────┬────────────────────────────────────────┘
                     │  Prisma ORM
┌────────────────────▼────────────────────────────────────────┐
│                  Database (Neon Postgres)                   │
│     User · Profile · Skill · Project · UserSkill            │
└─────────────────────────────────────────────────────────────┘
```

---

## 🧰 Tech Stack

### Frontend
- **Next.js 16.2.5** with App Router and Turbopack
- **React 19.2** with Server Components and React Compiler (prod)
- **TypeScript-ready** JSX with strict ESM
- **Tailwind CSS v4** + custom design system
- **shadcn/ui** + Radix UI primitives
- **Zustand v5** for client state (with `persist` + hydration tracking)
- **React Hook Form + Zod** for type-safe forms
- **Framer Motion** for animations
- **Recharts** for data viz
- **lucide-react** for icons

### Backend
- **Express 5** with CORS allowlist (localhost + Vercel preview domains)
- **Prisma 6** ORM with PostgreSQL
- **JWT** + bcryptjs for secure auth
- **LangChain** orchestration
- **Google Gemini** (`@google/genai`, `@langchain/google-genai`) for AI features
- **OpenAI** fallback for compatible endpoints
- **MVC structure**: routes → controllers → services

### DevOps
- Monorepo (`client/` + `server/`)
- Vercel preview deployments
- Render auto-deploy from `main`
- Neon serverless Postgres

---

## 📂 Project Structure

```
skilldev2.0/
├── client/                      # Next.js 16 frontend
│   ├── src/
│   │   ├── app/                 # App Router pages
│   │   │   ├── (auth)/         # login, register
│   │   │   ├── ai-mentor/      # AI career guidance
│   │   │   ├── dashboard/      # main dashboard
│   │   │   ├── developers/     # community + profiles
│   │   │   ├── portfolio/      # portfolio editor
│   │   │   ├── p/[username]/   # public portfolio pages
│   │   │   ├── profile/        # user profile
│   │   │   ├── projects/       # project CRUD
│   │   │   ├── search/         # developer search
│   │   │   ├── skills/         # skill tracker
│   │   │   └── team-match/     # AI team builder
│   │   ├── components/         # AppShell, Navbar, profile/*, ui/*
│   │   ├── lib/                # api, env helpers
│   │   ├── services/           # 7 service modules (auth, user, …)
│   │   └── store/              # Zustand stores (auth, theme)
│   └── next.config.mjs
│
└── server/                      # Express 5 backend
    ├── prisma/
    │   ├── schema.prisma       # 5 models, relations, migrations
    │   └── migrations/
    └── src/
        ├── app.js              # Express + CORS + routes
        ├── server.js           # entry point
        ├── config/db.js        # Prisma client
        ├── controllers/        # 6 controllers
        ├── routes/             # 6 route modules
        ├── services/           # auth, ai (LangChain)
        └── utils/aiPrompt.js   # structured AI prompts
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js 20+**
- **PostgreSQL** (or a Neon connection string)
- **Google Gemini API key** (for AI features)

### 1. Clone the repo

```bash
git clone https://github.com/MDHossain093/skilldev2.0.git
cd skilldev2.0
```

### 2. Backend setup

```bash
cd server
npm install
cp .env.example .env          # fill in DATABASE_URL, JWT_SECRET, GEMINI_API_KEY
npx prisma migrate dev
npm run dev                   # http://localhost:5000
```

### 3. Frontend setup

```bash
cd ../client
npm install
cp .env.example .env.local    # NEXT_PUBLIC_API_URL=http://localhost:5000
npm run dev                   # http://localhost:3000
```

### 4. Open the app

Visit **http://localhost:3000** → register an account → explore the dashboard.

---

## 🛣️ API Endpoints

All endpoints are prefixed with `/api`. Authenticated routes require `Authorization: Bearer <token>`.

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/auth/register` | Create account, returns JWT |
| `POST` | `/auth/login` | Authenticate, returns JWT |
| `GET`  | `/users` | List all developers |
| `GET`  | `/users/:id` | Get developer by ID |
| `GET/PUT` | `/profile/:userId` | Profile read/update |
| `GET/POST` | `/skills/:userId` | List / add skill |
| `DELETE` | `/skills/:id` | Remove a skill |
| `GET/POST` | `/projects/:userId` | List / add project |
| `DELETE` | `/projects/:id` | Remove a project |
| `POST` | `/ai/analyze` | Run AI career analysis |
| `POST` | `/ai/team-match` | Find complementary teammates |

---

## 🧠 AI Features

Powered by **LangChain** with **Google Gemini** under the hood:

- **Skill Gap Analysis** — compares your skills against target role requirements
- **Career Roadmap** — generates a personalized learning path
- **Project Recommendations** — suggests side projects to fill gaps
- **Team Matching** — finds developers with complementary skills

All prompts are **structured and versioned** in `server/src/utils/aiPrompt.js` for reproducibility.

---

## 🎨 Design System

- **Dark-first** with a light-mode toggle (persisted in `localStorage`)
- **Custom Tailwind v4 theme** with semantic tokens
- **Glass morphism** cards, **gradient accents**, **animated backgrounds**
- **Fully responsive** — mobile drawer, tablet grid, desktop sidebar
- **Accessibility** — Radix primitives ensure ARIA compliance
- **SSR-safe** — `ThemeInitScript` runs before paint to prevent FOUC

---

## 🔐 Security

- **Passwords** hashed with bcryptjs (salt rounds configurable)
- **JWT** tokens with expiry, stored client-side in `localStorage`
- **CORS** allowlist — only `localhost:3000/5173` and `*.vercel.app` origins
- **Prisma** prevents SQL injection by design
- **Environment variables** never committed; `.env.example` provided

---

## 📈 What's Next

- [ ] Real-time chat between matched teammates
- [ ] GitHub OAuth + auto-import of repos
- [ ] Stripe integration for premium AI analysis
- [ ] Public API + rate limiting
- [ ] Docker Compose for one-command local setup
- [ ] Unit + integration test suite (Jest + Supertest)

---

## 📄 License

This project is licensed under the **MIT License** — see [LICENSE](LICENSE) for details.

---

## 👤 Author

**MD Hossain**

- GitHub: [@MDHossain093](https://github.com/MDHossain093)
- Project: [skilldev2.0](https://github.com/MDHossain093/skilldev2.0)

---

<div align="center">

⭐ **If this project caught your eye, a star goes a long way.** ⭐

</div>
