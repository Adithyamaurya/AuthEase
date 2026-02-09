
import React, { useState } from 'react';
import { MediaType, AnalysisResult } from '../../types';
import { analyzeMedia } from '../../services/gemini';
import AnalysisDashboard from './AnalysisDashboard';

const MediaAnalyzer: React.FC = () => {
  const [activeTab, setActiveTab] = useState<MediaType>('text');
  const [inputText, setInputText] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const handleAnalyze = async () => {
    setAnalyzing(true);
    setResult(null);
    try {
      const content = activeTab === 'text' || activeTab === 'url' ? inputText : selectedFile;
      if (!content) return;
      
      const data = await analyzeMedia(activeTab, content);
      setResult(data);
    } catch (error) {
      console.error("Analysis failed:", error);
    } finally {
      setAnalyzing(false);
    }
  };

  const tabs: { id: MediaType; label: string; icon: string }[] = [
    { id: 'text', label: 'Text', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
    { id: 'image', label: 'Image', icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' },
    { id: 'audio', label: 'Audio', icon: 'M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z' },
    { id: 'video', label: 'Video', icon: 'M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z' },
    { id: 'url', label: 'URL', icon: 'M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1' },
  ];

  return (
    <div className="max-w-6xl mx-auto p-6 lg:p-12 space-y-12">
      <div className="text-center space-y-4">
        <h1 className="text-5xl font-extrabold tracking-tight text-white mb-4">Content <span className="gradient-text">Check</span></h1>
        <p className="text-slate-400 max-w-2xl mx-auto text-lg leading-relaxed">
          Analyze text, images, audio, and video to see if they show signs of AI generation or manipulation
        </p>
      </div>

      <div className="glass rounded-[2rem] shadow-2xl overflow-hidden mb-12">
        <div className="flex border-b border-white/5 bg-white/5">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); setResult(null); }}
              className={`flex-1 py-5 px-2 flex flex-col items-center gap-3 transition-all ${activeTab === tab.id ? 'bg-white/10 text-indigo-400' : 'text-slate-500 hover:text-slate-300'}`}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tab.icon} />
              </svg>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em]">{tab.label}</span>
            </button>
          ))}
        </div>

        <div className="p-10">
          {activeTab === 'text' || activeTab === 'url' ? (
            <textarea
              className="w-full h-48 p-6 bg-slate-900/50 border border-white/10 rounded-2xl focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none transition-all resize-none text-slate-100 placeholder:text-slate-600 font-medium"
              placeholder={activeTab === 'text' ? "Paste text for linguistic and structural analysis..." : "Analyze URL source credibility..."}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />
          ) : (
            <div className="relative group">
              <input 
                type="file" 
                id="file-upload" 
                className="hidden" 
                onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
              />
              <label htmlFor="file-upload" className="flex flex-col items-center justify-center border-2 border-dashed border-white/10 rounded-2xl p-16 cursor-pointer hover:bg-white/5 transition-all group-hover:border-indigo-500/50">
                <div className="bg-indigo-500/10 p-6 rounded-full mb-6 group-hover:scale-110 transition-transform">
                  <svg className="w-10 h-10 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
                <p className="text-slate-200 text-lg font-bold">Deploy Media to Scanner</p>
                <p className="text-slate-500 mt-2">Maximum file size: 50MB</p>
                {selectedFile && (
                  <div className="mt-6 px-4 py-2 bg-indigo-600/20 text-indigo-400 rounded-lg font-mono text-sm border border-indigo-500/30">
                    {selectedFile.name}
                  </div>
                )}
              </label>
            </div>
          )}

          <div className="mt-10 flex justify-center">
            <button
              onClick={handleAnalyze}
              disabled={analyzing || (!inputText && !selectedFile)}
              className="group relative px-12 py-5 bg-indigo-600 text-white rounded-2xl font-black text-lg shadow-xl shadow-indigo-500/20 hover:bg-indigo-500 hover:scale-105 active:scale-95 transition-all disabled:opacity-30 disabled:pointer-events-none"
            >
              <span className="flex items-center gap-3">
                {analyzing ? (
                  <>
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Scanning for Anomalies...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Start Analysis
                  </>
                )}
              </span>
            </button>
          </div>
        </div>
      </div>

      {result && <AnalysisDashboard result={result} />}
    </div>
  );
};

export default MediaAnalyzer;
