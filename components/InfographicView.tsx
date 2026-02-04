
import React from 'react';
import { InfographicData } from '../types';

interface InfographicViewProps {
  data: InfographicData;
}

const InfographicView: React.FC<InfographicViewProps> = ({ data }) => {
  const bgImage = "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1000&auto=format&fit=crop";

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="relative group rounded-[3rem] shadow-2xl overflow-hidden aspect-[4/5] max-w-md mx-auto flex flex-col text-white printable-content">
        <div className="absolute inset-0">
          <img src={bgImage} alt="Heavenly Background" className="w-full h-full object-cover scale-105 group-hover:scale-110 transition-transform duration-[15s] ease-out" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
          <div className="absolute inset-0 bg-blue-400/10 backdrop-blur-[0.5px]"></div>
        </div>

        <div className="relative z-10 p-10 flex flex-col h-full overflow-hidden">
          <div className="mb-6 flex-shrink-0">
            <div className="w-16 h-1 bg-amber-300 rounded-full mb-8 shadow-lg"></div>
            <h2 className="text-3xl font-bold font-myeongjo leading-tight drop-shadow-2xl">
              {data.title}
            </h2>
          </div>

          <div className="flex-grow flex items-center overflow-y-auto mb-6 pr-2">
            <p className="text-xl text-white/95 leading-relaxed font-light drop-shadow-xl font-myeongjo">
              {data.subtitle}
            </p>
          </div>

          <div className="mt-auto pt-6 border-t border-white/30 flex-shrink-0">
            <div className="flex gap-4 mb-4">
               <div className="w-[2px] h-auto bg-amber-200 shrink-0"></div>
               <p className="text-sm text-amber-50 font-myeongjo italic leading-relaxed drop-shadow-md">
                 {data.scripture}
               </p>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-[10px] text-white/60 tracking-[0.4em] uppercase font-black">
                정명석 선생 말씀 중에서
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* 공유하기 버튼 삭제됨 */}
      <div className="w-full max-w-md text-center py-4 bg-white/50 backdrop-blur-sm rounded-2xl border border-white/50 text-slate-500 text-sm font-medium">
        상단 메뉴의 홈 버튼을 눌러 새로운 말씀을 분석할 수 있습니다.
      </div>
    </div>
  );
};

export default InfographicView;
