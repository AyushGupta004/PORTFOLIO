import React from 'react';
import { motion } from 'framer-motion';
import { SectionHeading } from '../components/SectionHeading';
import { ArrowUpRight, FileDown, Check, Sparkles, ArrowLeft } from 'lucide-react';

interface StyleguidePageProps {
  onBackToHome?: () => void;
}

export const StyleguidePage: React.FC<StyleguidePageProps> = ({ onBackToHome }) => {
  const lightColors = [
    { token: '--bg', hex: '#F7F5F0', name: 'Paper Background', textDark: true },
    { token: '--ink', hex: '#222222', name: 'Primary Ink', textDark: false },
    { token: '--muted', hex: '#6B6B6B', name: 'Muted Gray', textDark: false },
    { token: '--card', hex: '#FFFFFF', name: 'White Surface', textDark: true },
    { token: '--border', hex: 'rgba(0,0,0,0.12)', name: 'Hairline Border', textDark: true, isBorder: true },
    { token: '--accent', hex: '#FF4F00', name: 'Loud Orange Accent', textDark: false },
    { token: '--violet', hex: '#9B4DFF', name: 'Brand Violet', textDark: false },
    { token: '--timeline-line', hex: '#FFD2BD', name: 'Timeline Peach Track', textDark: true },
  ];

  const darkColors = [
    { token: '--bg-dark', hex: '#0B0B0D', name: 'Finale Deep Black', textDark: false },
    { token: '--panel', hex: '#1C1C1E', name: 'Finale Surface Card', textDark: false },
    { token: '--border-dark', hex: 'rgba(255,255,255,0.12)', name: 'Finale Hairline', textDark: false, isBorder: true },
    { token: '--text-dark', hex: '#FFFFFF', name: 'Finale Text', textDark: true },
  ];

  return (
    <div className="w-full min-h-screen bg-bg text-ink pt-24 pb-20 px-6 md:px-12 lg:px-20 max-w-6xl mx-auto font-sans selection:bg-accent selection:text-white">
      {/* Navigation breadcrumb */}
      <div className="flex items-center justify-between pb-6 border-b border-border mb-10">
        <div className="flex items-center gap-3">
          {onBackToHome && (
            <button
              onClick={onBackToHome}
              className="flex items-center gap-1.5 text-xs font-label text-muted hover:text-ink transition-colors px-3 py-1.5 rounded-full border border-border bg-card shadow-sm cursor-pointer"
            >
              <ArrowLeft size={13} />
              <span>PORTFOLIO HOME</span>
            </button>
          )}
          <span className="font-label text-xs text-accent font-bold">SYSTEM // 00</span>
          <span className="text-muted text-xs">//</span>
          <span className="font-label text-xs text-ink">DESIGN SYSTEM & SPECIFICATION</span>
        </div>
        <span className="text-xs font-mono text-muted">TASK 1: FOUNDATION</span>
      </div>

      {/* Main Title */}
      <div className="mb-14">
        <SectionHeading
          number="00"
          title="DESIGN SYSTEM"
          subtitle="Tokens, typography, motion vocabulary, and restrained components modeled on editorial paper."
        />
      </div>

      {/* 1. COLOR TOKENS */}
      <section className="mb-16">
        <div className="flex items-center gap-2 mb-2">
          <span className="font-label text-xs text-accent">01 //</span>
          <h3 className="font-heading text-2xl text-ink">Color Tokens</h3>
        </div>
        <p className="text-sm text-muted mb-6">
          Strictly defined via CSS variables on <code className="text-xs font-mono bg-card px-1.5 py-0.5 rounded border border-border">:root</code> and overridden under <code className="text-xs font-mono bg-card px-1.5 py-0.5 rounded border border-border">[data-theme="dark"]</code>. Never hard-coded in components.
        </p>

        {/* Light theme swatches */}
        <div className="mb-8">
          <span className="font-label text-[11px] text-muted block mb-3">CANVAS & LIGHT THEME TOKENS</span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {lightColors.map((c) => (
              <div
                key={c.token}
                className="rounded-card border border-border bg-card p-4 flex flex-col justify-between shadow-sm transition-all hover:border-accent"
              >
                <div
                  className="w-full h-16 rounded-xl border border-border mb-3 flex items-center justify-center"
                  style={{ backgroundColor: c.isBorder ? 'transparent' : c.hex }}
                >
                  {c.isBorder && (
                    <span className="text-[10px] font-mono text-muted">1px Border</span>
                  )}
                </div>
                <div>
                  <div className="font-mono text-xs font-bold text-ink">{c.token}</div>
                  <div className="text-[11px] text-muted font-sans mt-0.5">{c.name}</div>
                  <div className="font-mono text-[10px] text-accent mt-1">{c.hex}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dark Finale swatches */}
        <div>
          <span className="font-label text-[11px] text-muted block mb-3">DARK FINALE TOKENS (CONTACT SECTION)</span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {darkColors.map((c) => (
              <div
                key={c.token}
                className="rounded-card border border-border bg-[#1C1C1E] p-4 flex flex-col justify-between shadow-sm text-white transition-all hover:border-accent"
              >
                <div
                  className="w-full h-16 rounded-xl border border-white/20 mb-3 flex items-center justify-center"
                  style={{ backgroundColor: c.isBorder ? 'transparent' : c.hex }}
                >
                  {c.isBorder && (
                    <span className="text-[10px] font-mono text-zinc-400">1px Border</span>
                  )}
                </div>
                <div>
                  <div className="font-mono text-xs font-bold text-white">{c.token}</div>
                  <div className="text-[11px] text-zinc-400 font-sans mt-0.5">{c.name}</div>
                  <div className="font-mono text-[10px] text-accent mt-1">{c.hex}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 2. TYPOGRAPHY SCALE */}
      <section className="mb-16">
        <div className="flex items-center gap-2 mb-2">
          <span className="font-label text-xs text-accent">02 //</span>
          <h3 className="font-heading text-2xl text-ink">Typography Scale</h3>
        </div>
        <p className="text-sm text-muted mb-6">
          Self-hosted Space Grotesk (700 & 500) and DM Sans (400 & 500) via <code className="text-xs font-mono bg-card px-1.5 py-0.5 rounded border border-border">@fontsource</code> packages.
        </p>

        <div className="rounded-card border border-border bg-card p-6 md:p-8 flex flex-col gap-8 shadow-sm">
          {/* Headings */}
          <div>
            <span className="font-label text-[10px] text-muted block mb-2">
              HEADINGS // SPACE GROTESK 700 • UPPERCASE • LETTER-SPACING -0.02EM • CLAMP(2.5REM, 6VW, 5REM)
            </span>
            <div className="font-heading text-ink text-4xl sm:text-5xl md:text-6xl">
              BACKEND <span className="text-accent">ENGINEER</span>
            </div>
          </div>

          <div className="h-[1px] w-full bg-border" />

          {/* Heading Formula */}
          <div>
            <span className="font-label text-[10px] text-muted block mb-2">
              HEADING FORMULA // DARK WORDS + FINAL WORD IN --ACCENT
            </span>
            <div className="flex flex-col gap-3">
              <h2 className="font-heading text-3xl sm:text-4xl text-ink">
                FEATURED <span className="text-accent">PROJECTS</span>
              </h2>
              <h2 className="font-heading text-3xl sm:text-4xl text-ink">
                TECHNICAL <span className="text-accent">SKILLS</span>
              </h2>
              <h2 className="font-heading text-3xl sm:text-4xl text-ink">
                CODING <span className="text-accent">ACTIVITY</span>
              </h2>
            </div>
          </div>

          <div className="h-[1px] w-full bg-border" />

          {/* Labels & Meta */}
          <div>
            <span className="font-label text-[10px] text-muted block mb-2">
              LABELS & METADATA // SPACE GROTESK 500 • 11-12PX • UPPERCASE • LETTER-SPACING 0.14EM
            </span>
            <div className="flex flex-wrap gap-4 items-center">
              <span className="font-label text-xs text-ink">01 // SECTION</span>
              <span className="font-label text-xs text-accent">AVAILABLE FOR INTERNSHIPS</span>
              <span className="font-label text-xs text-muted">PORTFOLIO 2026 SPECIFICATION</span>
            </div>
          </div>

          <div className="h-[1px] w-full bg-border" />

          {/* Body */}
          <div>
            <span className="font-label text-[10px] text-muted block mb-2">
              BODY TEXT // DM SANS 400 • GRAY (--MUTED) • LINE-HEIGHT 1.7
            </span>
            <p className="text-base text-muted max-w-2xl leading-[1.7]">
              I'm a third-year B.Tech CSE (AI) student at Galgotias University who learns by shipping. My work leans backend: FastAPI services, PostgreSQL with row-level security, and realtime sync. I care about the details demos skip: validation, access control and graceful failure.
            </p>
          </div>

          <div className="h-[1px] w-full bg-border" />

          {/* Ghost Word */}
          <div>
            <span className="font-label text-[10px] text-muted block mb-2">
              OUTLINED GHOST WORD // TRANSPARENT WITH 1.5PX STROKE
            </span>
            <div className="ghost-text text-5xl sm:text-6xl md:text-7xl font-black">
              ENGINEER
            </div>
          </div>
        </div>
      </section>

      {/* 3. HEADING FORMULA WITH DRAW-IN UNDERLINE */}
      <section className="mb-16">
        <div className="flex items-center gap-2 mb-2">
          <span className="font-label text-xs text-accent">03 //</span>
          <h3 className="font-heading text-2xl text-ink">Section Heading Formula</h3>
        </div>
        <p className="text-sm text-muted mb-6">
          Every section features an uppercase headline with the final word in <code className="text-xs font-mono bg-card px-1.5 py-0.5 rounded border border-border">--accent</code> and a 2px ink underline that draws in on enter with custom easing <code className="text-xs font-mono bg-card px-1.5 py-0.5 rounded border border-border">cubic-bezier(0.22, 1, 0.36, 1)</code>.
        </p>

        <div className="rounded-card border border-border bg-card p-6 md:p-8 flex flex-col gap-6 shadow-sm">
          <SectionHeading
            number="02"
            title="ABOUT ME"
            subtitle="I like the parts of software users never see."
          />

          <SectionHeading
            number="03"
            title="FEATURED PROJECTS"
            subtitle="Curated production systems, APIs, and AI integrations built for real-world resilience."
          />
        </div>
      </section>

      {/* 4. BUTTONS & PILLS */}
      <section className="mb-16">
        <div className="flex items-center gap-2 mb-2">
          <span className="font-label text-xs text-accent">04 //</span>
          <h3 className="font-heading text-2xl text-ink">Buttons & Badges</h3>
        </div>
        <p className="text-sm text-muted mb-6">
          Primary button has ink background with white text. Secondary is an outlined pill. Accent buttons use loud orange.
        </p>

        <div className="rounded-card border border-border bg-card p-6 md:p-8 flex flex-col gap-6 shadow-sm">
          {/* Action Buttons */}
          <div>
            <span className="font-label text-[10px] text-muted block mb-3">ACTION BUTTONS</span>
            <div className="flex flex-wrap items-center gap-4">
              {/* Primary button */}
              <button className="px-6 py-3.5 rounded-full bg-ink text-white hover:bg-accent transition-all font-label text-xs tracking-wider flex items-center gap-2 cursor-pointer shadow-md">
                <span>PRIMARY BUTTON</span>
                <ArrowUpRight size={15} />
              </button>

              {/* Secondary button */}
              <button className="px-6 py-3.5 rounded-full border border-ink text-ink hover:border-accent hover:text-accent transition-all font-label text-xs tracking-wider flex items-center gap-2 bg-transparent cursor-pointer">
                <span>SECONDARY PILL</span>
                <FileDown size={14} />
              </button>

              {/* Accent button */}
              <button className="px-6 py-3.5 rounded-full bg-accent text-white hover:brightness-110 transition-all font-label text-xs tracking-wider flex items-center gap-2 cursor-pointer shadow-md">
                <span>ACCENT ACTION</span>
                <Sparkles size={14} />
              </button>
            </div>
          </div>

          <div className="h-[1px] w-full bg-border" />

          {/* Badges & Pills */}
          <div>
            <span className="font-label text-[10px] text-muted block mb-3">BADGES, TAGS & STATUS PILLS</span>
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="px-3 py-1 rounded-full bg-bg border border-border text-[11px] font-label text-muted">
                FILTER PILL
              </span>
              <span className="px-3 py-1 rounded-full bg-accent text-white text-[11px] font-label font-bold">
                ACTIVE FILTER
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-accent/10 text-accent font-bold text-[10px] font-label">
                FLAGSHIP
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-bg border border-border text-[11px] font-mono text-ink">
                FastAPI
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-bg border border-border text-[11px] font-mono text-ink">
                PostgreSQL RLS
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-bg border border-border text-xs font-mono text-emerald-600 font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Available Now
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 5. SURFACE CARDS: WHITE VS INVERTED DARK */}
      <section className="mb-16">
        <div className="flex items-center gap-2 mb-2">
          <span className="font-label text-xs text-accent">05 //</span>
          <h3 className="font-heading text-2xl text-ink">Surface Cards</h3>
        </div>
        <p className="text-sm text-muted mb-6">
          Radius 20px with 1px hairline border. Below are side-by-side examples of a standard white card vs. the inverted dark card.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* White Card */}
          <motion.div
            whileHover={{ y: -4 }}
            className="rounded-card border border-border bg-card p-6 md:p-8 flex flex-col justify-between shadow-sm transition-all hover:border-accent"
          >
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-border mb-4">
                <span className="font-label text-[10px] px-2.5 py-1 rounded-full bg-accent/10 text-accent font-bold">
                  WHITE SURFACE CARD
                </span>
                <span className="font-mono text-xs text-muted">Radius 20px • 1px Border</span>
              </div>
              <h4 className="font-heading text-2xl text-ink mb-2">Prakarti Report</h4>
              <p className="text-sm font-sans text-muted leading-relaxed">
                AI pollution-reporting platform. FastAPI + Gemini vision classifies uploads into 9 categories with confidence and evidence; Supabase backend with 8 migrations, 10 RLS policies, realtime sync.
              </p>
            </div>
            <div className="pt-4 border-t border-border mt-6 flex items-center justify-between">
              <span className="font-label text-xs text-muted">STATUS</span>
              <span className="font-label text-xs text-accent font-bold">PRODUCTION READY</span>
            </div>
          </motion.div>

          {/* Inverted Dark Card */}
          <motion.div
            whileHover={{ y: -4 }}
            className="rounded-card border border-border-dark bg-[#1C1C1E] p-6 md:p-8 flex flex-col justify-between shadow-xl text-white transition-all hover:border-accent"
          >
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-border-dark mb-4">
                <span className="font-label text-[10px] px-2.5 py-1 rounded-full bg-accent text-white font-bold">
                  INVERTED DARK CARD
                </span>
                <span className="font-mono text-xs text-zinc-400">Finale Surface (--panel)</span>
              </div>
              <h4 className="font-heading text-2xl text-white mb-2">Direct Terminal</h4>
              <p className="text-sm font-sans text-zinc-400 leading-relaxed">
                The finale contact section is permanently locked to deep black (<code className="text-xs font-mono text-zinc-300">--bg-dark #0B0B0D</code>) and high-contrast panel surfaces (<code className="text-xs font-mono text-zinc-300">--panel #1C1C1E</code>).
              </p>
            </div>
            <div className="pt-4 border-t border-border-dark mt-6 flex items-center justify-between">
              <span className="font-label text-xs text-zinc-400">FINALE THEME</span>
              <span className="font-label text-xs text-accent font-bold flex items-center gap-1">
                <Check size={14} />
                PERMANENT DARK
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Styleguide Footer */}
      <div className="pt-6 border-t border-border text-center text-xs font-label text-muted">
        AYUSH GUPTA PORTFOLIO • DESIGN LANGUAGE SPECIFICATION • 2026
      </div>
    </div>
  );
};
