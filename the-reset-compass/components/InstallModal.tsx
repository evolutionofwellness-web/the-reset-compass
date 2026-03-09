import React from 'react';
import { Compass, X, ArrowRight, Sparkles } from 'lucide-react';

interface InstallModalProps {
  onClose: () => void;
  isIOS: boolean;
  canInstall?: boolean;
  onInstall?: () => void;
}

const InstallModal: React.FC<InstallModalProps> = ({ onClose, isIOS, canInstall, onInstall }) => {
  const handleDontShowAgain = () => {
    localStorage.setItem('compass_pwa_permanently_dismissed', 'true');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-4 bg-brand-dark/90 backdrop-blur-xl animate-fade-in">
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
      <div className="w-full max-w-sm bg-brand-cream rounded-[2.5rem] shadow-2xl overflow-hidden animate-slide-up sm:animate-modal-enter relative border border-white/20">
        
        {/* Brand Accents */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-green via-brand-teal to-brand-green"></div>

        <div className="p-8 flex flex-col items-center text-center">
            <div className="relative mb-6">
                <div className="w-24 h-24 rounded-2xl shadow-xl bg-white flex items-center justify-center border border-brand-teal/10 overflow-hidden">
                    <Compass size={48} className="text-brand-teal" />
                </div>
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-brand-green rounded-full flex items-center justify-center border-4 border-brand-cream shadow-lg animate-bounce-slow">
                    <span className="text-white text-[10px]">✨</span>
                </div>
            </div>
            
            <h2 className="text-2xl font-black text-brand-teal mb-2 uppercase tracking-tight">Keep Your Compass</h2>
            <p className="text-brand-teal/70 text-sm mb-8 leading-relaxed px-4">
                Install the app on your home screen for <span className="font-bold">offline access</span> and a <span className="font-bold">fullscreen experience</span>.
            </p>

            {canInstall && onInstall ? (
                <button 
                    onClick={onInstall}
                    className="w-full py-4 bg-brand-teal text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3 mb-4"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v12m0 0l-4-4m4 4l4-4m-8 8h8" /></svg>
                    Add to Home Screen
                </button>
            ) : isIOS ? (
                <div className="w-full bg-white/60 rounded-[1.5rem] p-5 text-left space-y-4 border border-brand-teal/5 mb-6">
                    <div className="flex items-center gap-4">
                        <div className="flex-shrink-0 w-7 h-7 bg-brand-teal rounded-full flex items-center justify-center font-black text-white text-[10px]">1</div>
                        <div className="text-xs text-brand-teal/80 font-medium">
                            Tap the <span className="font-black text-blue-600">share button</span> in your browser.
                        </div>
                    </div>
                    <div className="w-full h-px bg-brand-teal/5"></div>
                    <div className="flex items-center gap-4">
                        <div className="flex-shrink-0 w-7 h-7 bg-brand-teal rounded-full flex items-center justify-center font-black text-white text-[10px]">2</div>
                        <div className="text-xs text-brand-teal/80 font-medium">
                            Select <span className="font-black text-brand-teal">Add to Home Screen</span>.
                        </div>
                    </div>
                </div>
            ) : (
                <div className="w-full bg-white/60 rounded-[1.5rem] p-5 text-left space-y-4 border border-brand-teal/5 mb-6">
                     <div className="flex items-center gap-4">
                        <div className="flex-shrink-0 w-7 h-7 bg-brand-teal rounded-full flex items-center justify-center font-black text-white text-[10px]">1</div>
                        <p className="text-xs text-brand-teal/80 font-medium">Open your browser's menu.</p>
                    </div>
                    <div className="w-full h-px bg-brand-teal/5"></div>
                    <div className="flex items-center gap-4">
                        <div className="flex-shrink-0 w-7 h-7 bg-brand-teal rounded-full flex items-center justify-center font-black text-white text-[10px]">2</div>
                        <p className="text-xs text-brand-teal/80 font-medium">Select <span className="font-black">Install App</span> or <span className="font-black">Add to Home Screen</span>.</p>
                    </div>
                </div>
            )}

            <div className="flex flex-col gap-2 w-full">
                <button 
                  onClick={onClose}
                  className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-teal/40 hover:text-brand-teal transition-colors"
                >
                    Maybe Later
                </button>
                <button 
                  onClick={handleDontShowAgain}
                  className="text-[9px] font-bold uppercase tracking-[0.1em] text-brand-teal/20 hover:text-red-500 transition-colors pt-2"
                >
                    Don't show this again
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};
export default InstallModal;