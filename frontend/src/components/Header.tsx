import React, { useEffect, useRef, useState } from 'react';
import { motion, useMotionValueEvent, useTransform } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { useScrollContext } from '../context/ScrollContext';
import { soundManager } from '../utils/sound';

interface HeaderProps {
  onLogoClick?: () => void;
  className?: string;
}

export const Header: React.FC<HeaderProps> = ({ onLogoClick, className = '' }) => {
  const { effectiveTheme, toggleTheme } = useTheme();
  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => soundManager.isEnabled());
  const { scrollProgress, activeIndex, isMenuOpen, toggleMenu, scrollToSection } = useScrollContext();
  const [isCompact, setIsCompact] = useState(() => scrollProgress.get() > 2);
  const compactRef = useRef(isCompact);
  const cursorRef = useRef<HTMLSpanElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const progressScale = useTransform(scrollProgress, [0, 100], [0, 1]);
  const isDarkFinale = activeIndex === 8;

  useEffect(() => {
    let frame = 0;
    let clientX = -100;
    let clientY = -100;
    const updateCursorPosition = (event: PointerEvent) => {
      clientX = event.clientX;
      clientY = event.clientY;
      if (frame !== 0) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        cursorRef.current?.style.setProperty(
          'transform',
          `translate3d(${clientX}px, ${clientY}px, 0) translate(-50%, -50%)`,
        );
      });
    };
    window.addEventListener('pointermove', updateCursorPosition);
    return () => {
      window.removeEventListener('pointermove', updateCursorPosition);
      if (frame !== 0) window.cancelAnimationFrame(frame);
    };
  }, []);

  useMotionValueEvent(scrollProgress, 'change', (latest) => {
    progressBarRef.current?.setAttribute('aria-valuenow', String(Math.round(latest)));
    const compact = latest > 2;
    if (compactRef.current !== compact) {
      compactRef.current = compact;
      setIsCompact(compact);
    }
  });

  const handleLogoClick = () => {
    soundManager.playPop();
    onLogoClick?.();
    scrollToSection(0);
  };

  const handleSoundToggle = () => setSoundEnabled(soundManager.toggle());
  const controlClass =
    `cursor-crosshair whitespace-nowrap bg-transparent p-0 font-heading text-[11px] font-semibold uppercase tracking-[0.12em] ${
      isDarkFinale ? 'text-white' : 'text-[var(--ink)]'
    } transition-colors duration-[280ms] hover:text-[var(--accent)] focus-visible:rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent)] sm:text-[13px]`;

  return (
    <>
      <span ref={cursorRef} className={`custom-crosshair${isDarkFinale ? ' custom-crosshair--light' : ''}`} aria-hidden="true">
        +
      </span>
      <div
        ref={progressBarRef}
        className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[3px] bg-transparent"
        role="progressbar"
        aria-valuenow={Math.round(scrollProgress.get())}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Scroll progress"
      >
        <motion.div
          className="h-full origin-left bg-[var(--accent)]"
          style={{ scaleX: progressScale }}
        />
      </div>

      <header
        className={`fixed inset-x-0 top-0 z-50 flex items-center px-4 transition-[height] duration-300 sm:px-8 lg:px-[5.5vw] ${
          isCompact ? 'h-[56px]' : 'h-[64px] sm:h-[68px]'
        } ${className}`}
      >
        <div className="mx-auto flex w-full max-w-[1800px] items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleLogoClick}
            className="brand-logo cursor-crosshair flex shrink-0 items-center gap-0.5 rounded-sm bg-transparent p-0 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent)]"
            aria-label="Ayush Gupta Portfolio Home"
          >
            <span className="brand-logo-short font-heading text-[36px] font-bold leading-none tracking-[-0.06em] text-[#7C3AED]">
              AG
            </span>
            <span className="brand-logo-expanded font-heading text-[36px] font-bold leading-none tracking-[-0.06em] text-[#7C3AED]" aria-hidden="true">
              AYUSH GUPTA
            </span>
            <span className="font-heading text-[36px] font-bold leading-none tracking-[-0.06em] text-[#FF3B00]">
              .
            </span>
          </button>

          <nav
            aria-label="Page controls"
            className="flex items-center gap-2 sm:gap-4 lg:gap-8"
          >
            <button
              type="button"
              onClick={() => {
                soundManager.playPop();
                toggleTheme();
              }}
              style={{ fontWeight: 600 }}
              className={controlClass}
              aria-label={`Toggle color theme. Current theme is ${effectiveTheme}`}
              title={`Switch to ${effectiveTheme === 'light' ? 'dark' : 'light'} mode`}
            >
              <span className="inline-flex items-center gap-2">
                <svg
                  aria-hidden="true"
                  viewBox="0 0 16 16"
                  className="h-[13px] w-[13px]"
                >
                  <circle cx="8" cy="8" r="6.25" fill="none" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M8 1.75a6.25 6.25 0 0 0 0 12.5V1.75Z" fill="currentColor" />
                </svg>
                THEME
              </span>
            </button>

            <button
              type="button"
              onClick={handleSoundToggle}
              aria-pressed={soundEnabled}
              aria-label={`UI Sound effects ${soundEnabled ? 'enabled. Click to mute.' : 'disabled. Click to enable.'}`}
              title={soundEnabled ? 'Mute Sound Effects' : 'Enable UI Audio Feedback'}
              style={{ fontWeight: 600 }}
              className={`${controlClass} ${soundEnabled && !isDarkFinale ? 'text-[var(--accent)]' : ''}`}
            >
              SOUND
            </button>

            <a
              href="https://github.com/AyushGupta004"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => soundManager.playPop()}
              style={{ fontWeight: 600 }}
              className={controlClass}
              aria-label="Ayush Gupta GitHub profile"
              title="Developer Profiles & Code"
            >
              SOCIAL
            </a>

            <button
              type="button"
              id="header-menu-button"
              onClick={() => {
                soundManager.playPop();
                toggleMenu();
              }}
              style={{ fontWeight: 600 }}
              aria-expanded={isMenuOpen}
              className={controlClass}
              aria-label="Navigation menu"
              title="Section Index"
            >
              MENU
            </button>
          </nav>
        </div>
      </header>
    </>
  );
};
