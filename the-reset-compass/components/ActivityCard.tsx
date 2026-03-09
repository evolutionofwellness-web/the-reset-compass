
import React, { useState, useEffect } from 'react';
import { Activity, CompassMode } from '../types';
import { playSoundscape, stopSoundscape } from '../services/audioService';

interface ActivityCardProps {
  activity: Activity;
  currentMode: CompassMode | 'Quick Win' | null;
  onComplete: (notes: string) => void;
  onBack: () => void;
  onRegenerate: () => void;
  isLoading: boolean;
  themeColor?: string;
  isPro: boolean;
  dailyReshuffles: number;
}

const ActivityCard: React.FC<ActivityCardProps> = ({ activity, currentMode, onComplete, onBack, onRegenerate, isLoading, themeColor = "text-white", isPro, dailyReshuffles }) => {
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPlayingSound, setIsPlayingSound] = useState(false);

  useEffect(() => {
      // Cleanup audio on unmount
      return () => {
          stopSoundscape();
      };
  }, []);

  const toggleSound = () => {
      if (isPlayingSound) {
          stopSoundscape();
          setIsPlayingSound(false);
      } else {
          const modeForAudio = currentMode || CompassMode.Healing;
          playSoundscape(modeForAudio);
          setIsPlayingSound(true);
      }
  };

  const getTypeIcon = () => {
      switch(activity.type) {
          case 'movement': return '🏃';
          case 'nutritional': return '🍎';
          case 'breathing': return '🌬️';
          case 'reflection': return '🧠';
          case 'writing': return '✍️';
          case 'rest': return '🕯️';
          default: return '✨';
      }
  };

  if (isLoading) {
    return (
      <div className="w-full max-w-lg mx-auto glass-panel p-8 rounded-2xl flex flex-col items-center justify-center min-h-[400px] animate-pulse" aria-busy="true">
        <div className="w-16 h-16 rounded-full bg-white/10 mb-6"></div>
        <div className="h-6 w-3/4 bg-white/10 rounded mb-4"></div>
        <div className="h-4 w-1/2 bg-white/10 rounded mb-8"></div>
        <div className="space-y-3 w-full">
          <div className="h-2 w-full bg-white/10 rounded"></div>
          <div className="h-2 w-full bg-white/10 rounded"></div>
          <div className="h-2 w-5/6 bg-white/10 rounded"></div>
        </div>
        <p className="mt-8 text-brand-sage text-sm animate-bounce font-medium">Curating your path...</p>
      </div>
    );
  }

  const reshufflesLeft = Math.max(0, 3 - dailyReshuffles);

  const handleComplete = () => {
      if (isSubmitting) return;
      setIsSubmitting(true);
      stopSoundscape();
      onComplete(notes);
      setTimeout(() => setIsSubmitting(false), 2000);
  };

  return (
    <div className="w-full max-w-2xl mx-auto glass-panel rounded-3xl overflow-hidden shadow-2xl border border-white/10 animate-float">
      <div className="bg-brand-dark/50 p-5 sm:p-8 relative overflow-hidden border-b border-white/5">
        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
            <svg className="w-40 h-40" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zm0 9l2.5-1.25L12 8.5l-2.5 1.25L12 11zm0 2.5l-5-2.5-5 2.5L12 22l10-8.5-5-2.5-5 2.5z"/></svg>
        </div>
        <div className="relative z-10">
            <div className="flex justify-between items-start mb-6">
                <button onClick={onBack} className="text-brand-sage hover:text-brand-cream text-xs font-bold uppercase tracking-widest flex items-center gap-2 transition-colors">
                    ← Back
                </button>
                
                <div className="flex gap-2">
                    {isPro && (
                        <button 
                            onClick={toggleSound}
                            className={`flex items-center justify-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all min-w-[140px] border ${isPlayingSound ? 'bg-brand-green/10 text-brand-green border-brand-green/50' : 'bg-white/5 text-brand-sage border-white/10 hover:bg-white/10'}`}
                        >
                            {isPlayingSound ? (
                                <>
                                    <div className="flex items-end gap-[2px] h-3">
                                        <div className="w-[3px] bg-brand-green animate-[bounce_1s_infinite] h-full"></div>
                                        <div className="w-[3px] bg-brand-green animate-[bounce_1.2s_infinite] h-2/3"></div>
                                        <div className="w-[3px] bg-brand-green animate-[bounce_0.8s_infinite] h-1/2"></div>
                                    </div>
                                    <span>Stop Audio</span>
                                </>
                            ) : (
                                <>
                                    <span>🔈</span> Play Audio
                                </>
                            )}
                        </button>
                    )}
                </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div className="flex items-center gap-3">
                    <span className="text-3xl sm:text-4xl">{getTypeIcon()}</span>
                    <h2 className="text-3xl sm:text-4xl font-light text-brand-cream leading-tight">{activity.title}</h2>
                </div>
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border bg-brand-dark ${themeColor ? themeColor.replace('text-', 'border-').replace('text-', 'text-') : 'border-white/20 text-brand-cream'}`}>
                    {activity.duration}
                </span>
            </div>
            <p className="text-brand-sage text-lg mt-4 font-light leading-relaxed max-w-lg">{activity.description}</p>
        </div>
      </div>

      <div className="p-5 sm:p-8 space-y-8 bg-brand-dark/20">
        <div className="bg-brand-dark/40 p-5 rounded-xl border border-white/5">
            <h3 className="text-xs font-bold text-brand-sage uppercase tracking-widest mb-2 flex items-center gap-2">
                Why this works
            </h3>
            <p className={`text-base leading-relaxed ${themeColor}`}>
                {activity.benefits}
            </p>
        </div>

        <div>
            <h3 className="text-xs font-bold text-brand-sage uppercase tracking-widest mb-4">The Practice</h3>
            <div className="space-y-4">
                {activity.steps.map((step, idx) => (
                    <div key={idx} className="flex gap-4 items-start group">
                        <span className={`flex-shrink-0 w-6 h-6 rounded-full border border-brand-sage text-brand-sage flex items-center justify-center text-xs font-bold group-hover:bg-brand-dark group-hover:text-brand-cream transition-colors`}>
                            {idx + 1}
                        </span>
                        <p className="text-brand-cream leading-relaxed">{step}</p>
                    </div>
                ))}
            </div>
        </div>

        <div>
           <h3 className="text-xs font-bold text-brand-sage uppercase tracking-widest mb-2">Reflections (Optional)</h3>
           <textarea 
             className="w-full bg-brand-dark/80 border border-white/10 rounded-xl p-4 text-brand-cream placeholder-brand-sage focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green transition-all text-base"
             rows={3}
             placeholder="How do you feel? What came up during this practice?"
             value={notes}
             onChange={(e) => setNotes(e.target.value)}
             aria-label="Journal entry for this activity"
           />
        </div>

        <div className="pt-6 flex flex-col sm:flex-row gap-4 justify-between items-center border-t border-white/10">
            <div className="flex flex-col items-start gap-1">
                <button 
                    onClick={onRegenerate}
                    className="text-brand-sage hover:text-brand-cream text-xs font-bold uppercase tracking-widest transition-colors flex items-center gap-2 px-2 py-2"
                    aria-label="Try a different activity"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                    Try something else
                </button>
                {!isPro && (
                    <span className="text-[10px] text-brand-sage/60 pl-2">
                        Free Reshuffles: {reshufflesLeft} left
                    </span>
                )}
            </div>

            <button 
                onClick={handleComplete}
                disabled={isSubmitting}
                className={`w-full sm:w-auto px-8 py-3 rounded-full font-bold text-brand-teal shadow-lg transition-all transform hover:scale-105 active:scale-95 bg-brand-green hover:bg-brand-green/90 flex items-center justify-center gap-2 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                aria-label="Complete activity and save to journal"
            >
                {isSubmitting ? (
                    <span className="flex items-center gap-2">Saving...</span>
                ) : (
                    <>
                    <span>Complete & Log</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    </>
                )}
            </button>
        </div>

        <div className="pt-4 border-t border-white/5 text-center">
            <p className="text-[10px] text-brand-sage/60 leading-tight max-w-lg mx-auto">
                <strong>Safety First:</strong> Listen to your body. Modify movements to fit your ability. Stop if you feel pain. 
                Activities align with general wellness guidelines (e.g., CDC/ACE) but are not medical advice. 
                Consult a doctor before starting new nutritional or physical exercises.
            </p>
        </div>
      </div>
    </div>
  );
};

export default ActivityCard;