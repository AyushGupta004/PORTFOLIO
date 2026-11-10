import React from 'react';
import { motion } from 'framer-motion';
import { portfolioContent } from '../../data/content';

export const AboutSection: React.FC = () => {
  const { about } = portfolioContent;

  const renderFormattedParagraph = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={index} className="font-semibold text-[#18181B]">
            {part.slice(2, -2).split(/(\s+)/).map((word, wordIndex) =>
              /^\s+$/.test(word) ? word : (
                <span key={wordIndex} className="keyword-word">
                  {word}
                </span>
              ),
            )}
          </strong>
        );
      }
      return <React.Fragment key={index}>{part}</React.Fragment>;
    });
  };

  return (
    <section
      id="section-02"
      className="relative flex h-full min-h-screen w-full items-center justify-center overflow-hidden px-6 pb-8 pt-[84px] sm:px-8 lg:px-12"
      style={{
        backgroundColor: 'var(--bg)',
        backgroundImage:
          'radial-gradient(#D4D4D8 1px, transparent 1px)',
        backgroundSize: '24px 24px',
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-[850px]"
      >
        <h2
          className="section-heading m-0 font-heading text-[48px] font-extrabold uppercase leading-none tracking-[-0.04em]"
          style={{ fontWeight: 800 }}
        >
          ABOUT <span className="text-[var(--accent)]">ME</span>
        </h2>

        <div className="section-subtitle mt-3">
          <p className="mb-0 font-sans text-[14px] italic leading-relaxed text-[#71717A]">
            {about.subtitle}
          </p>
        </div>

        <div className="space-y-5 font-sans text-base leading-[1.75] text-[#52525B] sm:text-[17px]">
          {about.paragraphs.map((paragraph, index) =>
            index === 1 ? (
              <motion.p
                key={index}
                initial={{ opacity: 0.28 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, amount: 0.35 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="m-0"
              >
                {renderFormattedParagraph(paragraph)}
              </motion.p>
            ) : (
              <p key={index} className="m-0">
                {renderFormattedParagraph(paragraph)}
              </p>
            ),
          )}
        </div>
      </motion.div>
    </section>
  );
};
