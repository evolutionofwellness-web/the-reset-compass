
import React, { useEffect, useState } from 'react';

const ReloadPrompt: React.FC = () => {
  const [needRefresh, setNeedRefresh] = useState(false);
  const [offlineReady, setOfflineReady] = useState(false);
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      // Handle automatic reload when the new SW takes control
      let refreshing = false;
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (!refreshing) {
          refreshing = true;
          window.location.reload();
        }
      });

      // Register and Monitor
      navigator.serviceWorker.ready.then(reg => {
        setRegistration(reg);
        
        // If there's already a waiting worker, we need to refresh
        if (reg.waiting) {
            setNeedRefresh(true);
        }

        // Check for updates periodically and on visibility change
        const checkForUpdate = () => {
            reg.update().catch(err => console.log("Update check failed", err));
        };

        // Check every 15 minutes
        const interval = setInterval(checkForUpdate, 15 * 60 * 1000);
        
        // Check when user returns to the app
        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'visible') {
                checkForUpdate();
            }
        });

        return () => {
            clearInterval(interval);
            document.removeEventListener('visibilitychange', checkForUpdate);
        };
      });
    }
  }, []);

  // Listen for the 'updatefound' event from the registration
  useEffect(() => {
      if (!registration) return;

      const handleUpdateFound = () => {
          const newWorker = registration.installing;
          if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                  if (newWorker.state === 'installed') {
                      if (navigator.serviceWorker.controller) {
                          // New update available
                          setNeedRefresh(true);
                      } else {
                          // Content is cached for offline use
                          setOfflineReady(true);
                          setTimeout(() => setOfflineReady(false), 4000); // Hide "offline ready" toast automatically
                      }
                  }
              });
          }
      };

      registration.addEventListener('updatefound', handleUpdateFound);
      return () => registration.removeEventListener('updatefound', handleUpdateFound);
  }, [registration]);

  const updateServiceWorker = () => {
      if (registration && registration.waiting) {
          // Send message to SW to skip waiting and activate
          registration.waiting.postMessage({ type: 'SKIP_WAITING' });
          setNeedRefresh(false);
      }
  };

  const close = () => {
    setOfflineReady(false);
    setNeedRefresh(false);
  };

  if (!needRefresh && !offlineReady) return null;

  // MODAL FOR UPDATES
  if (needRefresh) {
      return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-brand-dark/80 backdrop-blur-md animate-fade-in">
            <div className="w-full max-w-sm bg-brand-teal border border-brand-green/50 rounded-2xl shadow-2xl p-6 text-center animate-modal-enter relative overflow-hidden">
                {/* Background Glow */}
                <div className="absolute top-[-50%] left-[-50%] w-full h-full bg-brand-green/10 blur-[60px] pointer-events-none"></div>
                
                <div className="relative z-10">
                    <div className="w-16 h-16 bg-brand-dark/50 rounded-full flex items-center justify-center mx-auto mb-4 border border-brand-green/30">
                        <span className="text-3xl animate-bounce-fast">🚀</span>
                    </div>
                    
                    <h2 className="text-xl font-bold text-brand-cream mb-2">New Version Available</h2>
                    <p className="text-brand-sage text-sm mb-6 leading-relaxed">
                        The Reset Compass has been updated with improvements. Please update now to ensure the best experience.
                    </p>

                    <button 
                        onClick={updateServiceWorker}
                        className="w-full py-3 bg-brand-green text-brand-teal font-bold rounded-xl shadow-lg hover:bg-brand-green/90 transition-transform active:scale-95 flex items-center justify-center gap-2"
                    >
                        Update Now
                    </button>
                    
                    <button 
                        onClick={close}
                        className="mt-4 text-xs text-brand-sage hover:text-brand-cream underline underline-offset-4"
                    >
                        Dismiss (Not Recommended)
                    </button>
                </div>
            </div>
        </div>
      );
  }

  // TOAST FOR OFFLINE READY
  return (
    <div className="fixed bottom-0 right-0 m-4 sm:m-6 p-5 bg-brand-dark/95 backdrop-blur-md border border-white/10 rounded-2xl shadow-2xl z-[100] animate-slide-up max-w-sm flex items-start gap-4">
         <div className="w-10 h-10 rounded-full bg-brand-green/20 flex items-center justify-center shrink-0">
             <span className="text-xl">✅</span>
         </div>
         <div>
            <h3 className="text-brand-cream font-bold text-sm mb-1">
                Ready for Offline
            </h3>
            <p className="text-brand-sage text-xs leading-relaxed mb-2">
                The app is now cached and ready to use without an internet connection.
            </p>
            <button 
                onClick={close}
                className="text-brand-green hover:text-brand-green/80 text-xs font-bold uppercase tracking-wider transition-colors"
            >
                Got it
            </button>
         </div>
    </div>
  );
};

export default ReloadPrompt;
