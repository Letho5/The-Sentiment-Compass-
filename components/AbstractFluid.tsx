
import React from 'react';
import { motion } from 'framer-motion';
import { COLORS } from '../constants';

interface AbstractFluidProps {
  summary: {
    positiveCount: number;
    negativeCount: number;
    neutralCount: number;
    total: number;
  };
}

const AbstractFluid: React.FC<AbstractFluidProps> = ({ summary }) => {
  const { positiveCount = 0, negativeCount = 0, neutralCount = 0, total = 0 } = summary;
  
  const safeTotal = total || 1;
  const posRatio = positiveCount / safeTotal;
  const negRatio = negativeCount / safeTotal;
  const neuRatio = neutralCount / safeTotal;

  const blobVariants = (ratio: number, baseSize: number, color: string) => ({
    animate: {
      r: [baseSize * (0.85 + ratio * 0.4), baseSize * (1.15 + ratio * 0.2), baseSize * (0.85 + ratio * 0.4)],
      cx: [100, 100 + (ratio * 25), 100 - (ratio * 25), 100],
      cy: [100, 100 - (ratio * 25), 100 + (ratio * 25), 100],
      fill: [color, color, color]
    },
    transition: {
      duration: 5 + (1 - ratio) * 5,
      repeat: Infinity,
      ease: "easeInOut"
    }
  });

  const getPercent = (count: number) => total > 0 ? Math.round((count / total) * 100) : 0;

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center gap-14 p-12">
      <div className="relative w-72 h-72 shrink-0">
        <svg viewBox="0 0 200 200" className="w-full h-full filter drop-shadow-[0_20px_40px_rgba(139,92,246,0.3)]">
          <defs>
            <filter id="glass-goo">
              <feGaussianBlur in="SourceGraphic" stdDeviation="12" result="blur" />
              <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -11" result="goo" />
              <feComposite in="SourceGraphic" in2="goo" operator="atop" />
            </filter>
            <radialGradient id="compass-glow-core">
              <stop offset="0%" stopColor="white" stopOpacity="0.9" />
              <stop offset="60%" stopColor="#8B5CF6" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="positive-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={COLORS.positive} stopOpacity="0.8" />
              <stop offset="100%" stopColor="#34D399" stopOpacity="0.4" />
            </linearGradient>
            <linearGradient id="negative-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={COLORS.negative} stopOpacity="0.8" />
              <stop offset="100%" stopColor="#F87171" stopOpacity="0.4" />
            </linearGradient>
          </defs>
          
          <g filter="url(#glass-goo)">
            {/* Ambient Pulse Base */}
            <motion.circle
              cx="100" cy="100" r="90"
              fill="white"
              className="opacity-[0.05]"
              animate={{ scale: [0.92, 1.08, 0.92] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            />

            {/* Signal Layers */}
            <motion.circle
              fill={COLORS.neutral}
              className="opacity-30"
              {...blobVariants(neuRatio, 70, COLORS.neutral)}
            />
            
            <motion.circle
              fill="url(#positive-grad)"
              className="opacity-50"
              {...blobVariants(posRatio, 60, COLORS.positive)}
              transition={{ ...blobVariants(posRatio, 60, COLORS.positive).transition, delay: 0.6 }}
            />
            
            <motion.circle
              fill="url(#negative-grad)"
              className="opacity-40"
              {...blobVariants(negRatio, 55, COLORS.negative)}
              transition={{ ...blobVariants(negRatio, 55, COLORS.negative).transition, delay: 1.2 }}
            />
          </g>
          
          <circle cx="100" cy="100" r="15" fill="url(#compass-glow-core)" className="opacity-90" />
        </svg>
      </div>

      <div className="flex flex-col gap-6 w-full max-w-[260px]">
        <h5 className="text-[11px] font-black uppercase tracking-[0.5em] text-slate-400 mb-2 border-b border-white/30 pb-4 text-center">
          Sentiment Average
        </h5>
        
        <SentimentBar label="Positive" percent={getPercent(positiveCount)} color={COLORS.positive} />
        <SentimentBar label="Neutral" percent={getPercent(neutralCount)} color={COLORS.neutral} />
        <SentimentBar label="Negative" percent={getPercent(negativeCount)} color={COLORS.negative} />
      </div>
    </div>
  );
};

const SentimentBar = ({ label, percent, color }: { label: string, percent: number, color: string }) => (
  <div className="flex items-center justify-between group">
    <div className="flex items-center gap-5">
      <div className="w-3 h-3 rounded-full shadow-[0_0_15px_0_rgba(0,0,0,0.1)]" style={{ backgroundColor: color }} />
      <span className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-700">{label}</span>
    </div>
    <div className="flex items-center gap-4">
       <span className="text-sm font-black text-slate-900">{percent}%</span>
       <div className="w-20 h-2 bg-slate-100/50 rounded-full overflow-hidden shadow-inner border border-white/20">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${percent}%` }}
            className="h-full rounded-full"
            style={{ backgroundColor: color }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />
       </div>
    </div>
  </div>
);

export default AbstractFluid;
