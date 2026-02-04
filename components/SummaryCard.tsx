
import React from 'react';
import { SummaryCardData } from '../types';

interface SummaryCardProps {
  data: SummaryCardData;
}

const SummaryCard: React.FC<SummaryCardProps> = ({ data }) => {
  const handleCopy = () => {
    const text = `
[${data.subject}]
날짜: ${data.date}

핵심 메시지:
${data.coreMessage.map(line => `• ${line}`).join('\n')}

성구:
${data.scripture}

실천 포인트:
${data.actionPoints.join('\n')}

${data.hashtags.join(' ')}
    `.trim();
    navigator.clipboard.writeText(text);
    alert('데이터가 클립보드에 복사되었습니다. ✨');
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="bg-white rounded-[2rem] shadow-2xl overflow-hidden max-w-sm mx-auto border border-white flex flex-col h-full transform transition-transform hover:rotate-1 printable-content">
        <div className="bg-gradient-to-br from-blue-400 via-indigo-400 to-purple-400 p-10 text-white relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-white/10 -skew-x-12 translate-x-[-100%] animate-[shimmer_5s_infinite]"></div>
          <p className="text-[10px] tracking-[0.2em] opacity-80 mb-2 uppercase font-bold">{data.date}</p>
          <h3 className="text-2xl font-bold leading-tight font-myeongjo mb-4">{data.subject}</h3>
          <div className="w-10 h-1 bg-white/40 rounded-full"></div>
        </div>
        
        <div className="p-10 flex-1 flex flex-col gap-8">
          <section>
            <div className="flex items-center gap-2 mb-4">
              <span className="w-6 h-[1px] bg-blue-300"></span>
              <h4 className="text-[10px] font-bold text-blue-400 tracking-[0.2em] uppercase">Core Wisdom</h4>
            </div>
            <div className="space-y-3">
              {data.coreMessage.map((msg, i) => (
                <p key={i} className="text-slate-600 text-sm leading-relaxed font-medium">
                  <span className="text-blue-300 mr-2">/</span> {msg}
                </p>
              ))}
            </div>
          </section>

          <section className="bg-slate-50/50 p-5 rounded-2xl border-l-2 border-indigo-200">
            <p className="text-xs text-slate-500 italic font-myeongjo leading-relaxed">
              "{data.scripture}"
            </p>
          </section>

          <section>
            <div className="flex items-center gap-2 mb-4">
              <span className="w-6 h-[1px] bg-indigo-300"></span>
              <h4 className="text-[10px] font-bold text-indigo-400 tracking-[0.2em] uppercase">Life Action</h4>
            </div>
            <div className="space-y-2">
              {data.actionPoints.map((p, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-400"></div>
                  <p className="text-slate-800 text-sm font-bold">{p}</p>
                </div>
              ))}
            </div>
          </section>

          <div className="mt-auto pt-6 flex flex-wrap gap-2 opacity-60">
            {data.hashtags.map((tag, i) => (
              <span key={i} className="text-[10px] text-slate-400 font-medium">{tag}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="flex gap-4 w-full max-w-sm print-hide">
        <button 
          onClick={handleCopy}
          className="w-full py-4 bg-slate-900 text-white text-sm font-bold rounded-2xl hover:bg-slate-800 transition-colors uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg"
        >
          데이터 복사하기
        </button>
      </div>

      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%) skewX(-12deg); }
          20% { transform: translateX(200%) skewX(-12deg); }
          100% { transform: translateX(200%) skewX(-12deg); }
        }
      `}</style>
    </div>
  );
};

export default SummaryCard;
