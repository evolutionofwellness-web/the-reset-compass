import { UserLog, UserStats, RankInfo, WeeklyFocus, UserInsights, CompassMode, UserReview, Activity, OnboardingData, DailyCheckInData, DailyRecommendation } from '../types';

const STORAGE_KEYS = {
  LOGS: 'reset_compass_logs',
  STATS: 'reset_compass_stats',
  REVIEWS: 'reset_compass_reviews',
};

const MAX_LOGS = 1000;
const MAX_SEEN_TITLES = 50;

export const RANKS: RankInfo[] = [
  { id: 'novice', title: "Novice", threshold: 0, perk: "Begin your path", color: "text-slate-400", shadow: "shadow-none", aura: "None" },
  { id: 'seeker', title: "Seeker", threshold: 250, perk: "Bronze Aura & Consistency Badge", color: "text-orange-700", shadow: "shadow-[0_0_60px_rgba(194,65,12,0.3)]", aura: "Bronze" },
  { id: 'wanderer', title: "Wanderer", threshold: 1000, perk: "Silver Aura", color: "text-slate-300", shadow: "shadow-[0_0_70px_rgba(203,213,225,0.4)]", aura: "Silver" },
  { id: 'pathfinder', title: "Pathfinder", threshold: 2500, perk: "Gold Aura", color: "text-amber-400", shadow: "shadow-[0_0_80px_rgba(251,191,36,0.5)]", aura: "Gold" },
  { id: 'guide', title: "Guide", threshold: 5000, perk: "Platinum Aura", color: "text-cyan-400", shadow: "shadow-[0_0_100px_rgba(34,211,238,0.6)]", aura: "Platinum" },
  { id: 'voyager', title: "Voyager", threshold: 10000, perk: "Prismatic Aura", color: "text-indigo-400", shadow: "shadow-[0_0_110px_rgba(129,140,248,0.6)]", aura: "Prism" },
  { id: 'luminary', title: "Luminary", threshold: 18000, perk: "Stellar Core", color: "text-rose-400", shadow: "shadow-[0_0_120px_rgba(251,113,133,0.7)]", aura: "Stellar" },
  { id: 'sage', title: "Sage", threshold: 30000, perk: "Etheric Pulse", color: "text-violet-300", shadow: "shadow-[0_0_130px_rgba(167,139,250,0.8)]", aura: "Etheric" },
  { id: 'architect', title: "Architect", threshold: 40000, perk: "Void Walker", color: "text-emerald-300", shadow: "shadow-[0_0_140px_rgba(52,211,153,0.8)]", aura: "Void" },
  { id: 'ascendant', title: "Ascendant", threshold: 50000, perk: "AI Wellness Advice (Unlocked)", color: "text-white", shadow: "shadow-[0_0_150px_rgba(255,255,255,0.9)]", aura: "Light" },
];

const WEEKLY_FOCUS_LIBRARY = [
    { title: "The Hydration Anchor", description: "Drink 64oz of water daily to keep your energy steady and your mind clear. Staying hydrated is the best way to help your body feel balanced.", totalDays: 7 },
    { title: "Digital Sunset", description: "Turn off all screens 60 minutes before bed to help your body get ready for sleep and give your mind a break from the digital world.", totalDays: 7 },
    { title: "The Pattern Break", description: "Notice one negative thought today and take a 1-minute break to reset (like splashing cold water on your face) to clear your head.", totalDays: 7 },
    { title: "Social Micro-Hits", description: "Send a quick 'thinking of you' or thank you text to someone today. It’s a great way to feel more connected and positive.", totalDays: 7 },
    { title: "Posture Integrity", description: "Do 3 quick shoulder stretches or wall-pushes today to help release tension in your neck and shoulders.", totalDays: 7 },
    { title: "The Sight-Sound Snap", description: "Once a day, stop and name 5 colors and 5 sounds around you. It’s a simple way to feel more present and calm.", totalDays: 7 }
];

export const getNextRank = (currentXP: number) => {
    return RANKS.find(r => r.threshold > currentXP) || null;
};

export const getLevelTitle = (xp: number): string => {
  const level = [...RANKS].reverse().find(l => xp >= l.threshold);
  return level ? level.title : "Novice";
};

export const getLogs = (): UserLog[] => {
  try {
    const logs = localStorage.getItem(STORAGE_KEYS.LOGS);
    return logs ? JSON.parse(logs) : [];
  } catch (e) {
    console.error("Failed to load logs", e);
    return [];
  }
};

export const saveLog = (log: UserLog): UserStats => {
  let currentLogs = getLogs();
  if (currentLogs.length >= MAX_LOGS) {
      currentLogs = currentLogs.slice(0, MAX_LOGS - 1);
  }
  const updatedLogs = [log, ...currentLogs];
  localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(updatedLogs));
  return updateStats(log);
};

export const saveReview = (review: UserReview) => {
    const reviews = JSON.parse(localStorage.getItem(STORAGE_KEYS.REVIEWS) || '[]');
    reviews.push(review);
    localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(reviews));
    const stats = getStats();
    stats.hasRatedApp = true;
    stats.xp = (stats.xp || 0) + 50; 
    saveStats(stats);
    return stats;
}

export const getStats = (): UserStats => {
  try {
    const stats = localStorage.getItem(STORAGE_KEYS.STATS);
    if (stats) {
        const parsed = JSON.parse(stats);
        if (parsed.xp === undefined) parsed.xp = parsed.totalActivities * 50;
        if (!parsed.lastActivityTitles) parsed.lastActivityTitles = {};
        if (!parsed.dailyModeActivities) parsed.dailyModeActivities = {};
        if (parsed.remindersEnabled === undefined) parsed.remindersEnabled = false;
        if (parsed.reminderTime === undefined) parsed.reminderTime = "09:00";
        if (!parsed.seenTitles) parsed.seenTitles = [];
        if (parsed.isPro === undefined) parsed.isPro = false;
        return parsed;
    }
  } catch (e) {}
  return { 
      username: undefined, onboarding: undefined, lastCheckIn: undefined, currentRecommendation: null, recommendationHistory: [],
      streak: 0, lastLoginDate: null, totalActivities: 0, xp: 0, level: "Novice", 
      modeBreakdown: {}, hasConsented: false, hasRatedApp: false, isPro: false,
      dailyReshuffles: 0, dailyMainActivitiesCompleted: 0, lastReshuffleDate: null, 
      lastDailyResetDate: null, currentWeeklyFocus: null, lastActivityTitles: {},
      dailyModeActivities: {}, remindersEnabled: false, reminderTime: "09:00", seenTitles: [],
      surpriseMeUsedToday: false
  };
};

export const trackSeenTitle = (title: string): UserStats => {
  const stats = getStats();
  if (!stats.seenTitles) stats.seenTitles = [];
  
  // Remove if already exists, then add to front
  const updated = [title, ...stats.seenTitles.filter(t => t !== title)].slice(0, MAX_SEEN_TITLES);
  stats.seenTitles = updated;
  saveStats(stats);
  return stats;
};

export const saveStats = (stats: UserStats) => {
    try {
        localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(stats));
    } catch (e) {
        console.error("Failed to save stats to localStorage", e);
        if (e instanceof DOMException && e.name === 'QuotaExceededError') {
            console.warn("LocalStorage quota exceeded. Attempting to prune logs.");
            const logs = getLogs();
            if (logs.length > 100) {
                try {
                    localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(logs.slice(0, 50)));
                    localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(stats));
                } catch (retryError) {
                    console.error("Still failing to save stats after pruning logs", retryError);
                }
            }
        }
    }
};

export const saveUsername = (name: string): UserStats => {
    const stats = getStats();
    stats.username = name;
    saveStats(stats);
    return stats;
};

export const saveLastActivityTitle = (mode: CompassMode | null, title: string) => {
    if (!mode) return getStats();
    const stats = getStats();
    if (!stats.lastActivityTitles) stats.lastActivityTitles = {};
    stats.lastActivityTitles[mode] = title;
    saveStats(stats);
    return stats;
};

export const saveReminderSettings = (enabled: boolean, time: string) => {
    const stats = getStats();
    stats.remindersEnabled = enabled;
    stats.reminderTime = time;
    saveStats(stats);
    return stats;
};

export const ensureWeeklyFocus = () => {
    const stats = getStats();
    const now = new Date();
    
    const shouldRefresh = 
        !stats.currentWeeklyFocus || 
        stats.currentWeeklyFocus.isComplete || 
        (new Date(stats.currentWeeklyFocus.startDate).getTime() + (7 * 24 * 60 * 60 * 1000) < now.getTime());

    if (shouldRefresh) {
        const randomFocus = WEEKLY_FOCUS_LIBRARY[Math.floor(Math.random() * WEEKLY_FOCUS_LIBRARY.length)];
        stats.currentWeeklyFocus = {
            id: Math.random().toString(36).substring(7),
            title: randomFocus.title,
            description: randomFocus.description,
            startDate: now.toISOString(),
            currentDay: 0,
            totalDays: randomFocus.totalDays,
            isComplete: false
        };
        saveStats(stats);
    }
    return stats;
};

export const checkInWeeklyFocus = () => {
    const stats = getStats();
    if (!stats.currentWeeklyFocus || stats.currentWeeklyFocus.isComplete) return stats;
    
    const today = new Date().toDateString();
    const lastProgress = stats.currentWeeklyFocus.lastProgressDate ? new Date(stats.currentWeeklyFocus.lastProgressDate).toDateString() : null;
    
    if (today !== lastProgress) {
        stats.currentWeeklyFocus.currentDay += 1;
        stats.currentWeeklyFocus.lastProgressDate = new Date().toISOString();
        
        if (stats.currentWeeklyFocus.currentDay >= stats.currentWeeklyFocus.totalDays) {
            stats.currentWeeklyFocus.isComplete = true;
            stats.xp += 200; 
        } else {
            stats.xp += 10; 
        }
        saveStats(stats);
    }
    return stats;
};

export const saveOnboarding = (data: OnboardingData): UserStats => {
    const stats = getStats();
    stats.onboarding = data;
    saveStats(stats);
    return stats;
};

export const saveCheckIn = (data: DailyCheckInData): UserStats => {
    const stats = getStats();
    stats.lastCheckIn = data;
    saveStats(stats);
    return stats;
};

export const saveRecommendation = (rec: DailyRecommendation): UserStats => {
    const stats = getStats();
    stats.currentRecommendation = rec;
    if (!stats.recommendationHistory) stats.recommendationHistory = [];
    
    // Add to history if not already there (by ID)
    if (!stats.recommendationHistory.find(r => r.id === rec.id)) {
        stats.recommendationHistory = [rec, ...stats.recommendationHistory].slice(0, 30);
    }
    
    saveStats(stats);
    return stats;
};

export const completeRecommendationPart = (part: 'move' | 'fuel' | 'recover'): UserStats => {
    const stats = getStats();
    if (stats.currentRecommendation) {
        if (!stats.currentRecommendation.completedParts) stats.currentRecommendation.completedParts = [];
        if (!stats.currentRecommendation.completedParts.includes(part)) {
            stats.currentRecommendation.completedParts.push(part);
            stats.xp += 25; // Bonus XP for completing a part
            stats.totalActivities += 1;
            stats.level = getLevelTitle(stats.xp);
        }
    }
    saveStats(stats);
    return stats;
};

export const useSurpriseMe = (): UserStats => {
    const stats = getStats();
    stats.surpriseMeUsedToday = true;
    saveStats(stats);
    return stats;
};

export const updateStats = (newLog?: UserLog) => {
  const stats = getStats();
  const today = new Date().toDateString();
  const lastLogin = stats.lastLoginDate ? new Date(stats.lastLoginDate).toDateString() : null;
  let newStreak = stats.streak;

  const lastReset = stats.lastDailyResetDate ? new Date(stats.lastDailyResetDate).toDateString() : null;
  if (today !== lastReset) {
      stats.dailyReshuffles = 0;
      stats.dailyMainActivitiesCompleted = 0; 
      stats.dailyModeActivities = {}; 
      stats.surpriseMeUsedToday = false;
      stats.dayCompletedToday = false;
      stats.lastDailyResetDate = new Date().toISOString();
  }

  if (newLog && newLog.completed) {
    stats.totalActivities += 1;
    stats.xp = (stats.xp || 0) + (newLog.xpEarned || (newLog.mode === 'Quick Win' ? 15 : 50));
    if (newLog.mode !== 'Quick Win') stats.dailyMainActivitiesCompleted = (stats.dailyMainActivitiesCompleted || 0) + 1;
    stats.level = getLevelTitle(stats.xp);
    const modeKey = newLog.mode;
    stats.modeBreakdown[modeKey] = (stats.modeBreakdown[modeKey] || 0) + 1;
    
    if (lastLogin !== today) {
       if (stats.lastLoginDate) {
           const yesterday = new Date(); yesterday.setDate(yesterday.getDate() - 1);
           if (yesterday.toDateString() === lastLogin) newStreak += 1;
           else newStreak = 1;
       } else newStreak = 1;
       stats.lastLoginDate = new Date().toISOString();
    }
  }
  stats.streak = newStreak;
  saveStats(stats);
  return stats;
};

export const incrementReshuffleCount = () => {
    const stats = getStats();
    stats.dailyReshuffles = (stats.dailyReshuffles || 0) + 1;
    stats.lastReshuffleDate = new Date().toISOString();
    saveStats(stats);
    return stats;
};

export const upgradeToCompassPlus = (plan: 'monthly' | 'yearly') => {
    const stats = getStats();
    stats.isPro = true;
    stats.subscriptionPlan = plan;
    saveStats(stats);
    return stats;
};

export const completeDay = (): UserStats => {
    const stats = getStats();
    if (stats.dayCompletedToday) return stats;

    const today = new Date().toDateString();
    const lastLogin = stats.lastLoginDate ? new Date(stats.lastLoginDate).toDateString() : null;
    
    stats.dayCompletedToday = true;
    stats.xp += 50; // Main XP bonus
    stats.totalActivities += 1;
    stats.level = getLevelTitle(stats.xp);

    if (lastLogin !== today) {
        if (stats.lastLoginDate) {
            const yesterday = new Date(); yesterday.setDate(yesterday.getDate() - 1);
            if (yesterday.toDateString() === lastLogin) stats.streak += 1;
            else stats.streak = 1;
        } else stats.streak = 1;
        stats.lastLoginDate = new Date().toISOString();
    }

    saveStats(stats);
    return stats;
};

export const clearAllData = () => {
    localStorage.removeItem(STORAGE_KEYS.LOGS);
    localStorage.removeItem(STORAGE_KEYS.STATS);
    localStorage.removeItem(STORAGE_KEYS.REVIEWS);
    window.location.reload();
};

export const analyzeInsights = (logs: UserLog[]): UserInsights => {
    if (!logs.length) return { 
        dominantType: "None", peakDay: "None", weeklyEnergyTrend: [], totalTimeInvested: 0,
        balanceScore: 0, wellnessStyle: { title: "The Beginner", description: "Your journey has just begun.", color: "text-slate-400" },
        timeOfDayBreakdown: { morning: 0, afternoon: 0, evening: 0 }, recentTrendDescription: "Not enough data yet."
    };

    const dayCounts: Record<string, number> = {};
    let totalMinutes = 0;
    const timeOfDayCounts = { morning: 0, afternoon: 0, evening: 0 };
    
    const today = new Date();
    const last7Days = Array.from({length: 7}, (_, i) => {
        const d = new Date(); d.setDate(today.getDate() - (6 - i));
        return d.toDateString();
    });
    
    const trendMap: Record<string, number[]> = {};
    last7Days.forEach(d => trendMap[d] = []);

    logs.forEach(log => {
        const day = new Date(log.date).toLocaleDateString('en-US', { weekday: 'long' });
        dayCounts[day] = (dayCounts[day] || 0) + 1;
        const hour = new Date(log.date).getHours();
        if (hour >= 5 && hour < 12) timeOfDayCounts.morning++;
        else if (hour >= 12 && hour < 18) timeOfDayCounts.afternoon++;
        else timeOfDayCounts.evening++;
        totalMinutes += (log.mode === 'Quick Win' ? 2 : 10); 
        if (trendMap[new Date(log.date).toDateString()]) trendMap[new Date(log.date).toDateString()].push(1);
    });

    const peakDay = Object.entries(dayCounts).sort((a,b) => b[1] - a[1])[0]?.[0] || "None";
    const weeklyEnergyTrend = last7Days.map(dateStr => {
        const logsOnDay = trendMap[dateStr];
        return logsOnDay.length === 0 ? 0 : Math.min(100, logsOnDay.length * 20);
    });

    const wellnessStyle = { title: "The Consistent", description: "You show up for yourself every day.", color: "text-emerald-400" };

    return {
        dominantType: "Balanced", peakDay, weeklyEnergyTrend, totalTimeInvested: totalMinutes,
        balanceScore: Math.min(100, logs.length * 5), wellnessStyle, timeOfDayBreakdown: timeOfDayCounts,
        recentTrendDescription: "Your wellness routine is becoming a habit."
    };
};