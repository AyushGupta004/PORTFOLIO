export interface GithubStatsTruth {
  totalRepos: number | null;
  totalStars: number | null;
  contributions: number | null;
  recentStreak: number | null;
  activeDays: number | null;
  longestStreak: number | null;
  currentStreak: number | null;
  contributionDays: { date: string; count: number }[] | null;
}

export interface LeetcodeStatsTruth {
  totalSolved: number | null;
  easy: number | null;
  medium: number | null;
  hard: number | null;
  rating: number | null;
  ranking: number | null;
  activeDays: number | null;
}

export interface CodolioStatsTruth {
  problemsSolved: number | null;
}

export interface AvailabilityTruth {
  openForInternships: boolean | null;
  statusText: string | null;
}

export const githubStats: GithubStatsTruth = {
  totalRepos: null,
  totalStars: null,
  contributions: null,
  recentStreak: null,
  activeDays: null,
  longestStreak: null,
  currentStreak: null,
  contributionDays: null,
};

export const leetcodeStats: LeetcodeStatsTruth = {
  totalSolved: null,
  easy: null,
  medium: null,
  hard: null,
  rating: null,
  ranking: null,
  activeDays: null,
};

export const codolioStats: CodolioStatsTruth = {
  problemsSolved: null,
};

export const availability: AvailabilityTruth = {
  openForInternships: null,
  statusText: null,
};

export const heroChipText: string | null = null;
