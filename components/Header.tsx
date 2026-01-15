
import React from 'react';
import { Scale, Facebook, Instagram, Youtube } from 'lucide-react';
import { AppStage } from '../types';

interface HeaderProps {
  onNavigate: (stage: AppStage) => void;
  stage: AppStage;
}

const Header: React.FC<HeaderProps> = ({ onNavigate, stage }) => {
  return (
    <nav className="fixed top-0 left-0 w-full z-[80] px-6 lg:px-16 py-6 lg:py-10 flex justify-between items-center bg-white/40 backdrop-blur-md border-b border-white/20">
      <div 
        className="flex items-center gap-4 cursor-pointer" 
        onClick={() => onNavigate(AppStage.HORIZON)}
      >
        <div className="bg-slate-900 p-2.5 rounded-xl shadow-lg flex items-center justify-center">
          <Scale className="text-white w-5 h-5" />
        </div>
        <span className="font-heading text-xl font-bold tracking-tight text-slate-900">DEEPA</span>
      </div>

      <div className="hidden lg:flex items-center gap-10 absolute left-1/2 -translate-x-1/2">
        {['Platform', 'Templates', 'Marketplace', 'Enterprise'].map(link => (
          <button 
            key={link} 
            className="text-[10px] uppercase tracking-[0.4em] font-bold text-slate-400 hover:text-[#0DACF1] transition-colors"
          >
            {link}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-4 lg:gap-10">
        <div className="hidden sm:flex items-center gap-6 text-slate-400 border-r border-slate-200 pr-10">
          <Facebook className="w-4 h-4 cursor-pointer hover:text-slate-900 transition-colors" />
          <Instagram className="w-4 h-4 cursor-pointer hover:text-slate-900 transition-colors" />
          <Youtube className="w-4 h-4 cursor-pointer hover:text-slate-900 transition-colors" />
        </div>
        <button
          onClick={() => onNavigate(AppStage.AUTH)}
          className="bg-slate-900 text-white rounded-full px-8 py-2.5 text-[10px] font-bold uppercase tracking-[0.2em] shadow-xl hover:bg-[#0DACF1] transition-all active:scale-95"
        >
          {stage === AppStage.HORIZON ? 'Sign In' : 'Account'}
        </button>
      </div>
    </nav>
  );
};

export default Header;
