
import React from 'react';
import { motion } from 'framer-motion';
import { COLORS } from '../constants';

interface PieChartProps {
  data: {
    positiveCount: number;
    negativeCount: number;
    neutralCount: number;
    total: number;
  };
}

const SentimentPieChart: React.FC<PieChartProps> = ({ data }) => {
  const { positiveCount, negativeCount, neutralCount, total } = data;

  const radius = 70;
  const circum = 2 * Math.PI * radius;

  const getStroke = (count: number) => (total === 0 ? 0 : (count / total) * circum);

  return (
    <div className="w-full bg-white/40 backdrop-blur-2xl p-10 rounded-[3.5rem] border border-white/60 shadow-xl flex flex-col items-center">
      <div className="relative w-56 h-56 mb-8">
        <svg viewBox="0 0 200 200" className="transform -rotate-90 w-full h-full">
          {/* Base Track */}
          <circle cx="100" cy="100" r={radius} fill="transparent" stroke="#f1f5f9" strokeWidth="22" />
          
          {/* Positive Segment */}
          <motion.circle
            cx="100" cy="100" r={radius} fill="transparent" stroke={COLORS.positive} strokeWidth="22"
            strokeDasharray={`${getStroke(positiveCount)} ${circum}`}
            initial={{ strokeDashoffset: circum }}
            animate={{ strokeDashoffset: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            strokeLinecap="round"
          />
          
          {/* Negative Segment */}
          <motion.circle
            cx="100" cy="100" r={radius} fill="transparent" stroke={COLORS.negative} strokeWidth="22"
            strokeDasharray={`${getStroke(negativeCount)} ${circum}`}
            strokeDashoffset={-getStroke(positiveCount)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            strokeLinecap="round"
          />

          {/* Neutral Segment */}
          <motion.circle
            cx="100" cy="100" r={radius} fill="transparent" stroke={COLORS.neutral} strokeWidth="22"
            strokeDasharray={`${getStroke(neutralCount)} ${circum}`}
            strokeDashoffset={-(getStroke(positiveCount) + getStroke(negativeCount))}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            strokeLinecap="round"
          />
        </svg>
        
        {/* Fixed: Removed rotate-90 to ensure text is upright */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-black text-slate-800 tracking-tighter">{total}</span>
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.3em]">Audits</span>
        </div>
      </div>

      {/* Changed: Switched to flex-col for a vertical layout as requested */}
      <div className="flex flex-col gap-4 w-full px-4">
        <LegendItem color="bg-[#90EE90]" label="Positive Signals" val={positiveCount} />
        <LegendItem color="bg-[#F08080]" label="Negative Signals" val={negativeCount} />
        <LegendItem color="bg-[#CBD5E1]" label="Neutral Signals" val={neutralCount} />
      </div>
    </div>
  );
};

const LegendItem = ({ color, label, val }: any) => (
  <div className="flex items-center justify-between gap-4 p-3 bg-white/50 rounded-2xl border border-white/40">
    <div className="flex items-center gap-3">
      <div className={`w-2.5 h-2.5 rounded-full ${color}`} />
      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</span>
    </div>
    <span className="text-sm font-black text-slate-700">{val}</span>
  </div>
);

export default SentimentPieChart;
