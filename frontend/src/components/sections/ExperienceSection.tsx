import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { portfolioContent } from '../../data/content';

export const ExperienceSection: React.FC = () => {
  const { experience } = portfolioContent;
  const viewportRef = useRef<HTMLDivElement>(null);
  const [viewportWidth, setViewportWidth] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    const element = viewportRef.current;
    if (!element) return;

    const observer = new ResizeObserver(([entry]) => {
      setViewportWidth(entry.contentRect.width);
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="section-06"
      className="relative flex min-h-[100dvh] h-auto w-full flex-col justify-center overflow-x-hidden overflow-y-visible px-6 pb-12 pt-[84px] sm:px-8 md:h-full md:min-h-screen md:overflow-hidden md:pb-8 lg:px-12"
      style={{ backgroundColor: 'var(--bg)' }}
    >
      <div className="mx-auto w-full max-w-[1440px]">
        <div className="mb-5 flex flex-col gap-5 sm:mb-6 xl:flex-row xl:items-end xl:justify-between">
          <div className="min-w-0">
            <h2
              className="section-heading m-0 font-heading text-[clamp(2rem,3.34vw,3rem)] font-extrabold uppercase leading-none tracking-[-0.04em] text-[var(--ink)]"
              style={{ fontWeight: 800 }}
            >
              WORK <span className="text-[var(--accent)]">EXPERIENCE</span>
            </h2>
            <div className="section-subtitle mt-3">
              <p className="mb-0 font-sans text-[14px] leading-relaxed text-[#71717A] dark:text-[#A1A1AA]">
                Roles I&apos;ve held, and the problems each one put in front of me.
              </p>
            </div>
          </div>
        </div>

        {experience[0] && (
          <div>
            <div className="mb-3 font-mono text-[12px] font-medium text-[#FF3B00]">
              <span className="font-bold">{experience[0].period.slice(0, 2)}</span>
              {experience[0].period.slice(2)}
            </div>

            <div className="relative mb-6 h-[1.5px] w-full bg-[#FF3B00]">
              <span className="absolute -left-0 top-1/2 h-[10px] w-[10px] -translate-y-1/2 rounded-full bg-[#FF3B00] shadow-[0_0_0_4px_rgba(255,59,0,0.2)]" />
            </div>

            <div ref={viewportRef} className="overflow-hidden">
              <motion.div
                className="flex"
                animate={{ x: 0 }}
              >
                {experience.map((item, index) => (
                  <div
                    key={`${item.company}-${item.role}`}
                    className="shrink-0 md:pr-6"
                    style={{ width: viewportWidth || '100%' }}
                  >
                    <motion.article
                      onHoverStart={() => setHoveredIndex(index)}
                      onHoverEnd={() => setHoveredIndex(null)}
                      animate={{
                        opacity: hoveredIndex !== null && hoveredIndex !== index ? 0.45 : 1,
                      }}
                      transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                      className="portfolio-card group flex h-auto min-h-0 w-full max-w-[440px] flex-col overflow-visible rounded-2xl border border-[#E4E4E7] p-5 pb-6 text-[#18181B] hover:border-[#18181B] hover:bg-[#18181B] dark:border-white/15 dark:text-white dark:hover:border-white/30 dark:hover:bg-[#09090B] sm:p-6 md:h-[340px]"
                    >
                      <div className="mb-5 md:mb-0">
                        <div className="mb-5 flex items-center justify-between gap-3">
                          <span className="font-label text-[10px] font-bold tracking-[0.12em] text-[#FF3B00]">
                            {item.badge}
                          </span>
                          <span className="font-mono text-[11px] text-[#71717A] transition-colors duration-[280ms] dark:text-[#A1A1AA] group-hover:text-[#A1A1AA]">
                            {item.period}
                          </span>
                        </div>

                        <h3 className="mb-1 font-heading text-xl font-bold leading-tight text-[#18181B] transition-colors duration-[280ms] dark:text-white group-hover:text-white">
                          {item.role}
                        </h3>
                        <p className="mb-3 text-sm font-medium text-[#52525B] transition-colors duration-[280ms] dark:text-[#D4D4D8] group-hover:text-[#A1A1AA]">
                          {item.company}
                        </p>
                        <p className="mb-4 text-[13px] leading-[1.65] text-[#52525B] transition-colors duration-[280ms] dark:text-[#A1A1AA] group-hover:text-[#A1A1AA]">
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
                          DURATION
                        </span>
                        <span className="font-mono text-xs font-bold text-[#FF3B00]">
                          {item.duration}
                        </span>
                      </div>
                    </motion.article>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
        )}
      </div>

    </section>
  );
};
