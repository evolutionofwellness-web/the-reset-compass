import React, { useState } from 'react';
import { DailyRecommendation, RecommendationPart } from '../types';
import { Zap, Utensils, Moon, CheckCircle2, Sparkles, RefreshCw, Trophy, Lock, ArrowRight, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface DailyRecommendationViewProps {
  recommendation: DailyRecommendation;
  onCompletePart: (part: 'move' | 'fuel' | 'recover') => void;
  onSurpriseMe: () => void;
  canSurpriseMe: boolean;
  isPro: boolean;
  weeklyChallenge?: { title: string; description: string; xp: number };
  onOpenPremium?: () => void;
  onQuickWin?: () => void;
}

const PathStep = ({ 
  part, 
  type, 
  data, 
  index, 
  isLast, 
  isCompleted, 
  activeInfo, 
  setActiveInfo, 
  handleComplete, 
  isPro, 
  onOpenPremium 
}: { 
  part: 'move' | 'fuel' | 'recover', 
  type: string, 
  data: RecommendationPart, 
  index: number, 
  isLast?: boolean,
  isCompleted: boolean,
  activeInfo: string | null,
  setActiveInfo: (val: string | null) => void,
  handleComplete: (part: 'move' | 'fuel' | 'recover') => void,
  isPro: boolean,
  onOpenPremium?: () => void
}) => {
  const icons = {
    move: <Zap className={isCompleted ? "text-brand-teal" : "text-brand-green"} size={20} />,
    fuel: <Utensils className={isCompleted ? "text-brand-teal" : "text-brand-green"} size={20} />,
    recover: <Moon className={isCompleted ? "text-brand-teal" : "text-brand-sage"} size={20} />
  };

  return (
    <div className="relative flex gap-6">
      {/* Timeline Line */}
      {!isLast && (
        <div className="absolute left-[19px] top-10 bottom-0 w-0.5 bg-white/10">
          <motion.div 
            initial={{ height: 0 }}
            animate={{ height: isCompleted ? '100%' : '0%' }}
            className="w-full bg-brand-green"
          />
        </div>
      )}

      {/* Timeline Node */}
      <div className="relative z-10 flex flex-col items-center">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => !isCompleted && handleComplete(part)}
          className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 border-2 ${
            isCompleted 
              ? 'bg-brand-green border-brand-green shadow-[0_0_15px_rgba(79,176,109,0.4)]' 
              : 'bg-brand-dark border-white/20'
          }`}
        >
          {isCompleted ? <CheckCircle2 className="text-brand-teal" size={20} /> : icons[part]}
        </motion.button>
      </div>

      {/* Content Card */}
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.1 }}
        className={`flex-1 ${isLast ? 'mb-0' : 'mb-10'} p-6 rounded-[32px] border transition-all duration-500 ${
          isCompleted 
            ? 'bg-brand-green/10 border-brand-green/30' 
            : 'bg-white/5 border-white/10'
        }`}
      >
        <div className="flex items-center justify-between mb-2">
          <span className={`text-[10px] font-black uppercase tracking-widest ${isCompleted ? 'text-brand-green' : 'text-white/40'}`}>
            {type}
          </span>
          <button 
            onClick={() => setActiveInfo(activeInfo === part ? null : part)}
            className="p-1 text-white/20 hover:text-white/60 transition-colors"
          >
            <Info size={16} />
          </button>
        </div>

        <h3 className={`text-lg font-bold mb-1 ${isCompleted ? 'text-brand-green' : 'text-brand-cream'}`}>
          {data.title}
        </h3>
        <p className="text-brand-sage text-sm leading-relaxed mb-4">
          {data.action}
        </p>

        <AnimatePresence>
          {activeInfo === part && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="bg-white/5 rounded-2xl p-4 mb-4 border border-white/5">
                <p className="text-xs text-brand-sage italic leading-relaxed">
                  <Sparkles size={12} className="inline mr-1 text-brand-green" />
                  {data.benefit}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {!isCompleted ? (
          <button
            id={index === 0 ? "i-did-this-button" : undefined}
            onClick={() => handleComplete(part)}
            className="w-full py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-brand-cream font-bold text-xs transition-all border border-white/5 flex items-center justify-center gap-2"
          >
            Log Completion
            <ArrowRight size={14} />
          </button>
        ) : (
          <div className="flex items-center gap-2 text-[10px] font-black text-brand-green uppercase tracking-widest">
            <CheckCircle2 size={12} />
            Step Complete
          </div>
        )}

        {/* Premium Upsell within the card */}
        {!isPro && (
          <div className="mt-4 pt-4 border-t border-white/5">
            <button 
              onClick={onOpenPremium}
              className="flex items-center gap-2 text-[10px] font-bold text-brand-sage/40 hover:text-brand-green transition-colors group"
            >
              <Lock size={10} />
              <span>Unlock Deeper Insights</span>
              <Sparkles size={10} className="opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
};

const DailyRecommendationView: React.FC<DailyRecommendationViewProps> = ({ 
  recommendation, 
  onCompletePart, 
  onSurpriseMe,
  canSurpriseMe,
  isPro,
  weeklyChallenge,
  onOpenPremium,
  onQuickWin
}) => {
  const [showReward, setShowReward] = useState(false);
  const [rewardContent, setRewardContent] = useState({ message: '', fact: '' });
  const [activeInfo, setActiveInfo] = useState<string | null>(null);

  const rewards = [
    { message: "Incredible work!", fact: "Movement increases chemicals that help your brain grow and stay healthy." },
    { message: "You're crushing it!", fact: "Drinking enough water can improve your mood and thinking by up to 30%." },
    { message: "Consistency is key.", fact: "A 5-minute reset can lower your stress levels for up to 2 hours." },
    { message: "Body and mind in sync.", fact: "Deep breathing signals your body's relaxation system to help you recover." },
    { message: "Small wins, big impact.", fact: "Eating protein at the right time keeps your energy steady all afternoon." },
    { message: "System: Reset.", fact: "Even 2 minutes of focused breathing can lower your heart rate significantly." },
    { message: "You're doing great!", fact: "Getting sunlight in the morning helps you sleep better at night." },
    { message: "Keep it up!", fact: "Stretching improves blood flow and helps your muscles feel refreshed." },
    { message: "Solid choice.", fact: "Drinking water before a meal helps your body get more energy from your food." },
    { message: "Mindful and strong.", fact: "Short breaks throughout the day prevent mental tiredness and keep you sharp." }
  ];

  const handleComplete = (part: 'move' | 'fuel' | 'recover') => {
    if (recommendation.completedParts.includes(part)) return;
    
    const randomReward = rewards[Math.floor(Math.random() * rewards.length)];
    setRewardContent(randomReward);
    setShowReward(true);
    onCompletePart(part);
    
    setTimeout(() => setShowReward(false), 4000);
  };


  const completedCount = recommendation.completedParts.length;
  const progress = (completedCount / 3) * 100;

  return (
    <div className="pb-12 flex flex-col gap-6">
      {/* Header & Progress */}
      <div className="px-2">
        <div className="flex items-end justify-between mb-4">
          <div>
            <h2 className="text-3xl font-serif text-brand-cream mb-1">Your personalized plan for today</h2>
            <p className="text-brand-sage text-sm">Three simple steps to help you feel your best.</p>
          </div>
          <div className="text-right">
            <span className="text-2xl font-black text-brand-green">{completedCount}/3</span>
            <p className="text-[10px] font-bold text-brand-sage uppercase tracking-widest">Steps Done</p>
          </div>
        </div>
        
        <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            className="h-full bg-brand-green shadow-[0_0_15px_rgba(79,176,109,0.5)]"
          />
        </div>
      </div>

      {/* Weekly Challenge Upsell or Daily Intention */}
      {weeklyChallenge ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-brand-green/10 to-brand-teal/20 border border-brand-green/20 rounded-[32px] p-6 relative overflow-hidden group cursor-pointer"
          onClick={onOpenPremium}
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-xl bg-brand-green/20">
              <Trophy className="text-brand-green" size={20} />
            </div>
            <span className="text-xs font-black uppercase tracking-widest text-brand-green">Weekly Focus</span>
            {!isPro && <Lock size={12} className="text-white/20 ml-auto" />}
          </div>
          <h3 className="text-lg font-bold text-brand-cream mb-1">{weeklyChallenge.title}</h3>
          <p className="text-brand-sage text-sm mb-4 line-clamp-2">{weeklyChallenge.description}</p>
          
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-brand-green uppercase tracking-tighter">+{weeklyChallenge.xp} XP BONUS</span>
            <div className="flex items-center gap-1 text-xs font-bold text-white/60 group-hover:text-white transition-colors">
              {isPro ? 'View Details' : 'Unlock with Compass+'}
              <ArrowRight size={14} />
            </div>
          </div>
        </motion.div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 border border-white/10 rounded-[32px] p-6 relative overflow-hidden"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-xl bg-white/10">
              <Sparkles className="text-brand-cream" size={20} />
            </div>
            <span className="text-xs font-black uppercase tracking-widest text-brand-cream">Daily Intention</span>
          </div>
          <p className="text-brand-sage text-sm italic">"Focus on what you can control today. Let go of the rest."</p>
        </motion.div>
      )}

      {/* The Path */}
      <div className="px-2" id="recommendation-cards">
        {/* Shuffle Button */}
        {completedCount < 3 && (
          <div className="flex justify-end mb-6">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={onSurpriseMe}
              className="flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all border bg-white/5 text-brand-sage hover:bg-white/10 border-white/10"
            >
              <RefreshCw size={12} className={!canSurpriseMe && !isPro ? "opacity-50" : "animate-spin-slow"} />
              Shuffle Activities
              {!isPro && !canSurpriseMe && <Lock size={10} className="ml-1" />}
            </motion.button>
          </div>
        )}

        <PathStep 
          part="move" 
          type="Morning Activation" 
          data={recommendation.move} 
          index={0} 
          isCompleted={recommendation.completedParts.includes('move')}
          activeInfo={activeInfo}
          setActiveInfo={setActiveInfo}
          handleComplete={handleComplete}
          isPro={isPro}
          onOpenPremium={onOpenPremium}
        />
        <PathStep 
          part="fuel" 
          type="Mid-Day Fuel" 
          data={recommendation.fuel} 
          index={1} 
          isCompleted={recommendation.completedParts.includes('fuel')}
          activeInfo={activeInfo}
          setActiveInfo={setActiveInfo}
          handleComplete={handleComplete}
          isPro={isPro}
          onOpenPremium={onOpenPremium}
        />
        <PathStep 
          part="recover" 
          type="Evening Recovery" 
          data={recommendation.recover} 
          index={2} 
          isLast 
          isCompleted={recommendation.completedParts.includes('recover')}
          activeInfo={activeInfo}
          setActiveInfo={setActiveInfo}
          handleComplete={handleComplete}
          isPro={isPro}
          onOpenPremium={onOpenPremium}
        />
      </div>

      {/* Quick Win Option */}
      {onQuickWin && completedCount < 3 && (
        <div className="px-2">
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={onQuickWin}
            className="w-full p-6 rounded-[32px] bg-gradient-to-br from-brand-green/10 to-brand-teal/20 border border-brand-green/20 text-left group relative overflow-hidden"
          >
            <div className="flex items-center gap-4 relative z-10">
              <div className="p-3 rounded-2xl bg-brand-green/20 text-brand-green group-hover:scale-110 transition-transform">
                <Zap size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-brand-cream mb-1 flex items-center gap-2">
                  Need a Quick Win?
                </h3>
                <p className="text-brand-sage text-sm">Get a 2-minute activity to reset right now.</p>
              </div>
            </div>
          </motion.button>
        </div>
      )}

      {/* Final Action */}
      <div className="flex flex-col items-center gap-6 px-2">
        {completedCount === 3 ? (
          <motion.button
            id="daily-complete-button"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onCompletePart('day_complete' as any)}
            className="w-full py-6 rounded-[32px] bg-brand-green text-brand-teal font-black text-xl flex items-center justify-center gap-3 shadow-2xl shadow-brand-green/30"
          >
            Complete Your Day
            <Sparkles size={24} />
          </motion.button>
        ) : (
          <div className="text-center w-full">
            <p className="text-xs text-brand-sage/60 font-medium mb-4 italic">
              "The secret of your future is hidden in your daily routine."
            </p>
            <motion.button
              id="daily-complete-button"
              whileTap={{ scale: 0.95 }}
              onClick={() => onCompletePart('day_complete' as any)}
              className="w-full py-4 rounded-2xl text-sm font-bold transition-all border bg-white/5 text-brand-sage hover:bg-white/10 border-white/10"
            >
              Finish Day Early
            </motion.button>
          </div>
        )}

        {/* Compass+ Value Prop or Pro Journey Link */}
        {!isPro ? (
          <div className="w-full bg-white/5 border border-white/10 rounded-[32px] p-8 text-center">
            <Sparkles className="text-brand-green mx-auto mb-4" size={32} />
            <h3 className="text-xl font-serif text-brand-cream mb-2">Get smarter daily guidance with Compass+</h3>
            <p className="text-brand-sage text-sm mb-6">
              Unlock unlimited AI reshuffles, deeper insights into your patterns, and a personalized plan tailored to you.
            </p>
            <button 
              onClick={onOpenPremium}
              className="px-8 py-3 bg-brand-cream text-brand-teal rounded-full font-black text-xs uppercase tracking-widest hover:bg-brand-green transition-colors"
            >
              Upgrade to Compass+
            </button>
          </div>
        ) : (
          <div className="w-full bg-brand-green/10 border border-brand-green/20 rounded-[32px] p-8 text-center">
            <Trophy className="text-brand-green mx-auto mb-4" size={32} />
            <h3 className="text-xl font-serif text-brand-cream mb-2">You're on the right path</h3>
            <p className="text-brand-sage text-sm mb-6">
              Every step you take builds momentum. Keep up the great work.
            </p>
          </div>
        )}
      </div>

      {/* Reward Toast */}
      <AnimatePresence>
        {showReward && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed bottom-24 left-6 right-6 z-[100] bg-brand-green text-brand-teal p-6 rounded-[32px] shadow-2xl shadow-brand-green/40"
          >
            <div className="flex items-start gap-4">
              <div className="bg-brand-teal/10 p-3 rounded-2xl">
                <Sparkles size={24} />
              </div>
              <div>
                <h4 className="font-black text-xl mb-1">{rewardContent.message}</h4>
                <p className="text-sm font-medium leading-tight opacity-80">{rewardContent.fact}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DailyRecommendationView;
