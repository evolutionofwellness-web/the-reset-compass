
import React, { useState } from 'react';

interface PurchaseSuccessModalProps {
  onClose: () => void;
}

const RECOVERY_CODE = "COMPASS-PLUS-FOREVER";

const PurchaseSuccessModal: React.FC<PurchaseSuccessModalProps> = ({ onClose }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(RECOVERY_CODE);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-brand-dark/95 backdrop-blur-xl animate-fade-in">
      {/* Safe area adjusted close button */}
      <button 
        onClick={onClose} 
        style={{ 
          top: 'calc(max(60px, env(safe-area-inset-top) + 16px))',
          minWidth: '44px',
          minHeight: '44px'
        }}
        className="absolute right-6 z-[210] rounded-full bg-brand-dark/50 backdrop-blur-md border border-white/10 text-brand-sage hover:text-white flex items-center justify-center shadow-lg transition-all text-xl" 
        aria-label="Close"
      >
        ✕
      </button>
      <div className="w-full max-w-md bg-brand-teal border border-brand-green rounded-3xl shadow-[0_0_50px_rgba(79,176,109,0.3)] overflow-hidden animate-modal-enter text-center p-8">
        
        <div className="w-20 h-20 bg-brand-green/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-brand-green/50 shadow-[0_0_20px_rgba(79,176,109,0.4)]">
            <span className="text-4xl animate-bounce">💎</span>
        </div>

        <h2 className="text-3xl font-serif font-bold text-brand-cream mb-2">Upgrade Complete!</h2>
        <p className="text-brand-green font-bold uppercase tracking-widest text-xs mb-6">Welcome to Compass+</p>
        
        <div className="bg-brand-dark/80 p-6 rounded-xl border border-white/10 mb-6 text-left">
            <h3 className="text-brand-cream font-bold text-sm mb-2 flex items-center gap-2">
                <span className="text-red-400">⚠️</span> IMPORTANT: Save This Key
            </h3>
            <p className="text-brand-sage text-xs leading-relaxed mb-4">
                If you use this app from your Home Screen or switch devices, your purchase might not appear automatically. Use this code to <strong>Restore Purchase</strong> anytime.
            </p>
            
            <div className="flex gap-2">
                <div className="flex-1 bg-brand-dark border border-brand-green/50 rounded-lg flex items-center justify-center text-brand-green font-mono font-bold text-sm tracking-widest select-all p-3">
                    {RECOVERY_CODE}
                </div>
                <button 
                    onClick={handleCopy}
                    className="px-4 bg-white/10 hover:bg-white/20 text-brand-cream rounded-lg font-bold text-xs transition-colors"
                >
                    {copied ? 'Copied' : 'Copy'}
                </button>
            </div>
        </div>

        <button 
            onClick={onClose}
            className="w-full py-4 bg-gradient-to-r from-brand-green to-brand-teal text-brand-cream font-bold rounded-xl hover:shadow-lg hover:scale-[1.02] transition-all"
        >
            Start My Journey
        </button>
      </div>
    </div>
  );
};

export default PurchaseSuccessModal;
