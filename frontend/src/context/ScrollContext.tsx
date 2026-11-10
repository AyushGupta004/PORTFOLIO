import React, { createContext, useContext, useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { MotionValue, useMotionValue } from 'framer-motion';

export interface SectionMeta {
  index: number;
  id: string; // DOM id 'section-01'
  hash: string; // URL hash 'home'
  number: string; // '01'
  label: string; // 'Home'
  title: string; // 'AYUSH GUPTA'
}

export const SECTIONS: SectionMeta[] = [
  { index: 0, id: 'section-01', hash: 'home', number: '01', label: 'Home', title: 'AYUSH GUPTA' },
  { index: 1, id: 'section-02', hash: 'about', number: '02', label: 'About', title: 'ABOUT ME' },
  { index: 2, id: 'section-03', hash: 'projects', number: '03', label: 'Projects', title: 'FEATURED PROJECTS' },
  { index: 3, id: 'section-04', hash: 'skills', number: '04', label: 'Skills', title: 'TECHNICAL SKILLS' },
  { index: 4, id: 'section-05', hash: 'coding', number: '05', label: 'Coding', title: 'CODING ACTIVITY' },
  { index: 5, id: 'section-06', hash: 'experience', number: '06', label: 'Experience', title: 'EXPERIENCE' },
  { index: 6, id: 'section-07', hash: 'education', number: '07', label: 'Education', title: 'EDUCATION' },
  { index: 7, id: 'section-08', hash: 'credentials', number: '08', label: 'Credentials', title: 'CREDENTIALS' },
  { index: 8, id: 'section-09', hash: 'contact', number: '09', label: 'Contact', title: 'GET IN TOUCH' },
];

interface ScrollContextValue {
  sections: SectionMeta[];
  activeIndex: number;
  activeSection: SectionMeta;
  scrollProgress: MotionValue<number>; // 0 to 100
  isMenuOpen: boolean;
  setIsMenuOpen: (open: boolean) => void;
  toggleMenu: () => void;
  scrollToSection: (target: number | string, behavior?: ScrollBehavior) => void;
  isDesktop: boolean;
  prefersReducedMotion: boolean;
  setScrollState: (index: number, progress: number) => void;
  trackContainerRef: React.RefObject<HTMLDivElement>;
}

const ScrollContext = createContext<ScrollContextValue | undefined>(undefined);

export const ScrollProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const scrollProgress = useMotionValue(0);
  const activeIndexRef = useRef(0);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isDesktop, setIsDesktop] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth >= 768;
    }
    return true;
  });
  const [prefersReducedMotion, setPrefersReducedMotion] = useState<boolean>(false);
  const trackContainerRef = useRef<HTMLDivElement>(null);

  // Monitor viewport and prefers-reduced-motion
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const checkViewport = () => {
      setIsDesktop(window.innerWidth >= 768);
    };

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleMotionChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    window.addEventListener('resize', checkViewport);
    mediaQuery.addEventListener('change', handleMotionChange);

    return () => {
      window.removeEventListener('resize', checkViewport);
      mediaQuery.removeEventListener('change', handleMotionChange);
    };
  }, []);

  const syncActiveIndex = useCallback((index: number) => {
    if (activeIndexRef.current === index) return;
    activeIndexRef.current = index;
    setActiveIndex(index);
    const section = SECTIONS[index];
    if (section && typeof window !== 'undefined') {
      const expectedHash = `#${section.hash}`;
      if (window.location.hash !== expectedHash) {
        window.history.replaceState(null, '', expectedHash);
      }
    }
  }, []);

  const setScrollState = useCallback((index: number, progress: number) => {
    scrollProgress.set(progress);
    syncActiveIndex(index);
  }, [scrollProgress, syncActiveIndex]);

  // Smooth scroll to a section by index or hash/id
  const scrollToSection = useCallback(
    (target: number | string, behavior: ScrollBehavior = 'smooth') => {
      let targetIndex = 0;
      if (typeof target === 'number') {
        targetIndex = Math.max(0, Math.min(SECTIONS.length - 1, target));
      } else {
        const cleanTarget = target.replace(/^#/, '');
        const found = SECTIONS.findIndex(
          (s) => s.hash === cleanTarget || s.id === cleanTarget
        );
        if (found !== -1) targetIndex = found;
      }

      const sec = SECTIONS[targetIndex];
      if (!sec) return;

      if (typeof window !== 'undefined') {
        window.history.replaceState(null, '', `#${sec.hash}`);
      }
      activeIndexRef.current = targetIndex;
      setActiveIndex(targetIndex);

      const usePinned = isDesktop && !prefersReducedMotion;
      if (usePinned && trackContainerRef.current) {
        const scrollHeight = trackContainerRef.current.scrollHeight - window.innerHeight;
        const targetScrollY = (targetIndex / (SECTIONS.length - 1)) * scrollHeight;
        window.scrollTo({
          top: targetScrollY,
          behavior,
        });
      } else {
        const el = document.getElementById(sec.id);
        if (el) {
          el.scrollIntoView({ behavior, block: 'start' });
        }
      }
    },
    [isDesktop, prefersReducedMotion]
  );

  // Sync hash on load and on hashchange
  useEffect(() => {
    if (typeof window === 'undefined') return;

    let hashTimeout = 0;
    const handleHash = () => {
      const currentHash = window.location.hash.replace(/^#/, '');
      if (currentHash) {
        // Delay slightly on initial mount to allow fonts and layout measurement
        window.clearTimeout(hashTimeout);
        hashTimeout = window.setTimeout(() => {
          scrollToSection(currentHash, 'smooth');
        }, 150);
      } else {
        // Default to #home if no hash present
        window.history.replaceState(null, '', `#${SECTIONS[0].hash}`);
      }
    };

    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => {
      window.clearTimeout(hashTimeout);
      window.removeEventListener('hashchange', handleHash);
    };
  }, [scrollToSection]);

  const toggleMenu = useCallback(() => {
    setIsMenuOpen((prev) => !prev);
  }, []);

  const activeSection = SECTIONS[activeIndex] || SECTIONS[0];
  const value = useMemo(() => ({
    sections: SECTIONS,
    activeIndex,
    activeSection,
    scrollProgress,
    isMenuOpen,
    setIsMenuOpen,
    toggleMenu,
    scrollToSection,
    isDesktop,
    prefersReducedMotion,
    setScrollState,
    trackContainerRef,
  }), [
    activeIndex,
    activeSection,
    scrollProgress,
    isMenuOpen,
    toggleMenu,
    scrollToSection,
    isDesktop,
    prefersReducedMotion,
    setScrollState,
  ]);

  return (
    <ScrollContext.Provider value={value}>
      {children}
    </ScrollContext.Provider>
  );
};

export const useScrollContext = () => {
  const context = useContext(ScrollContext);
  if (!context) {
    throw new Error('useScrollContext must be used within a ScrollProvider');
  }
  return context;
};
