import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

interface WalkthroughStep {
  targetId?: string;
  text: string;
  title?: string;
  position?: 'top' | 'bottom' | 'left' | 'right' | 'center';
}

interface WalkthroughProps {
  onComplete: () => void;
}

const Walkthrough: React.FC<WalkthroughProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);

  const steps: WalkthroughStep[] = [
    {
      targetId: 'recommendation-cards',
      title: 'Your Daily Path',
      text: 'These are your three actions for today. Move, Fuel, and Recover. Each one is matched to how you are feeling right now.',
      position: 'bottom'
    },
    {
      targetId: 'i-did-this-button',
      title: 'Track Progress',
      text: 'Tap this when you complete an action. You will earn XP and track your progress.',
      position: 'top'
    },
    {
      targetId: 'daily-complete-button',
      title: 'Daily Completion',
      text: 'Tap this once you have done at least one thing today. This keeps your streak alive and marks your day complete.',
      position: 'top'
    },
    {
      targetId: 'menu-button',
      title: 'Explore More',
      text: 'Tap here anytime to access the Oracle, your history, and your weekly focus.',
      position: 'bottom'
    },
    {
      targetId: 'xp-counter',
      title: 'Grow Your Rank',
      text: 'Every action earns you XP. Hit milestones to unlock new ranks. The more you show up the more you grow.',
      position: 'bottom'
    },
    {
      text: 'You are all set. This takes two taps a day. That is it. Let’s get started.',
      position: 'center'
    }
  ];

  useEffect(() => {
    const step = steps[currentStep];
    if (step.targetId) {
      const el = document.getElementById(step.targetId);
      if (el) {
        setTargetRect(el.getBoundingClientRect());
      } else {
        setTargetRect(null);
      }
    } else {
      setTargetRect(null);
    }
  }, [currentStep]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      onComplete();
    }
  };

  const step = steps[currentStep];

  return (
    <div className="fixed inset-0 z-[400] pointer-events-none">
      <AnimatePresence mode="wait">
        <motion.div
          key="overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-brand-dark/60 backdrop-blur-sm pointer-events-auto"
        />

        {targetRect && (
          <motion.div
            key={`highlight-${currentStep}`}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ 
              opacity: 1, 
              scale: 1,
              top: targetRect.top - 8,
              left: targetRect.left - 8,
              width: targetRect.width + 16,
              height: targetRect.height + 16
            }}
            className="absolute border-2 border-brand-green rounded-2xl shadow-[0_0_30px_rgba(52,211,153,0.3)] z-[401]"
          />
        )}

        <motion.div
          key={`tooltip-${currentStep}`}
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ 
              opacity: 1, 
              scale: 1,
              ...(step.position === 'center' ? {
                top: '50%',
                left: '50%',
                x: '-50%',
                y: '-50%'
              } : targetRect ? {
                top: step.position === 'bottom' ? targetRect.bottom + 24 : 'auto',
                bottom: step.position === 'top' ? (window.innerHeight - targetRect.top) + 24 : 'auto',
                left: '50%',
                x: '-50%'
              } : {
                top: '50%',
                left: '50%',
                x: '-50%',
                y: '-50%'
              })
            }}
          className="absolute w-[90%] max-w-xs bg-brand-teal border border-white/10 p-6 rounded-[32px] shadow-2xl z-[402] pointer-events-auto"
        >
          {step.position === 'center' && (
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-brand-green/20 rounded-full flex items-center justify-center">
                <CheckCircle2 className="text-brand-green" size={32} />
              </div>
            </div>
          )}
          
          {step.title && (
            <h3 className="text-brand-green text-[10px] font-black uppercase tracking-widest mb-2">{step.title}</h3>
          )}
          <p className="text-brand-cream font-medium leading-relaxed mb-6">
            {step.text}
          </p>
          
          <button
            onClick={handleNext}
            className="w-full py-4 bg-brand-green text-brand-teal font-black rounded-2xl flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            {currentStep === steps.length - 1 ? 'Let’s go' : 'Got it'}
            {currentStep < steps.length - 1 && <ArrowRight size={18} />}
          </button>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default Walkthrough;
