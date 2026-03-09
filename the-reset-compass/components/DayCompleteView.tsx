import React from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, Sparkles, Trophy, ArrowRight, Zap, Utensils, Moon, Lock } from 'lucide-react';
import { UserStats } from '../types';

interface DayCompleteViewProps {
  stats: UserStats;
  onExploreMore: () => void;
  onOpenPremium: () => void;
}

const DayCompleteView: React.FC<DayCompleteViewProps> = ({ stats, onExploreMore, onOpenPremium }) => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center p-6 animate-fade-in max-w-md mx-auto">
      <motion.div 
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", damping: 12 }}
        className="w-24 h-24 bg-brand-green/20 rounded-full flex items-center justify-center mb-8 relative"
      >
        <CheckCircle2 className="text-brand-green" size={48} />
        <motion.div 
          animate={{ scale: [1, 1.5, 1], opacity: [0, 1, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute inset-0 bg-brand-green/20 rounded-full"
        />
      </motion.div>

      <h2 className="text-4xl font-serif text-brand-cream mb-4">You showed up.</h2>
      <p className="text-brand-sage text-lg mb-10 italic leading-relaxed">
        Consistency is the only "hack" that actually works. You've found your natural balance for today.
      </p>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 w-full mb-10">
        <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
          <span className="text-4xl font-black text-white block mb-1">{stats.streak}</span>
          <span className="text-[10px] font-black text-brand-sage uppercase tracking-widest">Day Streak</span>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
          <span className="text-4xl font-black text-brand-green block mb-1">+{stats.xp % 100}</span>
          <span className="text-[10px] font-black text-brand-sage uppercase tracking-widest">XP Earned</span>
        </div>
      </div>

      {/* Value Summary */}
      <div className="w-full bg-brand-teal/20 border border-white/5 rounded-[32px] p-6 mb-10 text-left">
        <h3 className="text-xs font-black text-brand-green uppercase tracking-widest mb-4 flex items-center gap-2">
          <Sparkles size={14} />
          Today's Impact
        </h3>
        <ul className="space-y-4">
          <li className="flex items-start gap-3">
            <div className="mt-1 p-1 bg-brand-green/20 rounded-lg"><Zap size={12} className="text-brand-green" /></div>
            <p className="text-sm text-brand-sage">Got your body moving this morning.</p>
          </li>
          <li className="flex items-start gap-3">
            <div className="mt-1 p-1 bg-brand-green/20 rounded-lg"><Utensils size={12} className="text-brand-green" /></div>
            <p className="text-sm text-brand-sage">Gave your body real fuel today.</p>
          </li>
          <li className="flex items-start gap-3">
            <div className="mt-1 p-1 bg-brand-sage/20 rounded-lg"><Moon size={12} className="text-brand-sage" /></div>
            <p className="text-sm text-brand-sage">Set yourself up for better rest tonight.</p>
          </li>
        </ul>
      </div>

      {/* Premium Upsell */}
      {!stats.isPro && (
        <motion.div 
          whileHover={{ scale: 1.02 }}
          onClick={onOpenPremium}
          className="w-full bg-gradient-to-br from-brand-green to-brand-teal p-1 rounded-[32px] mb-8 cursor-pointer shadow-xl shadow-brand-green/20"
        >
          <div className="bg-brand-dark rounded-[31px] p-6 flex items-center justify-between">
            <div className="text-left">
              <h4 className="text-brand-cream font-bold flex items-center gap-2">
                Unlock Tomorrow's Path
                <Lock size={14} className="text-brand-green" />
              </h4>
              <p className="text-brand-sage text-xs">Get smarter daily guidance with Compass+</p>
            </div>
            <ArrowRight className="text-brand-green" />
          </div>
        </motion.div>
      )}

      <div className="w-full space-y-4">
        <button 
          onClick={onExploreMore}
          className="w-full py-5 bg-brand-green text-brand-teal rounded-3xl font-black text-xl shadow-xl shadow-brand-green/20 uppercase tracking-widest flex items-center justify-center gap-3"
        >
          See what else you can do today
          <ArrowRight size={24} />
        </button>
        <p className="text-[10px] font-bold text-brand-sage/40 uppercase tracking-[0.2em]">Your new plan arrives tomorrow at midnight.</p>
      </div>
    </div>
  );
};

export default DayCompleteView;
