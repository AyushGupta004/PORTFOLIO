import React, { useRef, useState, useEffect, useCallback } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { useScrollContext, SECTIONS } from '../context/ScrollContext';
import { HeroSection } from './sections/HeroSection';
import { AboutSection } from './sections/AboutSection';
import { ProjectsSection } from './sections/ProjectsSection';
import { SkillsSection } from './sections/SkillsSection';
import { CodingActivitySection } from './sections/CodingActivitySection';
import { ExperienceSection } from './sections/ExperienceSection';
import { EducationSection } from './sections/EducationSection';
import { CredentialsSection } from './sections/CredentialsSection';
import { ContactSection } from './sections/ContactSection';

export const HorizontalScrollContainer: React.FC = () => {
  const {
    activeIndex,
    scrollToSection,
    setScrollState,
    isDesktop,
    prefersReducedMotion,
    trackContainerRef,
  } = useScrollContext();

  const trackRef = useRef<HTMLDivElement>(null);
  const [trackScrollableWidth, setTrackScrollableWidth] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      return (SECTIONS.length - 1) * window.innerWidth;
    }
    return (SECTIONS.length - 1) * 1366;
  });
  const [viewportHeight, setViewportHeight] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      return window.innerHeight;
    }
    return 768;
  });

  // Dynamic track measurement with ResizeObserver + document.fonts.ready
  const measureTrack = useCallback(() => {
    if (typeof window === 'undefined') return;
    const vpWidth = window.innerWidth;
    const vpHeight = window.innerHeight;
    setViewportHeight(vpHeight);

    if (trackRef.current) {
      const scrollWidth = trackRef.current.scrollWidth;
      const maxScroll = Math.max(0, scrollWidth - vpWidth);
      setTrackScrollableWidth(maxScroll);
    } else {
      setTrackScrollableWidth((SECTIONS.length - 1) * vpWidth);
    }
  }, []);

  useEffect(() => {
    let disposed = false;
    measureTrack();

    const ro = new ResizeObserver(() => {
      measureTrack();
    });

    if (trackRef.current) {
      ro.observe(trackRef.current);
    }

    if (document.fonts) {
      document.fonts.ready.then(() => {
        if (!disposed) measureTrack();
      });
    }

    window.addEventListener('resize', measureTrack);

    return () => {
      disposed = true;
      ro.disconnect();
      window.removeEventListener('resize', measureTrack);
    };
  }, [measureTrack]);

  // Framer Motion native vertical scroll tracker
  // Pinned desktop mode: target is the tall outer wrapper
  const { scrollYProgress } = useScroll({
    target: isDesktop && !prefersReducedMotion ? trackContainerRef : undefined,
    offset: ['start start', 'end end'],
    layoutEffect: false,
  });

  // Light spring smoothing: fast, responsive, zero wheel hijacking
  const smoothProgress = useSpring(scrollYProgress, {
    damping: 30,
    stiffness: 900,
    mass: 0.08,
    restDelta: 0.001,
  });

  // Map smoothProgress from [0, 1] to horizontal translation on track
  const x = useTransform(
    smoothProgress,
    [0, 1],
    ['0px', `-${trackScrollableWidth}px`]
  );

  // Sync scrollYProgress to active panel index and percentage
  useEffect(() => {
    const usePinned = isDesktop && !prefersReducedMotion;
    if (!usePinned) return;

    const unsubscribe = scrollYProgress.on('change', (latest) => {
      const clamped = Math.max(0, Math.min(1, latest));
      const index = Math.round(clamped * (SECTIONS.length - 1));
      const progressPct = clamped * 100;
      setScrollState(index, progressPct);
    });

    return () => unsubscribe();
  }, [scrollYProgress, isDesktop, prefersReducedMotion, setScrollState]);

  // Keyboard accessibility: tabbing into an off-screen panel scrolls it into view
  useEffect(() => {
    const handleFocusIn = (e: FocusEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;

      const panelEl = target.closest('[data-panel-index]') as HTMLElement;
      if (panelEl) {
        const panelIdx = parseInt(panelEl.getAttribute('data-panel-index') || '0', 10);
        if (panelIdx !== activeIndex) {
          scrollToSection(panelIdx, 'smooth');
        }
      }
    };

    window.addEventListener('focusin', handleFocusIn);
    return () => window.removeEventListener('focusin', handleFocusIn);
  }, [activeIndex, scrollToSection]);

  // Mobile / Vertical Stack scroll listener
  useEffect(() => {
    const usePinned = isDesktop && !prefersReducedMotion;
    if (usePinned) return;

    let frame = 0;
    const updateMobileScroll = () => {
      frame = 0;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (window.scrollY / docHeight) * 100 : 0;

      // Identify which section is in view
      let currentIdx = 0;
      for (let i = 0; i < SECTIONS.length; i++) {
        const el = document.getElementById(SECTIONS[i].id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= window.innerHeight * 0.45 && rect.bottom >= window.innerHeight * 0.2) {
            currentIdx = i;
            break;
          }
        }
      }

      setScrollState(currentIdx, progress);
    };

    const handleMobileScroll = () => {
      if (frame === 0) frame = window.requestAnimationFrame(updateMobileScroll);
    };

    window.addEventListener('scroll', handleMobileScroll, { passive: true });
    handleMobileScroll();
    return () => {
      window.removeEventListener('scroll', handleMobileScroll);
      if (frame !== 0) window.cancelAnimationFrame(frame);
    };
  }, [isDesktop, prefersReducedMotion, setScrollState]);

  const useHorizontalPinned = isDesktop && !prefersReducedMotion;

  // Outer tall wrapper height = (track scrollable width + viewport height)
  const totalWrapperHeight = trackScrollableWidth > 0
    ? trackScrollableWidth + viewportHeight
    : SECTIONS.length * viewportHeight;

  return (
    <div className="relative w-full bg-[var(--bg)] text-[var(--ink)]">
      {useHorizontalPinned ? (
        /* Desktop Pinned Horizontal Track Mode */
        <div
          ref={trackContainerRef}
          style={{ height: `${totalWrapperHeight}px` }}
          className="relative w-full"
        >
          {/* Sticky Viewport */}
          <div className="sticky top-0 h-screen w-screen overflow-hidden">
            {/* Horizontal Track */}
            <motion.div
              ref={trackRef}
              style={{ x }}
              className="flex flex-row h-full w-[900vw] will-change-transform"
            >
              {/* 01 Home */}
              <div data-panel-index={0} className="w-[100vw] h-full flex-shrink-0 overflow-hidden">
                <HeroSection
                  onExploreClick={() => scrollToSection(2)}
                  onContactClick={() => scrollToSection(8)}
                />
              </div>

              {/* 02 About */}
              <div data-panel-index={1} className="w-[100vw] h-full flex-shrink-0 overflow-hidden">
                <AboutSection />
              </div>

              {/* 03 Featured Projects */}
              <div data-panel-index={2} className="w-[100vw] h-full flex-shrink-0 overflow-hidden">
                <ProjectsSection />
              </div>

              {/* 04 Skills */}
              <div data-panel-index={3} className="w-[100vw] h-full flex-shrink-0 overflow-hidden">
                <SkillsSection />
              </div>

              {/* 05 Coding Activity */}
              <div data-panel-index={4} className="w-[100vw] h-full flex-shrink-0 overflow-hidden">
                <CodingActivitySection />
              </div>

              {/* 06 Experience */}
              <div data-panel-index={5} className="w-[100vw] h-full flex-shrink-0 overflow-hidden">
                <ExperienceSection />
              </div>

              {/* 07 Education */}
              <div data-panel-index={6} className="w-[100vw] h-full flex-shrink-0 overflow-hidden">
                <EducationSection />
              </div>

              {/* 08 Credentials */}
              <div data-panel-index={7} className="w-[100vw] h-full flex-shrink-0 overflow-hidden">
                <CredentialsSection />
              </div>

              {/* 09 Contact (Dark finale) */}
              <div data-panel-index={8} className="w-[100vw] h-full flex-shrink-0 overflow-hidden bg-[#0B0B0D]">
                <ContactSection />
              </div>
            </motion.div>
          </div>
        </div>
      ) : (
        /* Mobile / Reduced Motion Vertical Stack Mode */
        <div className="flex flex-col w-full">
          <div data-panel-index={0}>
            <HeroSection
              onExploreClick={() => scrollToSection(2)}
              onContactClick={() => scrollToSection(8)}
            />
          </div>
          <div data-panel-index={1}>
            <AboutSection />
          </div>
          <div data-panel-index={2}>
            <ProjectsSection />
          </div>
          <div data-panel-index={3}>
            <SkillsSection />
          </div>
          <div data-panel-index={4}>
            <CodingActivitySection />
          </div>
          <div data-panel-index={5}>
            <ExperienceSection />
          </div>
          <div data-panel-index={6}>
            <EducationSection />
          </div>
          <div data-panel-index={7}>
            <CredentialsSection />
          </div>
          <div data-panel-index={8}>
            <ContactSection />
          </div>
        </div>
      )}
    </div>
  );
};

export default HorizontalScrollContainer;
