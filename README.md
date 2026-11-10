# Ayush Gupta — Personal Portfolio & Systems Showcase (Monorepo)

A production-grade personal portfolio and backend architecture for **Ayush Gupta** (Full-Stack & Backend Developer).

Modeled on an editorial, human-crafted design language featuring a **pinned horizontal viewport track** on desktop driven by native vertical scrolling, warm cream paper background, heavy uppercase grotesk typography with loud orange accents, white hairline cards, dot-matrix global mapping, and a dark finale.

---

## 🏗 Repository Structure

```
NEW_PORTFOLIO/
├── PROJECT_BRIEF.md          # Full design specification and content brief
├── README.md                 # Root monorepo overview
├── package.json              # Monorepo workspaces & runner scripts
├── .gitignore                # Global ignore rules
├── frontend/                 # React 18 + Vite + TypeScript (strict)
│   ├── .env.example          # Environment variables template
│   ├── package.json          # Frontend dependencies
│   ├── tailwind.config.js    # Design tokens mapped to Tailwind
│   ├── tsconfig.json         # Strict TypeScript configuration
│   ├── vite.config.ts        # Vite configuration & proxy
│   ├── public/               # Public assets (portrait.png, resume.pdf)
│   └── src/
│       ├── index.css         # CSS variables on :root and [data-theme="dark"]
│       ├── context/
│       │   └── ThemeContext.tsx # ThemeProvider (light / dark / system)
│       ├── components/
│       │   ├── Header.tsx    # Fixed Header with 3px scroll-progress bar
│       │   └── ...
│       ├── data/
│       │   └── content.ts    # Single source of truth with strict TS types
│       ├── pages/
│       │   └── StyleguidePage.tsx # /styleguide route
│       └── ...
└── backend/                  # FastAPI backend service
    └── README.md             # Backend placeholder for TASK 2
```

---

## 🚀 Getting Started

### 1. Run Frontend Development Server
From the root directory:
```bash
npm run dev
```
Or inside `frontend/`:
```bash
cd frontend
npm run dev
```
Visit `http://localhost:5173` for the main site or `http://localhost:5173/styleguide` for the design system styleguide.

### 2. Build for Production
```bash
npm run build
```
Type checks with `tsc` in strict mode and bundles the optimized production build into `frontend/dist/`.
