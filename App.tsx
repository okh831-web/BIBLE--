
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
      console.error("Analysis Error:", err);
      // 배포 환경에서 API Key 에러를 명확히 안내하기 위해 에러 메시지 보강
      const msg = err.message || '';
      if (msg.includes('API key')) {
        setError('API Key가 설정되지 않았습니다. 관리자 설정을 확인해주세요.');
      } else {
        setError(msg || '처리 중 오류가 발생했습니다.');
      }
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
          <div className="flex flex-col items-center justify-center min-h-[70vh] text-center animate-in fade-in zoom-in duration-1000 pt-8">
            <div className="mb-6 mt-4 inline-block bg-white/40 backdrop-blur-md px-6 py-2 rounded-full border border-white/50 shadow-sm animate-bounce">
              <span className="font-cursive text-3xl text-indigo-600 font-bold">Heavenly Paradise</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tighter drop-shadow-2xl text-slate-900 leading-tight">
              말씀에 <span className="heaven-gradient">영감</span>을 더하다
            </h1>
            <p className="text-xl md:text-2xl text-slate-800 mb-10 max-w-3xl leading-relaxed font-bold">
              업로드한 말씀이 <span className="text-indigo-600 underline underline-offset-8">AI 디자인</span>을 만나<br/>
              가장 아름다운 전도용 카드로 태어납니다.
            </p>
            
            <div className="relative w-full flex flex-col items-center">
              <label className="cursor-pointer flex flex-col items-center justify-center w-full max-w-sm h-44 bg-white/25 backdrop-blur-3xl rounded-[2.5rem] border-4 border-dashed border-white/70 hover:border-indigo-400 hover:bg-white/40 transition-all duration-500 transform hover:scale-[1.02] shadow-[0_20px_40px_-10px_rgba(0,0,0,0.2)] mx-auto group">
                <div className="p-3 bg-indigo-600 rounded-full mb-3 shadow-lg group-hover:bg-indigo-700 transition-all duration-300 group-hover:scale-110">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
                <span className="text-lg text-slate-900 font-black tracking-tight">말씀 파일 업로드</span>
                <span className="text-xs text-slate-600 mt-1 font-bold opacity-70">클릭하거나 파일을 끌어다 놓으세요</span>
                <input type="file" className="hidden" accept=".pdf,.docx,.txt" onChange={handleFileUpload} />
              </label>
              
              {/* 프로세스 바: 문구 수정 및 글자 크기 대폭 확대 */}
              <div className="mt-12 flex items-center justify-center gap-10 text-indigo-900 font-black text-2xl bg-white/70 backdrop-blur-xl py-6 px-14 rounded-[3rem] border-2 border-white shadow-2xl">
                <div className="flex flex-col items-center gap-2">
                  <span className="bg-indigo-100 text-indigo-600 w-8 h-8 rounded-full flex items-center justify-center text-sm mb-1">1</span>
                  <span className="drop-shadow-sm">파일 업로드</span>
                </div>
                <span className="text-indigo-200 text-4xl mb-6">▶</span>
                <div className="flex flex-col items-center gap-2">
                  <span className="bg-indigo-100 text-indigo-600 w-8 h-8 rounded-full flex items-center justify-center text-sm mb-1">2</span>
                  <span className="drop-shadow-sm">AI 말씀 분석</span>
                </div>
                <span className="text-indigo-200 text-4xl mb-6">▶</span>
                <div className="flex flex-col items-center gap-2">
                  <span className="bg-indigo-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm mb-1 shadow-md">3</span>
                  <span className="text-indigo-600 drop-shadow-sm">요약카드 생성</span>
                </div>
              </div>

              {error && (
                <div className="mt-8 animate-in slide-in-from-top-4">
                  <p className="text-rose-600 text-base font-black bg-rose-50 px-8 py-3.5 rounded-[1.5rem] shadow-xl inline-block border-2 border-rose-100">
                    ⚠️ {error}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {step === 'uploading' && (
          <div className="flex flex-col items-center justify-center min-h-[70vh] animate-in fade-in duration-500">
            <div className="w-36 h-36 relative mb-10">
              <div className="absolute inset-0 border-[8px] border-indigo-100 rounded-full"></div>
              <div className="absolute inset-0 border-[8px] border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
              <div className="absolute inset-8 bg-gradient-to-tr from-indigo-400 to-purple-600 rounded-full animate-pulse shadow-[0_0_40px_rgba(79,70,229,0.3)]"></div>
            </div>
            <h2 className="text-3xl font-bold text-slate-900 mb-3 font-myeongjo tracking-tight text-center">말씀의 핵심을 분석 중...</h2>
            <p className="text-lg text-slate-500 text-center font-light">하늘의 지혜를 카드에 담아내고 있습니다.</p>
          </div>
        )}

        {step === 'results' && result && (
          <div className="animate-in fade-in slide-in-from-bottom-12 duration-1000 mt-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
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
              <div className="order-1 lg:order-2 lg:sticky lg:top-32 bg-white/90 p-10 rounded-[3rem] border-4 border-white shadow-xl backdrop-blur-3xl">
                <div className="mb-8 text-center lg:text-left">
                  <div className="flex items-center gap-4 mb-3 justify-center lg:justify-start">
                    <div className="w-8 h-[2px] bg-indigo-200"></div>
                    <span className="text-indigo-600 font-black text-[9px] tracking-[0.4em] uppercase">Sermon Insight</span>
                  </div>
                  <h4 className="text-2xl font-bold font-myeongjo text-slate-900 leading-tight mb-2">{result.summaryCard.subject}</h4>
                  <p className="text-slate-400 text-sm font-medium">{result.summaryCard.date}</p>
                </div>
                <div>
                  <h5 className="text-[9px] font-black text-slate-400 mb-5 uppercase tracking-[0.4em] flex items-center gap-3 justify-center lg:justify-start">
                    <span className="w-2 h-2 rounded-full bg-blue-500"></span> 핵심 요약
                  </h5>
                  <ul className="space-y-4">
                    {result.summaryCard.coreMessage.map((m, i) => (
                      <li key={i} className="text-slate-700 text-base flex items-start gap-3 group">
                        <span className="mt-2 w-1.5 h-1.5 rounded-full bg-blue-100 shrink-0 group-hover:bg-blue-500 transition-all"></span>
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
