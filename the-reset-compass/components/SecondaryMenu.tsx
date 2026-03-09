import React from 'react';
import { motion } from 'motion/react';
import { X, Compass, MessageSquare, Target, History, Award, Map, Zap, Settings, Info, Lock, Sparkles, ArrowRight } from 'lucide-react';
import { UserStats } from '../types';

interface SecondaryMenuProps {
  onClose: () => void;
  stats: UserStats;
  onNavigate: (view: string) => void;
}

const SecondaryMenu: React.FC<SecondaryMenuProps> = ({ onClose, stats, onNavigate }) => {
  const menuItems = [
    { id: 'dashboard', label: "Today's Path", icon: <Target />, description: 'What to do today', pro: false },
    { id: 'quickwin', label: 'Quick Win', icon: <Zap />, description: 'A 2-minute reset right now', pro: false },
    { id: 'guide', label: 'User Guide', icon: <Compass />, description: 'How to navigate your nervous system', pro: false },
    { id: 'oracle', label: 'AI Wellness Advice', icon: <MessageSquare />, description: 'Get personalized advice from your AI guide', pro: true },
    { id: 'journey', label: 'Your Journey', icon: <Award />, description: 'Your progress and achievements', pro: false },
    { id: 'history', label: 'History & Insights', icon: <History />, description: 'See your past plans and trends', pro: true },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] bg-brand-dark/95 backdrop-blur-xl flex flex-col"
    >
      {/* Safe area adjusted close button */}
      <button 
        onClick={onClose} 
        style={{ 
          top: 'calc(max(60px, env(safe-area-inset-top) + 16px))',
          minWidth: '44px',
          minHeight: '44px'
        }}
        className="absolute right-6 z-[210] rounded-full bg-brand-dark/50 backdrop-blur-md border border-white/10 text-brand-sage hover:text-white flex items-center justify-center shadow-lg transition-all text-xl" 
        aria-label="Close Menu"
      >
        <X size={24} />
      </button>

      <div className="flex items-center justify-between p-8 pt-20 border-b border-white/5">
        <div>
          <h2 className="text-2xl font-serif text-brand-cream">The Reset Compass</h2>
          <p className="text-brand-sage text-xs opacity-60">Version 1.0.4 • {stats.level}</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
        <div className="grid grid-cols-1 gap-3">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => { onNavigate(item.id); onClose(); }}
              className="flex items-center gap-4 p-5 rounded-[28px] bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 transition-all text-left group relative overflow-hidden"
            >
              <div className={`p-3 rounded-2xl transition-transform group-hover:scale-110 ${
                item.pro && !stats.isPro ? 'bg-white/5 text-white/20' : 'bg-brand-green/10 text-brand-green'
              }`}>
                {item.icon}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-brand-cream">{item.label}</span>
                  {item.pro && !stats.isPro && <Lock size={12} className="text-white/20" />}
                </div>
                <div className="text-xs text-brand-sage opacity-60">{item.description}</div>
              </div>
              {item.pro && !stats.isPro && (
                <div className="absolute top-0 right-0 p-2">
                  <span className="text-[8px] font-black bg-brand-green/20 text-brand-green px-2 py-0.5 rounded-full uppercase tracking-widest">Compass+</span>
                </div>
              )}
            </button>
          ))}
        </div>

        {!stats.isPro && (
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => { onNavigate('premium'); onClose(); }}
            className="w-full p-6 rounded-[32px] bg-gradient-to-br from-brand-green to-brand-teal text-brand-teal flex items-center justify-between group shadow-xl shadow-brand-green/20"
          >
            <div className="text-left">
              <div className="flex items-center gap-2 mb-1">
                <Sparkles size={18} />
                <span className="font-black uppercase tracking-widest text-sm">Upgrade to Compass+</span>
              </div>
              <p className="text-xs font-bold opacity-80">Unlock AI advice and your full history</p>
            </div>
            <ArrowRight className="group-hover:translate-x-2 transition-transform" />
          </motion.button>
        )}

        <div className="pt-8 border-t border-white/5 space-y-6">
          <div className="flex items-center justify-between">
            <button 
              onClick={() => { onNavigate('settings'); onClose(); }}
              className="flex items-center gap-3 text-brand-sage hover:text-white transition-colors text-sm font-bold"
            >
              <Settings size={18} />
              Settings
            </button>
            <button 
              onClick={() => { onNavigate('about'); onClose(); }}
              className="flex items-center gap-3 text-brand-sage hover:text-white transition-colors text-sm font-bold"
            >
              <Info size={18} />
              About
            </button>
          </div>
        </div>
      </div>

      <div className="p-8 text-center">
        <div className="text-[10px] font-black text-white/10 uppercase tracking-[0.5em]">Evolution of Wellness LLC</div>
      </div>
    </motion.div>
  );
};

export default SecondaryMenu;
