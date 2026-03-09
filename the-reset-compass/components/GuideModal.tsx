import React, { useState } from 'react';

interface GuideModalProps {
  onClose: () => void;
}

const MODES_INFO = [
  { title: "Surviving", color: "text-compass-surviving", desc: "Overwhelmed, anxious, or burnt out. Needs safety and deep rest." },
  { title: "Drifting", color: "text-compass-drifting", desc: "Foggy, aimless, or unmotivated. Needs clarity and small wins." },
  { title: "Healing", color: "text-indigo-400", desc: "Recovering, tender, or low energy. Needs active recovery and mobility." },
  { title: "Grounded", color: "text-compass-grounded", desc: "Calm, steady, and present. Needs maintenance and gratitude." },
  { title: "Growing", color: "text-compass-growing", desc: "Energetic, focused, and building. Needs challenge and exertion." },
  { title: "Flowing", color: "text-cyan-400", desc: "Peak state, mastery, limitless. Needs complex creation and flow." },
];

const GuideModal: React.FC<GuideModalProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'instructions' | 'legend'>('instructions');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-brand-dark/90 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-2xl bg-brand-teal border border-white/10 rounded-3xl shadow-2xl flex flex-col h-[85vh] sm:h-[75vh] animate-modal-enter relative">
        {/* Safe area adjusted close button */}
        <button 
          onClick={onClose} 
          style={{ 
            top: 'calc(max(60px, env(safe-area-inset-top) + 16px))',
            minWidth: '44px',
            minHeight: '44px'
          }}
          className="absolute right-6 z-[60] rounded-full bg-brand-dark/50 backdrop-blur-md border border-white/10 text-brand-sage hover:text-white flex items-center justify-center shadow-lg transition-all text-xl" 
          aria-label="Close Guide"
        >
          ✕
        </button>
        
        <div className="p-6 border-b border-white/10 bg-brand-teal flex justify-between items-center shrink-0">
             <h2 className="text-xl sm:text-2xl font-light text-brand-cream">
                {activeTab === 'instructions' ? 'How to Use' : 'State Reference'}
             </h2>
        </div>

        <div className="flex border-b border-white/10 bg-brand-dark shrink-0">
            <button 
                onClick={() => setActiveTab('instructions')}
                className={`flex-1 py-4 text-xs font-bold uppercase tracking-wide transition-colors ${activeTab === 'instructions' ? 'text-brand-cream border-b-2 border-brand-cream bg-brand-teal' : 'text-brand-sage'}`}
            >
                Instructions
            </button>
            <button 
                onClick={() => setActiveTab('legend')}
                className={`flex-1 py-4 text-xs font-bold uppercase tracking-wide transition-colors ${activeTab === 'legend' ? 'text-brand-cream border-b-2 border-brand-cream bg-brand-teal' : 'text-brand-sage'}`}
            >
                Legend
            </button>
        </div>
        
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 sm:p-8 bg-brand-dark/50">
            {activeTab === 'instructions' ? (
                <div className="space-y-6 sm:space-y-8 max-w-2xl mx-auto">
                     {[
                        { step: 1, title: "Check In", text: "Identify your current energy. Are you Surviving? Drifting? Growing?" },
                        { step: 2, title: "Set Direction", text: "Tap the compass wedge that matches your state." },
                        { step: 3, title: "Practice", text: "Follow the tailored activity to help you feel better or keep your momentum." }
                     ].map((item) => (
                        <div key={item.step} className="flex gap-4 sm:gap-5 items-start">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-brand-green flex items-center justify-center text-brand-dark text-base sm:text-lg font-bold shrink-0 shadow-lg">
                                {item.step}
                            </div>
                            <div className="pt-0.5 sm:pt-1">
                                <h4 className="text-base sm:text-lg font-bold text-brand-cream mb-1">{item.title}</h4>
                                <p className="text-brand-sage leading-relaxed text-xs sm:text-sm">
                                    {item.text}
                                </p>
                            </div>
                        </div>
                     ))}
                </div>
            ) : (
                <div className="grid gap-3 sm:grid-cols-2">
                    {MODES_INFO.map((mode) => (
                        <div key={mode.title} className="p-4 rounded-xl bg-brand-dark border border-white/10 flex gap-3 items-start shadow-md">
                            <div className={`w-3 h-3 rounded-full mt-1 shrink-0 ${mode.color.replace('text-', 'bg-')} shadow-[0_0_8px_currentColor]`}></div>
                            <div>
                                <h4 className={`text-sm font-bold mb-0.5 ${mode.color}`}>{mode.title}</h4>
                                <p className="text-[11px] text-brand-sage leading-relaxed">{mode.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>

        <div className="p-4 sm:p-6 border-t border-white/10 bg-brand-teal rounded-b-3xl">
            <button 
                onClick={onClose}
                className="w-full py-3.5 bg-brand-green text-brand-teal font-bold rounded-xl hover:bg-brand-green/90 transition-all shadow-lg text-xs uppercase tracking-widest"
            >
                Begin Journey
            </button>
        </div>
      </div>
    </div>
  );
};

export default GuideModal;