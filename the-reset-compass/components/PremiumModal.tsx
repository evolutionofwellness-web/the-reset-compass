
import React, { useState } from 'react';

interface PremiumModalProps {
  onClose: () => void;
  onUpgrade: (plan: 'monthly' | 'yearly') => void;
}

const STRIPE_MONTHLY_URL = "https://buy.stripe.com/6oUaEW7at6fs2XOdjle3e01";
const STRIPE_YEARLY_URL = "https://buy.stripe.com/4gM00i9iBavI7e4935e3e02";
const ACTIVATION_CODE = "RESET_YOUR_PATH"; // Admin code
const RECOVERY_CODE = "COMPASS-PLUS-FOREVER"; // User-facing recovery code

const PremiumModal: React.FC<PremiumModalProps> = ({ onClose, onUpgrade }) => {
  const [plan, setPlan] = useState<'monthly' | 'yearly'>('monthly');
  const [view, setView] = useState<'offer' | 'restore'>('offer');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  const handleSubscribe = () => {
      let url = plan === 'monthly' ? STRIPE_MONTHLY_URL : STRIPE_YEARLY_URL;
      window.open(url, '_blank');
  };

  const handleCodeSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      const cleanCode = code.trim();
      
      if (!cleanCode) {
          setError("Please enter a code.");
          return;
      }

      if (cleanCode === ACTIVATION_CODE || cleanCode === RECOVERY_CODE) {
          onUpgrade('monthly');
          onClose();
      } else {
          setError("Invalid code. Please check your spelling.");
      }
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-brand-dark/95 backdrop-blur-xl animate-fade-in">
      {/* Safe area adjusted close button */}
      <button 
        onClick={onClose} 
        style={{ 
          top: 'calc(max(60px, env(safe-area-inset-top) + 16px))',
          minWidth: '44px',
          minHeight: '44px'
        }}
        className="absolute right-6 z-[160] rounded-full bg-brand-dark/50 backdrop-blur-md border border-white/10 text-brand-sage hover:text-white flex items-center justify-center shadow-lg transition-all text-xl" 
        aria-label="Close"
      >
        ✕
      </button>
      <div className="w-full max-w-xl bg-brand-teal border border-brand-green/30 rounded-[40px] shadow-2xl flex flex-col max-h-[90vh] relative overflow-hidden">
        
        <div className="absolute top-[-20%] right-[-20%] w-64 h-64 bg-brand-green/10 blur-[80px] rounded-full pointer-events-none"></div>

        <div className="relative z-10 p-8 flex-1 overflow-y-auto custom-scrollbar">
           <div className="flex justify-between items-start mb-8">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-green/10 border border-brand-green/30">
                    <span className="text-brand-green text-[10px] font-black uppercase tracking-widest">Compass+ Premium</span>
                </div>
           </div>

           {view === 'offer' ? (
               <>
                   <h2 className="text-3xl sm:text-4xl font-serif text-brand-cream mb-4 leading-tight">Your journey deserves <span className="italic text-brand-green">a map.</span></h2>
                   <p className="text-brand-sage mb-8 leading-relaxed">
                       Unlock the full experience to build better habits, see your progress, and talk to your AI wellness guide.
                   </p>

                   <div className="grid gap-4 mb-10">
                       <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/5">
                           <div className="text-brand-green text-xl mt-1">📜</div>
                           <div>
                               <h3 className="text-brand-cream font-bold text-sm">Your Past Plans</h3>
                               <p className="text-xs text-brand-sage/70">Scroll back through every MOVE, FUEL, and RECOVER action.</p>
                           </div>
                       </div>
                       <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/5">
                           <div className="text-brand-green text-xl mt-1">📊</div>
                           <div>
                               <h3 className="text-brand-cream font-bold text-sm">Your progress and trends</h3>
                               <p className="text-xs text-brand-sage/70">See how your energy and habits change over time.</p>
                           </div>
                       </div>
                       <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/5">
                           <div className="text-brand-green text-xl mt-1">👁️</div>
                           <div>
                               <h3 className="text-brand-cream font-bold text-sm">Personal AI coaching</h3>
                               <p className="text-xs text-brand-sage/70">Get advice that knows what you've been working on.</p>
                           </div>
                       </div>
                       <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/5">
                           <div className="text-brand-green text-xl mt-1">🎯</div>
                           <div>
                               <h3 className="text-brand-cream font-bold text-sm">Weekly Themes</h3>
                               <p className="text-xs text-brand-sage/70">Focus on one area each week to build lasting change.</p>
                           </div>
                       </div>
                   </div>

                   <div className="flex justify-center mb-8">
                        <div className="bg-brand-dark/50 p-1 rounded-full flex relative border border-white/10">
                            <button 
                                onClick={() => setPlan('monthly')}
                                className={`px-8 py-2.5 rounded-full text-sm font-bold transition-all relative z-10 ${plan === 'monthly' ? 'text-brand-teal bg-brand-green shadow-lg' : 'text-brand-sage hover:text-white'}`}
                            >
                                Monthly
                            </button>
                            <button 
                                onClick={() => setPlan('yearly')}
                                className={`px-8 py-2.5 rounded-full text-sm font-bold transition-all relative z-10 flex items-center gap-2 ${plan === 'yearly' ? 'text-brand-teal bg-brand-green shadow-lg' : 'text-brand-sage hover:text-white'}`}
                            >
                                Yearly
                                <span className="text-[10px] bg-brand-teal/20 px-1.5 py-0.5 rounded-full">-17%</span>
                            </button>
                        </div>
                   </div>
               </>
           ) : (
               <div className="animate-fade-in py-8">
                   <h2 className="text-2xl font-bold text-brand-cream mb-4">Restore Purchase</h2>
                   <p className="text-brand-sage text-sm mb-8 leading-relaxed">
                       Enter your recovery code to restore your Compass+ subscription.
                   </p>
                   
                   <form onSubmit={handleCodeSubmit} className="space-y-6">
                        <div>
                            <input 
                                type="text" 
                                className="w-full bg-brand-dark/50 text-white p-5 rounded-2xl border border-white/10 focus:border-brand-green outline-none font-mono text-center tracking-widest uppercase text-xl"
                                placeholder="XXXX-XXXX-XXXX"
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                autoFocus
                            />
                        </div>
                        {error && <p className="text-sm text-red-400 font-bold text-center">{error}</p>}
                        
                        <button type="submit" className="w-full py-5 bg-brand-green text-brand-teal font-black rounded-2xl transition-all shadow-xl shadow-brand-green/20">
                            Activate Compass+
                        </button>
                        
                        <button type="button" onClick={() => setView('offer')} className="w-full py-2 text-brand-sage text-sm hover:text-white font-medium">
                            Back to Plans
                        </button>
                   </form>
               </div>
           )}
        </div>

        {view === 'offer' && (
            <div className="p-8 border-t border-white/10 bg-brand-dark/30 backdrop-blur-md">
                <button 
                    onClick={handleSubscribe}
                    className="w-full py-5 bg-brand-green text-brand-teal font-black text-xl rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 mb-6 shadow-xl shadow-brand-green/20"
                >
                    {plan === 'monthly' ? 'Start Monthly ($9.99)' : 'Start Yearly ($99.99)'}
                </button>
                
                <div className="flex flex-col items-center gap-4">
                    <p className="text-[10px] text-brand-sage/50 uppercase tracking-[0.2em] font-bold">
                        Secure processing by Stripe
                    </p>
                    <button 
                        onClick={() => setView('restore')}
                        className="text-xs text-brand-green hover:text-brand-green/80 font-bold underline underline-offset-8 decoration-brand-green/30"
                    >
                        Already paid? Restore Purchase
                    </button>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default PremiumModal;
