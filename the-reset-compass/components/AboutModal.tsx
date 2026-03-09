import React from 'react';
import { APP_VERSION } from '../types';
import { Compass } from 'lucide-react';

interface AboutModalProps {
  onClose: () => void;
  onOpenLegal: () => void;
}

const AboutModal: React.FC<AboutModalProps> = ({ onClose, onOpenLegal }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-dark/90 backdrop-blur-md animate-fade-in">
      {/* Safe area adjusted close button */}
      <button 
        onClick={onClose} 
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
      <div className="w-full max-w-lg bg-brand-teal border border-white/10 rounded-3xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden animate-modal-enter relative">
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-brand-green/20 to-transparent pointer-events-none"></div>
        <div className="p-6 sm:p-8 relative z-10 overflow-y-auto custom-scrollbar">
            <div className="flex justify-center mb-8">
                <div className="w-32 h-32 bg-brand-cream rounded-3xl flex items-center justify-center border border-brand-teal shadow-2xl overflow-hidden p-2 transform -rotate-3 hover:rotate-0 transition-transform duration-500">
                    <Compass size={64} className="text-brand-teal" />
                </div>
            </div>
            
            <h2 className="text-3xl font-serif text-brand-cream mb-4 italic text-center">Reset. Regulate. Rise.</h2>
            
            <div className="space-y-4 text-brand-sage text-sm leading-relaxed mb-8">
                <p>
                    <strong>The Reset Compass</strong> is your personal AI wellness guide, helping you find your natural balance through small, intentional daily actions.
                </p>
                <p>
                    By checking in with your energy and available time each day, we create a personalized plan for your <strong>movement, fuel, and recovery</strong> that fits your real life.
                </p>
                <p>
                    With <strong>Compass+</strong>, you unlock deeper insights, personalized AI wellness advice, and a full history of your journey toward better health.
                </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                <div className="bg-brand-dark/50 rounded-2xl p-4 border border-white/10">
                    <h3 className="text-[10px] font-black text-brand-green uppercase tracking-widest mb-2">Habit-Centered</h3>
                    <p className="text-[11px] text-brand-sage">Small daily wins lead to big changes over time.</p>
                </div>
                <div className="bg-brand-dark/50 rounded-2xl p-4 border border-white/10">
                    <h3 className="text-[10px] font-black text-brand-green uppercase tracking-widest mb-2">Science-Guided</h3>
                    <p className="text-[11px] text-brand-sage">Based on proven wellness and mindset techniques.</p>
                </div>
                <div className="bg-brand-dark/50 rounded-2xl p-4 border border-white/10">
                    <h3 className="text-[10px] font-black text-brand-green uppercase tracking-widest mb-2">AI-Powered</h3>
                    <p className="text-[11px] text-brand-sage">Personalized guidance that grows with you.</p>
                </div>
                <div className="bg-brand-dark/50 rounded-2xl p-4 border border-white/10">
                    <h3 className="text-[10px] font-black text-brand-green uppercase tracking-widest mb-2">Compass+</h3>
                    <p className="text-[11px] text-brand-sage">Unlock your full potential with premium insights.</p>
                </div>
            </div>
            
            <div className="text-center pt-6 border-t border-white/10">
                <button onClick={onOpenLegal} className="text-xs text-brand-sage hover:text-brand-cream underline underline-offset-4">Legal, Privacy & Terms</button>
                <p className="text-[10px] text-brand-sage/60 mt-3 font-medium tracking-wider uppercase">
                    v{APP_VERSION} • EVOLUTION OF WELLNESS LLC
                </p>
                <p className="text-[9px] text-brand-sage/40 mt-1">compass.evolutionofwellness.com</p>
            </div>
        </div>
      </div>
    </div>
  );
};
export default AboutModal;