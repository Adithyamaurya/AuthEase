
import React, { useState } from 'react';
import Navigation from './components/Navigation';
import MediaAnalyzer from './components/Analysis/MediaAnalyzer';
import AuthGame from './components/Game/AuthGame';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<'analysis' | 'game'>('analysis');

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col selection:bg-indigo-500/30">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-indigo-500/10 blur-[120px] rounded-full animate-pulse-slow"></div>
        <div className="absolute top-[20%] -right-[5%] w-[30%] h-[30%] bg-purple-500/5 blur-[100px] rounded-full"></div>
        <div className="absolute -bottom-[10%] left-[20%] w-[50%] h-[40%] bg-pink-500/5 blur-[150px] rounded-full animate-pulse-slow"></div>
      </div>

      <Navigation activeView={activeView} setActiveView={setActiveView} />
      
      <main className="flex-1 relative z-10">
        <div className="animate-in fade-in duration-700">
          {activeView === 'analysis' ? (
            <MediaAnalyzer />
          ) : (
            <AuthGame />
          )}
        </div>
      </main>
<footer className="py-12 px-6 border-t border-white/5 relative z-10 bg-gradient-to-t from-black/20 to-transparent">
  <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-10">
    
    {/* Brand Section */}
    <div className="space-y-4 text-center md:text-left">
      <div className="flex items-center gap-3 justify-center md:justify-start group cursor-default">
        <div className="relative w-8 h-8 flex items-center justify-center">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg rotate-6 group-hover:rotate-12 transition-transform shadow-lg shadow-indigo-500/10"></div>
          <svg className="relative w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M12 2L3 7v9c0 5 9 6 9 6s9-1 9-6V7l-9-5z" />
          </svg>
        </div>
        <span className="text-lg font-black tracking-tight text-white uppercase">
          AuthEase
        </span>
      </div>

      <p className="text-slate-500 text-sm max-w-xs leading-relaxed">
        Helping people understand and evaluate digital content. 
        Check authenticity. Stay informed.
      </p>

      {/* Made with Heart */}
      <div className="flex items-center gap-2 justify-center md:justify-start text-slate-500 text-xs pt-2">
        <span>Made with</span>
        <svg className="w-3.5 h-3.5 text-rose-500 animate-pulse" fill="currentColor" viewBox="0 0 24 24">
          <path d="M11.645 20.91l-.007-.003c-.022-.012-.045-.023-.07-.033l-.11-.05c-.322-.15-.72-.34-1.157-.564-1.323-.674-3.184-1.64-5.03-2.816C3.556 16.304 1 14.162 1 10.5 1 7.462 3.462 5 6.5 5c1.47 0 2.793.578 3.772 1.522C11.243 5.578 12.57 5 14.045 5c3.038 0 5.5 2.462 5.5 5.5 0 3.662-2.556 5.804-4.271 6.946-1.847 1.176-3.707 2.142-5.03 2.816a11.16 11.16 0 01-1.158.563l-.11.05a.872.872 0 01-.07.033l-.006.002z" />
        </svg>
        <span>for everyone</span>
      </div>
    </div>

    {/* Navigation Links */}
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-12 gap-y-4 text-sm">
      <div className="flex flex-col gap-3">
        <span className="text-white font-bold mb-1">Product</span>
        <a href="#" className="text-slate-400 hover:text-indigo-400 transition-colors">How It Works</a>
        <a href="#" className="text-slate-400 hover:text-indigo-400 transition-colors">AI Literacy Game</a>
      </div>
      
      <div className="flex flex-col gap-3">
        <span className="text-white font-bold mb-1">Resources</span>
        <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors flex items-center gap-2">
          GitHub
        </a>
        <a href="#" className="text-slate-400 hover:text-indigo-400 transition-colors">Support</a>
      </div>

      <div className="flex flex-col gap-3">
        <span className="text-white font-bold mb-1">Legal</span>
        <a href="#" className="text-slate-400 hover:text-indigo-400 transition-colors">Privacy</a>
        <a href="#" className="text-slate-400 hover:text-indigo-400 transition-colors">Terms</a>
      </div>
    </div>

  </div>

  {/* Bottom Bar */}
  <div className="max-w-7xl mx-auto mt-12 pt-6 border-t border-white/5 text-center flex flex-col md:flex-row justify-between items-center gap-4">
    <p className="text-slate-600 text-xs">
      © 2026 AuthEase. Built to promote digital awareness and responsible AI use.
    </p>
    <div className="flex gap-6">
      <div className="h-1 w-1 rounded-full bg-indigo-500/40"></div>
    </div>
  </div>
</footer>
    </div>
  );
};

export default App;
