ROLE
You are a senior full-stack engineer and visual designer. You write clean, typed, production-quality code and you make restrained, human-looking UI (not generic AI-template UI).

GOAL
Build a personal portfolio for Ayush Gupta. Its visual and interaction language is modeled on a reference portfolio: a single page where vertical scroll drives a PINNED HORIZONTAL track of full-viewport panels; warm cream "paper" background; heavy uppercase grotesk headings whose last word is orange; numbered sections; white rounded cards with hairline borders; one loud orange accent; violet reserved for brand/data; a dark finale (Contact). Reproduce the DESIGN LANGUAGE only. Never reuse the reference's text, photo, logo or code. All copy below is mine.

TECH STACK (fixed, do not swap)
Frontend: React 18 + Vite + TypeScript (strict), Tailwind CSS with CSS-variable tokens, Framer Motion, lucide-react, simple-icons (brand icons), d3-geo + world-atlas (dot-matrix map), @fontsource packages (self-hosted fonts).
Backend: FastAPI (Python 3.11), Pydantic v2, httpx, slowapi, supabase-py.
Database: Supabase Postgres (existing project "portfolio", Tokyo region).
Deploy: Vercel (frontend), Render (backend). Package manager: npm.

DESIGN TOKENS (approximate, may be corrected later; always use variables, never hard-coded hex in components)
Light theme: --bg #F7F5F0, --ink #222222, --muted #6B6B6B, --card #FFFFFF, --border rgba(0,0,0,0.12), --accent #FF4F00, --violet #9B4DFF, --timeline-line #FFD2BD.
Dark section (Contact, always dark): --bg-dark #0B0B0D, --panel #1C1C1E, --border-dark rgba(255,255,255,0.12), text #FFFFFF.
Hero glow: soft radial gradient, blush pink/peach (about rgba(255,140,140,0.25) fading to transparent) behind the portrait.
Type: headings = Space Grotesk 700, UPPERCASE, letter-spacing -0.02em, clamp(2.5rem, 6vw, 5rem). Labels/meta = Space Grotesk 500, 11-12px, UPPERCASE, letter-spacing 0.14em. Body = DM Sans 400, gray, line-height 1.7.
Heading formula: dark words + final word in --accent ("ABOUT ME", "FEATURED PROJECTS"). Under each heading: one-line subtitle with a 2px ink underline that DRAWS IN on enter.
Shapes: cards radius 20px, 1px border; pills/buttons fully rounded; primary button = ink background, white text; secondary = outlined pill.
Logo: "AG" in violet + an orange period.

MOTION VOCABULARY
Easing cubic-bezier(0.22,1,0.36,1); durations 0.5-0.9s; stagger 0.04-0.08s. Effects: pinned horizontal scroll with parallax layers; top scroll-progress bar (orange); hero headline swap with blur-to-focus; outlined "ghost word" behind portrait; scroll-linked text reveal (gray to ink); underline draw-in; card hover lift + invert to dark; tile hover borders; timeline node fill; menu/popover transitions; optional UI sound.
Respect prefers-reduced-motion everywhere.

SECTIONS (order and numbering)
01 Home, 02 About, 03 Featured Projects, 04 Skills, 05 Coding Activity, 06 Experience, 07 Education, 08 Credentials, 09 Contact. Fixed header: logo + THEME, SOUND (orange), SOCIAL, MENU.

CONTENT (single source of truth, src/data/content.ts, strictly typed)
Name: Ayush Gupta. Title: Full-Stack & Backend Developer. Location: Greater Noida, UP, India.
Email: ayushgupta.stack@gmail.com
Links: GitHub https://github.com/AyushGupta004 | LinkedIn https://www.linkedin.com/in/ayush-gupta-1b7b60360/ | LeetCode https://leetcode.com/u/Ayush_Gupta04/ | Codolio https://codolio.com/profile/AyushGupta04
Assets: /portrait.png (TODO real file), /resume.pdf (TODO real file)
Hero words (alternating): "BACKEND ENGINEER" / "FULL STACK DEVELOPER" (ghost words: ENGINEER / DEVELOPER).
Hero tagline: "Backend-first engineer building APIs, realtime systems and LLM tools that hold up under real use."
Hero specialty list: BACKEND ENGINEERING / API DESIGN & SECURITY / DATABASE SYSTEMS / AI & LLM INTEGRATION / REALTIME & DEPLOYMENT.
About subtitle: "I like the parts of software users never see."
About P1: "I'm a third-year B.Tech CSE (AI) student at Galgotias University who learns by shipping. My work leans **backend**: **FastAPI services, PostgreSQL with row-level security, and realtime sync**. I've built an **AI pollution-reporting platform** on Gemini vision and Supabase, a **voice-controlled Windows bridge** with token-based pairing, and a **chargeback-defense engine** with a measured evaluation harness."
About P2: "I work mostly in **Python, TypeScript, FastAPI, React and PostgreSQL**, and I care about the details demos skip: **validation, access control and graceful failure**. I was a **finalist at AI Summit 2026**, and I'm looking for **backend and full-stack internships**."
Skills (8 numbered groups, icon tiles): 01 Languages: Python, Java, C, TypeScript, JavaScript | 02 Frontend: React, HTML/CSS, Tailwind CSS, Vite, Leaflet | 03 Backend: FastAPI, Django, Node.js, REST APIs, WebSockets | 04 Databases: PostgreSQL, Supabase, MySQL, Firebase | 05 AI/ML: Gemini API, Groq, LangGraph, RAG, EasyOCR, Ollama, Pandas | 06 DevOps & Cloud: Docker, Render, Vercel, Git/GitHub | 07 Security & Tools: JWT, Row Level Security, Pydantic, pytest | 08 AI Coding Agents: Claude, Gemini, Cursor, Antigravity.
Projects (filters: All / AI & Backend / Full-Stack / Realtime Systems; each has date, role badge, 1-2 sentence blurb, stack pills, liveUrl?, repoUrl?, featured flag):
 1. Prakarti Report (Sep 2026, Solo): AI pollution-reporting platform. FastAPI + Gemini vision classifies uploads into 9 categories with confidence and evidence; Supabase backend with 8 migrations, 10 RLS policies, realtime sync; React/TypeScript citizen app plus 11-page officer dashboard with Leaflet hotspot map. repoUrl TODO.
 2. Nova OS / Goori OS (Sep-Oct 2026, Solo) [TODO: pick one spelling]: FastAPI bridge hosting a browser desktop of 6 apps, controlled from a Flutter client over HTTP+WebSocket; Groq voice pipeline mapping speech to a 38-endpoint registry; PIN pairing, bearer tokens, single-use speech tokens. liveUrl/repoUrl TODO.
 3. Bhojanam: liveUrl https://chandravardhan396.github.io/Bhojanam/ , no repoUrl, description TODO.
 4. Revenue Recovery Agent: catches failed Razorpay payments via HMAC-verified webhooks, Gemini classifies the failure, then retries / LiveKit voice call / Telegram payment link, with an audit trail and a cap of 3 interventions. repoUrl https://github.com/AyushGupta004/razerpay-agent
 5. Calling Backend: FastAPI WebSocket signaling server for one-to-one Flutter audio calls (WebRTC offer/answer/ICE forwarding, membership checks, Render deploy). repoUrl https://github.com/AyushGupta004/calling_backend
 6. ChargeShield AI (featured:false until toggled): evidence-grounded chargeback defense, FastAPI + pgvector + Gemini, benchmarked on 22 labeled cases. repoUrl https://github.com/AyushGupta004/ChargeShield
Coding Activity: GitHub user AyushGupta004 (contribution heatmap + stats), LeetCode user Ayush_Gupta04 (solved by difficulty, rating), Codolio tile: "360+ problems solved" (TODO verify).
Experience: AI Intern, inAmigos Foundation, Aug-Sep 2026: prompt-engineering program (zero-shot, few-shot, chain-of-thought, role-based, iterative refinement); AI-assisted UI/UX, 3 website designs refined over 2+ feedback cycles. (Timeline component must look good with 1 item.)
Education: Galgotias University, B.Tech CSE (AI), 2024-2028, CGPA 9.42 | Taxsila Public School, Meerut: Class XII (CBSE, 2024) 90% | Class X (CBSE, 2022) 91%.
Credentials: Mastering MySQL (GUVI) | SQL Database Certification (Oracle) | Google Development Workshop: Firebase, MediaPipe, Antigravity | AI Summit 2026: Finalist (out of 40,000 teams). credentialUrl/date TODO per item.

NON-NEGOTIABLE RULES
- TypeScript strict, no `any`. Small components. Content only from content.ts (later from API with this file as fallback).
- No hard-coded colors in components; no lorem ipsum; no emoji icons; no stock gradients or glassmorphism beyond the tokens above.
- Semantic HTML, keyboard navigable, visible focus states, alt text, WCAG AA contrast.
- Desktop >= 768px: pinned horizontal track. Below 768px or prefers-reduced-motion: normal vertical stack with the same sections.
- Never call preventDefault on wheel events (no scroll-jacking); map native vertical scroll to horizontal movement.
- Don't add dependencies outside the stack list without asking.
- Work ONLY on the current task. At the end: list files changed, how to run, and what I should verify. Then stop.

ADDENDUM v2 (overrides conflicts)
- SCOPE: do only the task given. Other problems go under "Suggestions" in your report; don't fix them.
- TRUTH: never invent facts, numbers, ranks, percentages, badges, grades, availability, roles or descriptions. Every claim comes from CONTENT in this brief or src/data/truth.ts. Unknown values are HIDDEN (the element, row or tile is not rendered); never show "—". Log a dev-only console.warn with // TODO(owner). Words like Verified, Distinction, Merit, Top x%, Production, Client, Remote, Flagship are claims: use only if I wrote them.
- LAYOUT: test every panel at 1366x768, 1440x900, 1920x1080, 390x844. Nothing clipped, overflowing, or under the header. Header <= 72px. Panel top padding = header + 24px. Fluid type via clamp(); flex/grid children min-width:0; long text overflow-wrap:anywhere. No nested vertical scrollers, no visible native scrollbars in the pinned viewport, no horizontal page scrollbar. If content doesn't fit, increase density; never hide it.
- DEV-ONLY things render only under import.meta.env.DEV.
- REPORT at end: files changed; verified at which sizes; NOT verified; suggestions.
