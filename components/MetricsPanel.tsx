import React from 'react';
import { TrendingUp, Clock, Layout } from 'lucide-react';
import { BatchSummary } from '../types';

interface MetricsPanelProps {
  summary: BatchSummary;
}

const MetricsPanel: React.FC<MetricsPanelProps> = ({ summary }) => {
  return (
    <div className="bg-white/80 backdrop-blur-xl p-8 rounded-[2.5rem] border border-slate-100 shadow-xl">
      <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6">Session Performance</h4>
      
      <div className="space-y-6">
        <div className="flex items-center gap-6">
          <div className="w-12 h-12 rounded-2xl bg-[#0DACF1]/10 flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-[#0DACF1]" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900 font-heading leading-none">{summary.total}</div>
            <div className="text-[10px] uppercase font-bold text-slate-400 mt-1">Total Assets</div>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="w-12 h-12 rounded-2xl bg-[#71F6D2]/10 flex items-center justify-center">
            <Clock className="w-6 h-6 text-[#14b18c]" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900 font-heading leading-none">
              {(summary.durationAvg / 1000).toFixed(1)}s
            </div>
            <div className="text-[10px] uppercase font-bold text-slate-400 mt-1">Avg Generation</div>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-100">
          <h5 className="text-[10px] font-bold text-slate-400 uppercase mb-4">Platform Mix</h5>
          <div className="space-y-2">
            {Object.entries(summary.platformCounts).map(([platform, count]) => (
              <div key={platform} className="flex items-center justify-between group">
                <span className="text-xs font-medium text-slate-600 group-hover:text-[#0DACF1] transition-colors">{platform}</span>
                <span className="text-xs font-black text-slate-900">
                  {/* Fix: Explicitly cast count to number to resolve TypeScript arithmetic operation error */}
                  {summary.total > 0 ? Math.round(((count as number) / summary.total) * 100) : 0}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MetricsPanel;