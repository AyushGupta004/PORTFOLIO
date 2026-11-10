import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Github, ExternalLink } from 'lucide-react';
import { portfolioContent } from '../../data/content';
import { Project, ProjectFilter } from '../../types/portfolio';
import { soundManager } from '../../utils/sound';

const FILTERS: ProjectFilter[] = [
  'All',
  'AI & Backend',
  'Full-Stack',
  'Realtime Systems',
];
const CARD_GAP = 16;

export const ProjectsSection: React.FC = () => {
  const { projects } = portfolioContent;
  const viewportRef = useRef<HTMLDivElement>(null);
  const [activeFilter, setActiveFilter] = useState<ProjectFilter>('All');
  const [hoveredProjectId, setHoveredProjectId] = useState<string | null>(null);
  const [viewportWidth, setViewportWidth] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);

  const visibleProjects = projects.filter(
    (project) => activeFilter === 'All' || project.category === activeFilter
  );
  const columns = viewportWidth < 640 ? 1 : viewportWidth < 1024 ? 2 : 3;
  const cardWidth = viewportWidth
    ? (viewportWidth - CARD_GAP * (columns - 1)) / columns
    : 0;
  const maxIndex = Math.max(0, visibleProjects.length - columns);
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

  useEffect(() => {
    setActiveIndex(0);
  }, [activeFilter]);

  const updateFilter = (filter: ProjectFilter) => {
    soundManager.playPop();
    setActiveFilter(filter);
  };

  const moveTrack = (direction: -1 | 1) => {
    soundManager.playPop();
    setActiveIndex((index) => Math.max(0, Math.min(maxIndex, index + direction)));
  };

  return (
    <section
      id="section-03"
      className="relative flex h-full min-h-screen w-full flex-col justify-center overflow-hidden px-6 pb-8 pt-[84px] sm:px-8 lg:px-12"
      style={{
        backgroundColor: 'var(--bg)',
        backgroundImage: 'radial-gradient(#D4D4D8 1px, transparent 1px)',
        backgroundSize: '24px 24px',
      }}
    >
      <div className="mx-auto w-full max-w-[1440px]">
        <div className="mb-5 flex flex-col gap-5 xl:mb-6 xl:flex-row xl:items-end xl:justify-between">
          <div className="min-w-0">
            <h2
              className="section-heading m-0 font-heading text-[clamp(2rem,3.34vw,3rem)] font-extrabold uppercase leading-none tracking-[-0.04em]"
              style={{ fontWeight: 800 }}
            >
              FEATURED <span className="text-[var(--accent)]">PROJECTS</span>
            </h2>
            <div className="section-subtitle mt-3">
              <p className="mb-0 font-sans text-[14px] leading-relaxed text-[#71717A]">
                A collection of projects that turn ideas into real, usable experiences.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3 xl:shrink-0 xl:items-end">
            <div className="flex flex-wrap items-center gap-2">
              {FILTERS.map((filter) => {
                const isActive = activeFilter === filter;
                return (
                  <button
                    key={filter}
                    type="button"
                    aria-pressed={isActive}
                    onClick={() => updateFilter(filter)}
                    className={`cursor-crosshair rounded-full border px-3 py-1.5 font-label text-[10px] transition-colors duration-[280ms] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] sm:text-[11px] ${
                      isActive
                        ? 'border-[var(--ink)] bg-[var(--ink)] text-white'
                        : 'border-[var(--border)] bg-[var(--card)] text-[var(--muted)] hover:border-[var(--ink)] hover:text-[var(--ink)]'
                    }`}
                  >
                    {filter}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                aria-label="Show previous project"
                onClick={() => moveTrack(-1)}
                disabled={activeIndex === 0}
                className="carousel-arrow flex h-10 w-10 cursor-crosshair items-center justify-center rounded-full text-white transition-colors duration-[280ms] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] disabled:cursor-not-allowed"
              >
                <ChevronLeft size={19} aria-hidden="true" />
              </button>
              <button
                type="button"
                aria-label="Show next project"
                onClick={() => moveTrack(1)}
                disabled={activeIndex >= maxIndex}
                className="carousel-arrow flex h-10 w-10 cursor-crosshair items-center justify-center rounded-full text-white transition-colors duration-[280ms] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] disabled:cursor-not-allowed"
              >
                <ChevronRight size={19} aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>

        <div
          ref={viewportRef}
          className="overflow-hidden"
          onPointerLeave={() => setHoveredProjectId(null)}
        >
          <motion.div
            className="flex items-stretch"
            style={{ gap: CARD_GAP }}
            animate={{ x: -trackOffset }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          >
            {visibleProjects.map((project: Project) => (
              <ProjectCard
                key={project.id}
                project={project}
                width={cardWidth}
                isDimmed={Boolean(hoveredProjectId && hoveredProjectId !== project.id)}
                onPointerEnter={() => setHoveredProjectId(project.id)}
              />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

interface ProjectCardProps {
  project: Project;
  width: number;
  isDimmed: boolean;
  onPointerEnter: () => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  width,
  isDimmed,
  onPointerEnter,
}) => (
  <motion.article
    onPointerEnter={onPointerEnter}
    whileHover={{ y: -4 }}
    transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
    style={{
      width: width || undefined,
      minWidth: width || undefined,
      height: 360,
      opacity: isDimmed ? 0.45 : 1,
    }}
    className="portfolio-card group flex shrink-0 flex-col rounded-2xl border border-[var(--border)] p-5 text-[var(--ink)] hover:border-[#18181B] hover:bg-[#18181B] hover:text-white sm:p-6"
  >
    <div className="flex min-h-4 items-center justify-between gap-3">
      <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-[#71717A] transition-colors duration-[280ms] group-hover:text-[#A1A1AA]">
        {project.date}
      </span>
      <span className="text-right font-label text-[9px] font-semibold tracking-[0.12em] text-[var(--accent)] sm:text-[10px]">
        {project.badge}
      </span>
    </div>

    <div className="mt-5 min-h-0 flex-1">
      <h3 className="m-0 font-heading text-[22px] font-bold leading-tight tracking-[-0.03em] text-[var(--ink)] transition-colors duration-[280ms] group-hover:text-white">
        {project.title}
      </h3>
      <p className="mt-3 line-clamp-3 font-sans text-[13px] leading-[1.65] text-[#52525B] transition-colors duration-[280ms] group-hover:text-[#A1A1AA]">
        {project.blurb}
      </p>
      <div className="mt-4 flex flex-wrap gap-1.5">
        {project.stack.map((technology) => (
          <span
            key={technology}
            className="rounded-md border border-[var(--border)] bg-white/40 px-2 py-1 font-mono text-[9px] leading-none text-[#52525B] transition-colors duration-[280ms] group-hover:border-[#3F3F46] group-hover:bg-[#27272A] group-hover:text-[#E4E4E7] sm:text-[10px]"
          >
            {technology}
          </span>
        ))}
      </div>
    </div>

    <div className="mt-4 flex items-center justify-between border-t border-[var(--border)] pt-3 transition-colors duration-[280ms] group-hover:border-[#3F3F46]">
      <a
        href={project.liveUrl ?? '#'}
        onClick={(event) => {
          if (!project.liveUrl || project.liveUrl === '#') event.preventDefault();
          soundManager.playPop();
        }}
        target={project.liveUrl && project.liveUrl !== '#' ? '_blank' : undefined}
        rel={project.liveUrl && project.liveUrl !== '#' ? 'noopener noreferrer' : undefined}
        aria-label={`Live demo for ${project.title}`}
        className="inline-flex items-center gap-1.5 font-label text-[10px] font-semibold tracking-[0.1em] text-[var(--ink)] transition-colors duration-[280ms] hover:text-[var(--accent)] group-hover:text-white group-hover:hover:text-[var(--accent)] focus-visible:rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
      >
        ↗ LIVE DEMO
        <ExternalLink size={12} aria-hidden="true" />
      </a>
      <a
        href={project.repoUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => soundManager.playPop()}
        aria-label={`GitHub repository for ${project.title}`}
        className="inline-flex items-center gap-1.5 font-label text-[10px] font-semibold tracking-[0.1em] text-[var(--ink)] transition-colors duration-[280ms] hover:text-[var(--accent)] group-hover:text-white group-hover:hover:text-[var(--accent)] focus-visible:rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
      >
        <Github size={13} aria-hidden="true" />
        GITHUB
      </a>
    </div>
  </motion.article>
);
