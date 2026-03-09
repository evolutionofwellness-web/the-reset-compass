import React, { useState, useEffect, useMemo, memo } from 'react';
import { CompassMode } from '../types';

interface CompassProps {
  onSelectMode: (mode: CompassMode) => void;
  className?: string;
  userRank?: string;
  isPro?: boolean;
}

const MODES_CONFIG = [
  { id: CompassMode.Growing, label: "GROWING", colors: ["#9a3412", "#fb923c"] },
  { id: CompassMode.Flowing, label: "FLOWING", colors: ["#0891b2", "#22d3ee"] },
  { id: CompassMode.Grounded, label: "GROUNDED", colors: ["#059669", "#34d399"] },
  { id: CompassMode.Surviving, label: "SURVIVING", colors: ["#991b1b", "#f87171"] },
  { id: CompassMode.Healing, label: "HEALING", colors: ["#3730a3", "#6366f1"] },
  { id: CompassMode.Drifting, label: "DRIFTING", colors: ["#4c1d95", "#a78bfa"] },
];

const polarToCartesian = (centerX: number, centerY: number, radius: number, angleInDegrees: number) => {
  const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
  return {
    x: centerX + (radius * Math.cos(angleInRadians)),
    y: centerY + (radius * Math.sin(angleInRadians))
  };
};

const describeArc = (x: number, y: number, radius: number, startAngle: number, endAngle: number) => {
  const start = polarToCartesian(x, y, radius, endAngle);
  const end = polarToCartesian(x, y, radius, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
  return ["M", x, y, "L", start.x, start.y, "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y, "Z"].join(" ");
};

const CompassTicks = memo(({ center, radius, isPro }: { center: number, radius: number, isPro: boolean }) => {
  return (
    <g opacity="0.6">
      {Array.from({ length: 60 }).map((_, i) => {
        const angle = i * 6;
        const isMajor = i % 10 === 0;
        const rStart = isMajor ? radius + 5 : radius + 12;
        const rEnd = radius + 25;
        const start = polarToCartesian(center, center, rStart, angle);
        const end = polarToCartesian(center, center, rEnd, angle);
        return (
          <line
            key={i}
            x1={start.x} y1={start.y}
            x2={end.x} y2={end.y}
            stroke={isMajor ? (isPro ? "#fbbf24" : "#ffffff") : "rgba(255,255,255,0.3)"}
            strokeWidth={isMajor ? 3 : 1}
          />
        );
      })}
    </g>
  );
});

const Compass: React.FC<CompassProps> = ({ onSelectMode, className, userRank = "Novice", isPro = false }) => {
  const [hoveredMode, setHoveredMode] = useState<CompassMode | null>(null);
  const [rotation, setRotation] = useState(0);

  const SLICE_ANGLE = 60;
  const size = 500;
  const center = size / 2;
  const radius = 185;
  const bezelRadius = 225;

  const modes = useMemo(() => MODES_CONFIG.map((mode, index) => {
    const startAngle = index * SLICE_ANGLE;
    const endAngle = startAngle + SLICE_ANGLE;
    return { ...mode, startAngle, endAngle, gradientId: `grad-${mode.id}` };
  }), []);

  useEffect(() => {
    if (hoveredMode) {
      const mode = modes.find(m => m.id === hoveredMode);
      if (mode) {
         const mid = (mode.startAngle + mode.endAngle) / 2;
         setRotation(mid);
      }
    }
  }, [hoveredMode, modes]);

  const activeModeData = modes.find(m => m.id === hoveredMode);

  return (
    <div className={`relative w-full max-w-[340px] aspect-square sm:max-w-[500px] flex items-center justify-center rounded-full ${className} select-none mx-auto`}>
      <div className={`absolute inset-0 rounded-full blur-[60px] sm:blur-[80px] transition-all duration-1000 opacity-60 pointer-events-none mix-blend-screen
        ${hoveredMode === CompassMode.Growing ? 'bg-orange-600/40' : ''}
        ${hoveredMode === CompassMode.Flowing ? 'bg-cyan-600/40' : ''}
        ${hoveredMode === CompassMode.Grounded ? 'bg-emerald-600/40' : ''}
        ${hoveredMode === CompassMode.Surviving ? 'bg-red-600/40' : ''}
        ${hoveredMode === CompassMode.Healing ? 'bg-indigo-600/40' : ''}
        ${hoveredMode === CompassMode.Drifting ? 'bg-violet-600/40' : ''}
        ${!hoveredMode ? 'bg-brand-dark/50' : ''}
      `}></div>

      <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-full drop-shadow-[0_20px_60px_rgba(0,0,0,0.8)] z-10 overflow-visible">
        <defs>
          <linearGradient id="metal-bezel" x1="0%" y1="0%" x2="100%" y2="100%">
             <stop offset="0%" stopColor="#64748b" />
             <stop offset="50%" stopColor="#cbd5e1" />
             <stop offset="100%" stopColor="#334155" />
          </linearGradient>
          {modes.map(mode => (
              <radialGradient key={mode.id} id={mode.gradientId} cx="50%" cy="50%" r="75%">
                  <stop offset="0%" stopColor={mode.colors[1]} stopOpacity="1" />
                  <stop offset="100%" stopColor={mode.colors[0]} stopOpacity="0.95" />
              </radialGradient>
          ))}
          <filter id="glow">
              <feGaussianBlur stdDeviation="3.5" result="coloredBlur"/>
              <feMerge>
                  <feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/>
              </feMerge>
          </filter>
        </defs>

        <circle cx={center} cy={center} r={bezelRadius + 10} fill="#000000" />
        <circle cx={center} cy={center} r={bezelRadius} fill="none" stroke="url(#metal-bezel)" strokeWidth="10" opacity="0.3" />

        <CompassTicks center={center} radius={radius} isPro={isPro} />

        <g>
            {modes.map((mode) => {
                const isHovered = hoveredMode === mode.id;
                return (
                    <g 
                        key={mode.id} 
                        onClick={() => onSelectMode(mode.id)}
                        onMouseEnter={() => setHoveredMode(mode.id)}
                        onMouseLeave={() => setHoveredMode(null)}
                        className="cursor-pointer transition-all duration-300"
                    >
                        <path
                            d={describeArc(center, center, radius, mode.startAngle, mode.endAngle)}
                            fill={`url(#${mode.gradientId})`}
                            stroke={isHovered ? "white" : "rgba(255,255,255,0.2)"}
                            strokeWidth={isHovered ? "3" : "0.5"}
                            className="transition-all duration-300"
                            style={{ opacity: isHovered ? 1 : 0.8 }}
                            filter={isHovered ? "url(#glow)" : ""}
                        />
                    </g>
                );
            })}
        </g>

        <g className="pointer-events-none">
            {modes.map((mode) => {
                const isHovered = hoveredMode === mode.id;
                const midAngle = (mode.startAngle + mode.endAngle) / 2;
                // Move labels slightly more outward for better spacing in center hub
                const labelPos = polarToCartesian(center, center, radius * 0.65, midAngle);
                
                let textRotation = midAngle;
                if (textRotation > 90 && textRotation < 270) {
                    textRotation += 180;
                }

                return (
                    <text 
                        key={mode.id}
                        x={labelPos.x} 
                        y={labelPos.y} 
                        dy=".35em"
                        textAnchor="middle" 
                        fill={isHovered ? "#ffffff" : "rgba(255,255,255,0.9)"}
                        className="text-[12px] sm:text-[13px] font-black tracking-[0.1em] transition-all duration-300 select-none"
                        style={{ 
                          textShadow: '0 2px 8px rgba(0,0,0,1)',
                          transformOrigin: `${labelPos.x}px ${labelPos.y}px`,
                          transform: `rotate(${textRotation}deg) scale(${isHovered ? 1.15 : 1})`
                        }}
                    >
                        {mode.label}
                    </text>
                );
            })}
        </g>

        <g style={{ transform: `rotate(${rotation}deg)`, transformOrigin: `${center}px ${center}px`, transition: 'transform 1.2s cubic-bezier(0.34, 1.56, 0.64, 1)' }}>
             <path d={`M ${center} ${center + 15} L ${center - 5} ${center} L ${center + 5} ${center} Z`} fill="#475569" />
             <path d={`M ${center - 1} ${center} L ${center + 1} ${center} L ${center + 0.5} ${center - 160} L ${center - 0.5} ${center - 160} Z`} fill="white" />
             <circle cx={center} cy={center - 150} r="3.5" fill={hoveredMode ? activeModeData?.colors[1] : "#fff"} filter="url(#glow)" />
        </g>

        <circle cx={center} cy={center} r="48" fill="rgba(20, 20, 20, 0.95)" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
        <circle cx={center} cy={center} r="42" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1" strokeDasharray="2 4" />
        <circle cx={center} cy={center} r="5" fill="white" className="animate-pulse" />
      </svg>
    </div>
  );
};

export default Compass;