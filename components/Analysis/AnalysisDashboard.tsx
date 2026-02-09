
import React from 'react';
import { AnalysisResult } from '../../types';

interface Props {
  result: AnalysisResult;
}

const CircularGauge: React.FC<{ value: number; size?: number; label: string }> = ({ value, size = 160, label }) => {
  const radius = size * 0.4;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (1-value/100) * circumference;
  
  const getColor = (val: number) => {
    if (val <= 25) return '#10b981'; // Emerald 500
    if (val <= 50) return '#84cc16'; // Lime 500
    if (val <= 75) return '#f59e0b'; // Amber 500
    return '#ef4444'; // Red 500
  };

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg className="w-full h-full transform -rotate-90">
          <circle cx={size/2} cy={size/2} r={radius} fill="transparent" stroke="rgba(255,255,255,0.05)" strokeWidth="12" />
          <circle 
            cx={size/2} cy={size/2} r={radius} 
            fill="transparent" 
            stroke={getColor(value)} 
            strokeWidth="12" 
            strokeDasharray={circumference} 
            strokeDashoffset={offset} 
            strokeLinecap="round" 
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-black text-white">{value}%</span>
        </div>
      </div>
      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-2">{label}</span>
    </div>
  );
};

const AnalysisDashboard: React.FC<Props> = ({ result }) => {
  const getClassification = (score: number) => {
    if (score <= 25) return { label: "Real Content", sub: "(Very Low AI Probability)", color: "text-emerald-400", bg: "bg-emerald-500/10" };
    if (score <= 50) return { label: "Likely Real", sub: "", color: "text-lime-400", bg: "bg-lime-500/10" };
    if (score <= 75) return { label: "Likely AI-Generated", sub: "", color: "text-orange-400", bg: "bg-orange-500/10" };
    return { label: "AI-Generated", sub: "", color: "text-rose-500 font-bold", bg: "bg-rose-500/20" };
  };

  const classification = getClassification(result.aiSyntheticProb*100);

  const shareReport = (platform: string) => {
    const text = `I just analyzed this content on AuthEase! Forensic result: ${classification.label} (${result.aiSyntheticProb}% likelihood).`;
    const url = window.location.href;
    const shareUrls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
    };
    window.open(shareUrls[platform as keyof typeof shareUrls], '_blank');
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 glass p-10 rounded-[2.5rem] flex flex-col md:flex-row items-center gap-12">
          <div className="shrink-0">
             <CircularGauge value={result.aiSyntheticProb} label="AI Likelihood" />
          </div>
          
          <div className="flex-1 space-y-6 text-center md:text-left">
            <div>
              <div className={`inline-flex items-center px-4 py-1.5 rounded-full ${classification.bg} ${classification.color} text-xs font-black uppercase tracking-wider mb-4`}>
                Classification Engine: {classification.label}
              </div>
              <h2 className={`text-4xl md:text-5xl font-black ${classification.color}`}>
                {classification.label} {classification.sub}
              </h2>
            </div>
            <p className="text-slate-400 text-lg leading-relaxed font-medium italic">
              "{result.explanation}"
            </p>
          </div>
        </div>

        <div className="glass p-8 rounded-[2.5rem] flex flex-col justify-between">
          <div className="space-y-6">
            <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest">Confidence Scores</h4>
            <div className="space-y-4">
              {[
                { label: 'Trust Index', val: result.trustIndex*100, color: 'bg-indigo-500' },
                { label: 'Source Credit', val: result.sourceCredibility*100, color: 'bg-blue-500' },
                { label: 'Manip. Risk', val: result.manipulationRisk*100, color: 'bg-rose-500' }
              ].map(stat => (
                <div key={stat.label}>
                  <div className="flex justify-between text-xs font-bold mb-2">
                    <span className="text-slate-400 uppercase tracking-tighter">{stat.label}</span>
                    <span className="text-white">{stat.val}%</span>
                  </div>
                  <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                    <div className={`h-full ${stat.color} transition-all duration-1000`} style={{ width: `${stat.val}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="pt-8 border-t border-white/5 mt-8">
            <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">Share Findings</h4>
            <div className="flex gap-3">
              {['twitter', 'facebook', 'linkedin'].map(p => (
                <button 
                  key={p} 
                  onClick={() => shareReport(p)}
                  className="flex-1 bg-white/5 h-10 rounded-xl flex items-center justify-center hover:bg-indigo-600 transition-all hover:scale-105"
                >
                  <span className="capitalize text-[10px] font-black">{p}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass p-10 rounded-[2rem] space-y-8">
           <h3 className="text-2xl font-black flex items-center gap-4">
             <div className="w-10 h-10 bg-indigo-500/10 rounded-xl flex items-center justify-center">
               <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a2 2 0 00-1.96 1.414l-.727 2.903a2 2 0 01-3.511.413l-1.927-3.212a2 2 0 00-1.917-.817l-3.003.428a2 2 0 01-2.062-2.18l.279-3.07a2 2 0 00-1.057-1.944l-2.73-1.42a2 2 0 01-.194-3.507l2.768-1.521a2 2 0 001.03-1.956l-.28-3.069a2 2 0 012.063-2.18l3.003.428a2 2 0 001.917-.817l1.927-3.212a2 2 0 013.511.413l.727 2.903a2 2 0 001.96 1.414l2.387-.477a2 2 0 001.022.547l2.427 4.204a2 2 0 01-.148 2.148L19.428 15.428z" />
               </svg>
             </div>
             Artifact Identification
           </h3>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             {result.findings.map((finding, i) => (
               <div key={i} className="bg-slate-900/40 p-5 rounded-2xl border border-white/5 hover:border-indigo-500/30 transition-all group">
                 <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 group-hover:text-indigo-400 transition-colors">Forensic Trace {i+1}</div>
                 <p className="font-mono text-sm text-slate-300 leading-relaxed">{finding}</p>
               </div>
             ))}
           </div>
        </div>

        <div className="space-y-6">
           <div className="bg-gradient-to-br from-indigo-900/40 to-purple-900/40 border border-indigo-500/20 p-8 rounded-[2rem]">
             <h4 className="text-white font-black text-xl mb-4 flex items-center gap-3">
                <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                Probabilistic Reality
             </h4>
             <p className="text-slate-300 leading-relaxed">
               AuthEase provides high-confidence statistical markers. In the current era of generative synthesis, "truth" is verified through multi-modal cross-referencing. These scores are signals, not absolute verdicts.
             </p>
           </div>
           
           <div className="glass p-8 rounded-[2rem] flex items-center gap-6">
             <div className="w-16 h-16 shrink-0 rounded-2xl bg-indigo-500/10 flex items-center justify-center">
               <svg className="w-8 h-8 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
               </svg>
             </div>
             <div>
               <h5 className="font-black text-white">Trust Chain Secured</h5>
               <p className="text-slate-500 text-sm">Analysis result signed and timestamped on our verification ledger.</p>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisDashboard;
