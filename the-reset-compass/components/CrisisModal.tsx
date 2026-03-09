
import React from 'react';
import { CRISIS_RESOURCES } from '../services/safetyService';

interface CrisisModalProps {
  onClose: () => void;
}

const CrisisModal: React.FC<CrisisModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-brand-dark/95 backdrop-blur-xl animate-fade-in">
      {/* Safe area adjusted close button */}
      <button 
        onClick={onClose} 
        style={{ 
          top: 'calc(max(60px, env(safe-area-inset-top) + 16px))',
          minWidth: '44px',
          minHeight: '44px'
        }}
        className="absolute right-6 z-[1010] rounded-full bg-brand-dark/50 backdrop-blur-md border border-white/10 text-brand-sage hover:text-white flex items-center justify-center shadow-lg transition-all text-xl" 
        aria-label="Close"
      >
        ✕
      </button>
      <div className="w-full max-w-lg bg-brand-teal border-2 border-red-500/50 rounded-3xl shadow-[0_0_50px_rgba(239,68,68,0.2)] overflow-hidden animate-modal-enter">
        
        <div className="p-8 text-center">
            <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-red-500/30">
                <span className="text-4xl">❤️‍🩹</span>
            </div>
            
            <h2 className="text-2xl font-bold text-brand-cream mb-4">You are not alone.</h2>
            <p className="text-brand-sage text-base leading-relaxed mb-8">
                It sounds like you might be going through a difficult time. 
                <br/><br/>
                <strong>The Reset Compass</strong> is a wellness app and is <span className="text-red-400 font-bold">not equipped</span> to handle emergencies or provide emergency help.
                <br/><br/>
                Please reach out to a professional who can help you right now.
            </p>

            <div className="space-y-4 mb-8">
                {CRISIS_RESOURCES.map((resource, idx) => (
                    <a 
                        key={idx}
                        href={resource.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-4 bg-brand-dark/50 border border-white/10 hover:border-red-400 rounded-xl transition-all group"
                    >
                        <div className="text-left">
                            <h3 className="font-bold text-brand-cream">{resource.name}</h3>
                            <p className="text-xs text-brand-sage">{resource.description}</p>
                        </div>
                        <div className="bg-brand-cream text-brand-teal px-4 py-2 rounded-lg font-bold text-sm group-hover:bg-red-500 group-hover:text-white transition-colors">
                            {resource.action}
                        </div>
                    </a>
                ))}
            </div>

            <p className="text-xs text-brand-sage/60 mb-6">
                If you are in immediate danger, please call emergency services (911 in the US) or go to the nearest emergency room.
            </p>

            <button 
                onClick={onClose}
                className="text-brand-sage hover:text-brand-cream text-sm underline underline-offset-4"
            >
                I am safe, return to app
            </button>
        </div>
      </div>
    </div>
  );
};

export default CrisisModal;
