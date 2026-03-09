
export const APP_VERSION = '2.5.1';

export enum CompassMode {
  Surviving = 'Surviving',
  Drifting = 'Drifting',
  Healing = 'Healing',
  Grounded = 'Grounded',
  Growing = 'Growing',
  Flowing = 'Flowing'
}

export interface Activity {
  title: string;
  description: string;
  duration: string;
  benefits: string;
  steps: string[];
  type: 'breathing' | 'movement' | 'writing' | 'reflection' | 'planning' | 'creative' | 'rest' | 'other' | 'cognitive' | 'nutritional';
}

export interface UserLog {
  id: string;
  date: string; // ISO string
  mode: CompassMode | 'Quick Win';
  activityTitle: string;
  completed: boolean;
  notes?: string;
  xpEarned: number;
}

export interface ModeBreakdown {
  [key: string]: number;
}

export interface RankInfo {
    id: string;
    title: string;
    threshold: number;
    perk: string;
    color: string;
    shadow: string;
    aura: string;
}

export interface WeeklyFocus {
    id: string;
    title: string;
    description: string;
    startDate: string;
    currentDay: number;
    totalDays: number;
    isComplete: boolean;
    lastProgressDate?: string;
}

export interface UserReview {
    id: string;
    rating: number;
    text: string;
    tags: string[];
    date: string;
}

export interface OnboardingData {
  mainGoal: string;
  mainGoalOther?: string;
  limitations: string;
  limitationsOther?: string;
  location: string;
  locationOther?: string;
}

export interface DailyCheckInData {
  energy: 'empty' | 'getting_by' | 'good';
  time: '5_10' | '20_30' | '45_plus';
  date: string; // ISO date string
}

export interface RecommendationPart {
  title: string;
  action: string;
  benefit: string;
}

export interface DailyRecommendation {
  id: string;
  date: string;
  header: string;
  move: RecommendationPart;
  fuel: RecommendationPart;
  recover: RecommendationPart;
  completedParts: string[]; // ['move', 'fuel', 'recover']
}

export interface UserStats {
  username?: string;
  onboarding?: OnboardingData;
  lastCheckIn?: DailyCheckInData;
  currentRecommendation?: DailyRecommendation | null;
  recommendationHistory?: DailyRecommendation[];
  streak: number;
  lastLoginDate: string | null;
  totalActivities: number;
  xp: number;
  level: string;
  modeBreakdown: ModeBreakdown;
  hasConsented: boolean;
  hasRatedApp: boolean;
  isPro: boolean;
  subscriptionPlan?: 'monthly' | 'yearly';
  dailyReshuffles: number;
  dailyMainActivitiesCompleted: number;
  lastReshuffleDate: string | null;
  lastDailyResetDate?: string | null;
  currentWeeklyFocus: WeeklyFocus | null;
  lastActivityTitles?: Record<string, string>; 
  dailyModeActivities?: Record<string, Activity>;
  remindersEnabled: boolean;
  reminderTime: string;
  seenTitles?: string[]; // Track recently seen activities
  surpriseMeUsedToday?: boolean;
  dayCompletedToday?: boolean;
  walkthroughShown?: boolean;
}

export interface OracleResponse {
    answer: string;
}

export interface UserInsights {
    dominantType: string;
    peakDay: string;
    weeklyEnergyTrend: number[];
    totalTimeInvested: number;
    balanceScore: number;
    wellnessStyle: {
        title: string;
        description: string;
        color: string;
    };
    timeOfDayBreakdown: {
        morning: number;
        afternoon: number;
        evening: number;
    };
    recentTrendDescription: string;
}