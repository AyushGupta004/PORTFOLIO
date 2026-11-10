export interface GithubStatsTruth {
  totalRepos: number | null;
  totalStars: number | null;
  contributions: number | null;
  recentStreak: number | null;
}

export interface LeetcodeStatsTruth {
  totalSolved: number | null;
  easy: number | null;
  medium: number | null;
  hard: number | null;
  rating: number | null;
  ranking: number | null;
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
};

export const leetcodeStats: LeetcodeStatsTruth = {
  totalSolved: null,
  easy: null,
  medium: null,
  hard: null,
  rating: null,
  ranking: null,
};

export const codolioStats: CodolioStatsTruth = {
  problemsSolved: null,
};

export const availability: AvailabilityTruth = {
  openForInternships: null,
  statusText: null,
};

export const heroChipText: string | null = null;
