
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import SummaryCard from './components/SummaryCard';
import InfographicView from './components/InfographicView';
import { generateSermonContent } from './geminiService';
import { SermonOutput } from './types';
import { parseFile } from './utils/fileParser';

type AppStep = 'landing' | 'uploading' | 'results';

const App: React.FC = () => {
  const [step, setStep] = useState<AppStep>('landing');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SermonOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'card' | 'info'>('card');

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setError(null);
    setStep('uploading');

    try {
      const text = await parseFile(file);
      if (!text.trim()) throw new Error("파일에서 텍스트를 추출할 수 없습니다.");
      
      const data = await generateSermonContent(text);
      setResult(data);
      setStep('results');
    } catch (err) {
      console.error(err);
      setError('파일을 분석하는 중 오류가 발생했습니다. (PDF, DOCX 지원)');
      setStep('landing');
    } finally {
      setLoading(false);
      if (e.target) e.target.value = '';
    }
  };

  const reset = () => {
    // 모든 상태를 초기값으로 강제 설정하여 첫 화면으로 복귀
    setResult(null);
    setError(null);
    setActiveTab('card');
    setStep('landing');
    
    // URL에 파라미터가 있는 경우 제거
    if (window.location.search) {
      window.history.replaceState({}, '', window.location.pathname);
    }
  };

  const handleNavSelect = (tab: 'card' | 'info') => {
    if (!result) {
      setError("먼저 파일을 업로드하여 말씀 결과물을 생성해 주세요.");
      setTimeout(() => setError(null), 3000);
      return;
    }
    setActiveTab(tab);
    setStep('results');
  };

  return (
    <div className={`min-h-screen relative flex flex-col ${step === 'landing' ? 'landing-bg' : 'bg-slate-50'}`}>
      {/* Landing Overlay */}
      {step === 'landing' && <div className="absolute inset-0 overlay pointer-events-none"></div>}

      <Header 
        onHome={reset} 
        onSelectTab={handleNavSelect} 
        activeTab={activeTab} 
        hasResult={!!result}
      />

      <div className="relative z-10 flex-1 max-w-7xl mx-auto w-full px-6 pb-24">
        {step === 'landing' && (
          <div className="flex flex-col items-center justify-center min-h-[70vh] text-center animate-in fade-in zoom-in duration-1000 pt-20">
            <div className="mb-8 mt-16 inline-block bg-white/40 backdrop-blur-md px-8 py-3 rounded-full border border-white/50 shadow-sm animate-bounce">
              <span className="font-cursive text-4xl text-indigo-600 font-bold">Heavenly Paradise</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-10 tracking-tighter drop-shadow-2xl text-slate-900 leading-tight">
              말씀에 <span className="heaven-gradient">영감</span>을 더하다
            </h1>
            
            <p className="text-2xl text-slate-800 mb-12 max-w-4xl leading-relaxed drop-shadow-md font-bold">
              업로드한 말씀이 <span className="text-indigo-600 underline underline-offset-8">AI 디자인</span>을 만나<br/>
              전도와 묵상을 위한 가장 아름다운 형태로 태어납니다.
            </p>
            
            <div className="relative group">
              <label className="cursor-pointer flex flex-col items-center justify-center w-full max-w-[380px] h-48 bg-white/25 backdrop-blur-2xl rounded-[2.5rem] border-4 border-dashed border-white/70 hover:border-indigo-400 hover:bg-white/40 transition-all duration-500 transform hover:scale-105 active:scale-95 shadow-[0_30px_50px_-15px_rgba(0,0,0,0.2)] mx-auto">
                <div className="p-4 bg-indigo-600 rounded-full mb-3 shadow-2xl group-hover:bg-indigo-700 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
                <span className="text-xl text-slate-900 font-black tracking-tight">말씀 파일 업로드</span>
                <span className="text-xs text-slate-600 mt-1 font-bold opacity-70">PDF, DOCX, HWP 가능</span>
                <input type="file" className="hidden" accept=".hwp,.pdf,.docx,.txt" onChange={handleFileUpload} />
              </label>

              <div className="mt-8 flex items-center justify-center gap-4 text-indigo-700 font-black text-lg bg-white/40 backdrop-blur-sm py-3 px-8 rounded-full border border-white/50 shadow-sm w-max mx-auto">
                <span>말씀 업로드</span>
                <span className="text-indigo-400">──▶</span>
                <span>AI 분석</span>
                <span className="text-indigo-400">──▶</span>
                <span>전도용 카드 생성</span>
              </div>
              
              {error && (
                <div className="absolute -bottom-28 left-0 right-0 animate-in slide-in-from-top-4">
                  <p className="text-rose-600 text-xl font-black bg-rose-50 px-10 py-4 rounded-3xl shadow-2xl inline-block border-2 border-rose-100">
                    ⚠️ {error}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {step === 'uploading' && (
          <div className="flex flex-col items-center justify-center min-h-[70vh] animate-in fade-in duration-500">
            <div className="w-48 h-48 relative mb-16">
              <div className="absolute inset-0 border-[10px] border-indigo-100 rounded-full"></div>
              <div className="absolute inset-0 border-[10px] border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
              <div className="absolute inset-10 bg-gradient-to-tr from-indigo-400 to-purple-600 rounded-full animate-pulse shadow-[0_0_50px_rgba(79,70,229,0.5)]"></div>
            </div>
            <h2 className="text-5xl font-bold text-slate-900 mb-6 font-myeongjo tracking-tight">영의 지혜를 모으는 중...</h2>
            <p className="text-2xl text-slate-500 text-center font-light max-w-2xl">하늘의 진주 같은 말씀을 정성스럽게 빚어내고 있습니다.</p>
          </div>
        )}

        {step === 'results' && result && (
          <div className="animate-in fade-in slide-in-from-bottom-12 duration-1000 mt-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-start">
              <div className="order-2 lg:order-1">
                {activeTab === 'card' ? (
                  <div className="animate-in fade-in slide-in-from-left-12 duration-700">
                    <div className="mb-14 text-center lg:text-left">
                      <span className="px-6 py-2 bg-rose-100 text-rose-600 rounded-full text-lg font-black mb-6 inline-block shadow-sm">EVANGELISM CORE CARD</span>
                      <h3 className="text-5xl font-bold mb-6 text-slate-900 tracking-tight">전도용 요약 카드</h3>
                      <p className="text-xl text-slate-500 leading-relaxed max-w-xl">영혼을 깨우는 핵심 메시지를 한눈에!<br/>감각적인 디자인으로 말씀을 더욱 가깝게 전달하세요.</p>
                    </div>
                    <SummaryCard data={result.summaryCard} />
                  </div>
                ) : (
                  <div className="animate-in fade-in slide-in-from-left-12 duration-700">
                    <div className="mb-14 text-center lg:text-left">
                      <span className="px-6 py-2 bg-emerald-100 text-emerald-700 rounded-full text-lg font-black mb-6 inline-block shadow-sm">MEDITATION INFOGRAPHIC</span>
                      <h3 className="text-5xl font-bold mb-6 text-slate-900 tracking-tight">묵상 인포그래픽</h3>
                      <p className="text-xl text-slate-500 leading-relaxed max-w-xl">깊은 기도의 시간, 영감을 더해주는<br/>아름다운 인포그래픽이 당신의 묵상을 풍성하게 합니다.</p>
                    </div>
                    <InfographicView data={result.infographic} />
                  </div>
                )}
              </div>

              <div className="order-1 lg:order-2 lg:sticky lg:top-32 bg-white/90 p-16 rounded-[5rem] border-4 border-white shadow-[0_50px_100px_rgba(0,0,0,0.1)] backdrop-blur-3xl transform hover:-translate-y-2 transition-transform duration-500">
                <div className="mb-16">
                  <div className="flex items-center gap-5 mb-6">
                    <div className="w-16 h-[2px] bg-indigo-200"></div>
                    <span className="text-indigo-600 font-black text-sm tracking-[0.4em] uppercase">Holy Insight</span>
                  </div>
                  <h4 className="text-5xl font-bold font-myeongjo text-slate-900 leading-tight mb-4">{result.summaryCard.subject}</h4>
                  <p className="text-slate-400 text-xl font-medium">{result.summaryCard.date}</p>
                </div>

                <div className="space-y-16">
                  <div>
                    <h5 className="text-sm font-black text-slate-400 mb-8 uppercase tracking-[0.4em] flex items-center gap-4">
                      <span className="w-3 h-3 rounded-full bg-blue-500 shadow-lg shadow-blue-200"></span> 핵심 진리
                    </h5>
                    <ul className="space-y-8">
                      {result.summaryCard.coreMessage.map((m, i) => (
                        <li key={i} className="text-slate-700 text-2xl flex items-start gap-6 group">
                          <span className="mt-3 w-3 h-3 rounded-full bg-blue-100 shrink-0 group-hover:bg-blue-500 transition-all duration-300"></span>
                          <span className="leading-snug font-bold">{m}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
