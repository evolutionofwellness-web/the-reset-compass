import React, { useState } from 'react';
import { DailyCheckInData } from '../types';
import { BatteryLow, BatteryMedium, BatteryFull, Clock, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import StaticCompass from './StaticCompass';

interface DailyCheckInProps {
  onComplete: (data: DailyCheckInData) => void;
}

const DailyCheckIn: React.FC<DailyCheckInProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [energy, setEnergy] = useState<'empty' | 'getting_by' | 'good' | null>(null);
  const [time, setTime] = useState<'5_10' | '20_30' | '45_plus' | null>(null);

  const energyOptions = [
    { id: 'empty', label: 'Running on empty', icon: <BatteryLow className="text-red-400" size={32} /> },
    { id: 'getting_by', label: 'Getting by', icon: <BatteryMedium className="text-yellow-400" size={32} /> },
    { id: 'good', label: 'Feeling good', icon: <BatteryFull className="text-brand-green" size={32} /> }
  ];

  const timeOptions = [
    { id: '5_10', label: '5 to 10 minutes', icon: <Clock size={32} /> },
    { id: '20_30', label: '20 to 30 minutes', icon: <Clock size={32} /> },
    { id: '45_plus', label: '45 minutes or more', icon: <Clock size={32} /> }
  ];

  const handleEnergySelect = (id: 'empty' | 'getting_by' | 'good') => {
    setEnergy(id);
    setStep(2);
  };

  const handleComplete = () => {
    if (energy && time) {
      onComplete({
        energy,
        time,
        date: new Date().toISOString()
      });
    }
  };

  return (
    <div className="fixed inset-0 z-[190] bg-brand-dark flex flex-col overflow-y-auto">
      <div className="max-w-xl mx-auto w-full px-6 py-12 flex-1 flex flex-col items-center">
        <StaticCompass className="mb-8" />
        
        <div className="w-full">
          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.div
                key="energy"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="text-center">
                  <h2 className="text-3xl font-serif text-brand-cream mb-2">How is your energy right now?</h2>
                </div>
                <div className="grid gap-4">
                  {energyOptions.map(opt => (
                    <motion.button
                      key={opt.id}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleEnergySelect(opt.id as any)}
                      className={`p-8 rounded-[32px] flex flex-col items-center gap-4 transition-all border relative overflow-hidden ${
                        energy === opt.id 
                          ? 'border-brand-green text-brand-teal' 
                          : 'bg-white/5 border-white/10 text-brand-cream hover:border-white/20'
                      }`}
                    >
                      {energy === opt.id && (
                        <motion.div 
                          initial={{ opacity: 0, scale: 0.5 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="absolute inset-0 bg-brand-green z-0"
                        />
                      )}
                      <div className="relative z-10 flex flex-col items-center gap-4">
                        {opt.icon}
                        <span className="font-bold text-xl">{opt.label}</span>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="time"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="text-center">
                  <h2 className="text-3xl font-serif text-brand-cream mb-2">How much time can you give yourself today?</h2>
                </div>
                <div className="grid gap-4">
                  {timeOptions.map(opt => (
                    <motion.button
                      key={opt.id}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setTime(opt.id as any)}
                      className={`p-8 rounded-[32px] flex flex-col items-center gap-4 transition-all border relative overflow-hidden ${
                        time === opt.id 
                          ? 'border-brand-green text-brand-teal' 
                          : 'bg-white/5 border-white/10 text-brand-cream hover:border-white/20'
                      }`}
                    >
                      {time === opt.id && (
                        <motion.div 
                          initial={{ opacity: 0, scale: 0.5 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="absolute inset-0 bg-brand-green z-0"
                        />
                      )}
                      <div className="relative z-10 flex flex-col items-center gap-4">
                        <div className={time === opt.id ? 'text-brand-teal' : 'text-brand-green'}>{opt.icon}</div>
                        <span className="font-bold text-xl">{opt.label}</span>
                      </div>
                    </motion.button>
                  ))}
                </div>
                
                <div className="pt-8">
                  <button
                    onClick={handleComplete}
                    disabled={!time}
                    className={`w-full py-5 rounded-3xl font-black text-xl flex items-center justify-center gap-2 transition-all ${
                      time 
                        ? 'bg-brand-green text-brand-teal shadow-xl shadow-brand-green/20' 
                        : 'bg-white/5 text-white/20 cursor-not-allowed'
                    }`}
                  >
                    Show me what to do today
                    <ArrowRight size={24} />
                  </button>
                  <p className="text-center text-[10px] text-brand-sage/60 font-medium mt-4 uppercase tracking-widest">Checking in every day keeps your streak alive.</p>
                  <button 
                    onClick={() => setStep(1)}
                    className="w-full py-4 text-brand-sage text-sm font-medium mt-2 hover:text-white transition-colors"
                  >
                    Back to energy check
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default DailyCheckIn;
