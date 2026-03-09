import React, { useState } from 'react';
import { OnboardingData } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

interface OnboardingFlowProps {
  onComplete: (data: OnboardingData) => void;
}

const OnboardingFlow: React.FC<OnboardingFlowProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<OnboardingData>({
    mainGoal: '',
    limitations: '',
    location: ''
  });

  const goals = [
    "I want more energy day to day",
    "I want to lose weight",
    "I want to build strength",
    "I want to feel better overall",
    "Something else"
  ];

  const limitations = [
    "Nothing, I’m good to go",
    "I have joint or back issues",
    "I get winded easily",
    "I’m recovering from an injury",
    "Something else"
  ];

  const locations = [
    "At home",
    "At a gym",
    "Outside",
    "At work or on the go",
    "It changes"
  ];

  const handleSelect = (field: keyof OnboardingData, value: string) => {
    const current = data[field as keyof OnboardingData]?.split(', ').filter(Boolean) || [];
    let next: string[];

    if (field === 'limitations') {
      if (value === 'Nothing, I’m good to go') {
        next = [value];
      } else {
        const filtered = current.filter(v => v !== 'Nothing, I’m good to go');
        if (filtered.includes(value)) {
          next = filtered.filter(v => v !== value);
        } else {
          next = [...filtered, value];
        }
      }
      setData(prev => ({ ...prev, limitations: next.join(', ') }));
      return;
    }

    if (value === 'Something else' || value === 'It changes') {
      if (current.includes(value)) {
        next = current.filter(v => v !== value);
      } else {
        next = [...current, value];
      }
      setData(prev => ({ ...prev, [field]: next.join(', ') }));
      return;
    }

    if (current.includes(value)) {
      next = current.filter(v => v !== value);
    } else {
      next = [...current, value];
    }
    setData(prev => ({ ...prev, [field]: next.join(', ') }));
  };

  const handleOtherChange = (field: string, value: string) => {
    if (value.length > 60) return;
    setData(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = () => setStep(prev => prev + 1);

  const renderStep = () => {
    switch (step) {
      case 1:
        const selectedGoals = data.mainGoal.split(', ').filter(Boolean);
        return (
          <motion.div 
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
          >
            <div className="text-center">
              <h2 className="text-3xl font-serif text-brand-cream mb-2">What brings you here?</h2>
              <p className="text-brand-sage text-sm">No wrong answers. This just helps us give you better guidance.</p>
              <p className="text-brand-green text-[10px] font-black uppercase tracking-widest mt-2">Select everything that applies</p>
            </div>
            <div className="grid gap-4">
              {goals.map(goal => (
                <div key={goal} className="flex flex-col gap-2">
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleSelect('mainGoal', goal)}
                    className={`p-4 rounded-2xl text-left transition-all border relative overflow-hidden ${
                      selectedGoals.includes(goal)
                        ? 'border-brand-green text-brand-teal' 
                        : 'bg-white/5 border-white/10 text-brand-sage hover:border-white/20'
                    }`}
                  >
                    {selectedGoals.includes(goal) && (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="absolute inset-0 bg-brand-green z-0"
                      />
                    )}
                    <div className="relative z-10 flex items-center justify-between">
                      <span className="font-bold">{goal}</span>
                      {selectedGoals.includes(goal) && (
                        <div className="text-brand-teal">
                          <CheckCircle2 size={20} fill="currentColor" />
                        </div>
                      )}
                    </div>
                  </motion.button>
                  {goal === 'Something else' && selectedGoals.includes('Something else') && (
                    <div className="mt-2" onClick={e => e.stopPropagation()}>
                      <input
                        type="text"
                        value={data.mainGoalOther || ''}
                        onChange={e => handleOtherChange('mainGoalOther', e.target.value)}
                        placeholder="Tell us more..."
                        className="w-full bg-brand-dark/50 border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:border-brand-green"
                        autoFocus
                      />
                      <div className="flex justify-between mt-2 px-2">
                        <span className="text-[10px] text-brand-sage/50">{(data.mainGoalOther || '').length}/60</span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="pt-4">
              <button 
                onClick={nextStep}
                disabled={selectedGoals.length === 0 || (selectedGoals.includes('Something else') && !(data.mainGoalOther || '').trim())}
                className={`w-full py-5 font-black text-xl rounded-3xl shadow-xl flex items-center justify-center gap-2 transition-all ${
                  selectedGoals.length > 0 && (!selectedGoals.includes('Something else') || (data.mainGoalOther || '').trim())
                    ? 'bg-brand-green text-brand-teal shadow-brand-green/20' 
                    : 'bg-white/5 text-white/20 cursor-not-allowed'
                }`}
              >
                Continue <ArrowRight size={20} />
              </button>
            </div>
          </motion.div>
        );
      case 2:
        const selectedLimitations = data.limitations.split(', ').filter(Boolean);
        return (
          <motion.div 
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
          >
            <div className="text-center">
              <h2 className="text-3xl font-serif text-brand-cream mb-2">Anything I should know about your body?</h2>
              <p className="text-brand-sage text-sm">This helps us make sure we never suggest something that doesn’t work for you.</p>
              <p className="text-brand-green text-[10px] font-black uppercase tracking-widest mt-2">Select all that apply</p>
            </div>
            <div className="grid gap-4">
              {limitations.map(lim => (
                <div key={lim} className="flex flex-col gap-2">
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleSelect('limitations', lim)}
                    className={`p-4 rounded-2xl text-left transition-all border relative overflow-hidden ${
                      selectedLimitations.includes(lim)
                        ? 'border-brand-green text-brand-teal' 
                        : 'bg-white/5 border-white/10 text-brand-sage hover:border-white/20'
                    }`}
                  >
                    {selectedLimitations.includes(lim) && (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="absolute inset-0 bg-brand-green z-0"
                      />
                    )}
                    <div className="relative z-10 flex items-center justify-between">
                      <span className="font-bold">{lim}</span>
                      {selectedLimitations.includes(lim) && (
                        <div className="text-brand-teal">
                          <CheckCircle2 size={20} fill="currentColor" />
                        </div>
                      )}
                    </div>
                  </motion.button>
                  {lim === 'Something else' && selectedLimitations.includes('Something else') && (
                    <div className="mt-2" onClick={e => e.stopPropagation()}>
                      <input
                        type="text"
                        value={data.limitationsOther || ''}
                        onChange={e => handleOtherChange('limitationsOther', e.target.value)}
                        placeholder="Tell us more..."
                        className="w-full bg-brand-dark/50 border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:border-brand-green"
                        autoFocus
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="pt-4">
              <button 
                onClick={nextStep}
                disabled={selectedLimitations.length === 0 || (selectedLimitations.includes('Something else') && !(data.limitationsOther || '').trim())}
                className={`w-full py-5 font-black text-xl rounded-3xl shadow-xl flex items-center justify-center gap-2 transition-all ${
                  selectedLimitations.length > 0 && (!selectedLimitations.includes('Something else') || (data.limitationsOther || '').trim())
                    ? 'bg-brand-green text-brand-teal shadow-brand-green/20' 
                    : 'bg-white/5 text-white/20 cursor-not-allowed'
                }`}
              >
                Continue <ArrowRight size={20} />
              </button>
            </div>
          </motion.div>
        );
      case 3:
        const selectedLocations = data.location.split(', ').filter(Boolean);
        return (
          <motion.div 
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
          >
            <div className="text-center">
              <h2 className="text-3xl font-serif text-brand-cream mb-2">Where do you usually have time for yourself?</h2>
              <p className="text-brand-sage text-sm">We’ll tailor your suggestions to wherever you actually are.</p>
              <p className="text-brand-green text-[10px] font-black uppercase tracking-widest mt-2">Select all that apply</p>
            </div>
            <div className="grid gap-4">
              {locations.map(loc => (
                <div key={loc} className="flex flex-col gap-2">
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleSelect('location', loc)}
                    className={`p-4 rounded-2xl text-left transition-all border relative overflow-hidden ${
                      selectedLocations.includes(loc)
                        ? 'border-brand-green text-brand-teal' 
                        : 'bg-white/5 border-white/10 text-brand-sage hover:border-white/20'
                    }`}
                  >
                    {selectedLocations.includes(loc) && (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="absolute inset-0 bg-brand-green z-0"
                      />
                    )}
                    <div className="relative z-10 flex items-center justify-between">
                      <span className="font-bold">{loc}</span>
                      {selectedLocations.includes(loc) && (
                        <div className="text-brand-teal">
                          <CheckCircle2 size={20} fill="currentColor" />
                        </div>
                      )}
                    </div>
                  </motion.button>
                  {loc === 'It changes' && selectedLocations.includes('It changes') && (
                    <div className="mt-2" onClick={e => e.stopPropagation()}>
                      <input
                        type="text"
                        value={data.locationOther || ''}
                        onChange={e => handleOtherChange('locationOther', e.target.value)}
                        placeholder="Tell us more..."
                        className="w-full bg-brand-dark/50 border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:border-brand-green"
                        autoFocus
                      />
                      <div className="flex justify-between mt-2 px-2">
                        <span className="text-[10px] text-brand-sage/50">{(data.locationOther || '').length}/60</span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="pt-4">
              <button 
                onClick={nextStep}
                disabled={selectedLocations.length === 0 || (selectedLocations.includes('It changes') && !(data.locationOther || '').trim())}
                className={`w-full py-5 font-black text-xl rounded-3xl shadow-xl flex items-center justify-center gap-2 transition-all ${
                  selectedLocations.length > 0 && (!selectedLocations.includes('It changes') || (data.locationOther || '').trim())
                    ? 'bg-brand-green text-brand-teal shadow-brand-green/20' 
                    : 'bg-white/5 text-white/20 cursor-not-allowed'
                }`}
              >
                Continue <ArrowRight size={20} />
              </button>
            </div>
          </motion.div>
        );
      case 4:
        return (
          <motion.div 
            key="step4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center text-center py-12"
          >
            <div className="w-20 h-20 bg-brand-green/20 rounded-full flex items-center justify-center mb-8">
              <CheckCircle2 className="text-brand-green" size={40} />
            </div>
            <h2 className="text-4xl font-serif text-brand-cream mb-4">You’re all set.</h2>
            <p className="text-brand-sage text-lg mb-12 max-w-xs">Checking in every day keeps your streak alive. Let’s start today.</p>
            <button
              onClick={() => onComplete(data as OnboardingData)}
              className="w-full py-5 bg-brand-green text-brand-teal font-black text-xl rounded-3xl shadow-xl shadow-brand-green/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              Let’s go
            </button>
          </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-[200] bg-brand-dark flex flex-col overflow-y-auto">
      <div className="max-w-xl mx-auto w-full px-6 py-12 flex-1 flex flex-col justify-center">
        <AnimatePresence mode="wait">
          {renderStep()}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default OnboardingFlow;
