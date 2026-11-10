export type ProjectFilter = 'All' | 'AI & Backend' | 'Full-Stack' | 'Realtime Systems';

export interface Project {
  id: string;
  title: string;
  subtitle?: string | null;
  date?: string | null;
  role?: string | null;
  blurb?: string | null;
  stack: string[];
  category: ProjectFilter;
  featured: boolean;
  liveUrl?: string;
  repoUrl?: string;
  badge?: string;
}

export interface SkillItem {
  name: string;
  iconName?: string;
}

export interface SkillCategory {
  number: string;
  title: string;
  skills: SkillItem[];
}

export interface ExperienceItem {
  role: string;
  company: string;
  period: string;
  badge: string;
  description: string;
  tags: string[];
  duration: string;
}

export interface EducationItem {
  institution: string;
  dateLabel: string;
  period: string;
  score: string;
  badge: 'DEGREE' | 'SCHOOL';
  subtitle: string;
  description: string;
  tags: string[];
}

export interface CredentialItem {
  id: string;
  title: string;
  issuer: string;
  timelineDate: string;
  subtitle: string;
  description: string;
  tags: string[];
  date?: string;
  credentialUrl?: string;
  highlight?: boolean;
  badge?: string;
}

export interface CodingStats {
  github: {
    username: string;
    profileUrl: string;
    totalRepos: number | null;
    totalStars: number | null;
    contributions: number | null;
    recentStreak: number | null;
    activeDays: number | null;
    longestStreak: number | null;
    currentStreak: number | null;
    contributionDays: { date: string; count: number }[] | null;
  };
  leetcode: {
    username: string;
    profileUrl: string;
    totalSolved: number | null;
    easy: number | null;
    medium: number | null;
    hard: number | null;
    rating: number | null;
    ranking?: number | null;
    activeDays: number | null;
  };
  codolio: {
    username: string;
    profileUrl: string;
    problemsSolved: string | null;
  };
}

export interface PortfolioContent {
  personal: {
    name: string;
    title: string;
    location: string;
    coordinates: [number, number];
    email: string;
    links: {
      github: string;
      linkedin: string;
      leetcode: string;
      codolio: string;
    };
    assets: {
      portrait: string;
      resume: string;
    };
  };
  hero: {
    alternatingWords: {
      title: string;
      ghost: string;
    }[];
    tagline: string;
    specialties: string[];
  };
  about: {
    subtitle: string;
    paragraphs: string[];
    quickStats: {
      label: string;
      value: string;
    }[];
  };
  skills: SkillCategory[];
  projects: Project[];
  codingStats: CodingStats;
  experience: ExperienceItem[];
  education: EducationItem[];
  credentials: CredentialItem[];
  contact: {
    heading: string;
    subtitle: string;
    note: string;
  };
}
