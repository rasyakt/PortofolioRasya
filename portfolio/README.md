# Rasya Syahreza Maulana Zen — Portfolio & CMS

> **Fullstack Mobile & Web Developer | AI Engineer | CTO at BotHax**  
> State-of-the-Art Personal Portfolio with Built-in Headless CMS & Recruiter Quick-View Dossier.

---

## 💎 Design Philosophy & Architecture

Built with a **"High-Craft Engineering & Editorial Minimalism"** design ethos inspired by Linear, Raycast, and Vercel:
- **Obsidian Dark Palette**: Deep background (`#09090b`, `#121215`) with precise 1px borders (`zinc-800/60`).
- **Zero "AI-Slop"**: No meaningless neon blur blobs or generic templates. Crisp typography hierarchy, refined emerald accents (`#10b981`), and subtle micro-interactions.
- **Performance First**: Built on Next.js 16 (Turbopack), React 19, MySQL with Prisma ORM v5, and Framer Motion.

---

## ✨ Features

1. **Interactive Terminal Hero**
   - Simulated developer terminal with commands (`whoami`, `cat skills.json`, `ls achievements/`, `cat status.txt`).
   - Live availability badge (*"Open for Internship & Full-time roles"*).
   - One-click CV download and email copy feedback.

2. **Project Bento Grid & Filterable Gallery**
   - Featured Bento showcase highlighting flagship production apps (CV. Gasela Group, SIM-PKK, BotHax Engine).
   - Category filtering: **All, Enterprise, Mobile, AI, Systems, Fullstack**.
   - Detailed modal view with architectural breakdowns, problem statements, solutions, metrics, and live/source links.
   - **3x HKI Kemenkumham RI** registered intellectual property badges.

3. **Recruiter Quick-View Dossier**
   - Instant modal designed specifically for hiring managers, engineering leads, and technical recruiters.
   - Summarizes core tech stack, competitive highlights (LKS Jabar finalist, BotHax CTO leadership), salary expectations, and direct WhatsApp / email copy actions.

4. **Command Palette (`Ctrl+K` / `Cmd+K`)**
   - Keyboard-first fuzzy navigation.
   - Quick jumps to projects, certifications, contact info, social links, and admin portal.

5. **Official Certifications & Intellectual Property**
   - Displays 8 verified certifications including **HKI Kemenkumham RI** copyright registrations (ARTIKA-POS, SIM-PKK, BotHax).

6. **Full-Featured Admin CMS (`/admin`)**
   - Session-based cookie authentication (bcrypt).
   - Complete CRUD operations for Projects (title, category, tech stack, HKI badge, live links).
   - Complete CRUD for Certifications & Awards.
   - Profile configuration management (bio, contact details, availability status).

7. **Public REST API**
   - `GET /api/projects`: Query all projects or filter by category (`?category=enterprise`).
   - `GET /api/certifications`: Query all certifications or filter by type (`?type=hki`).

---

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router, Turbopack, Server Actions)
- **Language**: TypeScript
- **Database & ORM**: MySQL 8 + Prisma ORM v5
- **Styling**: Tailwind CSS + Custom CSS Design System
- **Animations**: Framer Motion
- **Icons**: Lucide React + Custom SVG Brand Icons

---

## 🚀 Getting Started

### 1. Installation
```bash
git clone <repository-url>
cd portfolio
npm install
```
`npm install` automatically runs `prisma generate` (postinstall).

### 2. Environment Variables
```bash
cp .env.example .env
```

| Variable | Description | Default |
|---|---|---|
| `DATABASE_URL` | MySQL connection string (`mysql://USER:PASSWORD@HOST:PORT/DATABASE`) | `mysql://root:@localhost:3306/portofoliorasya` |
| `SESSION_SECRET` | Secret used to sign the admin session cookie | — |
| `NEXTAUTH_URL` | Public URL of the app | `http://localhost:3000` |

### 3. Database Migration & Seeding
```bash
npx prisma migrate deploy   # apply the migrations in prisma/migrations
npm run db:seed             # seed projects, certifications, profile & admin user
```

> **Admin credentials:** username `rasya` — password `admin123`

Other database commands: `npm run db:studio` (Prisma Studio), `npm run db:reset` (drop, migrate & re-seed).

### 4. Run
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

Production build:
```bash
npm run build
npm run start
```

---

## 📁 Key Routes

| Route | Description |
|---|---|
| `/` | Public portfolio showcase |
| `/admin` | CMS Dashboard (Requires Authentication) |
| `/admin/login` | Admin login portal |
| `/admin/projects` | Manage all portfolio projects |
| `/admin/certifications` | Manage certifications & HKI badges |
| `/admin/profile` | Edit personal bio & contact info |
| `/api/projects` | Public REST API for projects |
| `/api/certifications` | Public REST API for credentials |

---

## 👨‍💻 Author

**Rasya Syahreza Maulana Zen**  
- GitHub: [@rasyakt](https://github.com/rasyakt)  
- LinkedIn: [Rasya Syahreza Maulana Zen](https://linkedin.com/in/rasya-syahreza-maulana-zen)  
- Live Portal: [gasela.my.id](https://gasela.my.id)
