import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, Sparkles } from 'lucide-react';
import { UserStats } from '../types';

interface CelebrationOverlayProps {
  onClose: () => void;
  stats: UserStats;
  earnedXP: number;
  activityTitle?: string;
  mode?: string;
  onShare?: (data: any) => void;
}

const CELEBRATION_MESSAGES = [
  "Incredible work!",
  "You're crushing it!",
  "Consistency is key.",
  "Body and mind in sync.",
  "Small wins, big impact.",
  "Nervous system: Reset.",
  "You're doing great!",
  "Keep it up!",
  "Solid choice.",
  "Mindful and strong."
];

const CelebrationOverlay: React.FC<CelebrationOverlayProps> = ({ onClose, earnedXP, onShare, activityTitle, mode, stats }) => {
  const [message] = useState(() => CELEBRATION_MESSAGES[Math.floor(Math.random() * CELEBRATION_MESSAGES.length)]);
  const [show, setShow] = useState(false);

  const handleShare = () => {
    if (onShare) {
      onShare({
        title: message,
        activity: activityTitle,
        mode: mode,
        xp: earnedXP,
        streak: stats.streak,
        rank: stats.level,
        completedParts: stats.currentRecommendation?.completedParts || [],
        dayCompletedToday: stats.dayCompletedToday
      });
    }
  };

  useEffect(() => {
    setShow(true);
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[300] bg-brand-green flex flex-col items-center justify-center p-6 text-center"
    >
      {/* Safe area adjusted close button */}
      <button 
        onClick={onClose} 
        style={{ 
          top: 'calc(max(60px, env(safe-area-inset-top) + 16px))',
          minWidth: '44px',
          minHeight: '44px'
        }}
        className="absolute right-6 z-[310] rounded-full bg-brand-dark/50 backdrop-blur-md border border-white/10 text-brand-sage hover:text-white flex items-center justify-center shadow-lg transition-all text-xl" 
        aria-label="Close"
      >
        ✕
      </button>
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", damping: 15, stiffness: 200, delay: 0.2 }}
        className="mb-8"
      >
        <div className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center relative">
          <CheckCircle2 size={80} className="text-white" />
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 bg-white/10 rounded-full"
          />
        </div>
      </motion.div>

      <motion.h2
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-4xl sm:text-5xl font-black text-white mb-4 uppercase italic tracking-tighter"
      >
        {message}
      </motion.h2>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="flex flex-col items-center gap-1 mb-12"
      >
        <span className="text-white/60 text-xs font-black uppercase tracking-widest">XP Earned</span>
        <span className="text-6xl font-black text-white flex items-center gap-2">
          +{earnedXP}
          <Sparkles size={32} />
        </span>
      </motion.div>

      <motion.button
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.7 }}
        whileTap={{ scale: 0.95 }}
        onClick={onClose}
        className="w-full max-w-xs py-5 bg-brand-teal text-brand-green font-black text-xl rounded-3xl shadow-2xl shadow-black/20 uppercase tracking-widest mb-4"
      >
        Keep going
      </motion.button>

      {onShare && (
        <motion.button
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
          onClick={handleShare}
          className="text-white/40 hover:text-white transition-colors text-[10px] font-black uppercase tracking-[0.3em]"
        >
          Share Achievement
        </motion.button>
      )}
    </motion.div>
  );
};

export default CelebrationOverlay;