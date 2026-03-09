import React from 'react';
import { motion } from 'motion/react';

const StaticCompass: React.FC<{ className?: string }> = ({ className }) => {
  const size = 500;
  const center = size / 2;
  const radius = 185;
  const bezelRadius = 225;

  return (
    <motion.div 
      animate={{ 
        scale: [1, 1.03, 1],
        opacity: [0.8, 1, 0.8]
      }}
      transition={{ 
        duration: 4, 
        repeat: Infinity, 
        ease: "easeInOut" 
      }}
      className={`relative w-full max-w-[120px] aspect-square flex items-center justify-center rounded-full ${className} select-none mx-auto`}
    >
      <div className="absolute inset-0 rounded-full blur-[40px] opacity-30 bg-brand-green/20 pointer-events-none"></div>
      <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-full drop-shadow-lg z-10 overflow-visible">
        <defs>
          <linearGradient id="metal-bezel-static" x1="0%" y1="0%" x2="100%" y2="100%">
             <stop offset="0%" stopColor="#64748b" />
             <stop offset="50%" stopColor="#cbd5e1" />
             <stop offset="100%" stopColor="#334155" />
          </linearGradient>
          <radialGradient id="static-grad" cx="50%" cy="50%" r="75%">
              <stop offset="0%" stopColor="#34d399" stopOpacity="1" />
              <stop offset="100%" stopColor="#059669" stopOpacity="0.95" />
          </radialGradient>
        </defs>

        <circle cx={center} cy={center} r={bezelRadius + 10} fill="#000000" />
        <circle cx={center} cy={center} r={bezelRadius} fill="none" stroke="url(#metal-bezel-static)" strokeWidth="10" opacity="0.3" />

        <g opacity="0.4">
          {Array.from({ length: 60 }).map((_, i) => {
            const angle = i * 6;
            const isMajor = i % 10 === 0;
            const rStart = isMajor ? radius + 5 : radius + 12;
            const rEnd = radius + 25;
            const angleInRadians = (angle - 90) * Math.PI / 180.0;
            const startX = center + (rStart * Math.cos(angleInRadians));
            const startY = center + (rStart * Math.sin(angleInRadians));
            const endX = center + (rEnd * Math.cos(angleInRadians));
            const endY = center + (rEnd * Math.sin(angleInRadians));
            return (
              <line
                key={i}
                x1={startX} y1={startY}
                x2={endX} y2={endY}
                stroke={isMajor ? "#ffffff" : "rgba(255,255,255,0.3)"}
                strokeWidth={isMajor ? 3 : 1}
              />
            );
          })}
        </g>

        <circle cx={center} cy={center} r={radius} fill="url(#static-grad)" opacity="0.8" />
        
        <g transform={`rotate(45 ${center} ${center})`}>
             <path d={`M ${center} ${center + 15} L ${center - 5} ${center} L ${center + 5} ${center} Z`} fill="#475569" />
             <path d={`M ${center - 1} ${center} L ${center + 1} ${center} L ${center + 0.5} ${center - 160} L ${center - 0.5} ${center - 160} Z`} fill="white" />
             <circle cx={center} cy={center - 150} r="3.5" fill="#fff" />
        </g>

        <circle cx={center} cy={center} r="48" fill="rgba(20, 20, 20, 0.95)" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
        <circle cx={center} cy={center} r="5" fill="white" />
      </svg>
    </motion.div>
  );
};

export default StaticCompass;
