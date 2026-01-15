
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { UnifiedAnalysis } from '../types';
import { Globe, Zap, MessageSquare, Info, Target } from 'lucide-react';

interface SubtextSpotlightProps {
  analysis: UnifiedAnalysis;
}

const SubtextSpotlight: React.FC<SubtextSpotlightProps> = ({ analysis }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="relative p-12 bg-slate-900 rounded-[3.5rem] overflow-hidden min-h-[450px] flex flex-col items-center justify-center cursor-default transition-all duration-700 group shadow-2xl"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-[#C8A2C8]/30 via-transparent to-transparent opacity-60 pointer-events-none" />
      
      <div className="relative z-10 text-center w-full max-w-4xl">
        <div className="mb-10 flex flex-wrap justify-center gap-4">
          <span className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border ${
            analysis.sentiment === 'Positive' ? 'bg-green-500/10 border-green-500/30 text-green-400' :
            analysis.sentiment === 'Negative' ? 'bg-red-500/10 border-red-500/30 text-red-400' :
            'bg-slate-500/10 border-slate-500/30 text-slate-400'
          }`}>
            {analysis.sentiment} Signal • {(analysis.confidence_score * 100).toFixed(0)}% Confidence
          </span>
          {analysis.code_switched && (
            <span className="px-6 py-2 rounded-full bg-orange-500/10 border border-orange-500/30 text-[10px] font-black text-orange-400 uppercase tracking-widest flex items-center gap-2">
              <Zap className="w-3.5 h-3.5" /> Code-Switched
            </span>
          )}
        </div>
        
        <p className={`text-3xl md:text-5xl leading-tight transition-all duration-700 font-light mb-12 italic ${isHovered ? 'text-white/40' : 'text-white'}`}>
          "{analysis.text}"
        </p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isHovered ? 1 : 0.95, y: isHovered ? 0 : 5 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-left"
        >
          {/* Why? Explanation */}
          <div className="p-8 bg-white/5 backdrop-blur-2xl rounded-[2.5rem] border border-white/10 shadow-inner flex flex-col">
            <h5 className="text-[10px] font-black uppercase tracking-[0.4em] text-[#C8A2C8] mb-4 flex items-center gap-2">
              <Info className="w-3.5 h-3.5" /> Why this classification?
            </h5>
            <p className="text-white/80 text-xs leading-relaxed font-light italic flex-1">
              {analysis.explanation}
            </p>
          </div>

          {/* Keyword Drivers */}
          <div className="p-8 bg-white/5 backdrop-blur-2xl rounded-[2.5rem] border border-white/10 shadow-inner">
            <h5 className="text-[10px] font-black uppercase tracking-[0.4em] text-[#71F6D2] mb-4 flex items-center gap-2">
              <Target className="w-3.5 h-3.5" /> Sentiment Drivers
            </h5>
            <div className="flex flex-wrap gap-2">
              {analysis.key_emotive_phrases.map((phrase, i) => (
                <span key={i} className="px-3 py-1 bg-white/10 rounded-lg text-[10px] text-white/90 font-bold uppercase tracking-widest">
                  {phrase}
                </span>
              ))}
            </div>
          </div>
          
          {/* Business Insight */}
          <div className="p-8 bg-white/5 backdrop-blur-2xl rounded-[2.5rem] border border-white/10 shadow-inner">
            <h5 className="text-[10px] font-black uppercase tracking-[0.4em] text-[#F5A3E0] mb-4 flex items-center gap-2">
              <MessageSquare className="w-3.5 h-3.5" /> Brand Impact
            </h5>
            <p className="text-white/90 text-sm leading-relaxed font-light">
              {analysis.business_insight}
            </p>
          </div>
        </motion.div>
      </div>

      <div className="absolute bottom-10 right-12 text-white/10 text-[11px] uppercase font-black tracking-[0.5em] pointer-events-none">
        Mzansi Master Intelligence
      </div>
    </div>
  );
};

export default SubtextSpotlight;
