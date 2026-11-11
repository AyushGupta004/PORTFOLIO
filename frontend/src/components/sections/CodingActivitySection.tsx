import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import { portfolioContent } from '../../data/content';
import { useTheme } from '../../context/ThemeContext';
import { soundManager } from '../../utils/sound';

const githubUsername = import.meta.env.VITE_GITHUB_USERNAME?.trim() || 'AyushGupta004';
const githubContributionsApiBaseUrl =
  import.meta.env.VITE_GITHUB_CONTRIBUTIONS_API_BASE_URL?.trim() ||
  'https://github-contributions-api.jogruber.de/v4';
const githubUserApiBaseUrl =
  import.meta.env.VITE_GITHUB_USER_API_BASE_URL?.trim() || 'https://api.github.com/users';
const leetcodeUsername = import.meta.env.VITE_LEETCODE_USERNAME?.trim() || 'Ayush_Gupta04';
const leetcodeStatsApiBaseUrl =
  import.meta.env.VITE_LEETCODE_STATS_API_BASE_URL?.trim() ||
  'https://leetcode-api-faisalshohag.vercel.app';
const leetcodeStatsFallbackApiBaseUrl =
  import.meta.env.VITE_LEETCODE_STATS_FALLBACK_API_BASE_URL?.trim() ||
  'https://leetcode-stats-api.herokuapp.com';
const leetcodeGraphqlUrl =
  import.meta.env.VITE_LEETCODE_GRAPHQL_URL?.trim() || '/api/leetcode';

const LIGHT_HEATMAP_COLORS = ['#F4F4F5', '#E9D5FF', '#C084FC', '#9333EA', '#581C87'];
const DARK_HEATMAP_COLORS = ['#232329', '#4C1D95', '#7E22CE', '#A855F7', '#D8B4FE'];

const formatDate = (date: Date) =>
  date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

const formatNumber = (value: number) => value.toLocaleString('en-US');

interface ContributionDay {
  date: string;
  count: number;
}

interface GithubActivity {
  contributions: number | null;
  activeDays: number | null;
  longestStreak: number | null;
  currentStreak: number | null;
  publicRepos: number | null;
  contributionDays: ContributionDay[] | null;
}

interface LanguageCount {
  name: string;
  count: number;
}

interface LeetcodeActivity {
  totalSolved: number | null;
  easySolved: number | null;
  totalEasy: number | null;
  mediumSolved: number | null;
  totalMedium: number | null;
  hardSolved: number | null;
  totalHard: number | null;
  rating: number | null;
  acceptanceRate: number | null;
  globalRank: number | null;
  activeDays: number | null;
  languages: LanguageCount[];
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const numericValue = (value: unknown): number | null =>
  typeof value === 'number' && Number.isFinite(value)
    ? value
    : typeof value === 'string' && value.trim() !== '' && Number.isFinite(Number(value))
      ? Number(value)
      : null;

const fetchJsonValue = async (
  url: string,
  init?: RequestInit,
): Promise<unknown> => {
  const controller = new AbortController();
  const callerSignal = init?.signal;
  const abortRequest = () => controller.abort();
  if (callerSignal?.aborted) {
    controller.abort();
  } else {
    callerSignal?.addEventListener('abort', abortRequest, { once: true });
  }
  const timeout = window.setTimeout(() => controller.abort(), 10_000);
  try {
    const response = await fetch(url, { ...init, signal: controller.signal });
    if (!response.ok) throw new Error(`Request failed (${response.status}) for ${url}`);
    return await response.json();
  } finally {
    window.clearTimeout(timeout);
    callerSignal?.removeEventListener('abort', abortRequest);
  }
};

const fetchJson = async (
  url: string,
  init?: RequestInit,
): Promise<Record<string, unknown>> => {
  const data = await fetchJsonValue(url, init);
  if (!isRecord(data)) throw new Error(`Unexpected response from ${url}`);
  return data;
};

const dateKey = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(
    date.getDate(),
  ).padStart(2, '0')}`;

const parseContributionDays = (value: unknown): ContributionDay[] => {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item): ContributionDay[] => {
    if (!isRecord(item) || typeof item.date !== 'string') return [];
    const count = numericValue(item.count);
    return count === null ? [] : [{ date: item.date, count }];
  });
};

const getGithubStreaks = (contributions: ContributionDay[], today: Date) => {
  const todayKey = dateKey(today);
  const firstDay = new Date(today);
  firstDay.setDate(firstDay.getDate() - 364);
  const firstDayKey = dateKey(firstDay);
  const orderedDays = contributions
    .filter(({ date }) => date >= firstDayKey && date <= todayKey)
    .sort((a, b) => a.date.localeCompare(b.date));
  const countsByDate = new Map(orderedDays.map(({ date, count }) => [date, count]));
  let longestStreak = 0;
  let streak = 0;
  let cursor = new Date(firstDay);
  while (cursor <= today) {
    streak = (countsByDate.get(dateKey(cursor)) ?? 0) > 0 ? streak + 1 : 0;
    longestStreak = Math.max(longestStreak, streak);
    cursor.setDate(cursor.getDate() + 1);
  }

  const activeDays = orderedDays.filter(({ count }) => count > 0).length;
  let currentStreak = 0;
  const currentDay = new Date(today);
  if ((countsByDate.get(todayKey) ?? 0) === 0) currentDay.setDate(currentDay.getDate() - 1);
  while (
    currentDay >= firstDay &&
    (countsByDate.get(dateKey(currentDay)) ?? 0) > 0
  ) {
    currentStreak += 1;
    currentDay.setDate(currentDay.getDate() - 1);
  }

  return { activeDays, longestStreak, currentStreak };
};

const getLanguages = (value: unknown): LanguageCount[] => {
  const entries = Array.isArray(value)
    ? value
    : isRecord(value)
      ? Object.entries(value).map(([name, count]) => ({ name, count }))
      : [];
  return entries
    .flatMap((item): LanguageCount[] => {
      if (!isRecord(item)) return [];
      const name =
        (typeof item.languageName === 'string' && item.languageName) ||
        (typeof item.language === 'string' && item.language) ||
        (typeof item.name === 'string' && item.name);
      const count =
        numericValue(item.problemsSolved) ??
        numericValue(item.count) ??
        numericValue(item.solved);
      return name && count !== null ? [{ name, count }] : [];
    })
    .sort((a, b) => b.count - a.count);
};

const normalizeLeetcode = (payload: Record<string, unknown>): LeetcodeActivity => {
  const data = isRecord(payload.data) ? payload.data : payload;
  const matchedUser = isRecord(data.matchedUser) ? data.matchedUser : {};
  const problems =
    isRecord(data.userProblemsSolved)
      ? data.userProblemsSolved
      : Object.keys(matchedUser).length > 0
        ? matchedUser
        : data;
  const profile = isRecord(data.userPublicProfile)
    ? data.userPublicProfile
    : isRecord(matchedUser.profile)
      ? matchedUser.profile
      : {};
  const contest = isRecord(data.userContestRankingInfo)
    ? data.userContestRankingInfo
    : isRecord(data.userContestRanking)
    ? data.userContestRanking
    : data;
  const calendar = isRecord(data.userProfileCalendar)
    ? data.userProfileCalendar
    : isRecord(data.userCalendar)
    ? data.userCalendar
    : isRecord(matchedUser.userCalendar)
      ? matchedUser.userCalendar
      : data;
  const profileDetails = isRecord(profile.profile) ? profile.profile : profile;
  const submitStats = isRecord(problems.submitStats) ? problems.submitStats : {};
  const acceptedSubmissions = Array.isArray(submitStats.acSubmissionNum)
    ? submitStats.acSubmissionNum
    : [];
  const acceptedCounts = new Map<string, number>();
  acceptedSubmissions.forEach((entry) => {
    if (!isRecord(entry) || typeof entry.difficulty !== 'string') return;
    const count = numericValue(entry.count);
    if (count !== null) acceptedCounts.set(entry.difficulty.toUpperCase(), count);
  });
  const questionCounts = new Map<string, number>();
  if (Array.isArray(data.allQuestionsCount)) {
    data.allQuestionsCount.forEach((entry) => {
      if (!isRecord(entry) || typeof entry.difficulty !== 'string') return;
      const count = numericValue(entry.count);
      if (count !== null) questionCounts.set(entry.difficulty.toUpperCase(), count);
    });
  }

  const easySolved =
    numericValue(problems.easySolved) ?? acceptedCounts.get('EASY') ?? null;
  const mediumSolved =
    numericValue(problems.mediumSolved) ?? acceptedCounts.get('MEDIUM') ?? null;
  const hardSolved =
    numericValue(problems.hardSolved) ?? acceptedCounts.get('HARD') ?? null;
  const languageValue =
    problems.languageProblemCount ??
    (isRecord(data.matchedUser) ? data.matchedUser.languageProblemCount : undefined) ??
    data.languageProblemCount;
  const calendarValue = calendar.submissionCalendar;
  let activeDays = numericValue(calendar.totalActiveDays);

  if (typeof calendarValue === 'string') {
    try {
      const parsed: unknown = JSON.parse(calendarValue);
      if (isRecord(parsed)) activeDays = Object.keys(parsed).length;
    } catch (error) {
      console.error('Unable to parse the LeetCode submission calendar.', error);
    }
  } else if (isRecord(calendarValue)) {
    activeDays = Object.keys(calendarValue).length;
  }

  return {
    totalSolved:
      numericValue(problems.totalSolved) ??
      numericValue(problems.solvedProblem) ??
      acceptedCounts.get('ALL') ??
      (easySolved !== null && mediumSolved !== null && hardSolved !== null
        ? easySolved + mediumSolved + hardSolved
        : null),
    easySolved,
    totalEasy: numericValue(problems.totalEasy) ?? questionCounts.get('EASY') ?? null,
    mediumSolved,
    totalMedium: numericValue(problems.totalMedium) ?? questionCounts.get('MEDIUM') ?? null,
    hardSolved,
    totalHard: numericValue(problems.totalHard) ?? questionCounts.get('HARD') ?? null,
    rating: numericValue(contest.rating) ?? numericValue(contest.contestRating),
    acceptanceRate:
      numericValue(problems.acceptanceRate) ??
      numericValue(profile.acceptanceRate) ??
      numericValue(profileDetails.acceptanceRate),
    globalRank:
      numericValue(contest.globalRanking) ??
      numericValue(profile.ranking) ??
      numericValue(profileDetails.ranking) ??
      numericValue(problems.ranking),
    activeDays,
    languages: getLanguages(languageValue),
  };
};

const mergeLeetcodeActivity = (
  preferred: LeetcodeActivity,
  fallback: LeetcodeActivity,
): LeetcodeActivity => ({
  totalSolved: preferred.totalSolved ?? fallback.totalSolved,
  easySolved: preferred.easySolved ?? fallback.easySolved,
  totalEasy: preferred.totalEasy ?? fallback.totalEasy,
  mediumSolved: preferred.mediumSolved ?? fallback.mediumSolved,
  totalMedium: preferred.totalMedium ?? fallback.totalMedium,
  hardSolved: preferred.hardSolved ?? fallback.hardSolved,
  totalHard: preferred.totalHard ?? fallback.totalHard,
  rating: preferred.rating ?? fallback.rating,
  acceptanceRate: preferred.acceptanceRate ?? fallback.acceptanceRate,
  globalRank: preferred.globalRank ?? fallback.globalRank,
  activeDays: preferred.activeDays ?? fallback.activeDays,
  languages: preferred.languages.length > 0 ? preferred.languages : fallback.languages,
});

const emptyLeetcodeActivity = (): LeetcodeActivity => ({
  totalSolved: null,
  easySolved: null,
  totalEasy: null,
  mediumSolved: null,
  totalMedium: null,
  hardSolved: null,
  totalHard: null,
  rating: null,
  acceptanceRate: null,
  globalRank: null,
  activeDays: null,
  languages: [],
});

export const CodingActivitySection: React.FC = () => {
  const { effectiveTheme } = useTheme();
  const heatmapColors = effectiveTheme === 'dark' ? DARK_HEATMAP_COLORS : LIGHT_HEATMAP_COLORS;
  const sectionRef = React.useRef<HTMLElement>(null);
  const { codingStats } = portfolioContent;
  const ghData = codingStats.github;
  const lcData = codingStats.leetcode;
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const [githubActivity, setGithubActivity] = useState<GithubActivity>({
    contributions: null,
    activeDays: null,
    longestStreak: null,
    currentStreak: null,
    publicRepos: null,
    contributionDays: null,
  });
  const [leetcodeActivity, setLeetcodeActivity] =
    useState<LeetcodeActivity>(emptyLeetcodeActivity);
  const [githubLoading, setGithubLoading] = useState(true);
  const [leetcodeLoading, setLeetcodeLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    let controller: AbortController | null = null;
    let observer: IntersectionObserver | null = null;

    const loadGithubActivity = async (signal: AbortSignal) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const [contributionResult, userResult] = await Promise.allSettled([
        fetchJson(
          `${githubContributionsApiBaseUrl.replace(/\/+$/, '')}/${encodeURIComponent(githubUsername)}?y=last`,
          { signal },
        ),
        fetchJson(
          `${githubUserApiBaseUrl.replace(/\/+$/, '')}/${encodeURIComponent(githubUsername)}`,
          { signal },
        ),
      ]);

      if (!mounted || signal.aborted) return;
      const contributionResponse =
        contributionResult.status === 'fulfilled' ? contributionResult.value : null;
      const allDays = parseContributionDays(contributionResponse?.contributions);
      const todayKey = dateKey(today);
      const firstGridDate = new Date(today);
      firstGridDate.setDate(today.getDate() - today.getDay() - 51 * 7);
      const firstGridKey = dateKey(firstGridDate);
      const contributionDays = allDays.filter(
        ({ date }) => date >= firstGridKey && date <= todayKey,
      );
      const currentDays = allDays.filter(({ date }) => date <= todayKey);
      const streaks = getGithubStreaks(allDays, today);
      const contributionTotals = isRecord(contributionResponse?.total)
        ? contributionResponse.total
        : {};
      const publicRepos =
        userResult.status === 'fulfilled'
          ? numericValue(userResult.value.public_repos)
          : null;

      if (contributionResult.status === 'rejected') {
        console.error('Unable to load GitHub contribution activity.', contributionResult.reason);
      }
      if (userResult.status === 'rejected') {
        console.error('Unable to load the GitHub user profile.', userResult.reason);
      }
      setGithubActivity({
        contributions:
          numericValue(contributionTotals.lastYear) ??
          (currentDays.length > 0
            ? currentDays.reduce((sum, day) => sum + day.count, 0)
            : null),
        activeDays: allDays.length > 0 ? streaks.activeDays : null,
        longestStreak: allDays.length > 0 ? streaks.longestStreak : null,
        currentStreak: allDays.length > 0 ? streaks.currentStreak : null,
        publicRepos,
        contributionDays: allDays.length > 0 ? contributionDays : null,
      });
      setGithubLoading(false);
    };

    const loadLeetcodeActivity = async (signal: AbortSignal) => {
      const apiEndpoints = [
        `${leetcodeStatsApiBaseUrl.replace(/\/+$/, '')}/${encodeURIComponent(leetcodeUsername)}`,
        `${leetcodeStatsFallbackApiBaseUrl.replace(/\/+$/, '')}/${encodeURIComponent(leetcodeUsername)}`,
      ];
      const endpointRequests = apiEndpoints.map((endpoint) =>
        fetchJson(endpoint, { signal }),
      );
      const firstLiveResponse = await new Promise<LeetcodeActivity | null>((resolve) => {
        let pendingRequests = endpointRequests.length;
        endpointRequests.forEach((request) => {
          request.then(
            (response) => {
              const activity = normalizeLeetcode(response);
              if (activity.totalSolved !== null) resolve(activity);
              else if (--pendingRequests === 0) resolve(null);
            },
            () => {
              if (--pendingRequests === 0) resolve(null);
            },
          );
        });
      });
      if (!mounted || signal.aborted) return;
      if (firstLiveResponse) {
        setLeetcodeActivity(firstLiveResponse);
        const hasCompleteStats =
          firstLiveResponse.easySolved !== null &&
          firstLiveResponse.totalEasy !== null &&
          firstLiveResponse.mediumSolved !== null &&
          firstLiveResponse.totalMedium !== null &&
          firstLiveResponse.hardSolved !== null &&
          firstLiveResponse.totalHard !== null &&
          firstLiveResponse.activeDays !== null &&
          firstLiveResponse.languages.length > 0;
        if (hasCompleteStats) setLeetcodeLoading(false);
      }

      const results = await Promise.allSettled(endpointRequests);
      if (!mounted || signal.aborted) return;
      const liveResponses = results.flatMap((result, index) => {
        if (result.status === 'rejected') {
          console.error(`Unable to load LeetCode stats from ${apiEndpoints[index]}.`, result.reason);
          return [];
        }
        return [normalizeLeetcode(result.value)];
      });
      let liveStats = liveResponses.reduce(
        (combined, response) => mergeLeetcodeActivity(combined, response),
        emptyLeetcodeActivity(),
      );
      const needsGraphql =
        liveStats.totalSolved === null ||
        liveStats.totalEasy === null ||
        liveStats.totalMedium === null ||
        liveStats.totalHard === null ||
        liveStats.activeDays === null ||
        liveStats.languages.length === 0 ||
        (liveStats.rating === null &&
          liveStats.acceptanceRate === null &&
          liveStats.globalRank === null);

      if (needsGraphql) {
        const requestGraphql = async (query: string) => {
          const result = await fetchJson(leetcodeGraphqlUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            signal,
            body: JSON.stringify({
              query,
              variables: { username: leetcodeUsername, year: new Date().getFullYear() },
            }),
          });
          if (Array.isArray(result.errors) && result.errors.length > 0) {
            throw new Error(JSON.stringify(result.errors));
          }
          return isRecord(result.data) ? result.data : result;
        };
        const requestedQuery = `
          query UserActivity($username: String!, $year: Int!) {
            userPublicProfile(username: $username) {
              username
              profile { ranking reputation }
            }
            userProblemsSolved(username: $username) {
              solvedProblem
              easySolved
              totalEasy
              mediumSolved
              totalMedium
              hardSolved
              totalHard
              acceptanceRate
              languageProblemCount { languageName problemsSolved }
            }
            userProfileCalendar(username: $username, year: $year) {
              submissionCalendar
            }
            userContestRankingInfo(username: $username) {
              rating
              globalRanking
            }
          }
        `;
        const compatibleQuery = `
          query UserActivityFallback($username: String!, $year: Int!) {
            allQuestionsCount {
              difficulty
              count
            }
            matchedUser(username: $username) {
              profile { ranking }
              languageProblemCount { languageName problemsSolved }
              submitStats {
                acSubmissionNum { difficulty count submissions }
              }
              userCalendar(year: $year) {
                totalActiveDays
                submissionCalendar
              }
            }
            userContestRanking(username: $username) {
              rating
              globalRanking
            }
          }
        `;

        try {
          liveStats = mergeLeetcodeActivity(
            liveStats,
            normalizeLeetcode(await requestGraphql(requestedQuery)),
          );
        } catch (error) {
          if (signal.aborted) return;
          console.warn('LeetCode GraphQL endpoint requires the compatibility query.', error);
          try {
            liveStats = mergeLeetcodeActivity(
              liveStats,
              normalizeLeetcode(await requestGraphql(compatibleQuery)),
            );
          } catch (fallbackError) {
            if (signal.aborted) return;
            console.error('Unable to load LeetCode activity from the GraphQL proxy.', fallbackError);
          }
        }
      }

      if (!mounted || signal.aborted) return;
      setLeetcodeActivity(liveStats);
      setLeetcodeLoading(false);
    };

    const loadActivities = () => {
      if (controller) return;
      controller = new AbortController();
      void loadGithubActivity(controller.signal);
      void loadLeetcodeActivity(controller.signal);
    };

    const section = sectionRef.current;
    if (!section || !('IntersectionObserver' in window)) {
      loadActivities();
    } else {
      observer = new IntersectionObserver((entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          loadActivities();
          observer?.disconnect();
        }
      }, { rootMargin: '200px' });
      observer.observe(section);
    }

    return () => {
      mounted = false;
      observer?.disconnect();
      controller?.abort();
    };
  }, []);

  const days = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const start = new Date(today);
    start.setDate(today.getDate() - today.getDay() - 51 * 7);
    const utcStart = Date.UTC(start.getFullYear(), start.getMonth(), start.getDate());
    const utcToday = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate());
    const numberOfDays = Math.floor((utcToday - utcStart) / 86_400_000) + 1;
    const gridDays = Array.from({ length: numberOfDays }, (_, index) => {
      const date = new Date(start);
      date.setDate(start.getDate() + index);
      return { date, dateKey: dateKey(date), week: Math.floor(index / 7) };
    });

    if (githubActivity.contributionDays) {
      const liveContributions = new Map(
        githubActivity.contributionDays.map(({ date, count }) => [date, count]),
      );
      const days = gridDays.map(({ date, dateKey, week }) => ({
        date,
        week,
        contributions: liveContributions.get(dateKey) ?? 0,
      }));
      const monthLabels = days.flatMap(({ date, week }, index) => {
        if (index > 0 && date.getMonth() === days[index - 1].date.getMonth()) return [];
        return [{ month: date.toLocaleDateString('en-US', { month: 'short' }), week }];
      });
      return { days, monthLabels };
    }

    const days = gridDays.map(({ date, week }) => ({ date, week, contributions: null }));
    const monthLabels = days.flatMap(({ date, week }, index) => {
      if (index > 0 && date.getMonth() === days[index - 1].date.getMonth()) return [];
      return [{ month: date.toLocaleDateString('en-US', { month: 'short' }), week }];
    });
    return { days, monthLabels };
  }, [githubActivity.contributionDays]);

  const gridDays = days.days;
  const selectedContributionCount =
    selectedDay &&
    gridDays.find(({ date }) => date.toDateString() === selectedDay.toDateString())?.contributions;

  const difficultyStats = [
    {
      label: 'EASY',
      value: leetcodeActivity.easySolved,
      total: leetcodeActivity.totalEasy,
      color: '#22C55E',
    },
    {
      label: 'MEDIUM',
      value: leetcodeActivity.mediumSolved,
      total: leetcodeActivity.totalMedium,
      color: '#F59E0B',
    },
    {
      label: 'HARD',
      value: leetcodeActivity.hardSolved,
      total: leetcodeActivity.totalHard,
      color: '#EF4444',
    },
  ];

  const githubStats = [
    {
      label: 'ACTIVE DAYS',
      value: githubActivity.activeDays === null
        ? githubLoading ? 'Loading…' : 'Unavailable'
        : `${formatNumber(githubActivity.activeDays)} days`,
    },
    {
      label: 'LONGEST STREAK',
      value: githubActivity.longestStreak === null
        ? githubLoading ? 'Loading…' : 'Unavailable'
        : `${formatNumber(githubActivity.longestStreak)} days`,
    },
    githubActivity.currentStreak === 0
      ? {
          label: 'PUBLIC REPOS',
          value: githubActivity.publicRepos === null
            ? githubLoading ? 'Loading…' : 'Unavailable'
            : formatNumber(githubActivity.publicRepos),
        }
      : {
          label: 'CURRENT STREAK',
          value: githubActivity.currentStreak === null
            ? githubLoading ? 'Loading…' : 'Unavailable'
            : `${formatNumber(githubActivity.currentStreak)} days`,
        },
  ];

  const primaryLanguage = leetcodeActivity.languages[0];
  const leetcodeStats = [
    leetcodeActivity.rating !== null
      ? { label: 'CONTEST RATING', value: formatNumber(Math.round(leetcodeActivity.rating)) }
      : leetcodeActivity.acceptanceRate !== null
        ? { label: 'ACCEPTANCE RATE', value: `${formatNumber(leetcodeActivity.acceptanceRate)}%` }
        : leetcodeActivity.globalRank !== null
          ? { label: 'GLOBAL RANK', value: formatNumber(leetcodeActivity.globalRank) }
          : { label: 'CONTEST RATING', value: leetcodeLoading ? 'Loading…' : 'Unavailable' },
    {
      label: 'PRIMARY LANG',
      value: primaryLanguage?.name ?? (leetcodeLoading ? 'Loading…' : 'Unavailable'),
    },
    {
      label: 'ACTIVE DAYS',
      value: leetcodeActivity.activeDays === null
        ? leetcodeLoading ? 'Loading…' : 'Unavailable'
        : formatNumber(leetcodeActivity.activeDays),
    },
  ];

  const renderStatBoxes = (stats: typeof githubStats) => (
    <div className="grid grid-cols-3 gap-2.5">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="min-w-0 rounded-[10px] border border-[#E4E4E7] bg-[#FAFAFA] px-2.5 py-3 dark:border-white/10 dark:bg-[#1C1C22]"
        >
          <div className="truncate font-label text-[9px] leading-tight text-[#71717A] dark:text-[#A1A1AA]">
            {stat.label}
          </div>
          <div className="mt-1 truncate font-heading text-lg leading-tight text-[#18181B] dark:text-white">
            {stat.value}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <section
      ref={sectionRef}
      id="section-05"
      className="relative flex h-full min-h-screen w-full flex-col px-4 pb-4 pt-[76px] sm:px-6 sm:pb-5 md:px-10 md:pt-[88px] lg:px-12 lg:pt-[92px]"
      style={{ backgroundColor: 'var(--bg)' }}
    >
      <header className="mb-5 sm:mb-6">
        <h2 className="section-heading font-heading text-[clamp(2rem,4vw,3rem)] font-extrabold leading-none tracking-[-0.04em] text-[var(--ink)]">
          CODING <span className="text-[#FF3B00]">ACTIVITY</span>
        </h2>
        <div className="section-subtitle mt-2">
          <p className="mb-0 text-sm text-[#71717A] dark:text-[#A1A1AA]">
            Live from GitHub and LeetCode: what I ship, and how I practise.
          </p>
        </div>
      </header>

      <div className="grid flex-1 grid-cols-1 gap-4 lg:grid-cols-[58fr_42fr] lg:gap-5">
        <motion.article
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
          className="flex min-w-0 flex-col rounded-2xl border border-[#E4E4E7] bg-white p-5 dark:border-white/15 dark:bg-[#141418] sm:p-7"
          aria-labelledby="github-card-title"
        >
          <div className="mb-5 flex items-center justify-between border-b border-[#E4E4E7] pb-4 dark:border-white/12">
            <h3 id="github-card-title" className="font-label text-xs tracking-[0.12em]">
              <span className="text-[#FF3B00]">01</span>{' '}
              <span className="text-[#18181B] dark:text-white">GITHUB</span>
            </h3>
            <a
              href={ghData.profileUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => soundManager.playPop()}
              className="flex items-center gap-1 font-mono text-xs text-[#18181B] transition-colors hover:text-[#FF3B00] dark:text-white dark:hover:text-[#FF3B00]"
              aria-label={`Open GitHub profile for @${ghData.username}`}
            >
              @{ghData.username} <ExternalLink size={12} aria-hidden="true" />
            </a>
          </div>

          <div className="mb-5">
            <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
              <span className="font-heading text-[28px] font-bold leading-none text-[#18181B] dark:text-white">
                {githubActivity.contributions === null
                  ? githubLoading ? 'Loading…' : 'Unavailable'
                  : formatNumber(githubActivity.contributions)}
              </span>
              <span className="text-sm text-[#71717A] dark:text-[#A1A1AA]">contributions in the last year</span>
            </div>
          </div>

          <div className="min-w-0">
            <div className="mb-2 grid grid-cols-[repeat(52,minmax(0,1fr))] text-[10px] font-mono text-[#71717A] dark:text-[#A1A1AA]">
              {days.monthLabels.map(({ month, week }, index) => (
                <span key={`${month}-${week}-${index}`} style={{ gridColumnStart: week + 1 }}>
                  {month}
                </span>
              ))}
            </div>
            <div
              className="grid grid-flow-col grid-cols-[repeat(52,minmax(0,1fr))] grid-rows-7 gap-[3px]"
              role="grid"
              aria-label="GitHub contributions over the last year"
              onMouseLeave={() => setSelectedDay(null)}
            >
              {gridDays.map(({ date, contributions }) => {
                const level = contributions === null
                  ? 0
                  :
                  contributions === 0
                    ? 0
                    : contributions < 4
                      ? 1
                      : contributions < 8
                        ? 2
                        : contributions < 12
                          ? 3
                          : 4;
                const description = contributions === null
                  ? `Contribution data unavailable · ${formatDate(date)}`
                  : `${contributions} contribution${contributions === 1 ? '' : 's'} · ${formatDate(date)}`;

                return (
                  <button
                    key={date.toISOString()}
                    type="button"
                    role="gridcell"
                    aria-label={description}
                    title={description}
                    onMouseEnter={() => setSelectedDay(contributions === null ? null : date)}
                    onFocus={() => setSelectedDay(contributions === null ? null : date)}
                    onClick={() => setSelectedDay(contributions === null ? null : date)}
                    className="aspect-square min-w-0 rounded-[2px] outline-none transition-transform hover:z-10 hover:scale-125 focus-visible:z-10 focus-visible:scale-125 focus-visible:ring-2 focus-visible:ring-[#FF3B00]"
                    style={{ backgroundColor: heatmapColors[level] }}
                  />
                );
              })}
            </div>
          </div>

          <div className="mt-4 flex min-h-6 flex-wrap items-center justify-between gap-2">
            <p className="min-h-5 text-xs text-[#52525B] dark:text-[#A1A1AA]" aria-live="polite">
              {selectedDay && selectedContributionCount !== undefined && selectedContributionCount !== null
                ? `${selectedContributionCount} contribution${selectedContributionCount === 1 ? '' : 's'} · ${formatDate(selectedDay)}`
                : 'Hover a day for details'}
            </p>
            <div className="flex items-center gap-1.5 text-[10px] text-[#71717A] dark:text-[#A1A1AA]" aria-label="Contribution intensity legend">
              <span>Less</span>
              {heatmapColors.map((color) => (
                <span
                  key={color}
                  className="h-2.5 w-2.5 rounded-[2px] border border-black/5 dark:border-white/10"
                  style={{ backgroundColor: color }}
                />
              ))}
              <span>More</span>
            </div>
          </div>

          <div className="mt-auto border-t border-[#E4E4E7] pt-5 dark:border-white/12">
            {renderStatBoxes(githubStats)}
          </div>
        </motion.article>

        <motion.article
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, delay: 0.08 }}
          className="flex min-w-0 flex-col rounded-2xl border border-[#E4E4E7] bg-white p-5 dark:border-white/15 dark:bg-[#141418] sm:p-7"
          aria-labelledby="leetcode-card-title"
        >
          <div className="mb-5 flex items-center justify-between border-b border-[#E4E4E7] pb-4 dark:border-white/12">
            <h3 id="leetcode-card-title" className="font-label text-xs tracking-[0.12em]">
              <span className="text-[#FF3B00]">02</span>{' '}
              <span className="text-[#18181B] dark:text-white">LEETCODE</span>
            </h3>
            <a
              href={lcData.profileUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => soundManager.playPop()}
              className="flex items-center gap-1 font-mono text-xs text-[#18181B] transition-colors hover:text-[#FF3B00] dark:text-white dark:hover:text-[#FF3B00]"
              aria-label={`Open LeetCode profile for @${lcData.username}`}
            >
              @{lcData.username} <ExternalLink size={12} aria-hidden="true" />
            </a>
          </div>

          <div className="grid grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] items-center gap-4">
            <div className="min-w-0">
              <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                <span className="font-heading text-[36px] font-bold leading-none tracking-[-0.05em] text-[#FF3B00]">
                    {leetcodeActivity.totalSolved === null
                      ? leetcodeLoading ? 'Loading…' : 'Unavailable'
                      : formatNumber(leetcodeActivity.totalSolved)}
                </span>
                <span className="font-sans text-[11px] normal-case text-[#71717A] dark:text-[#A1A1AA]">problems solved</span>
              </div>
            </div>
            <div className="flex min-w-0 flex-col gap-3">
              {difficultyStats.map((stat) => (
                <div key={stat.label} className="min-w-0">
                  <div className="mb-1 flex items-center justify-between text-[10px] font-label">
                    <span style={{ color: stat.color }}>{stat.label}</span>
                    <span className="font-mono text-[#18181B] dark:text-white">
                      {stat.value === null || stat.total === null
                        ? leetcodeLoading ? 'Loading…' : 'Unavailable'
                        : `${formatNumber(stat.value)} / ${formatNumber(stat.total)}`}
                    </span>
                  </div>
                  <div
                    className="h-1.5 overflow-hidden rounded-full bg-[#F4F4F5] dark:bg-white/10"
                    role="progressbar"
                    aria-label={`${stat.label.toLowerCase()} problems solved`}
                    aria-valuenow={stat.value ?? undefined}
                    aria-valuemin={0}
                    aria-valuemax={stat.total ?? undefined}
                  >
                    <div
                      className="h-full rounded-full"
                      style={{
                        width:
                          stat.value === null || stat.total === null || stat.total === 0
                            ? '0%'
                            : `${Math.max(0, Math.min(100, (stat.value / stat.total) * 100))}%`,
                        backgroundColor: stat.color,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-2">
            {leetcodeActivity.languages.map((language) => (
              <span
                key={language.name}
                className="rounded-full border border-[#E4E4E7] px-3 py-1 font-mono text-[11px] text-[#3F3F46] dark:border-white/15 dark:bg-white/[0.04] dark:text-[#D4D4D8]"
              >
                {language.name} · {formatNumber(language.count)}
              </span>
            ))}
            {leetcodeActivity.languages.length === 0 && (
              <span className="font-mono text-[11px] text-[#71717A] dark:text-[#A1A1AA]">
                {leetcodeLoading ? 'Loading languages…' : 'Language data unavailable'}
              </span>
            )}
            <a
              href={codingStats.codolio.profileUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => soundManager.playPop()}
              className="flex items-center gap-1 rounded-full border border-[#E4E4E7] px-3 py-1 font-mono text-[11px] text-[#3F3F46] transition-colors hover:border-[#FF3B00] hover:text-[#FF3B00] dark:border-white/15 dark:text-[#E4E4E7] dark:hover:border-[#FF3B00] dark:hover:text-[#FF3B00]"
              aria-label={`Open Codolio profile for ${codingStats.codolio.username}`}
            >
              CODOLIO <ExternalLink size={10} aria-hidden="true" />
            </a>
          </div>

          <div className="mt-auto border-t border-[#E4E4E7] pt-5 dark:border-white/12">
            {renderStatBoxes(leetcodeStats)}
          </div>
        </motion.article>
      </div>

    </section>
  );
};
