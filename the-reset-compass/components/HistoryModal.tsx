import React, { useMemo, useState } from 'react';
import { UserLog, ModeBreakdown, DailyRecommendation } from '../types';
import { analyzeInsights, getStats } from '../services/storageService';

interface HistoryModalProps {
  logs: UserLog[];
  breakdown: ModeBreakdown;
  isPro: boolean;
  onClose: () => void;
  onOpenPro: () => void;
}

const HistoryModal: React.FC<HistoryModalProps> = ({ logs, breakdown, isPro, onClose, onOpenPro }) => {
  const [activeTab, setActiveTab] = useState<'insights' | 'journal' | 'recommendations'>('insights');
  const stats = getStats();
  
  const getBadgeColor = (mode: string) => {
    switch(mode) {
        case 'Surviving': return 'bg-compass-surviving text-white';
        case 'Drifting': return 'bg-compass-drifting text-white';
        case 'Grounded': return 'bg-compass-grounded text-brand-dark';
        case 'Growing': return 'bg-compass-growing text-brand-dark';
        default: return 'bg-brand-dark/50 text-brand-sage';
    }
  };

  const insights = useMemo(() => analyzeInsights(logs), [logs]);
  const recentLogs = logs.slice(0, 50);
  const recommendationHistory = stats.recommendationHistory || [];

  const getDayLabel = (index: number) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - index));
      return d.toLocaleDateString('en-US', { weekday: 'narrow' });
  };

  const InsightsContent = () => (
    <div className="p-4 sm:p-6 space-y-6">
        <div className="relative p-5 sm:p-6 rounded-3xl overflow-hidden bg-brand-dark/50 border border-brand-green/20 shadow-lg group">
                {isPro ? (
                <div className="relative z-10 animate-fade-in">
                    <h3 className="text-[10px] font-black text-brand-green uppercase tracking-widest mb-1">Your Energy Type</h3>
                    <div className="flex items-center gap-4 mb-3">
                        <div className={`text-2xl sm:text-4xl font-serif font-black ${insights.wellnessStyle.color} drop-shadow-md`}>
                            {insights.wellnessStyle.title}
                        </div>
                    </div>
                    <p className="text-xs sm:text-sm text-brand-sage leading-relaxed border-l-2 border-brand-green/30 pl-3 italic">
                        {insights.wellnessStyle.description}
                    </p>
                </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-6 text-center">
                        <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mb-3 text-xl">🔒</div>
                        <p className="text-sm font-bold text-brand-cream mb-1">Unlock Your Energy Type</p>
                        <p className="text-[10px] text-brand-sage mb-4">Discover your personal energy style.</p>
                        <button onClick={onOpenPro} className="px-6 py-2 bg-brand-green hover:bg-brand-green/80 text-brand-teal text-xs font-black rounded-full transition-all">Upgrade to Compass+</button>
                    </div>
                )}
        </div>

        <div className="grid grid-cols-2 gap-4">
                <div className="bg-brand-dark/30 border border-white/5 p-5 rounded-2xl relative overflow-hidden">
                <h4 className="text-[9px] text-brand-sage/50 uppercase tracking-widest mb-2 font-black">Balance</h4>
                {isPro ? (
                    <div className="relative z-10">
                        <div className="text-2xl sm:text-3xl font-black text-brand-cream mb-1">{Math.round(insights.balanceScore)}<span className="text-xs text-brand-sage font-normal">/100</span></div>
                        <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                            <div style={{width: `${insights.balanceScore}%`}} className="h-full bg-brand-green shadow-[0_0_10px_rgba(11,61,46,0.5)]"></div>
                        </div>
                    </div>
                ) : (
                    <div className="blur-sm opacity-30 h-16 bg-white/5 rounded-xl"></div>
                )}
                </div>

                <div className="bg-brand-dark/30 border border-white/5 p-5 rounded-2xl">
                <h4 className="text-[9px] text-brand-sage/50 uppercase tracking-widest mb-2 font-black">Peak Time</h4>
                {isPro ? (
                    <div>
                        <div className="flex items-baseline gap-1">
                            <span className="text-lg sm:text-xl font-bold text-brand-cream">
                                {insights.timeOfDayBreakdown.morning >= Math.max(insights.timeOfDayBreakdown.afternoon, insights.timeOfDayBreakdown.evening) ? 'Morning' : 
                                    insights.timeOfDayBreakdown.afternoon >= insights.timeOfDayBreakdown.evening ? 'Afternoon' : 'Evening'}
                            </span>
                        </div>
                        <div className="flex gap-1 mt-3 h-8 items-end">
                            <div style={{height: `${Math.max(20, (insights.timeOfDayBreakdown.morning / (Math.max(1, logs.length)) * 100))}%`}} className="flex-1 bg-brand-green/40 rounded-sm"></div>
                            <div style={{height: `${Math.max(20, (insights.timeOfDayBreakdown.afternoon / (Math.max(1, logs.length)) * 100))}%`}} className="flex-1 bg-brand-green/70 rounded-sm"></div>
                            <div style={{height: `${Math.max(20, (insights.timeOfDayBreakdown.evening / (Math.max(1, logs.length)) * 100))}%`}} className="flex-1 bg-brand-green rounded-sm"></div>
                        </div>
                    </div>
                ) : (
                        <div className="blur-sm opacity-30 h-16 bg-white/5 rounded-xl"></div>
                )}
                </div>
        </div>

        <div className="bg-brand-dark/30 border border-white/5 p-6 rounded-2xl">
            <h4 className="text-[10px] text-brand-sage/50 uppercase tracking-widest mb-6 font-black flex justify-between">
                <span>Energy Landscape (7 Days)</span>
                {isPro && <span className="text-brand-green">Live</span>}
            </h4>
            
            {isPro ? (
                <div className="h-32 w-full flex items-end justify-between gap-2 relative">
                    {insights.weeklyEnergyTrend.map((level, i) => (
                        <div key={i} className="flex flex-col items-center gap-3 w-full h-full justify-end">
                            <div 
                                style={{ height: `${level === 0 ? 8 : ((level / 6) * 80) + 12}%` }}
                                className={`w-full max-w-[20px] rounded-t-lg transition-all duration-700 ${level === 0 ? 'bg-white/5' : 'bg-brand-green'} min-h-[4px]`}
                            ></div>
                            <span className="text-[8px] text-brand-sage/40 font-black uppercase tracking-tighter">{getDayLabel(i)}</span>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="h-32 bg-white/5 rounded-2xl flex items-center justify-center border border-dashed border-white/10">
                    <p className="text-xs text-brand-sage/50 font-bold">Upgrade for energy trends</p>
                </div>
            )}
        </div>
    </div>
  );

  const JournalContent = () => (
    <div className="p-4 sm:p-6 space-y-4">
        {logs.length === 0 ? (
            <div className="text-center py-20 text-brand-sage/50 flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-white/5 mb-4 flex items-center justify-center text-2xl">📖</div>
            <p className="font-medium">Your journal is empty.</p>
            </div>
        ) : (
            <div className="space-y-4">
                {recentLogs.map((log) => (
                <div key={log.id} className="bg-white/5 p-5 rounded-2xl border border-white/5 flex flex-col gap-3 hover:bg-white/10 transition-all">
                    <div className="flex justify-between items-start">
                        <div className="flex items-center gap-3">
                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest ${getBadgeColor(log.mode)}`}>
                                {log.mode}
                            </span>
                            <span className="text-[10px] text-brand-sage/50 font-bold">{new Date(log.date).toLocaleDateString()}</span>
                        </div>
                    </div>
                    <h3 className="text-brand-cream font-bold text-base">{log.activityTitle}</h3>
                    {log.notes && (
                        <p className="text-xs text-brand-sage italic leading-relaxed border-t border-white/5 pt-3 mt-1">{log.notes}</p>
                    )}
                </div>
                ))}
            </div>
        )}
    </div>
  );

  const RecommendationsContent = () => (
    <div className="p-4 sm:p-6 space-y-6">
        {!isPro ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6 text-3xl">🔒</div>
                <h3 className="text-xl font-serif text-brand-cream mb-2">Recommendation History</h3>
                <p className="text-brand-sage text-sm mb-8 max-w-xs mx-auto leading-relaxed">
                    Compass+ users can look back at every MOVE, FUEL, and RECOVER action suggested by the AI.
                </p>
                <button onClick={onOpenPro} className="px-8 py-3 bg-brand-green text-brand-teal font-black rounded-full shadow-xl shadow-brand-green/20 transition-all hover:scale-105 active:scale-95">Unlock History</button>
            </div>
        ) : recommendationHistory.length === 0 ? (
            <div className="text-center py-20 text-brand-sage/50 flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-white/5 mb-4 flex items-center justify-center text-2xl">📜</div>
                <p className="font-medium">No recommendations yet.</p>
            </div>
        ) : (
            <div className="space-y-8">
                {recommendationHistory.map((rec, idx) => (
                    <div key={idx} className="space-y-4">
                        <div className="flex items-center gap-4">
                            <div className="h-px flex-1 bg-white/10"></div>
                            <span className="text-[10px] font-black text-brand-green uppercase tracking-[0.2em]">{new Date(rec.date).toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}</span>
                            <div className="h-px flex-1 bg-white/10"></div>
                        </div>
                        <div className="grid gap-3">
                            {[
                                { ...rec.move, type: 'move', completed: rec.completedParts.includes('move') },
                                { ...rec.fuel, type: 'fuel', completed: rec.completedParts.includes('fuel') },
                                { ...rec.recover, type: 'recover', completed: rec.completedParts.includes('recover') }
                            ].map((part, pIdx) => (
                                <div key={pIdx} className="bg-white/5 p-4 rounded-2xl border border-white/5 flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-brand-dark/50 flex items-center justify-center text-lg">
                                        {part.type === 'move' ? '🏃' : part.type === 'fuel' ? '🥗' : '🧘'}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between mb-0.5">
                                            <span className="text-[10px] font-black text-brand-sage/50 uppercase tracking-widest">{part.type}</span>
                                            {part.completed && <span className="text-brand-green text-xs">✓</span>}
                                        </div>
                                        <h4 className="text-brand-cream font-bold text-sm">{part.title}</h4>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        )}
    </div>
  );

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-brand-dark/95 backdrop-blur-xl animate-fade-in">
      <div className="w-full max-w-5xl bg-brand-teal border border-white/10 rounded-[40px] shadow-2xl h-[90dvh] flex flex-col md:flex-row overflow-hidden relative">
        {/* Safe area adjusted close button */}
        <button 
          onClick={onClose} 
          style={{ 
            top: 'calc(max(60px, env(safe-area-inset-top) + 16px))',
            minWidth: '44px',
            minHeight: '44px'
          }}
          className="absolute right-6 z-[110] rounded-full bg-brand-dark/50 backdrop-blur-md border border-white/10 text-brand-sage hover:text-white flex items-center justify-center shadow-lg transition-all text-xl" 
          aria-label="Close"
        >
          ✕
        </button>
        
        {/* Sidebar / Tabs */}
        <div className="w-full md:w-72 bg-brand-dark/30 border-b md:border-b-0 md:border-r border-white/10 flex flex-col shrink-0">
            <div className="p-8 hidden md:block">
                <h2 className="text-2xl font-serif text-brand-cream italic">The Archive</h2>
                <p className="text-xs text-brand-sage/60 mt-1 uppercase tracking-widest font-black">Past actions and completions</p>
                <div className="h-1 w-8 bg-brand-green mt-2"></div>
            </div>
            
            <nav className="flex md:flex-col p-2 md:p-4 gap-1">
                <button 
                    onClick={() => setActiveTab('insights')} 
                    className={`flex-1 md:flex-none flex items-center justify-center md:justify-start gap-3 px-4 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'insights' ? 'bg-brand-green text-brand-teal shadow-lg shadow-brand-green/20' : 'text-brand-sage hover:bg-white/5'}`}
                >
                    <span className="text-lg hidden md:inline">📊</span>
                    Insights
                </button>
                <button 
                    onClick={() => setActiveTab('journal')} 
                    className={`flex-1 md:flex-none flex items-center justify-center md:justify-start gap-3 px-4 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'journal' ? 'bg-brand-green text-brand-teal shadow-lg shadow-brand-green/20' : 'text-brand-sage hover:bg-white/5'}`}
                >
                    <span className="text-lg hidden md:inline">📖</span>
                    Journal
                </button>
                <button 
                    onClick={() => setActiveTab('recommendations')} 
                    className={`flex-1 md:flex-none flex items-center justify-center md:justify-start gap-3 px-4 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'recommendations' ? 'bg-brand-green text-brand-teal shadow-lg shadow-brand-green/20' : 'text-brand-sage hover:bg-white/5'}`}
                >
                    <span className="text-lg hidden md:inline">📜</span>
                    History
                </button>
            </nav>
        </div>

        {/* Content Area */}
        <div className="flex-1 flex flex-col min-h-0 bg-brand-teal/50">
            <div className="flex-1 overflow-y-auto custom-scrollbar">
                {activeTab === 'insights' && <InsightsContent />}
                {activeTab === 'journal' && <JournalContent />}
                {activeTab === 'recommendations' && <RecommendationsContent />}
            </div>
            
            {/* Mobile Footer Close */}
            <div className="md:hidden p-4 bg-brand-dark/50 border-t border-white/10">
                <button 
                    onClick={onClose}
                    className="w-full py-4 bg-brand-green text-brand-teal font-black rounded-2xl text-xs uppercase tracking-widest shadow-lg shadow-brand-green/20"
                >
                    Return to Compass
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default HistoryModal;
