import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight } from 'lucide-react';
import { useScrollContext } from '../context/ScrollContext';
import { soundManager } from '../utils/sound';

export const NavigationMenu: React.FC = () => {
  const {
    sections,
    activeIndex,
    isMenuOpen,
    setIsMenuOpen,
    scrollToSection,
  } = useScrollContext();

  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMenuOpen) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMenuOpen, setIsMenuOpen]);

  useEffect(() => {
    if (isMenuOpen && menuRef.current) {
      const firstFocusable = menuRef.current.querySelector('button, a') as HTMLElement;
      firstFocusable?.focus();
    }
  }, [isMenuOpen]);

  const handleSelect = (idx: number) => {
    soundManager.playPop();
    setIsMenuOpen(false);
    scrollToSection(idx);
  };

  return (
    <AnimatePresence>
      {isMenuOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 bg-[var(--bg)]/90 backdrop-blur-sm"
          aria-hidden="true"
        >
          <motion.div
            ref={menuRef}
            role="dialog"
            aria-modal="true"
            aria-label="Navigation Menu"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full h-full overflow-y-auto px-4 sm:px-6 md:px-10 lg:px-12 pt-16 pb-8"
          >
            <div className="mx-auto max-w-7xl flex flex-col h-full">
              <div className="flex items-center justify-between pb-4 border-b border-[var(--border)]">
                <div className="flex items-center gap-2 sm:gap-3">
                  <span className="font-label text-[10px] sm:text-[11px] text-[var(--accent)]">INDEX</span>
                  <span className="text-[var(--muted)] text-[10px] sm:text-[11px] tracking-[0.28em]">//</span>
                  <span className="font-label text-[10px] sm:text-[11px] text-[var(--ink)]">NAVIGATION</span>
                </div>

                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--card)] px-3 py-1.5 text-[10px] sm:text-[11px] font-label text-[var(--ink)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
                  aria-label="Close menu"
                >
                  <X size={14} />
                  <span>CLOSE</span>
                </button>
              </div>

              <nav className="flex-1 py-8 sm:py-10 md:py-12" aria-label="Section links">
                <ul className="space-y-2 sm:space-y-3">
                  {sections.map((sec, idx) => {
                    const isActive = activeIndex === idx;
                    return (
                      <li key={sec.id}>
                        <button
                          type="button"
                          onClick={() => handleSelect(idx)}
                          aria-label={`Navigate to section ${sec.number} ${sec.label}`}
                          aria-current={isActive ? 'location' : undefined}
                          className={`group w-full flex items-center justify-between gap-3 rounded-[20px] border px-3 sm:px-4 py-2 sm:py-3 text-left transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-[var(--accent)] ${
                            isActive
                              ? 'border-[var(--accent)] bg-[var(--accent)]/8'
                              : 'border-transparent bg-transparent hover:border-[var(--border)] hover:bg-[var(--card)]'
                          }`}
                        >
                          <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                            <span className="font-label text-[10px] sm:text-[11px] text-[var(--accent)] tracking-[0.24em]">
                              {sec.number}
                            </span>
                            <span className="font-heading text-[clamp(2rem,5vw,6rem)] leading-none uppercase tracking-[-0.06em] text-[var(--ink)] transition-transform group-hover:translate-x-1">
                              {sec.label}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 sm:gap-3 text-[var(--muted)] group-hover:text-[var(--accent)]">
                            {isActive && (
                              <span className="hidden sm:inline-flex rounded-full border border-[var(--accent)] bg-[var(--accent)]/8 px-2 py-0.5 font-label text-[9px] text-[var(--accent)]">
                                ACTIVE
                              </span>
                            )}
                            <ArrowRight size={18} className={isActive ? 'text-[var(--accent)]' : ''} />
                          </div>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </nav>

              <div className="flex items-center justify-between border-t border-[var(--border)] pt-4 text-[10px] sm:text-[11px] font-label tracking-[0.18em] text-[var(--muted)]">
                <span>AYUSH GUPTA // 2026</span>
                <span className="text-[var(--accent)]">
                  {String(activeIndex + 1).padStart(2, '0')} / 09
                </span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
