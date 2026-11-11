import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { SectionHeading } from '../SectionHeading';
import { portfolioContent } from '../../data/content';
import { soundManager } from '../../utils/sound';

export const CredentialsSection = () => {
  const { credentials } = portfolioContent;
  const viewportRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [layout, setLayout] = useState({ cardWidth: 320, gap: 16, visibleCards: 1 });
  const maxIndex = Math.max(0, credentials.length - layout.visibleCards);

  useEffect(() => {
    const updateLayout = () => {
      const width = viewportRef.current?.clientWidth ?? 0;
      const visibleCards = width >= 1280 ? 4 : width >= 1024 ? 3 : width >= 640 ? 2 : 1;
      const gap = width >= 768 ? 24 : 16;
      setLayout({
        cardWidth: Math.max(0, (width - gap * (visibleCards - 1)) / visibleCards),
        gap,
        visibleCards,
      });
    };

    updateLayout();
    window.addEventListener('resize', updateLayout);
    return () => window.removeEventListener('resize', updateLayout);
  }, []);

  useEffect(() => {
    setActiveIndex((index) => Math.min(index, maxIndex));
  }, [maxIndex]);

  const offset = activeIndex * (layout.cardWidth + layout.gap);

  return (
    <section
      id="section-08"
      className="credentials-section relative flex h-full min-h-screen w-full flex-col justify-between px-4 pb-4 pt-[76px] sm:px-6 sm:pb-5 md:px-10 md:pt-[88px] lg:px-12 lg:pt-[92px]"
    >
      <div>
        <div className="credentials-heading-row">
          <SectionHeading
            number="08"
            title="CREDENTIALS & ACHIEVEMENTS"
            subtitle="Certifications, honours, and recognitions collected along the way."
            className="credentials-heading"
          />
          <div className="credentials-control-row">
            <button
              type="button"
              aria-label="Previous credentials"
              disabled={activeIndex === 0}
              onClick={() => setActiveIndex((index) => Math.max(0, index - 1))}
              className="credentials-arrow"
            >
              <ArrowLeft size={17} strokeWidth={2} />
            </button>
            <button
              type="button"
              aria-label="Next credentials"
              disabled={activeIndex === maxIndex}
              onClick={() => setActiveIndex((index) => Math.min(maxIndex, index + 1))}
              className="credentials-arrow"
            >
              <ArrowRight size={17} strokeWidth={2} />
            </button>
          </div>
        </div>

        <div className="credentials-track-area">
          <div ref={viewportRef} className="overflow-hidden">
            <motion.div
              className="credentials-track"
              animate={{ x: -offset }}
              transition={{ type: 'spring', stiffness: 260, damping: 32 }}
            >
              <div className="credentials-timeline" style={{ gap: layout.gap }}>
                {credentials.map((credential) => (
                  <div
                    key={credential.id}
                    className="credentials-timeline-item"
                    style={{ width: layout.cardWidth }}
                  >
                    <p className="font-mono text-xs font-bold text-[#FF3B00]">
                      <span>{credential.timelineDate.slice(0, 2)}</span>
                      <span className="ml-2 font-medium text-[#71717A] dark:text-[#A1A1AA]">
                        {credential.timelineDate.slice(3)}
                      </span>
                    </p>
                    <span className="credentials-timeline-node" aria-hidden="true" />
                  </div>
                ))}
                <span className="credentials-timeline-line" aria-hidden="true" />
              </div>

              <div className="credentials-cards" style={{ gap: layout.gap }}>
                {credentials.map((credential) => (
                  <article
                    key={credential.id}
                    className="credential-card portfolio-card"
                    style={{ width: layout.cardWidth }}
                  >
                    <div className="credential-meta-row">
                      <span className="credential-badge">{credential.badge}</span>
                    </div>

                    <div className="credential-body">
                      <h3>{credential.title}</h3>
                      <p className="credential-subtitle">{credential.subtitle}</p>
                      <p className="credential-description">{credential.description}</p>
                    </div>

                    <div className="credential-tags">
                      {credential.tags.map((tag) => (
                        <span key={tag} className="credential-tag">
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="credential-footer">
                      <span>
                        ISSUED <span className="ml-1">{credential.date}</span>
                      </span>
                      <a
                        href={credential.credentialUrl ?? '#'}
                        onClick={(event) => {
                          event.preventDefault();
                          soundManager.playPop();
                        }}
                        aria-label={`View credential for ${credential.title}`}
                      >
                        View credential ↗
                      </a>
                    </div>
                  </article>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

    </section>
  );
};
