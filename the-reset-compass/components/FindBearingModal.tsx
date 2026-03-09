import React, { useState } from 'react';
import { CompassMode } from '../types';
import { suggestModeFromDescription } from '../services/geminiService';
import { detectHarmfulContent } from '../services/safetyService';

interface FindBearingModalProps {
  onClose: () => void;
  onModeSuggested: (mode: CompassMode, reason: string) => void;
  onCrisisDetected?: () => void;
}

const FindBearingModal: React.FC<FindBearingModalProps> = ({ onClose, onModeSuggested, onCrisisDetected }) => {
  const [description, setDescription] = useState('');
  const [isCalibrating, setIsCalibrating] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    // Safety Check
    if (detectHarmfulContent(description)) {
        if (onCrisisDetected) onCrisisDetected();
        return;
    }

    setIsCalibrating(true);
    try {
      const result = await suggestModeFromDescription(description);
      onModeSuggested(result.mode, result.reason);
    } catch (e) {
      console.error(e);
    } finally {
      setIsCalibrating(false);
    }
  };

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
      <div className="w-full max-w-lg bg-brand-teal border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-modal-enter">
        <div className="p-6 border-b border-white/10 flex justify-between items-center bg-brand-dark/50">
          <h2 className="text-xl font-light text-brand-cream flex items-center gap-2">
            <span className="text-2xl">✨</span> Check In
          </h2>
        </div>

        <div className="p-8 flex-1">
           {isCalibrating ? (
               <div className="flex flex-col items-center justify-center h-48 space-y-6">
                   <div className="relative w-16 h-16">
                       <div className="absolute inset-0 border-4 border-white/10 rounded-full"></div>
                       <div className="absolute inset-0 border-4 border-t-brand-green rounded-full animate-spin"></div>
                   </div>
                   <p className="text-brand-sage animate-pulse text-sm uppercase tracking-widest font-semibold">Tuning in...</p>
               </div>
           ) : (
               <form onSubmit={handleSubmit}>
                   <p className="text-brand-cream text-lg mb-6 leading-relaxed">
                       How are you feeling right now? Describe your energy and we'll guide you to the right mode.
                   </p>
                   
                   <textarea
                     value={description}
                     onChange={(e) => setDescription(e.target.value)}
                     placeholder="e.g., I feel a bit scattered and low energy..."
                     rows={4}
                     className="w-full bg-brand-dark/50 border border-white/10 rounded-xl p-4 text-brand-cream placeholder-brand-sage focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green transition-all mb-6"
                     autoFocus
                   />
                   
                   <div className="flex justify-end">
                       <button 
                        type="submit"
                        disabled={!description.trim()}
                        className="px-8 py-3 bg-brand-green text-brand-teal font-bold rounded-full hover:bg-brand-green/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:scale-105 active:scale-95 uppercase tracking-widest text-xs"
                       >
                           Help Me Choose
                       </button>
                   </div>
               </form>
           )}
        </div>
      </div>
    </div>
  );
};

export default FindBearingModal;