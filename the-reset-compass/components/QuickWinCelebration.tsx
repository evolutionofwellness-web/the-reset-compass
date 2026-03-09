import React, { useEffect, useState, useRef } from 'react';
import { UserStats } from '../types';
import { getStats } from '../services/storageService';

interface QuickWinCelebrationProps {
  onAnother: () => void;
  onDone: () => void;
  onShare: (data: any) => void;
}

const QuickWinCelebration: React.FC<QuickWinCelebrationProps> = ({ onAnother, onDone, onShare }) => {
  const [show, setShow] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [stats] = useState<UserStats>(getStats());

  useEffect(() => {
    if (containerRef.current) containerRef.current.scrollTop = 0;
    const timer = setTimeout(() => setShow(true), 50);
    return () => clearTimeout(timer);
  }, []);

  const handleShare = () => {
    const data = {
        title: '⚡ Quick Win!',
        text: 'Just secured an Empowered Win on The Reset Compass!',
        activity: 'a 2-minute Quick Win',
        rank: stats.level,
        xp: stats.xp,
        streak: stats.streak,
        mode: 'Grounded',
        completedParts: stats.currentRecommendation?.completedParts || [],
        dayCompletedToday: stats.dayCompletedToday
    };
    onShare(data);
  };

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 z-[100] bg-brand-dark/95 backdrop-blur-xl overflow-y-auto overflow-x-hidden flex flex-col items-center"
    >
        {/* Safe area adjusted close button */}
        <button 
          onClick={onDone} 
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
        {/* Burst Background */}
        <div className={`fixed inset-0 bg-[radial-gradient(circle_at_center,_rgba(16,185,129,0.1),_transparent)] transition-opacity duration-1000 pointer-events-none ${show ? 'opacity-100' : 'opacity-0'}`}></div>

        <div className={`relative z-10 w-full max-w-sm px-6 py-16 flex flex-col items-center text-center transition-all duration-500 transform ${show ? 'scale-100 opacity-100' : 'scale-90 opacity-0'}`}>
            <div className="h-[env(safe-area-inset-top)] mb-4"></div>
            
            <div className="w-24 h-24 bg-brand-green rounded-3xl flex items-center justify-center mb-8 shadow-[0_0_40px_rgba(16,185,129,0.4)] animate-bounce-slow">
                <span className="text-4xl">⚡</span>
            </div>
            
            <h2 className="text-4xl font-black text-brand-cream mb-2 uppercase italic tracking-tight">BOOM! DONE.</h2>
            <p className="text-brand-green font-black uppercase tracking-[0.2em] text-[10px] mb-8">Empowered Win: +15 XP</p>
            
            <p className="text-brand-sage text-base leading-relaxed mb-10 max-w-[280px]">
                Instant energy shift successful. Your momentum is building.
            </p>

            <div className="w-full space-y-3 pb-12">
                <button 
                    onClick={onAnother}
                    className="w-full py-4 bg-brand-green text-brand-teal font-black text-sm uppercase tracking-widest rounded-2xl hover:bg-brand-green/90 transition-all shadow-xl active:scale-95"
                >
                    One More?
                </button>
                <button 
                    onClick={onDone}
                    className="w-full py-4 bg-white/5 border border-white/10 text-brand-cream font-bold text-xs uppercase tracking-widest rounded-2xl hover:bg-white/10 transition-all shadow-md"
                >
                    Return to Compass
                </button>
                <button 
                    onClick={handleShare}
                    className="pt-4 text-brand-sage hover:text-brand-cream transition-colors text-[10px] font-bold uppercase tracking-widest"
                >
                    Share Win
                </button>
            </div>
        </div>

        {/* Confetti */}
        {show && [...Array(20)].map((_, i) => (
           <div 
            key={i}
            className="fixed top-0 w-1.5 h-1.5 rounded-full animate-fall pointer-events-none"
            style={{
                left: `${Math.random() * 100}%`,
                backgroundColor: ['#34d399', '#60a5fa', '#fbbf24'][i % 3],
                animationDuration: `${Math.random() * 2 + 1.5}s`,
                animationDelay: `${Math.random() * 0.2}s`
            }}
           ></div>
       ))}
    </div>
  );
};

export default QuickWinCelebration;