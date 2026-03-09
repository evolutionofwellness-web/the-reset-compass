import React, { useState } from 'react';
import { CompassMode } from '../types';

interface ModeDetailModalProps {
  mode: CompassMode;
  onConfirm: (duration: string) => void;
  onCancel: () => void;
  suggestedReason?: string;
}

const MODE_DETAILS: Record<CompassMode, { description: string; colorClass: string }> = {
  [CompassMode.Surviving]: {
    description: "You're feeling overwhelmed, anxious, or burned out. You need safety, grounding, and deep rest to get back to feeling like yourself.",
    colorClass: "text-compass-surviving border-compass-surviving"
  },
  [CompassMode.Drifting]: {
    description: "You're feeling foggy, aimless, or unmotivated. You need clarity, small wins, and gentle movement to find direction.",
    colorClass: "text-compass-drifting border-compass-drifting"
  },
  [CompassMode.Healing]: {
    description: "You are recovering, feeling tender, or have low energy. You need active recovery, mobility, and self-compassion.",
    colorClass: "text-indigo-400 border-indigo-400"
  },
  [CompassMode.Grounded]: {
    description: "You feel calm, steady, and present. You are in a good place to maintain your balance and practice gratitude.",
    colorClass: "text-compass-grounded border-compass-grounded"
  },
  [CompassMode.Growing]: {
    description: "You have energy, focus, and momentum. You're ready to build strength, challenge yourself, and expand your limits.",
    colorClass: "text-compass-growing border-compass-growing"
  },
  [CompassMode.Flowing]: {
    description: "You are in a peak state, feeling limitless and creative. You are ready for mastery, complex tasks, and contribution.",
    colorClass: "text-cyan-400 border-cyan-400"
  }
};

const ModeDetailModal: React.FC<ModeDetailModalProps> = ({ mode, onConfirm, onCancel, suggestedReason }) => {
  const [duration, setDuration] = useState<'short' | 'medium' | 'long'>('medium');
  const details = MODE_DETAILS[mode];

  const renderVisual = () => {
      const color = details.colorClass.split(' ')[0]; 
      switch (mode) {
          case CompassMode.Surviving:
              return (
                 <div className={`w-24 h-24 mx-auto mb-4 rounded-full bg-slate-800/50 flex items-center justify-center border border-slate-700/50 shadow-[0_0_30px_rgba(239,68,68,0.1)] ${color}`}>
                     <svg className="w-12 h-12 opacity-90" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                         <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                         <path d="M12 8v4" />
                         <path d="M12 16h.01" />
                     </svg>
                 </div>
              );
          case CompassMode.Drifting:
               return (
                 <div className={`w-24 h-24 mx-auto mb-4 rounded-full bg-slate-800/50 flex items-center justify-center border border-slate-700/50 shadow-[0_0_30px_rgba(139,92,246,0.1)] ${color}`}>
                     <svg className="w-12 h-12 opacity-90" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                         <path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z" />
                         <path d="M16 8L2 22" />
                         <path d="M17.5 15H9" />
                     </svg>
                 </div>
              );
          case CompassMode.Healing:
               return (
                 <div className={`w-24 h-24 mx-auto mb-4 rounded-full bg-slate-800/50 flex items-center justify-center border border-slate-700/50 shadow-[0_0_30px_rgba(55,48,163,0.15)] ${color}`}>
                     <svg className="w-12 h-12 opacity-90" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                         <path d="M12 22c4.97 0 9-4.03 9-9 0-4.97-9-13-9-13S3 8.03 3 13c0 4.97 4.03 9 9 9z" />
                         <path d="M12 13a3 3 0 0 0-3 3" opacity="0.5"/>
                     </svg>
                 </div>
              );
          case CompassMode.Grounded:
               return (
                 <div className={`w-24 h-24 mx-auto mb-4 rounded-full bg-slate-800/50 flex items-center justify-center border border-slate-700/50 shadow-[0_0_30px_rgba(16,185,129,0.1)] ${color}`}>
                     <svg className="w-12 h-12 opacity-90" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                         <rect x="6" y="19" width="12" height="3" rx="1" />
                         <rect x="8" y="14" width="8" height="3" rx="1" />
                         <rect x="10" y="9" width="4" height="3" rx="1" />
                     </svg>
                 </div>
              );
          case CompassMode.Growing:
               return (
                 <div className={`w-24 h-24 mx-auto mb-4 rounded-full bg-slate-800/50 flex items-center justify-center border border-slate-700/50 shadow-[0_0_30px_rgba(249,115,22,0.1)] ${color}`}>
                     <svg className="w-12 h-12 opacity-90" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                         <path d="M12 19V6" />
                         <path d="M5 19h14" />
                         <path d="M12 6c0-3 3-3 3-3" />
                         <path d="M12 12c-3 0-4-2-4-4" />
                         <path d="M12 6c3 3 6 4 6 7" opacity="0.5"/>
                     </svg>
                 </div>
              );
          case CompassMode.Flowing:
               return (
                 <div className={`w-24 h-24 mx-auto mb-4 rounded-full bg-slate-800/50 flex items-center justify-center border border-slate-700/50 shadow-[0_0_30px_rgba(34,211,238,0.1)] ${color}`}>
                     <svg className="w-12 h-12 opacity-90" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                         <path d="M12 12c-2-2.5-4.5-3-6-3-2.5 0-4 1.5-4 4s1.5 4 4 4c2.5 0 4-1.5 6-5 2-3.5 3.5-5 6-5 2.5 0 4 1.5 4 4s-1.5 4-4 4c-1.5 0-4-.5-6-3z" />
                     </svg>
                 </div>
              );
          default:
              return null;
      }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-dark/90 backdrop-blur-md animate-fade-in">
      {/* Safe area adjusted close button */}
      <button 
        onClick={onCancel} 
        style={{ 
          top: 'calc(max(60px, env(safe-area-inset-top) + 16px))',
          minWidth: '44px',
          minHeight: '44px'
        }}
        className="absolute right-6 z-[110] rounded-full bg-brand-dark/50 backdrop-blur-md border border-white/10 text-brand-sage hover:text-white flex items-center justify-center shadow-lg transition-all text-xl" 
        aria-label="Close"
      >
        ✕
      </button>
      <div className="w-full max-w-sm bg-brand-teal border border-white/10 rounded-3xl shadow-2xl p-6 sm:p-8 relative overflow-hidden animate-modal-enter flex flex-col items-center text-center">
        <div className={`absolute top-[-50%] left-1/2 -translate-x-1/2 w-64 h-64 rounded-full opacity-20 blur-[80px] bg-current pointer-events-none ${details.colorClass.split(' ')[0]}`}></div>
        <div className="relative z-10 w-full">
            {suggestedReason ? (
                <div className="mb-6 bg-brand-dark/90 p-4 rounded-xl border border-white/10 shadow-lg">
                    <h3 className="text-[10px] text-brand-sage uppercase tracking-widest mb-1 font-bold">Your Check-in</h3>
                    <p className="text-sm text-brand-cream italic">{suggestedReason}</p>
                </div>
            ) : (
                <h3 className="text-[10px] text-brand-sage uppercase tracking-[0.2em] mb-4 font-bold">Confirm Selection</h3>
            )}
            {renderVisual()}
            <h2 className={`text-3xl font-black mb-3 uppercase tracking-wide ${details.colorClass.split(' ')[0]}`}>{mode}</h2>
            <p className="text-brand-cream mb-6 text-sm leading-relaxed font-normal min-h-[60px]">{details.description}</p>
            <div className="w-full mb-8">
                <p className="text-[10px] font-bold text-brand-sage uppercase tracking-widest mb-3">Time Commitment</p>
                <div className="grid grid-cols-3 gap-3">
                    <button onClick={() => setDuration('short')} className={`p-3 rounded-xl border flex flex-col items-center gap-1 transition-all duration-300 ${duration === 'short' ? 'bg-brand-dark border-brand-cream text-brand-cream shadow-[0_0_15px_rgba(255,255,255,0.15)] scale-105' : 'bg-brand-teal border-white/10 text-brand-sage hover:border-brand-sage hover:text-brand-cream'}`}>
                        <span className="text-lg">⚡</span>
                        <span className="text-[10px] font-bold uppercase">Spark</span>
                        <span className="text-[9px] opacity-60">2-5m</span>
                    </button>
                    <button onClick={() => setDuration('medium')} className={`p-3 rounded-xl border flex flex-col items-center gap-1 transition-all duration-300 ${duration === 'medium' ? 'bg-brand-dark border-brand-cream text-brand-cream shadow-[0_0_15px_rgba(255,255,255,0.15)] scale-105' : 'bg-brand-teal border-white/10 text-brand-sage hover:border-brand-sage hover:text-brand-cream'}`}>
                        <span className="text-lg">🌊</span>
                        <span className="text-[10px] font-bold uppercase">Flow</span>
                        <span className="text-[9px] opacity-60">10-15m</span>
                    </button>
                    <button onClick={() => setDuration('long')} className={`p-3 rounded-xl border flex flex-col items-center gap-1 transition-all duration-300 ${duration === 'long' ? 'bg-brand-dark border-brand-cream text-brand-cream shadow-[0_0_15px_rgba(255,255,255,0.15)] scale-105' : 'bg-brand-teal border-white/10 text-brand-sage hover:border-brand-sage hover:text-brand-cream'}`}>
                        <span className="text-lg">⚓</span>
                        <span className="text-[10px] font-bold uppercase">Deep</span>
                        <span className="text-[9px] opacity-60">20m+</span>
                    </button>
                </div>
            </div>
            <div className="flex gap-3 w-full">
                <button onClick={onCancel} className="flex-1 py-3.5 rounded-xl border border-white/10 text-brand-sage font-bold text-sm uppercase tracking-wider hover:bg-brand-dark hover:text-brand-cream transition-colors">Back</button>
                <button onClick={() => onConfirm(duration)} className={`flex-1 py-3.5 rounded-xl font-bold text-brand-teal text-sm uppercase tracking-wider bg-brand-green hover:bg-brand-green/90 transition-all shadow-lg hover:scale-[1.02] active:scale-[0.98]`}>Begin</button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ModeDetailModal;