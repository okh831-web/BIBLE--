
import React from 'react';
import { InfographicData } from '../types.ts';

interface InfographicViewProps {
  data: InfographicData;
}

const InfographicView: React.FC<InfographicViewProps> = ({ data }) => {
  const bgImage = "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1000&auto=format&fit=crop";

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="relative group rounded-[3.5rem] shadow-2xl overflow-hidden aspect-[4/5] max-w-md mx-auto flex flex-col text-white printable-content border-8 border-white">
        <div className="absolute inset-0">
          <img src={bgImage} alt="Heavenly Background" className="w-full h-full object-cover scale-105 group-hover:scale-110 transition-transform duration-[20s] ease-out" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
          <div className="absolute inset-0 bg-indigo-900/10 backdrop-blur-[0.5px]"></div>
        </div>

        <div className="relative z-10 p-12 flex flex-col h-full">
          <div className="mb-10 flex-shrink-0">
            <div className="w-20 h-1.5 bg-amber-400 rounded-full mb-8 shadow-xl"></div>
            <h2 className="text-4xl font-bold font-myeongjo leading-tight drop-shadow-[0_5px_15px_rgba(0,0,0,0.5)]">
              {data.title}
            </h2>
          </div>

          <div className="flex-grow flex items-center mb-8">
            <p className="text-2xl text-white/95 leading-relaxed font-bold drop-shadow-lg font-myeongjo border-l-2 border-white/20 pl-6">
              {data.subtitle}
            </p>
          </div>

          <div className="mt-auto pt-8 border-t border-white/20 flex-shrink-0">
            <div className="flex gap-4 mb-6">
               <div className="w-[3px] h-auto bg-amber-300 shrink-0 shadow-sm"></div>
               <p className="text-base text-amber-50 font-myeongjo italic leading-relaxed drop-shadow-md">
                 {data.scripture}
               </p>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-xs text-white/50 tracking-[0.4em] uppercase font-black">
                정명석 선생 말씀 중에서
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="w-full max-w-md text-center py-5 bg-white/60 backdrop-blur-md rounded-2xl border border-white shadow-sm text-slate-500 text-sm font-black">
        상단 메뉴의 홈 버튼을 눌러 새로운 말씀을 분석할 수 있습니다.
      </div>
    </div>
  );
};

export default InfographicView;
