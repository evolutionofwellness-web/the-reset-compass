import React, { useState } from 'react';
import { clearAllData, saveReminderSettings } from '../services/storageService';
import { requestNotificationPermission, sendLocalNotification } from '../services/notificationService';
import { APP_VERSION } from '../types';

interface SettingsModalProps {
  currentName: string;
  onSaveName: (name: string) => void;
  onClose: () => void;
  onOpenLegal: () => void;
  onOpenContact: () => void;
  onOpenReview: () => void;
}

const SUPPORT_EMAIL = "marcus@evolutionofwellness.com";
const STRIPE_BILLING_PORTAL_URL = ""; 

const SettingsModal: React.FC<SettingsModalProps> = ({ currentName, onSaveName, onClose, onOpenLegal, onOpenContact, onOpenReview }) => {
  const [name, setName] = useState(currentName);
  const [view, setView] = useState<'general' | 'manage_sub'>('general');
  
  const statsStr = localStorage.getItem('reset_compass_stats');
  const stats = statsStr ? JSON.parse(statsStr) : {};
  
  const [remindersEnabled, setRemindersEnabled] = useState(stats.remindersEnabled || false);
  const [reminderTime, setReminderTime] = useState(stats.reminderTime || "09:00");

  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone === true;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) onSaveName(name.trim());
    saveReminderSettings(remindersEnabled, reminderTime);

    if (remindersEnabled) {
        const granted = await requestNotificationPermission();
        if (!granted) {
            alert("Please enable notifications in your device settings to receive reminders.");
            setRemindersEnabled(false);
            saveReminderSettings(false, reminderTime);
        }
    }
    onClose();
  };

  const handleTestNotification = async () => {
      const granted = await requestNotificationPermission();
      if (granted) {
          sendLocalNotification("It's time to reset.", "Take a breath. Which direction calls to you?");
      } else {
          alert(isIOS && !isStandalone 
            ? "On some devices, you must add this app to your Home Screen first to use notifications." 
            : "Notification permission denied. Please check your browser settings."
          );
      }
  };

  const handleClearData = () => {
      if (window.confirm("Are you sure? This will permanently delete your streak, history, rank, and settings. This cannot be undone.")) {
          clearAllData();
      }
  };

  const handleForceUpdate = async () => {
      if (!window.confirm("This will refresh the app to the latest version. This usually fixes display issues. Continue?")) return;
      if ('serviceWorker' in navigator) {
          const registrations = await navigator.serviceWorker.getRegistrations();
          for (const registration of registrations) await registration.unregister();
      }
      if ('caches' in window) {
          const keys = await caches.keys();
          for (const key of keys) await caches.delete(key);
      }
      window.location.reload();
  };

  const handleCancellation = () => {
      if (STRIPE_BILLING_PORTAL_URL) {
          window.open(STRIPE_BILLING_PORTAL_URL, '_blank');
      } else {
          const subject = encodeURIComponent("Cancellation Request - Compass+");
          const body = encodeURIComponent("I would like to cancel my Compass+ subscription.\n\nMy Email: \n(Please ensure this matches your purchase email)\n\nReason (Optional): ");
          window.location.href = `mailto:${SUPPORT_EMAIL}?subject=${subject}&body=${body}`;
      }
  };

  if (view === 'manage_sub') {
      return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-dark/90 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-sm bg-brand-teal border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-modal-enter">
            <div className="p-6 border-b border-white/10 flex justify-between items-center">
              <button onClick={() => setView('general')} className="text-brand-sage hover:text-brand-cream text-xs font-bold uppercase tracking-widest flex items-center gap-1">
                  ← Back
              </button>
              <h2 className="text-lg font-light text-brand-cream">Manage Membership</h2>
              <div className="w-8"></div>
            </div>

            <div className="p-6 text-center">
                <div className="w-16 h-16 rounded-full bg-brand-dark/50 mx-auto mb-4 flex items-center justify-center text-3xl">😢</div>
                <h3 className="text-brand-cream font-bold text-lg mb-2">Wait, before you go...</h3>
                <p className="text-brand-sage text-sm mb-6 leading-relaxed">
                    Canceling means you will lose access to the <strong>AI Wellness Advice</strong>, <strong>Unlimited Reshuffles</strong>, and your <strong>Energy Insights</strong>.
                </p>
                <div className="bg-brand-dark/50 rounded-xl p-4 text-left mb-6 border border-white/10">
                    <h4 className="text-xs font-bold text-brand-sage uppercase tracking-widest mb-2">What you'll lose:</h4>
                    <ul className="space-y-2 text-sm text-brand-sage">
                        <li className="flex items-center gap-2"><span className="text-red-400">×</span> Deeper Progress Tracking</li>
                        <li className="flex items-center gap-2"><span className="text-red-400">×</span> Unlimited Activities</li>
                        <li className="flex items-center gap-2"><span className="text-red-400">×</span> AI Wellness Advice</li>
                    </ul>
                </div>
                <div className="space-y-3">
                    <button onClick={() => setView('general')} className="w-full py-3 bg-gradient-to-r from-brand-green to-brand-teal text-brand-cream font-bold rounded-xl hover:shadow-lg transition-all">Keep Compass+</button>
                    <button onClick={handleCancellation} className="w-full py-3 text-brand-sage hover:text-red-400 text-xs font-bold uppercase tracking-widest transition-colors">
                        {STRIPE_BILLING_PORTAL_URL ? "Proceed to Stripe Portal" : "Contact Support to Cancel"}
                    </button>
                </div>
            </div>
          </div>
        </div>
      );
  }

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
      <div className="w-full max-w-sm bg-brand-teal border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-modal-enter">
        <div className="p-6 border-b border-white/10 flex justify-between items-center">
          <h2 className="text-xl font-light text-brand-cream">Settings</h2>
        </div>
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
            <form onSubmit={handleSave}>
                <div className="mb-6">
                    <label className="block text-xs font-bold text-brand-sage uppercase tracking-widest mb-2">Display Name</label>
                    <input 
                        type="text" 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-brand-dark/50 border border-white/10 rounded-lg p-3 text-brand-cream focus:border-brand-green focus:outline-none transition-colors"
                        placeholder="Your Name"
                    />
                </div>
                {stats.isPro && (
                    <div className="mb-6 p-4 bg-brand-green/10 border border-brand-green/20 rounded-xl">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-brand-green font-bold text-sm">Compass+ Active</span>
                            <span className="text-[10px] bg-brand-green text-brand-dark px-2 py-0.5 rounded-full font-bold uppercase">Compass+</span>
                        </div>
                        <p className="text-xs text-brand-sage mb-3">{stats.subscriptionPlan === 'yearly' ? 'Yearly Plan' : 'Monthly Plan'}</p>
                        <button type="button" onClick={() => setView('manage_sub')} className="w-full py-2 bg-white/5 hover:bg-white/10 text-brand-sage text-xs font-bold uppercase tracking-wider rounded-lg transition-colors border border-white/10">Manage Subscription</button>
                    </div>
                )}
                <div className="mb-6 pt-6 border-t border-white/10">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-xs font-bold text-brand-sage uppercase tracking-widest">Daily Reminders</h3>
                        <button type="button" onClick={() => setRemindersEnabled(!remindersEnabled)} className={`w-10 h-5 rounded-full transition-colors relative ${remindersEnabled ? 'bg-brand-green' : 'bg-white/10'}`}>
                            <div className={`w-3 h-3 bg-white rounded-full absolute top-1 transition-transform ${remindersEnabled ? 'left-6' : 'left-1'}`} />
                        </button>
                    </div>
                    
                    {isIOS && !isStandalone && remindersEnabled && (
                        <div className="p-3 bg-brand-green/10 border border-brand-green/20 rounded-lg mb-4">
                            <p className="text-[10px] text-brand-green leading-tight">
                                <strong>Notice:</strong> On some devices, you must use <strong>Add to Home Screen</strong> to enable reminder notifications.
                            </p>
                        </div>
                    )}

                    {remindersEnabled && (
                        <div className="animate-fade-in space-y-4 mt-4">
                            <div>
                                <label className="block text-[10px] text-brand-sage uppercase tracking-widest mb-2">Reminder Time</label>
                                <input type="time" value={reminderTime} onChange={(e) => setReminderTime(e.target.value)} className="bg-brand-dark/50 border border-white/10 text-brand-cream rounded-lg p-3 text-sm w-full outline-none focus:border-brand-green" />
                            </div>
                            <button type="button" onClick={handleTestNotification} className="w-full py-2 bg-brand-green/10 border border-brand-green/20 text-brand-green text-[10px] font-black uppercase tracking-widest rounded-lg hover:bg-brand-green/20 transition-colors">
                                Send Test Notification
                            </button>
                        </div>
                    )}
                </div>

                <div className="mb-6 pt-6 border-t border-white/10 space-y-3">
                    <h3 className="text-xs font-bold text-brand-sage uppercase tracking-widest mb-1">Feedback & Support</h3>
                    <button type="button" onClick={onOpenReview} className="w-full py-2.5 bg-white/5 border border-white/10 text-brand-sage font-bold rounded-lg hover:bg-white/10 transition-colors text-xs uppercase tracking-wider flex items-center justify-center gap-2">
                        <span>⭐</span> Share Feedback
                    </button>
                    <button type="button" onClick={onOpenContact} className="w-full py-2.5 bg-white/5 border border-white/10 text-brand-sage font-bold rounded-lg hover:bg-white/10 transition-colors text-xs uppercase tracking-wider flex items-center justify-center gap-2">
                        <span>✉️</span> Contact Support
                    </button>
                </div>

                <div className="mb-6 pt-6 border-t border-white/10">
                    <h3 className="text-xs font-bold text-brand-sage uppercase tracking-widest mb-3">Legal</h3>
                    <button type="button" onClick={onOpenLegal} className="w-full py-2.5 bg-white/5 border border-white/10 text-brand-sage font-bold rounded-lg hover:bg-white/10 transition-colors text-xs uppercase tracking-wider">
                        Legal, Privacy & Terms
                    </button>
                </div>

                <button type="submit" className="w-full py-3 bg-brand-green text-brand-teal font-bold rounded-lg hover:bg-brand-green/90 transition-colors shadow-lg">Save Changes</button>
            </form>
            <div className="pt-6 border-t border-white/10">
                <h3 className="text-xs font-bold text-brand-sage uppercase tracking-widest mb-3">Troubleshooting</h3>
                <button onClick={handleForceUpdate} className="w-full py-2 bg-white/5 border border-white/10 text-brand-sage font-bold rounded-lg hover:bg-white/10 transition-colors text-xs uppercase tracking-wider mb-4">Force Update App</button>
                <h3 className="text-xs font-bold text-red-400 uppercase tracking-widest mb-2">Danger Zone</h3>
                <button onClick={handleClearData} className="w-full py-2 bg-red-900/20 border border-red-900/50 text-red-400 font-bold rounded-lg hover:bg-red-900/40 transition-colors text-xs uppercase tracking-wider">Delete My Data</button>
                <div className="mt-4 text-center"><span className="text-[10px] text-brand-sage/50">v{APP_VERSION}</span></div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;