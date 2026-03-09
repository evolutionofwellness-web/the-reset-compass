import React from 'react';
import { Trophy, ArrowRight, ShieldCheck } from 'lucide-react';

interface WeeklyChallengeCardProps {
  onTap: () => void;
}

const WeeklyChallengeCard: React.FC<WeeklyChallengeCardProps> = ({ onTap }) => {
  return (
    <button 
      onClick={onTap}
      className="w-full relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-teal to-brand-dark border border-brand-green/30 p-6 text-left group transition-all hover:scale-[1.01]"
    >
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
        <Trophy size={80} className="text-brand-green" />
      </div>

      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-4">
          <div className="bg-brand-green/20 p-1.5 rounded-lg">
            <ShieldCheck size={16} className="text-brand-green" />
          </div>
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-green">Weekly Challenge</span>
        </div>

        <h3 className="text-2xl font-serif text-brand-cream mb-2">The Cold Reset</h3>
        <p className="text-brand-sage text-sm mb-6 max-w-[80%]">
          End every shower this week with 60 seconds of pure cold. Build resilience and spike your dopamine naturally.
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-brand-green text-brand-teal text-[10px] font-black px-2 py-0.5 rounded-full">+250 XP</div>
            <div className="bg-white/10 text-white/60 text-[10px] font-black px-2 py-0.5 rounded-full">Limited Badge</div>
          </div>
          <ArrowRight size={20} className="text-brand-green group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </button>
  );
};

export default WeeklyChallengeCard;
