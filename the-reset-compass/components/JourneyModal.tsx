
import React, { useState } from 'react';
import { RANKS, getNextRank } from '../services/storageService';
import { ModeBreakdown, CompassMode, RankInfo } from '../types';

interface JourneyModalProps {
  currentLevel: string;
  totalActivities: number;
  xp: number;
  modeBreakdown?: ModeBreakdown; // Made optional for backward compatibility, but we will pass it
  onClose: () => void;
}

const JourneyModal: React.FC<JourneyModalProps> = ({ currentLevel, xp, modeBreakdown = {}, onClose }) => {
  const [activeTab, setActiveTab] = useState<'path' | 'aura'>('path');
  
  const nextRank = getNextRank(xp);
  const currentRankInfo = RANKS.find(r => r.title === currentLevel) || RANKS[0];
  
  // Calculate total activities for aura math
  const totalLogged = (Object.values(modeBreakdown) as number[]).reduce((a, b) => a + b, 0);

  const getModeColor = (mode: string) => {
      switch(mode) {
          case CompassMode.Surviving: return '#ef4444';
          case CompassMode.Drifting: return '#8b5cf6';
          case CompassMode.Healing: return '#4f46e5';
          case CompassMode.Grounded: return '#10b981';
          case CompassMode.Growing: return '#f97316';
          case CompassMode.Flowing: return '#22d3ee';
          case 'Quick Win': return '#ec4899';
          default: return '#94a3b8';
      }
  };

  const renderAura = () => {
    if (totalLogged === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-64 text-brand-sage">
                <div className="w-20 h-20 rounded-full border-2 border-dashed border-white/10 mb-4 animate-spin-slow"></div>
                <p>Complete activities to generate your Aura.</p>
            </div>
        );
    }

    // Sort modes by frequency to render largest ones first (or last, depending on desired z-index)
    const sortedModes = (Object.entries(modeBreakdown) as [string, number][]).sort(([,a], [,b]) => b - a);

    return (
        <div className="relative w-full h-80 flex items-center justify-center overflow-hidden rounded-2xl bg-brand-dark border border-white/10 shadow-inner">
            <div className="absolute inset-0 bg-brand-dark z-0"></div>
            
            {/* Generative Orbs based on usage */}
            {sortedModes.map(([mode, count], index) => {
                const percentage = count / totalLogged;
                // Scale size between 80px and 250px based on percentage
                const size = 80 + (percentage * 200); 
                const color = getModeColor(mode);
                
                // Randomize position slightly based on index to create organic overlap
                // We use deterministic "randomness" based on string length to keep it stable between renders
                const offsetX = (mode.length % 3 - 1) * 30; 
                const offsetY = (mode.length % 2 === 0 ? 1 : -1) * 20;

                return (
                    <div 
                        key={mode}
                        className="absolute rounded-full blur-[40px] mix-blend-screen opacity-70 animate-float"
                        style={{
                            width: `${size}px`,
                            height: `${size}px`,
                            backgroundColor: color,
                            transform: `translate(${offsetX}px, ${offsetY}px)`,
                            zIndex: 10 - index, // Smaller, less frequent ones on top? or bottom. Let's put big ones at back.
                            animationDuration: `${6 + index}s`,
                            animationDelay: `${index}s`
                        }}
                    ></div>
                );
            })}
            
            <div className="relative z-10 text-center pointer-events-none">
                <h3 className="text-brand-cream font-serif text-2xl font-bold drop-shadow-md">Your Energy Signature</h3>
                <p className="text-brand-sage text-xs uppercase tracking-widest mt-1">Based on {totalLogged} sessions</p>
            </div>
        </div>
    );
  };

  const renderPath = () => {
    return (
        <div className="relative pb-12">
            {/* The Connecting Line */}
            <div className="absolute left-[28px] top-6 bottom-6 w-0.5 bg-gradient-to-b from-brand-green via-brand-teal to-brand-dark z-0"></div>
            
            {RANKS.map((rank, index) => {
                const isUnlocked = xp >= rank.threshold;
                const isCurrent = rank.title === currentLevel;
                const isNext = nextRank?.title === rank.title;
                
                // Progress Bar logic for the NEXT rank
                let progressToThis = 0;
                if (isNext) {
                    const prevThreshold = RANKS[index - 1]?.threshold || 0;
                    const gap = rank.threshold - prevThreshold;
                    const currentInGap = xp - prevThreshold;
                    progressToThis = Math.min(100, Math.max(0, (currentInGap / gap) * 100));
                }

                return (
                    <div key={rank.id} className={`relative z-10 mb-8 last:mb-0 ${isUnlocked || isNext ? 'opacity-100' : 'opacity-40'}`}>
                        <div className="flex items-start gap-4">
                            {/* Orb Node */}
                            <div className="relative shrink-0">
                                <div className={`w-14 h-14 rounded-full flex items-center justify-center border-4 transition-all duration-500 shadow-xl z-20 bg-brand-dark 
                                    ${isCurrent ? `${rank.color} border-current scale-110 shadow-[0_0_20px_currentColor]` : ''}
                                    ${isUnlocked && !isCurrent ? `${rank.color} border-current` : ''}
                                    ${!isUnlocked && !isCurrent ? 'border-white/10 text-brand-sage' : ''}
                                `}>
                                    <span className="text-[10px] font-bold uppercase">
                                        {isUnlocked ? '✓' : rank.threshold}
                                    </span>
                                </div>
                            </div>

                            {/* Content Card */}
                            <div className={`flex-1 rounded-2xl p-4 border transition-all ${isCurrent ? 'bg-brand-dark/50 border-white/20 shadow-lg ring-1 ring-white/10' : 'bg-brand-dark/20 border-white/10'}`}>
                                <div className="flex justify-between items-start mb-1">
                                    <h4 className={`font-bold text-base ${isUnlocked || isNext ? rank.color : 'text-brand-sage'}`}>{rank.title}</h4>
                                    {isUnlocked && <span className="text-[9px] bg-brand-green/20 text-brand-green px-2 py-0.5 rounded-full uppercase tracking-wider font-bold">Unlocked</span>}
                                    {isNext && <span className="text-[9px] bg-brand-teal/20 text-brand-teal px-2 py-0.5 rounded-full uppercase tracking-wider font-bold">Next Goal</span>}
                                </div>
                                
                                <p className="text-xs text-brand-sage mb-2">{rank.perk}</p>
                                
                                {isNext && (
                                    <div className="mt-3">
                                        <div className="flex justify-between text-[9px] text-brand-sage uppercase tracking-widest mb-1">
                                            <span>Progress</span>
                                            <span>{Math.floor(progressToThis)}%</span>
                                        </div>
                                        <div className="h-2 w-full bg-brand-dark rounded-full overflow-hidden">
                                            <div style={{width: `${progressToThis}%`}} className="h-full bg-brand-teal transition-all duration-1000"></div>
                                        </div>
                                        <p className="text-[10px] text-right mt-1 text-brand-sage">{rank.threshold - xp} XP to go</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-dark/90 backdrop-blur-md animate-fade-in">
      {/* Safe area adjusted close button */}
      <button 
        onClick={onClose} 
        style={{ 
          top: 'calc(max(60px, env(safe-area-inset-top) + 16px))',
          minWidth: '44px',
          minHeight: '44px'
        }}
        className="absolute right-6 z-[60] rounded-full bg-brand-dark/50 backdrop-blur-md border border-white/10 text-brand-sage hover:text-white flex items-center justify-center shadow-lg transition-all text-xl" 
        aria-label="Close"
      >
        ✕
      </button>
      <div className="w-full max-w-2xl bg-brand-teal border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-modal-enter">
        
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex justify-between items-center bg-brand-teal relative z-20">
          <div>
              <h2 className="text-xl font-light text-brand-cream">Your Journey</h2>
              <div className="flex items-center gap-2 mt-1">
                <span className={`text-xs font-bold ${currentRankInfo.color} uppercase tracking-widest`}>{currentLevel}</span>
                <span className="text-xs text-brand-sage">•</span>
                <span className="text-xs text-brand-sage">{xp} Growth Points</span>
              </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-white/10 bg-brand-dark">
            <button 
                onClick={() => setActiveTab('path')}
                className={`flex-1 py-4 text-xs font-bold uppercase tracking-widest transition-colors ${activeTab === 'path' ? 'text-brand-cream border-b-2 border-brand-cream bg-brand-teal' : 'text-brand-sage hover:text-brand-cream'}`}
            >
                The Path
            </button>
            <button 
                onClick={() => setActiveTab('aura')}
                className={`flex-1 py-4 text-xs font-bold uppercase tracking-widest transition-colors ${activeTab === 'aura' ? 'text-brand-cream border-b-2 border-brand-cream bg-brand-teal' : 'text-brand-sage hover:text-brand-cream'}`}
            >
                Your Aura
            </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-8 overflow-y-auto custom-scrollbar flex-1 relative">
           {activeTab === 'path' ? renderPath() : (
               <div className="animate-fade-in space-y-8">
                   {renderAura()}
                   
                   <div className="grid grid-cols-2 gap-4">
                       <div className="bg-brand-dark/50 p-4 rounded-xl border border-white/10">
                           <h4 className="text-xs text-brand-sage uppercase tracking-widest mb-1">Dominant Energy</h4>
                           <p className="text-brand-cream font-bold text-lg capitalize">
                               {(Object.entries(modeBreakdown) as [string, number][]).sort((a,b) => b[1]-a[1])[0]?.[0] || "None"}
                           </p>
                       </div>
                       <div className="bg-brand-dark/50 p-4 rounded-xl border border-white/10">
                           <h4 className="text-xs text-brand-sage uppercase tracking-widest mb-1">Total Sessions</h4>
                           <p className="text-brand-cream font-bold text-lg">{totalLogged}</p>
                       </div>
                   </div>

                   <p className="text-center text-xs text-brand-sage max-w-sm mx-auto leading-relaxed">
                       Your Aura is a visual representation of your emotional history. Every time you log an activity, you add color to your soul's palette.
                   </p>
               </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default JourneyModal;
