import React, { useState } from 'react';

interface OnboardingModalProps {
  onComplete: (name: string) => void;
}

const OnboardingModal: React.FC<OnboardingModalProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onComplete(name.trim());
    }
  };

  const nextStep = () => setStep(step + 1);

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-brand-dark/95 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="w-full max-w-md bg-brand-teal border border-white/10 rounded-3xl shadow-2xl p-6 sm:p-10 relative overflow-hidden animate-modal-enter flex flex-col items-center text-center my-auto">
        
        <div className="absolute top-[-20%] left-[-20%] w-64 h-64 bg-brand-green/10 rounded-full blur-[80px] pointer-events-none"></div>
        <div className="absolute bottom-[-20%] right-[-20%] w-64 h-64 bg-brand-green/10 rounded-full blur-[80px] pointer-events-none"></div>

        <div className="flex gap-2 mb-8 relative z-10">
            {[0, 1, 2].map((i) => (
                <div key={i} className={`h-1.5 rounded-full transition-all duration-500 ${step >= i ? 'w-10 bg-brand-green' : 'w-2 bg-white/10'}`}></div>
            ))}
        </div>

        {step === 0 && (
            <div className="animate-fade-in w-full">
                <div className="w-20 h-20 mx-auto bg-white/5 rounded-2xl flex items-center justify-center mb-6 border border-white/10 shadow-xl">
                    <svg className="w-10 h-10 text-brand-green" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <h2 className="text-3xl font-serif font-light text-brand-cream mb-4">Live Empowered.</h2>
                <p className="text-brand-sage mb-8 leading-relaxed text-sm sm:text-base">
                    The Reset Compass is your personal guide to a healthier life. We help you build better habits by listening to your body's energy.
                </p>
                <button 
                    onClick={nextStep}
                    className="w-full py-4 bg-brand-green text-brand-teal font-bold rounded-full hover:bg-brand-green/90 transition-all active:scale-95 shadow-lg uppercase tracking-widest text-xs"
                >
                    Start Your Reset
                </button>
            </div>
        )}

        {step === 1 && (
            <div className="animate-fade-in w-full">
                 <h2 className="text-2xl font-serif font-light text-brand-cream mb-6">Empowering Habits</h2>
                 
                 <div className="space-y-3 text-left mb-8">
                     <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5">
                         <span className="text-2xl">🧭</span>
                         <div>
                             <h3 className="font-bold text-brand-cream text-sm">Guided Check-ins</h3>
                             <p className="text-[11px] text-brand-sage">Pause to see how you're feeling right now.</p>
                         </div>
                     </div>
                     <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5">
                         <span className="text-2xl">⚡</span>
                         <div>
                             <h3 className="font-bold text-brand-cream text-sm">Micro-Actions</h3>
                             <p className="text-[11px] text-brand-sage">Take science-backed steps to shift your state.</p>
                         </div>
                     </div>
                     <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5">
                         <span className="text-2xl">🏆</span>
                         <div>
                             <h3 className="font-bold text-brand-cream text-sm">Long-Term Health</h3>
                             <p className="text-[11px] text-brand-sage">Build a healthier, more balanced life.</p>
                         </div>
                     </div>
                 </div>

                 <button 
                    onClick={nextStep}
                    className="w-full py-4 bg-brand-green text-brand-teal font-bold rounded-full hover:bg-brand-green/90 transition-all active:scale-95 shadow-lg uppercase tracking-widest text-xs"
                >
                    Next
                </button>
            </div>
        )}

        {step === 2 && (
            <div className="animate-fade-in w-full">
                <h2 className="text-2xl font-serif font-light text-brand-cream mb-2">Welcome Aboard.</h2>
                <p className="text-brand-sage mb-10 text-sm">What should we call you on this journey?</p>
                
                <form onSubmit={handleSubmit}>
                    <input 
                        type="text" 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-transparent border-b-2 border-white/10 focus:border-brand-green text-center text-2xl text-brand-cream pb-3 mb-10 outline-none transition-colors"
                        placeholder="Your Name"
                        autoFocus
                        required
                    />
                    <button 
                        type="submit"
                        disabled={!name.trim()}
                        className="w-full py-4 bg-brand-green text-brand-teal font-bold rounded-full hover:bg-brand-green/90 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-widest text-xs"
                    >
                        Begin Journey
                    </button>
                </form>
            </div>
        )}

      </div>
    </div>
  );
};

export default OnboardingModal;