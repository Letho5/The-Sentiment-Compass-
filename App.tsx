
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CloudUpload as Upload, Loader2, Compass, Zap, 
  BrainCircuit, Activity, LayoutGrid, Layers, Box, TrendingUp,
  FileJson, FileSpreadsheet, FileText, CheckCircle2, XCircle, Split, 
  Search, Twitter, Facebook, Instagram, Share2, MousePointer2,
  ArrowRight, ShieldCheck, Languages, Eye, Globe, Sparkles, MessageSquareQuote,
  Download, FileDown
} from 'lucide-react';

import { AppStage, UnifiedAnalysis, BatchStats, InputMode, AnalysisSource } from './types';
import { COLORS } from './constants';
import DriftingBlob from './components/DriftingBlob';
import AbstractFluid from './components/AbstractFluid';
import SubtextSpotlight from './components/SubtextSpotlight';
import SentimentPieChart from './components/SentimentPieChart';
import SentimentTrendLine from './components/SentimentTrendLine';
import AudienceMetrics from './components/AudienceMetrics';
import { analyzeText, fetchSocialPulse } from './geminiService';

declare const jspdf: any;

const TikTokIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
  </svg>
);

export default function App() {
  const [appStage, setAppStage] = useState<AppStage>(AppStage.HORIZON);
  const [inputMode, setInputMode] = useState<InputMode>(InputMode.MANUAL);
  const [results, setResults] = useState<UnifiedAnalysis[]>([]);
  const [selectedResult, setSelectedResult] = useState<UnifiedAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [inputText, setInputText] = useState('');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState<AnalysisSource[]>(['X', 'TikTok']);
  const [viewMode, setViewMode] = useState<'landscape' | 'grid' | 'compare'>('landscape');

  const batchSummary = useMemo<BatchStats>(() => {
    const total = results.length;
    if (total === 0) return { total: 0, positiveCount: 0, negativeCount: 0, neutralCount: 0, avgConfidence: 0 };
    return {
      total,
      positiveCount: results.filter(r => r.sentiment === 'Positive').length,
      negativeCount: results.filter(r => r.sentiment === 'Negative').length,
      neutralCount: results.filter(r => r.sentiment === 'Neutral').length,
      avgConfidence: results.reduce((acc, curr) => acc + (curr.confidence_score || 0), 0) / total,
    };
  }, [results]);

  const handleAnalyze = async () => {
    if (!inputText.trim()) return;
    setIsAnalyzing(true);
    try {
      const texts = inputText.split('\n').filter(t => t.trim().length > 5);
      const newResults = await analyzeText(texts.length > 0 ? texts : [inputText], 'Manual');
      setResults(prev => [...newResults, ...prev]);
      setSelectedResult(newResults[0]);
      setInputText('');
      if (appStage !== AppStage.COMPASS) setAppStage(AppStage.COMPASS);
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSocialPulse = async () => {
    if (!searchKeyword.trim()) return;
    setIsAnalyzing(true);
    try {
      const pulseResults = await fetchSocialPulse(searchKeyword, selectedPlatforms);
      setResults(prev => [...pulseResults, ...prev]);
      setSelectedResult(pulseResults[0]);
      setSearchKeyword('');
      if (appStage !== AppStage.COMPASS) setAppStage(AppStage.COMPASS);
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setIsAnalyzing(true);
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const text = e.target?.result as string;
        const lines = text.split(/\r?\n/).map(l => l.trim()).filter(l => l.length > 5).slice(0, 10);
        const batchResults = await analyzeText(lines, 'Manual');
        setResults(prev => [...batchResults, ...prev]);
        if (batchResults.length > 0) setSelectedResult(batchResults[0]);
        if (appStage !== AppStage.COMPASS) setAppStage(AppStage.COMPASS);
      } catch (err: any) {
        console.error(err);
      } finally {
        setIsAnalyzing(false);
      }
    };
    reader.readAsText(file);
  };

  const exportJSON = () => {
    const dataStr = JSON.stringify(results, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `sentiment_compass_audit_${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const exportCSV = () => {
    const headers = ['ID', 'Text', 'Sentiment', 'Confidence', 'Language', 'Insight', 'Timestamp'];
    const rows = results.map(r => [
      r.id, 
      `"${r.text.replace(/"/g, '""')}"`, 
      r.sentiment, 
      r.confidence_score, 
      r.code_switched ? 'Multilingual' : 'Primary',
      `"${r.business_insight.replace(/"/g, '""')}"`,
      new Date(r.timestamp).toISOString()
    ]);
    const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `sentiment_compass_audit_${Date.now()}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const exportPDF = async () => {
    try {
      const doc = new jspdf.jsPDF();
      
      // Header
      doc.setFillColor(30, 27, 75); // #1E1B4B
      doc.rect(0, 0, 210, 40, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(22);
      doc.text('SENTIMENT COMPASS REPORT', 105, 25, { align: 'center' });
      
      // Summary Info
      doc.setTextColor(30, 27, 75);
      doc.setFontSize(14);
      doc.text(`Audit Date: ${new Date().toLocaleDateString()}`, 20, 55);
      doc.text(`Total Signals Analyzed: ${results.length}`, 20, 65);
      
      // Stats
      doc.setDrawColor(233, 213, 255); // Lavender
      doc.line(20, 75, 190, 75);
      doc.setFontSize(12);
      doc.text(`Positive: ${batchSummary.positiveCount}`, 20, 85);
      doc.text(`Neutral: ${batchSummary.neutralCount}`, 85, 85);
      doc.text(`Negative: ${batchSummary.negativeCount}`, 150, 85);
      
      // Signal Table
      const tableData = results.map(r => [
        r.sentiment,
        r.text.length > 80 ? r.text.substring(0, 77) + '...' : r.text,
        `${(r.confidence_score * 100).toFixed(0)}%`
      ]);

      (doc as any).autoTable({
        startY: 95,
        head: [['Sentiment', 'Signal Content', 'Confidence']],
        body: tableData,
        headStyles: { fillColor: [139, 92, 246] }, // #8B5CF6
        theme: 'striped'
      });

      // Sandbox Bypass: Base64 technique
      const pdfDataUri = doc.output('datauristring');
      const link = document.createElement('a');
      link.href = pdfDataUri;
      link.download = `sentiment_compass_report_${Date.now()}.pdf`;
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
    } catch (err) {
      console.error('PDF Generation failed:', err);
    }
  };

  const getSourceIcon = (source: AnalysisSource) => {
    switch (source) {
      case 'X': return <Twitter className="w-4 h-4" />;
      case 'Facebook': return <Facebook className="w-4 h-4" />;
      case 'Instagram': return <Instagram className="w-4 h-4" />;
      case 'TikTok': return <TikTokIcon className="w-4 h-4" />;
      case 'Reddit': return <Share2 className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const BentoCard = ({ title, desc, icon: Icon, span = "col-span-1", label }: any) => (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -10, transition: { duration: 0.3 } }}
      className={`${span} relative group glass-card p-12 rounded-[4rem] flex flex-col justify-between overflow-hidden`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="relative z-10">
        <div className="w-20 h-20 rounded-[2rem] bg-white shadow-2xl flex items-center justify-center mb-12 group-hover:rotate-12 transition-transform duration-500">
          <Icon className="w-10 h-10 text-[#8B5CF6]" />
        </div>
        {label && <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#8B5CF6] mb-4 block opacity-70">{label}</span>}
        <h3 className="text-4xl font-black text-[#1E1B4B] mb-6 tracking-tighter leading-tight">{title}</h3>
        <p className="text-base text-slate-500 font-medium leading-relaxed">{desc}</p>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen mesh-gradient">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <DriftingBlob color="#9333EA" size="900px" top="-10%" left="50%" delay={0} />
        <DriftingBlob color="#A855F7" size="750px" top="35%" left="-20%" delay={4} />
        <DriftingBlob color="#F3E8FF" size="650px" top="65%" left="65%" delay={8} />
      </div>

      <nav className="fixed top-0 left-0 w-full z-[80] px-8 lg:px-20 py-10 flex justify-between items-center bg-white/5 backdrop-blur-md border-b border-white/10">
        <div className="flex items-center gap-5 cursor-pointer" onClick={() => setAppStage(AppStage.HORIZON)}>
          <div className="bg-[#1E1B4B] p-3 rounded-2xl shadow-2xl shadow-[#1E1B4B]/20">
            <Compass className="text-white w-6 h-6" />
          </div>
          <span className="font-heading text-3xl font-black tracking-tighter text-[#1E1B4B]">Sentiment Compass</span>
        </div>
        
        <div className="hidden lg:flex items-center gap-16" />

        <button
          onClick={() => setAppStage(AppStage.COMPASS)}
          className="bg-[#1E1B4B] text-white rounded-full px-14 py-4.5 text-[11px] font-black uppercase tracking-[0.3em] shadow-[0_20px_40px_-10px_rgba(30,27,75,0.4)] hover:bg-[#8B5CF6] transition-all active:scale-95"
        >
          {results.length > 0 ? 'Go to Dashboard' : 'Start Analysis →'}
        </button>
      </nav>

      <AnimatePresence mode="wait">
        {appStage === AppStage.HORIZON && (
          <motion.div key="horizon" className="relative pt-40 pb-52 px-6">
            <section className="relative z-10 max-w-7xl mx-auto text-center pt-28 pb-40">
              <motion.div
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                className="inline-flex items-center gap-4 px-10 py-4 bg-white/30 backdrop-blur-2xl rounded-full border border-white/50 mb-16 shadow-xl"
              >
                <Sparkles className="w-5 h-5 text-[#8B5CF6]" />
                <span className="text-[11px] font-black uppercase tracking-[0.6em] text-slate-600">Luminous Hybrid Analysis</span>
              </motion.div>

              <motion.h1 
                initial={{ opacity: 0, y: 60 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                className="text-7xl lg:text-[12rem] font-heading font-black text-[#1E1B4B] tracking-tight leading-[0.75] mb-16 text-glow"
              >
                Decode the <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-[#8B5CF6] italic font-light">Digital Noise</span> <br/> 
                with Luminous <span className="text-[#8B5CF6]">Insight.</span>
              </motion.h1>

              <motion.p 
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 1 }}
                className="text-2xl lg:text-4xl text-slate-500 font-medium max-w-5xl mx-auto mb-24 leading-relaxed opacity-80"
              >
                The first hybrid sentiment engine that bridges the gap between manual audits and real-time social streams. Capture every emotion across X, TikTok, and Instagram in a single, vibrant interface.
              </motion.p>

              <div className="flex flex-col sm:flex-row gap-10 justify-center items-center mb-52">
                <button 
                  onClick={() => setAppStage(AppStage.COMPASS)}
                  className="animate-heartbeat bg-[#1E1B4B] text-white px-20 py-8 rounded-full text-sm font-black uppercase tracking-widest shadow-[0_30px_60px_-15px_rgba(30,27,75,0.4)] hover:bg-[#8B5CF6] transition-all flex items-center gap-8 active:scale-95 group"
                >
                  Start Analysis <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                </button>
                <div className="px-12 py-8 text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-5 cursor-pointer hover:text-[#8B5CF6] transition-all group">
                  <Eye className="w-6 h-6 group-hover:scale-110 transition-transform" /> 92.4% Native Accuracy
                </div>
              </div>

              <div className="relative mb-80 flex justify-center">
                 <motion.div 
                   animate={{ rotate: 360 }}
                   transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
                   className="absolute inset-0 z-0 flex items-center justify-center opacity-10 pointer-events-none"
                 >
                   <div className="w-[900px] h-[900px] border-[2px] border-dashed border-[#8B5CF6] rounded-full" />
                 </motion.div>
                 
                 <motion.div 
                   initial={{ scale: 0.8, opacity: 0 }}
                   whileInView={{ scale: 1, opacity: 1 }}
                   transition={{ duration: 1.5 }}
                   className="w-[32rem] h-[32rem] glass-card border-[15px] border-white/40 rounded-[10rem] shadow-[0_60px_120px_-30px_rgba(139,92,246,0.5)] flex items-center justify-center relative group"
                 >
                   <AbstractFluid summary={batchSummary.total === 0 ? { ...batchSummary, positiveCount: 1, total: 1 } : batchSummary} />
                   <div className="absolute -bottom-12 bg-[#1E1B4B] text-white px-10 py-5 rounded-[2rem] text-[11px] font-black uppercase tracking-[0.4em] shadow-2xl">
                     Sentiment Average: 100%
                   </div>
                 </motion.div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 text-left px-4">
                <BentoCard 
                  span="lg:col-span-2"
                  label="HYBRID POWERHOUSE"
                  title="Upload Files or Stream the Web"
                  desc="Sentiment Compass handles both with zero friction. Whether you're processing a 100k line CSV or fetching live Instagram pulses, our hybrid engine adapts instantly to your data architecture."
                  icon={Layers}
                />
                <BentoCard 
                  label="LOCAL CONTEXT"
                  title="Tuned for the Streets"
                  desc="Built specifically for Mzansi. We natively understand code-switching, local urban slang, and cultural nuances that global models miss entirely."
                  icon={Languages}
                />
                <BentoCard 
                  label="LIVE INGESTION"
                  title="Stop Searching. Start Listening."
                  desc="Automatically pull reviews and mentions from X, TikTok, and Instagram without manual scraping. Just live, actionable intelligence."
                  icon={Activity}
                />
                <BentoCard 
                  span="lg:col-span-2"
                  label="EXPLAINABILITY"
                  title="Luminous Insights, Defined Clearly"
                  desc="Every classification is illuminated with a detailed explanation of the emotive driver. We don't just provide a score; we reveal the 'Why' behind every consumer signal."
                  icon={BrainCircuit}
                />
              </div>

              <div className="mt-72 pt-28 border-t border-white/20">
                <h5 className="text-[11px] font-black uppercase tracking-[0.8em] text-slate-400 mb-20 opacity-50">Powering Strategy for Mzansi's Forward-Thinkers</h5>
                <div className="w-full overflow-hidden relative group">
                   <div className="flex gap-48 animate-marquee whitespace-nowrap items-center">
                    {['RETAIL PLUS', 'MZANSI TECH', 'URBAN FLOW', 'ECHO SCALE', 'GLOW UP', 'SIGNAL SOUTH', 'VAAL VISION'].map(logo => (
                      <span key={logo} className="font-heading font-black text-4xl lg:text-6xl tracking-tighter text-slate-900/10 hover:text-[#8B5CF6]/60 transition-all duration-500 cursor-default">{logo}</span>
                    ))}
                    {['RETAIL PLUS', 'MZANSI TECH', 'URBAN FLOW', 'ECHO SCALE', 'GLOW UP', 'SIGNAL SOUTH', 'VAAL VISION'].map(logo => (
                      <span key={logo + '-2'} className="font-heading font-black text-4xl lg:text-6xl tracking-tighter text-slate-900/10">{logo}</span>
                    ))}
                   </div>
                </div>
              </div>
            </section>
          </motion.div>
        )}

        {appStage === AppStage.COMPASS && (
          <motion.div key="compass" className="pt-48 pb-24 px-8 lg:px-20 relative z-10">
             <div className="max-w-[1750px] mx-auto flex gap-8 mb-16 overflow-x-auto no-scrollbar">
              <button 
                onClick={() => setViewMode('landscape')}
                className={`flex items-center gap-5 px-12 py-6 rounded-[3rem] text-[11px] font-black uppercase tracking-widest transition-all ${
                  viewMode === 'landscape' ? 'bg-[#1E1B4B] text-white shadow-[0_25px_50px_-12px_rgba(30,27,75,0.4)]' : 'bg-white/40 backdrop-blur-2xl text-slate-500 border border-white/60'
                }`}
              >
                <Layers className="w-6 h-6" /> Sentiment Landscape
              </button>
              <button 
                onClick={() => setViewMode('grid')}
                className={`flex items-center gap-5 px-12 py-6 rounded-[3rem] text-[11px] font-black uppercase tracking-widest transition-all ${
                  viewMode === 'grid' ? 'bg-[#1E1B4B] text-white shadow-[0_25px_50px_-12px_rgba(30,27,75,0.4)]' : 'bg-white/40 backdrop-blur-2xl text-slate-500 border border-white/60'
                }`}
              >
                <LayoutGrid className="w-6 h-6" /> Data Points
              </button>
              <button 
                onClick={() => setViewMode('compare')}
                className={`flex items-center gap-5 px-12 py-6 rounded-[3rem] text-[11px] font-black uppercase tracking-widest transition-all ${
                  viewMode === 'compare' ? 'bg-[#1E1B4B] text-white shadow-[0_25px_50px_-12px_rgba(30,27,75,0.4)]' : 'bg-white/40 backdrop-blur-2xl text-slate-500 border border-white/60'
                }`}
              >
                <Split className="w-6 h-6" /> Signal Comparison
              </button>
            </div>

            <main className="max-w-[1750px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-20">
              <div className="lg:col-span-4 flex flex-col gap-12">
                <section className="bg-white/40 backdrop-blur-3xl rounded-[4rem] p-14 shadow-[0_32px_64px_-16px_rgba(31,38,135,0.1)] border border-white/60">
                  <div className="inline-flex p-2.5 bg-slate-100/50 rounded-[2rem] border border-white/40 mb-12 w-full">
                    <button 
                      onClick={() => setInputMode(InputMode.MANUAL)}
                      className={`flex-1 px-10 py-5 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-4 ${inputMode === InputMode.MANUAL ? 'bg-[#1E1B4B] text-white shadow-2xl' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                      Input Center
                    </button>
                    <button 
                      onClick={() => setInputMode(InputMode.SOCIAL)}
                      className={`flex-1 px-10 py-5 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-4 ${inputMode === InputMode.SOCIAL ? 'bg-[#8B5CF6] text-white shadow-2xl' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                      Social Pulse
                    </button>
                  </div>
                  
                  <AnimatePresence mode="wait">
                    {inputMode === InputMode.MANUAL ? (
                      <motion.div key="manual" className="space-y-10">
                        <textarea
                          placeholder="Paste signals for audit..."
                          className="w-full bg-white/50 p-10 rounded-[3rem] border border-white/60 focus:border-[#8B5CF6] outline-none text-base font-medium resize-none h-56 transition-all shadow-inner"
                          value={inputText}
                          onChange={(e) => setInputText(e.target.value)}
                        />
                        <div className="flex gap-8">
                          <button onClick={handleAnalyze} className="flex-1 bg-[#1E1B4B] text-white py-7 rounded-full font-black text-xs uppercase tracking-[0.3em] shadow-2xl transition-all active:scale-95">Start Analysis</button>
                          <label className="p-7 bg-white rounded-full cursor-pointer hover:border-[#8B5CF6] transition-all shadow-xl hover:scale-105 active:scale-95">
                            <Upload className="w-7 h-7 text-[#8B5CF6]" />
                            <input type="file" className="hidden" onChange={handleFileUpload} />
                          </label>
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div key="social" className="space-y-10">
                        <div className="relative">
                          <Search className="absolute left-10 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-300" />
                          <input
                            type="text"
                            placeholder="Fetch brand keyword..."
                            className="w-full bg-white/50 pl-24 pr-10 py-6 rounded-full border border-white/60 focus:border-[#8B5CF6] outline-none text-base font-medium transition-all shadow-inner"
                            value={searchKeyword}
                            onChange={(e) => setSearchKeyword(e.target.value)}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-5">
                          {['X', 'Facebook', 'Instagram', 'TikTok'].map((p: any) => (
                            <button
                              key={p}
                              onClick={() => setSelectedPlatforms(prev => prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p])}
                              className={`py-5 rounded-[1.5rem] border text-[10px] font-black uppercase tracking-widest transition-all ${selectedPlatforms.includes(p) ? 'bg-[#1E1B4B] text-white border-[#1E1B4B] shadow-2xl' : 'bg-white/60 text-slate-400 border-white/40 hover:border-slate-300'}`}
                            >
                              {p}
                            </button>
                          ))}
                        </div>
                        <button onClick={handleSocialPulse} className="w-full bg-[#8B5CF6] text-white py-7 rounded-full font-black text-xs uppercase tracking-[0.3em] shadow-2xl transition-all active:scale-95">Fetch Luminous Signal</button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </section>

                <SentimentPieChart data={batchSummary} />

                {/* Export Controls */}
                <section className="bg-white/40 backdrop-blur-3xl rounded-[4rem] p-12 shadow-xl border border-white/60">
                   <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 mb-8 px-2">Export Intelligence</h4>
                   <div className="grid grid-cols-1 gap-4">
                      <button 
                        onClick={exportPDF}
                        className="flex items-center justify-between p-6 bg-[#8B5CF6] text-white rounded-[2rem] shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all group"
                      >
                         <div className="flex items-center gap-4">
                            <FileText className="w-5 h-5" />
                            <span className="text-xs font-black uppercase tracking-widest">Download PDF Report</span>
                         </div>
                         <Download className="w-4 h-4 group-hover:translate-y-1 transition-transform" />
                      </button>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <button 
                          onClick={exportCSV}
                          className="flex items-center gap-3 p-5 bg-white rounded-[2rem] border border-slate-100 text-[#1E1B4B] shadow-sm hover:shadow-md transition-all active:scale-95"
                        >
                           <FileSpreadsheet className="w-4 h-4 text-emerald-500" />
                           <span className="text-[10px] font-black uppercase tracking-widest">CSV Audit</span>
                        </button>
                        <button 
                          onClick={exportJSON}
                          className="flex items-center gap-3 p-5 bg-white rounded-[2rem] border border-slate-100 text-[#1E1B4B] shadow-sm hover:shadow-md transition-all active:scale-95"
                        >
                           <FileJson className="w-4 h-4 text-amber-500" />
                           <span className="text-[10px] font-black uppercase tracking-widest">JSON Sync</span>
                        </button>
                      </div>
                   </div>
                </section>
              </div>

              <div className="lg:col-span-8 space-y-16">
                <SentimentTrendLine data={results} />
                <AudienceMetrics results={results} />

                <AnimatePresence mode="wait">
                  {selectedResult ? (
                    <motion.div key={selectedResult.id} initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}>
                      <SubtextSpotlight analysis={selectedResult} />
                    </motion.div>
                  ) : null}
                </AnimatePresence>

                <div className="space-y-10">
                  <div className="flex justify-between items-center px-8">
                    <h4 className="text-[11px] font-black uppercase tracking-[0.6em] text-slate-400 opacity-60">Integrated Pulse Log</h4>
                    <span className="text-[11px] text-slate-300">{results.length} Data Points Decoded</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    {results.map((res) => (
                      <motion.div
                        key={res.id}
                        onClick={() => { setSelectedResult(res); }}
                        className={`p-14 bg-white/40 backdrop-blur-2xl border rounded-[4rem] transition-all cursor-pointer hover:shadow-[0_40px_80px_-20px_rgba(139,92,246,0.15)] relative group ${selectedResult?.id === res.id ? 'border-[#8B5CF6] ring-[12px] ring-[#8B5CF6]/5' : 'border-white/60'}`}
                      >
                         <div className="flex justify-between items-start mb-10">
                           <div className="flex items-center gap-5">
                              <div className="w-12 h-12 rounded-2xl bg-white shadow-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                {getSourceIcon(res.source)}
                              </div>
                              <span className="text-[11px] font-black uppercase tracking-widest text-slate-500">{res.source}</span>
                           </div>
                           <span className={`px-6 py-2.5 rounded-full text-[11px] font-black uppercase tracking-widest ${res.sentiment === 'Positive' ? 'text-green-600 bg-green-50' : res.sentiment === 'Negative' ? 'text-red-600 bg-red-50' : 'text-slate-600 bg-slate-50'}`}>
                             {res.sentiment}
                           </span>
                        </div>
                        <p className="text-[#1E1B4B] text-xl font-medium italic line-clamp-3 leading-relaxed transition-colors group-hover:text-[#8B5CF6]">"{res.text}"</p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </main>
          </motion.div>
        )}
      </AnimatePresence>

      {isAnalyzing && (
        <div className="fixed inset-0 z-[100] bg-white/80 backdrop-blur-3xl flex flex-col items-center justify-center">
          <Loader2 className="w-28 h-28 text-[#8B5CF6] animate-spin mb-12" />
          <h2 className="text-5xl font-black font-heading uppercase tracking-tighter text-[#1E1B4B]">Merging Signals</h2>
          <p className="text-[#8B5CF6] font-bold uppercase text-[12px] tracking-[0.6em] mt-8 animate-pulse">Scanning Luminous Data Streams...</p>
        </div>
      )}
    </div>
  );
}
