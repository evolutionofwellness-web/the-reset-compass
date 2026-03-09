import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, Star, Zap, Heart } from 'lucide-react';

interface StreakMilestoneProps {
  days: number;
  onClose: () => void;
}

const StreakMilestone: React.FC<StreakMilestoneProps> = ({ days, onClose }) => {
  const getMilestoneData = () => {
    if (days === 3) return { title: "Momentum Building", message: "Three days in a row. You're starting to find your rhythm.", icon: <Zap size={48} />, color: "from-brand-green to-brand-teal" };
    if (days === 7) return { title: "One Week Strong", message: "Seven days of showing up for yourself. This is how habits are born.", icon: <Star size={48} />, color: "from-brand-green to-brand-teal" };
    if (days === 14) return { title: "The Two Week Mark", message: "14 days. Your nervous system is starting to recognize this new baseline.", icon: <Heart size={48} />, color: "from-brand-green to-brand-teal" };
    if (days === 30) return { title: "Monthly Master", message: "30 days of consistency. You aren't just trying anymore, you are doing.", icon: <Trophy size={48} />, color: "from-brand-green to-brand-teal" };
    return { title: "Consistency King", message: `${days} days of dedication. Keep rising.`, icon: <Trophy size={48} />, color: "from-brand-green to-brand-teal" };
  };

  const data = getMilestoneData();

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] bg-brand-teal/95 backdrop-blur-xl flex items-center justify-center p-6"
    >
      <button 
        onClick={onClose} 
        className="absolute top-[60px] right-6 z-[210] w-12 h-12 rounded-full bg-brand-dark/50 backdrop-blur-md border border-white/10 text-brand-sage hover:text-white flex items-center justify-center shadow-lg transition-all text-xl" 
        aria-label="Close"
      >
        ✕
      </button>
      <motion.div
        initial={{ scale: 0.8, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="max-w-sm w-full bg-brand-dark rounded-[40px] p-8 border border-white/10 text-center relative overflow-hidden"
      >
        <div className={`absolute inset-0 bg-gradient-to-b ${data.color} opacity-10`} />
        
        <div className="relative z-10">
          <div className={`w-24 h-24 mx-auto rounded-full bg-gradient-to-br ${data.color} flex items-center justify-center text-white mb-8 shadow-2xl shadow-white/10`}>
            {data.icon}
          </div>

          <h2 className="text-4xl font-serif text-brand-cream mb-2">{days} Day Streak</h2>
          <h3 className="text-xl font-bold text-brand-green mb-6">{data.title}</h3>
          
          <p className="text-brand-sage leading-relaxed mb-12">
            {data.message}
          </p>

          <button
            onClick={onClose}
            className={`w-full py-5 rounded-2xl font-black text-lg bg-gradient-to-r ${data.color} text-white shadow-xl`}
          >
            Keep Rising
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default StreakMilestone;
