import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface FloatingXPProps {
  xp: number;
  x: number;
  y: number;
  onComplete: () => void;
}

const FloatingXP: React.FC<FloatingXPProps> = ({ xp, x, y, onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(onComplete, 2000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0, y: y, x: x, scale: 0.5 }}
      animate={{ opacity: 1, y: y - 100, scale: 1.5 }}
      exit={{ opacity: 0, scale: 2 }}
      transition={{ duration: 1.5, ease: "easeOut" }}
      className="fixed z-[300] pointer-events-none font-black text-brand-green text-3xl drop-shadow-[0_0_10px_rgba(52,211,153,0.5)]"
    >
      +{xp} XP
    </motion.div>
  );
};

export default FloatingXP;
