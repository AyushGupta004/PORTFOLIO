import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { portfolioContent } from '../../data/content';

const CARD_GAP = 24;

export const EducationSection: React.FC = () => {
  const { education } = portfolioContent;
  const viewportRef = useRef<HTMLDivElement>(null);
  const [viewportWidth, setViewportWidth] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const columns = viewportWidth >= 1024 ? 3 : viewportWidth >= 640 ? 2 : 1;
  const cardWidth = viewportWidth
    ? (viewportWidth - CARD_GAP * (columns - 1)) / columns
    : 0;
  const maxIndex = Math.max(0, education.length - columns);
  const trackOffset = activeIndex * (cardWidth + CARD_GAP);

  useEffect(() => {
    const element = viewportRef.current;
    if (!element) return;

    const observer = new ResizeObserver(([entry]) => {
      setViewportWidth(entry.contentRect.width);
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const moveTrack = (direction: -1 | 1) => {
    setActiveIndex((index) => Math.max(0, Math.min(maxIndex, index + direction)));
  };

  return (
    <section
      id="section-07"
      className="relative flex h-full min-h-screen w-full flex-col justify-center overflow-hidden px-6 pb-8 pt-[84px] sm:px-8 lg:px-12"
      style={{ backgroundColor: 'var(--bg)' }}
    >
      <div className="mx-auto w-full max-w-[1440px]">
        <div className="mb-5 flex flex-col gap-5 sm:mb-6 xl:flex-row xl:items-end xl:justify-between">
          <div className="min-w-0">
            <h2
              className="section-heading m-0 font-heading text-[clamp(2rem,3.34vw,3rem)] font-extrabold uppercase leading-none tracking-[-0.04em] text-[var(--ink)]"
              style={{ fontWeight: 800 }}
            >
              ACADEMIC <span className="text-[var(--accent)]">JOURNEY</span>
            </h2>
            <div className="section-subtitle mt-3">
              <p className="mb-0 font-sans text-[14px] leading-relaxed text-[#71717A] dark:text-[#A1A1AA]">
                Degrees, institutes, and academic milestones.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-start gap-2 xl:shrink-0 xl:justify-end">
            <button
              type="button"
              aria-label="Show previous academic milestone"
              onClick={() => moveTrack(-1)}
              disabled={activeIndex === 0}
              className="carousel-arrow flex h-10 w-10 cursor-pointer items-center justify-center rounded-full text-white transition-colors duration-[280ms] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF3B00] disabled:cursor-not-allowed"
            >
              <ChevronLeft size={19} aria-hidden="true" />
            </button>
            <button
              type="button"
              aria-label="Show next academic milestone"
              onClick={() => moveTrack(1)}
              disabled={activeIndex >= maxIndex}
              className="carousel-arrow flex h-10 w-10 cursor-pointer items-center justify-center rounded-full text-white transition-colors duration-[280ms] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF3B00] disabled:cursor-not-allowed"
            >
              <ChevronRight size={19} aria-hidden="true" />
            </button>
          </div>
        </div>

        <div ref={viewportRef} className="overflow-hidden">
          <div className="relative mb-6">
            <motion.div
              className="flex"
              animate={{ x: -trackOffset }}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            >
              {education.map((item) => (
                <div
                  key={`${item.institution}-${item.dateLabel}`}
                  className="shrink-0"
                  style={{ width: cardWidth || '100%', marginRight: CARD_GAP }}
                >
                  <div className="font-mono text-[12px] font-medium text-[#FF3B00]">
                    <span className="font-bold">{item.dateLabel.slice(0, 2)}</span>
                    {item.dateLabel.slice(2)}
                  </div>
                </div>
              ))}
            </motion.div>
            <div
              aria-hidden="true"
              className="absolute inset-x-0 bottom-[-18px] h-[1.5px] bg-[#FF3B00]"
            />
            <motion.div
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 left-0 flex"
              animate={{ x: -trackOffset }}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            >
              {education.map((item, index) => (
                <div
                  key={`node-${item.dateLabel}`}
                  className="relative shrink-0"
                  style={{ width: cardWidth || '100%', marginRight: CARD_GAP }}
                >
                  <span className={`absolute -bottom-[22px] left-0 h-[10px] w-[10px] rounded-full bg-[#FF3B00] ${index === 0 ? 'shadow-[0_0_0_4px_rgba(255,59,0,0.2)]' : ''}`} />
                </div>
              ))}
            </motion.div>
          </div>

          <motion.div
            className="flex"
            animate={{ x: -trackOffset }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          >
            {education.map((item, index) => (
              <div
                key={`${item.institution}-${item.dateLabel}-card`}
                className="shrink-0"
                style={{ width: cardWidth || '100%', marginRight: CARD_GAP }}
              >
                <motion.article
                  onHoverStart={() => setHoveredIndex(index)}
                  onHoverEnd={() => setHoveredIndex(null)}
                  animate={{
                    opacity: hoveredIndex !== null && hoveredIndex !== index ? 0.45 : 1,
                  }}
                  transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                  className="portfolio-card group flex h-[340px] w-full flex-col rounded-2xl border border-[#E4E4E7] p-5 text-[#18181B] hover:border-[#18181B] hover:bg-[#18181B] dark:border-white/15 dark:text-white dark:hover:border-white/30 dark:hover:bg-[#09090B] sm:p-6"
                >
                  <div>
                    <div className="mb-5 flex items-center justify-between gap-3">
                      <span className="font-label text-[10px] font-bold tracking-[0.12em] text-[#FF3B00]">
                        {item.badge}
                      </span>
                      <span className="font-mono text-[11px] text-[#71717A] transition-colors duration-[280ms] dark:text-[#A1A1AA] group-hover:text-[#A1A1AA]">
                        {item.period}
                      </span>
                    </div>

                    <h3 className="mb-1 font-heading text-xl font-bold leading-tight text-[#18181B] transition-colors duration-[280ms] dark:text-white group-hover:text-white">
                      {item.institution}
                    </h3>
                    <p className="mb-3 text-sm font-medium leading-snug text-[#52525B] transition-colors duration-[280ms] dark:text-[#D4D4D8] group-hover:text-[#A1A1AA]">
                      {item.subtitle}
                    </p>
                    <p className="mb-4 line-clamp-3 text-[13px] leading-[1.65] text-[#52525B] transition-colors duration-[280ms] dark:text-[#A1A1AA] group-hover:text-[#A1A1AA]">
                      {item.description}
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {item.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-md border border-[#E4E4E7] bg-white/70 px-2.5 py-1 font-mono text-[10px] text-[#52525B] transition-colors duration-[280ms] dark:border-white/15 dark:bg-white/[0.06] dark:text-[#D4D4D8] group-hover:border-[#3F3F46] group-hover:bg-[#27272A] group-hover:text-[#E4E4E7]"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-auto flex items-center justify-between border-t border-[#E4E4E7] pt-3 transition-colors duration-[280ms] dark:border-white/12 group-hover:border-[#3F3F46]">
                    <span className="font-label text-[10px] font-medium tracking-[0.12em] text-[#71717A] transition-colors duration-[280ms] dark:text-[#A1A1AA] group-hover:text-[#A1A1AA]">
                      GRADE
                    </span>
                    <span className="font-mono text-xs font-bold text-[#FF3B00]">
                      {item.score}
                    </span>
                  </div>
                </motion.article>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

    </section>
  );
};
