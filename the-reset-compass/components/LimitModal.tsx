
import React from 'react';

interface LimitModalProps {
  onClose: () => void;
  onUpgrade: () => void;
}

const LimitModal: React.FC<LimitModalProps> = ({ onClose, onUpgrade }) => {
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
        className="absolute right-6 z-[60] rounded-full bg-brand-dark/50 backdrop-blur-md border border-white/10 text-brand-sage hover:text-white flex items-center justify-center shadow-lg transition-all text-xl" 
        aria-label="Close"
      >
        ✕
      </button>
      <div className="w-full max-w-sm bg-brand-teal border border-white/10 rounded-3xl shadow-2xl p-6 text-center animate-modal-enter">
        <div className="mb-4 text-4xl">⏳</div>
        <h2 className="text-xl font-bold text-brand-cream mb-2">Daily Limit Reached</h2>
        <p className="text-brand-sage text-sm mb-6 leading-relaxed">
            Free members can complete <strong>1 main activity per day</strong> to ensure intentionality.
            <br/><br/>
            Need more? Unlock Compass+ for unlimited flows, or come back tomorrow.
        </p>
        
        <div className="space-y-3">
            <button 
                onClick={onUpgrade}
                className="w-full py-3 bg-gradient-to-r from-brand-green to-brand-teal text-brand-cream font-bold rounded-xl hover:shadow-lg hover:scale-[1.02] transition-all"
            >
                Unlock Unlimited Access
            </button>
            <button 
                onClick={onClose}
                className="w-full py-3 text-brand-sage hover:text-brand-cream text-xs font-bold uppercase tracking-widest transition-colors"
            >
                I'll come back tomorrow
            </button>
        </div>
      </div>
    </div>
  );
};

export default LimitModal;
