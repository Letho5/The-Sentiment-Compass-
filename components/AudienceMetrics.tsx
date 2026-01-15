
import React from 'react';
import { motion } from 'framer-motion';
import { UnifiedAnalysis } from '../types';
import { Share2, BarChart3, Activity } from 'lucide-react';

interface AudienceMetricsProps {
  results: UnifiedAnalysis[];
}

const AudienceMetrics: React.FC<AudienceMetricsProps> = ({ results }) => {
  const total = results.length || 1;

  // 1. Age Distribution
  const ageRanges = ['18-24', '25-34', '35-44', '45-54', '55+'];
  const ageMap = results.reduce((acc, curr) => {
    acc[curr.author_age] = (acc[curr.author_age] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const ageData = ageRanges.map(range => ({ range, val: Math.round(((ageMap[range] || 0) / total) * 100) }));
  const maxAgeVal = Math.max(...ageData.map(a => a.val), 1);

  // 2. Source Distribution
  const sourceColors: Record<string, string> = {
    'Manual': '#C8A2C8',
    'X': '#0F1419',
    'Facebook': '#1877F2',
    'Instagram': '#E4405F',
    'TikTok': '#000000',
    'Reddit': '#FF4500',
    'Web': '#0DACF1',
    'News/Blogs': '#71F6D2',
    'Video': '#F5A3E0'
  };
  const sourceMap = results.reduce((acc, curr) => {
    acc[curr.source] = (acc[curr.source] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const sourceData = Object.entries(sourceMap).map(([label, count]) => ({
    label,
    percent: Math.round((Number(count) / total) * 100),
    color: sourceColors[label] || '#CBD5E1'
  })).sort((a, b) => b.percent - a.percent);

  // 3. Reach Trend (Area Chart)
  const points = results.length < 5 
    ? [0, 20, 45, 30, 80] 
    : results.slice(-10).map((r) => (Number(r.confidence_score) * 100));

  const getPath = (vals: number[]) => {
    const width = 400;
    const height = 100;
    const step = width / (vals.length - 1);
    return vals.reduce((acc, v, i) => {
      const x = i * step;
      const y = height - (v / 100) * height;
      return acc + `${i === 0 ? 'M' : 'L'} ${x} ${y} `;
    }, '');
  };

  const donutCircum = 2 * Math.PI * 35;

  return (
    <div className="space-y-8">
      {/* Top Row: Reach Intelligence */}
      <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-xl">
              <Activity className="w-4 h-4 text-[#0DACF1]" />
            </div>
            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Integrated Reach Intelligence</h4>
          </div>
          <div className="text-right">
            <span className="text-2xl font-black text-slate-800">{results.length}</span>
            <span className="text-[10px] font-bold text-green-500 ml-2">Total Signals</span>
          </div>
        </div>
        <div className="h-48 w-full relative">
          <svg viewBox="0 0 400 100" className="w-full h-full overflow-visible" preserveAspectRatio="none">
            <defs>
              <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0DACF1" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#0DACF1" stopOpacity="0" />
              </linearGradient>
            </defs>
            <motion.path
              d={results.length > 0 ? getPath(points) + " L 400 100 L 0 100 Z" : ""}
              fill="url(#areaGradient)"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            />
            <motion.path
              d={results.length > 0 ? getPath(points) : ""}
              fill="none"
              stroke="#0DACF1"
              strokeWidth="3"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
            />
          </svg>
          <div className="flex justify-between mt-4 text-[8px] font-bold text-slate-300 uppercase tracking-widest">
            <span>Historical baseline</span>
            <span>Signal Flux</span>
            <span>Live Insight</span>
          </div>
        </div>
      </div>

      {/* Bottom Row: Age and Sources */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <MetricCard title="Author Age Distribution" icon={BarChart3}>
          <div className="flex items-end justify-between h-32 gap-3 pb-2">
            {ageData.map((a) => (
              <div key={a.range} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${(a.val / maxAgeVal) * 100}%` }}
                  className="w-full bg-[#0DACF1] rounded-t-lg relative group min-h-[2px]"
                >
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[8px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20">
                    {a.val}%
                  </div>
                </motion.div>
                <span className="text-[8px] font-bold text-slate-400 uppercase whitespace-nowrap">{a.range}</span>
              </div>
            ))}
          </div>
        </MetricCard>

        <MetricCard title="Traffic Sources Distribution" icon={Share2}>
          <div className="flex items-center gap-6 h-full justify-center">
            <div className="relative w-28 h-28">
              <svg viewBox="0 0 100 100" className="transform -rotate-90">
                <circle cx="50" cy="50" r="35" fill="none" stroke="#f1f5f9" strokeWidth="12" />
                {sourceData.map((s, i) => {
                  const offset = sourceData.slice(0, i).reduce((sum, curr: any) => sum + Number(curr.percent), 0);
                  return (
                    <motion.circle
                      key={s.label}
                      cx="50" cy="50" r="35" fill="none" stroke={s.color} strokeWidth="12"
                      strokeDasharray={`${(Number(s.percent) / 100) * donutCircum} ${donutCircum}`}
                      strokeDashoffset={-(offset / 100) * donutCircum}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    />
                  );
                })}
              </svg>
            </div>
            <div className="flex-1 space-y-1">
              {sourceData.slice(0, 4).map(s => (
                <LegendRow key={s.label} color={s.color} label={s.label} val={`${s.percent}%`} />
              ))}
              {sourceData.length > 4 && (
                <div className="text-[7px] text-slate-300 uppercase font-bold pl-4">+{sourceData.length - 4} More Channels</div>
              )}
            </div>
          </div>
        </MetricCard>
      </div>
    </div>
  );
};

const MetricCard = ({ title, children, icon: Icon }: any) => (
  <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex items-center gap-3 mb-6">
      <div className="p-2 bg-slate-50 rounded-xl">
        <Icon className="w-4 h-4 text-[#0DACF1]" />
      </div>
      <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">{title}</h4>
    </div>
    <div className="h-32">
      {children}
    </div>
  </div>
);

const LegendRow: React.FC<{ color: string; label: string; val: string }> = ({ color, label, val }) => (
  <div className="flex items-center justify-between gap-4">
    <div className="flex items-center gap-2 overflow-hidden">
      <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: color }} />
      <span className="text-[9px] font-bold text-slate-500 uppercase tracking-tighter truncate">{label}</span>
    </div>
    <span className="text-[9px] font-black text-slate-800 shrink-0">{val}</span>
  </div>
);

export default AudienceMetrics;
