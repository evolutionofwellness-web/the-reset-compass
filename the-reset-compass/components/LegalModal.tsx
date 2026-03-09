
import React, { useState } from 'react';
import { clearAllData } from '../services/storageService';

interface LegalModalProps {
  onClose: () => void;
}

const LegalModal: React.FC<LegalModalProps> = ({ onClose }) => {
  const [tab, setTab] = useState<'disclaimer' | 'terms' | 'privacy'>('disclaimer');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

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
      <div className="w-full max-w-3xl bg-brand-teal border border-white/10 rounded-2xl shadow-2xl flex flex-col h-[80vh] animate-modal-enter">
        <div className="p-6 border-b border-white/10 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-light text-brand-cream">Legal & Compliance</h2>
            <p className="text-[10px] text-brand-sage uppercase tracking-widest mt-1">Evolution of Wellness LLC</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-white/10 bg-brand-dark/50">
            <button 
                onClick={() => setTab('disclaimer')}
                className={`flex-1 py-3 text-sm font-bold uppercase tracking-wide transition-colors ${tab === 'disclaimer' ? 'text-brand-green border-b-2 border-brand-green' : 'text-brand-sage hover:text-brand-cream'}`}
            >
                Medical Disclaimer
            </button>
            <button 
                onClick={() => setTab('terms')}
                className={`flex-1 py-3 text-sm font-bold uppercase tracking-wide transition-colors ${tab === 'terms' ? 'text-brand-green border-b-2 border-brand-green' : 'text-brand-sage hover:text-brand-cream'}`}
            >
                Terms of Service
            </button>
            <button 
                onClick={() => setTab('privacy')}
                className={`flex-1 py-3 text-sm font-bold uppercase tracking-wide transition-colors ${tab === 'privacy' ? 'text-brand-green border-b-2 border-brand-green' : 'text-brand-sage hover:text-brand-cream'}`}
            >
                Privacy Policy
            </button>
        </div>
        
        <div className="p-8 overflow-y-auto custom-scrollbar text-brand-cream space-y-6 leading-relaxed flex-1">
           
           {tab === 'disclaimer' && (
               <div className="animate-fade-in">
                    <h3 className="text-white text-lg font-bold mb-4">Medical & Wellness Disclaimer</h3>
                    <div className="p-4 bg-red-900/10 border border-red-500/20 rounded-xl mb-6">
                        <p className="text-sm text-red-200 font-medium">
                            IMPORTANT: The Reset Compass app is not a medical device and does not provide medical advice.
                        </p>
                    </div>
                    <p className="mb-4">
                        The content, activities, and suggestions provided by <strong>Evolution of Wellness LLC</strong> ("we," "us," or "our") on The Reset Compass mobile application and the website <strong>evolutionofwellness.com</strong> are for general informational, educational, and personal growth purposes only.
                    </p>
                    <p className="mb-4">
                        <strong>Crisis Exclusion:</strong> This app is <strong className="text-white">not equipped</strong> to handle emergencies, self-harm, or severe mental health situations. We do not provide real-time monitoring. If you are in immediate danger, you must call emergency services (911 in the US) or use the 988 Suicide & Crisis Lifeline immediately.
                    </p>
                    <p className="mb-4">
                        <strong>Professional Guidelines:</strong> Our suggestions are designed to align with general wellness guidelines for healthy adults. However, our content is not a substitute for medical advice or personalized health instructions.
                    </p>
                    <p className="mb-4">
                        <strong>Not Medical Advice:</strong> All information found within this app is not intended to be a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your doctor or other qualified health provider with any questions you may have regarding a medical condition.
                    </p>
                    <p className="mb-4">
                        <strong>Physical Activity Risk:</strong> Engage in physical activities at your own risk. Listen to your body. If you experience pain, dizziness, or shortness of breath, stop immediately and consult a professional.
                    </p>
               </div>
           )}

           {tab === 'terms' && (
               <div className="animate-fade-in text-sm">
                   <h3 className="text-white text-lg font-bold mb-4">Terms of Service</h3>
                   <p className="mb-4"><strong>Effective Date:</strong> {new Date().toLocaleDateString()}</p>
                   
                   <h4 className="font-bold text-white mt-4 mb-2">1. Acceptance of Terms</h4>
                   <p className="mb-2">
                       By accessing or using The Reset Compass or visiting <strong>evolutionofwellness.com</strong>, you agree to be bound by these Terms of Service. If you disagree with any part of the terms, you may not access the service.
                   </p>
                   
                   <h4 className="font-bold text-white mt-4 mb-2">2. Ownership</h4>
                   <p className="mb-2">
                       The Service and its original content, features, and functionality are and will remain the exclusive property of <strong>Evolution of Wellness LLC</strong>. The app is protected by copyright, trademark, and other laws of both the United States and foreign countries.
                   </p>
                   
                   <h4 className="font-bold text-white mt-4 mb-2">3. User Conduct</h4>
                   <p className="mb-2">You agree to use the app only for lawful purposes and in a way that does not infringe the rights of, restrict, or inhibit anyone else's use of the app.</p>

                   <h4 className="font-bold text-white mt-4 mb-2">4. Subscriptions & Payments</h4>
                   <p className="mb-2">
                       Compass+ memberships are billed in advance on a recurring and periodic basis (monthly or yearly). You may cancel your subscription at any time.
                   </p>
               </div>
           )}

           {tab === 'privacy' && (
               <div className="animate-fade-in text-sm">
                    <h3 className="text-white text-lg font-bold mb-4">Privacy Policy</h3>
                    <p className="mb-4 text-xs">Evolution of Wellness LLC respects your privacy.</p>
                    
                    <h4 className="font-bold text-white mt-4 mb-2">1. Data Storage Model</h4>
                    <p className="mb-2">
                        We prioritize your privacy. The Reset Compass is designed as a "Local-First" application. This means that your journal entries, streaks, mood history, and settings are stored locally on your specific device (using LocalStorage). 
                    </p>
                    <p className="mb-2">
                        <strong>Evolution of Wellness LLC</strong> does not systematically collect, harvest, or upload your private reflections to a central cloud server. Your journey stays on your device.
                    </p>

                    <h4 className="font-bold text-white mt-4 mb-2">2. Communication</h4>
                    <p className="mb-2">
                        If you contact us via email (marcus@evolutionofwellness.com) or via the feedback form, we will use your provided contact information solely to respond to your inquiries.
                    </p>

                    <h4 className="font-bold text-white mt-4 mb-2">3. Your Rights & Data Deletion</h4>
                    <p className="mb-2">
                        You have full control over your data. Since data is stored on your device, you can clear it entirely at any time using the "Delete My Data" function in the Settings or below.
                    </p>

                    {showDeleteConfirm ? (
                        <div className="mt-8 p-6 bg-red-500/10 border border-red-500/30 rounded-xl animate-scale-in">
                            <h4 className="font-bold text-red-400 mb-2 flex items-center gap-2">
                                <span className="text-xl">⚠️</span> Are you sure?
                            </h4>
                            <p className="text-xs text-red-200 mb-6 leading-relaxed">
                                This will permanently delete your streak, history, and rank from this device. 
                                <br/><br/>
                                <strong>This action cannot be undone.</strong>
                            </p>
                            <div className="flex gap-3">
                                <button 
                                    onClick={() => setShowDeleteConfirm(false)}
                                    className="flex-1 py-3 bg-brand-dark text-brand-cream font-bold rounded-lg text-xs hover:bg-brand-dark/80 transition-colors uppercase tracking-wider border border-white/10"
                                >
                                    Cancel
                                </button>
                                <button 
                                    onClick={() => clearAllData()}
                                    className="flex-1 py-3 bg-red-600 text-white font-bold rounded-lg text-xs hover:bg-red-500 transition-colors uppercase tracking-wider shadow-lg shadow-red-900/20"
                                >
                                    Yes, Delete
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="mt-8 pt-6 border-t border-white/10">
                            <h4 className="font-bold text-brand-cream mb-2">Data Controls</h4>
                            <p className="mb-4 text-xs text-brand-sage">This action will permanently remove all your progress from this device.</p>
                            <button 
                                onClick={() => setShowDeleteConfirm(true)}
                                className="px-4 py-2 bg-red-900/30 text-red-400 border border-red-900 hover:bg-red-900/50 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors"
                            >
                                Delete My Data
                            </button>
                        </div>
                    )}
               </div>
           )}

        </div>

        <div className="p-6 border-t border-white/10 bg-brand-teal rounded-b-2xl flex justify-between items-center text-xs text-brand-sage">
            <span>© Evolution of Wellness LLC</span>
            <button 
                onClick={onClose}
                className="px-6 py-2 bg-brand-green text-brand-teal font-bold rounded-full hover:bg-brand-green/90 transition-colors"
            >
                Close
            </button>
        </div>
      </div>
    </div>
  );
};

export default LegalModal;
