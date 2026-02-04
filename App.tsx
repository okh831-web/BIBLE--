
import React, { useState, useCallback } from 'react';
import Header from './components/Header.tsx';
import SummaryCard from './components/SummaryCard.tsx';
import InfographicView from './components/InfographicView.tsx';
import { generateSermonContent } from './geminiService.ts';
import { SermonOutput } from './types.ts';
import { parseFile } from './utils/fileParser.ts';

type AppStep = 'landing' | 'uploading' | 'results';

const App: React.FC = () => {
  const [step, setStep] = useState<AppStep>('landing');
  const [result, setResult] = useState<SermonOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'card' | 'info'>('card');

  const reset = useCallback(() => {
    setResult(null);
    setError(null);
    setActiveTab('card');
    setStep('landing');
    if (window.location.search) {
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setStep('uploading');

    try {
      const text = await parseFile(file);
      if (!text || !text.trim()) {
        throw new Error("파일에서 유효한 텍스트를 읽을 수 없습니다.");
      }
      
      const data = await generateSermonContent(text);
      if (!data) throw new Error("분석 데이터를 생성하지 못했습니다.");
      
      setResult(data);
      setStep('results');
    } catch (err: any) {
      console.error(err);
      setError(err.message || '처리 중 오류가 발생했습니다.');
      setStep('landing');
    } finally {
      if (e.target) e.target.value = '';
    }
  };

  const handleNavSelect = (tab: 'card' | 'info') => {
    if (!result) {
      setError("파일을 먼저 업로드해주세요.");
      setTimeout(() => setError(null), 3000);
      return;
    }
    setActiveTab(tab);
    setStep('results');
  };

  return (
    <div className={`min-h-screen relative flex flex-col transition-all duration-700 ${step === 'landing' ? 'landing-bg' : 'bg-slate-50'}`}>
      {step === 'landing' && <div className="absolute inset-0 overlay pointer-events-none"></div>}

      <Header 
        onHome={reset} 
        onSelectTab={handleNavSelect} 
        activeTab={activeTab} 
        hasResult={!!result}
      />

      <main className="relative z-10 flex-1 max-w-7xl mx-auto w-full px-6 pb-24">
        {step === 'landing' && (
          <div className="flex flex-col items-center justify-center min-h-[75vh] text-center animate-in fade-in zoom-in duration-1000 pt-20">
            <div className="mb-8 mt-16 inline-block bg-white/40 backdrop-blur-md px-8 py-3 rounded-full border border-white/50 shadow-sm animate-bounce">
              <span className="font-cursive text-4xl text-indigo-600 font-bold">Heavenly Paradise</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-10 tracking-tighter drop-shadow-2xl text-slate-900 leading-tight">
              말씀에 <span className="heaven-gradient">영감</span>을 더하다
            </h1>
            <p className="text-2xl text-slate-800 mb-12 max-w-4xl leading-relaxed font-bold">
              업로드한 말씀이 <span className="text-indigo-600 underline underline-offset-8">AI 디자인</span>을 만나<br/>
              가장 아름다운 전도용 카드로 태어납니다.
            </p>
            <div className="relative w-full flex flex-col items-center">
              <label className="cursor-pointer flex flex-col items-center justify-center w-full max-w-2xl h-72 bg-white/25 backdrop-blur-2xl rounded-[3rem] border-4 border-dashed border-white/70 hover:border-indigo-400 hover:bg-white/40 transition-all duration-500 transform hover:scale-[1.02] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] mx-auto group">
                <div className="p-6 bg-indigo-600 rounded-full mb-6 shadow-2xl group-hover:bg-indigo-700 transition-all duration-300 group-hover:scale-110">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
                <span className="text-3xl text-slate-900 font-black tracking-tight">말씀 파일 업로드</span>
                <span className="text-lg text-slate-600 mt-2 font-bold opacity-70">여기를 클릭하거나 파일을 끌어다 놓으세요</span>
                <span className="text-sm text-indigo-600 mt-1 font-medium bg-indigo-50/50 px-4 py-1 rounded-full border border-indigo-100/50">PDF, DOCX, TXT, HWP 지원</span>
                <input type="file" className="hidden" accept=".hwp,.pdf,.docx,.txt" onChange={handleFileUpload} />
              </label>
              
              <div className="mt-12 flex items-center justify-center gap-6 text-indigo-700 font-black text-xl bg-white/40 backdrop-blur-sm py-4 px-10 rounded-full border border-white/50 shadow-sm">
                <span>말씀 업로드</span>
                <span className="text-indigo-300 text-2xl">──▶</span>
                <span>AI 분석</span>
                <span className="text-indigo-300 text-2xl">──▶</span>
                <span>전도용 카드 생성</span>
              </div>

              {error && (
                <div className="mt-10 animate-in slide-in-from-top-4">
                  <p className="text-rose-600 text-xl font-black bg-rose-50 px-10 py-4 rounded-3xl shadow-2xl inline-block border-2 border-rose-100">
                    ⚠️ {error}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {step === 'uploading' && (
          <div className="flex flex-col items-center justify-center min-h-[75vh] animate-in fade-in duration-500">
            <div className="w-56 h-56 relative mb-16">
              <div className="absolute inset-0 border-[12px] border-indigo-100 rounded-full"></div>
              <div className="absolute inset-0 border-[12px] border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
              <div className="absolute inset-12 bg-gradient-to-tr from-indigo-400 to-purple-600 rounded-full animate-pulse shadow-[0_0_60px_rgba(79,70,229,0.5)]"></div>
            </div>
            <h2 className="text-5xl font-bold text-slate-900 mb-6 font-myeongjo tracking-tight text-center">말씀의 원본 제목과 핵심을 분석 중...</h2>
            <p className="text-2xl text-slate-500 text-center font-light">하늘의 지혜를 가장 충실하게 담아내고 있습니다.</p>
          </div>
        )}

        {step === 'results' && result && (
          <div className="animate-in fade-in slide-in-from-bottom-12 duration-1000 mt-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
              <div className="order-2 lg:order-1">
                {activeTab === 'card' ? (
                  <div className="animate-in fade-in slide-in-from-left-8">
                    <SummaryCard data={result.summaryCard} />
                  </div>
                ) : (
                  <div className="animate-in fade-in slide-in-from-left-8">
                    <InfographicView data={result.infographic} />
                  </div>
                )}
              </div>
              <div className="order-1 lg:order-2 lg:sticky lg:top-32 bg-white/90 p-12 rounded-[4rem] border-4 border-white shadow-xl backdrop-blur-3xl">
                <div className="mb-12">
                  <div className="flex items-center gap-4 mb-5">
                    <div className="w-12 h-[2px] bg-indigo-200"></div>
                    <span className="text-indigo-600 font-black text-xs tracking-[0.4em] uppercase">Sermon Insight</span>
                  </div>
                  <h4 className="text-4xl font-bold font-myeongjo text-slate-900 leading-tight mb-4">{result.summaryCard.subject}</h4>
                  <p className="text-slate-400 text-lg font-medium">{result.summaryCard.date}</p>
                </div>
                <div>
                  <h5 className="text-xs font-black text-slate-400 mb-6 uppercase tracking-[0.4em] flex items-center gap-3">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span> 핵심 진리 요약
                  </h5>
                  <ul className="space-y-6">
                    {result.summaryCard.coreMessage.map((m, i) => (
                      <li key={i} className="text-slate-700 text-xl flex items-start gap-4 group">
                        <span className="mt-2.5 w-2 h-2 rounded-full bg-blue-100 shrink-0 group-hover:bg-blue-500 transition-all"></span>
                        <span className="leading-snug font-bold">{m}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
