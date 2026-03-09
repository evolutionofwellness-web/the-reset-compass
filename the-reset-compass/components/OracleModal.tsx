import React, { useState, useEffect, useRef } from 'react';
import { askOracle } from '../services/geminiService';
import { detectHarmfulContent } from '../services/safetyService';
import { getStats } from '../services/storageService';

interface OracleModalProps {
  onClose: () => void;
  onCrisisDetected?: () => void;
}

const OracleModal: React.FC<OracleModalProps> = ({ onClose, onCrisisDetected }) => {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState<string | null>(null);
  const [displayedResponse, setDisplayedResponse] = useState('');
  const [status, setStatus] = useState<'idle' | 'concentrating' | 'revealing'>('idle');
  const typingTimeoutRef = useRef<number | null>(null);
  const stats = getStats();

  useEffect(() => {
    if (status === 'revealing' && response) {
      setDisplayedResponse('');
      let i = 0;
      const typeChar = () => {
        setDisplayedResponse(response.slice(0, i + 1));
        i++;
        if (i < response.length) {
          typingTimeoutRef.current = window.setTimeout(typeChar, 30 + Math.random() * 40);
        }
      };
      typeChar();
    }
    return () => {
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    };
  }, [status, response]);

  const handleAsk = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!query.trim()) return;
      
      if (detectHarmfulContent(query)) {
          if (onCrisisDetected) onCrisisDetected();
          return;
      }

      setStatus('concentrating');
      
      try {
          const startTime = Date.now();
          
          // Prepare context
          const context = {
            onboarding: stats.onboarding,
            lastCheckIn: stats.lastCheckIn,
            recommendationHistory: stats.recommendationHistory?.slice(0, 3)
          };

          const result = await askOracle(query, context);
          const elapsed = Date.now() - startTime;
          const remainingDelay = Math.max(0, 2500 - elapsed);

          setTimeout(() => {
              setResponse(result.answer);
              setStatus('revealing');
          }, remainingDelay);
      } catch (e) {
          console.error(e);
          setResponse("The mists are too thick. I cannot see clearly right now.");
          setStatus('revealing');
      }
  };

  const resetOracle = () => {
      setResponse(null);
      setDisplayedResponse('');
      setQuery('');
      setStatus('idle');
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black animate-fade-in overflow-hidden">
      {/* Safe area adjusted close button */}
      <button 
        onClick={onClose} 
        style={{ 
          top: 'calc(max(60px, env(safe-area-inset-top) + 16px))',
          minWidth: '44px',
          minHeight: '44px'
        }}
        className="absolute right-6 z-[60] rounded-full bg-brand-dark/50 backdrop-blur-md border border-white/10 text-brand-sage hover:text-white flex items-center justify-center shadow-lg transition-all text-xl" 
        aria-label="Close Oracle"
      >
        ✕
      </button>
      {/* Mystical Background Layers */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-brand-teal/20 via-brand-dark to-brand-dark pointer-events-none"></div>
      
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        {[...Array(50)].map((_, i) => (
            <div 
                key={i} 
                className="absolute bg-white rounded-full animate-twinkle"
                style={{
                    width: Math.random() * 2 + 'px',
                    height: Math.random() * 2 + 'px',
                    top: Math.random() * 100 + '%',
                    left: Math.random() * 100 + '%',
                    animationDelay: Math.random() * 5 + 's',
                    animationDuration: Math.random() * 3 + 2 + 's'
                }}
            />
        ))}
      </div>

      {/* Header with Safe Area Inset */}
      <header 
        className={`relative z-20 w-full p-6 sm:p-8 flex justify-between items-start transition-opacity duration-1000 ${status === 'concentrating' ? 'opacity-0' : 'opacity-100'}`}
        style={{ paddingTop: 'calc(env(safe-area-inset-top) + 1.5rem)' }}
      >
          <div className="flex flex-col">
              <h2 className="text-2xl sm:text-3xl font-serif text-white tracking-[0.2em] font-light drop-shadow-[0_0_10px_rgba(255,255,255,0.5)] uppercase">AI Wellness Advice</h2>
              <div className="h-px w-24 bg-gradient-to-r from-transparent via-white/50 to-transparent mt-2"></div>
          </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 relative z-10 w-full max-w-2xl px-6 mx-auto flex flex-col items-center justify-center">
        {status === 'idle' && (
            <form onSubmit={handleAsk} className="w-full animate-modal-enter flex flex-col items-center">
                <div className="mb-8 sm:mb-12 w-24 h-24 sm:w-32 sm:h-32 rounded-full border border-white/10 flex items-center justify-center relative group">
                    <div className="absolute inset-0 rounded-full border border-white/5 animate-ping opacity-20"></div>
                    <div className="absolute inset-0 rounded-full bg-white/5 blur-xl group-hover:bg-indigo-500/20 transition-colors duration-1000"></div>
                    <span className="text-3xl sm:text-4xl">👁️</span>
                </div>

                <p className="text-brand-cream text-lg sm:text-2xl font-serif font-light text-center mb-8 max-w-lg leading-relaxed">
                    Ask a question and see what the AI guide suggests.
                </p>
                
                <div className="relative w-full max-w-xl group">
                    <input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="What do you seek?"
                        className="w-full bg-transparent border-b border-white/20 py-4 text-center text-white placeholder-brand-sage focus:outline-none focus:border-white/60 transition-all font-serif text-xl sm:text-2xl"
                        autoFocus
                    />
                    <div className="absolute bottom-0 left-0 w-0 h-px bg-white transition-all duration-700 group-focus-within:w-full"></div>
                </div>

                <button 
                    type="submit"
                    disabled={!query.trim()}
                    className="mt-10 sm:mt-12 px-10 py-4 border border-white/20 text-white font-serif tracking-[0.2em] uppercase text-xs hover:bg-white hover:text-black hover:scale-105 active:scale-95 transition-all duration-500 disabled:opacity-0 disabled:translate-y-4 shadow-lg"
                >
                    Ask
                </button>
            </form>
        )}

        {status === 'concentrating' && (
            <div className="flex flex-col items-center justify-center">
                <div className="relative w-32 h-32 sm:w-40 sm:h-40">
                     <div className="absolute inset-0 rounded-full border border-t-white/80 border-r-transparent border-b-white/20 border-l-transparent animate-spin duration-[3s]"></div>
                     <div className="absolute inset-2 rounded-full border border-b-brand-teal/80 border-l-transparent border-t-brand-teal/20 border-r-transparent animate-spin-reverse duration-[5s]"></div>
                     <div className="absolute inset-0 flex items-center justify-center">
                         <div className="w-2 h-2 bg-white rounded-full animate-pulse shadow-[0_0_20px_white]"></div>
                     </div>
                </div>
                <p className="mt-8 text-brand-teal/60 font-serif text-sm tracking-[0.3em] animate-pulse">THINKING...</p>
            </div>
        )}

        {status === 'revealing' && (
            <div className="w-full max-w-2xl flex flex-col items-center text-center animate-scale-in">
                <div className="mb-6 sm:mb-8 opacity-50 px-4">
                    <p className="text-[10px] text-brand-sage uppercase tracking-widest mb-2 font-bold">The Query</p>
                    <p className="text-brand-cream font-serif italic text-sm">{query}</p>
                </div>

                <div className="relative p-6 sm:p-12 border-y border-white/10 bg-white/5 backdrop-blur-sm rounded-lg mb-8 sm:mb-10 w-full shadow-[0_0_100px_rgba(79,70,22,0.1)]">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-brand-teal to-transparent opacity-50"></div>
                    <p className="text-lg sm:text-3xl text-white font-serif leading-relaxed min-h-[100px] text-shadow-lg">
                        {displayedResponse}
                        <span className="animate-blink inline-block w-2 h-6 bg-white/50 ml-1 align-middle"></span>
                    </p>
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-brand-teal to-transparent opacity-50"></div>
                </div>

                <button 
                    onClick={resetOracle}
                    className="text-[11px] text-brand-sage hover:text-white transition-colors uppercase tracking-[0.2em] hover:scale-105 transform duration-300 font-bold"
                >
                    Seek Further
                </button>
            </div>
        )}
      </div>

      {/* Footer with Safe Area Inset and Thumb-friendly Button */}
      <footer 
        className="relative z-20 w-full p-4 sm:p-6 bg-black/40 backdrop-blur-sm border-t border-white/5 flex flex-col items-center gap-4"
        style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 1rem)' }}
      >
          <button 
            onClick={onClose}
            className="w-full max-w-sm py-3.5 bg-slate-900 border border-white/10 text-white font-bold rounded-xl text-xs uppercase tracking-[0.2em] hover:bg-slate-800 transition-all shadow-xl"
          >
              Return to Compass
          </button>
          <div className="text-[9px] text-white/10 uppercase tracking-[0.5em] font-bold">
            Evolution of Wellness LLC
          </div>
      </footer>
    </div>
  );
};

export default OracleModal;