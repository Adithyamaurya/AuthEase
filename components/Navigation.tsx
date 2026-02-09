import React from 'react';

interface Props {
  activeView: 'analysis' | 'game';
  setActiveView: (view: 'analysis' | 'game') => void;
}

const Navigation: React.FC<Props> = ({ activeView, setActiveView }) => {
  return (
    /* Added bg-gradient-to-b from-black/40 to-transparent */
    <nav className="sticky top-0 z-50 glass border-b border-white/5 bg-gradient-to-b from-black/40 to-transparent">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between relative">
        
        {/* Logo Section */}
        <div 
          className="flex items-center gap-3 group cursor-pointer shrink-0" 
          onClick={() => setActiveView('analysis')}
        >
          <div className="relative w-10 h-10 flex items-center justify-center">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl rotate-6 group-hover:rotate-12 group-hover:scale-110 transition-all duration-300 shadow-lg shadow-indigo-500/20"></div>
            <div className="absolute inset-0 bg-slate-900/20 rounded-xl transition-opacity group-hover:opacity-0"></div>
            
            <svg 
              className="relative w-6 h-6 text-white" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2.5" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="M12 2L3 7v9c0 5 9 6 9 6s9-1 9-6V7l-9-5z" />
              <path d="M12 22V12" className="opacity-40" />
            </svg>
          </div>
          
          <span className="text-xl font-black tracking-tighter text-white uppercase transition-all duration-300 flex items-center">
  Auth
  <span className="font-black  tracking-normal bg-gradient-to-br from-indigo-400 to-purple-500 bg-clip-text text-transparent ml-0.5">
    EASE
  </span>
</span>
        </div>
        
        {/* Centered Navigation Toggle */}
        <div className="absolute left-1/2 -translate-x-1/2 flex bg-white/5 p-1 rounded-2xl gap-1 border border-white/5 backdrop-blur-md">
          <button
            onClick={() => setActiveView('analysis')}
            className={`px-6 py-2 rounded-xl font-bold text-sm transition-all duration-300 ${
              activeView === 'analysis' 
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' 
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            AI Check
          </button>
          <button
            onClick={() => setActiveView('game')}
            className={`px-6 py-2 rounded-xl font-bold text-sm transition-all duration-300 ${
              activeView === 'game' 
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' 
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            Game
          </button>
        </div>

        {/* Empty spacer for layout balance */}
        <div className="w-40 hidden md:block"></div>

      </div>
    </nav>
  );
};

export default Navigation;