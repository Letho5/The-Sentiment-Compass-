
import React from 'react';
import { motion } from 'framer-motion';
import { COLORS } from '../constants';
import { UnifiedAnalysis } from '../types';

interface TrendLineProps {
  data: UnifiedAnalysis[];
}

const SentimentTrendLine: React.FC<TrendLineProps> = ({ data }) => {
  // Map sentiments to numeric values for graphing
  const getVal = (s: string) => s === 'Positive' ? 100 : s === 'Negative' ? 0 : 50;
  
  // Need at least 2 points to draw a meaningful line
  const points = [...data].reverse().map((d, i) => ({
    x: i,
    y: getVal(d.sentiment)
  }));

  if (points.length < 2) {
    return (
      <div className="h-48 w-full flex items-center justify-center text-slate-300 italic text-xs">
        Additional signals required for Trend Analysis...
      </div>
    );
  }

  const width = 1000;
  const height = 150;
  const padding = 20;

  const getX = (i: number) => (i / (points.length - 1)) * (width - padding * 2) + padding;
  const getY = (v: number) => height - (v / 100) * (height - padding * 2) - padding;

  const pathData = points.reduce((acc, p, i) => {
    return acc + `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(p.y)} `;
  }, '');

  return (
    <div className="w-full bg-white/40 backdrop-blur-xl p-10 rounded-[3.5rem] border border-white/60 shadow-xl overflow-hidden">
      <div className="flex justify-between items-center mb-6">
        <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Trend Analysis</h4>
        <div className="flex gap-4">
           <div className="flex items-center gap-2">
             <div className="w-2 h-0.5 bg-[#90EE90]" />
             <span className="text-[8px] font-bold text-slate-400 uppercase">High</span>
           </div>
           <div className="flex items-center gap-2">
             <div className="w-2 h-0.5 bg-[#F08080]" />
             <span className="text-[8px] font-bold text-slate-400 uppercase">Low</span>
           </div>
        </div>
      </div>
      
      <div className="relative h-40 w-full">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
          {/* Grid Lines */}
          <line x1={padding} y1={getY(100)} x2={width-padding} y2={getY(100)} stroke="#f1f5f9" strokeDasharray="5,5" />
          <line x1={padding} y1={getY(50)} x2={width-padding} y2={getY(50)} stroke="#f1f5f9" strokeDasharray="5,5" />
          <line x1={padding} y1={getY(0)} x2={width-padding} y2={getY(0)} stroke="#f1f5f9" strokeDasharray="5,5" />

          {/* Data Path */}
          <motion.path
            d={pathData}
            fill="none"
            stroke={COLORS.lilac}
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          />

          {/* Data Points */}
          {points.map((p, i) => (
            <motion.circle
              key={i}
              cx={getX(i)}
              cy={getY(p.y)}
              r="6"
              fill="white"
              stroke={p.y === 100 ? COLORS.positive : p.y === 0 ? COLORS.negative : COLORS.neutral}
              strokeWidth="3"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: i * 0.1 }}
            />
          ))}
        </svg>
      </div>
    </div>
  );
};

export default SentimentTrendLine;
