
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
      <div className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden max-w-sm mx-auto border border-white flex flex-col h-full transform transition-transform hover:scale-[1.01] printable-content">
        <div className="bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-12 text-white relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-white/10 -skew-x-12 translate-x-[-100%] animate-[shimmer_5s_infinite]"></div>
          <p className="text-[11px] tracking-[0.3em] opacity-80 mb-3 uppercase font-black">{data.date}</p>
          <h3 className="text-3xl font-bold leading-tight font-myeongjo mb-6 drop-shadow-lg">
            {data.subject}
          </h3>
          <div className="w-12 h-1.5 bg-white/40 rounded-full"></div>
        </div>
        
        <div className="p-10 flex-1 flex flex-col gap-10">
          <section>
            <div className="flex items-center gap-3 mb-5">
              <span className="w-8 h-[2px] bg-indigo-200"></span>
              <h4 className="text-xs font-black text-indigo-400 tracking-[0.3em] uppercase">Core Message</h4>
            </div>
            <div className="space-y-4">
              {data.coreMessage.map((msg, i) => (
                <div key={i} className="flex items-start gap-3 group">
                   <span className="text-indigo-300 font-bold mt-0.5">/</span>
                   <p className="text-slate-700 text-base leading-snug font-bold group-hover:text-indigo-600 transition-colors">
                     {msg}
                   </p>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-slate-50 p-6 rounded-[1.5rem] border-l-4 border-indigo-400 shadow-sm">
            <p className="text-sm text-slate-600 italic font-myeongjo leading-relaxed">
              "{data.scripture}"
            </p>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-5">
              <span className="w-8 h-[2px] bg-rose-200"></span>
              <h4 className="text-xs font-black text-rose-400 tracking-[0.3em] uppercase">Life Action</h4>
            </div>
            <div className="space-y-3">
              {data.actionPoints.map((p, i) => (
                <div key={i} className="flex items-center gap-3 bg-rose-50/30 p-2 rounded-xl border border-rose-100/50">
                  <div className="w-2 h-2 rounded-full bg-rose-400 shadow-sm"></div>
                  <p className="text-slate-800 text-sm font-black">{p}</p>
                </div>
              ))}
            </div>
          </section>

          <div className="mt-auto pt-6 flex flex-wrap gap-2 opacity-50">
            {data.hashtags.map((tag, i) => (
              <span key={i} className="text-[10px] text-slate-500 font-bold bg-slate-100 px-2 py-1 rounded-md">{tag}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="flex gap-4 w-full max-w-sm print-hide">
        <button 
          onClick={handleCopy}
          className="w-full py-5 bg-slate-900 text-white text-sm font-black rounded-2xl hover:bg-slate-800 transition-all active:scale-95 uppercase tracking-widest flex items-center justify-center gap-3 shadow-2xl"
        >
          카드 데이터 복사
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
