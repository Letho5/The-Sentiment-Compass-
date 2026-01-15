
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, ShoppingCart, Video, Image as ImageIcon, Copy, 
  CheckCircle2, Monitor, Layout, PlayCircle
} from 'lucide-react';
import { AnalysisResult } from '../types';

interface OutputPanelProps {
  result: AnalysisResult;
}

const OutputPanel: React.FC<OutputPanelProps> = ({ result }) => {
  const [activeTab, setActiveTab] = useState<'social' | 'marketplace' | 'video' | 'images'>('social');
  const [copied, setCopied] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const tabs = [
    { id: 'social', label: 'Social Ad', icon: Monitor },
    { id: 'marketplace', label: 'Listing', icon: ShoppingCart },
    { id: 'video', label: 'TikTok Script', icon: Video },
    { id: 'images', label: 'Gallery', icon: ImageIcon },
  ];

  return (
    <div className="bg-white rounded-[3rem] shadow-xl border border-slate-100 overflow-hidden min-h-[600px]">
      <div className="flex border-b border-slate-50 bg-slate-50/30">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 py-6 flex flex-col items-center gap-2 transition-all relative ${
              activeTab === tab.id ? 'text-[#0DACF1]' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <tab.icon className="w-5 h-5" />
            <span className="text-[10px] font-bold uppercase tracking-widest">{tab.label}</span>
            {activeTab === tab.id && (
              <motion.div 
                layoutId="activeTab" 
                className="absolute bottom-0 left-0 w-full h-1 bg-[#0DACF1]" 
              />
            )}
          </button>
        ))}
      </div>

      <div className="p-8 lg:p-12">
        <AnimatePresence mode="wait">
          {activeTab === 'social' && result.adCopy && (
            <motion.div
              key="social"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-8"
            >
              <div className="p-8 bg-slate-50 rounded-[2rem] relative border border-slate-100 group">
                <button 
                  onClick={() => handleCopy(result.adCopy!.primaryText, 'primary')}
                  className="absolute top-6 right-6 p-2 bg-white rounded-lg border border-slate-200 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  {copied === 'primary' ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                </button>
                <h4 className="text-[10px] font-black uppercase tracking-widest text-[#0DACF1] mb-4">Primary Ad Text</h4>
                <p className="text-lg text-slate-700 leading-relaxed italic">"{result.adCopy.primaryText}"</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100 relative group">
                  <button 
                    onClick={() => handleCopy(result.adCopy!.headline, 'headline')}
                    className="absolute top-6 right-6 p-2 bg-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    {copied === 'headline' ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                  </button>
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-[#F5A3E0] mb-2">Headline</h4>
                  <p className="text-xl font-black text-slate-900 leading-tight">{result.adCopy.headline}</p>
                </div>
                <div className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100 relative group">
                  <button 
                    onClick={() => handleCopy(result.adCopy!.cta, 'cta')}
                    className="absolute top-6 right-6 p-2 bg-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    {copied === 'cta' ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                  </button>
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-[#71F6D2] mb-2">Call to Action</h4>
                  <p className="text-xl font-bold text-[#0DACF1]">{result.adCopy.cta}</p>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'marketplace' && result.marketplaceListing && (
            <motion.div
              key="listing"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-8"
            >
              <div className="space-y-4">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">SEO Product Title</h4>
                <h3 className="text-2xl font-black text-slate-900 leading-snug">{result.marketplaceListing.title}</h3>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="space-y-6">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-[#0DACF1]">Bullet Highlights</h4>
                  <ul className="space-y-4">
                    {result.marketplaceListing.bulletPoints.map((bp, i) => (
                      <li key={i} className="flex gap-4 items-start">
                        <CheckCircle2 className="w-5 h-5 text-[#71F6D2] shrink-0 mt-1" />
                        <span className="text-slate-600 font-medium leading-relaxed">{bp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="space-y-6">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-[#F5A3E0]">Full Description</h4>
                  <p className="text-slate-500 text-sm leading-relaxed whitespace-pre-wrap">{result.marketplaceListing.description}</p>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'video' && result.tiktokScript && (
            <motion.div
              key="video"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-10"
            >
              <div className="grid grid-cols-3 gap-6">
                {['Hook', 'Body', 'CTA'].map((part) => (
                  <div key={part} className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                    <h5 className="text-[10px] font-bold text-slate-400 uppercase mb-2">{part}</h5>
                    <p className="text-xs text-slate-700 leading-relaxed">
                      {(result.tiktokScript as any)[part.toLowerCase()]}
                    </p>
                  </div>
                ))}
              </div>

              <div className="space-y-6">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Scene Storyboard</h4>
                <div className="space-y-4">
                  {result.tiktokScript.storyboard.map((scene, i) => (
                    <div key={i} className="flex gap-6 p-6 bg-white border border-slate-100 rounded-[2rem] shadow-sm items-center">
                      <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-black shrink-0">
                        {i + 1}
                      </div>
                      <div className="flex-1">
                        <h6 className="font-black text-slate-900 text-sm mb-1 uppercase">{scene.scene}</h6>
                        <p className="text-xs text-slate-500 mb-2 italic">Action: {scene.action}</p>
                        <div className="flex items-center gap-2 p-2 bg-[#71F6D2]/10 rounded-xl text-[10px] font-bold text-[#0895d4]">
                          <PlayCircle className="w-3 h-3" /> Visual: {scene.visualPrompt}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'images' && (
            <motion.div
              key="images"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {result.imageUrls.map((url, i) => (
                  <div key={i} className="group relative overflow-hidden rounded-[2.5rem] bg-slate-100 aspect-square shadow-lg">
                    <img src={url} alt={`Generated visual ${i}`} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button 
                        onClick={() => {
                          const link = document.createElement('a');
                          link.href = url;
                          link.download = `deepa_gen_${i}.png`;
                          link.click();
                        }}
                        className="bg-white text-slate-900 p-4 rounded-full shadow-xl active:scale-90 transition-transform"
                      >
                        <DownloadIcon className="w-6 h-6" />
                      </button>
                    </div>
                  </div>
                ))}
                {result.imageUrls.length === 0 && (
                  <div className="col-span-3 py-20 text-center text-slate-400">
                    <ImageIcon className="w-12 h-12 mx-auto mb-4 opacity-20" />
                    <p>No images generated for this session</p>
                  </div>
                )}
              </div>
              
              <div className="mt-12 p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-[#0DACF1] mb-6">AI Art Direction Prompts</h4>
                <div className="space-y-4">
                  {result.imagePrompts.slice(0, 3).map((p, i) => (
                    <div key={i} className="flex gap-4 items-start text-xs text-slate-500 group">
                      <span className="font-bold text-[#F5A3E0] mt-0.5">{i+1}.</span>
                      <p className="flex-1 leading-relaxed group-hover:text-slate-700 transition-colors">{p}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

const DownloadIcon = ({ className }: { className: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);

export default OutputPanel;
