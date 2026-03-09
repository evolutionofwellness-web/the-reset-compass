import React from 'react';
import { motion } from 'motion/react';
import { Award, Sparkles, ArrowRight } from 'lucide-react';
import { RankInfo } from '../types';

interface RankUpModalProps {
  rank: RankInfo;
  onClose: () => void;
}

const RankUpModal: React.FC<RankUpModalProps> = ({ rank, onClose }) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[250] bg-brand-dark/95 backdrop-blur-2xl flex items-center justify-center p-6"
    >
      <button 
        onClick={onClose} 
        className="absolute top-[60px] right-6 z-[260] w-12 h-12 rounded-full bg-brand-dark/50 backdrop-blur-md border border-white/10 text-brand-sage hover:text-white flex items-center justify-center shadow-lg transition-all text-xl" 
        aria-label="Close"
      >
        ✕
      </button>
      <motion.div
        initial={{ scale: 0.8, y: 40, rotate: -5 }}
        animate={{ scale: 1, y: 0, rotate: 0 }}
        className="max-w-sm w-full bg-brand-teal rounded-[48px] p-8 border border-white/10 text-center relative overflow-hidden shadow-2xl shadow-brand-green/20"
      >
        <div className={`absolute inset-0 bg-gradient-to-b from-brand-green/20 to-transparent opacity-30`} />
        
        <div className="relative z-10">
          <motion.div 
            animate={{ 
              rotate: [0, 10, -10, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ duration: 5, repeat: Infinity }}
            className={`w-32 h-32 mx-auto rounded-[32px] bg-gradient-to-br from-brand-green to-brand-teal flex items-center justify-center text-brand-teal mb-8 shadow-2xl shadow-brand-green/40`}
          >
            <Award size={64} />
          </motion.div>

          <div className="flex items-center justify-center gap-2 mb-2">
            <Sparkles className="text-brand-green" size={16} />
            <span className="text-xs font-black uppercase tracking-[0.3em] text-brand-green">New Rank Achieved</span>
            <Sparkles className="text-brand-green" size={16} />
          </div>

          <h2 className="text-5xl font-serif text-brand-cream mb-4 italic">{rank.title}</h2>
          
          <div className="bg-white/5 rounded-3xl p-6 mb-10 border border-white/5">
            <p className="text-brand-sage leading-relaxed text-sm">
              {rank.perk}
            </p>
          </div>

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={onClose}
            className="w-full py-5 rounded-2xl font-black text-xl bg-brand-green text-brand-teal shadow-xl shadow-brand-green/20 flex items-center justify-center gap-2"
          >
            Continue Journey
            <ArrowRight size={24} />
          </motion.button>
        </div>

        {/* Decorative elements */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-brand-green/10 blur-3xl rounded-full" />
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-brand-teal/10 blur-3xl rounded-full" />
      </motion.div>
    </motion.div>
  );
};

export default RankUpModal;
