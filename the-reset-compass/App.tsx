import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'motion/react';
import Compass from './components/Compass';
import ActivityCard from './components/ActivityCard';
import HistoryModal from './components/HistoryModal';
import GuideModal from './components/GuideModal';
import ModeDetailModal from './components/ModeDetailModal';
import AboutModal from './components/AboutModal';
import CelebrationOverlay from './components/CelebrationOverlay';
import QuickWinCelebration from './components/QuickWinCelebration';
import PremiumModal from './components/PremiumModal';
import PurchaseSuccessModal from './components/PurchaseSuccessModal';
import JourneyModal from './components/JourneyModal';
import FindBearingModal from './components/FindBearingModal';
import OracleModal from './components/OracleModal';
import WeeklyFocusWidget from './components/WeeklyFocusWidget';
import LimitModal from './components/LimitModal';
import OnboardingModal from './components/OnboardingModal';
import SettingsModal from './components/SettingsModal';
import ShareModal from './components/ShareModal';
import ReviewModal from './components/ReviewModal';
import ReloadPrompt from './components/ReloadPrompt';
import CrisisModal from './components/CrisisModal';
import InstallModal from './components/InstallModal';
import LegalModal from './components/LegalModal';
import ContactModal from './components/ContactModal';
import AnimatedPresence from './components/AnimatedPresence';
import OnboardingFlow from './components/OnboardingFlow';
import DailyCheckIn from './components/DailyCheckIn';
import DailyRecommendationView from './components/DailyRecommendationView';
import DayCompleteView from './components/DayCompleteView';
import StreakMilestone from './components/StreakMilestone';
import WeeklyChallengeCard from './components/WeeklyChallengeCard';
import SecondaryMenu from './components/SecondaryMenu';
import RankUpModal from './components/RankUpModal';
import FloatingXP from './components/FloatingXP';
import { CompassMode, Activity, UserLog, UserStats, OnboardingData, DailyCheckInData, DailyRecommendation, RankInfo } from './types';
import { generateActivityForMode, generateQuickWin, generateDailyRecommendation, FALLBACK_RECOMMENDATIONS } from './services/geminiService';
import Walkthrough from './components/Walkthrough';
import { 
  saveLog, updateStats, upgradeToCompassPlus, saveUsername, saveReview, 
  saveLastActivityTitle, getLogs, checkInWeeklyFocus, getStats, saveStats,
  incrementReshuffleCount, ensureWeeklyFocus, trackSeenTitle,
  saveOnboarding, saveCheckIn, saveRecommendation, completeRecommendationPart, useSurpriseMe,
  completeDay,
  RANKS
} from './services/storageService';
import { checkAndTriggerDailyReminder, sendLocalNotification } from './services/notificationService';
import { Menu, Award, Zap, CheckCircle2, AlertCircle } from 'lucide-react';

const App: React.FC = () => {
  const [view, setView] = useState<'dashboard' | 'activity' | 'compass'>('dashboard');
  const [selectedModeForConfirmation, setSelectedModeForConfirmation] = useState<CompassMode | null>(null);
  const [currentMode, setCurrentMode] = useState<CompassMode | 'Quick Win' | null>(null);
  const [activity, setActivity] = useState<Activity | null>(null);
  const [activityId, setActivityId] = useState<string>(''); 
  const [isLoading, setIsLoading] = useState(false);
  const [currentDuration, setCurrentDuration] = useState<string>('medium');
  const [sessionAvoidTitles, setSessionAvoidTitles] = useState<string[]>([]);
  
  const [showHistory, setShowHistory] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [showQuickWinCelebration, setShowQuickWinCelebration] = useState(false);
  const [showPremium, setShowPremium] = useState(false);
  const [showPurchaseSuccess, setShowPurchaseSuccess] = useState(false);
  const [showJourney, setShowJourney] = useState(false);
  const [showFindBearing, setShowFindBearing] = useState(false);
  const [showOracle, setShowOracle] = useState(false);
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [showCrisis, setShowCrisis] = useState(false);
  const [showInstallModal, setShowInstallModal] = useState(false);
  const [showLegal, setShowLegal] = useState(false);
  const [showContact, setShowContact] = useState(false);

  const [showOnboardingFlow, setShowOnboardingFlow] = useState(false);
  const [showDailyCheckIn, setShowDailyCheckIn] = useState(false);
  const [showSecondaryMenu, setShowSecondaryMenu] = useState(false);
  const [showStreakMilestone, setShowStreakMilestone] = useState(false);
  const [milestoneDays, setMilestoneDays] = useState(0);
  const [isGeneratingRecommendation, setIsGeneratingRecommendation] = useState(false);
  const [recommendationError, setRecommendationError] = useState<boolean>(false);
  const [loadingText, setLoadingText] = useState("Reading your day.");
  const [loadingTimer, setLoadingTimer] = useState(0);
  const [showToast, setShowToast] = useState<{ message: string; type: 'error' | 'success' | 'info' } | null>(null);

  const [showRankUp, setShowRankUp] = useState(false);
  const [showWalkthrough, setShowWalkthrough] = useState(false);
  const [newRank, setNewRank] = useState<RankInfo | null>(null);
  const [floatingXPs, setFloatingXPs] = useState<{ id: string; xp: number; x: number; y: number }[]>([]);

  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [lastEarnedXP, setLastEarnedXP] = useState(0);
  const [customShareData, setCustomShareData] = useState<any>(null);
  
  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => {
        setShowToast(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  const triggerToast = (message: string, type: 'error' | 'success' | 'info' = 'error') => {
    setShowToast({ message, type });
  };
  const [stats, setStats] = useState<UserStats>(getStats());
  const [logs, setLogs] = useState<UserLog[]>(getLogs());
  const [suggestedReason, setSuggestedReason] = useState<string | null>(null);

  const loadingMessages = [
    "Reading your day.",
    "Figuring out what fits.",
    "Almost there.",
    "Putting it together for you.",
    "One moment."
  ];

  // Background Reminder Loop
  useEffect(() => {
    const interval = setInterval(() => {
        if (stats.remindersEnabled && stats.reminderTime) {
            checkAndTriggerDailyReminder(
                stats.reminderTime,
                stats.lastLoginDate,
                () => {
                    const lastNudge = localStorage.getItem('last_nudge_date');
                    const today = new Date().toDateString();
                    
                    if (lastNudge !== today) {
                        sendLocalNotification(
                            "Compass Reset", 
                            "It's time to check your direction. Where are you now?"
                        );
                        localStorage.setItem('last_nudge_date', today);
                    }
                }
            );
        }
    }, 30000); 
    return () => clearInterval(interval);
  }, [stats.remindersEnabled, stats.reminderTime, stats.lastLoginDate]);

  // PWA Install Logic
  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  useEffect(() => {
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone === true;
    const isPermanentlyDismissed = localStorage.getItem('compass_pwa_permanently_dismissed') === 'true';

    if (!isStandalone && !isPermanentlyDismissed) {
      const lastShown = localStorage.getItem('install_nudge_shown');
      const now = Date.now();
      if (!lastShown || (now - parseInt(lastShown) > 5 * 24 * 60 * 60 * 1000)) {
         const timer = setTimeout(() => {
           if (view === 'dashboard' && !showOnboarding && !showInstallModal) {
              setShowInstallModal(true);
              localStorage.setItem('install_nudge_shown', now.toString());
           }
         }, 10000);
         return () => clearTimeout(timer);
      }
    }
  }, [view, showOnboarding, showInstallModal]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [view, showHistory, showGuide, showAbout, showPremium, showJourney, showSettings, showOracle, showCelebration, showQuickWinCelebration, showLegal, showContact]);

  useEffect(() => {
    const s = updateStats(); 
    setStats(s);
    setLogs(getLogs());
    
    // Onboarding check
    if (!s.username) {
      setShowOnboarding(true);
    } else if (!s.onboarding) {
      setShowOnboardingFlow(true);
    } else {
      // Walkthrough check
      if (!s.walkthroughShown) {
          setShowWalkthrough(true);
      } else {
        // Daily check-in check
        const today = new Date().toDateString();
        const lastCheckInDate = s.lastCheckIn ? new Date(s.lastCheckIn.date).toDateString() : null;
        if (today !== lastCheckInDate) {
          setShowDailyCheckIn(true);
        }
      }
    }

    setStats(ensureWeeklyFocus());
  }, []);

  const handleOnboardingComplete = (data: OnboardingData) => {
    const updated = saveOnboarding(data);
    setStats(updated);
    setShowOnboardingFlow(false);
    if (!updated.walkthroughShown) {
      setShowWalkthrough(true);
    } else {
      setShowDailyCheckIn(true);
    }
  };

  useEffect(() => {
    let interval: number;
    if (isGeneratingRecommendation) {
      let index = 0;
      interval = window.setInterval(() => {
        index = (index + 1) % loadingMessages.length;
        setLoadingText(loadingMessages[index]);
        setLoadingTimer(prev => prev + 2);
      }, 2000);
    } else {
      setLoadingTimer(0);
    }
    return () => clearInterval(interval);
  }, [isGeneratingRecommendation]);

  const handleCheckInComplete = async (data: DailyCheckInData) => {
    const updated = saveCheckIn(data);
    setStats(updated);
    setShowDailyCheckIn(false);
    setRecommendationError(false);
    
    // Generate recommendation
    setIsGeneratingRecommendation(true);
    try {
      const rec = await generateDailyRecommendation(updated.onboarding!, data, updated.recommendationHistory || []);
      const withRec = saveRecommendation(rec);
      setStats(withRec);
      setIsGeneratingRecommendation(false);

      // Check for streak milestones
      const milestones = [3, 7, 14, 30];
      if (milestones.includes(withRec.streak)) {
        setMilestoneDays(withRec.streak);
        setShowStreakMilestone(true);
      }
    } catch (e) {
      console.error("Recommendation generation failed", e);
      setIsGeneratingRecommendation(false);
      setRecommendationError(true);
      triggerToast("Failed to generate your daily path. Using fallback.", "info");
    }
  };

  const handleUseFallback = () => {
    const randomFallback = FALLBACK_RECOMMENDATIONS[Math.floor(Math.random() * FALLBACK_RECOMMENDATIONS.length)];
    const withRec = saveRecommendation({ ...randomFallback, id: 'fallback-' + Date.now() });
    setStats(withRec);
    setRecommendationError(false);
  };

  const handleCompletePart = (part: 'move' | 'fuel' | 'recover') => {
    try {
      if (part === 'day_complete' as any) {
        const prevRank = stats.level;
        const updated = completeDay();
        
        // Trigger floating XP
        const id = Math.random().toString(36).substring(7);
        setFloatingXPs(prev => [...prev, { id, xp: 50, x: window.innerWidth / 2, y: window.innerHeight / 2 }]);

        if (updated.level !== prevRank) {
          const rankInfo = RANKS.find(r => r.title === updated.level);
          if (rankInfo) {
            setNewRank(rankInfo);
            setShowRankUp(true);
          }
        }
        setStats(updated);
        setLastEarnedXP(50);
        setShowCelebration(true);
        return;
      }

      const prevRank = stats.level;
      const updated = completeRecommendationPart(part);
      
      // Trigger floating XP
      const id = Math.random().toString(36).substring(7);
      setFloatingXPs(prev => [...prev, { id, xp: 25, x: window.innerWidth / 2, y: window.innerHeight / 2 }]);

      if (updated.level !== prevRank) {
        const rankInfo = RANKS.find(r => r.title === updated.level);
        if (rankInfo) {
          setNewRank(rankInfo);
          setShowRankUp(true);
        }
      }
      setStats(updated);
    } catch (e) {
      triggerToast("Could not save your progress. Check your storage.", "error");
    }
  };

  const handleSurpriseMe = async () => {
    if (!stats.isPro && stats.dailyReshuffles >= 3) {
        setShowLimitModal(true);
        return;
    }
    
    setIsGeneratingRecommendation(true);
    setRecommendationError(false);
    try {
      const rec = await generateDailyRecommendation(stats.onboarding!, stats.lastCheckIn!, stats.recommendationHistory || []);
      const withRec = saveRecommendation(rec);
      const withUsage = useSurpriseMe();
      setStats({ ...withRec, surpriseMeUsedToday: withUsage.surpriseMeUsedToday });
      setIsGeneratingRecommendation(false);
    } catch (e) {
      setIsGeneratingRecommendation(false);
      setRecommendationError(true);
      triggerToast("The mists are thick. Using fallback.", "info");
    }
  };

  const fetchActivity = useCallback(async (mode: CompassMode | 'Quick Win', duration: string, avoidList: string[]) => {
      setIsLoading(true);
      setActivity(null); 
      setActivityId(Math.random().toString(36).substring(7)); 
      try {
          let candidate;
          if (mode === 'Quick Win') {
              candidate = await generateQuickWin(avoidList);
          } else {
              candidate = await generateActivityForMode(mode as CompassMode, duration, avoidList);
          }
          setActivity(candidate);
          if (candidate) {
            setStats(trackSeenTitle(candidate.title));
          } else {
            throw new Error("No activity found");
          }
      } catch (e) {
          console.error("Fetch Activity Failed:", e);
          triggerToast("We're having trouble connecting to the AI guide. Try again in a moment.", "error");
          setView('dashboard');
      } finally {
          setIsLoading(false);
      }
  }, []);

  const handleConfirmMode = (duration: string) => {
      if (!selectedModeForConfirmation) return;
      
      const modeToStart = selectedModeForConfirmation;
      setSelectedModeForConfirmation(null);
      setCurrentDuration(duration);

      if (!stats.isPro && stats.dailyMainActivitiesCompleted >= 1) {
          setShowLimitModal(true);
          return;
      }

      setCurrentMode(modeToStart);
      setView('activity');
      
      const historyTitles = logs.map(l => l.activityTitle).filter(Boolean) as string[];
      const globalSeen = stats.seenTitles || [];
      const combinedAvoid = Array.from(new Set([...historyTitles, ...sessionAvoidTitles, ...globalSeen]));
      fetchActivity(modeToStart, duration, combinedAvoid);
  };

  const handleQuickWin = async () => {
      setView('activity');
      setCurrentMode('Quick Win');
      const historyTitles = logs.map(l => l.activityTitle).filter(Boolean) as string[];
      const globalSeen = stats.seenTitles || [];
      const combinedAvoid = Array.from(new Set([...historyTitles, ...sessionAvoidTitles, ...globalSeen]));
      fetchActivity('Quick Win', 'short', combinedAvoid);
  };

  const handleActivityComplete = (notes: string) => {
      if (!activity || !currentMode) return;
      const xpEarned = currentMode === 'Quick Win' ? 15 : 50;
      const log: UserLog = { id: Date.now().toString(), date: new Date().toISOString(), mode: currentMode, activityTitle: activity.title, completed: true, notes: notes, xpEarned: xpEarned };
      
      const prevRank = stats.level;
      const updatedStats = saveLog(log);
      
      // Trigger floating XP
      const id = Math.random().toString(36).substring(7);
      setFloatingXPs(prev => [...prev, { id, xp: xpEarned, x: window.innerWidth / 2, y: window.innerHeight / 2 }]);

      if (updatedStats.level !== prevRank) {
        const rankInfo = RANKS.find(r => r.title === updatedStats.level);
        if (rankInfo) {
          setNewRank(rankInfo);
          setShowRankUp(true);
        }
      }

      if (currentMode !== 'Quick Win') saveLastActivityTitle(currentMode as CompassMode, activity.title);
      
      setStats(updatedStats);
      setLogs(getLogs());
      setLastEarnedXP(xpEarned);
      setSessionAvoidTitles([]); 
      
      if (currentMode === 'Quick Win') setShowQuickWinCelebration(true);
      else setShowCelebration(true);

      if (!updatedStats.hasRatedApp && updatedStats.totalActivities > 0 && updatedStats.totalActivities % 5 === 0) {
          setTimeout(() => {
              if (view === 'dashboard' || !showCelebration) {
                  setShowReview(true);
              }
          }, 4500); 
      }
  };

  const handleRegenerate = useCallback(() => {
      if (!currentMode) return;
      if (!stats.isPro && stats.dailyReshuffles >= 3) {
          setShowLimitModal(true);
          return;
      }
      incrementReshuffleCount(); 
      setStats(getStats()); 
      const currentTitle = activity?.title || "";
      const updatedSessionAvoid = Array.from(new Set([...sessionAvoidTitles, currentTitle]));
      setSessionAvoidTitles(updatedSessionAvoid);
      
      const historyTitles = logs.map(l => l.activityTitle).filter(Boolean) as string[];
      const globalSeen = stats.seenTitles || [];
      const combinedAvoid = Array.from(new Set([...historyTitles, ...updatedSessionAvoid, ...globalSeen]));
      fetchActivity(currentMode, currentDuration, combinedAvoid);
  }, [currentMode, stats.isPro, stats.dailyReshuffles, stats.seenTitles, activity, logs, currentDuration, fetchActivity, sessionAvoidTitles]);

  const handleMenuNavigate = (id: string) => {
    switch(id) {
      case 'compass': setView('compass'); break;
      case 'guide': setShowGuide(true); break;
      case 'oracle': stats.isPro ? setShowOracle(true) : setShowPremium(true); break;
      case 'focus': setShowAbout(true); break; 
      case 'history': setShowHistory(true); break;
      case 'journey': setShowJourney(true); break;
      case 'wayfinding': setShowFindBearing(true); break;
      case 'quickwin': handleQuickWin(); break;
      case 'settings': setShowSettings(true); break;
      case 'about': setShowAbout(true); break;
    }
  };

  const handleModeSelection = (mode: CompassMode) => {
    setSelectedModeForConfirmation(mode);
  };

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
      }
      setShowInstallModal(false);
    }
  };

  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;

  return (
    <div className="min-h-screen text-white font-sans selection:bg-indigo-500/30 overflow-x-hidden">
      <div className="max-w-xl mx-auto w-full px-4 sm:px-6 flex flex-col min-h-screen">
        <header className="py-8 flex items-center justify-between z-40">
          <button 
            id="menu-button"
            onClick={() => setShowSecondaryMenu(true)}
            className="p-3 rounded-2xl bg-white/5 border border-white/10 text-brand-sage hover:text-white transition-all active:scale-95"
          >
            <Menu size={24} />
          </button>

          <div className="flex items-center gap-4">
            <button 
              id="xp-counter"
              onClick={() => setShowJourney(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
            >
              <Award size={16} className="text-brand-green" />
              <span className="text-xs font-black tracking-widest">{stats.xp} XP</span>
            </button>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10">
              <Zap size={16} className="text-orange-400" />
              <span className="text-xs font-black tracking-widest">{stats.streak}D</span>
            </div>
          </div>
        </header>

        {view === 'dashboard' ? (
          <main className="flex-1 flex flex-col animate-fade-in pb-20">
            {isGeneratingRecommendation ? (
              <div className="flex-1 flex flex-col items-center justify-center py-20">
                <motion.div 
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                  className="w-24 h-24 mb-8 text-brand-green"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <path d="m16.24 7.76-2.12 6.36-6.36 2.12 2.12-6.36 6.36-2.12z" />
                  </svg>
                </motion.div>
                <h2 className="text-2xl font-serif text-brand-cream text-center">{loadingText}</h2>
                {loadingTimer >= 8 && (
                  <p className="text-brand-sage text-sm mt-4 animate-pulse">Still working on it. Hang tight.</p>
                )}
              </div>
            ) : recommendationError ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mb-6">
                  <AlertCircle className="text-red-500" size={40} />
                </div>
                <h2 className="text-2xl font-serif text-brand-cream mb-2">We're having trouble loading your plan.</h2>
                <p className="text-brand-sage mb-8">Please try again or use a quick suggestion.</p>
                <div className="w-full space-y-4">
                  <button 
                    onClick={() => handleCheckInComplete(stats.lastCheckIn!)}
                    className="w-full py-4 bg-brand-green text-brand-teal rounded-2xl font-bold"
                  >
                    Try again
                  </button>
                  <button 
                    onClick={handleUseFallback}
                    className="w-full py-4 bg-white/5 border border-white/10 text-brand-sage rounded-2xl font-bold"
                  >
                    Use a quick suggestion
                  </button>
                </div>
              </div>
            ) : stats.dayCompletedToday ? (
              <DayCompleteView 
                stats={stats} 
                onExploreMore={() => setShowSecondaryMenu(true)} 
                onOpenPremium={() => setShowPremium(true)} 
              />
            ) : stats.currentRecommendation ? (
              <DailyRecommendationView 
                recommendation={stats.currentRecommendation}
                onCompletePart={handleCompletePart}
                onSurpriseMe={handleSurpriseMe}
                canSurpriseMe={!stats.surpriseMeUsedToday}
                isPro={stats.isPro}
                onOpenPremium={() => setShowPremium(true)}
                onQuickWin={handleQuickWin}
                weeklyChallenge={stats.currentWeeklyFocus ? {
                  title: stats.currentWeeklyFocus.title,
                  description: stats.currentWeeklyFocus.description,
                  xp: 100
                } : undefined}
              />
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                <h2 className="text-2xl font-serif text-brand-cream mb-4">Welcome back.</h2>
                <button 
                  onClick={() => setShowDailyCheckIn(true)}
                  className="px-8 py-4 bg-brand-green text-brand-teal rounded-full font-black text-lg shadow-xl shadow-brand-green/20"
                >
                  Check in for today
                </button>
              </div>
            )}
          </main>
        ) : view === 'compass' ? (
          <main className="flex-1 flex flex-col items-center justify-start animate-fade-in pb-20">
            <div className="text-center mb-10 mt-4">
              <h2 className="text-3xl font-serif text-white mb-2">Your daily actions and modes</h2>
              <p className="text-brand-sage text-sm italic">Select a direction to explore.</p>
            </div>
            <Compass onSelectMode={handleModeSelection} userRank={stats.level} isPro={stats.isPro} />
            <button 
              onClick={() => setView('dashboard')}
              className="mt-12 text-brand-sage text-sm font-bold uppercase tracking-widest hover:text-white transition-colors"
            >
              Back to Dashboard
            </button>
          </main>
        ) : (
          <main className="flex-1 flex flex-col items-center justify-center w-full animate-fade-in pb-20">
            <ActivityCard 
              key={activityId || 'loading'} 
              activity={activity!} 
              currentMode={currentMode} 
              onComplete={handleActivityComplete} 
              onBack={() => setView('dashboard')} 
              onRegenerate={handleRegenerate} 
              isLoading={isLoading} 
              isPro={stats.isPro} 
              dailyReshuffles={stats.dailyReshuffles} 
            />
          </main>
        )}

        <footer className="mt-auto pb-8 sm:pb-12 text-[9px] sm:text-[10px] text-white/10 uppercase tracking-[0.5em] text-center w-full font-bold">
          Evolution of Wellness LLC
        </footer>
      </div>

      <AnimatedPresence isVisible={showSecondaryMenu}>
        <SecondaryMenu 
          onClose={() => setShowSecondaryMenu(false)} 
          stats={stats} 
          onNavigate={handleMenuNavigate} 
        />
      </AnimatedPresence>

      <AnimatedPresence isVisible={showOnboardingFlow}><OnboardingFlow onComplete={handleOnboardingComplete} /></AnimatedPresence>
      <AnimatedPresence isVisible={showDailyCheckIn}><DailyCheckIn onComplete={handleCheckInComplete} /></AnimatedPresence>
      <AnimatedPresence isVisible={showStreakMilestone}><StreakMilestone days={milestoneDays} onClose={() => setShowStreakMilestone(false)} /></AnimatedPresence>
      <AnimatedPresence isVisible={showOnboarding}><OnboardingModal onComplete={(n) => { 
        const updated = saveUsername(n); 
        setStats(updated); 
        setShowOnboarding(false); 
        if (!updated.onboarding) {
          setShowOnboardingFlow(true);
        } else if (!updated.walkthroughShown) {
          setShowWalkthrough(true);
        } else {
          const today = new Date().toDateString();
          const lastCheckInDate = updated.lastCheckIn ? new Date(updated.lastCheckIn.date).toDateString() : null;
          if (today !== lastCheckInDate) {
            setShowDailyCheckIn(true);
          }
        }
      }} /></AnimatedPresence>
      <AnimatedPresence isVisible={showHistory}><HistoryModal logs={logs} breakdown={stats.modeBreakdown} isPro={stats.isPro} onClose={() => setShowHistory(false)} onOpenPro={() => { setShowHistory(false); setShowPremium(true); }} /></AnimatedPresence>
      <AnimatedPresence isVisible={showGuide}><GuideModal onClose={() => setShowGuide(false)} /></AnimatedPresence>
      <AnimatedPresence isVisible={!!selectedModeForConfirmation}>{selectedModeForConfirmation && <ModeDetailModal mode={selectedModeForConfirmation} suggestedReason={suggestedReason || undefined} onConfirm={handleConfirmMode} onCancel={() => setSelectedModeForConfirmation(null)} />}</AnimatedPresence>
      <AnimatedPresence isVisible={showCelebration}><CelebrationOverlay stats={stats} earnedXP={lastEarnedXP} activityTitle={activity?.title} mode={currentMode?.toString()} onClose={() => { setShowCelebration(false); setView('dashboard'); }} onShare={(d) => { setCustomShareData(d); setShowShare(true); }} /></AnimatedPresence>
      <AnimatedPresence isVisible={showQuickWinCelebration}><QuickWinCelebration onAnother={handleQuickWin} onDone={() => { setShowQuickWinCelebration(false); setView('dashboard'); }} onShare={(d) => { setCustomShareData(d); setShowShare(true); }} /></AnimatedPresence>
      <AnimatedPresence isVisible={showAbout}><AboutModal onClose={() => setShowAbout(false)} onOpenLegal={() => { setShowAbout(false); setShowLegal(true); }} /></AnimatedPresence>
      <AnimatedPresence isVisible={showPremium}><PremiumModal onClose={() => setShowPremium(false)} onUpgrade={(p) => { setStats(upgradeToCompassPlus(p)); setShowPremium(false); setShowPurchaseSuccess(true); }} /></AnimatedPresence>
      <AnimatedPresence isVisible={showPurchaseSuccess}><PurchaseSuccessModal onClose={() => setShowPurchaseSuccess(false)} /></AnimatedPresence>
      <AnimatedPresence isVisible={showJourney}><JourneyModal currentLevel={stats.level} totalActivities={stats.totalActivities} xp={stats.xp} modeBreakdown={stats.modeBreakdown} onClose={() => setShowJourney(false)} /></AnimatedPresence>
      <AnimatedPresence isVisible={showFindBearing}><FindBearingModal onClose={() => setShowFindBearing(false)} onModeSuggested={(m, r) => { setSuggestedReason(r); setSelectedModeForConfirmation(m); setShowFindBearing(false); }} onCrisisDetected={() => setShowCrisis(true)} /></AnimatedPresence>
      <AnimatedPresence isVisible={showOracle}><OracleModal onClose={() => setShowOracle(false)} onCrisisDetected={() => setShowCrisis(true)} /></AnimatedPresence>
      <AnimatedPresence isVisible={showLimitModal}><LimitModal onClose={() => setShowLimitModal(false)} onUpgrade={() => { setShowLimitModal(false); setShowPremium(true); }} /></AnimatedPresence>
      <AnimatedPresence isVisible={showSettings}><SettingsModal currentName={stats.username || ''} onSaveName={(n) => { setStats(saveUsername(n)); setStats(getStats()); }} onClose={() => setShowSettings(false)} onOpenLegal={() => { setShowSettings(false); setShowLegal(true); }} onOpenContact={() => { setShowSettings(false); setShowContact(true); }} onOpenReview={() => { setShowSettings(false); setShowReview(true); }} /></AnimatedPresence>
      
      {/* Updated ShareModal integration with onSuccess callback */}
      <AnimatedPresence isVisible={showShare}>
        <ShareModal 
          onClose={() => setShowShare(false)} 
          onSuccess={() => {
            setShowShare(false);
            setShowCelebration(false);
            setShowQuickWinCelebration(false);
            setView('dashboard');
          }}
          shareData={customShareData} 
        />
      </AnimatedPresence>

      <AnimatedPresence isVisible={showReview}><ReviewModal onClose={() => setShowReview(false)} onSubmit={(r, t, f) => { setStats(saveReview({ id: Date.now().toString(), rating: r, tags: t, text: f, date: new Date().toISOString() })); }} /></AnimatedPresence>
      <AnimatedPresence isVisible={showCrisis}><CrisisModal onClose={() => setShowCrisis(false)} /></AnimatedPresence>
      <AnimatedPresence isVisible={showInstallModal}><InstallModal onClose={() => setShowInstallModal(false)} isIOS={isIOS} canInstall={!!deferredPrompt} onInstall={handleInstallClick} /></AnimatedPresence>
      <AnimatedPresence isVisible={showLegal}><LegalModal onClose={() => setShowLegal(false)} /></AnimatedPresence>
      <AnimatedPresence isVisible={showContact}><ContactModal onClose={() => setShowContact(false)} /></AnimatedPresence>
      
      <AnimatedPresence isVisible={showRankUp}>
        {newRank && <RankUpModal rank={newRank} onClose={() => setShowRankUp(false)} />}
      </AnimatedPresence>

      <AnimatedPresence isVisible={showWalkthrough}>
        <Walkthrough onComplete={() => {
          setShowWalkthrough(false);
          const s = getStats();
          s.walkthroughShown = true;
          saveStats(s);
          setStats(s);
          const today = new Date().toDateString();
          const lastCheckInDate = s.lastCheckIn ? new Date(s.lastCheckIn.date).toDateString() : null;
          if (today !== lastCheckInDate) {
            setShowDailyCheckIn(true);
          }
        }} />
      </AnimatedPresence>

      {floatingXPs.map(fxp => (
        <FloatingXP 
          key={fxp.id} 
          xp={fxp.xp} 
          x={fxp.x} 
          y={fxp.y} 
          onComplete={() => setFloatingXPs(prev => prev.filter(p => p.id !== fxp.id))} 
        />
      ))}
      
      {showToast && (
        <motion.div 
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 20, opacity: 1 }}
          exit={{ y: -50, opacity: 0 }}
          className="fixed top-0 left-1/2 -translate-x-1/2 z-[500] w-[90%] max-w-md pointer-events-none"
        >
          <div className={`px-6 py-4 rounded-3xl shadow-2xl text-sm font-bold text-center border backdrop-blur-xl flex items-center justify-center gap-3 ${
            showToast.type === 'error' 
              ? 'bg-red-500/90 border-red-400 text-white' 
              : showToast.type === 'success'
                ? 'bg-brand-green/90 border-brand-green text-brand-teal'
                : 'bg-brand-teal/90 border-white/10 text-brand-sage'
          }`}>
            {showToast.type === 'error' && <AlertCircle size={18} />}
            {showToast.type === 'success' && <CheckCircle2 size={18} />}
            {showToast.message}
          </div>
        </motion.div>
      )}

      <ReloadPrompt />
    </div>
  );
};

export default App;