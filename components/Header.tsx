
import React from 'react';

interface HeaderProps {
  onHome: () => void;
  onSelectTab: (tab: 'card' | 'info') => void;
  activeTab?: 'card' | 'info';
  hasResult: boolean;
}

const Header: React.FC<HeaderProps> = ({ onHome, onSelectTab, activeTab, hasResult }) => {
  return (
    <nav className="sticky top-0 z-50 glass-card px-8 md:px-16 py-4 flex items-center justify-between shadow-lg transition-all duration-300">
      <div className="flex items-center gap-4">
        {/* 브랜드 로고 및 텍스트 */}
        <div 
          className="flex items-center gap-3 cursor-pointer group shrink-0"
          onClick={onHome}
        >
          <div className="w-8 h-8 bg-gradient-to-tr from-blue-400 to-indigo-500 rounded-xl shadow-md group-hover:rotate-12 transition-transform duration-500"></div>
          <h1 className="text-xl font-bold tracking-tight text-slate-800 hidden sm:block">
            말씀에 <span className="heaven-gradient">영감</span>을 더하다
          </h1>
        </div>

        {/* 홈 버튼 (집 모양 아이콘) - 브랜드 우측 배치 */}
        <button 
          onClick={(e) => {
            e.preventDefault();
            onHome();
          }}
          className="p-2.5 rounded-xl bg-slate-50 text-slate-400 hover:bg-indigo-50 hover:text-indigo-600 transition-all duration-300 transform hover:scale-110 active:scale-95 border border-slate-100 shadow-sm"
          title="홈으로 돌아가기"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
          </svg>
        </button>
      </div>

      <div className="flex items-center gap-3 md:gap-6">
        <button 
          onClick={() => onSelectTab('card')}
          className={`px-5 py-2.5 rounded-xl text-base font-black transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center gap-2 ${
            activeTab === 'card' && hasResult
              ? 'bg-rose-500 text-white shadow-xl ring-4 ring-rose-100' 
              : 'text-rose-500 hover:bg-rose-50 bg-white shadow-sm border border-rose-50'
          }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          <span className="hidden sm:inline">전도용 요약카드</span>
          <span className="sm:hidden">카드</span>
        </button>
        <button 
          onClick={() => onSelectTab('info')}
          className={`px-5 py-2.5 rounded-xl text-base font-black transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center gap-2 ${
            activeTab === 'info' && hasResult
              ? 'bg-emerald-600 text-white shadow-xl ring-4 ring-emerald-100' 
              : 'text-emerald-600 hover:bg-emerald-50 bg-white shadow-sm border border-emerald-50'
          }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span className="hidden sm:inline">인포그래픽</span>
          <span className="sm:hidden">그래픽</span>
        </button>
      </div>
    </nav>
  );
};

export default Header;
