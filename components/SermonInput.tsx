
import React from 'react';

interface SermonInputProps {
  value: string;
  onChange: (val: string) => void;
  onSubmit: () => void;
  loading: boolean;
}

const SermonInput: React.FC<SermonInputProps> = ({ value, onChange, onSubmit, loading }) => {
  return (
    <div className="w-full max-w-3xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-12">
      <div className="p-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">말씀 텍스트 입력</label>
        <textarea
          className="w-full h-64 p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-gray-700 resize-none"
          placeholder="여기에 주일말씀 본문 전체를 붙여넣거나 OCR 결과를 입력하세요..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        <div className="mt-4 flex justify-end">
          <button
            onClick={onSubmit}
            disabled={loading || !value.trim()}
            className={`px-8 py-3 rounded-xl font-bold transition-all ${
              loading || !value.trim()
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg active:scale-95'
            }`}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                분석 중...
              </span>
            ) : '디자인 생성하기'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SermonInput;
