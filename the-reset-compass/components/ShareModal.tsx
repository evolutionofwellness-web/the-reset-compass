import React, { useState, useEffect, useRef } from 'react';

interface ShareModalProps {
  onClose: () => void;
  onSuccess?: () => void;
  shareData?: {
    title: string;
    text: string;
    activity?: string;
    rank?: string;
    xp?: number;
    streak?: number;
    mode?: string;
    powerThought?: string;
    completedParts?: string[];
    dayCompletedToday?: boolean;
  };
}

const ShareModal: React.FC<ShareModalProps> = ({ onClose, onSuccess, shareData }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [shareStatus, setShareStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const appUrl = "compass.evolutionofwellness.com";
  const appName = "THE RESET COMPASS";
  const appTagline = "MASTER YOUR STATE";
  const appDescription = "NEURO-SOMATIC TOOLKIT";
  
  const activityName = "I showed up today.";
  const rank = shareData?.rank || "Novice";
  const xp = shareData?.xp || 0;
  const streak = shareData?.streak || 0;
  const mode = shareData?.mode || "Grounded";
  const completedParts = shareData?.completedParts || [];
  const dayCompletedToday = shareData?.dayCompletedToday || false;

  const getMotivationalLine = () => {
    if (streak >= 31) return "This isn't a streak anymore. It's who I am.";
    if (streak >= 15) return "Consistency is my new superpower.";
    if (streak >= 8) return "Two weeks of not quitting. That matters.";
    if (streak >= 4) return "Showing up daily. Building something real.";
    return "Starting is the hardest part. Done.";
  };

  const getBadgeLabel = () => {
    if (dayCompletedToday) return "Full reset";
    if (completedParts.includes('move')) return "Moved today";
    if (completedParts.includes('fuel')) return "Fueled today";
    if (completedParts.includes('recover')) return "Recovered today";
    return "Showed up";
  };

  const motivationalLine = getMotivationalLine();
  const badgeLabel = getBadgeLabel();

  const brand = {
    teal: '#1d3a3a',
    green: '#4fb06d',
    white: '#ffffff',
    slate: '#64748b'
  };

  const getModeColor = () => {
    switch(mode) {
      case 'Surviving': return '#ef4444';
      case 'Drifting': return '#8b5cf6';
      case 'Healing': return '#6366f1';
      case 'Grounded': return brand.green;
      case 'Growing': return '#f97316';
      case 'Flowing': return '#06b6d4';
      default: return brand.green;
    }
  };

  const generateVictoryCard = async (): Promise<File | null> => {
    const canvas = canvasRef.current;
    if (!canvas) return null;

    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    const width = 1080;
    const height = 1920; 
    const sideMargin = 120; 
    const topMargin = 280;
    const bottomMargin = 320;
    const usableWidth = width - (sideMargin * 2);

    canvas.width = width;
    canvas.height = height;

    // 1. Background - Subtle green gradient
    const bgGradient = ctx.createLinearGradient(0, 0, 0, height);
    bgGradient.addColorStop(0, '#061a1a'); // Very dark teal/green
    bgGradient.addColorStop(1, '#0f2929'); // Slightly lighter dark green
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, width, height);

    const modeColor = getModeColor();
    const radialGlow = ctx.createRadialGradient(width/2, height/2, 0, width/2, height/2, 1200);
    radialGlow.addColorStop(0, brand.green + '22');
    radialGlow.addColorStop(1, 'transparent');
    ctx.fillStyle = radialGlow;
    ctx.fillRect(0, 0, width, height);

    // 2. Header
    ctx.textAlign = 'center';
    ctx.fillStyle = brand.white;
    ctx.font = '900 36px sans-serif';
    ctx.letterSpacing = '14px';
    ctx.fillText(appName, width / 2, topMargin);
    
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.font = 'bold 22px sans-serif';
    ctx.letterSpacing = '10px';
    ctx.fillText("I showed up today.", width / 2, topMargin + 70);

    // 3. Main Card
    const cardY = topMargin + 260;
    const cardHeight = 680;
    
    ctx.shadowBlur = 80;
    ctx.shadowColor = 'rgba(0,0,0,0.5)';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
    ctx.beginPath();
    ctx.roundRect(sideMargin, cardY, usableWidth, cardHeight, 100);
    ctx.fill();
    ctx.shadowBlur = 0;
    
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Icon - Compass Rose
    ctx.save();
    ctx.translate(width / 2, cardY + 180);
    
    // Outer circle
    ctx.beginPath();
    ctx.arc(0, 0, 90, 0, Math.PI * 2);
    ctx.strokeStyle = brand.green;
    ctx.lineWidth = 4;
    ctx.stroke();

    // Compass Points
    const drawPoint = (rot: number, length: number, color: string) => {
        ctx.save();
        ctx.rotate(rot);
        ctx.beginPath();
        ctx.moveTo(0, -length);
        ctx.lineTo(12, 0);
        ctx.lineTo(0, length);
        ctx.lineTo(-12, 0);
        ctx.closePath();
        ctx.fillStyle = color;
        ctx.fill();
        ctx.restore();
    };

    // Major points
    drawPoint(0, 75, brand.green);
    drawPoint(Math.PI / 2, 75, brand.green);
    drawPoint(Math.PI, 75, brand.green);
    drawPoint(3 * Math.PI / 2, 75, brand.green);
    
    // Minor points
    drawPoint(Math.PI / 4, 50, 'rgba(79, 176, 109, 0.4)');
    drawPoint(3 * Math.PI / 4, 50, 'rgba(79, 176, 109, 0.4)');
    drawPoint(5 * Math.PI / 4, 50, 'rgba(79, 176, 109, 0.4)');
    drawPoint(7 * Math.PI / 4, 50, 'rgba(79, 176, 109, 0.4)');

    ctx.restore();

    // Content Text
    ctx.textAlign = 'center';
    ctx.fillStyle = brand.white;
    ctx.font = 'italic 500 78px serif';
    ctx.fillText("I showed up today.", width / 2, cardY + 390);
    
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.font = 'bold 20px sans-serif';
    ctx.letterSpacing = '12px';
    ctx.fillText("SESSION COMPLETE", width / 2, cardY + 470);

    // Mode Pill
    const pillWidth = 340;
    const pillHeight = 70;
    ctx.fillStyle = brand.green;
    ctx.beginPath();
    ctx.roundRect(width/2 - pillWidth/2, cardY + 520, pillWidth, pillHeight, 35);
    ctx.fill();
    
    ctx.fillStyle = 'rgba(0,0,0,0.85)';
    ctx.font = 'bold 24px sans-serif';
    ctx.letterSpacing = '6px';
    ctx.fillText(badgeLabel.toUpperCase(), width/2, cardY + 565);

    // 4. Stats
    const statsY = cardY + cardHeight + 120;
    const statBoxWidth = (usableWidth - 80) / 3;
    
    const drawStat = (x: number, label: string, val: string, color: string) => {
        ctx.textAlign = 'center';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
        ctx.font = 'bold 20px sans-serif';
        ctx.letterSpacing = '6px';
        ctx.fillText(label.toUpperCase(), x, statsY);
        
        ctx.fillStyle = color;
        ctx.font = '900 72px sans-serif';
        ctx.letterSpacing = '-2px';
        ctx.fillText(val, x, statsY + 90);
    };

    drawStat(sideMargin + statBoxWidth/2, "Rank", rank, brand.white);
    drawStat(width / 2, "Streak", `${streak}d`, '#fb923c');
    drawStat(width - sideMargin - statBoxWidth/2, "Growth", `+${xp}`, brand.green);

    // 5. Promo / Branding
    ctx.textAlign = 'center';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.font = 'italic 500 44px serif';
    ctx.fillText(`"${motivationalLine}"`, width / 2, height - bottomMargin - 120);

    ctx.fillStyle = brand.green;
    ctx.font = 'bold 22px sans-serif';
    ctx.letterSpacing = '14px';
    ctx.fillText(appDescription, width / 2, height - 200);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
    ctx.font = 'bold 28px sans-serif';
    ctx.letterSpacing = '6px';
    ctx.fillText(appUrl, width / 2, height - 120);

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        if (!blob) return resolve(null);
        const file = new File([blob], 'compass-reset.png', { type: 'image/png' });
        resolve(file);
      }, 'image/png');
    });
  };

  const handleShare = async () => {
    setIsGenerating(true);
    setShareStatus('idle');

    const imageFile = await generateVictoryCard();
    const richMessage = `I just reset my energy with The Reset Compass. Feeling ${mode}! 🧭✨\n\nJoin the journey: ${appUrl}\n\n#ResetCompass #NeuroSomatic #Wellness #Mindfulness`;

    const shareOptions: any = {
      title: 'The Reset Compass',
      text: richMessage,
      url: `https://${appUrl}`
    };

    if (imageFile && navigator.canShare && navigator.canShare({ files: [imageFile] })) {
      shareOptions.files = [imageFile];
    }
    
    try {
      await navigator.share(shareOptions);
      setShareStatus('success');
      // Automatic redirect after successful share
      setTimeout(() => {
        if (onSuccess) onSuccess();
        else onClose();
      }, 500);
    } catch (err) {
      if ((err as Error).name !== 'AbortError') {
        setShareStatus('error');
      }
    }
    setIsGenerating(false);
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-brand-dark/95 backdrop-blur-2xl animate-fade-in">
      {/* Safe area adjusted close button */}
      <button 
        onClick={onClose} 
        style={{ 
          top: 'calc(max(60px, env(safe-area-inset-top) + 16px))',
          minWidth: '44px',
          minHeight: '44px'
        }}
        className="absolute right-6 z-[120] rounded-full bg-brand-dark/50 backdrop-blur-md border border-white/10 text-brand-sage hover:text-white flex items-center justify-center shadow-lg transition-all text-xl" 
        aria-label="Close"
      >
        ✕
      </button>
      <div className="w-full max-w-sm bg-brand-teal border border-white/10 rounded-[3rem] shadow-2xl overflow-hidden animate-modal-enter">
        <div className="p-6 border-b border-white/5 flex justify-between items-center bg-brand-dark/50">
          <h2 className="text-[10px] font-black text-white/40 uppercase tracking-[0.4em]">Preview Victory Card</h2>
        </div>

        <div className="p-6 space-y-6">
          <canvas ref={canvasRef} className="hidden" />

          {/* High Fidelity Preview Wrapper */}
          <div className="relative group overflow-hidden rounded-[2.5rem] bg-gradient-to-b from-brand-teal to-brand-dark aspect-[9/16] shadow-2xl border border-white/10 flex flex-col items-center justify-between py-12 px-6 text-center transform transition-transform hover:scale-[1.01]">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(79,176,109,0.1),_transparent)] pointer-events-none"></div>
              
              <div className="space-y-1 relative z-10">
                  <p className="text-white text-[10px] font-black uppercase tracking-[0.6em]">{appName}</p>
                  <p className="text-white/30 text-[7px] font-black uppercase tracking-[0.4em]">I showed up today.</p>
              </div>

              <div className="w-full bg-white/5 border border-white/10 rounded-[2rem] py-8 px-4 space-y-5 relative z-10 backdrop-blur-sm shadow-xl">
                  {/* Compass Rose Icon */}
                  <div className="w-14 h-14 border-2 border-brand-green rounded-full mx-auto flex items-center justify-center shadow-lg relative">
                      <div className="absolute w-10 h-1 bg-brand-green rounded-full"></div>
                      <div className="absolute w-1 h-10 bg-brand-green rounded-full"></div>
                      <div className="absolute w-6 h-0.5 bg-brand-green/40 rotate-45 rounded-full"></div>
                      <div className="absolute w-0.5 h-6 bg-brand-green/40 rotate-45 rounded-full"></div>
                  </div>
                  <h3 className="text-white font-serif italic text-xl leading-tight px-4">I showed up today.</h3>
                  <div className="inline-block px-4 py-1.5 rounded-full text-[9px] font-black text-brand-dark uppercase tracking-widest bg-brand-green">
                      {badgeLabel}
                  </div>
              </div>

              <div className="grid grid-cols-3 gap-3 w-full relative z-10">
                  <div className="space-y-1">
                      <p className="text-[7px] text-white/40 uppercase font-black tracking-widest">Rank</p>
                      <p className="text-[11px] text-white font-black truncate">{rank}</p>
                  </div>
                  <div className="space-y-1">
                      <p className="text-[7px] text-white/40 uppercase font-black tracking-widest">Streak</p>
                      <p className="text-[11px] text-orange-400 font-black">{streak}D</p>
                  </div>
                  <div className="space-y-1">
                      <p className="text-[7px] text-white/40 uppercase font-black tracking-widest">Growth</p>
                      <p className="text-[11px] text-brand-green font-black">+{xp}</p>
                  </div>
              </div>

              <div className="space-y-4 relative z-10">
                <p className="text-white/50 text-[9px] font-serif italic max-w-[200px] mx-auto">"{motivationalLine}"</p>
                <p className="text-white/20 text-[8px] font-black uppercase tracking-[0.4em]">{appUrl}</p>
              </div>
          </div>

          <div className="space-y-4">
              <button 
                onClick={handleShare}
                disabled={isGenerating}
                className={`w-full py-4 bg-brand-cream text-brand-dark font-black text-xs uppercase tracking-[0.3em] rounded-2xl transition-all flex items-center justify-center gap-3 shadow-xl ${isGenerating ? 'opacity-50' : 'hover:scale-[1.02] active:scale-[0.98]'}`}
              >
                {isGenerating ? "Preparing Card..." : "Post Victory"}
              </button>

              <p className="text-center text-[9px] text-white/20 uppercase font-bold tracking-widest px-4 leading-relaxed">
                  Optimized for Instagram & TikTok stories.
              </p>
          </div>
        </div>
        
        {shareStatus === 'error' && (
            <div className="p-4 bg-red-500/10 text-red-400 text-center text-[10px] font-bold uppercase tracking-widest">
                Share aborted or failed. Try again.
            </div>
        )}
      </div>
    </div>
  );
};

export default ShareModal;