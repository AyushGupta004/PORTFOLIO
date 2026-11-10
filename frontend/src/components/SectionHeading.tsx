import React from 'react';
import { motion } from 'framer-motion';

interface SectionHeadingProps {
  number: string;
  title: string;
  subtitle: string;
  dark?: boolean;
  className?: string;
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  number,
  title,
  subtitle,
  dark = false,
  className = '',
}) => {
  const words = title.trim().split(/\s+/);
  const darkWords = words.slice(0, -1).join(' ');
  const accentWord = words[words.length - 1];

  const easing = [0.22, 1, 0.36, 1];

  return (
    <div className={`mb-3 sm:mb-4 lg:mb-5 ${className}`}>
      {/* Section index meta */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, ease: easing }}
        className="flex items-center gap-2 mb-1 sm:mb-1.5"
      >
        <span
          className={`font-label ${
            dark ? 'text-[var(--accent)]' : 'text-[var(--accent)]'
          }`}
        >
          {number}
        </span>
        <span className="text-[var(--muted)] text-xs tracking-widest">//</span>
        <span
          className={`font-label text-xs ${
            dark ? 'text-[var(--muted)]' : 'text-[var(--muted)]'
          }`}
        >
          SECTION
        </span>
      </motion.div>

      {/* Main heading */}
      <motion.h2
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.05, ease: easing }}
        className={`section-heading font-heading text-section-title tracking-tight leading-tight mb-1.5 sm:mb-2 ${
          dark ? 'text-[var(--text-dark)]' : 'text-[var(--ink)]'
        }`}
      >
        {darkWords}
        {darkWords && ' '}
        <span className="text-[var(--accent)]">{accentWord}</span>
      </motion.h2>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.1, ease: easing }}
        className="section-subtitle overflow-wrap-anywhere"
      >
        <motion.p
          className={`text-xs sm:text-sm tracking-wide font-sans ${
            dark ? 'text-[#A0A0A5]' : 'text-[var(--muted)]'
          }`}
        >
          {subtitle}
        </motion.p>
      </motion.div>
    </div>
  );
};
