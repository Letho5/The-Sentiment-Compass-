
import React, { useState } from 'react';
import { Sparkles, AlertCircle, ShoppingBag, Target, Palette, Zap } from 'lucide-react';
import { ProductData, Platform, Tone, VisualStyle } from '../types';

interface InputPanelProps {
  onGenerate: (data: ProductData) => void;
  isAnalyzing: boolean;
  error: string | null;
}

const InputPanel: React.FC<InputPanelProps> = ({ onGenerate, isAnalyzing, error }) => {
  const [formData, setFormData] = useState<ProductData>({
    productName: '',
    shortDescription: '',
    keyFeatures: '',
    targetAudience: '',
    platform: Platform.FACEBOOK,
    tone: Tone.PROFESSIONAL,
    visualStyle: VisualStyle.REALISTIC,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.productName || !formData.shortDescription) return;
    onGenerate(formData);
  };

  return (
    <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] border border-slate-100 shadow-2xl p-8 lg:p-10">
      <div className="flex items-center gap-4 mb-8">
        <div className="bg-[#71F6D2] p-3 rounded-2xl">
          <Sparkles className="w-6 h-6 text-slate-900" />
        </div>
        <div>
          <h3 className="text-xl font-black text-slate-900 font-heading">Input Center</h3>
          <p className="text-sm text-slate-500">Define your product essence</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-black text-slate-400 mb-2">
            <ShoppingBag className="w-3 h-3" /> Product Identity
          </label>
          <input
            value={formData.productName}
            onChange={e => setFormData(p => ({ ...p, productName: e.target.value }))}
            placeholder="e.g. Lumos Desk Lamp"
            className="w-full bg-slate-50/50 border border-slate-100 rounded-2xl px-6 py-4 outline-none focus:ring-2 ring-[#71F6D2]/20 transition-all text-sm font-medium"
            required
          />
        </div>

        <div>
          <label className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-black text-slate-400 mb-2">
            The Pitch
          </label>
          <textarea
            value={formData.shortDescription}
            onChange={e => setFormData(p => ({ ...p, shortDescription: e.target.value }))}
            placeholder="What makes it special?"
            rows={3}
            className="w-full bg-slate-50/50 border border-slate-100 rounded-2xl px-6 py-4 outline-none focus:ring-2 ring-[#71F6D2]/20 transition-all text-sm no-scrollbar resize-none"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-black text-slate-400 mb-2">
              <Target className="w-3 h-3" /> Audience
            </label>
            <input
              value={formData.targetAudience}
              onChange={e => setFormData(p => ({ ...p, targetAudience: e.target.value }))}
              placeholder="e.g. Gen-Z Students"
              className="w-full bg-slate-50/50 border border-slate-100 rounded-2xl px-4 py-3 outline-none focus:ring-2 ring-[#71F6D2]/20 transition-all text-xs"
            />
          </div>
          <div>
            <label className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-black text-slate-400 mb-2">
              <Zap className="w-3 h-3" /> Tone
            </label>
            <select
              value={formData.tone}
              onChange={e => setFormData(p => ({ ...p, tone: e.target.value as Tone }))}
              className="w-full bg-slate-50/50 border border-slate-100 rounded-2xl px-4 py-3 outline-none focus:ring-2 ring-[#71F6D2]/20 transition-all text-xs appearance-none"
            >
              {Object.values(Tone).map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-black text-slate-400 mb-2">
              Platform
            </label>
            <select
              value={formData.platform}
              onChange={e => setFormData(p => ({ ...p, platform: e.target.value as Platform }))}
              className="w-full bg-slate-50/50 border border-slate-100 rounded-2xl px-4 py-3 outline-none focus:ring-2 ring-[#71F6D2]/20 transition-all text-xs appearance-none"
            >
              {Object.values(Platform).map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <div>
            <label className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-black text-slate-400 mb-2">
              <Palette className="w-3 h-3" /> Visual Style
            </label>
            <select
              value={formData.visualStyle}
              onChange={e => setFormData(p => ({ ...p, visualStyle: e.target.value as VisualStyle }))}
              className="w-full bg-slate-50/50 border border-slate-100 rounded-2xl px-4 py-3 outline-none focus:ring-2 ring-[#71F6D2]/20 transition-all text-xs appearance-none"
            >
              {Object.values(VisualStyle).map(v => <option key={v} value={v}>{v}</option>)}
            </select>
          </div>
        </div>

        {error && (
          <div className="p-4 bg-red-50 text-red-600 rounded-2xl text-xs flex gap-3 items-center">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <p>{error}</p>
          </div>
        )}

        <button
          disabled={isAnalyzing}
          className={`w-full py-5 rounded-2xl font-black uppercase tracking-[0.2em] shadow-lg transition-all active:scale-95 flex items-center justify-center gap-3 ${
            isAnalyzing ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-slate-900 text-white hover:bg-black shadow-slate-200'
          }`}
        >
          {isAnalyzing ? 'Processing...' : (
            <>
              Start Analysis
              <Sparkles className="w-5 h-5 text-[#71F6D2]" />
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default InputPanel;
