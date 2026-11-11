import React from 'react';
import { motion } from 'framer-motion';
import { portfolioContent } from '../../data/content';
import { BrandIcon } from '../BrandIcon';
import { soundManager } from '../../utils/sound';

const skillBrandColors: Record<string, string> = {
  Python: '#3776AB',
  JavaScript: '#EAB308',
  TypeScript: '#3178C6',
  SQL: '#0284C7',
  'C++': '#00599C',
  React: '#06B6D4',
  'Next.js': '#18181B',
  'Tailwind CSS': '#06B6D4',
  Vite: '#646CFF',
  'HTML/CSS': '#E34F26',
  FastAPI: '#009688',
  'Node.js': '#339933',
  'Express.js': '#4B5563',
  'REST APIs': '#FF3B00',
  WebSockets: '#D97706',
  PostgreSQL: '#336791',
  Supabase: '#10B981',
  MongoDB: '#16A34A',
  Redis: '#DC2626',
  'Gemini API': '#4285F4',
  Groq: '#F55036',
  PyTorch: '#EE4C2C',
  LangGraph: '#0D9488',
  EasyOCR: '#EA580C',
  Docker: '#2496ED',
  AWS: '#FF9900',
  Vercel: '#000000',
  'Git/GitHub': '#F05032',
  Linux: '#CA8A04',
  JWT: '#9333EA',
  'Row Level Security': '#059669',
  pytest: '#0284C7',
  Postman: '#FF6C37',
  Git: '#F05032',
  Claude: '#D97757',
  Gemini: '#4285F4',
  Cursor: '#2563EB',
  Ollama: '#EA580C',
};

const skillBrandDarkColors: Record<string, string> = {
  'C++': '#60A5FA',
  'Next.js': '#FFFFFF',
  'Express.js': '#E4E4E7',
  PostgreSQL: '#60A5FA',
  Vercel: '#FFFFFF',
  JWT: '#C084FC',
  Cursor: '#60A5FA',
};

export const SkillsSection: React.FC = () => {
  const { skills } = portfolioContent;

  return (
    <section
      id="section-04"
      className="relative flex min-h-screen w-full flex-col justify-center overflow-hidden px-6 pb-8 pt-[84px] sm:px-8 lg:px-12"
      style={{
        backgroundColor: 'var(--bg)',
        backgroundImage: 'radial-gradient(var(--dot-color) 1px, transparent 1px)',
        backgroundSize: '24px 24px',
      }}
    >
      <div className="mx-auto w-full max-w-[1440px]">
        <div>
          <h2
            className="section-heading m-0 font-heading text-[clamp(2rem,3.34vw,3rem)] font-extrabold uppercase leading-none tracking-[-0.04em] text-[var(--ink)]"
            style={{ fontWeight: 800 }}
          >
            SKILLS &amp; <span className="text-[var(--accent)]">TECHNOLOGIES</span>
          </h2>
          <div className="section-subtitle mt-3">
            <p className="mb-0 font-sans text-[14px] leading-relaxed text-[#71717A] dark:text-[#A1A1AA]">
              Technologies, frameworks, and engineering tools I use to build scalable systems.
            </p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-7 sm:grid-cols-2 lg:grid-cols-4 lg:gap-x-8 lg:gap-y-8">
          {skills.map((category, categoryIndex) => (
            <motion.div
              key={category.number}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.45,
                delay: categoryIndex * 0.035,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="min-w-0"
            >
              <div className="flex items-center gap-2 border-t border-[#D4D4D8] pt-2.5 dark:border-white/20">
                <span className="font-label text-[12px] font-bold tracking-[0.08em] text-[var(--accent)]">
                  {category.number}
                </span>
                <h3 className="m-0 font-heading text-[13px] font-bold uppercase leading-tight tracking-[0.04em] text-[var(--ink)]">
                  {category.title}
                </h3>
              </div>

              <div className="mt-3 grid grid-cols-[repeat(3,82px)] gap-2">
                {category.skills.map((skill) => (
                  <motion.div
                    key={skill.name}
                    whileHover={{ y: -2 }}
                    transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                    onMouseEnter={() => soundManager.playTick(1000, 0.02)}
                    className="skill-tile group flex h-[82px] w-[82px] cursor-default flex-col items-center justify-center gap-2 rounded-[14px] border-[1.5px] border-[#E4E4E7] bg-white text-[#18181B] dark:border-white/15 dark:bg-[#141418] dark:text-white"
                    data-skill={skill.name}
                    style={{
                      '--brand-color': skillBrandColors[skill.name] ?? '#18181B',
                      ...(skillBrandDarkColors[skill.name]
                        ? { '--brand-color-dark': skillBrandDarkColors[skill.name] }
                        : {}),
                    } as React.CSSProperties}
                  >
                    <BrandIcon
                      name={skill.iconName}
                      fallbackText={skill.name}
                      size={24}
                      className="skill-icon h-6 w-6"
                    />
                    <span className="skill-label max-w-[76px] px-1 text-center">
                      {skill.name}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
