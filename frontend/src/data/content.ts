import { PortfolioContent } from '../types/portfolio';
import { githubStats, leetcodeStats, codolioStats } from './truth';

export const heroStates = [
  { id: 1, line1: 'BACKEND', line2: 'ENGINEER' },
  { id: 2, line1: 'FULL STACK', line2: 'DEVELOPER' },
  { id: 3, line1: 'AI', line2: 'ENGINEER' },
] as const;

export const heroCompetencies = [
  { label: 'BACKEND ENGINEERING', state: 1 },
  { label: 'API DESIGN & SECURITY', state: 1 },
  { label: 'DATABASE SYSTEMS', state: 2 },
  { label: 'AI & LLM INTEGRATION', state: 3 },
  { label: 'REALTIME & DEPLOYMENT', state: 2 },
] as const;

export const portfolioContent: PortfolioContent = {
  personal: {
    name: 'Ayush Gupta',
    title: 'Full-Stack & Backend Developer',
    location: 'Greater Noida, UP, India',
    coordinates: [77.503, 28.4744],
    email: 'ayushgupta.stack@gmail.com',
    links: {
      github: 'https://github.com/AyushGupta004',
      linkedin: 'https://www.linkedin.com/in/ayush-gupta-1b7b60360/',
      leetcode: 'https://leetcode.com/u/Ayush_Gupta04/',
      codolio: 'https://codolio.com/profile/AyushGupta04',
    },
    assets: {
      portrait: '/portrait.png',
      resume: '/resume.pdf',
    },
  },
  hero: {
    alternatingWords: heroStates.map(({ line1, line2 }) => ({
      title: `${line1} ${line2}`,
      ghost: line2,
    })),
    tagline: 'Backend-first engineer building APIs, realtime systems and LLM tools that hold up under real use.',
    specialties: heroCompetencies.map(({ label }) => label),
  },
  about: {
    subtitle: 'I like the parts of software users never see.',
    paragraphs: [
      "I'm a third-year **B.Tech CSE (AI) student at Galgotias University** who learns by shipping. My work leans **backend**: **FastAPI services, PostgreSQL with row-level security, and realtime sync**. I've built an **AI pollution-reporting platform** on Gemini Vision and Supabase, a **voice-controlled Windows bridge** with token-based pairing, and a **chargeback-defense engine** with a measured evaluation harness.",
      "I work mostly in **Python, TypeScript, FastAPI, React and PostgreSQL**, and I care about the details demos skip: **validation, access control and graceful failure**. My fintech build **Neural Nexus** placed **1st runner-up at Mindspark '26**, among 550+ teams. Right now I'm sharpening **DSA and distributed systems**, and I'm looking for **internships and software engineering roles in fintech and platform engineering**.",
    ],
    quickStats: [
      { label: 'ACADEMIC CGPA', value: '9.42' },
      { label: 'AI SUMMIT 2026', value: 'Finalist' },
    ],
  },
  skills: [
    {
      number: '01',
      title: 'Languages',
      skills: [
        { name: 'Python', iconName: 'siPython' },
        { name: 'JavaScript', iconName: 'siJavascript' },
        { name: 'TypeScript', iconName: 'siTypescript' },
        { name: 'SQL' },
        { name: 'C++', iconName: 'siC' },
      ],
    },
    {
      number: '02',
      title: 'Frontend',
      skills: [
        { name: 'React', iconName: 'siReact' },
        { name: 'Next.js' },
        { name: 'Tailwind CSS', iconName: 'siTailwindcss' },
        { name: 'Vite', iconName: 'siVite' },
        { name: 'HTML/CSS', iconName: 'siHtml5' },
      ],
    },
    {
      number: '03',
      title: 'Backend',
      skills: [
        { name: 'FastAPI', iconName: 'siFastapi' },
        { name: 'Node.js', iconName: 'siNodedotjs' },
        { name: 'Express.js' },
        { name: 'REST APIs' },
        { name: 'WebSockets' },
      ],
    },
    {
      number: '04',
      title: 'Databases',
      skills: [
        { name: 'PostgreSQL', iconName: 'siPostgresql' },
        { name: 'Supabase', iconName: 'siSupabase' },
        { name: 'MongoDB' },
        { name: 'Redis' },
      ],
    },
    {
      number: '05',
      title: 'AI / ML',
      skills: [
        { name: 'Gemini API', iconName: 'siGooglegemini' },
        { name: 'Groq' },
        { name: 'PyTorch' },
        { name: 'LangGraph' },
        { name: 'EasyOCR' },
      ],
    },
    {
      number: '06',
      title: 'DevOps & Cloud',
      skills: [
        { name: 'Docker', iconName: 'siDocker' },
        { name: 'AWS' },
        { name: 'Vercel', iconName: 'siVercel' },
        { name: 'Git/GitHub', iconName: 'siGithub' },
        { name: 'Linux' },
      ],
    },
    {
      number: '07',
      title: 'Security & Tools',
      skills: [
        { name: 'JWT', iconName: 'siJsonwebtokens' },
        { name: 'Row Level Security' },
        { name: 'pytest', iconName: 'siPytest' },
        { name: 'Postman' },
        { name: 'Git', iconName: 'siGithub' },
      ],
    },
    {
      number: '08',
      title: 'AI Coding Agents',
      skills: [
        { name: 'Claude', iconName: 'siAnthropic' },
        { name: 'Gemini', iconName: 'siGooglegemini' },
        { name: 'Cursor' },
        { name: 'Ollama', iconName: 'siOllama' },
      ],
    },
  ],
  projects: [
    {
      id: 'prakarti-report',
      title: 'Prakarti Report',
      subtitle: 'AI pollution-reporting platform',
      date: 'SEP 2026',
      role: 'Solo',
      badge: 'AI & BACKEND',
      blurb:
        'AI pollution-reporting platform. FastAPI + Gemini Vision classifies uploads into 9 categories with confidence and evidence; Supabase backend with row-level security.',
      stack: ['FastAPI', 'Gemini Vision', 'Supabase', 'Python', 'React', 'PostgreSQL'],
      category: 'AI & Backend',
      featured: true,
      liveUrl: 'https://github.com/Prakarti-Report',
      repoUrl: 'https://github.com/Prakarti-Report',
    },
    {
      id: 'nova-os',
      title: 'Goori OS',
      subtitle: 'Nova OS / Goori OS',
      date: 'SEP – OCT 2026',
      role: 'Solo',
      badge: 'SYSTEMS BUILD',
      blurb:
        'FastAPI bridge and browser desktop hosting 6 integrated apps, controlled from a Flutter client over HTTP/WebSocket with Groq LLM voice control.',
      stack: ['FastAPI', 'Groq', 'WebSockets', 'Flutter', 'Python', 'React'],
      category: 'Realtime Systems',
      featured: true,
      liveUrl: 'https://github.com/Gori-OS',
      repoUrl: 'https://github.com/Gori-OS',
    },
    {
      id: 'revenue-recovery-agent',
      title: 'Revenue Recovery Agent',
      subtitle: 'Automated chargeback recovery workflow',
      date: 'AUG 2026',
      role: 'Solo',
      badge: 'SOLO BUILD',
      blurb:
        'Catches failed Razorpay payments via HMAC-verified webhooks, Gemini classifies the failure reason, and triggers automated retry and recovery workflows.',
      stack: ['Python', 'FastAPI', 'Razorpay', 'HMAC', 'Gemini API', 'PostgreSQL'],
      category: 'AI & Backend',
      featured: true,
      liveUrl: 'https://github.com/AyushGupta004/razerpay-agent',
      repoUrl: 'https://github.com/AyushGupta004/razerpay-agent',
    },
    {
      id: 'calling-backend',
      title: 'Calling Backend',
      subtitle: 'FastAPI WebSocket signaling server',
      date: 'JUL 2026',
      role: 'Solo',
      badge: 'REALTIME ENGINE',
      blurb:
        'FastAPI WebSocket signaling server for one-to-one Flutter audio calls with WebRTC offer/answer/ICE candidate forwarding and token authentication.',
      stack: ['FastAPI', 'WebSockets', 'WebRTC', 'Flutter', 'Python'],
      category: 'Realtime Systems',
      featured: true,
      liveUrl: 'https://github.com/AyushGupta004/calling_backend',
      repoUrl: 'https://github.com/AyushGupta004/calling_backend',
    },
    {
      id: 'bhojanam',
      title: 'Bhojanam',
      subtitle: 'Full-stack food redistribution and meal management',
      date: 'JUN 2026',
      role: 'Full-Stack',
      badge: 'FULL-STACK BUILD',
      blurb:
        'Full-stack food redistribution and meal management platform connecting donors and organizations with real-time inventory tracking and role-based access.',
      stack: ['React', 'Node.js', 'PostgreSQL', 'Tailwind CSS', 'REST APIs'],
      category: 'Full-Stack',
      featured: true,
      liveUrl: '#',
      repoUrl: 'https://github.com/AyushGupta004',
    },
  ],
  codingStats: {
    github: {
      username: 'AyushGupta004',
      profileUrl: 'https://github.com/AyushGupta004',
      totalRepos: githubStats.totalRepos,
      totalStars: githubStats.totalStars,
      contributions: githubStats.contributions,
      recentStreak: githubStats.recentStreak,
      activeDays: githubStats.activeDays,
      longestStreak: githubStats.longestStreak,
      currentStreak: githubStats.currentStreak,
      contributionDays: githubStats.contributionDays,
    },
    leetcode: {
      username: 'Ayush_Gupta04',
      profileUrl: 'https://leetcode.com/u/Ayush_Gupta04/',
      totalSolved: leetcodeStats.totalSolved,
      easy: leetcodeStats.easy,
      medium: leetcodeStats.medium,
      hard: leetcodeStats.hard,
      rating: leetcodeStats.rating,
      ranking: leetcodeStats.ranking,
      activeDays: leetcodeStats.activeDays,
    },
    codolio: {
      username: 'AyushGupta04',
      profileUrl: 'https://codolio.com/profile/AyushGupta04',
      problemsSolved: codolioStats.problemsSolved !== null ? String(codolioStats.problemsSolved) : null,
    },
  },
  experience: [
    {
      role: 'AI Intern',
      company: 'InAmigos Foundation',
      period: '01 AUG – SEP 2025',
      badge: 'INTERNSHIP',
      description:
        'Engineered structured prompt-engineering workflows (zero-shot, few-shot, chain-of-thought, role-based) and delivered 3 AI-assisted UI/UX website designs refined over 2+ feedback cycles.',
      tags: ['Prompt Engineering', 'Zero-Shot', 'Chain-of-Thought', 'AI-Assisted UI/UX'],
      duration: '2 weeks',
    },
  ],
  education: [
    {
      institution: 'Taxsila Public School',
      dateLabel: '01 2022',
      period: '2022',
      score: '91%',
      badge: 'SCHOOL',
      subtitle: 'Class X (CBSE) · Meerut',
      description:
        'Secondary School Certificate completed with distinction across mathematics, physical sciences, and computing basics.',
      tags: ['Mathematics', 'Science', 'IT Basics'],
    },
    {
      institution: 'Taxsila Public School',
      dateLabel: '02 2024',
      period: '2024',
      score: '90%',
      badge: 'SCHOOL',
      subtitle: 'Class XII (CBSE) · Meerut',
      description:
        'Higher Secondary Certificate with core emphasis on Physics, Chemistry, Mathematics, and Computer Science foundations.',
      tags: ['Computer Science', 'Physics', 'Mathematics'],
    },
    {
      institution: 'Galgotias University',
      dateLabel: '03 2024 – 2028',
      period: '2024 – 2028',
      score: 'CGPA 9.42',
      badge: 'DEGREE',
      subtitle: 'B.Tech, Computer Science & Engineering (AI) · Greater Noida',
      description:
        'Building theory into real-world software. Focusing on Data Structures, Algorithms, Artificial Intelligence, and reliable backend system design.',
      tags: ['CSE (AI)', 'DSA', 'Backend', 'System Design'],
    },
  ],
  credentials: [
    {
      id: 'ai-summit-2026',
      title: 'AI Summit 2026: Finalist',
      issuer: 'AI Summit 2026',
      timelineDate: '01 2026',
      subtitle: 'AI Summit · National Level',
      description:
        'Selected as a National Finalist out of 40,000 competing teams for advanced AI architecture and implementation workflows.',
      tags: ['AI Systems', 'FastAPI', 'Python', 'Problem Solving'],
      date: '2026',
      badge: 'FINALIST',
      highlight: true,
      credentialUrl: '#',
    },
    {
      id: 'mastering-mysql',
      title: 'Mastering MySQL',
      issuer: 'Guvi',
      timelineDate: '02 2025',
      subtitle: 'Guvi Geek Network',
      description:
        'Completed rigorous hands-on certification mastering relational database design, query optimization, indexing, and data integrity.',
      tags: ['MySQL', 'Databases', 'Query Optimization'],
      date: '2025',
      highlight: false,
      badge: 'CERTIFIED',
      credentialUrl: '#',
    },
    {
      id: 'sql-database-oracle',
      title: 'SQL Database Certification',
      issuer: 'Oracle',
      timelineDate: '03 2025',
      subtitle: 'Oracle',
      description:
        'Official certification covering advanced SQL operations, joins, subqueries, and database administration standards.',
      tags: ['SQL', 'Database Management', 'Oracle'],
      date: '2025',
      highlight: false,
      badge: 'CERTIFIED',
      credentialUrl: '#',
    },
    {
      id: 'google-dev-workshop',
      title: 'Google Development Workshop',
      issuer: 'Google Development Workshop',
      timelineDate: '04 2025',
      subtitle: 'Google · Firebase & MediaPipe',
      description:
        'Attended specialized training covering Firebase cloud infrastructure, MediaPipe machine learning tools, and modern application development.',
      tags: ['Firebase', 'MediaPipe', 'Google', 'Cloud'],
      date: '2025',
      highlight: false,
      badge: 'WORKSHOP',
      credentialUrl: '#',
    },
  ],
  contact: {
    heading: 'GET IN TOUCH',
    subtitle: 'Open for backend & full-stack engineering internships and projects.',
    note: 'Based in Greater Noida, UP, India (IST / UTC+5:30).',
  },
};

// Dev-only assertion: Every external URL in content.ts must match the approved list from PROJECT_BRIEF.md
if (import.meta.env.DEV) {
  const APPROVED_BRIEF_URLS = new Set([
    'https://github.com/AyushGupta004',
    'https://github.com/Prakarti-Report',
    'https://github.com/Gori-OS',
    'https://www.linkedin.com/in/ayush-gupta-1b7b60360/',
    'https://leetcode.com/u/Ayush_Gupta04/',
    'https://codolio.com/profile/AyushGupta04',
    'https://chandravardhan396.github.io/Bhojanam/',
    'https://github.com/AyushGupta004/razerpay-agent',
    'https://github.com/AyushGupta004/calling_backend',
    'https://github.com/AyushGupta004/ChargeShield',
  ]);

  const externalUrls: string[] = [
    portfolioContent.personal.links.github,
    portfolioContent.personal.links.linkedin,
    portfolioContent.personal.links.leetcode,
    portfolioContent.personal.links.codolio,
    portfolioContent.codingStats.github.profileUrl,
    portfolioContent.codingStats.leetcode.profileUrl,
    portfolioContent.codingStats.codolio.profileUrl,
    ...portfolioContent.projects
      .map((p) => p.liveUrl)
      .filter((u): u is string => Boolean(u) && u !== '#'),
    ...portfolioContent.projects.map((p) => p.repoUrl).filter((u): u is string => Boolean(u)),
    ...portfolioContent.credentials
      .map((c) => c.credentialUrl)
      .filter((u): u is string => Boolean(u) && u !== '#'),
  ];

  externalUrls.forEach((url) => {
    if (!APPROVED_BRIEF_URLS.has(url)) {
      console.warn(`[Content Validation] Unrecognized external URL: "${url}"`);
    }
  });
}
