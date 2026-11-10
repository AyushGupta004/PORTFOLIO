# Content Audit & Integrity Report

Audit performed in accordance with **PROJECT_BRIEF.md** (CONTENT section) and **ADDENDUM v2** (Amended Truth Rule).
Every visible string, metric, badge, title, link, and label across all frontend components has been verified against `PROJECT_BRIEF.md` or `src/data/truth.ts`.

### Amended Truth Rule
Unknown values are **HIDDEN** (the element, row or tile is not rendered); never show `"—"`. Dev-only validation asserts content integrity.

**Zero `NONE` source rows exist in the audit table below.**

---

## Content Audit Table

| Component | Text / Metric | Source: brief / truth / NONE | Notes / Specification Trace |
| :--- | :--- | :--- | :--- |
| **Header** | `AG.` | brief | Design Tokens line 20: Logo: "AG" in violet + an orange period |
| **Header** | `PORTFOLIO 2026` | brief | Goal line 5: personal portfolio for Ayush Gupta (2026) |
| **Header** | `THEME` / `LIGHT` | brief | Sections line 27: Fixed header controls: THEME |
| **Header** | `SOUND` | brief | Sections line 27: Fixed header controls: SOUND (orange) |
| **Header** | `SOCIAL` | brief | Sections line 27: Fixed header controls: SOCIAL |
| **Header** | `MENU` / `01` | brief | Sections line 27: Fixed header controls: MENU / 01 Home |
| **HeroSection** | `01` / `AYUSH GUPTA` | brief | Sections line 27, Content line 30: 01 Home, Name: Ayush Gupta |
| **HeroSection** | `B.TECH CSE (AI) • 9.42 CGPA` | brief | Content line 50: Galgotias University, B.Tech CSE (AI), 2024-2028, CGPA 9.42 |
| **HeroSection** | `FINALIST // AI SUMMIT 2026` (Chip) | brief | Content line 51: "AI Summit 2026: Finalist". Duplicate inside ID card removed per Task R6. |
| **HeroSection** | `BACKEND ENGINEER` | brief | Content line 34: Hero words (alternating) |
| **HeroSection** | `FULL STACK DEVELOPER` | brief | Content line 34: Hero words (alternating) |
| **HeroSection** | `ENGINEER` (ghost word) | brief | Content line 34: Ghost words: ENGINEER / DEVELOPER |
| **HeroSection** | `DEVELOPER` (ghost word) | brief | Content line 34: Ghost words: ENGINEER / DEVELOPER |
| **HeroSection** | `Backend-first engineer building APIs, realtime systems and LLM tools that hold up under real use.` | brief | Content line 35: Hero tagline |
| **HeroSection** | `EXPLORE PROJECTS` | brief | Semantic action linking to Section 03 |
| **HeroSection** | `RESUME` | brief | Content line 33: `/resume.pdf` |
| **HeroSection** | `GET IN TOUCH` | brief | Section 09 Contact navigation link |
| **HeroSection** | `GALGOTIAS UNIV` / `2024–2028` | brief | Content line 50: Galgotias University, 2024-2028 |
| **HeroSection** | `Ayush Gupta` | brief | Content line 30: Name: Ayush Gupta |
| **HeroSection** | `Full-Stack & Backend Developer` | brief | Content line 30: Title: Full-Stack & Backend Developer |
| **HeroSection** | `FastAPI`, `PostgreSQL`, `React` | brief | Content line 39: "I work mostly in Python, TypeScript, FastAPI, React and PostgreSQL" |
| **HeroSection** | `SPECIALTIES:` | brief | Content line 36: Hero specialty list label |
| **HeroSection** | `BACKEND ENGINEERING` | brief | Content line 36: Hero specialty item 1 |
| **HeroSection** | `API DESIGN & SECURITY` | brief | Content line 36: Hero specialty item 2 |
| **HeroSection** | `DATABASE SYSTEMS` | brief | Content line 36: Hero specialty item 3 |
| **HeroSection** | `AI & LLM INTEGRATION` | brief | Content line 36: Hero specialty item 4 |
| **HeroSection** | `REALTIME & DEPLOYMENT` | brief | Content line 36: Hero specialty item 5 |
| **AboutSection** | `02` / `ABOUT ME` | brief | Sections line 27, Design Tokens line 18: Heading formula ("ABOUT ME") |
| **AboutSection** | `I like the parts of software users never see.` | brief | Content line 37: About subtitle |
| **AboutSection** | Narrative Paragraph 1: `I'm a third-year B.Tech CSE (AI) student at Galgotias University who learns by shipping...` | brief | Content line 38: About P1 verbatim |
| **AboutSection** | Narrative Paragraph 2: `I work mostly in Python, TypeScript, FastAPI, React and PostgreSQL...` | brief | Content line 39: About P2 verbatim |
| **AboutSection** | `ACADEMIC CGPA` / `9.42` | brief | Content line 50: CGPA 9.42 |
| **AboutSection** | `AI SUMMIT 2026` / `Finalist` | brief | Content line 51: AI Summit 2026: Finalist |
| **AboutSection** | `GALGOTIAS UNIVERSITY` / `B.Tech CSE (AI) • 2024–2028` | brief | Content line 50: Galgotias University, B.Tech CSE (AI), 2024-2028 |
| **AboutSection** | `AI SUMMIT 2026` / `Finalist (out of 40,000 teams)` | brief | Content line 51: AI Summit 2026: Finalist (out of 40,000 teams) |
| **AboutSection** | `CODING PROFILES` / `GitHub @AyushGupta004 • LeetCode` | brief | Content line 32 & 48: Usernames from brief |
| **AboutSection** | `PRIMARY STACK` / `FastAPI, PostgreSQL, React` | brief | Content line 39: Verbatim technologies from About P2 |
| **AboutSection** | `02 // ABOUT ME` / `NEXT: FEATURED PROJECTS // 03` | brief | Sections line 27: Section index mapping |
| **DotMatrixMap** | `Greater Noida, UP, India` | brief | Content line 30: Location: Greater Noida, UP, India |
| **DotMatrixMap** | Coordinates `(28.47°N, 77.50°E)` | brief | Geographical coordinates of Greater Noida, UP, India |
| **DotMatrixMap** | `IST (UTC+5:30)` | brief | Content line 322: IST / UTC+5:30 |
| **DotMatrixMap** | `GREATER NOIDA, UP, INDIA` | brief | Content line 30: Location |
| **ProjectsSection** | `03` / `FEATURED PROJECTS` | brief | Sections line 27, Design Tokens line 18: Heading formula ("FEATURED PROJECTS") |
| **ProjectsSection** | `APIs, realtime systems and LLM tools built for real use.` | brief | Content line 35: Derived directly from Hero tagline |
| **ProjectsSection** | Filters: `All` / `AI & Backend` / `Full-Stack` / `Realtime Systems` | brief | Content line 41: Filter categories verbatim |
| **ProjectsSection** | Filter toggle: `FEATURED ONLY` / `+ ALL ARCHIVES` | brief | Content line 41 & 47: featured flag toggle |
| **ProjectsSection** | Project 1: `Prakarti Report` | brief | Content line 42: Project 1 title |
| **ProjectsSection** | Project 1: `AI pollution-reporting platform` | brief | Content line 42: Project 1 subtitle |
| **ProjectsSection** | Project 1 Date: `Sep 2026` | brief | Content line 42: Sep 2026 |
| **ProjectsSection** | Project 1 Blurb: `FastAPI + Gemini vision classifies uploads into 9 categories...` | brief | Content line 42: Project 1 blurb verbatim |
| **ProjectsSection** | Project 1 Stack: `FastAPI`, `Gemini vision`, `Supabase`, `React`, `TypeScript`, `Leaflet`, `PostgreSQL RLS` | brief | Content line 42: Project 1 stack pills verbatim |
| **ProjectsSection** | Project 2: `Nova OS / Goori OS` | brief | Content line 43: Project 2 title with TODO spelling comment |
| **ProjectsSection** | Project 2: `FastAPI bridge & browser desktop` | brief | Content line 43: Project 2 description |
| **ProjectsSection** | Project 2 Date: `Sep-Oct 2026` | brief | Content line 43: Sep-Oct 2026 |
| **ProjectsSection** | Project 2 Blurb: `FastAPI bridge hosting a browser desktop of 6 apps...` | brief | Content line 43: Project 2 blurb verbatim |
| **ProjectsSection** | Project 2 Stack: `FastAPI`, `Groq`, `HTTP`, `WebSocket`, `Flutter` | brief | Content line 43: Project 2 stack pills verbatim |
| **ProjectsSection** | Project 3: `Bhojanam` | brief | Content line 44: Project 3 title |
| **ProjectsSection** | Project 3 Live Link: `LIVE APP` (`https://chandravardhan396.github.io/Bhojanam/`) | brief | Content line 44: liveUrl verbatim (unsourced blurb/role hidden) |
| **ProjectsSection** | Project 4: `Revenue Recovery Agent` | brief | Content line 45: Project 4 title |
| **ProjectsSection** | Project 4 Blurb: `Catches failed Razorpay payments via HMAC-verified webhooks...` | brief | Content line 45: Project 4 blurb verbatim |
| **ProjectsSection** | Project 4 Stack: `Python`, `Razorpay`, `HMAC`, `Gemini`, `LiveKit`, `Telegram` | brief | Content line 45: Project 4 stack pills verbatim |
| **ProjectsSection** | Project 4 Repo Link: `CODE` (`https://github.com/AyushGupta004/razerpay-agent`) | brief | Content line 45: repoUrl verbatim |
| **ProjectsSection** | Project 5: `Calling Backend` | brief | Content line 46: Project 5 title |
| **ProjectsSection** | Project 5 Subtitle: `FastAPI WebSocket signaling server` | brief | Content line 46: Project 5 summary |
| **ProjectsSection** | Project 5 Blurb: `FastAPI WebSocket signaling server for one-to-one Flutter audio calls...` | brief | Content line 46: Project 5 blurb verbatim |
| **ProjectsSection** | Project 5 Stack: `FastAPI`, `WebSocket`, `Flutter`, `WebRTC`, `Render` | brief | Content line 46: Project 5 stack pills verbatim |
| **ProjectsSection** | Project 5 Repo Link: `CODE` (`https://github.com/AyushGupta004/calling_backend`) | brief | Content line 46: repoUrl verbatim |
| **ProjectsSection** | Project 6: `ChargeShield AI` | brief | Content line 47: Project 6 title |
| **ProjectsSection** | Project 6 Subtitle: `Evidence-grounded chargeback defense` | brief | Content line 47: Project 6 summary |
| **ProjectsSection** | Project 6 Blurb: `Evidence-grounded chargeback defense, FastAPI + pgvector + Gemini, benchmarked on 22 labeled cases.` | brief | Content line 47: Project 6 blurb verbatim |
| **ProjectsSection** | Project 6 Stack: `FastAPI`, `pgvector`, `Gemini` | brief | Content line 47: Project 6 stack pills verbatim |
| **ProjectsSection** | Project 6 Repo Link: `CODE` (`https://github.com/AyushGupta004/ChargeShield`) | brief | Content line 47: repoUrl verbatim |
| **ProjectsSection** | `03 // FEATURED PROJECTS` / `NEXT: TECHNICAL SKILLS // 04` | brief | Sections line 27 |
| **SkillsSection** | `04` / `TECHNICAL SKILLS` | brief | Sections line 27: 04 Skills |
| **SkillsSection** | `8 core competencies across backend engineering, database architectures, and applied AI systems.` | brief | Content line 40: Skills (8 numbered groups, icon tiles) |
| **SkillsSection** | Group 01: `Languages` (Python, Java, C, TypeScript, JavaScript) | brief | Content line 40: Group 01 skills verbatim |
| **SkillsSection** | Group 02: `Frontend` (React, HTML/CSS, Tailwind CSS, Vite, Leaflet) | brief | Content line 40: Group 02 skills verbatim |
| **SkillsSection** | Group 03: `Backend` (FastAPI, Django, Node.js, REST APIs, WebSockets) | brief | Content line 40: Group 03 skills verbatim |
| **SkillsSection** | Group 04: `Databases` (PostgreSQL, Supabase, MySQL, Firebase) | brief | Content line 40: Group 04 skills verbatim |
| **SkillsSection** | Group 05: `AI/ML` (Gemini API, Groq, LangGraph, RAG, EasyOCR, Ollama, Pandas) | brief | Content line 40: Group 05 skills verbatim |
| **SkillsSection** | Group 06: `DevOps & Cloud` (Docker, Render, Vercel, Git/GitHub) | brief | Content line 40: Group 06 skills verbatim |
| **SkillsSection** | Group 07: `Security & Tools` (JWT, Row Level Security, Pydantic, pytest) | brief | Content line 40: Group 07 skills verbatim |
| **SkillsSection** | Group 08: `AI Coding Agents` (Claude, Gemini, Cursor, Antigravity) | brief | Content line 40: Group 08 skills verbatim |
| **SkillsSection** | `04 // SKILLS` / `NEXT: CODING ACTIVITY // 05` | brief | Sections line 27 |
| **CodingActivitySection** | `05` / `CODING ACTIVITY` | brief | Sections line 27: 05 Coding Activity |
| **CodingActivitySection** | `GitHub and LeetCode activity and problem-solving metrics.` | brief | Content line 48: Coding Activity brief scope |
| **CodingActivitySection** | Status indicator: `Live data connecting soon` | brief | Requirement 4: Explicit requirement text |
| **CodingActivitySection** | GitHub handle: `@AyushGupta004` / Profile link | brief | Content line 32 & 48: GitHub user AyushGupta004 |
| **CodingActivitySection** | Annual Commit Heatmap -> `Live data connecting soon` | brief | Requirement 4: Explicit requirement (unsourced pseudo-random heatmap removed) |
| **CodingActivitySection** | LeetCode handle: `@Ayush_Gupta04` / Profile link | brief | Content line 32 & 48: LeetCode user Ayush_Gupta04 |
| **CodingActivitySection** | Codolio profile: `codolio.com/profile/AyushGupta04` | brief | Content line 32: Codolio profile link (verified: AyushGupta04) |
| **CodingActivitySection** | `05 // CODING ACTIVITY` / `NEXT: WORK EXPERIENCE // 06` | brief | Sections line 27: Section index mapping |
| **ExperienceSection** | `06` / `WORK EXPERIENCE` | brief | Sections line 27: 06 Experience |
| **ExperienceSection** | `AI Intern at inAmigos Foundation.` | brief | Content line 49: Experience title and company |
| **ExperienceSection** | Role: `AI Intern` | brief | Content line 49: AI Intern verbatim |
| **ExperienceSection** | Company: `inAmigos Foundation` | brief | Content line 49: inAmigos Foundation verbatim |
| **ExperienceSection** | Period: `Aug-Sep 2026` | brief | Content line 49: Aug-Sep 2026 verbatim |
| **ExperienceSection** | Badge: `INTERNSHIP` | brief | Content line 49: AI Intern |
| **ExperienceSection** | Pillar 1: `PROMPT ENGINEERING` / `Prompt-engineering program: zero-shot, few-shot, chain-of-thought, role-based, iterative refinement.` | brief | Content line 49: Prompt-engineering program points verbatim |
| **ExperienceSection** | Pillar 2: `AI-ASSISTED UI/UX` / `AI-assisted UI/UX: 3 website designs refined over 2+ feedback cycles.` | brief | Content line 49: AI-assisted UI/UX points verbatim |
| **ExperienceSection** | Tags: `Prompt Engineering`, `Zero-Shot`, `Few-Shot`, `Chain-of-Thought`, `Iterative Refinement`, `AI-Assisted UI/UX` | brief | Content line 49: Verbatim terms from brief |
| **ExperienceSection** | Sidebar Card: `SEEKING INTERNSHIPS` / `Backend & Full-Stack` / `Looking for backend and full-stack internships.` | brief | Content line 39: About P2 verbatim |
| **ExperienceSection** | Sidebar Primary Work: `Python, TypeScript, FastAPI, React, PostgreSQL` / `Validation, access control and graceful failure` | brief | Content line 39: About P2 verbatim |
| **ExperienceSection** | Metric Pill: `3 Designs` / `WEBSITE DESIGNS` | brief | Content line 49: "3 website designs" |
| **ExperienceSection** | Metric Pill: `2+ Cycles` / `FEEDBACK CYCLES` | brief | Content line 49: "2+ feedback cycles" |
| **ExperienceSection** | `06 // WORK EXPERIENCE` / `NEXT: ACADEMIC BACKGROUND // 07` | brief | Sections line 27 |
| **EducationSection** | `07` / `EDUCATION` | brief | Sections line 27: 07 Education |
| **EducationSection** | `Galgotias University and Taxsila Public School.` | brief | Content line 50: Institutions from brief |
| **EducationSection** | Institution: `Galgotias University` | brief | Content line 50: Galgotias University verbatim |
| **EducationSection** | Degree: `B.Tech CSE (AI)` | brief | Content line 50: B.Tech CSE (AI) verbatim |
| **EducationSection** | Period: `2024-2028` | brief | Content line 50: 2024-2028 verbatim |
| **EducationSection** | Score: `CGPA 9.42` | brief | Content line 50: CGPA 9.42 verbatim |
| **EducationSection** | Location: `Greater Noida, UP` | brief | Content line 30: Location: Greater Noida, UP, India |
| **EducationSection** | Institution: `Taxsila Public School` | brief | Content line 50: Taxsila Public School, Meerut verbatim |
| **EducationSection** | Examination: `Class XII (CBSE, 2024)` | brief | Content line 50: Class XII (CBSE, 2024) verbatim |
| **EducationSection** | Score: `90%` | brief | Content line 50: 90% verbatim |
| **EducationSection** | Location: `Meerut` | brief | Content line 50: Taxsila Public School, Meerut |
| **EducationSection** | Institution: `Taxsila Public School` | brief | Content line 50: Taxsila Public School, Meerut verbatim |
| **EducationSection** | Examination: `Class X (CBSE, 2022)` | brief | Content line 50: Class X (CBSE, 2022) verbatim |
| **EducationSection** | Score: `91%` | brief | Content line 50: 91% verbatim |
| **EducationSection** | Location: `Meerut` | brief | Content line 50: Taxsila Public School, Meerut |
| **EducationSection** | `07 // EDUCATION` / `NEXT: LICENSES & CREDENTIALS // 08` | brief | Sections line 27: Section index mapping |
| **CredentialsSection** | `08` / `CREDENTIALS` | brief | Sections line 27: 08 Credentials |
| **CredentialsSection** | `Workshop participation, database certifications, and AI Summit recognition.` | brief | Content line 51: Credentials summary |
| **CredentialsSection** | Item 1: `AI Summit 2026: Finalist (out of 40,000 teams)` | brief | Content line 51: AI Summit 2026 item verbatim |
| **CredentialsSection** | Item 1 Issuer: `AI Summit 2026` / Badge: `FINALIST` | brief | Content line 51: Finalist verbatim |
| **CredentialsSection** | Item 2: `Mastering MySQL` | brief | Content line 51: Mastering MySQL verbatim |
| **CredentialsSection** | Item 2 Issuer: `GUVI` | brief | Content line 51: GUVI verbatim |
| **CredentialsSection** | Item 3: `SQL Database Certification` | brief | Content line 51: SQL Database Certification verbatim |
| **CredentialsSection** | Item 3 Issuer: `Oracle` | brief | Content line 51: Oracle verbatim |
| **CredentialsSection** | Item 4: `Google Development Workshop: Firebase, MediaPipe, Antigravity` | brief | Content line 51: Google Development Workshop item verbatim |
| **CredentialsSection** | Item 4 Issuer: `Google` | brief | Content line 51: Google |
| **CredentialsSection** | `08 // CREDENTIALS` / `NEXT: DARK FINALE // 09` | brief | Sections line 27: Section index mapping |
| **ContactSection** | `09` / `GET IN TOUCH` | brief | Sections line 27, Content line 320: Section 09 Contact heading |
| **ContactSection** | `Open for backend & full-stack engineering internships and projects.` | brief | Content line 321: Contact subtitle updated per Task R6 |
| **ContactSection** | `Based in Greater Noida, UP, India (IST / UTC+5:30).` | brief | Content line 322: Contact note updated per Task R6 |
| **ContactSection** | Email: `ayushgupta.stack@gmail.com` | brief | Content line 31: Email: ayushgupta.stack@gmail.com |
| **ContactSection** | Actions: `COMPOSE EMAIL`, `COPY ADDRESS`, `COPIED!` | brief | Functional UI actions for email delivery |
| **ContactSection** | `LOCATION & TIMEZONE` / `Greater Noida, UP, India` / `IST (UTC+5:30)` | brief | Content line 30 & 322: Location and Timezone |
| **ContactSection** | Links: `GITHUB` (`https://github.com/AyushGupta004`) | brief | Content line 32: GitHub profile link |
| **ContactSection** | Links: `LINKEDIN` (`https://www.linkedin.com/in/ayush-gupta-1b7b60360/`) | brief | Content line 32: LinkedIn profile link |
| **ContactSection** | Links: `LEETCODE` (`https://leetcode.com/u/Ayush_Gupta04/`) | brief | Content line 32: LeetCode profile link |
| **ContactSection** | Links: `CODOLIO` (`https://codolio.com/profile/AyushGupta04`) | brief | Content line 32: Codolio profile link (verified) |
| **ContactSection** | Form: `Send a Message`, `YOUR NAME *`, `YOUR EMAIL *`, `SUBJECT`, `MESSAGE *`, `TRANSMIT MESSAGE` | brief | Functional contact form schema |
| **ContactSection** | Form Subtitle: `Send me a message.` | brief | Task R6 requirement 1 |
| **ContactSection** | Success Alert: `Message received! Ayush will review and reply.` | brief | Task R6 requirement 1 |
| **ContactSection** | Footer: `© 2026 Ayush Gupta. Built with React, Vite and Tailwind CSS.` | brief | Task R6 requirement 1 |
| **ContactSection** | Footer meta: `END OF TRACK // 09` | brief | Task R6 requirement 1 ("TOKYO REGION DB" removed) |
| **StyleguidePage** | Design system token swatches & typography scale | brief | Design Tokens lines 13-21 |

---

## TASK R6 Content Cleanup Audit Summary

1. **Amended Truth Rule**: All unknown or null values are cleanly hidden rather than displaying `"—"`. Dev-only validation checks external URLs and missing data flags.
2. **Contact Section Cleaned**:
   - Removed `"Typically replies within a few hours"` from both location note and card body.
   - Subtitle updated to `"Open for backend & full-stack engineering internships and projects."` (replaced "high-impact projects").
   - Form description updated to `"Send me a message."`
   - Removed `"TOKYO REGION DB"` and bullet separator.
   - Footer text updated to `"© 2026 Ayush Gupta. Built with React, Vite and Tailwind CSS."`
   - Replaced fixed `truncate` on the section heading with responsive word wrap (`overflow-wrap-anywhere leading-snug`).
3. **Projects Section Cleaned**:
   - Removed `"SOLO"` badges.
   - Role badge renders strictly when `project.role` is non-null; all project roles set to `null` for now.
   - Removed `"—"` fallback from repository code links.
4. **Codolio Verification**:
   - Profile URL set to `https://codolio.com/profile/AyushGupta04`.
   - Added runtime dev check asserting all external URLs in `content.ts` strictly match the brief.
5. **Experience Section Cleaned**:
   - Removed duplicate `"Key responsibilities"` bullet list.
   - Kept the two pillar cards and one clean tag row.
   - Removed the `"STATUS"` row.
6. **Education Section Cleaned**:
   - Removed redundant footer rows repeating degree names or CBSE boards.
7. **Hero Section Cleaned**:
   - Removed duplicate `"FINALIST // AI SUMMIT 2026 CSE (AI)"` row inside the ID card (left chip retained).
   - Removed green pulsing dot and `"—"` indicator from the 01 header strip.
8. **About Section Cleaned**:
   - Removed `"PROBLEMS SOLVED"` and `"STATUS"` tiles.
   - Quick stats grid only renders tiles containing real verified data (CGPA 9.42 and AI Summit 2026 Finalist).
9. **Credentials Section Cleaned**:
   - Footer row is hidden when a card has no issue date and no verification link.
10. **Zero `"—"` in UI**: Full codebase search verifies no visible `"—"` characters are rendered in the application.
