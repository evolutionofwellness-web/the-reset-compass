import React from 'react';
import { WeeklyFocus } from '../types';

interface WeeklyFocusWidgetProps {
  focus: WeeklyFocus;
  onCheckIn: () => void;
}

const WeeklyFocusWidget: React.FC<WeeklyFocusWidgetProps> = ({ focus, onCheckIn }) => {
  const today = new Date().toDateString();
  const lastProgress = focus.lastProgressDate ? new Date(focus.lastProgressDate).toDateString() : null;
  const isCheckedInToday = today === lastProgress;

  const progress = (focus.currentDay / focus.totalDays) * 100;

  const handleCheckIn = (e: React.MouseEvent) => {
      e.stopPropagation();
      if (!isCheckedInToday) {
          onCheckIn();
      }
  };

  return (
    <div className="w-full max-w-sm mx-auto mb-8 bg-brand-dark/40 backdrop-blur-md border border-brand-green/20 rounded-2xl p-0 relative overflow-hidden group hover:border-brand-green/40 transition-all shadow-lg animate-fade-in">
      <div className="absolute top-[-50%] right-[-50%] w-64 h-64 bg-brand-green/5 blur-[60px] rounded-full pointer-events-none transition-opacity duration-1000 group-hover:opacity-100"></div>

      <div className="p-5 relative z-10">
        <div className="flex justify-between items-start mb-3">
            <div>
                <span className="inline-block px-2 py-0.5 rounded bg-brand-green/10 text-[9px] font-bold uppercase tracking-widest text-brand-green border border-brand-green/20 mb-2">
                    Weekly Focus
                </span>
                <h3 className="text-lg font-serif text-brand-cream leading-tight">{focus.title}</h3>
            </div>
            <div className="text-right">
                <span className="text-xs font-bold text-brand-sage block">
                    Day {Math.min(focus.currentDay, focus.totalDays)}/{focus.totalDays}
                </span>
            </div>
        </div>
        
        <div className="text-[13px] text-brand-sage mb-6 leading-relaxed whitespace-pre-line border-l-2 border-brand-green/20 pl-4 py-1">
            {focus.description}
        </div>

        <div className="flex items-center gap-4">
            <div className="h-1.5 flex-1 bg-white/10 rounded-full overflow-hidden relative">
                <div 
                    className="h-full bg-gradient-to-r from-brand-teal via-brand-green to-brand-green transition-all duration-[1500ms] ease-out shadow-[0_0_10px_rgba(79,176,109,0.5)]" 
                    style={{ width: `${progress}%` }}
                ></div>
                <div 
                    className="absolute top-0 h-full w-1 bg-white blur-[1px]" 
                    style={{ left: `${progress}%`, transition: 'left 1500ms ease-out' }}
                ></div>
            </div>

            {!isCheckedInToday ? (
                <button 
                    onClick={handleCheckIn}
                    className="shrink-0 px-4 py-2 bg-brand-green hover:bg-brand-green/90 text-brand-dark text-[10px] font-black uppercase tracking-wider rounded-xl shadow-lg hover:shadow-brand-green/30 transition-all transform active:scale-90 animate-pulse"
                >
                    Commit
                </button>
            ) : (
                <div className="shrink-0 flex items-center gap-1 text-brand-green animate-scale-in bg-brand-green/10 px-3 py-2 rounded-xl border border-brand-green/20">
                    <span className="text-[10px] font-black uppercase tracking-wide">Done</span>
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default WeeklyFocusWidget;