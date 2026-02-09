
import React, { useState, useEffect } from 'react';
import { GameChallenge, GameState, MediaType, DifficultyMode, GameStats } from '../../types';
import { generateGameChallenge } from '../../services/gemini';

const AuthGame: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.START);
  const [difficulty, setDifficulty] = useState<DifficultyMode>('beginner');
  const [mediaType, setMediaType] = useState<MediaType>('text');
  const [currentChallenge, setCurrentChallenge] = useState<GameChallenge | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedOption, setSelectedOption] = useState<'A' | 'B' | null>(null);
  
  const [stats, setStats] = useState<GameStats>({
    accuracy: 0,
    streak: 0,
    totalRounds: 0,
    correctRounds: 0,
    xp: 0,
    level: 1
  });

  const startNewChallenge = async (selectedDifficulty?: DifficultyMode, selectedMediaType?: MediaType) => {
    const activeDifficulty = selectedDifficulty || difficulty;
    const activeMedia = selectedMediaType || mediaType;
    
    console.log("Starting challenge:", activeMedia, "at", activeDifficulty);
    setLoading(true);
    setSelectedOption(null);
    setGameState(GameState.PLAYING);
    
    try {
      const challenge = await generateGameChallenge(activeMedia, activeDifficulty);
      setCurrentChallenge(challenge);
      console.log("Challenge loaded successfully");
    } catch (error) {
      console.error("Game generation failed:", error);
      alert("Scenario synthesis interrupted. Rerouting to Terminal.");
      setGameState(GameState.START);
    } finally {
      setLoading(false);
    }
  };

 const handleSelection = (option: 'A' | 'B') => {
    setSelectedOption(option);
    
    // Identify the data for both options
    const chosenData = option === 'A' ? currentChallenge?.optionA : currentChallenge?.optionB;
    const otherData = option === 'A' ? currentChallenge?.optionB : currentChallenge?.optionA;

    // LOGIC FIX: 
    // You are correct if the one you picked is AI. 
    // This works even if both are AI, or if only one is AI.
    const isCorrect = chosenData?.isAi === true;

    setStats(prev => {
      const newCorrect = isCorrect ? prev.correctRounds + 1 : prev.correctRounds;
      const newTotal = prev.totalRounds + 1;
      const newStreak = isCorrect ? prev.streak + 1 : 0;
      const xpGain = isCorrect ? 150 * (prev.streak + 1) : 0;
      const newXp = prev.xp + xpGain;
      const newLevel = Math.floor(newXp / 1000) + 1;

      return {
        ...prev,
        totalRounds: newTotal,
        correctRounds: newCorrect,
        accuracy: Math.round((newCorrect / newTotal) * 100),
        streak: newStreak,
        xp: newXp,
        level: newLevel
      };
    });

    setGameState(GameState.FEEDBACK);
  };

  const shareScore = () => {
    const text = `Expert Level reached in AuthEase ${mediaType.toUpperCase()} Mode! Level ${stats.level}, Accuracy ${stats.accuracy}%.`;
    const url = window.location.href;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
  };

  if (gameState === GameState.START) {
    return (
      <div className="max-w-4xl mx-auto py-24 px-6 text-center space-y-12">
        <div className="relative inline-block animate-float">
          <div className="absolute -inset-4 bg-indigo-500/20 blur-2xl rounded-full"></div>
          <div className="relative bg-gradient-to-br from-indigo-500 to-purple-600 w-24 h-24 rounded-[2rem] flex items-center justify-center text-white shadow-2xl">
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>

        <div className="space-y-6">
          <h1 className="text-6xl font-black tracking-tight text-white">Spot The <span className="gradient-text">AI</span></h1>
          <p className="text-slate-400 text-xl max-w-2xl mx-auto leading-relaxed">
            Test your ability to tell human-made and AI-generated content apart. Play across text and images.          </p>
        </div>

        <div className="flex justify-center gap-6">
           <button
             onClick={() => setGameState(GameState.DIFFICULTY_SELECT)}
             className="px-12 py-5 bg-indigo-600 text-white rounded-2xl font-black text-xl shadow-2xl shadow-indigo-500/20 hover:bg-indigo-500 hover:scale-105 active:scale-95 transition-all"
           >
             Begin The Journey
           </button>
        </div>
      </div>
    );
  }

  if (gameState === GameState.DIFFICULTY_SELECT) {
    return (
      <div className="max-w-4xl mx-auto py-24 px-6 space-y-12 animate-in zoom-in duration-500">
        <div className="text-center">
          <h2 className="text-4xl font-black text-white mb-4">Game Settings</h2>
          <p className="text-slate-500">Choose your difficulty and start spotting AI-generated content.</p>
        </div>

        <div className="glass p-8 rounded-[2rem] space-y-8 mb-12">
          <div className="space-y-4">
             <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2">Media Substrate</label>
             <div className="flex gap-4">
                {[
                  { id: 'text', label: 'Text Challenge', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' },
                  { id: 'image', label: 'Image Challenge', icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' }
                ].map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setMediaType(m.id as any)}
                    className={`flex-1 p-6 rounded-2xl border-2 transition-all flex flex-col items-center gap-3 ${mediaType === m.id ? 'bg-indigo-600/10 border-indigo-500 text-white' : 'border-white/5 text-slate-500 hover:text-slate-300'}`}
                  >
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={m.icon} />
                    </svg>
                    <span className="font-bold">{m.label}</span>
                  </button>
                ))}
             </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { id: 'beginner', title: 'Beginner', color: 'text-emerald-400' },
            { id: 'intermediate', title: 'Intermediate', color: 'text-blue-400' },
            { id: 'advanced', title: 'Advanced', color: 'text-purple-400' },
            { id: 'expert', title: 'Expert', color: 'text-rose-500' }
          ].map((mode) => (
            <button
              key={mode.id}
              onClick={() => { setDifficulty(mode.id as any); startNewChallenge(mode.id as any); }}
              className="glass p-6 rounded-2xl text-center hover:border-white/20 transition-all hover:scale-[1.05] group"
            >
              <div className={`${mode.color} font-black text-sm uppercase tracking-widest group-hover:scale-110 transition-transform`}>
                {mode.title}
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-48 space-y-8">
        <div className="relative">
          <div className="w-24 h-24 border-8 border-white/5 rounded-full"></div>
          <div className="w-24 h-24 border-8 border-indigo-600 border-t-transparent rounded-full animate-spin absolute inset-0 shadow-xl shadow-indigo-500/20"></div>
        </div>
        <div className="text-center">
          <p className="text-indigo-400 font-black tracking-[0.3em] uppercase text-sm animate-pulse">Synthesizing {mediaType} Scenario...</p>
          <p className="text-slate-600 text-xs mt-2 uppercase font-bold tracking-widest">Generating forensic markers for level {stats.level}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 lg:p-12 space-y-8">
      {/* HUD Header */}
      <div className="glass p-6 rounded-[2rem] flex flex-wrap justify-between items-center gap-8 border border-white/5">
        <div className="flex gap-10">
          <div>
             <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">XP Progression</div>
             <div className="flex items-center gap-4">
                <span className="text-2xl font-black text-white">Lvl {stats.level}</span>
                <div className="w-48 h-2 bg-white/5 rounded-full overflow-hidden border border-white/5">
                   <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 transition-all duration-1000" style={{ width: `${(stats.xp % 1000) / 10}%` }}></div>
                </div>
             </div>
          </div>
          <div className="hidden sm:block">
             <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Accuracy</div>
             <div className="text-2xl font-black text-indigo-400">{stats.accuracy}%</div>
          </div>
          <div className="hidden sm:block">
             <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Streak</div>
             <div className="text-2xl font-black text-rose-500">{stats.streak} 🔥</div>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
           <button onClick={shareScore} className="px-5 py-2.5 glass hover:bg-white/10 rounded-xl text-xs font-black uppercase tracking-wider transition-all">
             Share
           </button>
           <div className="px-4 py-2 bg-indigo-500/20 text-indigo-400 rounded-xl font-black text-[10px] uppercase tracking-widest border border-indigo-500/30">
             {difficulty} / {mediaType}
           </div>
        </div>
      </div>

      <div className="text-center max-w-2xl mx-auto py-4">
        <h2 className="text-3xl font-black text-white mb-2">Human or AI?</h2>
        <p className="text-slate-400 font-medium italic text-lg leading-relaxed">Choose the content you think was created by AI.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {[
          { id: 'A', data: currentChallenge?.optionA },
          { id: 'B', data: currentChallenge?.optionB }
        ].map((opt) => {
          const isSelected = selectedOption === opt.id;
          const isCorrect = opt.data?.isAi;
          const showFeedback = gameState === GameState.FEEDBACK;

          return (
            <button
              key={opt.id}
              disabled={showFeedback}
              onClick={() => handleSelection(opt.id as any)}
              className={`group relative rounded-[2.5rem] border-2 text-left transition-all duration-500 overflow-hidden ${
                showFeedback 
                  ? (isCorrect ? 'border-emerald-500 bg-emerald-500/5' : 'border-white/5 opacity-40 grayscale')
                  : 'border-white/5 glass hover:border-indigo-500/50 hover:scale-[1.02] hover:shadow-2xl'
              } ${isSelected && !isCorrect ? 'border-rose-500 bg-rose-500/5' : ''}`}
            >
              <div className="absolute top-6 left-6 z-20 bg-slate-950/80 backdrop-blur-md text-slate-400 w-10 h-10 rounded-xl flex items-center justify-center font-black border border-white/5 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                {opt.id}
              </div>

              <div className={`${mediaType === 'image' ? '' : 'p-10'} pt-12`}>
                {mediaType === 'text' ? (
                  <p className="text-slate-100 leading-relaxed font-serif text-xl p-4">{opt.data?.content}</p>
                ) : (
                  <div className="aspect-square bg-slate-900 relative">
                    {loading ? (
                      <div className="absolute inset-0 flex items-center justify-center bg-slate-900">
                        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    ) : (
                      <img 
                        src={opt.data?.content} 
                        alt="Target Substrate" 
                        className="w-full h-full object-cover filter transition-all duration-700" 
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent"></div>
                  </div>
                )}
              </div>

              {showFeedback && (
                <div className={`p-8 border-t border-white/10 ${isCorrect ? 'bg-emerald-500/5' : 'bg-slate-500/5'}`}>
                  <div className={`text-xs font-black uppercase tracking-[0.2em] mb-3 flex items-center gap-2 ${isCorrect ? 'text-emerald-400' : 'text-slate-400'}`}>
                    {isCorrect ? (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                    )}
                    {isCorrect ? 'AI Generated Content' : 'Human Created Content'}
                  </div>
                  <p className="text-slate-300 italic text-sm leading-relaxed">"{opt.data?.explanation}"</p>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {gameState === GameState.FEEDBACK && (
        <div className="flex flex-col items-center gap-6 mt-16 animate-in slide-in-from-bottom-4 duration-500 pb-12">
          <div className="flex gap-4">
            <button
              onClick={() => startNewChallenge()}
              className="px-12 py-5 bg-indigo-600 text-white rounded-2xl font-black text-xl shadow-2xl shadow-indigo-500/20 hover:bg-indigo-500 hover:scale-105 active:scale-95 transition-all"
            >
              Next Round
            </button>
            <button
              onClick={() => setGameState(GameState.DIFFICULTY_SELECT)}
              className="px-8 py-5 glass text-white rounded-2xl font-black text-xl hover:bg-white/10 transition-all"
            >
              Main Menu
            </button>
          </div>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Expert mode enabled at Level {stats.level}</p>
        </div>
      )}
    </div>
  );
};

export default AuthGame;
