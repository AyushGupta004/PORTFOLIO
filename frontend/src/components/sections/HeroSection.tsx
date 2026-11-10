import React, { useEffect, useRef, useState } from 'react';
import { motion, useMotionValueEvent, useScroll, useTransform } from 'framer-motion';
import { ChevronRight, ArrowRight, ArrowUpRight } from 'lucide-react';
import { heroCompetencies, heroStates, portfolioContent } from '../../data/content';
import { useScrollContext } from '../../context/ScrollContext';
import { useParallax } from '../../utils/useParallax';
import { soundManager } from '../../utils/sound';

interface HeroSectionProps {
  onExploreClick?: () => void;
  onContactClick?: () => void;
}

const LAST_PANEL_PROGRESS = 1 / 8;

export const HeroSection: React.FC<HeroSectionProps> = ({ onExploreClick }) => {
  const { hero, personal } = portfolioContent;
  const { prefersReducedMotion, isDesktop, scrollProgress, trackContainerRef, scrollToSection } = useScrollContext();
  const [currentStateId, setCurrentStateId] = useState<number>(heroStates[0].id);
  const [portraitSource, setPortraitSource] = useState(() =>
    personal.assets.portrait.replace(/\.png$/i, '.webp')
  );
  const [isScrolled, setIsScrolled] = useState(() => scrollProgress.get() > 2);
  const isScrolledRef = useRef(isScrolled);
  const [isDocumentVisible, setIsDocumentVisible] = useState(
    () => typeof document === 'undefined' || !document.hidden
  );
  const [portraitUnavailable, setPortraitUnavailable] = useState(false);
  const isStacked = !isDesktop || prefersReducedMotion;
  const { scrollYProgress } = useScroll({
    target: isStacked ? undefined : trackContainerRef,
    offset: ['start start', 'end end'],
    layoutEffect: false,
  });
  const heroProgress = useTransform(
    scrollYProgress,
    [0, LAST_PANEL_PROGRESS],
    [0, 1],
    { clamp: true }
  );
  const portraitParallaxRaw = useParallax(heroProgress, 24);
  const ghostParallaxRaw = useParallax(heroProgress, 44);
  const listParallaxRaw = useParallax(heroProgress, 12);
  const portraitParallax = useTransform(portraitParallaxRaw, [-24, 24], [0, 48]);
  const ghostParallax = useTransform(ghostParallaxRaw, [-44, 44], [0, 88]);
  const listParallax = useTransform(listParallaxRaw, [-12, 12], [0, 24]);
  const activeCompetencyIndex = heroCompetencies.findIndex(
    (competency) => competency.state === currentStateId
  );

  useMotionValueEvent(scrollProgress, 'change', (latest) => {
    const scrolled = latest > 2;
    if (isScrolledRef.current !== scrolled) {
      isScrolledRef.current = scrolled;
      setIsScrolled(scrolled);
    }
  });

  useEffect(() => {
    const handleVisibilityChange = () => setIsDocumentVisible(!document.hidden);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  useEffect(() => {
    if (prefersReducedMotion || !isDocumentVisible) return;

    const timer = window.setInterval(() => {
      setCurrentStateId((stateId) => {
        const index = heroStates.findIndex((state) => state.id === stateId);
        return heroStates[(index + 1) % heroStates.length].id;
      });
    }, 4000);

    return () => window.clearInterval(timer);
  }, [isDocumentVisible, prefersReducedMotion]);

  return (
    <section
      id="section-01"
      className={`relative w-full overflow-hidden text-[var(--ink)] cursor-crosshair ${
        isStacked
          ? 'min-h-screen h-auto px-5 pt-[88px] pb-6 sm:px-8'
          : 'h-screen min-h-[560px] px-0 pt-[72px]'
      }`}
      style={{
        backgroundColor: 'var(--bg)',
      }}
    >
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute left-1/2 z-0 -translate-x-1/2 rounded-full ${
          isStacked
            ? 'top-[46%] h-[min(70vw,460px)] w-[min(70vw,460px)]'
            : 'top-[57%] h-[min(700px,72vw,80vh)] w-[min(700px,72vw,80vh)]'
        }`}
        style={{
          background: 'radial-gradient(circle, var(--hero-glow) 0%, transparent 72%)',
          filter: 'blur(24px)',
          transform: 'translate(-50%, -50%)',
        }}
      />

      <motion.div
        aria-hidden="true"
        className={`hero-watermark pointer-events-none absolute left-1/2 z-[1] h-[1em] w-full whitespace-nowrap font-heading font-bold leading-none tracking-[-0.06em] ${
          isStacked
            ? 'top-[52%] overflow-hidden text-center text-[30vw]'
            : 'top-[14%] text-center text-[clamp(8rem,13vw,18rem)]'
        }`}
        style={{
          fontWeight: 700,
          x: '-50%',
          y: !isStacked ? ghostParallax : 0,
        }}
      >
        {heroStates.map((state) => {
          const isCurrent = state.id === currentStateId;
          return (
            <motion.span
              key={state.id}
              className="absolute inset-0 flex w-full justify-center whitespace-nowrap"
              aria-hidden={!isCurrent}
              initial={{
                opacity: isCurrent ? 1 : 0,
                filter: isCurrent ? 'blur(0px)' : 'blur(8px)',
              }}
              animate={{
                opacity: isCurrent ? 1 : 0,
                filter: isCurrent ? 'blur(0px)' : 'blur(8px)',
              }}
              transition={{
                duration: prefersReducedMotion ? 0 : 0.7,
                ease: 'easeInOut',
              }}
            >
              {state.line2}
            </motion.span>
          );
        })}
      </motion.div>

      <div
        className={
          isStacked
            ? 'relative z-30 flex w-full max-w-2xl flex-col items-start'
            : 'absolute bottom-[5.5vh] left-[5.5vw] z-30 w-[30vw] max-w-[30vw]'
        }
      >
        <h1
          className="hero-role-title relative m-0 h-[1.9em] w-full whitespace-nowrap font-heading text-[clamp(2.25rem,3.9vw,4.75rem)] font-bold uppercase leading-[0.95] tracking-[-0.02em]"
          style={{
            fontSize: isStacked ? 'clamp(2.4rem, 10vw, 4.75rem)' : undefined,
            fontWeight: 700,
          }}
        >
          {heroStates.map((state) => {
            const isCurrent = state.id === currentStateId;
            return (
              <motion.span
                key={state.id}
                className="absolute inset-0 flex w-full flex-col"
                aria-hidden={!isCurrent}
                initial={isCurrent
                  ? { opacity: 1, filter: 'blur(0px)', y: 0 }
                  : { opacity: 0, filter: 'blur(12px)', y: 8 }}
                animate={{
                  opacity: isCurrent ? 1 : 0,
                  filter: isCurrent ? 'blur(0px)' : 'blur(12px)',
                  y: isCurrent ? 0 : -8,
                }}
                transition={{
                  opacity: {
                    duration: prefersReducedMotion ? 0 : 0.65,
                    ease: [0.16, 1, 0.3, 1],
                  },
                  filter: {
                    duration: prefersReducedMotion ? 0 : 0.65,
                    ease: [0.16, 1, 0.3, 1],
                  },
                  y: {
                    duration: prefersReducedMotion ? 0 : 0.65,
                    ease: [0.16, 1, 0.3, 1],
                  },
                }}
                style={{ pointerEvents: isCurrent ? 'auto' : 'none' }}
              >
                <span className="hero-role-line">{state.line1}</span>
                <motion.span
                  className="hero-role-line"
                  initial={{ color: '#FF3B00' }}
                  animate={{
                    color: isCurrent
                      ? ['#FF3B00', '#FF3B00', '#18181B']
                      : '#18181B',
                  }}
                  transition={{
                    color: {
                      duration: prefersReducedMotion ? 0 : 0.7,
                      times: [0, 0.4 / 0.7, 1],
                      ease: [0.16, 1, 0.3, 1],
                    },
                  }}
                >
                  {state.line2}
                </motion.span>
              </motion.span>
            );
          })}
        </h1>

        <p
          className={`mt-3 max-w-[38rem] font-sans text-[1.05rem] leading-relaxed text-[var(--hero-copy)] ${
            isStacked ? 'text-[0.98rem]' : ''
          }`}
        >
          {hero.tagline}
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => {
              soundManager.playPop();
              onExploreClick?.();
            }}
            style={{ fontWeight: 700 }}
            className="group inline-flex min-h-11 items-center gap-3 rounded-full bg-[#18181B] px-5 py-3 font-heading text-[11px] font-bold uppercase tracking-[0.08em] text-white transition-[transform,box-shadow] duration-[220ms] ease-[ease] hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(24,24,27,0.18)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[var(--accent)]"
          >
            <span>VIEW MY WORK</span>
            <ArrowRight size={14} aria-hidden="true" />
          </button>
          <a
            href={personal.assets.resume}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => soundManager.playPop()}
            style={{ fontWeight: 700 }}
            className="group inline-flex min-h-11 items-center gap-3 rounded-full border border-[var(--ink)] px-5 py-3 font-heading text-[11px] font-bold uppercase tracking-[0.08em] text-[#18181B] transition-[transform,background-color,border-color] duration-[220ms] ease-[ease] hover:-translate-y-px hover:border-[#FF3B00] hover:bg-[rgba(255,59,0,0.08)] hover:text-[#18181B] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[var(--accent)]"
          >
            <span>RESUME</span>
            <ArrowUpRight size={14} aria-hidden="true" />
          </a>
        </div>
      </div>

      <motion.div
        className={
          isStacked
            ? 'relative z-30 no-scrollbar mt-6 flex w-[calc(100vw-2.5rem)] max-w-full gap-2 overflow-x-auto overscroll-x-contain pb-2 sm:w-[calc(100vw-4rem)]'
            : 'absolute bottom-[5.5vh] right-[5.5vw] z-30 flex w-[34vw] flex-col items-end gap-0.5 text-right'
        }
        style={{ y: !isStacked ? listParallax : 0 }}
      >
        {heroCompetencies.map(({ label }, index) => {
          const isActive = index === activeCompetencyIndex;
          return (
            <button
              key={label}
              type="button"
              data-competency-index={index}
              aria-pressed={isActive}
              onClick={() => scrollToSection('skills')}
              style={{ fontWeight: 700 }}
              className={`shrink-0 bg-transparent p-0 font-heading font-bold uppercase leading-[1.35] tracking-[-0.01em] transition-colors duration-200 ease-in-out hover:text-[#FF3B00] focus-visible:rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent)] ${
                isStacked
                  ? 'rounded-full border border-[var(--border)] px-3 py-2 text-[10px] tracking-[0.02em]'
                  : 'text-[clamp(1.1rem,1.9vw,2.25rem)]'
              } ${isActive ? 'text-[var(--ink)]' : 'text-[var(--muted)]'}`}
            >
              {label}
            </button>
          );
        })}
      </motion.div>

      <motion.figure
        data-bleed
        className={`pointer-events-none z-10 m-0 flex justify-center [mix-blend-mode:multiply] ${
          isStacked
            ? 'relative -mx-5 mt-3 h-[55vh] min-h-[320px] items-end overflow-hidden sm:-mx-8'
            : 'absolute inset-x-0 bottom-0 h-[85vh] items-end overflow-hidden'
        }`}
      >
        {portraitUnavailable ? (
          <div
            aria-hidden="true"
            className={`relative flex h-full items-end justify-center text-[var(--muted)] ${
              isStacked ? 'w-[70vw]' : 'w-[min(44vw,680px)]'
            }`}
          >
            <svg viewBox="0 0 360 620" className="h-full w-full" fill="currentColor">
              <ellipse cx="180" cy="145" rx="76" ry="98" />
              <path d="M37 620c8-160 54-274 143-274s135 114 143 274H37Z" />
            </svg>
            <span className="absolute bottom-4 font-label text-[10px] tracking-[0.16em]">
              // TODO(owner)
            </span>
          </div>
        ) : (
          <motion.img
            src={portraitSource}
            alt={personal.name}
            onError={() => {
              if (portraitSource !== personal.assets.portrait) {
                setPortraitSource(personal.assets.portrait);
              } else {
                setPortraitUnavailable(true);
              }
            }}
            style={{ y: !isStacked ? portraitParallax : 0 }}
            className={`h-full w-auto max-w-none object-contain object-bottom grayscale contrast-[1.15] ${
              isStacked ? 'max-w-[100vw]' : 'h-[85vh] max-h-none -mb-[8vh]'
            }`}
          />
        )}
      </motion.figure>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-20"
        style={{
          backgroundImage:
            'radial-gradient(rgba(24, 24, 27, 0.06) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />

      {!isStacked && (
        <div
          aria-hidden="true"
          className={`absolute right-[5.5vw] top-[43%] z-20 flex items-center gap-4 font-heading text-[11px] font-semibold tracking-[0.2em] text-[var(--ink)] transition-opacity duration-500 ${
            isScrolled ? 'pointer-events-none opacity-0' : 'opacity-100'
          }`}
        >
          <span>SCROLL</span>
          <span className="h-px w-[90px] bg-[var(--ink)]" />
          <ChevronRight size={15} strokeWidth={1.5} />
        </div>
      )}
    </section>
  );
};

export default HeroSection;
